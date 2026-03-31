import { Compartment, EditorState, StateEffect, Transaction, type Extension } from "@codemirror/state";
import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
export { EditorView };
import { setIcon } from "obsidian";
import type { MarkdownView } from "obsidian";
import { yCollab, ySyncFacet } from "y-codemirror.next";
import * as Y from "yjs";
import { applyMinimalYTextEdit } from "./applyMinimalYTextEdit";
import { markpadCollabDebug } from "./markpadDebug";

type RemoteUser = {
  name?: string;
  color?: string;
};

const compartmentByView = new WeakMap<EditorView, Compartment>();
const editableCompartmentByView = new WeakMap<EditorView, Compartment>();
const readonlyBannerByView = new WeakMap<EditorView, HTMLElement>();

/**
 * Retourne la vue CodeMirror 6 réellement utilisée pour la frappe (source, Live Preview, etc.).
 */
export const resolveObsidianEditorView = (markdownView: MarkdownView): EditorView | null => {
  const editor = markdownView.editor as unknown as {
    cm?: unknown;
    editorComponent?: { cm?: unknown };
  };
  if (editor.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → editor.cm");
    return editor.cm;
  }
  if (editor.editorComponent?.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → editor.editorComponent.cm");
    return editor.editorComponent.cm;
  }
  const mode = markdownView.currentMode as unknown as {
    cm?: unknown;
    editor?: { cm?: unknown };
  };
  if (mode?.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → currentMode.cm");
    return mode.cm;
  }
  if (mode?.editor?.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → currentMode.editor.cm");
    return mode.editor.cm;
  }
  const mv = markdownView as unknown as {
    editMode?: { cm?: unknown; editor?: { cm?: unknown } };
  };
  if (mv.editMode?.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → editMode.cm");
    return mv.editMode.cm;
  }
  if (mv.editMode?.editor?.cm instanceof EditorView) {
    markpadCollabDebug("resolveCM → editMode.editor.cm");
    return mv.editMode.editor.cm;
  }
  markpadCollabDebug("resolveCM → échec (aucune EditorView)");
  return null;
};

/**
 * Si le doc CM et Y.Text divergent après une MAJ, pousse le texte CM vers Y en une transaction
 * dont l’origine est {@link ySyncFacet} : l’observateur y-codemirror n’essaie pas de ré-appliquer vers CM
 * (évite doubles insertions), contrairement à un bug possible sur le sens CM→Y seul.
 */
class MarkpadCmYBridge {
  /**
   * Positionner à true avant un dispatch Y→CM explicite (via `applyYTextToCm`) pour
   * empêcher ce pont de pousser CM→Y sur cette mise à jour. Y.Text a DÉJÀ le bon
   * contenu ; repousser CM (= Y) vers Y créerait des opérations Y.js inutiles.
   */
  public skipNextUpdate = false;

  public update(update: ViewUpdate): void {
    if (!update.docChanged) return;
    if (this.skipNextUpdate) {
      this.skipNextUpdate = false;
      return;
    }
    const conf = update.state.facet(ySyncFacet);
    const ytext = conf.ytext;
    const cm = update.state.doc.toString();
    const y = ytext.toString();
    const txCount = update.transactions.length;
    const firstUserFacing =
      txCount > 0 ? update.transactions[0].isUserEvent("input.type") : false;
    markpadCollabDebug("CM ViewUpdate (pont)", {
      txCount,
      firstTxIsInputType: firstUserFacing,
      cmLen: cm.length,
      yLen: y.length,
      aligned: cm === y
    });
    if (cm === y) return;
    markpadCollabDebug("pont CM→Y: application diff minimal", {
      yHead: y.slice(0, 80).replace(/\n/g, "\\n"),
      cmHead: cm.slice(0, 80).replace(/\n/g, "\\n")
    });
    applyMinimalYTextEdit(ytext.doc, ytext, y, cm, conf);
    markpadCollabDebug("pont CM→Y: après apply", { yLen: ytext.toString().length });
  }
}

const markpadCmYBridge = ViewPlugin.fromClass(MarkpadCmYBridge);

