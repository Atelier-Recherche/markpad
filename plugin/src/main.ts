import {
  App,
  MarkdownView,
  Modal,
  Notice,
  normalizePath,
  TAbstractFile,
  Plugin,
  PluginManifest,
  TFile,
  TFolder
} from "obsidian";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import {
  mountCollabExtension,
  mountCollabExtensionWithYText,
  resolveObsidianEditorView,
  unmountCollabExtension
} from "./codemirrorBinding";
import {
  debugOriginLabel,
  markpadCollabDebug,
  setMarkpadCollabDebug
} from "./markpadDebug";
import { patchYWebsocketProviderOutbound } from "./patchYWebsocketProviderOutbound";
import { reconcileLocalMarkdownIntoY } from "./reconcile";
import {
  createFolderShareSession,
  createShareSession,
  endShareSession,
  validateShareSession
} from "./shareSession";
import { t } from "./locale";
import {
  DEFAULT_SETTINGS,
  MarkpadSettings,
  MarkpadSettingTab
} from "./settings";
import {
  MarkpadSharesView,
  MARKPAD_SHARES_VIEW_TYPE,
  type SharePanelRow
} from "./sharesView";

type ActiveRuntime = {
  mode: "note" | "folder";
  filePath: string;
  shareUrl: string;
  roomId: string;
  roomPassword?: string;
  doc: Y.Doc;
  provider: WebsocketProvider;
  cmView: import("@codemirror/view").EditorView;
  /** Fragment Yjs actuellement lié à CodeMirror. */
  yText: Y.Text;
  folderRoot?: string;
  sharedPaths?: string[];
  /** Retire les écouteurs Y.Doc si logs diagnostic */
  debugUnload?: () => void;
  /** Nettoyage observer Y.Map "files" en mode dossier. */
  folderFilesUnload?: () => void;
};

type PersistedShare = {
  roomId: string;
  shareUrl: string;
};
const SHARE_FRONTMATTER_KEY = "markpadShare";
const FOLDER_SHARE_FILENAME = ".markpad-folder-share.md";
const FOLDER_SHARE_FM = "markpadFolderShare";

type FolderShareMeta = {
  roomId: string;
  shareUrl: string;
  paths: string[];
  anchorPath: string;
};

const stripMarkpadShareFrontmatter = (raw: string): string => {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n(?:---|\.\.\.)\n?/);
  if (!match) return raw;
  const body = match[1] ?? "";
  const rest = normalized.slice(match[0].length);
  const lines = body.split("\n");
  const kept: string[] = [];
  let removed = false;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    if (/^markpadShare\s*:\s*$/.test(line)) {
      removed = true;
      i += 1;
      while (i < lines.length && /^\s+/.test(lines[i] ?? "")) {
        i += 1;
      }
      i -= 1;
      continue;
    }
    if (/^markpadShare\s*:\s*.+$/.test(line)) {
      removed = true;
      continue;
    }
    kept.push(line);
  }

  if (!removed) return raw;
  const next =
    kept.filter((l) => l.trim().length > 0).length === 0
      ? rest
      : `---\n${kept.join("\n")}\n---\n${rest}`;
  return raw.includes("\r\n") ? next.replace(/\n/g, "\r\n") : next;
};

const parentPathOf = (path: string): string => {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "" : path.slice(0, idx);
};

const isPathInFolder = (path: string, folderRoot: string): boolean =>
  folderRoot === "" ? true : path === folderRoot || path.startsWith(`${folderRoot}/`);

const folderPartOf = (path: string): string => {
  const idx = path.lastIndexOf("/");
  return idx <= 0 ? "" : path.slice(0, idx);
};

const splitFolderSegments = (path: string): string[] =>
  path.split("/").map((s) => s.trim()).filter((s) => s.length > 0);

const commonFolderRootOf = (paths: string[]): string => {
  if (paths.length === 0) return "";
  const split = paths
    .map((p) => folderPartOf(p).split("/").filter(Boolean))
    .filter((parts) => parts.length > 0);
  if (split.length === 0) return "";
  const first = split[0]!;
  const out: string[] = [];
  for (let i = 0; i < first.length; i += 1) {
    const segment = first[i]!;
    if (split.every((parts) => parts[i] === segment)) out.push(segment);
    else break;
  }
  return out.join("/");
};

class JoinShareModal extends Modal {
  private resolveFn: ((value: { shareInput: string; roomPassword: string } | null) => void) | null =
    null;
  private shareInput = "";
  private roomPassword = "";

  public constructor(
    app: App,
    options: { initialShareInput?: string; initialPassword?: string }
  ) {
    super(app);
    this.shareInput = options.initialShareInput ?? "";
    this.roomPassword = options.initialPassword ?? "";
  }

  public openAndWait(): Promise<{ shareInput: string; roomPassword: string } | null> {
    return new Promise((resolve) => {
      this.resolveFn = resolve;
      this.open();
    });
  }

