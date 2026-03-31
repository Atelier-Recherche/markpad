import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type SnapshotMeta = {
  id: number;
  room_id: string;
  file_path: string | null;
  content_length: number;
  snapshot_at: string;
};

type SnapshotFull = SnapshotMeta & { content: string };

type Props = {
  roomId: string;
  httpBaseUrl: string;
  activeFilePath?: string | null;
  folderMode: boolean;
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export const HistoryPanel = ({ roomId, httpBaseUrl, activeFilePath, folderMode }: Props) => {
  const { t } = useTranslation();
  const [snapshots, setSnapshots] = useState<SnapshotMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SnapshotFull | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);

  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    setSelected(null);
    try {
      let url = `${httpBaseUrl}/sessions/${encodeURIComponent(roomId)}/history`;
      if (folderMode && activeFilePath) {
        url += `?filePath=${encodeURIComponent(activeFilePath)}`;
      }
      const res = await fetch(url);
      if (!res.ok) return;
      const data = (await res.json()) as { snapshots: SnapshotMeta[] };
      setSnapshots(data.snapshots);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [roomId, httpBaseUrl, folderMode, activeFilePath]);

  useEffect(() => {
    void fetchSnapshots();
  }, [fetchSnapshots]);

  const loadContent = async (id: number): Promise<void> => {
    if (selected?.id === id) {
      setSelected(null);
      return;
    }
    setLoadingContent(true);
    try {
      const res = await fetch(
        `${httpBaseUrl}/sessions/${encodeURIComponent(roomId)}/history/${id}`
      );
      if (!res.ok) return;
      const data = (await res.json()) as SnapshotFull;
      setSelected(data);
    } catch {
      /* ignore */
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <aside className="history-panel">
      <div className="history-panel__header">
        <h3>{t("history.title")}</h3>
        <button
          type="button"
          className="history-panel__refresh"
          title={t("history.refresh")}
          onClick={() => void fetchSnapshots()}
          aria-label={t("history.refresh")}
        >
          ↺
        </button>
      </div>

      {loading ? (
        <p className="history-panel__status">{t("history.loading")}</p>
      ) : snapshots.length === 0 ? (
        <p className="history-panel__status">{t("history.empty")}</p>
      ) : (
        <ul className="history-panel__list">
          {snapshots.map((snap) => (
            <li key={snap.id} className="history-panel__item">
              <button
                type="button"
                className={`history-panel__entry${selected?.id === snap.id ? " history-panel__entry--active" : ""}`}
                onClick={() => void loadContent(snap.id)}
              >
                <span className="history-panel__date">{formatDate(snap.snapshot_at)}</span>
                <span className="history-panel__size">
                  {t("history.chars", { count: snap.content_length })}
                </span>
                {snap.file_path ? (
                  <span className="history-panel__file" title={snap.file_path}>
                    {snap.file_path.split("/").pop() ?? snap.file_path}
                  </span>
                ) : null}
              </button>
              {selected?.id === snap.id ? (
                <pre className="history-panel__content">
                  {loadingContent ? t("history.loading") : selected.content}
                </pre>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
