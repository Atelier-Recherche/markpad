import YAML from "yaml";

const IN_FOLDER_RE =
  /file\.inFolder\(\s*"([^"]+)"\s*\)|file\.inFolder\(\s*'([^']+)'\s*\)/;

/** Types de vues Obsidian Bases (et plugins) pouvant servir de tableau Kanban par groupBy. */
const GROUPABLE_VIEW_TYPES = new Set([
  "kanban",
  "table",
  "cards",
  "board",
  "list"
]);

export type ParsedBaseKanban = {
  groupByProperty: string;
  filterPrefix: string | null;
  columnOrder: string[];
};

const walkFilters = (node: unknown, onStr: (s: string) => void): void => {
  if (typeof node === "string") {
    onStr(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const x of node) walkFilters(x, onStr);
    return;
  }
  if (node && typeof node === "object") {
    for (const v of Object.values(node)) walkFilters(v, onStr);
  }
};

function normalizeViews(root: Record<string, unknown>): Record<string, unknown>[] {
  const views = root.views;
  if (Array.isArray(views)) {
    return views.filter((v): v is Record<string, unknown> => Boolean(v) && typeof v === "object");
  }
  if (views && typeof views === "object" && !Array.isArray(views)) {
    return Object.values(views).filter(
      (v): v is Record<string, unknown> => Boolean(v) && typeof v === "object"
    );
  }
  return [];
}

function viewTypeLower(v: Record<string, unknown>): string {
  const t = v.type;
  return typeof t === "string" ? t.trim().toLowerCase() : "";
}

/** Extrait la propriété frontmatter (clé YAML) depuis groupBy Bases / plugins. */
function extractGroupByProperty(view: Record<string, unknown>): string | null {
  const gb = view.groupBy;
  if (typeof gb === "string") {
    const s = gb.trim();
    if (!s) return null;
    return normalizeNotePropertyRef(s);
  }
  if (gb && typeof gb === "object") {
    const p = (gb as Record<string, unknown>).property;
    if (typeof p === "string" && p.trim()) {
      return normalizeNotePropertyRef(p.trim());
    }
  }
  return null;
}

function normalizeNotePropertyRef(raw: string): string {
  const br = /^note\[\s*["']([^"']+)["']\s*\]$/.exec(raw);
  if (br) return br[1];
  if (raw.startsWith("note.")) return raw.slice(5);
  return raw;
}

function pickBoardView(views: Record<string, unknown>[]): Record<string, unknown> | null {
  const withGroup = (v: Record<string, unknown>) => extractGroupByProperty(v) !== null;
  for (const v of views) {
    const tl = viewTypeLower(v);
    if (tl && GROUPABLE_VIEW_TYPES.has(tl) && withGroup(v)) return v;
  }
  for (const v of views) {
    if (withGroup(v)) return v;
  }
  return null;
}

function extractColumnOrder(view: Record<string, unknown>): string[] {
  const candidates = [view.boardColumns, view.columns, view.lanes, view.board_columns];
  for (const c of candidates) {
    if (Array.isArray(c)) {
      const cols = c.filter((x): x is string => typeof x === "string");
      if (cols.length) return cols;
    }
  }
  return [];
}

/** Interprète un `.base` (YAML Obsidian Bases / plugins) pour la vue Kanban web. */
export function parseBaseKanban(yamlText: string): ParsedBaseKanban | null {
  let doc: unknown;
  try {
    doc = YAML.parse(yamlText);
  } catch {
    return null;
  }
  if (!doc || typeof doc !== "object") return null;
  const root = doc as Record<string, unknown>;
  const viewsArr = normalizeViews(root);
  if (viewsArr.length === 0) return null;

  const boardView = pickBoardView(viewsArr);
  if (!boardView) return null;

  const prop = extractGroupByProperty(boardView);
  if (!prop) return null;

  let filterPrefix: string | null = null;
  const captureFolder = (s: string): void => {
    const m = IN_FOLDER_RE.exec(s);
    if (m) {
      const path = (m[1] ?? m[2] ?? "").replace(/\\/g, "/").replace(/\/$/, "");
      if (path) filterPrefix = path;
    }
  };
  if (root.filters !== undefined) walkFilters(root.filters, captureFolder);
  if (boardView.filters !== undefined) walkFilters(boardView.filters, captureFolder);

  const columnOrder = extractColumnOrder(boardView);

  return { groupByProperty: prop, filterPrefix, columnOrder };
}

export const NO_VALUE_COLUMN = "(No value)";
export const KANBAN_ORDER_KEY = "kanban_order";

export const normalizeVaultPath = (p: string): string => p.replace(/\\/g, "/").replace(/\/$/, "");

export function fileMatchesBaseFilter(
  filePath: string,
  filterPrefix: string | null,
  allowedPaths: string[]
): boolean {
  const norm = normalizeVaultPath(filePath);
  if (!norm.endsWith(".md")) return false;
  const okAllowed = allowedPaths.some(
    (a) => norm === normalizeVaultPath(a) || norm.startsWith(`${normalizeVaultPath(a)}/`)
  );
  if (!okAllowed) return false;
  if (!filterPrefix) return true;
  const f = normalizeVaultPath(filterPrefix);
  return norm === f || norm.startsWith(`${f}/`);
}
