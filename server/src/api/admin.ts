import type { Express, Request, Response } from "express";
import type Database from "better-sqlite3";
import { config } from "../config.js";
import {
  deleteShareRow,
  getAllowPublicSignup,
  listAllShares,
  listUsers,
  setAllowPublicSignup
} from "../db/sqlite.js";
import type { RedisDocStore } from "../persistence/redisDocStore.js";
import type { SessionStore } from "../sessionStore.js";
import { getAuthUser } from "./auth.js";

export const registerAdminApi = (
  app: Express,
  db: Database.Database,
  sessions: SessionStore,
  docs: RedisDocStore
): void => {
  const requireAdmin = async (req: Request, res: Response) => {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: "unauthorized" });
      return null;
    }
    const row = db.prepare(`SELECT is_admin FROM users WHERE id = ?`).get(user.sub) as
      | { is_admin: number }
      | undefined;
    const adminByEmail = config.adminEmails.some(
      (a) => a.toLowerCase() === user.email.toLowerCase()
    );
    if (!row?.is_admin && !adminByEmail) {
      res.status(403).json({ error: "forbidden" });
      return null;
    }
    return user;
  };

  app.get("/admin/shares", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const rows = listAllShares(db);
    res.json({ shares: rows });
  });

  app.delete("/admin/sessions/:roomId", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const roomId = req.params.roomId;
    await sessions.deleteSession(roomId);
    await docs.delete(roomId);
    deleteShareRow(db, roomId);
    res.status(204).send();
  });

  app.get("/admin/users", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    res.json({ users: listUsers(db) });
  });

  app.get("/admin/settings", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    res.json({ allowPublicSignup: getAllowPublicSignup(db) });
  });

  app.patch("/admin/settings", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const body = req.body as { allowPublicSignup?: unknown };
    if (typeof body.allowPublicSignup !== "boolean") {
      res.status(400).json({ error: "allowPublicSignup_boolean_required" });
      return;
    }
    setAllowPublicSignup(db, body.allowPublicSignup);
    res.json({ allowPublicSignup: getAllowPublicSignup(db) });
  });

  app.delete("/admin/users/:userId", async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    if (req.params.userId === admin.sub) {
      res.status(400).json({ error: "cannot_delete_self" });
      return;
    }
    db.prepare(`DELETE FROM users WHERE id = ?`).run(req.params.userId);
    res.status(204).send();
  });
};
