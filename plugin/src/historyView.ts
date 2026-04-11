import DiffMatchPatch from "diff-match-patch";
import { ItemView, setIcon, WorkspaceLeaf } from "obsidian";

export const MARKPAD_HISTORY_VIEW_TYPE = "markpad-history";

const MARKPAD_HISTORY_VIEW_STYLE_ID = "markpad-history-view-style";
const MARKPAD_HISTORY_VIEW_CSS = `
.markpad-history-view {
  padding: 10px;
  overflow: auto;
}

.markpad-history-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.markpad-history-title {
  margin: 0;
  font-size: 0.95em;
  font-weight: 600;
  flex: 1;
  min-width: 0;
}

.markpad-history-refresh {
  flex-shrink: 0;
}

.markpad-history-status,
.markpad-history-empty {
  font-size: 13px;
  opacity: 0.75;
  margin: 0;
}

.markpad-history-entries {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.markpad-history-row {
  width: 100%;
  text-align: left;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-normal);
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font: inherit;
}

.markpad-history-row:hover {
  background: color-mix(in srgb, var(--background-modifier-hover) 60%, transparent);
}

.markpad-history-row--active {
  border-color: var(--interactive-accent);
  background: color-mix(in srgb, var(--interactive-accent) 12%, transparent);
}

.markpad-history-row__date {
  font-weight: 600;
  font-size: 13px;
}

.markpad-history-row__meta {
  font-size: 11px;
  opacity: 0.65;
}

.markpad-history-row__file {
  font-size: 11px;
  opacity: 0.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.markpad-history-preview {
  margin-top: 6px;
  padding-left: 6px;
  border-left: 2px solid color-mix(in srgb, var(--interactive-accent) 45%, transparent);
}

.markpad-history-diff-legend {
  margin: 0 0 6px;
  font-size: 11px;
  opacity: 0.7;
  line-height: 1.35;
}

.markpad-history-diff-scroll {
  max-height: 300px;
  overflow: auto;
  border-radius: 8px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  padding: 8px 10px;
}

.markpad-history-diff-body {
  font-family: var(--font-monospace);
  font-size: 11px;
  line-height: 1.45;
  word-break: break-word;
}

.markpad-history-diff-removed {
  background: rgba(239, 68, 68, 0.18);
  border-radius: 2px;
}
`;

export type MarkpadHistoryApi = {
  settings: { locale: string; serverUrl: string };
  getActiveSharedRoom(): { roomId: string; filePath: string | null; kind: "note" | "folder" } | null;
  /** Texte Yjs du document actif (pour comparaison avec un snapshot). */
  getActiveSharedDocumentText(): string | null;
};

type SnapshotMeta = {
  id: number;
  room_id: string;
  file_path: string | null;
  content_length: number;
  snapshot_at: string;
};

