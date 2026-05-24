import * as Y from "yjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  applyMetaPatchToYMap,
  getFileEntry,
  getMetaYMap,
  metaMapToRecord,
  readTagsFromMeta
} from "@markpad/collab-note";
import type { CollabRuntime } from "../collab/editor";

const TAG_SPLIT = /[,;\s#]+/g;

function parseTagsFromInput(s: string): string[] {
  const parts = s.split(TAG_SPLIT);
  const out: string[] = [];
  for (const p of parts) {
    const t = p.trim().replace(/^#+/u, "");
    if (t) out.push(t);
  }
  return [...new Set(out)];
}

export type KanbanNoteModalProps = {
  open: boolean;
  path: string | null;
  runtime: CollabRuntime;
  folderPaths: string[];
  onClose: () => void;
};

export const KanbanNoteModal = ({
  open,
  path,
  runtime,
  folderPaths,
  onClose
}: KanbanNoteModalProps) => {
  const { t } = useTranslation();
  const editorHostRef = useRef<HTMLDivElement>(null);
  const [tagsInput, setTagsInput] = useState("");
  const tagsDebounceRef = useRef<number | null>(null);

  const pushTagsToY = useCallback(
    (raw: string) => {
      if (!path) return;
      const entry = getFileEntry(runtime.doc, path);
      if (!entry) return;
      const tags = parseTagsFromInput(raw);
      applyMetaPatchToYMap(
        runtime.doc,
        getMetaYMap(entry),
        { tags: tags.length ? tags : undefined, tag: undefined },
        "markpad-kanban-tags"
      );
    },
    [path, runtime.doc]
  );

  useEffect(() => {
    if (!open || !path) return;
    const entry = getFileEntry(runtime.doc, path);
    if (!entry) return;
    const metaMap = getMetaYMap(entry);
    const syncTags = (): void => {
      setTagsInput(readTagsFromMeta(metaMapToRecord(metaMap)).join(", "));
    };
    syncTags();
    metaMap.observe(syncTags);
    return () => metaMap.unobserve(syncTags);
  }, [open, path, runtime.doc]);

  useEffect(() => {
    if (!open || !path) return;
    const host = editorHostRef.current;
    if (!host) return;
    runtime.switchActiveFile(path, folderPaths);
    runtime.reparent(host);
    const raf = window.requestAnimationFrame(() => runtime.refreshLayout());
    return () => window.cancelAnimationFrame(raf);
  }, [open, path, runtime, folderPaths]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(
    () => () => {
      if (tagsDebounceRef.current != null) {
        window.clearTimeout(tagsDebounceRef.current);
      }
    },
    []
  );

  if (!open || !path) return null;

  const fileName = path.split("/").pop() ?? path;

  return (
    <div
      className="kanban-modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="kanban-modal kanban-modal--editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kanban-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="kanban-modal__head">
          <h2 id="kanban-modal-title" className="kanban-modal__title">
            {fileName}
          </h2>
          <button
            type="button"
            className="kanban-modal__close"
            onClick={onClose}
            aria-label={t("kanban.modalClose")}
          >
            ×
          </button>
        </header>
        <div className="kanban-modal__tags-row">
          <label className="kanban-modal__label" htmlFor="kanban-modal-tags">
            {t("kanban.modalTags")}
          </label>
          <input
            id="kanban-modal-tags"
            type="text"
            className="kanban-modal__input"
            value={tagsInput}
            onChange={(e) => {
              const v = e.target.value;
              setTagsInput(v);
              if (tagsDebounceRef.current != null) {
                window.clearTimeout(tagsDebounceRef.current);
              }
              tagsDebounceRef.current = window.setTimeout(() => {
                tagsDebounceRef.current = null;
                pushTagsToY(v);
              }, 350);
            }}
            placeholder={t("kanban.modalTagsPlaceholder")}
            autoComplete="off"
          />
          <p className="kanban-modal__hint">{t("kanban.modalTagsHintLive")}</p>
        </div>
        <div className="kanban-modal__editor-host">
          <div ref={editorHostRef} className="editor kanban-modal__cm" />
        </div>
      </div>
    </div>
  );
};
