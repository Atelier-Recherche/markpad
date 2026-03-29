/** Longueur du préfixe frontmatter (fin exclusive) ou `null` s’il n’y en a pas. */
export const getFrontmatterPrefixLength = (raw: string): number | null => {
  if (!raw.startsWith("---")) {
    return null;
  }
  let i = 3;
  if (raw[i] === "\r") i += 1;
  if (raw[i] !== "\n") {
    return null;
  }
  i += 1;
  while (i < raw.length) {
    const lineStart = i;
    let j = i;
    while (j < raw.length && raw[j] !== "\n" && raw[j] !== "\r") j += 1;
    const line = raw.slice(lineStart, j);
    if (raw[j] === "\r") j += 1;
    if (raw[j] === "\n") j += 1;
    if (line === "---" || line === "...") {
      return j;
    }
    i = j;
  }
  return null;
};
