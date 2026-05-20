import YAML from "yaml";
import type { Text as YText } from "yjs";
import { getFrontmatterPrefixLength } from "../collab/frontmatter";

const YAML_READ_OPTS = { strict: false, uniqueKeys: false } as const;

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

/**
 * Met à jour le frontmatter sans remplacer tout le document : limite les conflits Yjs
 * quand Obsidian édite le corps en parallèle.
 */
export function applyFrontmatterPatchToYText(
  yt: YText,
  patch: Record<string, unknown | undefined>
): boolean {
  const raw = yt.toString();
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen != null) {
    const cur = parseFrontmatterRecord(raw);
    if (cur === null) return false;
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined) delete cur[k];
      else cur[k] = v;
    }
    const dump = YAML.stringify(cur, { lineWidth: 120 }).trimEnd();
    const newPrefix = `---\n${dump}\n---\n`;
    yt.delete(0, fmLen);
    yt.insert(0, newPrefix);
    return true;
  }
  const updated = patchFrontmatterRecord(raw, patch);
  yt.delete(0, yt.length);
  yt.insert(0, updated);
  return true;
}

export function patchFrontmatterRecord(
  raw: string,
  patch: Record<string, unknown | undefined>
): string {
  const len = getFrontmatterPrefixLength(raw);
  const body = len != null ? raw.slice(len) : raw;
  const cur = parseFrontmatterRecord(raw);
  if (len != null && cur === null) {
    return raw;
  }
  const merged: Record<string, unknown> = { ...(cur ?? {}) };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete merged[k];
    else merged[k] = v;
  }
  const dump = YAML.stringify(merged, { lineWidth: 120 }).trimEnd();
  const bodyText = body.replace(/^\n+/, "");
  return `---\n${dump}\n---\n${bodyText}`;
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
