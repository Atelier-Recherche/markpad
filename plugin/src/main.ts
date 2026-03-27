import {
  App,
  MarkdownView,
  Notice,
  TAbstractFile,
  Plugin,
  PluginManifest,
  TFile
} from "obsidian";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { createCollabExtension, setEditorExtensions } from "./codemirrorBinding";
import { createShareSession, endShareSession } from "./shareSession";
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

type PersistedShare = {
  roomId: string;
  shareUrl: string;
};
const SHARE_FRONTMATTER_KEY = "markpadShare";

export default class MarkpadPlugin extends Plugin {
  public settings: MarkpadSettings = DEFAULT_SETTINGS;
  private activeRuntime: ActiveRuntime | null = null;
  private statusBarEl: HTMLElement | null = null;
  private decoratedEls = new Set<HTMLElement>();
  private sharedNotes = new Map<string, PersistedShare>();

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
    this.addCommand({
      id: "markpad-join-shared-note",
      name: "Join Shared Note",
      callback: () => void this.joinSharedNote()
    });

    this.addRibbonIcon("share-2", "Markpad: Start Sharing", () => {
      void this.startSharing();
    });

    this.addCommand({
      id: "markpad-copy-share-link",
      name: "Copy Share Link",
      callback: () => void this.copyShareLink()
    });
    this.addCommand({
      id: "markpad-stop-sharing-current-note",
      name: "Stop Sharing Current Note",
      callback: () => void this.stopSharingCurrentNote()
    });

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (!(file instanceof TFile)) return;
        if (this.isMarkdownFile(file)) {
          menu.addItem((item) =>
            item
              .setTitle("Markpad: Start sharing this note")
              .setIcon("share-2")
              .onClick(() => void this.startSharingFromFile(file))
          );
        }
        const share = this.sharedNotes.get(file.path);
        if (!share) return;
        menu.addItem((item) =>
          item
            .setTitle("Markpad: Copy share link")
            .setIcon("copy")
            .onClick(() => void this.copyShareLinkForPath(file.path))
        );
        menu.addItem((item) =>
          item
            .setTitle("Markpad: Stop sharing")
            .setIcon("x-circle")
            .onClick(() => void this.stopSharingPath(file.path))
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
      if (!trigger) return;
      event.preventDefault();
      const host = trigger.closest("[data-path]") as HTMLElement | null;
      const path = host?.getAttribute("data-path");
      if (path) {
        void this.copyShareLinkForPath(path);
      }
    });

    this.statusBarEl?.addEventListener("click", () => this.showConnectedUsers());
    this.rebuildSharedNotesFromFrontmatter();
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (this.isMarkdownFile(file)) {
          this.syncShareFromFileFrontmatter(file);
          this.decorateSharedUi();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (file instanceof TFile) {
          this.sharedNotes.delete(file.path);
          this.decorateSharedUi();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (!(file instanceof TFile)) return;
        const share = this.sharedNotes.get(oldPath);
        if (!share) return;
        this.sharedNotes.delete(oldPath);
        this.sharedNotes.set(file.path, share);
        this.decorateSharedUi();
      })
    );
    this.decorateSharedUi();
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

  private isMarkdownFile(file: TAbstractFile): file is TFile {
    return file instanceof TFile && file.extension.toLowerCase() === "md";
  }

  private async startSharingFromFile(file: TFile): Promise<void> {
    if (!this.isMarkdownFile(file)) {
      new Notice("Markpad: ce fichier n'est pas un Markdown.");
      return;
    }
    await this.app.workspace.getLeaf(false).openFile(file);
    await this.startSharing();
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
      const yText = doc.getText("content");
      const initialContent = active.view.editor.getValue();
      if (yText.length === 0 && initialContent.length > 0) {
        yText.insert(0, initialContent);
      }
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
      this.sharedNotes.set(active.file.path, {
        roomId: created.roomId,
        shareUrl: created.shareUrl
      });
      await this.writeShareFrontmatter(active.file, {
        roomId: created.roomId,
        shareUrl: created.shareUrl
      });
      this.decorateSharedUi();
      this.updatePresenceInStatusBar(provider);
    } catch (error) {
      this.updateStatusBar("error");
      new Notice(`Markpad erreur: ${(error as Error).message}`);
    }
  }

  private async joinSharedNote(): Promise<void> {
    if (!this.settings.userId) {
      new Notice("Configure user ID avant de rejoindre un partage.");
      return;
    }
    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      new Notice("Ouvre une note Markdown avant de rejoindre un partage.");
      return;
    }

    const rawLink = window.prompt("Colle le lien de partage Markpad");
    if (!rawLink) return;

    let roomId = "";
    try {
      const url = new URL(rawLink);
      roomId = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
    } catch {
      // Accept direct roomId fallback.
      roomId = rawLink.trim();
    }
    if (!roomId) {
      new Notice("Lien ou roomId invalide.");
      return;
    }

    const roomPassword =
      window.prompt(
        "Mot de passe (laisser vide si aucun)",
        this.settings.defaultRoomPassword
      ) ?? "";

    this.disconnect();

    try {
      const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
      const doc = new Y.Doc();
      const provider = new WebsocketProvider(`${wsBase}/ws`, roomId, doc, {
        params: {
          userId: this.settings.userId,
          name: this.settings.displayName,
          color: this.settings.color,
          password: roomPassword
        }
      });

      provider.awareness.setLocalStateField("user", {
        name: this.settings.displayName,
        color: this.settings.color
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

      const shareUrl = `${this.settings.serverUrl.replace(/\/$/, "")}/share/${roomId}`;
      this.activeRuntime = {
        filePath: active.file.path,
        shareUrl,
        roomId,
        roomPassword: roomPassword || undefined,
        doc,
        provider
      };
      this.sharedNotes.set(active.file.path, { roomId, shareUrl });
      await this.writeShareFrontmatter(active.file, { roomId, shareUrl });
      this.decorateSharedUi();
      this.updatePresenceInStatusBar(provider);
      new Notice("Markpad: session rejointe depuis Obsidian.");
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

  private async copyShareLinkForPath(filePath: string): Promise<void> {
    const share = this.sharedNotes.get(filePath);
    if (!share) {
      new Notice("Aucun lien de partage pour cette note.");
      return;
    }
    await navigator.clipboard.writeText(share.shareUrl);
    new Notice("Lien de partage copié.");
  }

  private async stopSharingCurrentNote(): Promise<void> {
    const active = this.getActiveMarkdownFileAndView();
    if (!active) {
      new Notice("Ouvre une note partagée.");
      return;
    }
    await this.stopSharingPath(active.file.path);
  }

  private async stopSharingPath(filePath: string): Promise<void> {
    const share = this.sharedNotes.get(filePath);
    if (!share) {
      new Notice("Cette note n'est pas marquée comme partagée.");
      return;
    }
    try {
      await endShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        roomId: share.roomId
      });
    } catch {
      // On supprime localement même si la room côté serveur n'existe plus.
    }
    this.sharedNotes.delete(filePath);
    const file = this.app.vault.getAbstractFileByPath(filePath);
    if (file instanceof TFile) {
      await this.writeShareFrontmatter(file, null);
    }
    if (this.activeRuntime?.filePath === filePath) {
      this.disconnect();
    } else {
      this.decorateSharedUi();
    }
    new Notice("Partage rompu pour cette note.");
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
    if (this.sharedNotes.size === 0) return;

    const fileTitles = document.querySelectorAll<HTMLElement>(".nav-file-title[data-path]");
    fileTitles.forEach((title) => {
      const path = title.getAttribute("data-path");
      if (!path || !this.sharedNotes.has(path)) return;
      const icon = this.buildSharedIndicator();
      title.appendChild(icon);
      this.decoratedEls.add(icon);
    });

    const tabHeaders = document.querySelectorAll<HTMLElement>(
      ".workspace-tab-header[data-path]"
    );
    tabHeaders.forEach((tab) => {
      const path = tab.getAttribute("data-path");
      if (!path || !this.sharedNotes.has(path)) return;
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

  private rebuildSharedNotesFromFrontmatter(): void {
    this.sharedNotes.clear();
    for (const file of this.app.vault.getMarkdownFiles()) {
      this.syncShareFromFileFrontmatter(file);
    }
  }

  private syncShareFromFileFrontmatter(file: TFile): void {
    const cache = this.app.metadataCache.getFileCache(file);
    const raw = cache?.frontmatter?.[SHARE_FRONTMATTER_KEY] as
      | PersistedShare
      | undefined;
    if (raw && typeof raw.roomId === "string" && typeof raw.shareUrl === "string") {
      this.sharedNotes.set(file.path, { roomId: raw.roomId, shareUrl: raw.shareUrl });
      return;
    }
    this.sharedNotes.delete(file.path);
  }

  private async writeShareFrontmatter(
    file: TFile,
    share: PersistedShare | null
  ): Promise<void> {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (share) {
        frontmatter[SHARE_FRONTMATTER_KEY] = {
          roomId: share.roomId,
          shareUrl: share.shareUrl
        };
      } else {
        delete frontmatter[SHARE_FRONTMATTER_KEY];
      }
    });
    this.syncShareFromFileFrontmatter(file);
  }
}
