import { Compartment, StateEffect, type Extension } from "@codemirror/state";
import { EditorView, ViewPlugin, type ViewUpdate } from "@codemirror/view";
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
  public update(update: ViewUpdate): void {
    if (!update.docChanged) return;
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
  const base = yCollab(yText, awareness as any, {
    drawSelection: true,
    getUserColor: (user: RemoteUser) => user.color ?? "#7c3aed",
    getUserName: (user: RemoteUser) => user.name ?? "Anonymous"
  });
  const flat = (Array.isArray(base) ? base : [base]) as Extension[];
  return [...flat, markpadCmYBridge];
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
};
