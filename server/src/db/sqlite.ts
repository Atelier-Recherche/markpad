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
    CREATE TABLE IF NOT EXISTS document_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      file_path TEXT,
      content TEXT NOT NULL,
      snapshot_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_history_room ON document_history(room_id, file_path, snapshot_at);
    CREATE TABLE IF NOT EXISTS room_chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id TEXT NOT NULL,
      sender_client_id TEXT NOT NULL,
      sender_display_name TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_chat_room_time ON room_chat_messages(room_id, created_at);
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

const MAX_SNAPSHOTS_PER_FILE = 100;

export function insertSnapshot(
  db: Database.Database,
  row: { roomId: string; filePath: string | null; content: string }
): void {
  db.prepare(
    `INSERT INTO document_history (room_id, file_path, content, snapshot_at)
     VALUES (@roomId, @filePath, @content, @snapshotAt)`
  ).run({
    roomId: row.roomId,
    filePath: row.filePath ?? null,
    content: row.content,
    snapshotAt: new Date().toISOString()
  });
}

export function pruneOldSnapshots(
  db: Database.Database,
  roomId: string,
  filePath: string | null
): void {
  db.prepare(
    `DELETE FROM document_history
     WHERE room_id = ? AND (file_path IS ? OR file_path = ?)
       AND id NOT IN (
         SELECT id FROM document_history
         WHERE room_id = ? AND (file_path IS ? OR file_path = ?)
         ORDER BY snapshot_at DESC
         LIMIT ${MAX_SNAPSHOTS_PER_FILE}
       )`
  ).run(roomId, filePath, filePath, roomId, filePath, filePath);
}

export type SnapshotMeta = {
  id: number;
  room_id: string;
  file_path: string | null;
  content_length: number;
  snapshot_at: string;
};

export function listSnapshotsMeta(
  db: Database.Database,
  roomId: string,
  filePath?: string | null
): SnapshotMeta[] {
  if (filePath !== undefined) {
    return db
      .prepare(
        `SELECT id, room_id, file_path, LENGTH(content) AS content_length, snapshot_at
         FROM document_history
         WHERE room_id = ? AND (file_path IS ? OR file_path = ?)
         ORDER BY snapshot_at DESC`
      )
      .all(roomId, filePath, filePath) as SnapshotMeta[];
  }
  return db
    .prepare(
      `SELECT id, room_id, file_path, LENGTH(content) AS content_length, snapshot_at
       FROM document_history
       WHERE room_id = ?
       ORDER BY snapshot_at DESC`
    )
    .all(roomId) as SnapshotMeta[];
}

export function getSnapshotContent(
  db: Database.Database,
  snapshotId: number
): { id: number; room_id: string; file_path: string | null; content: string; snapshot_at: string } | undefined {
  return db
    .prepare(`SELECT id, room_id, file_path, content, snapshot_at FROM document_history WHERE id = ?`)
    .get(snapshotId) as
    | { id: number; room_id: string; file_path: string | null; content: string; snapshot_at: string }
    | undefined;
}

export function deleteSnapshotsByRoom(db: Database.Database, roomId: string): void {
  db.prepare(`DELETE FROM document_history WHERE room_id = ?`).run(roomId);
}

export function deleteChatMessagesByRoom(db: Database.Database, roomId: string): void {
  db.prepare(`DELETE FROM room_chat_messages WHERE room_id = ?`).run(roomId);
}

const CHAT_RETENTION_HOURS_KEY = "chat_retention_hours";

export function seedChatRetentionHoursIfMissing(db: Database.Database, hours: number): void {
  db.prepare(`INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`).run(
    CHAT_RETENTION_HOURS_KEY,
    String(Math.max(1, Math.floor(hours)))
  );
}

export function getChatRetentionHours(db: Database.Database): number {
  const row = db
    .prepare(`SELECT value FROM app_settings WHERE key = ?`)
    .get(CHAT_RETENTION_HOURS_KEY) as { value: string } | undefined;
  if (!row) return 24;
  const n = Number.parseInt(row.value, 10);
  return Number.isFinite(n) && n >= 1 ? n : 24;
}

