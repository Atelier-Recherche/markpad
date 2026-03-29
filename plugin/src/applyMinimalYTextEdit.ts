import * as Y from "yjs";

/** Aligne Y.Text sur une cible après `before`, avec une origin Yjs (ex. YSyncConfig pour ne pas reboucler vers CM). */
export const applyMinimalYTextEdit = (
  doc: Y.Doc,
  yText: Y.Text,
  before: string,
  after: string,
  origin: unknown
): void => {
  if (before === after) return;
  let start = 0;
  const minLen = Math.min(before.length, after.length);
  while (start < minLen && before[start] === after[start]) start += 1;
  let endA = before.length;
  let endB = after.length;
  while (endA > start && endB > start && before[endA - 1] === after[endB - 1]) {
    endA -= 1;
    endB -= 1;
  }
  const del = endA - start;
  const insert = after.slice(start, endB);
  doc.transact(() => {
    if (del > 0) yText.delete(start, del);
    if (insert.length > 0) yText.insert(start, insert);
  }, origin);
};
