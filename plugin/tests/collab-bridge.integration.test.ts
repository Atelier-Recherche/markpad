import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { describe, expect, it, afterEach } from "vitest";
import * as Y from "yjs";
import { createCollabExtension } from "../src/codemirrorBinding";

/**
 * Pile proche du plugin : y-codemirror + pont Markpad.
 * Si ces tests passent mais pas Obsidian, le problème est la vue / le cycle de vie Obsidian, pas Yjs.
 */
describe("CodeMirror 6 ↔ Y.Text (createCollabExtension)", () => {
  const views: EditorView[] = [];

  afterEach(() => {
    while (views.length) {
      const v = views.pop();
      v?.destroy();
    }
  });

  function mountEditor(initial: string, ydoc: Y.Doc): EditorView {
    const yText = ydoc.getText("content");
    if (yText.length === 0 && initial.length > 0) {
      ydoc.transact(() => yText.insert(0, initial));
    }
    const state = EditorState.create({
      doc: initial,
      extensions: createCollabExtension(ydoc, null)
    });
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const view = new EditorView({ state, parent });
    views.push(view);
    return view;
  }

  it("propage une insertion locale vers Y.Text", () => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("content");
    const view = mountEditor("hello", ydoc);
    expect(yText.toString()).toBe("hello");

    view.dispatch({
      changes: { from: 5, to: 5, insert: " world" }
    });

    expect(yText.toString()).toBe("hello world");
    expect(view.state.doc.toString()).toBe("hello world");
  });

  it("propage une suppression locale vers Y.Text", () => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("content");
    const view = mountEditor("abc", ydoc);
    view.dispatch({ changes: { from: 1, to: 2, insert: "" } });
    expect(yText.toString()).toBe("ac");
  });

  it("propage une mise à jour Y distante vers le document CM (comme le web)", () => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText("content");
    const view = mountEditor("hi", ydoc);

    ydoc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, "remote");
    }, "fake-ws");

    expect(view.state.doc.toString()).toBe("remote");
  });

  it("garde le frontmatter + corps alignés (cas note partagée)", () => {
    const ydoc = new Y.Doc();
    const full = "---\nmarkpadShare: {}\n---\nBody\n";
    const yText = ydoc.getText("content");
    ydoc.transact(() => yText.insert(0, full));
    const state = EditorState.create({
      doc: full,
      extensions: createCollabExtension(ydoc, null)
    });
    const parent = document.createElement("div");
    document.body.appendChild(parent);
    const view = new EditorView({ state, parent });
    views.push(view);

    view.dispatch({
      changes: { from: full.length, to: full.length, insert: "More" }
    });

    expect(yText.toString()).toBe(`${full}More`);
  });
});
