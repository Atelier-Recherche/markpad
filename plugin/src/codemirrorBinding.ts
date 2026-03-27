import { StateEffect } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";

type RemoteUser = {
  name?: string;
  color?: string;
};

export const createCollabExtension = (doc: Y.Doc, awareness: unknown) => {
  const yText = doc.getText("content");
  return yCollab(yText, awareness as any, {
    drawSelection: true,
    getUserColor: (user: RemoteUser) => user.color ?? "#7c3aed",
    getUserName: (user: RemoteUser) => user.name ?? "Anonymous"
  });
};

export const setEditorExtensions = (
  view: EditorView,
  extension: ReturnType<typeof createCollabExtension>
): void => {
  view.dispatch({
    effects: StateEffect.appendConfig.of([extension])
  });
};
