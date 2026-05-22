import * as Y from "yjs";
import {
  assembleNoteToMarkdown,
  parseNoteFromMarkdown,
  type ParsedNote
} from "./noteDocument.js";
import { patchMetaRecord } from "./meta.js";

/** Y.Map `files` en mode dossier. */
export const FILES_MAP_KEY = "files";

/** Racine note unique (remplace `content` Y.Text plat). */
export const NOTE_ROOT_KEY = "note";

export const KEY_BODY = "body";
export const KEY_META = "meta";

export type NoteMeta = Record<string, unknown>;

export function metaMapToRecord(metaMap: Y.Map<unknown>): NoteMeta {
  const out: NoteMeta = {};
  metaMap.forEach((value, key) => {
    if (typeof key !== "string") return;
    out[key] = value as unknown;
  });
  return out;
}

export function recordToMetaMap(
  doc: Y.Doc,
  meta: NoteMeta,
  target: Y.Map<unknown>,
  origin?: unknown
): void {
  doc.transact(() => {
    const keys = new Set<string>();
    for (const [k, v] of Object.entries(meta)) {
      keys.add(k);
      target.set(k, v);
    }
    for (const k of [...target.keys()]) {
      if (typeof k === "string" && !keys.has(k)) {
        target.delete(k);
      }
    }
  }, origin);
}

export function hasNoteFileShape(value: unknown): boolean {
  return value instanceof Y.Map && value.get(KEY_BODY) instanceof Y.Text;
}

export function isNoteFileEntry(value: unknown): value is Y.Map<unknown> {
  return hasNoteFileShape(value);
}

export function getOrCreateFileEntry(doc: Y.Doc, path: string): Y.Map<unknown> {
  const files = doc.getMap(FILES_MAP_KEY);
  let entry = files.get(path);
  if (isNoteFileEntry(entry)) return entry;
  const fileMap = new Y.Map<unknown>();
  fileMap.set(KEY_BODY, new Y.Text());
  fileMap.set(KEY_META, new Y.Map<unknown>());
  doc.transact(() => {
    files.set(path, fileMap);
  });
  return fileMap;
}

export function getFileEntry(doc: Y.Doc, path: string): Y.Map<unknown> | null {
  const entry = doc.getMap(FILES_MAP_KEY).get(path);
  return isNoteFileEntry(entry) ? entry : null;
}

export function getBodyYText(fileEntry: Y.Map<unknown>): Y.Text {
  return fileEntry.get(KEY_BODY) as Y.Text;
}

export function getMetaYMap(fileEntry: Y.Map<unknown>): Y.Map<unknown> {
  const m = fileEntry.get(KEY_META);
  if (m instanceof Y.Map) return m;
  const created = new Y.Map<unknown>();
  fileEntry.set(KEY_META, created);
  return created;
}

/** Initialise ou remplace le contenu d’une entrée fichier depuis le markdown disque. */
export function seedFileEntryFromMarkdown(
  doc: Y.Doc,
  path: string,
  markdown: string,
  origin?: unknown
): Y.Map<unknown> {
  const parsed = parseNoteFromMarkdown(markdown);
  const fileMap = getOrCreateFileEntry(doc, path);
  doc.transact(() => {
    const body = getBodyYText(fileMap);
    const bodyStr = parsed.body;
    if (body.length > 0) body.delete(0, body.length);
    if (bodyStr.length > 0) body.insert(0, bodyStr);
    recordToMetaMap(doc, parsed.meta, getMetaYMap(fileMap));
  }, origin);
  return fileMap;
}

export function getOrCreateNoteRoot(doc: Y.Doc): Y.Map<unknown> {
  const root: Y.Map<unknown> = doc.getMap(NOTE_ROOT_KEY);
  if (!hasNoteFileShape(root)) {
    doc.transact(() => {
      root.set(KEY_BODY, new Y.Text());
      root.set(KEY_META, new Y.Map<unknown>());
    });
  }
  return root;
}

/** Note unique : retourne le Y.Text corps (crée la structure si besoin). */
export function getNoteBodyYText(doc: Y.Doc): Y.Text {
  return getBodyYText(getOrCreateNoteRoot(doc));
}

export function getNoteMetaYMap(doc: Y.Doc): Y.Map<unknown> {
  return getMetaYMap(getOrCreateNoteRoot(doc));
}

export function seedNoteRootFromMarkdown(
  doc: Y.Doc,
  markdown: string,
  origin?: unknown
): void {
  const parsed = parseNoteFromMarkdown(markdown);
  const root = getOrCreateNoteRoot(doc);
  doc.transact(() => {
    const body = getBodyYText(root);
    if (body.length > 0) body.delete(0, body.length);
    if (parsed.body.length > 0) body.insert(0, parsed.body);
    recordToMetaMap(doc, parsed.meta, getMetaYMap(root));
  }, origin);
}

export function readFileEntryAsParsed(fileEntry: Y.Map<unknown>): ParsedNote {
  return {
    body: getBodyYText(fileEntry).toString(),
    meta: metaMapToRecord(getMetaYMap(fileEntry))
  };
}

export function assembleFileEntry(fileEntry: Y.Map<unknown>): string {
  const { body, meta } = readFileEntryAsParsed(fileEntry);
  return assembleNoteToMarkdown(body, meta);
}

export function applyMetaPatchToYMap(
  doc: Y.Doc,
  metaMap: Y.Map<unknown>,
  patch: Record<string, unknown | undefined>,
  origin?: unknown
): void {
  const cur = metaMapToRecord(metaMap);
  const next = patchMetaRecord(cur, patch);
  doc.transact(() => {
    recordToMetaMap(doc, next, metaMap);
  }, origin);
}

export function setBodyYTextContent(
  doc: Y.Doc,
  body: Y.Text,
  content: string,
  origin?: unknown
): void {
  doc.transact(() => {
    if (body.length > 0) body.delete(0, body.length);
    if (content.length > 0) body.insert(0, content);
  }, origin);
}

/** Fusionne le meta disque dans Y.Map (clés disque écrasent les clés existantes). */
export function mergeMetaFromParsed(
  doc: Y.Doc,
  metaMap: Y.Map<unknown>,
  parsedMeta: Record<string, unknown>,
  origin?: unknown
): void {
  const next = patchMetaRecord(metaMapToRecord(metaMap), parsedMeta);
  recordToMetaMap(doc, next, metaMap, origin);
}
