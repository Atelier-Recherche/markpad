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
