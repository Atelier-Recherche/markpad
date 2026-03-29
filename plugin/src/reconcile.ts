import * as Y from "yjs";
import DiffMatchPatch from "diff-match-patch";

export const RECONCILE_ORIGIN = "markpad-reconcile";

/**
 * Fusionne le Markdown local (fichier Obsidian) avec le Y.Text après sync réseau.
 * - Room vide côté serveur + fichier local non vide : restaure le contenu.
 * - Divergence : patch minimal local → état Y (diff-match-patch).
 */
export const reconcileLocalMarkdownIntoY = (
  doc: Y.Doc,
  yText: Y.Text,
  localFull: string
): boolean => {
  const yStr = yText.toString();
  if (localFull === yStr) return false;

  if (yStr.length === 0 && localFull.length > 0) {
    doc.transact(() => yText.insert(0, localFull), RECONCILE_ORIGIN);
    return true;
  }

  if (localFull.length === 0) return false;

  const dmp = new DiffMatchPatch();
  const patches = dmp.patch_make(yStr, localFull);
  const [merged, results] = dmp.patch_apply(patches, yStr);
  if (!results.every(Boolean)) {
    return false;
  }
  if (merged === yStr) return false;

  doc.transact(() => {
    yText.delete(0, yText.length);
    yText.insert(0, merged);
  }, RECONCILE_ORIGIN);
  return true;
};
