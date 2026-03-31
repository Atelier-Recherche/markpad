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
 * Fusionne le Markdown local (fichier Obsidian) dans Y.Text après sync réseau.
 *
 * Logique :
 * - Y.Text vide + local non vide → on remplit Y depuis le local ("seed").
 * - Les deux non vides → diff-match-patch pour appliquer les changements locaux sur Y.
 *   Si TOUS les hunks s'appliquent proprement → "merged".
 *   Si au moins un hunk échoue (conflit de zones) → "conflict" (Y.Text non touché).
 */
export const reconcileLocalMarkdownIntoY = (
  doc: Y.Doc,
  yText: Y.Text,
  localFull: string
): ReconcileStatus => {
  const yStr = yText.toString();
  if (localFull === yStr) return "noop";

  if (yStr.length === 0 && localFull.length > 0) {
    doc.transact(() => yText.insert(0, localFull), RECONCILE_ORIGIN);
    return "seeded";
  }

  if (localFull.length === 0) return "noop";

  const dmp = new DiffMatchPatch();
  const patches = dmp.patch_make(yStr, localFull);
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
