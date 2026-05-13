import { ViewPlugin, type DecorationSet, EditorView } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import type { Extension } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import type { LivePreviewConfig } from "./types";
import { defaultLivePreviewConfig } from "./types";
import { buildHeadingDecorations } from "./headings";
import { buildBoldDecorations } from "./bold";
import { buildItalicDecorations } from "./italic";
import { buildTableDecorations } from "./tables";
import { buildTaskListDecorations } from "./taskLists";

function buildDecorations(view: EditorView, config: Required<LivePreviewConfig>): DecorationSet {
  // Calcule toutes les lignes où se trouve un curseur (multi-curseur inclus)
  const cursorLines = new Set<number>();
  for (const range of view.state.selection.ranges) {
    const startLine = view.state.doc.lineAt(range.from).number;
    const endLine = view.state.doc.lineAt(range.to).number;
    for (let l = startLine; l <= endLine; l++) {
      cursorLines.add(l);
    }
  }

  const allRanges = [
    ...(config.headings ? buildHeadingDecorations(view, cursorLines) : []),
    ...(config.bold ? buildBoldDecorations(view, cursorLines) : []),
    ...(config.italic ? buildItalicDecorations(view, cursorLines) : []),
    ...(config.tables ? buildTableDecorations(view, cursorLines) : []),
    ...(config.taskLists ? buildTaskListDecorations(view, cursorLines) : []),
  ];

  // Les décorations doivent être triées par position croissante
  allRanges.sort((a, b) => a.from - b.from || a.to - b.to);

  const builder = new RangeSetBuilder<Decoration>();
  for (const r of allRanges) {
    builder.add(r.from, r.to, r.value);
  }

  return builder.finish();
}

export function createLivePreviewExtension(config: LivePreviewConfig = {}): Extension {
  const resolved: Required<LivePreviewConfig> = {
    ...defaultLivePreviewConfig,
    ...config,
  };

  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;

      constructor(view: EditorView) {
        this.decorations = buildDecorations(view, resolved);
      }

      update(update: import("@codemirror/view").ViewUpdate) {
        if (update.docChanged || update.selectionSet || update.viewportChanged) {
          this.decorations = buildDecorations(update.view, resolved);
        }
      }
    },
    { decorations: (v) => v.decorations }
  );
}