export const createCollabExtension = (doc: Y.Doc, awareness: unknown): Extension[] => {
  const yText = doc.getText("content");
  return createCollabExtensionForYText(yText, awareness);
};

export const createCollabExtensionForYText = (
  yText: Y.Text,
  awareness: unknown
): Extension[] => {
  const base = yCollab(yText, awareness as any, {
    drawSelection: true,
    getUserColor: (user: RemoteUser) => user.color ?? "#7c3aed",
    getUserName: (user: RemoteUser) => user.name ?? "Anonymous"
  });
  const flat = (Array.isArray(base) ? base : [base]) as Extension[];
  return [...flat, markpadCmYBridge];
};

export const mountCollabExtensionWithYText = (
  view: EditorView,
  yText: Y.Text,
  awareness: unknown
): void => {
  const ext = createCollabExtensionForYText(yText, awareness);
  let compartment = compartmentByView.get(view);
  if (!compartment) {
    compartment = new Compartment();
    compartmentByView.set(view, compartment);
    view.dispatch({
      effects: StateEffect.appendConfig.of(compartment.of(ext))
    });
    return;
  }
  view.dispatch({
    effects: compartment.reconfigure(ext)
  });
};

export const mountCollabExtension = (
  view: EditorView,
  doc: Y.Doc,
  awareness: unknown
): void => {
  const ext = createCollabExtension(doc, awareness);
  let compartment = compartmentByView.get(view);
  if (!compartment) {
    compartment = new Compartment();
    compartmentByView.set(view, compartment);
    view.dispatch({
      effects: StateEffect.appendConfig.of(compartment.of(ext))
    });
    return;
  }
  view.dispatch({
    effects: compartment.reconfigure(ext)
  });
};

export const unmountCollabExtension = (view: EditorView): void => {
  const compartment = compartmentByView.get(view);
  if (!compartment) return;
  view.dispatch({
    effects: compartment.reconfigure([])
  });
  compartmentByView.delete(view);
};

// ---------------------------------------------------------------------------
// Gestion de l'état lecture seule / éditable (compartment indépendant de la collab).
// ---------------------------------------------------------------------------

/**
 * Bloque les transactions initiées par l'utilisateur (frappe, suppression, paste, undo…).
 * Les transactions programmatiques (yCollab Y→CM, applyYTextToCm) n'ont pas d'annotation
 * Transaction.userEvent et passent librement.
 * `EditorView.editable.of(false)` seul ne suffit pas dans Obsidian car il y a des
 * gestionnaires de clavier hors-DOM qui bypassent le contenteditable.
 */
const blockUserEditsFilter = EditorState.transactionFilter.of((tr) => {
  if (!tr.docChanged) return tr;
  if (tr.annotation(Transaction.userEvent)) return [];
  return tr;
});

const editableExtensions = (editable: boolean): Extension[] =>
  editable
    ? [EditorView.editable.of(true)]
    : [EditorView.editable.of(false), blockUserEditsFilter];

const showReadonlyBanner = (view: EditorView): void => {
  if (readonlyBannerByView.has(view)) return;
  const banner = document.createElement("div");
  banner.className = "markpad-readonly-banner";
  const iconEl = banner.createSpan();
  setIcon(iconEl, "lock");
  banner.createSpan({ text: "Note en lecture seule — reconnexion en cours…" });
  view.dom.prepend(banner);
  readonlyBannerByView.set(view, banner);
};

export const hideReadonlyBanner = (view: EditorView): void => {
  const banner = readonlyBannerByView.get(view);
  if (!banner) return;
  banner.remove();
  readonlyBannerByView.delete(view);
};

/**
 * Monte un compartment dédié au contrôle de l'éditable.
 * Appeler une seule fois par session (lors du `mountCollabExtension`).
 */
export const mountCollabEditable = (view: EditorView, editable: boolean): void => {
  if (editable) hideReadonlyBanner(view); else showReadonlyBanner(view);
  let compartment = editableCompartmentByView.get(view);
  if (!compartment) {
    compartment = new Compartment();
    editableCompartmentByView.set(view, compartment);
    view.dispatch({
      effects: StateEffect.appendConfig.of(compartment.of(editableExtensions(editable)))
    });
    return;
  }
  view.dispatch({ effects: compartment.reconfigure(editableExtensions(editable)) });
};

