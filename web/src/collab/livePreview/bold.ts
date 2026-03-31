import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import type { Range } from "@codemirror/state";

class HiddenWidget extends WidgetType {
  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "none";
    return span;
  }
  ignoreEvent(): boolean {
    return false;
  }
}

const hiddenWidget = new HiddenWidget();

export function buildBoldDecorations(
  view: EditorView,
  cursorLines: Set<number>
): Range<Decoration>[] {
  const ranges: Range<Decoration>[] = [];
  const { state } = view;
  const tree = syntaxTree(state);

  tree.iterate({
    enter(node) {
      if (node.name !== "StrongEmphasis") return;

      const startLine = state.doc.lineAt(node.from).number;
      const endLine = state.doc.lineAt(node.to).number;
      for (let l = startLine; l <= endLine; l++) {
        if (cursorLines.has(l)) return;
      }

      let contentFrom = node.from;
      let contentTo = node.to;

      // Masque les marqueurs d'ouverture et de fermeture (** ou __)
      let cur = node.node.firstChild;
      while (cur) {
        if (cur.name === "EmphasisMark") {
          if (cur.from === node.from) {
            ranges.push(
              Decoration.replace({ widget: hiddenWidget, inclusive: false }).range(cur.from, cur.to)
            );
            contentFrom = cur.to;
          } else {
            ranges.push(
              Decoration.replace({ widget: hiddenWidget, inclusive: false }).range(cur.from, cur.to)
            );
            contentTo = cur.from;
          }
        }
        cur = cur.nextSibling;
      }

      if (contentFrom < contentTo) {
        ranges.push(
          Decoration.mark({ class: "cm-md-bold" }).range(contentFrom, contentTo)
        );
      }
    }
  });

  return ranges;
}