  public override onOpen(): void {
    const { contentEl, titleEl } = this;
    titleEl.setText("Rejoindre un partage Markpad");
    contentEl.empty();

    contentEl.createEl("p", {
      text: "Collez l’URL de partage (ou directement le room ID)."
    });

    const shareInput = contentEl.createEl("input", {
      type: "text",
      placeholder: "http://localhost:8081/share/…"
    });
    shareInput.value = this.shareInput;
    shareInput.style.width = "100%";
    shareInput.style.marginBottom = "10px";

    const passLabel = contentEl.createEl("label", { text: "Mot de passe (optionnel)" });
    passLabel.style.display = "block";
    passLabel.style.marginBottom = "4px";
    const passInput = contentEl.createEl("input", { type: "password" });
    passInput.value = this.roomPassword;
    passInput.style.width = "100%";

    const actions = contentEl.createDiv();
    actions.style.display = "flex";
    actions.style.justifyContent = "flex-end";
    actions.style.gap = "8px";
    actions.style.marginTop = "12px";

    const cancelBtn = actions.createEl("button", { text: "Annuler" });
    const joinBtn = actions.createEl("button", { text: "Rejoindre" });
    joinBtn.addClass("mod-cta");

    const submit = (): void => {
      this.shareInput = shareInput.value.trim();
      this.roomPassword = passInput.value;
      if (!this.shareInput) {
        new Notice("Colle un lien de partage ou un room ID.");
        shareInput.focus();
        return;
      }
      this.resolveFn?.({
        shareInput: this.shareInput,
        roomPassword: this.roomPassword
      });
      this.resolveFn = null;
      this.close();
    };

    joinBtn.addEventListener("click", submit);
    cancelBtn.addEventListener("click", () => {
      this.resolveFn?.(null);
      this.resolveFn = null;
      this.close();
    });
    shareInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        submit();
      }
    });
    passInput.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter") {
        evt.preventDefault();
        submit();
      }
    });

    window.setTimeout(() => shareInput.focus(), 10);
  }

  public override onClose(): void {
    if (this.resolveFn) {
      this.resolveFn(null);
      this.resolveFn = null;
    }
    this.contentEl.empty();
  }
}

export default class MarkpadPlugin extends Plugin {
  public settings: MarkpadSettings = DEFAULT_SETTINGS;
  private activeRuntime: ActiveRuntime | null = null;
  private statusBarEl: HTMLElement | null = null;
  private decoratedEls = new Set<HTMLElement>();
  private sharedNotes = new Map<string, PersistedShare>();
  /** Clé = chemin du dossier parent du fichier ancre. */
  private folderSharesMeta = new Map<string, FolderShareMeta>();
  /** File ancre dossier : file d’attente par chemin pour éviter courses create/modify. */
  private folderAnchorWriteQueue = new Map<string, Promise<unknown>>();
  private autoConnectTimer: ReturnType<typeof window.setTimeout> | null = null;

