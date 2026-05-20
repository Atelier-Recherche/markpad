import * as Y from "yjs";
import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  fileMatchesBaseFilter,
  KANBAN_ORDER_KEY,
  NO_VALUE_COLUMN,
  type ParsedBaseKanban
} from "../base/parseBaseFile";
import {
  applyFrontmatterPatchToYText,
  getCardTitle,
  parseFrontmatterRecord,
  readTagsFromFrontmatter
} from "../base/patchFrontmatter";

export type KanbanCardModel = {
  path: string;
  title: string;
  column: string;
  order: number;
  tags: string[];
};

const readColumn = (raw: string, prop: string): string => {
  const rec = parseFrontmatterRecord(raw);
  if (!rec) return NO_VALUE_COLUMN;
  const v = rec[prop];
  if (v === undefined || v === null) return NO_VALUE_COLUMN;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return v.trim() || NO_VALUE_COLUMN;
  return NO_VALUE_COLUMN;
};

const readOrder = (raw: string): number => {
  const rec = parseFrontmatterRecord(raw);
  const o = rec?.[KANBAN_ORDER_KEY];
  return typeof o === "number" && Number.isFinite(o) ? o : Number.POSITIVE_INFINITY;
};

const buildColumns = (cards: KanbanCardModel[], stored: string[]): string[] => {
  const fromData = [...new Set(cards.map((c) => c.column))];
  if (stored.length > 0) {
    const out = [...stored];
    for (const c of fromData) {
      if (!out.includes(c)) out.push(c);
    }
    return out;
  }
  return fromData.sort((a, b) => a.localeCompare(b));
};

type BaseKanbanBoardProps = {
  ydoc: Y.Doc;
  folderPaths: string[];
  parsed: ParsedBaseKanban;
  /** Double-clic : ouvrir la note en édition (p.ex. vue fractionnée). */
  onOpenCard?: (path: string) => void;
};

export const BaseKanbanBoard = ({ ydoc, folderPaths, parsed, onOpenCard }: BaseKanbanBoardProps) => {
  const { t } = useTranslation();
  const [cards, setCards] = useState<KanbanCardModel[]>([]);
  const [dragPath, setDragPath] = useState<string | null>(null);

  const recompute = useCallback(() => {
    const files = ydoc.getMap<Y.Text>("files");
    const next: KanbanCardModel[] = [];
    for (const p of folderPaths) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, folderPaths)) continue;
      const yt = files.get(p) as Y.Text | undefined;
      if (!yt) continue;
      const raw = yt.toString();
      next.push({
        path: p,
        title: getCardTitle(p, raw),
        column: readColumn(raw, parsed.groupByProperty),
        order: readOrder(raw),
        tags: readTagsFromFrontmatter(raw)
      });
    }
    next.sort((a, b) => {
      if (a.column !== b.column) return a.column.localeCompare(b.column);
      return a.order - b.order || a.title.localeCompare(b.title);
    });
    setCards(next);
  }, [ydoc, folderPaths, parsed.filterPrefix, parsed.groupByProperty]);

  useEffect(() => {
    recompute();
    const files = ydoc.getMap<Y.Text>("files");
    const mapObs = (): void => {
      recompute();
    };
    files.observe(mapObs);
    const textObservers: Array<{ text: Y.Text; fn: () => void }> = [];
    for (const p of folderPaths) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, folderPaths)) continue;
      const text = files.get(p);
      if (!(text instanceof Y.Text)) continue;
      const fn = (): void => {
        recompute();
      };
      text.observe(fn);
      textObservers.push({ text, fn });
    }
    return () => {
      files.unobserve(mapObs);
      for (const { text, fn } of textObservers) {
        text.unobserve(fn);
      }
    };
  }, [ydoc, recompute, folderPaths, parsed.filterPrefix]);

  const columns = useMemo(() => buildColumns(cards, parsed.columnOrder), [cards, parsed.columnOrder]);

  const cardsByColumn = useMemo(() => {
    const m = new Map<string, KanbanCardModel[]>();
    for (const col of columns) m.set(col, []);
    for (const c of cards) {
      if (!m.has(c.column)) m.set(c.column, []);
      m.get(c.column)!.push(c);
    }
    for (const [, list] of m) {
      list.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
    }
    return m;
  }, [cards, columns]);

  const applyMove = (path: string, targetColumn: string): void => {
    const files = ydoc.getMap<Y.Text>("files");
    const yt = files.get(path) as Y.Text | undefined;
    if (!yt) return;
    const colCards = cards.filter((c) => c.column === targetColumn && c.path !== path);
    const maxOrder = colCards.reduce((acc, c) => Math.max(acc, Number.isFinite(c.order) ? c.order : 0), -1);
    const nextOrder = maxOrder + 1;
    const patch: Record<string, unknown | undefined> =
      targetColumn === NO_VALUE_COLUMN
        ? { [parsed.groupByProperty]: undefined, [KANBAN_ORDER_KEY]: nextOrder }
        : { [parsed.groupByProperty]: targetColumn, [KANBAN_ORDER_KEY]: nextOrder };
    ydoc.transact(() => {
      const ok = applyFrontmatterPatchToYText(yt, patch);
      if (!ok) {
        console.warn("Markpad Kanban: impossible de fusionner le frontmatter (YAML invalide ?).");
      }
    });
  };

  const onDragStart = (path: string): void => {
    setDragPath(path);
  };

  const onDragEnd = (): void => {
    setDragPath(null);
  };

  const onDragOver = (e: DragEvent): void => {
    e.preventDefault();
  };

  const onDropCol = (col: string) => (e: DragEvent): void => {
    e.preventDefault();
    const path = e.dataTransfer.getData("text/markpad-path") || dragPath;
    if (!path) return;
    applyMove(path, col);
    setDragPath(null);
  };

  return (
    <div className="base-kanban">
      <p className="base-kanban__hint">{t("kanban.hint")}</p>
      <div className="base-kanban__board">
        {columns.map((col) => (
          <div
            key={col}
            className="base-kanban__column"
            data-column={col}
            onDragOver={onDragOver}
            onDrop={onDropCol(col)}
          >
            <header className="base-kanban__col-head">{col}</header>
            <div className="base-kanban__cards">
              {(cardsByColumn.get(col) ?? []).map((c) => (
                <div
                  key={c.path}
                  draggable
                  className={`base-kanban__card${dragPath === c.path ? " base-kanban__card--drag" : ""}`}
                  title={c.path}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    onOpenCard?.(c.path);
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/markpad-path", c.path);
                    e.dataTransfer.effectAllowed = "move";
                    onDragStart(c.path);
                  }}
                  onDragEnd={onDragEnd}
                >
                  <span className="base-kanban__card-title">{c.title}</span>
                  {c.tags.length > 0 ? (
                    <div className="base-kanban__card-tags">
                      {c.tags.map((tg) => (
                        <span key={`${c.path}:${tg}`} className="base-kanban__tag">
                          {tg.replace(/^#/, "")}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="base-kanban__card-path">{c.path.split("/").pop()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
