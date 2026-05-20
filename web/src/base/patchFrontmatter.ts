import YAML from "yaml";
import type { Text as YText } from "yjs";
import { getFrontmatterPrefixLength } from "../collab/frontmatter";

const YAML_READ_OPTS = { strict: false, uniqueKeys: false } as const;
const FM_PATCH_ORIGIN = "markpad-fm-patch";
const FM_HEAL_ORIGIN = "markpad-fm-heal";

/** Blocs `---` … `---` accidentellement présents dans le corps (sync / patch partiel). */
const EMBEDDED_FM_BLOCK = /(?:^|\n)---\r?\n([\s\S]*?)\r?\n---\r?\n?/g;

const looksLikeYamlFrontmatter = (inner: string): boolean =>
  /^[\w.-]+\s*:/m.test(inner.trim());

/** Retire du corps les blocs YAML dupliqués (pas les séparateurs `---` vides type HR). */
export function stripEmbeddedFrontmatterFromBody(body: string): string {
  let s = body;
  let pass = 0;
  while (pass < 8) {
    pass += 1;
    let changed = false;
    // `texte---` + bloc YAML (fusion Yjs / patch partiel)
    s = s.replace(/[^\n]---\r?\n([\s\S]*?)\r?\n---\r?\n?/g, (match, inner: string) => {
      if (!looksLikeYamlFrontmatter(inner)) return match;
      changed = true;
      return match[0]!;
    });
    s = s.replace(EMBEDDED_FM_BLOCK, (_match, inner: string) => {
      if (!looksLikeYamlFrontmatter(inner)) return _match;
      changed = true;
      return "\n";
    });
    if (!changed) break;
  }
  return s.replace(/^\n+/, "");
}

export function splitNoteDocument(raw: string): {
  frontmatter: Record<string, unknown> | null;
  body: string;
} {
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen == null) {
    return { frontmatter: null, body: stripEmbeddedFrontmatterFromBody(raw) };
  }
  const frontmatter = parseFrontmatterRecord(raw);
  const body = stripEmbeddedFrontmatterFromBody(raw.slice(fmLen).replace(/^\n+/, ""));
  return { frontmatter, body };
}

export function buildNoteDocument(
  frontmatter: Record<string, unknown> | null,
  body: string
): string {
  const cleanBody = stripEmbeddedFrontmatterFromBody(body.replace(/^\n+/, ""));
  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return cleanBody;
  }
  const dump = YAML.stringify(frontmatter, { lineWidth: 120 }).trimEnd();
  if (!cleanBody) return `---\n${dump}\n---\n`;
  const bodyOut = cleanBody.endsWith("\n") ? cleanBody : `${cleanBody}\n`;
  return `---\n${dump}\n---\n${bodyOut}`;
}

/** Un seul frontmatter en tête + corps nettoyé (répare les doublons après sync Obsidian ↔ web). */
export function normalizeNoteDocument(raw: string): string {
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen == null) return raw;
  const { frontmatter, body } = splitNoteDocument(raw);
  if (frontmatter === null) return raw;
  return buildNoteDocument(frontmatter, body);
}

export function noteDocumentNeedsHeal(raw: string): boolean {
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen == null) return false;
  const body = raw.slice(fmLen);
  if (/[^\n]---\r?\n[\w.-]+\s*:/m.test(body)) return true;
  EMBEDDED_FM_BLOCK.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = EMBEDDED_FM_BLOCK.exec(body)) !== null) {
    if (looksLikeYamlFrontmatter(m[1])) return true;
  }
  return false;
}

const replaceYTextContent = (yt: YText, next: string, origin: string): void => {
  const apply = (): void => {
    const len = yt.length;
    if (len > 0) yt.delete(0, len);
    if (next.length > 0) yt.insert(0, next);
  };
  const doc = yt.doc;
  if (doc) doc.transact(apply, origin);
  else apply();
};

export function healNoteYTextIfNeeded(yt: YText): string {
  const raw = yt.toString();
  if (!noteDocumentNeedsHeal(raw)) return raw;
  const cleaned = normalizeNoteDocument(raw);
  if (cleaned !== raw) replaceYTextContent(yt, cleaned, FM_HEAL_ORIGIN);
  return cleaned;
}

export function parseFrontmatterRecord(raw: string): Record<string, unknown> | null {
  const len = getFrontmatterPrefixLength(raw);
  if (len == null) return null;
  const block = raw.slice(0, len);
  const inner = block
    .replace(/^\ufeff?---\r?\n/, "")
    .replace(/\r?\n(?:---|\.\.\.)\s*\r?\n?$/, "");
  try {
    const rec = YAML.parse(inner, YAML_READ_OPTS) as unknown;
    return rec && typeof rec === "object" && !Array.isArray(rec)
      ? (rec as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Extrait les tags frontmatter (`tags` liste ou chaîne Obsidian / inline). */
export function readTagsFromFrontmatter(raw: string): string[] {
  const rec = parseFrontmatterRecord(raw);
  if (!rec) return [];
  const out: string[] = [];
  const pushParsed = (s: string): void => {
    for (const part of s.split(/[,\s#]+/g)) {
      const t = part.trim().replace(/^#+/, "");
      if (t) out.push(t);
    }
  };
  const tg = rec.tags;
  if (Array.isArray(tg)) {
    for (const x of tg) {
      if (typeof x === "string" && x.trim()) pushParsed(x);
    }
  } else if (typeof tg === "string" && tg.trim()) {
    pushParsed(tg);
  }
  const single = rec.tag;
  if (typeof single === "string" && single.trim()) {
    pushParsed(single);
  }
  return [...new Set(out)];
}

/** Met à jour le frontmatter en réécrivant un document canonique (évite les doublons dans le corps). */
export function applyFrontmatterPatchToYText(
  yt: YText,
  patch: Record<string, unknown | undefined>
): boolean {
  const raw = healNoteYTextIfNeeded(yt);
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen != null && parseFrontmatterRecord(raw) === null) return false;

  const { frontmatter, body } = splitNoteDocument(raw);
  const merged: Record<string, unknown> = { ...(frontmatter ?? {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete merged[k];
    else merged[k] = v;
  }
  const next =
    fmLen != null || Object.keys(merged).length > 0
      ? buildNoteDocument(merged, body)
      : buildNoteDocument(null, body);
  replaceYTextContent(yt, next, FM_PATCH_ORIGIN);
  return true;
}

export function patchFrontmatterRecord(
  raw: string,
  patch: Record<string, unknown | undefined>
): string {
  const normalized = normalizeNoteDocument(raw);
  const fmLen = getFrontmatterPrefixLength(normalized);
  if (fmLen != null && parseFrontmatterRecord(normalized) === null) {
    return raw;
  }
  const { frontmatter, body } = splitNoteDocument(normalized);
  const merged: Record<string, unknown> = { ...(frontmatter ?? {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete merged[k];
    else merged[k] = v;
  }
  return fmLen != null || Object.keys(merged).length > 0
    ? buildNoteDocument(merged, body)
    : buildNoteDocument(null, body);
}

export function getCardTitle(filePath: string, raw: string): string {
  const rec = parseFrontmatterRecord(raw);
  const t = rec?.title;
  if (typeof t === "string" && t.trim()) return t.trim();
  const len = getFrontmatterPrefixLength(raw);
  const body = len != null ? raw.slice(len) : raw;
  const m = /^#{1,6}\s+(.+)$/m.exec(body.trim());
  if (m) return m[1].trim();
  const base = filePath.split("/").pop() ?? filePath;
  return base.replace(/\.md$/i, "");
}
