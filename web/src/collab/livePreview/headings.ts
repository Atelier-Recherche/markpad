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

export function buildHeadingDecorations(
  view: EditorView,
  cursorLines: Set<number>
): Range<Decoration>[] {
  const ranges: Range<Decoration>[] = [];
  const { state } = view;
  const tree = syntaxTree(state);

  tree.iterate({
    enter(node) {
      const level = headingLevel(node.name);
      if (level === 0) return;

      const line = state.doc.lineAt(node.from);
      if (cursorLines.has(line.number)) return;

      // Cherche le HeaderMark (les `#` + espace) dans les enfants
      let markEnd = node.from;
      let cur = node.node.firstChild;
      while (cur) {
        if (cur.name === "HeaderMark") {
          markEnd = cur.to;
          // Inclut l'espace après les `#`
          if (markEnd < node.to && state.doc.sliceString(markEnd, markEnd + 1) === " ") {
            markEnd++;
          }
          break;
        }
        cur = cur.nextSibling;
      }

      if (markEnd > node.from) {
        ranges.push(
          Decoration.replace({ widget: hiddenWidget, inclusive: false }).range(node.from, markEnd)
        );
      }

      ranges.push(
        Decoration.mark({ class: `cm-md-h${level}` }).range(markEnd, node.to)
      );
    }
  });

  return ranges;
}

function headingLevel(nodeName: string): number {
  switch (nodeName) {
    case "ATXHeading1": return 1;
    case "ATXHeading2": return 2;
    case "ATXHeading3": return 3;
    case "ATXHeading4": return 4;
    case "ATXHeading5": return 5;
    case "ATXHeading6": return 6;
    default: return 0;
  }
}