  public constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  public async onload(): Promise<void> {
    await this.loadSettings();
    setMarkpadCollabDebug(this.settings.debugCollab);
    this.addSettingTab(new MarkpadSettingTab(this.app, this));
    this.registerView(MARKPAD_SHARES_VIEW_TYPE, (leaf) => new MarkpadSharesView(leaf, this));
    this.statusBarEl = this.addStatusBarItem();
    this.updateStatusBar("off");

    const L = this.settings.locale;
    this.addCommand({
      id: "markpad-start-sharing",
      name: t(L, "cmdStartSharing"),
      callback: () => void this.startSharing()
    });
    this.addCommand({
      id: "markpad-join-shared-note",
      name: t(L, "cmdJoinShared"),
      callback: () => void this.joinSharedNote()
    });

    this.addRibbonIcon("share-2", t(L, "ribbonStart"), () => {
      void this.startSharing();
    });

    this.addCommand({
      id: "markpad-copy-share-link",
      name: t(L, "cmdCopyLink"),
      callback: () => void this.copyShareLink()
    });
    this.addCommand({
      id: "markpad-stop-sharing-current-note",
      name: t(L, "cmdStopSharing"),
      callback: () => void this.stopSharingCurrentNote()
    });
    this.addCommand({
      id: "markpad-open-shares-panel",
      name: t(L, "cmdSharesPanel"),
      callback: () => void this.openSharesPanel()
    });

    this.registerEvent(
      this.app.workspace.on("editor-change", (editor, info) => {
        if (!this.settings.debugCollab || !this.activeRuntime) return;
        const path = info.file?.path;
        if (path !== this.activeRuntime.filePath) return;
        const cmText =
          this.activeRuntime.mode === "folder" && this.activeRuntime.cmView
            ? this.activeRuntime.cmView.state.doc.toString()
            : editor.getValue();
        const yText = this.activeRuntime.yText.toString();
        markpadCollabDebug("workspace editor-change", {
          cmLen: cmText.length,
          yLen: yText.length,
          same: cmText === yText
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof TFolder) {
          menu.addItem((item) =>
            item
              .setTitle(t(this.settings.locale, "folderShareMenu"))
              .setIcon("share-2")
              .onClick(() => void this.startSharingFolder(file))
          );
          const folderMeta = this.folderSharesMeta.get(file.path);
          if (folderMeta) {
            menu.addItem((item) =>
              item
                .setTitle(t(this.settings.locale, "folderCopyLink"))
                .setIcon("copy")
                .onClick(() => void this.copyShareLinkForFolder(file.path))
            );
            menu.addItem((item) =>
              item
                .setTitle(t(this.settings.locale, "folderStopSharing"))
                .setIcon("x-circle")
                .onClick(() => void this.stopSharingFolderByPath(file.path))
            );
          }
          return;
        }
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
        if (share) {
          this.sharedNotes.delete(oldPath);
          this.sharedNotes.set(file.path, share);
        } else if (this.isMarkdownFile(file)) {
          // Fallback différé: le metadata cache peut être en retard juste après rename.
          window.setTimeout(() => {
            this.syncShareFromFileFrontmatter(file);
            this.decorateSharedUi();
            this.refreshSharesPanel();
          }, 120);
        }

        for (const [root, meta] of Array.from(this.folderSharesMeta.entries())) {
          let changed = false;
          meta.paths = meta.paths.map((p) => {
            if (p !== oldPath) return p;
            changed = true;
            return file.path;
          });
          if (meta.anchorPath === oldPath) {
            meta.anchorPath = file.path;
            changed = true;
          }
          if (changed) {
            const nextRoot = parentPathOf(meta.anchorPath);
            if (nextRoot !== root) {
              this.folderSharesMeta.delete(root);
              this.folderSharesMeta.set(nextRoot, meta);
            } else {
              this.folderSharesMeta.set(root, meta);
            }
          }
        }

        if (this.activeRuntime?.filePath === oldPath) {
          this.activeRuntime.filePath = file.path;
        }
        this.decorateSharedUi();
        this.refreshSharesPanel();
      })
    );
    this.decorateSharedUi();
    this.app.workspace.onLayoutReady(() => {
      this.queueAutoConnect();
    });
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!(file instanceof TFile) || !this.isMarkdownFile(file)) return;
        void this.onMarkdownCreated(file);
      })
    );
    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.queueAutoConnect();
        void this.onFolderLeafChange();
      })
    );
  }

  public onunload(): void {
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
      this.autoConnectTimer = null;
    }
    this.disconnect();
  }

  public async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    setMarkpadCollabDebug(this.settings.debugCollab);
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

  /** Laisse Obsidian mettre à jour le buffer après une écriture disque (ex. frontmatter). */
  private async flushEditorAfterVaultWrite(): Promise<void> {
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => resolve());
      });
    });
  }

  private queueAutoConnect(): void {
    if (this.autoConnectTimer != null) {
      window.clearTimeout(this.autoConnectTimer);
    }
    this.autoConnectTimer = window.setTimeout(() => {
      this.autoConnectTimer = null;
      void this.tryAutoConnectActiveFile();
    }, 450);
  }

  private async tryAutoConnectActiveFile(): Promise<void> {
    if (!this.settings.autoReconnect || !this.settings.userId) return;
    const active = this.getActiveMarkdownFileAndView();
    if (!active) return;

    for (const meta of this.folderSharesMeta.values()) {
      if (!meta.paths.includes(active.file.path)) continue;
      if (
        this.activeRuntime?.mode === "folder" &&
        this.activeRuntime.roomId === meta.roomId
      ) {
        if (this.activeRuntime.filePath !== active.file.path) {
          await this.switchFolderActiveFile(active.file);
        } else if (!this.activeRuntime.provider.wsconnected) {
          this.activeRuntime.provider.connect();
        }
        return;
      }
      if (this.activeRuntime) {
        this.disconnect();
      }
      try {
        await this.attachFolderSharedSession(active.file, active.view, meta, {
          seedLocalFiles: false
        });
      } catch (error) {
        const msg = (error as Error).message;
        if (msg !== "no_cm") {
          new Notice(`Markpad auto-connect: ${msg}`);
        }
      }
      return;
    }

    const share = this.sharedNotes.get(active.file.path);
    if (!share) return;

    if (this.activeRuntime?.filePath === active.file.path && this.activeRuntime.mode === "note") {
      if (this.activeRuntime.provider.wsconnected) return;
      this.activeRuntime.provider.connect();
      return;
    }

    if (this.activeRuntime) {
      this.disconnect();
    }

    try {
      await this.attachSharedSession(active.file, active.view, share.roomId, share.shareUrl, {
        roomPassword: this.settings.defaultRoomPassword || undefined,
        seedFullFromEditor: false
      });
    } catch (error) {
      const msg = (error as Error).message;
      if (msg !== "no_cm") {
        new Notice(`Markpad auto-connect: ${msg}`);
      }
    }
  }

  private schedulePostSyncReconcile(
    file: TFile,
    doc: Y.Doc,
    yText: Y.Text,
    provider: WebsocketProvider
  ): void {
    let ran = false;
    const run = async () => {
      if (ran) return;
      ran = true;
      this.updateStatusBar("syncing");
      markpadCollabDebug("postSync reconcile: démarrage", { path: file.path });
      try {
        const local = await this.app.vault.read(file);
        const localForY = stripMarkpadShareFrontmatter(local);
        const yBefore = yText.toString().length;
        const changed = reconcileLocalMarkdownIntoY(doc, yText, localForY);
        const yAfter = yText.toString().length;
        markpadCollabDebug("postSync reconcile: fin", {
          changed,
          localLen: localForY.length,
          yLenBefore: yBefore,
          yLenAfter: yAfter
        });
      } catch (e) {
        markpadCollabDebug("postSync reconcile: erreur", e);
      } finally {
        if (this.activeRuntime?.provider === provider) {
          this.updatePresenceInStatusBar(provider);
        }
      }
    };
    const onSync = (synced: boolean) => {
      markpadCollabDebug("WebsocketProvider sync", {
        synced,
        wsconnected: provider.wsconnected
      });
      if (synced) void run();
    };
    provider.on("sync", onSync);
    if (provider.synced) void run();
  }

  private async attachSharedSession(
    file: TFile,
    view: MarkdownView,
    roomId: string,
    shareUrl: string,
    options: {
      roomPassword?: string;
      seedFullFromEditor?: boolean;
      /** Si false, le local ne doit jamais écraser le distant au 1er sync (cas "join"). */
      reconcileLocalOnFirstSync?: boolean;
    }
  ): Promise<void> {
    const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
    const doc = new Y.Doc();
    const yText = doc.getText("content");
    if (options.seedFullFromEditor) {
      const full = stripMarkpadShareFrontmatter(view.editor.getValue());
      if (full.length > 0) {
        yText.insert(0, full);
      }
    }
    const provider = new WebsocketProvider(`${wsBase}/ws`, roomId, doc, {
      params: {
        userId: this.settings.userId,
        name: this.settings.displayName,
        color: this.settings.color,
        password: options.roomPassword ?? ""
      }
    });
    patchYWebsocketProviderOutbound(provider);
    markpadCollabDebug("patchYWebsocketProviderOutbound appliqué (envoi Y → WS via origin !== provider)");

    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
    provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
      markpadCollabDebug("WebsocketProvider status", event);
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

    markpadCollabDebug("attachSharedSession", {
      roomId,
      seedFullFromEditor: options.seedFullFromEditor,
      editorValueLen: view.editor.getValue().length,
      getMode: view.getMode?.()
    });

    const cm = resolveObsidianEditorView(view);
    if (!cm) {
      provider.destroy();
      doc.destroy();
      new Notice("Impossible de lier CodeMirror pour cette vue.");
      throw new Error("no_cm");
    }

    mountCollabExtension(cm, doc, provider.awareness);
    markpadCollabDebug("collab montée sur EditorView", {
      cmDocLen: cm.state.doc.toString().length,
      yLen: yText.toString().length
    });

    let debugUnload: (() => void) | undefined;
    if (this.settings.debugCollab) {
      const onYUpdate = (update: Uint8Array, origin: unknown): void => {
        markpadCollabDebug("Y.Doc update (encode)", {
          updateBytes: update.length,
          origin: debugOriginLabel(origin),
          originIsProvider: origin === provider,
          ywebsocketWouldSkipSend: origin === provider
        });
      };
      doc.on("update", onYUpdate);
      debugUnload = () => {
        doc.off("update", onYUpdate);
      };
    }

    this.activeRuntime = {
      mode: "note",
      filePath: file.path,
      shareUrl,
      roomId,
      roomPassword: options.roomPassword,
      doc,
      provider,
      cmView: cm,
      yText,
      debugUnload
    };
    this.sharedNotes.set(file.path, { roomId, shareUrl });
    if (options.reconcileLocalOnFirstSync !== false) {
      this.schedulePostSyncReconcile(file, doc, yText, provider);
    }
    this.decorateSharedUi();
    this.updatePresenceInStatusBar(provider);
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

      await this.writeShareFrontmatter(active.file, {
        roomId: created.roomId,
        shareUrl: created.shareUrl
      });
      await this.flushEditorAfterVaultWrite();

      await this.attachSharedSession(
        active.file,
        active.view,
        created.roomId,
        created.shareUrl,
        {
          roomPassword: this.settings.defaultRoomPassword || undefined,
          seedFullFromEditor: true,
          reconcileLocalOnFirstSync: true
        }
      );

      await navigator.clipboard.writeText(created.shareUrl);
      new Notice(`Lien copié: ${created.shareUrl}`);
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new Notice(this.humanizeShareError(error));
    }
  }

  private async joinSharedNote(): Promise<void> {
    if (!this.settings.userId) {
      new Notice("Configure user ID avant de rejoindre un partage.");
      return;
    }

    let initialShareInput = "";
    try {
      initialShareInput = await navigator.clipboard.readText();
    } catch {
      // Clipboard non accessible: on laisse vide.
    }

    const picked = await new JoinShareModal(this.app, {
      initialShareInput,
      initialPassword: this.settings.defaultRoomPassword
    }).openAndWait();
    if (!picked) return;

    let roomId = "";
    try {
      const url = new URL(picked.shareInput);
      roomId = url.pathname.split("/").filter(Boolean).at(-1) ?? "";
    } catch {
      // Accept direct roomId fallback.
      roomId = picked.shareInput.trim();
    }
    if (!roomId) {
      new Notice("Lien ou roomId invalide.");
      return;
    }
    const roomPassword = picked.roomPassword ?? "";

    this.disconnect();

    try {
      const shareUrl = `${this.settings.serverUrl.replace(/\/$/, "")}/share/${roomId}`;
      const validated = await validateShareSession({
        serverUrl: this.settings.serverUrl,
        roomId,
        roomPassword: roomPassword || undefined
      });
      if (validated.kind === "folder") {
        const filePaths = validated.filePaths.filter((p) => p.endsWith(".md"));
        if (filePaths.length === 0) {
          throw new Error("folder_share_without_markdown_files");
        }
        const folderRoot = commonFolderRootOf(filePaths);
        const anchorPath = normalizePath(
          folderRoot ? `${folderRoot}/${FOLDER_SHARE_FILENAME}` : FOLDER_SHARE_FILENAME
        );
        const meta: FolderShareMeta = {
          roomId,
          shareUrl,
          paths: [...filePaths],
          anchorPath
        };
        await this.ensureFolderAnchorFile(anchorPath, meta, meta.paths);
        this.folderSharesMeta.set(folderRoot, meta);
        for (const p of meta.paths) {
          this.sharedNotes.set(p, { roomId: meta.roomId, shareUrl: meta.shareUrl });
        }
        const openedFile = await this.ensureMarkdownFileExists(meta.paths[0]!);
        await this.app.workspace.getLeaf(false).openFile(openedFile);
        const active = this.getActiveMarkdownFileAndView();
        if (!active || active.file.path !== openedFile.path) {
          throw new Error("impossible_d_ouvrir_la_note_du_dossier");
        }
        await this.attachFolderSharedSession(active.file, active.view, meta, {
          seedLocalFiles: false
        });
      } else {
        const joinedFile = await this.createJoinedNoteFile(roomId);
        await this.app.workspace.getLeaf(false).openFile(joinedFile);
        const active = this.getActiveMarkdownFileAndView();
        if (!active || active.file.path !== joinedFile.path) {
          throw new Error("impossible_d_ouvrir_la_note_creee");
        }
        await this.writeShareFrontmatter(active.file, { roomId, shareUrl });
        await this.flushEditorAfterVaultWrite();

        await this.attachSharedSession(active.file, active.view, roomId, shareUrl, {
          roomPassword: roomPassword || undefined,
          seedFullFromEditor: false,
          reconcileLocalOnFirstSync: false
        });
      }
      new Notice("Markpad: session rejointe depuis Obsidian.");
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new Notice(this.humanizeShareError(error));
    }
  }

  private humanizeShareError(error: unknown): string {
    const msg = (error as Error).message ?? String(error);
    const match = msg.match(/\((\d{3})\)/);
    const status = match?.[1] ?? "";
    if (status === "401") {
      return "Markpad: authentification refusée (401). Vérifie la clé API/JWT dans les réglages Obsidian.";
    }
    if (status === "403") {
      return "Markpad: refusé (403). Vérifie que User ID correspond bien au compte du JWT.";
    }
    if (msg.includes("folder_create_failed:")) {
      return `Markpad: impossible de créer le dossier local (${msg.split(":").slice(1).join(":")}).`;
    }
    if (msg.includes("session_validate_failed (401)")) {
      return "Markpad: mot de passe de room invalide (401).";
    }
    if (msg.includes("session_validate_failed (404)")) {
      return "Markpad: room introuvable (404).";
    }
    if (msg.includes("folder_share_without_markdown_files")) {
      return "Markpad: ce dossier partagé ne contient aucun fichier Markdown.";
    }
    if (/already exists/i.test(msg)) {
      return "Markpad: conflit de fichier (« already exists »). Ferme les autres opérations sur ce vault et réessaie ; si ça persiste, redémarre Obsidian.";
    }
    return `Markpad erreur: ${msg}`;
  }

  /** Crée une note dédiée au partage sans jamais écraser un fichier existant. */
  private async createJoinedNoteFile(roomId: string): Promise<TFile> {
    const active = this.getActiveMarkdownFileAndView();
    const folderPath = active?.file.parent?.path ?? "";
    const base = `Markpad share ${roomId.slice(0, 8)}`.trim();
    const targetPath = this.nextUniqueMarkdownPath(folderPath, base);
    return this.app.vault.create(targetPath, "");
  }

  private async ensureMarkdownFileExists(path: string): Promise<TFile> {
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) return existing;
    const dir = folderPartOf(path);
    if (dir) {
      await this.ensureFolderTree(dir);
    }
    return this.app.vault.create(path, "");
  }

  private async ensureFolderTree(folderPath: string): Promise<void> {
    const segs = splitFolderSegments(folderPath);
    let current = "";
    for (const seg of segs) {
      current = current ? `${current}/${seg}` : seg;
      if (this.app.vault.getAbstractFileByPath(current)) continue;
      try {
        await this.app.vault.createFolder(current);
      } catch {
        if (!this.app.vault.getAbstractFileByPath(current)) {
          throw new Error(`folder_create_failed:${current}`);
        }
      }
    }
  }

  /** Retourne un chemin libre, suffixé "(2)", "(3)", ... si nécessaire. */
  private nextUniqueMarkdownPath(folderPath: string, baseName: string): string {
    const cleanBase = baseName.replace(/[\\/:*?"<>|]/g, "_").trim() || "Markpad share";
    const build = (n: number): string => {
      const suffix = n <= 1 ? "" : ` (${n})`;
      const fileName = `${cleanBase}${suffix}.md`;
      return folderPath ? `${folderPath}/${fileName}` : fileName;
    };
    let idx = 1;
    let candidate = build(idx);
    while (this.app.vault.getAbstractFileByPath(candidate)) {
      idx += 1;
      candidate = build(idx);
    }
    return candidate;
  }

  private disconnect(): void {
    if (!this.activeRuntime) return;
    try {
      this.activeRuntime.debugUnload?.();
    } catch {
      // ignore
    }
    try {
      this.activeRuntime.folderFilesUnload?.();
    } catch {
      // ignore
    }
    try {
      unmountCollabExtension(this.activeRuntime.cmView);
    } catch {
      // La vue peut être invalide si l’onglet a été fermé.
    }
    markpadCollabDebug("disconnect()");
    this.activeRuntime.provider.destroy();
    this.activeRuntime.doc.destroy();
    this.activeRuntime = null;
    this.clearDecorations();
    this.updateStatusBar("off");
  }

  private updatePresenceInStatusBar(provider: WebsocketProvider): void {
    const localId = provider.awareness.doc.clientID;
    let others = 0;
    for (const [clientId, state] of provider.awareness.getStates()) {
      if (clientId === localId) continue;
      const u = (state as { user?: { name?: string }; cursor?: unknown })?.user;
      const hasName = typeof u?.name === "string" && u.name.trim().length > 0;
      const hasCursor =
        state != null &&
        typeof state === "object" &&
        (state as { cursor?: unknown }).cursor != null;
      if (!hasName && !hasCursor) continue;
      others += 1;
    }
    this.updateStatusBar("connected", others);
  }

  private updateStatusBar(
    status: "off" | "connecting" | "connected" | "offline" | "error" | "syncing",
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
      case "syncing":
        this.statusBarEl.setText("Markpad: synchronisation…");
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
    this.refreshSharesPanel();
    new Notice("Partage rompu pour cette note.");
  }

  private showConnectedUsers(): void {
    if (!this.activeRuntime) {
      new Notice("Markpad: aucun partage actif.");
      return;
    }
    const localId = this.activeRuntime.provider.awareness.doc.clientID;
    const names: string[] = [];
    for (const [clientId, state] of this.activeRuntime.provider.awareness.getStates()) {
      if (clientId === localId) continue;
      const u = (state as { user?: { name?: string }; cursor?: unknown })?.user;
      const hasName = typeof u?.name === "string" && u.name.trim().length > 0;
      const hasCursor =
        state != null &&
        typeof state === "object" &&
        (state as { cursor?: unknown }).cursor != null;
      if (!hasName && !hasCursor) continue;
      names.push(hasName ? u!.name!.trim() : "Invité");
    }
    const unique = names.filter((n, i, a) => a.indexOf(n) === i);
    if (unique.length === 0) {
      new Notice("Markpad: aucun autre participant connecté.");
      return;
    }
    new Notice(`Autres connectés: ${unique.join(", ")}`);
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
    if (file.name === FOLDER_SHARE_FILENAME) {
      this.syncFolderAnchorFromFile(file);
      return;
    }
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

  private syncFolderAnchorFromFile(file: TFile): void {
    const cache = this.app.metadataCache.getFileCache(file);
    const raw = cache?.frontmatter?.[FOLDER_SHARE_FM] as
      | { roomId?: string; shareUrl?: string; filePaths?: string[] }
      | undefined;
    const parent = file.parent;
    const root = parent?.path ?? "";
    if (!raw?.roomId || !raw?.shareUrl || !Array.isArray(raw.filePaths)) {
      for (const [k, meta] of this.folderSharesMeta) {
        if (meta.anchorPath === file.path) {
          for (const p of meta.paths) {
            this.sharedNotes.delete(p);
          }
          this.folderSharesMeta.delete(k);
        }
      }
      return;
    }
    const meta: FolderShareMeta = {
      roomId: raw.roomId,
      shareUrl: raw.shareUrl,
      paths: raw.filePaths,
      anchorPath: file.path
    };
    this.folderSharesMeta.set(root, meta);
    for (const p of raw.filePaths) {
      this.sharedNotes.set(p, { roomId: raw.roomId, shareUrl: raw.shareUrl });
    }
  }

  private collectMarkdownPathsInFolder(folder: TFolder): string[] {
    const out: string[] = [];
    const walk = (f: TAbstractFile): void => {
      if (f instanceof TFile && this.isMarkdownFile(f)) {
        if (f.name === FOLDER_SHARE_FILENAME) return;
        out.push(f.path);
      } else if (f instanceof TFolder) {
        for (const c of f.children) {
          walk(c);
        }
      }
    };
    walk(folder);
    return out;
  }

  private async startSharingFolder(folder: TFolder): Promise<void> {
    if (!this.settings.apiKey || !this.settings.userId) {
      new Notice("Configure API key et user ID avant de partager.");
      return;
    }
    const paths = this.collectMarkdownPathsInFolder(folder);
    if (paths.length === 0) {
      new Notice("Aucun fichier Markdown dans ce dossier.");
      return;
    }
    this.disconnect();
    const anchorPath = normalizePath(`${folder.path}/${FOLDER_SHARE_FILENAME}`);
    try {
      const created = await createFolderShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        noteId: anchorPath,
        folderPath: folder.path,
        filePaths: paths,
        roomPassword: this.settings.defaultRoomPassword || undefined
      });
      await this.ensureFolderAnchorFile(anchorPath, created, paths);
      await this.flushEditorAfterVaultWrite();
      const meta: FolderShareMeta = {
        roomId: created.roomId,
        shareUrl: created.shareUrl,
        paths,
        anchorPath
      };
      this.folderSharesMeta.set(folder.path, meta);
      for (const p of paths) {
        this.sharedNotes.set(p, { roomId: created.roomId, shareUrl: created.shareUrl });
      }
      let active = this.getActiveMarkdownFileAndView();
      if (!active || !paths.includes(active.file.path)) {
        const first = this.app.vault.getAbstractFileByPath(paths[0]);
        if (first instanceof TFile) {
          await this.app.workspace.getLeaf(false).openFile(first);
        }
      }
      active = this.getActiveMarkdownFileAndView();
      if (!active) {
        new Notice("Impossible d'ouvrir une note du dossier.");
        return;
      }
      await this.attachFolderSharedSession(active.file, active.view, meta, {
        seedLocalFiles: true
      });
      await navigator.clipboard.writeText(created.shareUrl);
      new Notice(`Dossier partagé — lien copié : ${created.shareUrl}`);
      this.refreshSharesPanel();
    } catch (error) {
      this.updateStatusBar("error");
      new Notice(`Markpad erreur: ${(error as Error).message}`);
    }
  }

  private async ensureFolderAnchorFile(
    anchorPath: string,
    created: { roomId: string; shareUrl: string },
    paths: string[]
  ): Promise<void> {
    const key = normalizePath(anchorPath);
    const prev = this.folderAnchorWriteQueue.get(key) ?? Promise.resolve();
    const job = prev
      .then(() => this.writeFolderAnchorFileContent(key, created, paths))
      .catch((e) => {
        throw e;
      });
    this.folderAnchorWriteQueue.set(
      key,
      job.then(
        () => undefined,
        () => undefined
      )
    );
    await job;
  }

  private async writeFolderAnchorFileContent(
    anchorPath: string,
    created: { roomId: string; shareUrl: string },
    paths: string[]
  ): Promise<void> {
    const lines = [
      "---",
      `${FOLDER_SHARE_FM}:`,
      `  roomId: ${JSON.stringify(created.roomId)}`,
      `  shareUrl: ${JSON.stringify(created.shareUrl)}`,
      "  filePaths:"
    ];
    for (const p of paths) {
      lines.push(`    - ${JSON.stringify(p)}`);
    }
    lines.push("---", "");
    const body = lines.join("\n");
    const pathNorm = normalizePath(anchorPath);
    const anchorDir = folderPartOf(pathNorm);
    if (anchorDir) {
      await this.ensureFolderTree(anchorDir);
    }
    let existing = this.app.vault.getAbstractFileByPath(pathNorm);
    if (existing instanceof TFile) {
      await this.app.vault.modify(existing, body);
      return;
    }
    // Fichier présent côté adaptateur mais pas (encore) comme TFile → create échoue « already exists ».
    let onDisk = false;
    try {
      onDisk = await this.app.vault.adapter.exists(pathNorm);
    } catch {
      onDisk = false;
    }
    if (onDisk) {
      await this.app.vault.adapter.write(pathNorm, body);
      return;
    }
    try {
      await this.app.vault.create(pathNorm, body);
    } catch (error) {
      const msg = String((error as Error)?.message ?? error);
      let current = this.app.vault.getAbstractFileByPath(pathNorm);
      if (current instanceof TFile) {
        await this.app.vault.modify(current, body);
        return;
      }
      if (/already exists/i.test(msg)) {
        await new Promise<void>((r) => window.setTimeout(r, 0));
        current = this.app.vault.getAbstractFileByPath(pathNorm);
        if (current instanceof TFile) {
          await this.app.vault.modify(current, body);
          return;
        }
        try {
          await this.app.vault.adapter.write(pathNorm, body);
        } catch (e2) {
          throw e2 instanceof Error ? e2 : error;
        }
        return;
      }
      try {
        if (await this.app.vault.adapter.exists(pathNorm)) {
          await this.app.vault.adapter.write(pathNorm, body);
          return;
        }
      } catch {
        // ignorer, on propage l’erreur initiale
      }
      throw error;
    }
  }

  private async attachFolderSharedSession(
    file: TFile,
    view: MarkdownView,
    meta: FolderShareMeta,
    options: { seedLocalFiles: boolean }
  ): Promise<void> {
    const wsBase = this.settings.serverUrl.replace(/^http/i, "ws");
    const doc = new Y.Doc();
    const files = doc.getMap("files");
    if (options.seedLocalFiles) {
      for (const p of meta.paths) {
        const t = new Y.Text();
        const f = this.app.vault.getAbstractFileByPath(p);
        if (f instanceof TFile) {
          const body = await this.app.vault.read(f);
          if (body.length > 0) {
            t.insert(0, body);
          }
        }
        files.set(p, t);
      }
    }
    const provider = new WebsocketProvider(`${wsBase}/ws`, meta.roomId, doc, {
      params: {
        userId: this.settings.userId,
        name: this.settings.displayName,
        color: this.settings.color,
        password: this.settings.defaultRoomPassword ?? ""
      }
    });
    patchYWebsocketProviderOutbound(provider);
    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.setLocalStateField("cursor", null);
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
    if (!provider.synced) {
      await new Promise<void>((resolve) => {
        const onSync = (synced: boolean) => {
          if (!synced) return;
          provider.off("sync", onSync);
          resolve();
        };
        provider.on("sync", onSync);
      });
    }
    let yText = files.get(file.path) as Y.Text | undefined;
    if (!yText) {
      yText = new Y.Text();
      doc.transact(() => files.set(file.path, yText!));
    }
    const cm = resolveObsidianEditorView(view);
    if (!cm) {
      provider.destroy();
      doc.destroy();
      new Notice("Impossible de lier CodeMirror pour cette vue.");
      throw new Error("no_cm");
    }
    mountCollabExtensionWithYText(cm, yText, provider.awareness);
    let debugUnload: (() => void) | undefined;
    if (this.settings.debugCollab) {
      const onYUpdate = (update: Uint8Array, origin: unknown): void => {
        markpadCollabDebug("Y.Doc update (encode)", {
          updateBytes: update.length,
          origin: debugOriginLabel(origin),
          originIsProvider: origin === provider,
          ywebsocketWouldSkipSend: origin === provider
        });
      };
      doc.on("update", onYUpdate);
      debugUnload = () => {
        doc.off("update", onYUpdate);
      };
    }
    const anchorF = this.app.vault.getAbstractFileByPath(meta.anchorPath);
    const folderRoot =
      anchorF instanceof TFile
        ? anchorF.parent?.path ?? ""
        : parentPathOf(normalizePath(meta.anchorPath));
    const filesMap = doc.getMap("files");
    const onFilesChange = (): void => {
      if (!this.activeRuntime || this.activeRuntime.doc !== doc || this.activeRuntime.mode !== "folder") {
        return;
      }
      void this.syncFolderFilesFromY(meta, folderRoot, doc);
    };
    filesMap.observe(onFilesChange);
    this.activeRuntime = {
      mode: "folder",
      filePath: file.path,
      shareUrl: meta.shareUrl,
      roomId: meta.roomId,
      roomPassword: this.settings.defaultRoomPassword || undefined,
      doc,
      provider,
      cmView: cm,
      yText,
      folderRoot,
      sharedPaths: meta.paths,
      debugUnload,
      folderFilesUnload: () => filesMap.unobserve(onFilesChange)
    };
    this.decorateSharedUi();
    // En mode dossier, Yjs est la source de vérité des fragments fichiers :
    // éviter reconcile local->Y qui peut écraser un fragment actif distant.
    void this.syncFolderFilesFromY(meta, folderRoot, doc);
    this.updatePresenceInStatusBar(provider);
  }

  private async onMarkdownCreated(file: TFile): Promise<void> {
    if (file.name === FOLDER_SHARE_FILENAME) return;
    for (const [root, meta] of this.folderSharesMeta) {
      if (!isPathInFolder(file.path, root)) continue;
      if (meta.paths.includes(file.path)) continue;
      meta.paths.push(file.path);
      this.sharedNotes.set(file.path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        const files = this.activeRuntime.doc.getMap("files");
        if (!(files.get(file.path) instanceof Y.Text)) {
          const localBody = await this.app.vault.read(file);
          const t = new Y.Text();
          if (localBody.length > 0) t.insert(0, localBody);
          this.activeRuntime.doc.transact(() => {
            files.set(file.path, t);
          }, "markpad-folder-new-file");
        }
      }
      await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      this.decorateSharedUi();
      this.refreshSharesPanel();
      break;
    }
  }

  private async syncFolderFilesFromY(
    meta: FolderShareMeta,
    folderRoot: string,
    doc: Y.Doc
  ): Promise<void> {
    if (!this.activeRuntime || this.activeRuntime.doc !== doc || this.activeRuntime.mode !== "folder") {
      return;
    }
    const files = doc.getMap("files");
    let changed = false;
    for (const [path, value] of files.entries()) {
      if (!(value instanceof Y.Text)) continue;
      if (!path.endsWith(".md")) continue;
      if (!isPathInFolder(path, folderRoot)) continue;
      if (path.endsWith(`/${FOLDER_SHARE_FILENAME}`)) continue;
      if (!meta.paths.includes(path)) {
        meta.paths.push(path);
        this.sharedNotes.set(path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
        changed = true;
      }
      const existing = this.app.vault.getAbstractFileByPath(path);
      if (!existing) {
        try {
          const dir = folderPartOf(path);
          if (dir) {
            await this.ensureFolderTree(dir);
          }
          await this.app.vault.create(path, value.toString());
          changed = true;
        } catch {
          // Si un autre watcher l'a créé entre temps, on ignore.
        }
      }
    }
    if (changed) {
      await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      this.decorateSharedUi();
      this.refreshSharesPanel();
    }
  }

  private async switchFolderActiveFile(file: TFile): Promise<void> {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    const files = this.activeRuntime.doc.getMap("files");
    let yText = files.get(file.path) as Y.Text | undefined;
    if (!yText) {
      yText = new Y.Text();
      const body = await this.app.vault.read(file);
      if (body.length > 0) {
        yText.insert(0, body);
      }
      this.activeRuntime.doc.transact(() => files.set(file.path, yText!));
    }
    unmountCollabExtension(this.activeRuntime.cmView);
    this.activeRuntime.yText = yText;
    mountCollabExtensionWithYText(this.activeRuntime.cmView, yText, this.activeRuntime.provider.awareness);
    this.activeRuntime.filePath = file.path;
    // Idem: pas de reconcile automatique en switch de fichier dossier.
    this.decorateSharedUi();
  }

  private async onFolderLeafChange(): Promise<void> {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    const active = this.getActiveMarkdownFileAndView();
    if (!active) return;
    if (active.file.path === this.activeRuntime.filePath) return;
    if (!this.activeRuntime.sharedPaths?.includes(active.file.path)) return;
    await this.switchFolderActiveFile(active.file);
  }

  public getSharesForPanel(): SharePanelRow[] {
    const out: SharePanelRow[] = [];
    for (const [root, meta] of this.folderSharesMeta) {
      out.push({
        kind: "folder",
        label: root,
        pathKey: root,
        shareUrl: meta.shareUrl,
        roomId: meta.roomId
      });
    }
    const inFolder = new Set<string>();
    for (const m of this.folderSharesMeta.values()) {
      for (const p of m.paths) {
        inFolder.add(p);
      }
    }
    for (const [path, share] of this.sharedNotes) {
      if (inFolder.has(path)) continue;
      out.push({
        kind: "note",
        label: path,
        pathKey: path,
        shareUrl: share.shareUrl,
        roomId: share.roomId
      });
    }
    return out;
  }

  public async deleteShareFromPanel(row: SharePanelRow): Promise<void> {
    if (row.kind === "folder") {
      await this.stopSharingFolderByPath(row.pathKey);
    } else {
      await this.stopSharingPath(row.pathKey);
    }
  }

  public refreshSharesPanel(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(MARKPAD_SHARES_VIEW_TYPE)) {
      const v = leaf.view;
      if (v instanceof MarkpadSharesView) {
        v.refresh();
      }
    }
  }

  public async openSharesPanel(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(MARKPAD_SHARES_VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]!);
      (existing[0]!.view as MarkpadSharesView).refresh();
      return;
    }
    const leaf =
      this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: MARKPAD_SHARES_VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  private async copyShareLinkForFolder(folderRootPath: string): Promise<void> {
    const meta = this.folderSharesMeta.get(folderRootPath);
    if (!meta) {
      new Notice("Ce dossier n'a pas de partage Markpad.");
      return;
    }
    await navigator.clipboard.writeText(meta.shareUrl);
    new Notice("Lien du dossier copié.");
  }

  private async stopSharingFolderByPath(folderRootPath: string): Promise<void> {
    const meta = this.folderSharesMeta.get(folderRootPath);
    if (!meta) {
      new Notice("Ce dossier n'est pas partagé.");
      return;
    }
    try {
      // Avant toute écriture vault : couper WS + observer Y.Map, sinon syncFolderFilesFromY
      // peut encore appeler ensureFolderAnchorFile en parallèle (course → « File already exists »).
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        this.disconnect();
      }

      try {
        await endShareSession({
          serverUrl: this.settings.serverUrl,
          settings: this.settings,
          roomId: meta.roomId
        });
      } catch {
        // room peut déjà être supprimée côté serveur
      }
      for (const p of meta.paths) {
        this.sharedNotes.delete(p);
      }
      this.folderSharesMeta.delete(folderRootPath);
      const anchor = this.app.vault.getAbstractFileByPath(meta.anchorPath);
      if (anchor instanceof TFile) {
        try {
          await this.app.vault.delete(anchor);
        } catch {
          try {
            await this.app.fileManager.processFrontMatter(anchor, (fm) => {
              delete fm[FOLDER_SHARE_FM];
            });
          } catch (e2) {
            new Notice(`Markpad: nettoyage du fichier ancre impossible — ${(e2 as Error).message}`);
          }
        }
      }
      this.decorateSharedUi();
      this.refreshSharesPanel();
      new Notice("Partage du dossier arrêté.");
    } catch (error) {
      new Notice(this.humanizeShareError(error));
    }
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
