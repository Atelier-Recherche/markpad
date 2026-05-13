import { URL } from "node:url";
import type { WebSocket, WebSocketServer } from "ws";
import type Database from "better-sqlite3";
import {
  getChatRetentionHours,
  insertRoomChatMessage,
  pruneRoomChatMessagesOlderThan,
  type ChatMessageRow
} from "../db/sqlite.js";
import type { SessionStore } from "../sessionStore.js";

type ChatRoom = {
  sockets: Set<WebSocket>;
};

export class MarkpadChatServer {
  private readonly rooms = new Map<string, ChatRoom>();

  public constructor(
    private readonly sessions: SessionStore,
    private readonly db: Database.Database
  ) {}

  public start(wss: WebSocketServer): void {
    wss.on("connection", (ws, req) => {
      const url = new URL(req.url ?? "", "http://localhost");
      const path = url.pathname;
      if (!path.startsWith("/ws/chat/")) return;

      const segments = path.split("/").filter(Boolean);
      const roomId = segments[2];
      const userId = url.searchParams.get("userId") ?? "";
      const password = url.searchParams.get("password") ?? "";
      const displayName = url.searchParams.get("name") ?? "";

      if (!roomId || !userId) {
        ws.close();
        return;
      }

      void this.attach(ws, roomId, password, userId, displayName);
    });
  }

  private async attach(
    ws: WebSocket,
    roomId: string,
    password: string,
    senderClientId: string,
    displayName: string
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

    let room = this.rooms.get(roomId);
    if (!room) {
      room = { sockets: new Set() };
      this.rooms.set(roomId, room);
    }
    room.sockets.add(ws);

    const sendJson = (payload: unknown): void => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(payload));
      }
    };

    sendJson({ type: "ready", roomId });

    ws.on("message", (raw) => {
      const text =
        typeof raw === "string" ? raw : Buffer.from(raw as ArrayBuffer).toString("utf8");
      let parsed: { type?: string; body?: unknown; displayName?: unknown };
      try {
        parsed = JSON.parse(text) as { type?: string; body?: unknown; displayName?: unknown };
      } catch {
        return;
      }
      if (parsed.type !== "chat" || typeof parsed.body !== "string") return;

      const body = parsed.body.trim().slice(0, 4000);
      if (!body) return;

      const retention = getChatRetentionHours(this.db);
      pruneRoomChatMessagesOlderThan(this.db, retention);

      const msgDisplay =
        typeof parsed.displayName === "string"
          ? parsed.displayName.trim().slice(0, 200)
          : "";
      const name =
        msgDisplay ||
        displayName.trim().slice(0, 200) ||
        `Invité · ${senderClientId.replace(/^web-/, "").slice(0, 12)}`;

      let row: ChatMessageRow;
      try {
        row = insertRoomChatMessage(this.db, {
          room_id: roomId,
          sender_client_id: senderClientId,
          sender_display_name: name,
          body
        });
      } catch (err) {
        console.error("Markpad: chat insert failed", err);
        return;
      }

      const broadcast = {
        type: "chat" as const,
        id: row.id,
        roomId,
        senderClientId,
        senderDisplayName: row.sender_display_name,
        body: row.body,
        createdAt: row.created_at
      };

      const payload = JSON.stringify(broadcast);
      const r = this.rooms.get(roomId);
      if (!r) return;
      for (const sock of r.sockets) {
        if (sock.readyState === sock.OPEN) sock.send(payload);
      }
    });

    ws.on("close", () => {
      const r = this.rooms.get(roomId);
      if (!r) return;
      r.sockets.delete(ws);
      if (r.sockets.size === 0) this.rooms.delete(roomId);
    });
  }
}
