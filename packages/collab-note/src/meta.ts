export function readTagsFromMeta(meta: Record<string, unknown>): string[] {
  const out: string[] = [];
  const pushParsed = (s: string): void => {
    for (const part of s.split(/[,\s#]+/g)) {
      const t = part.trim().replace(/^#+/, "");
      if (t) out.push(t);
    }
  };
  const tg = meta.tags;
  if (Array.isArray(tg)) {
    for (const x of tg) {
      if (typeof x === "string" && x.trim()) pushParsed(x);
    }
  } else if (typeof tg === "string" && tg.trim()) {
    pushParsed(tg);
  }
  const single = meta.tag;
  if (typeof single === "string" && single.trim()) {
    pushParsed(single);
  }
  return [...new Set(out)];
}

export function patchMetaRecord(
  meta: Record<string, unknown>,
  patch: Record<string, unknown | undefined>
): Record<string, unknown> {
  const next = { ...meta };
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete next[k];
    else next[k] = v;
  }
  return next;
}

export function readMetaScalar(meta: Record<string, unknown>, key: string): string | null {
  const v = meta[key];
  if (v === undefined || v === null) return null;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return v.trim() || null;
  return null;
}

export function readMetaNumber(meta: Record<string, unknown>, key: string): number | null {
  const v = meta[key];
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function getCardTitleFromNote(
  filePath: string,
  meta: Record<string, unknown>,
  body: string
): string {
  const t = readMetaScalar(meta, "title");
  if (t) return t;
  const m = /^#{1,6}\s+(.+)$/m.exec(body.trim());
  if (m) return m[1].trim();
  const base = filePath.split("/").pop() ?? filePath;
  return base.replace(/\.md$/i, "");
}
