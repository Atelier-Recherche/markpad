import {
  App,
  MarkdownView,
  Notice,
  Plugin,
  PluginManifest,
  TFile
} from "obsidian";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { createCollabExtension, setEditorExtensions } from "./codemirrorBinding";
import { createShareSession } from "./shareSession";
import {
  DEFAULT_SETTINGS,
  MarkpadSettings,
  MarkpadSettingTab
} from "./settings";

type ActiveRuntime = {
  filePath: string;
  shareUrl: string;
  roomId: string;
  roomPassword?: string;
  doc: Y.Doc;
  provider: WebsocketProvider;
};

export default class MarkpadPlugin extends Plugin {
  public settings: MarkpadSettings = DEFAULT_SETTINGS;
  private activeRuntime: ActiveRuntime | null = null;
  private statusBarEl: HTMLElement | null = null;
  private decoratedEls = new Set<HTMLElement>();

  public constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  public async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new MarkpadSettingTab(this.app, this));
    this.statusBarEl = this.addStatusBarItem();
    this.updateStatusBar("off");

    this.addCommand({
      id: "markpad-start-sharing",
      name: "Start Sharing",
      callback: () => void this.startSharing()
    });

    this.addRibbonIcon("share-2", "Markpad: Start Sharing", () => {
      void this.startSharing();
    });

    this.addCommand({
      id: "markpad-copy-share-link",
      name: "Copy Share Link",
      callback: () => void this.copyShareLink()
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!this.activeRuntime || !(file instanceof TFile)) return;
        if (file.path !== this.activeRuntime.filePath) return;
        menu.addItem((item) =>
          item
            .setTitle("Markpad: Copy share link")
            .setIcon("copy")
            .onClick(() => void this.copyShareLink())
        );
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => this.decorateSharedUi())
    );
    this.registerEvent(
      this.app.workspace.on("layout-change", () => this.decorateSharedUi())
    );
    this.registerEvent(
      this.app.workspace.on("file-open", () => this.decorateSharedUi())
    );
    this.registerDomEvent(document, "click", (event) => {
      const trigger = (event.target as HTMLElement | null)?.closest(
        ".markpad-shared-indicator"
      ) as HTMLElement | null;
      if (!trigger || !this.activeRuntime) return;
      event.preventDefault();
      void this.copyShareLink();
    });

    this.statusBarEl?.addEventListener("click", () => this.showConnectedUsers());
  }

  public onunload(): void {
    this.disconnect();
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  private async loadSettings(): Promise<void> {
    const loaded = await this.loadData();
    this.settings = { ...DEFAULT_SETTINGS, ...(loaded ?? {}) };
  }

  private getActiveMarkdownFileAndView():
    | { file: TFile; view: MarkdownView }
    | undefined {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) return undefined;
    const file = view.file;
    if (!file) return undefined;
    return { file, view };
  }

  private async startSharing(): Promise<void> {
    if (!this.settings.apiKey || !this.settings.userId) {
      new Notice("Configure API key et user ID avant de partager.");
      return;
    }

    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      new Notice("Ouvre une note Markdown pour démarrer Markpad.");
      return;
    }

    this.disconnect();

    try {
      const created = await createShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        noteId: active.file.path,
        roomPassword: this.settings.defaultRoomPassword || undefined
      });

      const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
      const doc = new Y.Doc();
      const initialContent = active.view.editor.getValue();
      const provider = new WebsocketProvider(
        `${wsBase}/ws`,
        created.roomId,
        doc,
        {
          params: {
            userId: this.settings.userId,
            name: this.settings.displayName,
            color: this.settings.color,
            password: this.settings.defaultRoomPassword
          }
        }
      );

      provider.awareness.setLocalStateField("user", {
        name: this.settings.displayName,
        color: this.settings.color
      });
      const yText = doc.getText("content");
      const seedIfEmpty = () => {
        if (yText.length === 0 && initialContent.length > 0) {
          doc.transact(() => {
            yText.insert(0, initialContent);
          }, "markpad-seed");
        }
      };
      provider.on("sync", (isSynced: boolean) => {
        if (isSynced) {
          seedIfEmpty();
        }
      });
      provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
      provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
        if (event.status === "connected") {
          this.updatePresenceInStatusBar(provider);
          return;
        }
        if (event.status === "connecting") {
          this.updateStatusBar("connecting");
          return;
        }
        this.updateStatusBar("offline");
      });

      const editorAny = active.view.editor as unknown as { cm?: unknown };
      const cm = editorAny.cm as import("@codemirror/view").EditorView | null;

      if (!cm) {
        provider.destroy();
        doc.destroy();
        new Notice("Impossible de lier CodeMirror pour cette vue.");
        return;
      }

      setEditorExtensions(cm, createCollabExtension(doc, provider.awareness));

      await navigator.clipboard.writeText(created.shareUrl);
      new Notice(`Lien copié: ${created.shareUrl}`);
      this.activeRuntime = {
        filePath: active.file.path,
        shareUrl: created.shareUrl,
        roomId: created.roomId,
        roomPassword: this.settings.defaultRoomPassword || undefined,
        doc,
        provider
      };
      this.decorateSharedUi();
      this.updatePresenceInStatusBar(provider);
    } catch (error) {
      this.updateStatusBar("error");
      new Notice(`Markpad erreur: ${(error as Error).message}`);
    }
  }

  private disconnect(): void {
    if (!this.activeRuntime) return;
    this.activeRuntime.provider.destroy();
    this.activeRuntime.doc.destroy();
    this.activeRuntime = null;
    this.clearDecorations();
    this.updateStatusBar("off");
  }

  private updatePresenceInStatusBar(provider: WebsocketProvider): void {
    const allUsers = Array.from(provider.awareness.getStates().keys());
    const others = allUsers.filter((id) => id !== provider.doc.clientID).length;
    this.updateStatusBar("connected", others);
  }

  private updateStatusBar(
    status: "off" | "connecting" | "connected" | "offline" | "error",
    remoteCount = 0
  ): void {
    if (!this.statusBarEl) return;
    switch (status) {
      case "off":
        this.statusBarEl.setText("Markpad: off");
        break;
      case "connecting":
        this.statusBarEl.setText("Markpad: connexion...");
        break;
      case "connected":
        this.statusBarEl.setText(`Markpad: en ligne (${remoteCount + 1})`);
        break;
      case "offline":
        this.statusBarEl.setText("Markpad: hors-ligne");
        break;
      case "error":
        this.statusBarEl.setText("Markpad: erreur");
        break;
    }
  }

  private async copyShareLink(): Promise<void> {
    if (!this.activeRuntime) {
      new Notice("Aucune session Markpad active.");
      return;
    }
    await navigator.clipboard.writeText(this.activeRuntime.shareUrl);
    new Notice("Lien de partage copié.");
  }

  private showConnectedUsers(): void {
    if (!this.activeRuntime) {
      new Notice("Markpad: aucun partage actif.");
      return;
    }
    const states = Array.from(this.activeRuntime.provider.awareness.getStates().values());
    const names = states
      .map((state) => (state.user as { name?: string } | undefined)?.name ?? "Anonymous")
      .filter((name, idx, arr) => arr.indexOf(name) === idx);
    if (names.length === 0) {
      new Notice("Markpad: aucun participant connecté.");
      return;
    }
    new Notice(`Connectés: ${names.join(", ")}`);
  }

  private clearDecorations(): void {
    for (const el of this.decoratedEls) {
      el.remove();
    }
    this.decoratedEls.clear();
  }

  private decorateSharedUi(): void {
    this.clearDecorations();
    if (!this.activeRuntime) return;
    const targetPath = this.activeRuntime.filePath;

    const fileTitles = document.querySelectorAll<HTMLElement>(".nav-file-title[data-path]");
    fileTitles.forEach((title) => {
      if (title.getAttribute("data-path") !== targetPath) return;
      const icon = this.buildSharedIndicator();
      title.appendChild(icon);
      this.decoratedEls.add(icon);
    });

    const tabHeaders = document.querySelectorAll<HTMLElement>(
      ".workspace-tab-header[data-path]"
    );
    tabHeaders.forEach((tab) => {
      if (tab.getAttribute("data-path") !== targetPath) return;
      const titleEl =
        tab.querySelector<HTMLElement>(".workspace-tab-header-inner-title") ?? tab;
      const icon = this.buildSharedIndicator();
      titleEl.appendChild(icon);
      this.decoratedEls.add(icon);
    });
  }

  private buildSharedIndicator(): HTMLElement {
    const indicator = document.createElement("span");
    indicator.className = "markpad-shared-indicator";
    indicator.textContent = " 🔗";
    indicator.title = "Markpad partagé (clic ou clic droit pour copier le lien)";
    return indicator;
  }
}
