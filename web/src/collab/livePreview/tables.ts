import { Decoration, EditorView } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import type { Range } from "@codemirror/state";

export function buildTableDecorations(
  view: EditorView,
  cursorLines: Set<number>
): Range<Decoration>[] {
  const ranges: Range<Decoration>[] = [];
  const { state } = view;
  const tree = syntaxTree(state);

  tree.iterate({
    enter(node) {
      if (node.name === "Table") {
        // Si le curseur est n'importe où dans le tableau, on ne décore rien
        const startLine = state.doc.lineAt(node.from).number;
        const endLine = state.doc.lineAt(node.to).number;
        for (let l = startLine; l <= endLine; l++) {
          if (cursorLines.has(l)) return false; // stoppe la descente dans ce sous-arbre
        }
        return; // continue la descente pour décorer les enfants
      }

      if (node.name === "TableDelimiter") {
        ranges.push(
          Decoration.mark({ class: "cm-md-table-sep" }).range(node.from, node.to)
        );
      }

      if (node.name === "TableHeader") {
        // Décore les cellules de l'en-tête
        let cur = node.node.firstChild;
        while (cur) {
          if (cur.name !== "TableDelimiter") {
            ranges.push(
              Decoration.mark({ class: "cm-md-table-header" }).range(cur.from, cur.to)
            );
          }
          cur = cur.nextSibling;
        }
      }
    }
  });

  return ranges;
}
