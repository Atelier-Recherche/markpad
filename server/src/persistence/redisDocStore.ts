import { Redis } from "ioredis";
import * as Y from "yjs";

const docKey = (roomId: string): string => `markpad:doc:${roomId}`;

export class RedisDocStore {
  public constructor(private readonly redis: Redis) {}

  public async load(roomId: string): Promise<Uint8Array | null> {
    const raw = await this.redis.getBuffer(docKey(roomId));
    if (!raw) {
      return null;
    }
    return new Uint8Array(raw);
  }

  public async save(roomId: string, doc: Y.Doc): Promise<void> {
    const state = Y.encodeStateAsUpdate(doc);
    await this.redis.set(docKey(roomId), Buffer.from(state));
  }
}
