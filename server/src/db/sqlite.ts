import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

export type MarkpadDb = ReturnType<typeof initDb>;

export function initDb(): Database.Database {
  const file = process.env.MARKPAD_SQLITE_PATH ?? path.join(process.cwd(), "data", "markpad.db");
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(file);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      is_admin INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS magic_tokens (
      token_hash TEXT PRIMARY KEY,
      email TEXT NOT NULL COLLATE NOCASE,
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS share_index (
      room_id TEXT PRIMARY KEY,
      owner_key TEXT NOT NULL,
      note_id TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'note',
      folder_path TEXT,
      file_paths_json TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_share_owner ON share_index(owner_key);
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  return db;
}

const ALLOW_PUBLIC_SIGNUP_KEY = "allow_public_signup";

export function seedAllowPublicSignupIfMissing(
  db: Database.Database,
  allow: boolean
): void {
  db.prepare(
    `INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`
  ).run(ALLOW_PUBLIC_SIGNUP_KEY, allow ? "1" : "0");
}

export function getAllowPublicSignup(db: Database.Database): boolean {
  const row = db
    .prepare(`SELECT value FROM app_settings WHERE key = ?`)
    .get(ALLOW_PUBLIC_SIGNUP_KEY) as { value: string } | undefined;
  if (!row) return true;
  return row.value !== "0" && row.value !== "false";
}

export function setAllowPublicSignup(db: Database.Database, allow: boolean): void {
  db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`).run(
    ALLOW_PUBLIC_SIGNUP_KEY,
    allow ? "1" : "0"
  );
}

export function insertShareRow(
  db: Database.Database,
  row: {
    roomId: string;
    ownerKey: string;
    noteId: string;
    kind: string;
    folderPath?: string;
    filePathsJson?: string;
  }
): void {
  db.prepare(
    `INSERT OR REPLACE INTO share_index (room_id, owner_key, note_id, kind, folder_path, file_paths_json, created_at)
     VALUES (@roomId, @ownerKey, @noteId, @kind, @folderPath, @filePathsJson, @createdAt)`
  ).run({
    roomId: row.roomId,
    ownerKey: row.ownerKey,
    noteId: row.noteId,
    kind: row.kind,
    folderPath: row.folderPath ?? null,
    filePathsJson: row.filePathsJson ?? null,
    createdAt: new Date().toISOString()
  });
}

export function deleteShareRow(db: Database.Database, roomId: string): void {
  db.prepare(`DELETE FROM share_index WHERE room_id = ?`).run(roomId);
}

export function countSharesByOwner(db: Database.Database, ownerKey: string): number {
  const row = db
    .prepare(`SELECT COUNT(*) AS n FROM share_index WHERE owner_key = ?`)
    .get(ownerKey) as { n: number } | undefined;
  return row?.n ?? 0;
}

export function listSharesByOwner(db: Database.Database, ownerKey: string) {
  return db
    .prepare(
      `SELECT room_id, note_id, kind, folder_path, file_paths_json, created_at
       FROM share_index WHERE owner_key = ? ORDER BY created_at DESC`
    )
    .all(ownerKey) as Array<{
    room_id: string;
    note_id: string;
    kind: string;
    folder_path: string | null;
    file_paths_json: string | null;
    created_at: string;
  }>;
}

export function listAllShares(db: Database.Database) {
  return db
    .prepare(
      `SELECT room_id, owner_key, note_id, kind, folder_path, created_at FROM share_index ORDER BY created_at DESC`
    )
    .all() as Array<{
    room_id: string;
    owner_key: string;
    note_id: string;
    kind: string;
    folder_path: string | null;
    created_at: string;
  }>;
}

export function listUsers(db: Database.Database) {
  return db
    .prepare(`SELECT id, email, is_admin, created_at FROM users ORDER BY created_at DESC`)
    .all() as Array<{
    id: string;
    email: string;
    is_admin: number;
    created_at: string;
  }>;
}
