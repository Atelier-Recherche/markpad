import YAML from "yaml";
import { getFrontmatterPrefixLength } from "../collab/frontmatter";

export function parseFrontmatterRecord(raw: string): Record<string, unknown> | null {
  const len = getFrontmatterPrefixLength(raw);
  if (len == null) return null;
  const block = raw.slice(0, len);
  const inner = block.replace(/^---\r?\n/, "").replace(/\r?\n---\r?\n?$/, "");
  try {
    const rec = YAML.parse(inner) as unknown;
    return rec && typeof rec === "object" && !Array.isArray(rec)
      ? (rec as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function patchFrontmatterRecord(
  raw: string,
  patch: Record<string, unknown | undefined>
): string {
  const len = getFrontmatterPrefixLength(raw);
  const body = len != null ? raw.slice(len) : raw;
  const cur = parseFrontmatterRecord(raw) ?? {};
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete cur[k];
    else cur[k] = v;
  }
  const dump = YAML.stringify(cur).trimEnd();
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