/**
 * Met à jour l'état éditable (true = l'utilisateur peut écrire, false = lecture seule).
 * Si le compartment n'existe pas encore, il est créé.
 */
export const setCollabEditable = (view: EditorView, editable: boolean): void => {
  if (editable) hideReadonlyBanner(view); else showReadonlyBanner(view);
  const compartment = editableCompartmentByView.get(view);
  if (!compartment) {
    mountCollabEditable(view, editable);
    return;
  }
  view.dispatch({ effects: compartment.reconfigure(editableExtensions(editable)) });
};

/**
 * Démonte le compartment et restaure l'éditable par défaut de CM.
 */
export const unmountCollabEditable = (view: EditorView): void => {
  hideReadonlyBanner(view);
  const compartment = editableCompartmentByView.get(view);
  if (!compartment) return;
  view.dispatch({ effects: compartment.reconfigure([]) });
  editableCompartmentByView.delete(view);
};

/**
 * Vérifie si y-codemirror (ySyncFacet) est actif dans l'état CM courant.
 * Quand Obsidian navigue vers un autre fichier dans la même feuille, il peut
 * réinitialiser l'état de l'EditorView, rendant le Compartment périmé.
 */
export const isCollabMounted = (view: EditorView): boolean => {
  try {
    const conf = view.state.facet(ySyncFacet) as { ytext?: unknown } | null;
    return conf != null && conf.ytext != null;
  } catch {
    return false;
  }
};

/**
 * Monte (ou re-monte) la collab extension sur la vue. Gère le cas où le WeakMap
 * a une entrée pour la vue mais que le Compartment a été perdu (état CM réinitialisé
 * lors d'une navigation vers un autre fichier dans la même feuille Obsidian).
 */
export const remountCollabExtensionForYText = (
  view: EditorView,
  yText: Y.Text,
  awareness: unknown
): void => {
  if (!isCollabMounted(view)) {
    // Les deux Compartments dans le WeakMap sont périmés (état CM réinitialisé par
    // Obsidian lors d'une navigation). On les efface pour forcer des appendConfig propres.
    compartmentByView.delete(view);
    editableCompartmentByView.delete(view);
  }
  mountCollabExtensionWithYText(view, yText, awareness);
};

/**
 * Applique explicitement le contenu de Y.Text dans le CM editor.
 *
 * y-codemirror.next (YSyncPluginValue) ne fait AUCUN sync initial Y→CM dans son
 * constructeur : il ne propage que les futures mutations de Y.Text via son observer.
 * Après un re-mount (retour sur une note après navigation), CM garde l'ancien contenu
 * du disque. Sans cette étape, le premier frappe de l'utilisateur déclencherait
 * `YSyncPluginValue.update()` qui verrait CM ≠ Y et pousserait l'ANCIEN CM→Y,
 * écrasant les modifications distantes.
 *
 * Pour empêcher le `MarkpadCmYBridge` (pont CM→Y) de réagir à ce dispatch, on
 * positionne son flag `skipNextUpdate` avant de dispatcher — `ySyncAnnotation`
 * n'étant pas exporté depuis le package, on ne peut pas utiliser l'approche officielle.
 *
 * @returns true si une mise à jour a été effectuée.
 */
export const applyYTextToCm = (view: EditorView, yText: Y.Text): boolean => {
  const conf = view.state.facet(ySyncFacet) as { ytext?: Y.Text } | undefined;
  if (!conf?.ytext) return false;
  const yContent = yText.toString();
  const cmContent = view.state.doc.toString();
  if (yContent === cmContent) return false;
  // Informer le pont CM→Y de sauter ce dispatch (CM reçoit Y, pas l'inverse).
  const bridge = view.plugin(markpadCmYBridge);
  if (bridge) bridge.skipNextUpdate = true;
  view.dispatch({
    changes: { from: 0, to: cmContent.length, insert: yContent },
    annotations: [Transaction.addToHistory.of(false)]
  });
  return true;
};
