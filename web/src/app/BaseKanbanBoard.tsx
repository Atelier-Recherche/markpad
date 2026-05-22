import * as Y from "yjs";
import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import {
  applyMetaPatchToYMap,
  getFileEntry,
  getMetaYMap,
  getOrCreateFileEntry,
  getBodyYText,
  getCardTitleFromNote,
  getFileEntry,
  isNoteFileEntry,
  listCollaborativeFilePaths,
  metaMapToRecord,
  readMetaNumber,
  readMetaScalar,
  readTagsFromMeta,
  upgradeLegacyFileEntry
} from "@markpad/collab-note";
import {
  fileMatchesBaseFilter,
  KANBAN_ORDER_KEY,
  NO_VALUE_COLUMN,
  type ParsedBaseKanban
} from "../base/parseBaseFile";
import { KanbanNoteModal } from "./KanbanNoteModal";

export type KanbanCardModel = {
  path: string;
  title: string;
  column: string;
  order: number;
  tags: string[];
};

const FILTER_ALL = "__all__";

const readColumn = (meta: Record<string, unknown>, prop: string): string => {
  const v = readMetaScalar(meta, prop);
  return v ?? NO_VALUE_COLUMN;
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

  const pathsToScan = useMemo(() => {
    const fromY = listCollaborativeFilePaths(ydoc);
    return [...new Set([...folderPaths, ...fromY])].sort((a, b) => a.localeCompare(b));
  }, [ydoc, folderPaths]);

  const recompute = useCallback(() => {
    const files = ydoc.getMap("files");
    const next: KanbanCardModel[] = [];
    for (const p of pathsToScan) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, pathsToScan)) continue;
      let entry: unknown = files.get(p);
      if (entry instanceof Y.Text) {
        entry = upgradeLegacyFileEntry(ydoc, p, entry, "markpad-kanban-upgrade");
      }
      if (!isNoteFileEntry(entry)) continue;
      const meta = metaMapToRecord(getMetaYMap(entry));
      const body = getBodyYText(entry).toString();
      const order = readMetaNumber(meta, KANBAN_ORDER_KEY) ?? Number.POSITIVE_INFINITY;
      next.push({
        path: p,
        title: getCardTitleFromNote(p, meta, body),
        column: readColumn(meta, parsed.groupByProperty),
        order,
        tags: readTagsFromMeta(meta)
      });
    }
    next.sort((a, b) => {
      if (a.column !== b.column) return a.column.localeCompare(b.column);
      return a.order - b.order || a.title.localeCompare(b.title);
    });
    setAllCards(next);
  }, [ydoc, pathsToScan, parsed.filterPrefix, parsed.groupByProperty]);

  useEffect(() => {
    recompute();
    const files = ydoc.getMap("files");
    const mapObs = (): void => {
      queueMicrotask(() => recompute());
    };
    files.observe(mapObs);
    const bodyObservers: Array<{ text: Y.Text; fn: () => void }> = [];
    const metaObservers: Array<{ map: Y.Map<unknown>; fn: () => void }> = [];
    for (const p of pathsToScan) {
      if (!fileMatchesBaseFilter(p, parsed.filterPrefix, pathsToScan)) continue;
      const entry = getFileEntry(ydoc, p) ?? getOrCreateFileEntry(ydoc, p);
      const body = getBodyYText(entry);
      const meta = getMetaYMap(entry);
      const fn = (): void => {
        queueMicrotask(() => recompute());
      };
      body.observe(fn);
      meta.observe(fn);
      bodyObservers.push({ text: body, fn });
      metaObservers.push({ map: meta, fn });
    }
    const onDocUpdate = (): void => {
      queueMicrotask(() => recompute());
    };
    ydoc.on("update", onDocUpdate);
    return () => {
      ydoc.off("update", onDocUpdate);
      files.unobserve(mapObs);
      for (const { text, fn } of bodyObservers) {
        text.unobserve(fn);
      }
      for (const { map, fn } of metaObservers) {
        map.unobserve(fn);
      }
    };
  }, [ydoc, recompute, pathsToScan, parsed.filterPrefix]);

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

  const resolveEntry = (path: string): ReturnType<typeof getFileEntry> => {
    const files = ydoc.getMap("files");
    const raw = files.get(path);
    if (raw instanceof Y.Text) {
      return upgradeLegacyFileEntry(ydoc, path, raw, "markpad-kanban-dnd");
    }
    return getFileEntry(ydoc, path) ?? getOrCreateFileEntry(ydoc, path);
  };

  const applyMove = (path: string, targetColumn: string): void => {
    const entry = resolveEntry(path);
    if (!isNoteFileEntry(entry)) return;
    const colCards = allCards.filter((c) => c.column === targetColumn && c.path !== path);
    const maxOrder = colCards.reduce((acc, c) => Math.max(acc, Number.isFinite(c.order) ? c.order : 0), -1);
    const nextOrder = maxOrder + 1;
    const patch: Record<string, unknown | undefined> =
      targetColumn === NO_VALUE_COLUMN
        ? { [parsed.groupByProperty]: undefined, [KANBAN_ORDER_KEY]: nextOrder }
        : { [parsed.groupByProperty]: targetColumn, [KANBAN_ORDER_KEY]: nextOrder };
    applyMetaPatchToYMap(ydoc, getMetaYMap(entry), patch, "markpad-kanban-dnd");
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
            #{tg}
          </button>
        ))}
      </div>
      <div className="base-kanban__board">
        {columns.map((col) => (
          <section
            key={col}
            className="base-kanban__column"
            onDragOver={onDragOver}
            onDrop={onDropCol(col)}
          >
            <h3 className="base-kanban__column-title">{col}</h3>
            <ul className="base-kanban__cards">
              {(cardsByColumn.get(col) ?? []).map((card) => (
                <li
                  key={card.path}
                  className={`base-kanban__card${dragPath === card.path ? " base-kanban__card--dragging" : ""}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/markpad-path", card.path);
                    e.dataTransfer.effectAllowed = "move";
                    onDragStart(card.path);
                  }}
                  onDragEnd={onDragEnd}
                >
                  <div className="base-kanban__card-head">
                    <span className="base-kanban__card-title">{card.title}</span>
                    <button
                      type="button"
                      className="base-kanban__card-edit"
                      title={t("kanban.editNote")}
                      aria-label={t("kanban.editNote")}
                      onClick={() => openEditor(card.path)}
                    >
                      <Pencil size={14} aria-hidden />
                    </button>
                  </div>
                  {card.tags.length > 0 && (
                    <div className="base-kanban__tags">
                      {card.tags.map((tg) => (
                        <span key={tg} className="base-kanban__tag">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <KanbanNoteModal
        open={modalPath != null}
        path={modalPath}
        ydoc={ydoc}
        onClose={() => setModalPath(null)}
      />
    </div>
  );
};
