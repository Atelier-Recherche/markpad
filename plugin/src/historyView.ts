import { ItemView, WorkspaceLeaf } from "obsidian";

export const MARKPAD_HISTORY_VIEW_TYPE = "markpad-history";

export type MarkpadHistoryApi = {
  settings: { locale: string; serverUrl: string };
  getActiveSharedRoom(): { roomId: string; filePath: string | null; kind: "note" | "folder" } | null;
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
    await this.loadAndRender();
  }

  public async onClose(): Promise<void> {}

  public async refresh(): Promise<void> {
    this.selectedId = null;
    this.fullSnapshot = null;
    await this.loadAndRender();
  }

  private async loadAndRender(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("markpad-history-view");
    contentEl.style.padding = "10px";
    contentEl.style.overflow = "auto";

    const isEn = this.plugin.settings.locale === "en";
    const room = this.plugin.getActiveSharedRoom();

    if (!room) {
      contentEl.createDiv({
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

    const header = contentEl.createDiv();
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "10px";

    const title = header.createEl("strong");
    title.setText(isEn ? "History" : "Historique");

    const refreshBtn = header.createEl("button", { text: isEn ? "↺ Refresh" : "↺ Rafraîchir" });
    refreshBtn.style.fontSize = "11px";
    refreshBtn.addEventListener("click", () => void this.refresh());

    const statusEl = contentEl.createDiv();
    statusEl.style.fontSize = "11px";
    statusEl.style.opacity = "0.7";
    statusEl.style.marginBottom = "6px";
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
        text: isEn ? "No snapshots yet." : "Aucun snapshot disponible."
      });
      return;
    }

    const list = contentEl.createEl("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    list.style.margin = "0";

    for (const snap of this.snapshots) {
      const item = list.createEl("li");
      item.style.marginBottom = "8px";
      item.style.paddingBottom = "6px";
      item.style.borderBottom = "1px solid var(--background-modifier-border)";

      const btn = item.createEl("button");
      btn.style.width = "100%";
      btn.style.textAlign = "left";
      btn.style.background = "none";
      btn.style.border = "none";
      btn.style.padding = "4px 0";
      btn.style.cursor = "pointer";
      btn.style.color = "var(--text-normal)";

      const dateSpan = btn.createEl("span");
      dateSpan.style.fontSize = "12px";
      dateSpan.style.fontWeight = "600";
      dateSpan.style.display = "block";
      dateSpan.setText(formatDate(snap.snapshot_at));

      const metaSpan = btn.createEl("span");
      metaSpan.style.fontSize = "11px";
      metaSpan.style.opacity = "0.7";
      metaSpan.style.display = "block";
      const charLabel = isEn ? "characters" : "caractères";
      metaSpan.setText(`${snap.content_length} ${charLabel}`);

      if (snap.file_path) {
        const fileSpan = btn.createEl("span");
        fileSpan.style.fontSize = "11px";
        fileSpan.style.opacity = "0.6";
        fileSpan.style.display = "block";
        fileSpan.setText(snap.file_path.split("/").pop() ?? snap.file_path);
      }

      const contentContainer = item.createEl("div");
      contentContainer.style.display = "none";

      if (this.selectedId === snap.id && this.fullSnapshot) {
        contentContainer.style.display = "block";
        this.renderContent(contentContainer, this.fullSnapshot.content);
      }

      btn.addEventListener("click", () => {
        void (async () => {
          if (this.selectedId === snap.id) {
            this.selectedId = null;
            this.fullSnapshot = null;
            contentContainer.style.display = "none";
            return;
          }
          this.selectedId = snap.id;
          contentContainer.style.display = "block";
          contentContainer.empty();
          const loadingEl = contentContainer.createEl("p");
          loadingEl.setText(isEn ? "Loading…" : "Chargement…");
          loadingEl.style.fontSize = "11px";

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
            this.renderContent(contentContainer, full.content);
          } catch {
            contentContainer.empty();
            contentContainer.createEl("p").setText(isEn ? "Network error." : "Erreur réseau.");
          }
        })();
      });
    }
  }

  private renderContent(container: HTMLElement, content: string): void {
    const pre = container.createEl("pre");
    pre.style.fontSize = "10px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";
    pre.style.maxHeight = "300px";
    pre.style.overflow = "auto";
    pre.style.background = "var(--background-secondary)";
    pre.style.padding = "6px";
    pre.style.borderRadius = "4px";
    pre.style.marginTop = "4px";
    pre.setText(content);
  }
}
