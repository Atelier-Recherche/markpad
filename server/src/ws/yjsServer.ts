import { URL } from "node:url";
import * as Y from "yjs";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import type { WebSocket, WebSocketServer } from "ws";
import { RedisDocStore } from "../persistence/redisDocStore.js";
import { SessionStore } from "../sessionStore.js";

const TOUCH_THROTTLE_MS = 60_000;

type RoomRuntime = {
  doc: Y.Doc;
  awareness: awarenessProtocol.Awareness;
  clients: Set<WebSocket>;
  awarenessClientsBySocket: Map<WebSocket, Set<number>>;
  loaded: boolean;
};
type AwarenessUpdatePayload = {
  added: number[];
  updated: number[];
  removed: number[];
};

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const MESSAGE_AUTH = 2;
const MESSAGE_QUERY_AWARENESS = 3;

export class MarkpadYjsServer {
  private readonly rooms = new Map<string, RoomRuntime>();
  private readonly lastTouchThrottle = new Map<string, number>();

  public constructor(
    private readonly wss: WebSocketServer,
    private readonly docs: RedisDocStore,
    private readonly sessions: SessionStore
  ) {}

  public start(): void {
    this.wss.on("connection", (ws, req) => {
      const currentUrl = new URL(req.url ?? "", "http://localhost");
      if (!currentUrl.pathname.startsWith("/ws/")) {
        ws.close();
        return;
      }
      const roomId = currentUrl.pathname.split("/").filter(Boolean).at(-1);
      const userId = currentUrl.searchParams.get("userId");
      const password = currentUrl.searchParams.get("password") ?? "";
      if (!roomId || !userId) {
        ws.close();
        return;
      }

      void this.attach(roomId, password, ws);
    });
  }

  private maybeTouchActivity(roomId: string): void {
    const now = Date.now();
    const prev = this.lastTouchThrottle.get(roomId) ?? 0;
    if (now - prev < TOUCH_THROTTLE_MS) return;
    this.lastTouchThrottle.set(roomId, now);
    void this.sessions.touchActivity(roomId);
  }

  private async attach(
    roomId: string,
    password: string,
    ws: WebSocket
  ): Promise<void> {
    const session = await this.sessions.getSession(roomId);
    if (!session) {
      ws.close();
      return;
    }
    if ((session.roomPassword ?? "") !== password) {
      ws.close();
      return;
    }

    let runtime = this.rooms.get(roomId);
    if (!runtime) {
      const doc = new Y.Doc();
      runtime = {
        doc,
        awareness: new awarenessProtocol.Awareness(doc),
        clients: new Set(),
        awarenessClientsBySocket: new Map(),
        loaded: false
      };
      const createdRoom = runtime;
      createdRoom.awareness.on("update", ({ added, updated, removed }: AwarenessUpdatePayload, origin: unknown) => {
        const changedClients = added.concat(updated, removed);
        if (origin && createdRoom.awarenessClientsBySocket.has(origin as WebSocket)) {
          const controlled = createdRoom.awarenessClientsBySocket.get(origin as WebSocket)!;
          for (const id of changedClients) {
            controlled.add(id);
          }
        }

        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(
          encoder,
          awarenessProtocol.encodeAwarenessUpdate(createdRoom.awareness, changedClients)
        );
        this.broadcastBinary(createdRoom, encoding.toUint8Array(encoder));
      });
      createdRoom.doc.on("update", (update: Uint8Array, origin: unknown) => {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        syncProtocol.writeUpdate(encoder, update);
        this.broadcastBinary(
          createdRoom,
          encoding.toUint8Array(encoder),
          origin instanceof Object ? (origin as WebSocket) : undefined
        );
      });

      this.rooms.set(roomId, createdRoom);
    }
    const room = runtime;

    if (!room.loaded) {
      const state = await this.docs.load(roomId);
      if (state) {
        Y.applyUpdate(room.doc, state);
      }
      room.loaded = true;
    }

    room.clients.add(ws);
    room.awarenessClientsBySocket.set(ws, new Set());
    this.maybeTouchActivity(roomId);

    ws.on("message", (raw) => {
      const rawBytes =
        typeof raw === "string"
          ? Uint8Array.from(Buffer.from(raw))
          : new Uint8Array(raw as ArrayBuffer);

      const decoder = decoding.createDecoder(rawBytes);
      const messageType = decoding.readVarUint(decoder);

      switch (messageType) {
        case MESSAGE_SYNC: {
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, MESSAGE_SYNC);
          syncProtocol.readSyncMessage(
            decoder,
            encoder,
            room.doc,
            ws,
            () => void 0
          );
          if (encoding.length(encoder) > 1) {
            ws.send(encoding.toUint8Array(encoder));
          }
          void this.docs.save(roomId, room.doc);
          this.maybeTouchActivity(roomId);
          break;
        }
        case MESSAGE_AWARENESS: {
          const update = decoding.readVarUint8Array(decoder);
          awarenessProtocol.applyAwarenessUpdate(room.awareness, update, ws);
          break;
        }
        case MESSAGE_QUERY_AWARENESS: {
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
          encoding.writeVarUint8Array(
            encoder,
            awarenessProtocol.encodeAwarenessUpdate(
              room.awareness,
              Array.from(room.awareness.getStates().keys())
            )
          );
          ws.send(encoding.toUint8Array(encoder));
          break;
        }
        case MESSAGE_AUTH:
        default:
          break;
      }
    });

    ws.on("close", () => {
      room.clients.delete(ws);
      const controlled = room.awarenessClientsBySocket.get(ws);
      room.awarenessClientsBySocket.delete(ws);
      if (controlled && controlled.size > 0) {
        awarenessProtocol.removeAwarenessStates(
          room.awareness,
          Array.from(controlled.values()),
          ws
        );
      }
      if (room.clients.size === 0) {
        void this.docs.save(roomId, room.doc);
      }
    });

    const syncStep1 = encoding.createEncoder();
    encoding.writeVarUint(syncStep1, MESSAGE_SYNC);
    syncProtocol.writeSyncStep1(syncStep1, room.doc);
    ws.send(encoding.toUint8Array(syncStep1));

    const awarenessQuery = encoding.createEncoder();
    encoding.writeVarUint(awarenessQuery, MESSAGE_QUERY_AWARENESS);
    ws.send(encoding.toUint8Array(awarenessQuery));

  }

  private broadcastBinary(
    runtime: RoomRuntime,
    payload: Uint8Array,
    except?: WebSocket
  ): void {
    for (const ws of runtime.clients) {
      if (ws !== except && ws.readyState === ws.OPEN) {
        ws.send(payload);
      }
    }
  }
}
