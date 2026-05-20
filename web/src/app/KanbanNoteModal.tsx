import * as Y from "yjs";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  healNoteYTextIfNeeded,
  normalizeNoteDocument,
  patchFrontmatterRecord,
  readTagsFromFrontmatter
} from "../base/patchFrontmatter";

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
  ydoc: Y.Doc;
  onClose: () => void;
};

export const KanbanNoteModal = ({ open, path, ydoc, onClose }: KanbanNoteModalProps) => {
  const { t } = useTranslation();
  const [fullText, setFullText] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const refreshFromY = useCallback(() => {
    if (!path) return;
    const files = ydoc.getMap<Y.Text>("files");
    const yt = files.get(path);
    if (!(yt instanceof Y.Text)) return;
    const raw = healNoteYTextIfNeeded(yt);
    setFullText(raw);
    setTagsInput(readTagsFromFrontmatter(raw).join(", "));
  }, [path, ydoc]);

  useEffect(() => {
    if (!open || !path) return;
    refreshFromY();
  }, [open, path, refreshFromY]);

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

  const save = (): void => {
    if (!path) return;
    const files = ydoc.getMap<Y.Text>("files");
    const yt = files.get(path);
    if (!(yt instanceof Y.Text)) return;
    const tags = parseTagsFromInput(tagsInput);
    const base = normalizeNoteDocument(fullText);
    const merged = patchFrontmatterRecord(base, {
      tags: tags.length ? tags : undefined,
      tag: undefined
    });
    const doc = yt.doc;
    const write = (): void => {
      const len = yt.length;
      if (len > 0) yt.delete(0, len);
      yt.insert(0, merged);
    };
    if (doc) doc.transact(write, "markpad-kanban-modal");
    else write();
    onClose();
  };

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
        className="kanban-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="kanban-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="kanban-modal__head">
          <h2 id="kanban-modal-title" className="kanban-modal__title">
            {fileName}
          </h2>
          <button type="button" className="kanban-modal__close" onClick={onClose} aria-label={t("kanban.modalClose")}>
            ×
          </button>
        </header>
        <div className="kanban-modal__body">
          <label className="kanban-modal__label" htmlFor="kanban-modal-tags">
            {t("kanban.modalTags")}
          </label>
          <input
            id="kanban-modal-tags"
            type="text"
            className="kanban-modal__input"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder={t("kanban.modalTagsPlaceholder")}
            autoComplete="off"
          />
          <p className="kanban-modal__hint">{t("kanban.modalTagsHint")}</p>
          <label className="kanban-modal__label" htmlFor="kanban-modal-body">
            {t("kanban.modalContent")}
          </label>
          <textarea
            id="kanban-modal-body"
            className="kanban-modal__textarea"
            spellCheck={false}
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
            rows={18}
          />
        </div>
        <footer className="kanban-modal__footer">
          <button type="button" className="me-btn-secondary" onClick={onClose}>
            {t("kanban.modalCancel")}
          </button>
          <button type="button" className="me-btn-primary" onClick={save}>
            {t("kanban.modalSave")}
          </button>
        </footer>
      </div>
    </div>
  );
};