type SnapshotFull = SnapshotMeta & { content: string };

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export class MarkpadHistoryView extends ItemView {
  private selectedId: number | null = null;
  private snapshots: SnapshotMeta[] = [];
  private fullSnapshot: SnapshotFull | null = null;
  private lastRoomKey: string | null = null;
  private previewContainerEl: HTMLElement | null = null;
  private pendingUpdateTimer: ReturnType<typeof window.setTimeout> | null = null;

  private ensureStyles(): void {
    if (document.getElementById(MARKPAD_HISTORY_VIEW_STYLE_ID)) return;
    const styleEl = document.createElement("style");
    styleEl.id = MARKPAD_HISTORY_VIEW_STYLE_ID;
    styleEl.textContent = MARKPAD_HISTORY_VIEW_CSS;
    document.head.appendChild(styleEl);
  }

  private computeRoomKey(): string {
    const room = this.plugin.getActiveSharedRoom();
    if (!room) return "none";
    return `${room.kind}:${room.roomId}:${room.filePath ?? ""}`;
  }

  public constructor(leaf: WorkspaceLeaf, private readonly plugin: MarkpadHistoryApi) {
    super(leaf);
  }

  public getViewType(): string {
    return MARKPAD_HISTORY_VIEW_TYPE;
  }

  public getDisplayText(): string {
    return this.plugin.settings.locale === "en" ? "Markpad history" : "Historique Markpad";
  }

  public getIcon(): string {
    return "clock";
  }

  public async onOpen(): Promise<void> {
    this.ensureStyles();
    this.lastRoomKey = this.computeRoomKey();
    await this.loadAndRender();

    // Rafraîchir automatiquement si l'utilisateur change de fichier partagé.
    // (On décode après un tick pour laisser à Obsidian / au plugin le temps de mettre à jour `activeRuntime`.)
    this.registerEvent(
      this.app.workspace.on("file-open", () => {
        if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
        this.pendingUpdateTimer = window.setTimeout(() => void this.handleActiveRoomChange(), 520);
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
        this.pendingUpdateTimer = window.setTimeout(() => void this.handleActiveRoomChange(), 520);
      })
    );
  }

  public async onClose(): Promise<void> {
    if (this.pendingUpdateTimer) window.clearTimeout(this.pendingUpdateTimer);
    this.pendingUpdateTimer = null;
  }

  public async refresh(): Promise<void> {
    this.selectedId = null;
    this.fullSnapshot = null;
    this.previewContainerEl = null;
    await this.loadAndRender();
  }

  private async loadAndRender(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("markpad-history-view");
    this.previewContainerEl = null;

    const isEn = this.plugin.settings.locale === "en";
    const room = this.plugin.getActiveSharedRoom();
    this.lastRoomKey = this.computeRoomKey();

    if (!room) {
      contentEl.createDiv({
        cls: "markpad-history-empty",
        text: isEn
          ? "No active shared note. Open a Markpad-shared note to see its history."
          : "Aucune note partagée active. Ouvrez une note partagée Markpad pour voir son historique."
      });
      return;
    }

    const serverUrl = this.plugin.settings.serverUrl.replace(/\/$/, "");
    let url = `${serverUrl}/sessions/${encodeURIComponent(room.roomId)}/history`;
    if (room.kind === "folder" && room.filePath) {
      url += `?filePath=${encodeURIComponent(room.filePath)}`;
    }

    const head = contentEl.createDiv({ cls: "markpad-history-head" });
    head.createEl("h3", {
      cls: "markpad-history-title",
      text: isEn ? "History" : "Historique"
    });
    const refreshBtn = head.createEl("button", {
      cls: "clickable-icon markpad-history-refresh",
      attr: { "aria-label": isEn ? "Refresh" : "Rafraîchir" }
    });
    setIcon(refreshBtn, "refresh-cw");
    refreshBtn.addEventListener("click", () => void this.refresh());

    const statusEl = contentEl.createDiv({ cls: "markpad-history-status" });
    statusEl.setText(isEn ? "Loading…" : "Chargement…");

    try {
      const res = await fetch(url);
      if (!res.ok) {
        statusEl.setText(isEn ? "Failed to load history." : "Impossible de charger l'historique.");
        return;
      }
      const data = (await res.json()) as { snapshots: SnapshotMeta[] };
      this.snapshots = data.snapshots;
    } catch {
      statusEl.setText(isEn ? "Network error." : "Erreur réseau.");
      return;
    }

    statusEl.remove();

    if (this.snapshots.length === 0) {
      contentEl.createDiv({
        cls: "markpad-history-empty",
        text: isEn ? "No snapshots yet." : "Aucun snapshot disponible."
      });
      return;
    }

    const entries = contentEl.createDiv({ cls: "markpad-history-entries" });

    for (const snap of this.snapshots) {
      const block = entries.createDiv({ cls: "markpad-history-block" });

      const btn = block.createEl("button", {
        cls: "markpad-history-row",
        attr: { type: "button" }
      });
      if (this.selectedId === snap.id) {
        btn.addClass("markpad-history-row--active");
      }

      btn.createSpan({ cls: "markpad-history-row__date", text: formatDate(snap.snapshot_at) });
      const charLabel = isEn ? "characters" : "caractères";
      btn.createSpan({
        cls: "markpad-history-row__meta",
        text: `${snap.content_length} ${charLabel}`
      });
      if (snap.file_path) {
        btn.createSpan({
          cls: "markpad-history-row__file",
          attr: { title: snap.file_path },
          text: snap.file_path.split("/").pop() ?? snap.file_path
        });
      }

      const contentContainer = block.createDiv({ cls: "markpad-history-preview" });
      contentContainer.style.display = "none";

      if (this.selectedId === snap.id && this.fullSnapshot) {
        contentContainer.style.display = "block";
        this.previewContainerEl = contentContainer;
        this.renderDiffContent(contentContainer, this.fullSnapshot.content, isEn);
      }

      btn.addEventListener("click", () => {
        void (async () => {
          if (this.selectedId === snap.id) {
            this.selectedId = null;
            this.fullSnapshot = null;
            this.previewContainerEl = null;
            contentContainer.style.display = "none";
            btn.removeClass("markpad-history-row--active");
            return;
          }
          this.selectedId = snap.id;
          btn.addClass("markpad-history-row--active");
          for (const other of entries.querySelectorAll(".markpad-history-row")) {
            if (other !== btn) other.classList.remove("markpad-history-row--active");
          }
          contentContainer.style.display = "block";
          contentContainer.empty();
          const loadingEl = contentContainer.createEl("p", { cls: "markpad-history-status" });
          loadingEl.setText(isEn ? "Loading…" : "Chargement…");

          try {
            const res = await fetch(
              `${serverUrl}/sessions/${encodeURIComponent(room.roomId)}/history/${snap.id}`
            );
            if (!res.ok) {
              contentContainer.empty();
              contentContainer.createEl("p").setText(
                isEn ? "Failed to load snapshot." : "Impossible de charger ce snapshot."
              );
              return;
            }
            const full = (await res.json()) as SnapshotFull;
            this.fullSnapshot = full;
            contentContainer.empty();
            this.previewContainerEl = contentContainer;
            this.renderDiffContent(contentContainer, full.content, isEn);
          } catch {
            contentContainer.empty();
            contentContainer.createEl("p").setText(isEn ? "Network error." : "Erreur réseau.");
          }
        })();
      });
    }
  }

  private async handleActiveRoomChange(): Promise<void> {
    const newKey = this.computeRoomKey();
    if (newKey !== this.lastRoomKey) {
      // L'historique dépend de (roomId, filePath) : on recharge la liste.
      this.selectedId = null;
      this.fullSnapshot = null;
      this.previewContainerEl = null;
      this.lastRoomKey = newKey;
      await this.loadAndRender();
      return;
    }

    // Même document : met à jour uniquement le surlignage diff.
    if (this.selectedId != null && this.fullSnapshot && this.previewContainerEl) {
      const isEn = this.plugin.settings.locale === "en";
      this.renderDiffContent(this.previewContainerEl, this.fullSnapshot.content, isEn);
    }
  }

  private renderDiffContent(container: HTMLElement, snapshotContent: string, isEn: boolean): void {
    container.empty();
    const current = this.plugin.getActiveSharedDocumentText() ?? "";
    const dmp = new DiffMatchPatch();
    const diffs = dmp.diff_main(snapshotContent, current);
    dmp.diff_cleanupSemantic(diffs);

    const legend = container.createDiv({ cls: "markpad-history-diff-legend" });
    legend.setText(
      isEn
        ? "Compared to the current document — highlights show what differs."
        : "Par rapport au document actuel — le surlignage indique ce qui diffère."
    );

    const scroll = container.createDiv({ cls: "markpad-history-diff-scroll" });
    const body = scroll.createDiv({ cls: "markpad-history-diff-body" });

    const DIFF_DELETE = -1;
    const DIFF_INSERT = 1;

    for (const d of diffs) {
      const op = d[0];
      const text = d[1];
      if (op === DIFF_INSERT) continue;
      const span = body.createSpan({
        cls: op === DIFF_DELETE ? "markpad-history-diff-removed" : "markpad-history-diff-equal",
        text
      });
      span.style.whiteSpace = "pre-wrap";
    }
  }
}
