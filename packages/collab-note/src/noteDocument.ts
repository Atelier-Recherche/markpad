import YAML from "yaml";
import { getFrontmatterPrefixLength } from "./frontmatter.js";
import { stripEmbeddedFrontmatterFromBody } from "./sanitizeBody.js";

const YAML_READ_OPTS = { strict: false, uniqueKeys: false } as const;

/** Clés gérées hors collab Y (API Obsidian `processFrontMatter`). */
export const OBSIDIAN_ONLY_META_KEYS = new Set(["markpadShare", "markpadFolderShare"]);

export type ParsedNote = {
  meta: Record<string, unknown>;
  body: string;
};

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

/** Parse un fichier .md vault → corps + meta (sans clés Obsidian-only). */
export function parseNoteFromMarkdown(raw: string): ParsedNote {
  const fmLen = getFrontmatterPrefixLength(raw);
  if (fmLen == null) {
    return { meta: {}, body: stripEmbeddedFrontmatterFromBody(raw) };
  }
  const full = parseFrontmatterRecord(raw) ?? {};
  const meta: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(full)) {
    if (OBSIDIAN_ONLY_META_KEYS.has(k)) continue;
    meta[k] = v;
  }
  const body = stripEmbeddedFrontmatterFromBody(raw.slice(fmLen).replace(/^\n+/, ""));
  return { meta, body };
}

/** Assemble un .md à partir du corps et du meta collab (sans markpadShare). */
export function assembleNoteToMarkdown(
  body: string,
  meta: Record<string, unknown>
): string {
  const cleanBody = stripEmbeddedFrontmatterFromBody(body.replace(/^\n+/, ""));
  const keys = Object.keys(meta).filter((k) => !OBSIDIAN_ONLY_META_KEYS.has(k));
  if (keys.length === 0) {
    return cleanBody;
  }
  const dump = YAML.stringify(meta, { lineWidth: 120 }).trimEnd();
  if (!cleanBody) return `---\n${dump}\n---\n`;
  const bodyOut = cleanBody.endsWith("\n") ? cleanBody : `${cleanBody}\n`;
  return `---\n${dump}\n---\n${bodyOut}`;
}

export function getCardTitle(filePath: string, body: string, meta: Record<string, unknown>): string {
  const t = meta.title;
  if (typeof t === "string" && t.trim()) return t.trim();
  const m = /^#{1,6}\s+(.+)$/m.exec(body.trim());
  if (m) return m[1].trim();
  const base = filePath.split("/").pop() ?? filePath;
  return base.replace(/\.md$/i, "");
}
