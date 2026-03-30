import type { Express } from "express";
import type Database from "better-sqlite3";
import { config } from "../config.js";
import { listSharesByOwner } from "../db/sqlite.js";
import type { SessionStore } from "../sessionStore.js";
import { getAuthUser } from "./auth.js";

export const registerMeApi = (
  app: Express,
  db: Database.Database,
  sessions: SessionStore
): void => {
  app.get("/me/profile", async (req, res) => {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    const row = db
      .prepare(`SELECT is_admin FROM users WHERE id = ?`)
      .get(user.sub) as { is_admin: number } | undefined;
    const adminByEmail = config.adminEmails.some(
      (a) => a.toLowerCase() === user.email.toLowerCase()
    );
    const isAdmin = Boolean(row?.is_admin) || adminByEmail;
    res.json({
      userId: user.sub,
      email: user.email,
      isAdmin
    });
  });

  app.get("/me/shares", async (req, res) => {
    const user = await getAuthUser(req);
    if (!user) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }

    const rows = listSharesByOwner(db, user.sub);
    const enriched = await Promise.all(
      rows.map(async (r) => {
        const live = await sessions.getSession(r.room_id);
        return {
          roomId: r.room_id,
          noteId: r.note_id,
          kind: r.kind,
          folderPath: r.folder_path,
          filePaths: r.file_paths_json ? (JSON.parse(r.file_paths_json) as string[]) : [],
          createdAt: r.created_at,
          shareUrl: `${config.publicWebUrl}/share/${r.room_id}`,
          active: live != null
        };
      })
    );
    res.json({ shares: enriched });
  });
};
