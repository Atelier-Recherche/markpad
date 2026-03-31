import type { Express, Request } from "express";
import type Database from "better-sqlite3";
import { createHash, timingSafeEqual } from "node:crypto";
import { config } from "../config.js";
import { verifyJwt } from "./auth.js";
import { countSharesByOwner, deleteShareRow, insertShareRow } from "../db/sqlite.js";
import { RedisDocStore } from "../persistence/redisDocStore.js";
import type { SessionStore } from "../sessionStore.js";

const hash = (value: string): Buffer => createHash("sha256").update(value).digest();

const safeEq = (left: string, right: string): boolean => {
  const a = hash(left);
  const b = hash(right);
  return timingSafeEqual(a, b);
};

const extractBearer = (raw: string | undefined): string => {
  if (!raw) return "";
  return raw.replace(/^Bearer\s+/i, "").trim();
};

/** Clé API globale (serveur) ou JWT utilisateur (après connexion e-mail). */
type SessionsAuth =
  | { mode: "api_key" }
  | { mode: "jwt"; sub: string };

const authorizeSessionsWrite = async (req: Request): Promise<SessionsAuth | null> => {
  const bearer = extractBearer(req.header("authorization"));
  if (!bearer) return null;
  if (config.allowedApiKeys.some((key) => safeEq(bearer, key))) {
    return { mode: "api_key" };
  }
  const user = await verifyJwt(bearer);
  if (user) {
    return { mode: "jwt", sub: user.sub };
  }
  return null;
};

export const registerSessionsApi = (
  app: Express,
  sessions: SessionStore,
  docs: RedisDocStore,
  db: Database.Database
): void => {
  app.post("/sessions", async (req, res) => {
    const auth = await authorizeSessionsWrite(req);
    if (!auth) {
      res.status(401).json({ error: "invalid_api_key" });
      return;
    }

    const body = req.body as {
      noteId?: string;
      userId?: string;
      roomPassword?: string;
      kind?: "note" | "folder";
      folderPath?: string;
      filePaths?: string[];
    };
    if (!body.noteId || !body.userId) {
      res.status(400).json({ error: "noteId_and_userId_required" });
      return;
    }
    if (auth.mode === "jwt" && body.userId !== auth.sub) {
      res.status(403).json({ error: "userId_must_match_token" });
      return;
    }
    if (body.kind === "folder") {
      if (!body.filePaths?.length) {
        res.status(400).json({ error: "filePaths_required_for_folder" });
        return;
      }
    }
    if (
      body.roomPassword &&
      body.roomPassword.length > config.maxRoomPasswordLength
    ) {
      res.status(400).json({ error: "room_password_too_long" });
      return;
    }

    const existingShares = countSharesByOwner(db, body.userId);
    if (existingShares >= config.maxSharesPerUser) {
      res.status(429).json({ error: "share_limit_reached" });
      return;
    }

    const created = await sessions.createSession({
      noteId: body.noteId,
      ownerUserId: body.userId,
      roomPassword: body.roomPassword,
      kind: body.kind,
      folderPath: body.folderPath,
      filePaths: body.filePaths
    });
    insertShareRow(db, {
      roomId: created.roomId,
      ownerKey: body.userId,
      noteId: created.noteId,
      kind: created.kind,
      folderPath: created.folderPath,
      filePathsJson: created.filePaths?.length ? JSON.stringify(created.filePaths) : undefined
    });
    const shareUrl = `${config.publicWebUrl}/share/${created.roomId}`;
    res.status(201).json({
      ...created,
      shareUrl
    });
  });

  app.delete("/sessions/:roomId", async (req, res) => {
    const auth = await authorizeSessionsWrite(req);
    if (!auth) {
      res.status(401).json({ error: "invalid_api_key" });
      return;
    }

    const roomId = req.params.roomId;
    const body = req.body as { userId?: string };
    if (!body.userId) {
      res.status(400).json({ error: "userId_required" });
      return;
    }
    if (auth.mode === "jwt" && body.userId !== auth.sub) {
      res.status(403).json({ error: "userId_must_match_token" });
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
    deleteShareRow(db, roomId);
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
    res.json({
      valid: true,
      roomId,
      noteId: session.noteId,
      kind: session.kind,
      folderPath: session.folderPath ?? "",
      filePaths: session.filePaths ?? []
    });
  });
};
