import { EditorView } from "@codemirror/view";

/** Entoure la sélection (ou insère des marqueurs vides). */
export function insertAround(
  view: EditorView,
  before: string,
  after: string = before
): void {
  view.focus();
  const { main } = view.state.selection;
  const text = view.state.sliceDoc(main.from, main.to);
  view.dispatch({
    changes: { from: main.from, to: main.to, insert: `${before}${text}${after}` },
    selection: {
      anchor: main.from + before.length + text.length + after.length
    }
  });
}

const headingRe = /^(#{1,6})\s/;

export function setHeadingLevel(view: EditorView, level: 1 | 2 | 3): void {
  view.focus();
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const prefix = `${"#".repeat(level)} `;
  let rest = line.text;
  if (headingRe.test(rest)) {
    rest = rest.replace(headingRe, "");
  }
  const newLine = `${prefix}${rest}`;
  view.dispatch({
    changes: { from: line.from, to: line.to, insert: newLine },
    selection: { anchor: line.from + newLine.length }
  });
}

export function toggleLinePrefix(view: EditorView, prefix: string): void {
  view.focus();
  const line = view.state.doc.lineAt(view.state.selection.main.head);
  const t = line.text;
  const has = t.startsWith(prefix);
  const insert = has ? t.slice(prefix.length) : `${prefix}${t}`;
  view.dispatch({
    changes: { from: line.from, to: line.to, insert },
    selection: { anchor: line.from + insert.length }
  });
}

export function insertHr(view: EditorView): void {
  view.focus();
  const pos = view.state.selection.main.head;
  const line = view.state.doc.lineAt(pos);
  const insert = line.text.trim() === "" ? "---\n" : "\n\n---\n";
  view.dispatch({
    changes: { from: pos, to: pos, insert },
    selection: { anchor: pos + insert.length }
  });
}

export function insertLink(view: EditorView): void {
  insertAround(view, "[", "](url)");
}

export function insertInlineCode(view: EditorView): void {
  insertAround(view, "`");
}
