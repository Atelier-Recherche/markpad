import { ItemView, Notice, WorkspaceLeaf } from "obsidian";

export const MARKPAD_SHARES_VIEW_TYPE = "markpad-shares";

/** Évite une dépendance circulaire avec `main.ts`. */
export type MarkpadSharesApi = {
  settings: { locale: string };
  getSharesForPanel(): SharePanelRow[];
  deleteShareFromPanel(row: SharePanelRow): Promise<void>;
};

export type SharePanelRow = {
  kind: "folder" | "note";
  label: string;
  pathKey: string;
  shareUrl: string;
  roomId: string;
};

export class MarkpadSharesView extends ItemView {
  public constructor(leaf: WorkspaceLeaf, private readonly plugin: MarkpadSharesApi) {
    super(leaf);
  }

  public getViewType(): string {
    return MARKPAD_SHARES_VIEW_TYPE;
  }

  public getDisplayText(): string {
    return this.plugin.settings.locale === "en" ? "Markpad shares" : "Partages Markpad";
  }

  public getIcon(): string {
    return "share-2";
  }

  public async onOpen(): Promise<void> {
    this.render();
  }

  public async onClose(): Promise<void> {}

  public refresh(): void {
    this.render();
  }

  private render(): void {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("markpad-shares-view");
    contentEl.style.padding = "10px";
    contentEl.style.overflow = "auto";

    const rows = this.plugin.getSharesForPanel();
    if (rows.length === 0) {
      contentEl.createDiv({
        text:
          this.plugin.settings.locale === "en"
            ? "No active shares."
            : "Aucun partage actif."
      });
      return;
    }

    for (const row of rows) {
      const wrap = contentEl.createDiv();
      wrap.style.marginBottom = "12px";
      wrap.style.paddingBottom = "8px";
      wrap.style.borderBottom = "1px solid var(--background-modifier-border)";

      const title = wrap.createDiv();
      title.style.fontSize = "12px";
      title.style.fontWeight = "600";
      title.style.wordBreak = "break-all";
      title.setText(
        row.kind === "folder"
          ? `📁 ${row.label}`
          : `📄 ${row.label}`
      );

      const link = wrap.createEl("a", {
        href: row.shareUrl,
        cls: "external-link"
      });
      link.setText(row.shareUrl);
      link.style.display = "block";
      link.style.fontSize = "11px";
      link.style.marginTop = "4px";
      link.style.opacity = "0.85";

      const actions = wrap.createDiv();
      actions.style.display = "flex";
      actions.style.gap = "8px";
      actions.style.marginTop = "8px";

      const copyBtn = actions.createEl("button", { text: "Copier le lien", cls: "mod-cta" });
      copyBtn.addEventListener("click", () => {
        void navigator.clipboard.writeText(row.shareUrl);
        new Notice("Lien copié.");
      });

      const delBtn = actions.createEl("button", { text: "Supprimer le partage" });
      delBtn.addEventListener("click", () => {
        void (async () => {
          await this.plugin.deleteShareFromPanel(row);
          this.refresh();
        })();
      });
    }
  }
}
