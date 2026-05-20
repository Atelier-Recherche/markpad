import * as Y from "yjs";
import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import {
  fileMatchesBaseFilter,
  KANBAN_ORDER_KEY,
  NO_VALUE_COLUMN,
  type ParsedBaseKanban
} from "../base/parseBaseFile";
import {
  applyFrontmatterPatchToYText,
  getCardTitle,
  healNoteYTextIfNeeded,
  parseFrontmatterRecord,
  readTagsFromFrontmatter
} from "../base/patchFrontmatter";
import { KanbanNoteModal } from "./KanbanNoteModal";

export type KanbanCardModel = {
  path: string;
  title: string;
  column: string;
  order: number;
  tags: string[];
};

const FILTER_ALL = "__all__";

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
};

export const BaseKanbanBoard = ({ ydoc, folderPaths, parsed }: BaseKanbanBoardProps) => {
  const { t } = useTranslation();
  const [allCards, setAllCards] = useState<KanbanCardModel[]>([]);
  const [dragPath, setDragPath] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>(FILTER_ALL);
  const [modalPath, setModalPath] = useState<string | null>(null);

  const recompute = useCallback(() => {
    const files = ydoc.getMap<Y.Text>("files");
    const next: KanbanCardModel[] = [];
    for (const p of folderPaths) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, folderPaths)) continue;
      const yt = files.get(p) as Y.Text | undefined;
      if (!yt) continue;
      const raw = healNoteYTextIfNeeded(yt);
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
    setAllCards(next);
  }, [ydoc, folderPaths, parsed.filterPrefix, parsed.groupByProperty]);

  useEffect(() => {
    recompute();
    const files = ydoc.getMap<Y.Text>("files");
    const mapObs = (): void => {
      queueMicrotask(() => recompute());
    };
    files.observe(mapObs);
    const textObservers: Array<{ text: Y.Text; fn: () => void }> = [];
    for (const p of folderPaths) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, folderPaths)) continue;
      const text = files.get(p);
      if (!(text instanceof Y.Text)) continue;
      const fn = (): void => {
        queueMicrotask(() => recompute());
      };
      text.observe(fn);
      textObservers.push({ text, fn });
    }
    const onDocUpdate = (): void => {
      queueMicrotask(() => recompute());
    };
    ydoc.on("update", onDocUpdate);
    return () => {
      ydoc.off("update", onDocUpdate);
      files.unobserve(mapObs);
      for (const { text, fn } of textObservers) {
        text.unobserve(fn);
      }
    };
  }, [ydoc, recompute, folderPaths, parsed.filterPrefix]);

  const tagList = useMemo(() => {
    const set = new Set<string>();
    for (const c of allCards) for (const tg of c.tags) set.add(tg);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [allCards]);

  useEffect(() => {
    if (filterTag !== FILTER_ALL && !tagList.includes(filterTag)) {
      setFilterTag(FILTER_ALL);
    }
  }, [filterTag, tagList]);

  const cards = useMemo(() => {
    if (filterTag === FILTER_ALL) return allCards;
    return allCards.filter((c) => c.tags.includes(filterTag));
  }, [allCards, filterTag]);

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
    const colCards = allCards.filter((c) => c.column === targetColumn && c.path !== path);
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

  const openEditor = (path: string): void => {
    setModalPath(path);
  };

  return (
    <div className="base-kanban">
      <p className="base-kanban__hint">{t("kanban.hint")}</p>
      <div className="base-kanban__filter-tabs" role="tablist" aria-label={t("kanban.filterAria")}>
        <button
          type="button"
          role="tab"
          aria-selected={filterTag === FILTER_ALL}
          className={`base-kanban__filter-tab${filterTag === FILTER_ALL ? " base-kanban__filter-tab--active" : ""}`}
          onClick={() => setFilterTag(FILTER_ALL)}
        >
          {t("kanban.filterAll")}
        </button>
        {tagList.map((tg) => (
          <button
            key={tg}
            type="button"
            role="tab"
            aria-selected={filterTag === tg}
            className={`base-kanban__filter-tab${filterTag === tg ? " base-kanban__filter-tab--active" : ""}`}
            onClick={() => setFilterTag(tg)}
          >
            {tg}
          </button>
        ))}
      </div>
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
                    openEditor(c.path);
                  }}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/markpad-path", c.path);
                    e.dataTransfer.effectAllowed = "move";
                    onDragStart(c.path);
                  }}
                  onDragEnd={onDragEnd}
                >
                  <div className="base-kanban__card-head">
                    <span className="base-kanban__card-title">{c.title}</span>
                    <button
                      type="button"
                      className="base-kanban__card-edit"
                      title={t("kanban.editCard")}
                      aria-label={t("kanban.editCard")}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openEditor(c.path);
                      }}
                    >
                      <Pencil size={14} strokeWidth={2} aria-hidden />
                    </button>
                  </div>
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
      <KanbanNoteModal open={modalPath !== null} path={modalPath} ydoc={ydoc} onClose={() => setModalPath(null)} />
    </div>
  );
};
