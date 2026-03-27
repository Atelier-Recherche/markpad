import type { Express } from "express";
import { createHash, timingSafeEqual } from "node:crypto";
import { config } from "../config.js";
import { RedisDocStore } from "../persistence/redisDocStore.js";
import { SessionStore } from "../sessionStore.js";

const hash = (value: string): Buffer => createHash("sha256").update(value).digest();

const safeEq = (left: string, right: string): boolean => {
  const a = hash(left);
  const b = hash(right);
  return timingSafeEqual(a, b);
};

const extractApiKey = (raw: string | undefined): string => {
  if (!raw) return "";
  return raw.replace(/^Bearer\s+/i, "").trim();
};

export const registerSessionsApi = (
  app: Express,
  sessions: SessionStore,
  docs: RedisDocStore
): void => {
  app.post("/sessions", async (req, res) => {
    const apiKey = extractApiKey(req.header("authorization"));
    const keyOk = config.allowedApiKeys.some((key) => safeEq(apiKey, key));
    if (!keyOk) {
      res.status(401).json({ error: "invalid_api_key" });
      return;
    }

    const body = req.body as {
      noteId?: string;
      userId?: string;
      roomPassword?: string;
    };
    if (!body.noteId || !body.userId) {
      res.status(400).json({ error: "noteId_and_userId_required" });
      return;
    }
    if (
      body.roomPassword &&
      body.roomPassword.length > config.maxRoomPasswordLength
    ) {
      res.status(400).json({ error: "room_password_too_long" });
      return;
    }

    const created = await sessions.createSession({
      noteId: body.noteId,
      ownerUserId: body.userId,
      roomPassword: body.roomPassword
    });
    const shareUrl = `${config.publicWebUrl}/share/${created.roomId}`;
    res.status(201).json({
      ...created,
      shareUrl
    });
  });

  app.delete("/sessions/:roomId", async (req, res) => {
    const apiKey = extractApiKey(req.header("authorization"));
    const keyOk = config.allowedApiKeys.some((key) => safeEq(apiKey, key));
    if (!keyOk) {
      res.status(401).json({ error: "invalid_api_key" });
      return;
    }

    const roomId = req.params.roomId;
    const body = req.body as { userId?: string };
    if (!body.userId) {
      res.status(400).json({ error: "userId_required" });
      return;
    }
    const session = await sessions.getSession(roomId);
    if (!session) {
      res.status(404).json({ error: "session_not_found" });
      return;
    }
    if (session.ownerUserId !== body.userId) {
      res.status(403).json({ error: "only_owner_can_delete_session" });
      return;
    }
    await sessions.deleteSession(roomId);
    await docs.delete(roomId);
    res.status(204).send();
  });

  app.post("/sessions/:roomId/validate", async (req, res) => {
    const roomId = req.params.roomId;
    const session = await sessions.getSession(roomId);
    if (!session) {
      res.status(404).json({ valid: false, reason: "session_not_found" });
      return;
    }
    const { roomPassword } = req.body as { roomPassword?: string };
    const valid = (session.roomPassword ?? "") === (roomPassword ?? "");
    if (!valid) {
      res.status(401).json({ valid: false, reason: "invalid_room_password" });
      return;
    }
    res.json({ valid: true, roomId, noteId: session.noteId });
  });
};
