import * as Y from "yjs";
import DiffMatchPatch from "diff-match-patch";

export const RECONCILE_ORIGIN = "markpad-reconcile";

export type ReconcileStatus =
  /** Aucune divergence. */
  | "noop"
  /** Y.Text était vide, rempli avec le local. */
  | "seeded"
  /** Fusion réussie : les changements locaux ont pu être appliqués proprement. */
  | "merged"
  /**
   * Conflit : certains hunks du diff n'ont pas pu être appliqués proprement
   * (zones modifiées en même temps côté local et côté distant).
   * Y.Text n'est PAS modifié ; l'appelant doit sauvegarder le local et prévenir l'utilisateur.
   */
  | "conflict";

/**
 * Fusionne le corps Markdown local (sans frontmatter) dans Y.Text `body` après sync réseau.
 */
export const reconcileLocalBodyIntoY = (
  doc: Y.Doc,
  yText: Y.Text,
  localBody: string
): ReconcileStatus => {
  const yStr = yText.toString();
  if (localBody === yStr) return "noop";

  if (yStr.length === 0 && localBody.length > 0) {
    doc.transact(() => yText.insert(0, localBody), RECONCILE_ORIGIN);
    return "seeded";
  }

  if (localBody.length === 0) return "noop";

  const dmp = new DiffMatchPatch();
  const patches = dmp.patch_make(yStr, localBody);
  const [merged, results] = dmp.patch_apply(patches, yStr);

  if (!results.every(Boolean)) {
    return "conflict";
  }

  if (merged === yStr) return "noop";

  doc.transact(() => {
    yText.delete(0, yText.length);
    yText.insert(0, merged);
  }, RECONCILE_ORIGIN);
  return "merged";
};
