import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import type { Range } from "@codemirror/state";

/** Ligne de liste de tâches GFM : `- [ ]` / `1. [x]` */
const TASK_LIST_LINE = /^(\s*)(?:[-*+]|\d{1,9}\.)\s+\[([ xX])\]\s/;

class TaskListCheckboxWidget extends WidgetType {
  private readonly checked: boolean;

  constructor(checked: boolean) {
    super();
    this.checked = checked;
  }

  eq(other: TaskListCheckboxWidget): boolean {
    return other.checked === this.checked;
  }

  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "cm-md-task-list-row";
    span.setAttribute("aria-hidden", "true");
    const box = document.createElement("span");
    box.className = `cm-md-task-checkbox${this.checked ? " cm-md-task-checkbox--checked" : ""}`;
    box.textContent = this.checked ? "✓" : "";
    span.appendChild(box);
    return span;
  }

  ignoreEvent(): boolean {
    return false;
  }

  get estimatedHeight(): number {
    return -1;
  }
}

export function buildTaskListDecorations(
  view: EditorView,
  cursorLines: Set<number>
): Range<Decoration>[] {
  const ranges: Range<Decoration>[] = [];
  const { state } = view;

  for (let ln = 1; ln <= state.doc.lines; ln++) {
    const line = state.doc.line(ln);
    const raw = line.text;
    if (!TASK_LIST_LINE.test(raw)) continue;
    if (cursorLines.has(ln)) continue;

    const openIdx = raw.indexOf("[");
    const closeIdx = raw.indexOf("]", openIdx + 1);
    if (openIdx < 0 || closeIdx < 0) continue;

    const inner = raw.slice(openIdx + 1, closeIdx);
    const checked = inner === "x" || inner === "X";

    const from = line.from + openIdx;
    const to = line.from + closeIdx + 1;

    ranges.push(
      Decoration.replace({
        widget: new TaskListCheckboxWidget(checked),
        inclusive: true
      }).range(from, to)
    );
  }

  return ranges;
}
