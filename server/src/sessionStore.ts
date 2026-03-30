import { randomUUID } from "node:crypto";
import { Redis } from "ioredis";

export type SessionKind = "note" | "folder";

export interface SessionRecord {
  roomId: string;
  noteId: string;
  ownerUserId: string;
  createdAt: string;
  roomPassword?: string;
  kind: SessionKind;
  folderPath?: string;
  /** Chemins relatifs au vault (JSON). */
  filePaths?: string[];
  lastActivityAt: string;
}

const sessionKey = (roomId: string): string => `markpad:session:${roomId}`;
const noteRoomKey = (noteId: string): string => `markpad:note-room:${noteId}`;
const ROOM_ACTIVITY_ZSET = "markpad:room-activity";

export class SessionStore {
  public constructor(private readonly redis: Redis) {}

  public async createSession(payload: {
    noteId: string;
    ownerUserId: string;
    roomPassword?: string;
    kind?: SessionKind;
    folderPath?: string;
    filePaths?: string[];
  }): Promise<SessionRecord> {
    const roomId = randomUUID();
    const now = new Date().toISOString();
    const kind: SessionKind = payload.kind ?? "note";
    const filePathsJson =
      kind === "folder" && payload.filePaths?.length
        ? JSON.stringify(payload.filePaths)
        : "";

    const record: SessionRecord = {
      roomId,
      noteId: payload.noteId,
      ownerUserId: payload.ownerUserId,
      createdAt: now,
      roomPassword: payload.roomPassword,
      kind,
      folderPath: kind === "folder" ? payload.folderPath ?? payload.noteId : undefined,
      filePaths: kind === "folder" ? payload.filePaths : undefined,
      lastActivityAt: now
    };

    await this.redis.hset(sessionKey(roomId), {
      roomId: record.roomId,
      noteId: record.noteId,
      ownerUserId: record.ownerUserId,
      createdAt: record.createdAt,
      roomPassword: record.roomPassword ?? "",
      kind,
      folderPath: record.folderPath ?? "",
      filePathsJson,
      lastActivityAt: record.lastActivityAt
    });
    await this.redis.set(noteRoomKey(payload.noteId), roomId);
    await this.touchRoomActivity(roomId);
    return record;
  }

  public async getSession(roomId: string): Promise<SessionRecord | null> {
    const raw = await this.redis.hgetall(sessionKey(roomId));
    if (!raw.roomId) {
      return null;
    }

    const kind = (raw.kind as SessionKind) || "note";
    let filePaths: string[] | undefined;
    if (raw.filePathsJson) {
      try {
        filePaths = JSON.parse(raw.filePathsJson) as string[];
      } catch {
        filePaths = [];
      }
    }

    return {
      roomId: raw.roomId,
      noteId: raw.noteId,
      ownerUserId: raw.ownerUserId,
      createdAt: raw.createdAt,
      roomPassword: raw.roomPassword || undefined,
      kind,
      folderPath: raw.folderPath || undefined,
      filePaths,
      lastActivityAt: raw.lastActivityAt || raw.createdAt
    };
  }

  public async deleteSession(roomId: string): Promise<SessionRecord | null> {
    const existing = await this.getSession(roomId);
    if (!existing) {
      return null;
    }
    await this.redis.del(sessionKey(roomId));
    await this.redis.del(noteRoomKey(existing.noteId));
    await this.redis.zrem(ROOM_ACTIVITY_ZSET, roomId);
    return existing;
  }

  /** Met à jour l’activité (expiration idle) et le score Redis. */
  public async touchActivity(roomId: string): Promise<void> {
    const key = sessionKey(roomId);
    const exists = await this.redis.exists(key);
    if (!exists) return;
    const now = new Date().toISOString();
    await this.redis.hset(key, "lastActivityAt", now);
    await this.touchRoomActivity(roomId);
  }

  private async touchRoomActivity(roomId: string): Promise<void> {
    await this.redis.zadd(ROOM_ACTIVITY_ZSET, Date.now(), roomId);
  }

  /** RoomIds dont l’activité est plus ancienne que `beforeMs` (timestamp). */
  public async findStaleRooms(beforeMs: number): Promise<string[]> {
    return this.redis.zrangebyscore(ROOM_ACTIVITY_ZSET, 0, beforeMs);
  }

  public async removeFromActivityIndex(roomId: string): Promise<void> {
    await this.redis.zrem(ROOM_ACTIVITY_ZSET, roomId);
  }

  /** Remplit le ZSET d’activité pour les sessions créées avant cette version. */
  public async backfillActivityIndex(): Promise<void> {
    let cursor = "0";
    do {
      const [next, keys] = await this.redis.scan(
        cursor,
        "MATCH",
        "markpad:session:*",
        "COUNT",
        200
      );
      cursor = next;
      for (const key of keys) {
        const roomId = key.replace("markpad:session:", "");
        const score = await this.redis.zscore(ROOM_ACTIVITY_ZSET, roomId);
        if (score != null) continue;
        const raw = await this.redis.hgetall(key);
        const t = raw.lastActivityAt
          ? new Date(raw.lastActivityAt).getTime()
          : raw.createdAt
            ? new Date(raw.createdAt).getTime()
            : Date.now();
        await this.redis.zadd(ROOM_ACTIVITY_ZSET, t, roomId);
      }
    } while (cursor !== "0");
  }
}