export function setChatRetentionHours(db: Database.Database, hours: number): void {
  const h = Math.max(1, Math.floor(hours));
  db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`).run(
    CHAT_RETENTION_HOURS_KEY,
    String(h)
  );
}

export type ChatMessageRow = {
  id: number;
  room_id: string;
  sender_client_id: string;
  sender_display_name: string;
  body: string;
  created_at: string;
};

export function insertRoomChatMessage(
  db: Database.Database,
  row: {
    room_id: string;
    sender_client_id: string;
    sender_display_name: string;
    body: string;
  }
): ChatMessageRow {
  const createdAt = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO room_chat_messages (room_id, sender_client_id, sender_display_name, body, created_at)
       VALUES (@room_id, @sender_client_id, @sender_display_name, @body, @created_at)`
    )
    .run({
      room_id: row.room_id,
      sender_client_id: row.sender_client_id,
      sender_display_name: row.sender_display_name,
      body: row.body,
      created_at: createdAt
    });
  const id = Number(info.lastInsertRowid);
  return {
    id,
    room_id: row.room_id,
    sender_client_id: row.sender_client_id,
    sender_display_name: row.sender_display_name,
    body: row.body,
    created_at: createdAt
  };
}

export function listRoomChatMessages(
  db: Database.Database,
  roomId: string,
  options?: { sinceCreatedAt?: string; limit?: number }
): ChatMessageRow[] {
  const limit = Math.min(Math.max(options?.limit ?? 500, 1), 2000);
  if (options?.sinceCreatedAt) {
    return db
      .prepare(
        `SELECT id, room_id, sender_client_id, sender_display_name, body, created_at
         FROM room_chat_messages
         WHERE room_id = ? AND created_at > ?
         ORDER BY created_at ASC
         LIMIT ?`
      )
      .all(roomId, options.sinceCreatedAt, limit) as ChatMessageRow[];
  }
  const rows = db
    .prepare(
      `SELECT id, room_id, sender_client_id, sender_display_name, body, created_at
       FROM room_chat_messages
       WHERE room_id = ?
       ORDER BY created_at DESC
       LIMIT ?`
    )
    .all(roomId, limit) as ChatMessageRow[];
  return rows.slice().reverse();
}

/** Supprime les messages plus anciens que la fenêtre de rétention (horloge serveur). */
export function pruneRoomChatMessagesOlderThan(db: Database.Database, retentionHours: number): number {
  const h = Math.max(1, Math.floor(retentionHours));
  const cutoff = new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
  const info = db.prepare(`DELETE FROM room_chat_messages WHERE created_at < ?`).run(cutoff);
  return info.changes;
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

/** Fonctionnalités UI / modules activables par l’admin (JSON dans app_settings). */
export type MarkpadFeatureFlags = {
  kanban: boolean;
  markdownTables: boolean;
  chat: boolean;
  history: boolean;
  folderTree: boolean;
};

const MARKPAD_FEATURES_KEY = "markpad_features";

const DEFAULT_MARKPAD_FEATURES: MarkpadFeatureFlags = {
  kanban: true,
  markdownTables: true,
  chat: true,
  history: true,
  folderTree: true
};

export function seedMarkpadFeatureFlagsIfMissing(db: Database.Database): void {
  db.prepare(`INSERT OR IGNORE INTO app_settings (key, value) VALUES (?, ?)`).run(
    MARKPAD_FEATURES_KEY,
    JSON.stringify(DEFAULT_MARKPAD_FEATURES)
  );
}

export function getMarkpadFeatureFlags(db: Database.Database): MarkpadFeatureFlags {
  const row = db
    .prepare(`SELECT value FROM app_settings WHERE key = ?`)
    .get(MARKPAD_FEATURES_KEY) as { value: string } | undefined;
  if (!row?.value) return { ...DEFAULT_MARKPAD_FEATURES };
  try {
    const parsed = JSON.parse(row.value) as Partial<MarkpadFeatureFlags>;
    return { ...DEFAULT_MARKPAD_FEATURES, ...parsed };
  } catch {
    return { ...DEFAULT_MARKPAD_FEATURES };
  }
}

export function setMarkpadFeatureFlags(
  db: Database.Database,
  patch: Partial<MarkpadFeatureFlags>
): MarkpadFeatureFlags {
  const cur = getMarkpadFeatureFlags(db);
  const next: MarkpadFeatureFlags = { ...cur };
  (Object.keys(patch) as (keyof MarkpadFeatureFlags)[]).forEach((k) => {
    if (typeof patch[k] === "boolean") next[k] = patch[k]!;
  });
  db.prepare(`INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)`).run(
    MARKPAD_FEATURES_KEY,
    JSON.stringify(next)
  );
  return next;
}
