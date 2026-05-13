import YAML from "yaml";

const IN_FOLDER_RE = /file\.inFolder\(\s*"([^"]+)"\s*\)/;

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

/** Interprète un `.base` (YAML Bases) pour la vue Kanban Base Board. */
export function parseBaseKanban(yamlText: string): ParsedBaseKanban | null {
  let doc: unknown;
  try {
    doc = YAML.parse(yamlText);
  } catch {
    return null;
  }
  if (!doc || typeof doc !== "object") return null;
  const root = doc as Record<string, unknown>;
  const views = root.views;
  if (!Array.isArray(views)) return null;
  const kanbanView = views.find(
    (v) => v && typeof v === "object" && (v as Record<string, unknown>).type === "kanban"
  ) as Record<string, unknown> | undefined;
  if (!kanbanView) return null;
  const gb = kanbanView.groupBy;
  let prop: string | null = null;
  if (gb && typeof gb === "object") {
    const p = (gb as Record<string, unknown>).property;
    if (typeof p === "string") {
      prop = p.startsWith("note.") ? p.slice(5) : p;
    }
  }
  if (!prop) return null;

  let filterPrefix: string | null = null;
  if (root.filters !== undefined) {
    walkFilters(root.filters, (s) => {
      const m = IN_FOLDER_RE.exec(s);
      if (m) filterPrefix = m[1].replace(/\\/g, "/").replace(/\/$/, "");
    });
  }

  let columnOrder: string[] = [];
  const bc = kanbanView.boardColumns;
  if (Array.isArray(bc)) {
    columnOrder = bc.filter((x): x is string => typeof x === "string");
  }

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
