import { randomUUID } from "node:crypto";
import { Redis } from "ioredis";

export interface SessionRecord {
  roomId: string;
  noteId: string;
  ownerUserId: string;
  createdAt: string;
  roomPassword?: string;
}

const sessionKey = (roomId: string): string => `markpad:session:${roomId}`;
const noteRoomKey = (noteId: string): string => `markpad:note-room:${noteId}`;

export class SessionStore {
  public constructor(private readonly redis: Redis) {}

  public async createSession(payload: {
    noteId: string;
    ownerUserId: string;
    roomPassword?: string;
  }): Promise<SessionRecord> {
    const roomId = randomUUID();
    const record: SessionRecord = {
      roomId,
      noteId: payload.noteId,
      ownerUserId: payload.ownerUserId,
      createdAt: new Date().toISOString(),
      roomPassword: payload.roomPassword
    };

    await this.redis.hset(sessionKey(roomId), {
      roomId: record.roomId,
      noteId: record.noteId,
      ownerUserId: record.ownerUserId,
      createdAt: record.createdAt,
      roomPassword: record.roomPassword ?? ""
    });
    await this.redis.set(noteRoomKey(payload.noteId), roomId);
    return record;
  }

  public async getSession(roomId: string): Promise<SessionRecord | null> {
    const raw = await this.redis.hgetall(sessionKey(roomId));
    if (!raw.roomId) {
      return null;
    }

    return {
      roomId: raw.roomId,
      noteId: raw.noteId,
      ownerUserId: raw.ownerUserId,
      createdAt: raw.createdAt,
      roomPassword: raw.roomPassword || undefined
    };
  }
}
