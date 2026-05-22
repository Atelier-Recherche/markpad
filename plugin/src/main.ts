import {
  App,
  MarkdownView,
  Modal,
  Notice,
  normalizePath,
  parseYaml,
  setIcon,
  TAbstractFile,
  Plugin,
  PluginManifest,
  TFile,
  TFolder
} from "obsidian";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import {
  applyYTextToCm,
  hideReadonlyBanner,
  isCollabMounted,
  mountCollabEditable,
  mountCollabExtensionWithYText,
  remountCollabExtensionForYText,
  resolveObsidianEditorView,
  setCollabEditable,
  unmountCollabEditable,
  unmountCollabExtension
} from "./codemirrorBinding";
import {
  debugOriginLabel,
  markpadCollabDebug,
  setMarkpadCollabDebug
} from "./markpadDebug";
import { patchYWebsocketProviderOutbound } from "./patchYWebsocketProviderOutbound";
import {
  assembleFileEntry,
  getBodyYText,
  getFileEntry,
  getMetaYMap,
  getNoteBodyYText,
  getNoteMetaYMap,
  getOrCreateFileEntry,
  hasNoteFileShape,
  isNoteFileEntry,
  mergeMetaFromParsed,
  migrateFilesMapLegacyToV2,
  parseNoteFromMarkdown,
  seedFileEntryFromMarkdown,
  seedNoteRootFromMarkdown,
  upgradeLegacyFileEntry
} from "@markpad/collab-note";
import { reconcileLocalBodyIntoY, RECONCILE_ORIGIN } from "./reconcile";
import {
  createFolderShareSession,
  createShareSession,
  endShareSession,
  validateShareSession
} from "./shareSession";
import type { ReconcileStatus } from "./reconcile";
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
import {
  MarkpadHistoryView,
  MARKPAD_HISTORY_VIEW_TYPE
} from "./historyView";

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

/** Fichiers synchronisés dans un partage dossier (notes Markdown + bases Obsidian `.base`). */
const isFolderSharePath = (vaultPath: string): boolean => {
  const p = vaultPath.toLowerCase();
  return p.endsWith(".md") || p.endsWith(".base");
};
const FOLDER_SHARE_FM = "markpadFolderShare";

const MARKPAD_INDICATOR_CSS = `
.markpad-shared-indicator,
.markpad-folder-shared-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  margin-left: 4px;
  flex-shrink: 0;
}
.markpad-shared-indicator svg,
.markpad-folder-shared-indicator svg {
  width: 14px;
  height: 14px;
  opacity: 0.85;
}
`;

type FolderShareMeta = {
  roomId: string;
  shareUrl: string;
  paths: string[];
  anchorPath: string;
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
  /** Délai avant passage en lecture seule après une coupure WS (évite le flash sur reconnects brefs). */
  private collabReadonlyTimer: ReturnType<typeof window.setTimeout> | null = null;
  /** Vrai dès que le WS s'est connecté au moins une fois dans la session courante. */
  private collabHasEverConnected = false;
  /** Vrai si la note est actuellement en lecture seule (WS perdu). */
  private collabIsReadonly = false;
  /** Évite de répéter la Notice de patch WebSocket échoué à chaque reconnexion. */
  private patchFailedNoticeShown = false;
  /** État WS pour l’icône de la session active (connecting / connected / disconnected). */
  private collabWsStatus: "connecting" | "connected" | "disconnected" = "disconnected";
  /** Reconcile post-sync note en cours (affiche une icône « chargement »). */
  private postSyncReconcileRunning = false;
  /** Débounce disque → Y pour les fichiers partagés (vault modify). */
  private vaultSyncTimers = new Map<string, ReturnType<typeof window.setTimeout>>();
  /** Évite une boucle vault.modify ↔ syncFolderFilesFromY. */
  private suppressVaultToY = false;
  private fileExplorerObserver: MutationObserver | null = null;
  private fileExplorerObservedEl: HTMLElement | null = null;
  /** Débounce : la liste virtualisée mutate en continu (~chaque frame) ; sans délai on saturerait le CPU. */
  private explorerMutateDebounceTimer: ReturnType<typeof window.setTimeout> | null = null;
  /** Évite la réentrance : sync Yjs / layout peuvent rappeler decorate pendant un decorate. */
  private decorateSharedUiRunning = false;
  private decorateSharedUiCoalesce = false;

  public constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  public async onload(): Promise<void> {
    await this.loadSettings();
    setMarkpadCollabDebug(this.settings.debugCollab);
    this.addSettingTab(new MarkpadSettingTab(this.app, this));
    this.registerView(MARKPAD_SHARES_VIEW_TYPE, (leaf) => new MarkpadSharesView(leaf, this));
    this.registerView(MARKPAD_HISTORY_VIEW_TYPE, (leaf) => new MarkpadHistoryView(leaf, this));
    this.statusBarEl = this.addStatusBarItem();
    this.updateStatusBar("off");

    const styleEl = document.createElement("style");
    styleEl.textContent = MARKPAD_INDICATOR_CSS;
    document.head.appendChild(styleEl);
    this.register(() => styleEl.remove());

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
    this.addCommand({
      id: "markpad-open-history-panel",
      name: L === "en" ? "Open history panel" : "Ouvrir le panneau historique",
      callback: () => void this.openHistoryPanel()
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
      this.app.workspace.on("layout-change", () => {
        this.scheduleDecorateSharedUiSoon();
        this.ensureFileExplorerDecorationObserver();
      })
    );
    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.decorateSharedUi();
        // Cacher le bandeau readonly si la note ouverte n'est pas la note partagée.
        // Obsidian réutilise le même EditorView pour toutes les notes d'un leaf, donc
        // le bandeau resterait visible sinon.
        if (
          !file ||
          !this.activeRuntime ||
          this.activeRuntime.filePath !== file.path ||
          this.activeRuntime.mode !== "note"
        ) {
          const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
          if (activeView) {
            const cm = resolveObsidianEditorView(activeView);
            if (cm) hideReadonlyBanner(cm);
          }
        }
        if (file) void this.onFileOpenReattach(file);
      })
    );
    this.registerDomEvent(document, "click", (event) => {
      const trigger = (event.target as HTMLElement | null)?.closest(
        ".markpad-shared-indicator, .markpad-folder-shared-indicator"
      ) as HTMLElement | null;
      if (!trigger) return;
      event.preventDefault();
      const host = trigger.closest("[data-path]") as HTMLElement | null;
      const path = host?.getAttribute("data-path");
      if (!path) return;
      if (trigger.classList.contains("markpad-folder-shared-indicator")) {
        void this.copyShareLinkForFolder(path);
      } else {
        void this.copyShareLinkForPath(path);
      }
    });

    this.statusBarEl?.addEventListener("click", () => this.showConnectedUsers());
    this.rebuildSharedNotesFromFrontmatter();
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (!this.isMarkdownFile(file)) return;
        const before = this.getSharesPanelSignature();
        this.syncShareFromFileFrontmatter(file);
        this.queueVaultSyncToY(file);
        this.decorateSharedUi();
        if (this.getSharesPanelSignature() !== before) {
          this.refreshSharesPanel();
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        void this.handleVaultDelete(file);
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (file instanceof TFolder) {
          void this.applyFolderShareAfterFolderRename(oldPath, file.path);
          return;
        }
        if (!(file instanceof TFile)) return;
        const share = this.sharedNotes.get(oldPath);
        if (share) {
          this.sharedNotes.delete(oldPath);
          this.sharedNotes.set(file.path, share);
        } else if (this.isMarkdownFile(file)) {
          window.setTimeout(() => {
            const before = this.getSharesPanelSignature();
            this.syncShareFromFileFrontmatter(file);
            this.decorateSharedUi();
            if (this.getSharesPanelSignature() !== before) {
              this.refreshSharesPanel();
            }
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
            this.migrateYMapKeyAfterFileRename(oldPath, file.path, meta.roomId);
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
      this.ensureFileExplorerDecorationObserver();
      // Reconstruire la map après que le metadataCache soit prêt.
      // rebuildSharedNotesFromFrontmatter gère les notes ; rebuildFolderSharesFromFiles
      // gère les dossiers (lecture directe car metadataCache n'indexe pas les fichiers '.*').
      // queueAutoConnect est lancé seulement après les deux pour éviter un auto-connect
      // avant que folderSharesMeta soit peuplé.
      this.rebuildSharedNotesFromFrontmatter();
      void this.rebuildFolderSharesFromFiles().then(() => {
        this.queueAutoConnect();
      });
    });
    // Mettre à jour sharedNotes quand le cache d'un fichier est (re)calculé.
    // Couvre le cas où le cache arrive après onLayoutReady.
    this.registerEvent(
      this.app.metadataCache.on("changed", (file) => {
        this.syncShareFromFileFrontmatter(file);
      })
    );
    // Déclencher l'auto-connect une fois que le metadataCache a fini d'indexer tous les fichiers.
    // Nécessaire pour le démarrage Obsidian à froid : onLayoutReady peut tirer avant que le cache
    // ne soit prêt, laissant sharedNotes vide ; "resolved" garantit que tout est indexé.
    this.registerEvent(
      this.app.metadataCache.on("resolved", () => {
        this.refreshSharesPanel();
        this.queueAutoConnect();
      })
    );
    // Sur Android, le système peut tuer le WebSocket quand l'app passe en arrière-plan.
    // À la remise en avant-plan, visibilitychange déclenche une reconnexion immédiate.
    // Sur desktop ce handler est inoffensif (triggered lors d'un alt-tab par ex.).
    const onVisibilityChange = (): void => {
      if (document.visibilityState === "visible") {
        this.queueAutoConnect();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    this.register(() => document.removeEventListener("visibilitychange", onVisibilityChange));

    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!(file instanceof TFile) || !this.isFolderShareSyncFile(file)) return;
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
    this.teardownFileExplorerDecorationObserver();
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

  /** Markdown ou fichier `.base` (Obsidian Bases / Kanban web). */
  private isFolderShareSyncFile(file: TAbstractFile): file is TFile {
    if (!(file instanceof TFile)) return false;
    const ext = file.extension.toLowerCase();
    return ext === "md" || ext === "base";
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
    if (!active) {
      // Si on sort de Markdown / de la vue active, on coupe la session collab existante.
      // Sinon, y-websocket garde une boucle de reconnexion même hors document partagé.
      if (this.activeRuntime && this.activeRuntime.mode !== "folder") this.disconnect();
      return;
    }

    for (const meta of this.folderSharesMeta.values()) {
      if (!meta.paths.includes(active.file.path)) continue;
      if (
        this.activeRuntime?.mode === "folder" &&
        this.activeRuntime.roomId === meta.roomId
      ) {
        if (this.activeRuntime.filePath !== active.file.path) {
          await this.switchFolderActiveFile(active.file);
        } else {
          // Même fichier : vérifier si l'état CM a été réinitialisé (navigation hors dossier puis retour).
          const currentCm = resolveObsidianEditorView(active.view);
          if (currentCm) {
            const cmChanged = currentCm !== this.activeRuntime.cmView;
            const notMounted = !isCollabMounted(currentCm);
            if (cmChanged || notMounted) {
              markpadCollabDebug("folder:re-mount après navigation", { cmChanged, notMounted });
              if (cmChanged) {
                try { unmountCollabEditable(this.activeRuntime.cmView); } catch { /* stale */ }
                try { unmountCollabExtension(this.activeRuntime.cmView); } catch { /* stale */ }
                this.activeRuntime.cmView = currentCm;
              }
              remountCollabExtensionForYText(currentCm, this.activeRuntime.yText, this.activeRuntime.provider.awareness);
              applyYTextToCm(currentCm, this.activeRuntime.yText);
              mountCollabEditable(currentCm, !this.collabIsReadonly);
            }
          }
          if (!this.activeRuntime.provider.wsconnected) {
            this.activeRuntime.provider.connect();
          }
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
    if (!share) {
      // On est sur un Markdown mais pas sur une note partagée : stop la session collab courante.
      if (this.activeRuntime) {
        // En mode dossier, la vue active peut être le fichier ancre
        // `.markpad-folder-share.md` (qui n'est pas dans `sharedNotes`).
        // On évite donc de déconnecter dans ce cas.
        if (this.activeRuntime.mode === "folder") {
          const folderRoot = this.activeRuntime.folderRoot ?? "";
          const path = active.file.path;
          const withinFolderRoot =
            folderRoot.length > 0 &&
            (path === folderRoot || path.startsWith(`${folderRoot}/`));
          if (!withinFolderRoot) this.disconnect();
        } else {
          this.disconnect();
        }
      }
      return;
    }

    if (this.activeRuntime?.filePath === active.file.path && this.activeRuntime.mode === "note") {
      // Vérifier que la collab extension est encore montée sur l'état CM courant.
      // Obsidian réinitialise l'état de l'EditorView quand on navigue vers un autre fichier
      // dans la même feuille : le Compartment appendConfig est alors perdu.
      const currentCm = resolveObsidianEditorView(active.view);
      if (currentCm) {
        const cmChanged = currentCm !== this.activeRuntime.cmView;
        const notMounted = !isCollabMounted(currentCm);
        if (cmChanged || notMounted) {
          markpadCollabDebug("note:re-mount après navigation", {
            cmChanged,
            notMounted,
            yLen: this.activeRuntime.yText.toString().length
          });
          if (cmChanged) {
            try { unmountCollabExtension(this.activeRuntime.cmView); } catch { /* vue périmée */ }
            this.activeRuntime.cmView = currentCm;
          }
          remountCollabExtensionForYText(
            currentCm,
            this.activeRuntime.yText,
            this.activeRuntime.provider.awareness
          );
          // Sync initial explicite Y→CM (y-codemirror.next ne le fait pas automatiquement).
          applyYTextToCm(currentCm, this.activeRuntime.yText);
        }
      }
      if (!this.activeRuntime.provider.wsconnected) {
        this.activeRuntime.provider.connect();
      }
      return;
    }

    if (this.activeRuntime) {
      this.disconnect();
    }

    try {
      await this.attachSharedSession(active.file, active.view, share.roomId, share.shareUrl, {
        roomPassword: this.settings.defaultRoomPassword || undefined,
          seedFullFromEditor: false,
          // Auto-connect / reconnexion : le distant est la source de vérité au premier sync,
          // sinon on peut re-fusionner le local et provoquer un doublage.
          reconcileLocalOnFirstSync: false
      });
    } catch (error) {
      const msg = (error as Error).message;
      if (msg !== "no_cm") {
        new Notice(`Markpad auto-connect: ${msg}`);
      }
    }
  }

  /**
   * Re-monte la collab extension immédiatement à l'ouverture d'un fichier,
   * sans attendre le debounce de 450ms de `queueAutoConnect`.
   * Si la note partagée vient d'être (re)ouverte, yCollab pousse Y → CM dès maintenant,
   * appliquant tous les changements distants reçus pendant que la note était fermée.
   */
  private async onFileOpenReattach(file: TFile): Promise<void> {
    if (!this.activeRuntime) return;

    // Mode dossier : re-mount immédiat si le même fichier est rouvert et que l'état CM a été réinitialisé.
    // Les changements de fichier dans le dossier sont gérés par onFolderLeafChange / switchFolderActiveFile.
    if (this.activeRuntime.mode === "folder") {
      if (
        this.activeRuntime.filePath !== file.path ||
        !this.activeRuntime.sharedPaths?.includes(file.path)
      ) return;

      await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
      const folderView = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!folderView || folderView.file?.path !== file.path) return;
      const folderCm = resolveObsidianEditorView(folderView);
      if (!folderCm) return;
      const folderCmChanged = folderCm !== this.activeRuntime.cmView;
      const folderNotMounted = !isCollabMounted(folderCm);
      if (!folderCmChanged && !folderNotMounted) return;

      markpadCollabDebug("folder:file-open re-mount immédiat", {
        folderCmChanged,
        folderNotMounted,
        yLen: this.activeRuntime.yText.toString().length
      });

      if (folderCmChanged) {
        try { unmountCollabEditable(this.activeRuntime.cmView); } catch { /* stale */ }
        try { unmountCollabExtension(this.activeRuntime.cmView); } catch { /* stale */ }
        this.activeRuntime.cmView = folderCm;
      }
      remountCollabExtensionForYText(folderCm, this.activeRuntime.yText, this.activeRuntime.provider.awareness);
      const folderSynced = applyYTextToCm(folderCm, this.activeRuntime.yText);
      markpadCollabDebug("folder:file-open sync Y→CM initial", {
        folderSynced,
        yLen: this.activeRuntime.yText.toString().length,
        cmLen: folderCm.state.doc.toString().length
      });
      mountCollabEditable(folderCm, !this.collabIsReadonly);
      if (!this.activeRuntime.provider.wsconnected) {
        this.activeRuntime.provider.connect();
      }
      return;
    }

    if (
      this.activeRuntime.filePath !== file.path ||
      this.activeRuntime.mode !== "note"
    ) return;

    // Laisser un tick pour qu'Obsidian charge le contenu du fichier dans l'éditeur CM.
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));

    // Récupérer la vue active après le tick.
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || view.file?.path !== file.path) return;

    const currentCm = resolveObsidianEditorView(view);
    if (!currentCm) return;

    const cmChanged = currentCm !== this.activeRuntime.cmView;
    const notMounted = !isCollabMounted(currentCm);
    if (!cmChanged && !notMounted) return;

    markpadCollabDebug("file-open: re-mount immédiat", {
      cmChanged,
      notMounted,
      yLen: this.activeRuntime.yText.toString().length
    });

    if (cmChanged) {
      try { unmountCollabExtension(this.activeRuntime.cmView); } catch { /* vue périmée */ }
      this.activeRuntime.cmView = currentCm;
    }

    remountCollabExtensionForYText(
      currentCm,
      this.activeRuntime.yText,
      this.activeRuntime.provider.awareness
    );

    // Sync initial explicite Y→CM.
    // y-codemirror.next ne fait AUCUN sync initial dans son constructeur : seules les
    // futures mutations Y.Text sont propagées. Sans cette étape, CM garderait l'ancien
    // contenu du disque et le premier frappe de l'utilisateur écraserait les changements
    // distants (bridge CM→Y).
    const synced = applyYTextToCm(currentCm, this.activeRuntime.yText);
    markpadCollabDebug("file-open: sync Y→CM initial", {
      synced,
      yLen: this.activeRuntime.yText.toString().length,
      cmLen: currentCm.state.doc.toString().length
    });

    // Restaurer l'état éditable : on se base sur collabIsReadonly (décidé après 3 s sans
    // connexion) plutôt que sur wsconnected seul, pour ne pas bypasser le mode readonly
    // suite à une simple navigation vers un autre note et retour.
    const editable = !this.collabIsReadonly;
    mountCollabEditable(currentCm, editable);
    if (!this.activeRuntime.provider.wsconnected) {
      this.activeRuntime.provider.connect();
    }
  }

  /** Met à jour Y depuis le vault (meta toujours ; corps si fichier non actif dans l’éditeur). */
  private queueVaultSyncToY(file: TFile): void {
    if (!this.activeRuntime) return;
    const share = this.sharedNotes.get(file.path);
    if (!share || this.activeRuntime.roomId !== share.roomId) return;
    const prev = this.vaultSyncTimers.get(file.path);
    if (prev != null) window.clearTimeout(prev);
    this.vaultSyncTimers.set(
      file.path,
      window.setTimeout(() => {
        this.vaultSyncTimers.delete(file.path);
        void this.syncVaultFileIntoY(file);
      }, 400)
    );
  }

  private async syncVaultFileIntoY(file: TFile): Promise<void> {
    if (!this.activeRuntime || this.suppressVaultToY) return;
    const share = this.sharedNotes.get(file.path);
    if (!share || this.activeRuntime.roomId !== share.roomId) return;
    try {
      const raw = await this.app.vault.read(file);
      const parsed = parseNoteFromMarkdown(raw);
      const { doc, mode, filePath } = this.activeRuntime;
      if (mode === "note") {
        mergeMetaFromParsed(doc, getNoteMetaYMap(doc), parsed.meta, "markpad-vault-meta");
        if (filePath !== file.path) return;
        return;
      }
      let entry = getFileEntry(doc, file.path);
      const files = doc.getMap("files");
      const legacy = files.get(file.path);
      if (!entry && legacy instanceof Y.Text) {
        entry = upgradeLegacyFileEntry(doc, file.path, legacy, "markpad-vault-upgrade");
      }
      const isActive = filePath === file.path;
      if (isActive && entry) {
        const bodyY = getBodyYText(entry);
        reconcileLocalBodyIntoY(doc, bodyY, parsed.body);
        mergeMetaFromParsed(doc, getMetaYMap(entry), parsed.meta, "markpad-vault-meta");
        return;
      }
      seedFileEntryFromMarkdown(doc, file.path, raw, "markpad-vault-sync");
    } catch (e) {
      markpadCollabDebug("vault→Y sync échouée", file.path, e);
    }
  }

  private schedulePostSyncReconcile(
    file: TFile,
    doc: Y.Doc,
    provider: WebsocketProvider
  ): void {
    let ran = false;
    const run = async () => {
      if (ran) return;
      ran = true;
      this.postSyncReconcileRunning = true;
      this.decorateSharedUi();
      this.updateStatusBar("syncing");
      markpadCollabDebug("postSync reconcile: démarrage", { path: file.path });
      try {
        const local = await this.app.vault.read(file);
        const parsed = parseNoteFromMarkdown(local);
        const bodyYText = getNoteBodyYText(doc);
        const metaMap = getNoteMetaYMap(doc);
        const yBefore = bodyYText.toString().length;
        const status: ReconcileStatus = reconcileLocalBodyIntoY(doc, bodyYText, parsed.body);
        mergeMetaFromParsed(doc, metaMap, parsed.meta, RECONCILE_ORIGIN);
        const yAfter = bodyYText.toString().length;
        markpadCollabDebug("postSync reconcile: fin", {
          status,
          localLen: local.length,
          yLenBefore: yBefore,
          yLenAfter: yAfter
        });
        if (status === "conflict") {
          await this.handleReconcileConflict(file, local);
        }
      } catch (e) {
        markpadCollabDebug("postSync reconcile: erreur", e);
      } finally {
        this.postSyncReconcileRunning = false;
        this.decorateSharedUi();
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

  /**
   * Quand le reconcile détecte un conflit (zones modifiées en même temps côté local
   * et côté collaboratif distant), on :
   * 1. Sauvegarde la version locale dans un fichier `.conflict.md`
   * 2. Laisse Y.Text intact (la version collaborative fait foi)
   * 3. Notifie l'utilisateur
   */
  private async handleReconcileConflict(file: TFile, localContent: string): Promise<void> {
    const conflictPath = file.path.replace(/\.md$/, ".conflict.md");
    markpadCollabDebug("postSync reconcile: conflit → sauvegarde", { conflictPath });
    try {
      const existing = this.app.vault.getAbstractFileByPath(conflictPath);
      if (existing instanceof TFile) {
        await this.app.vault.modify(existing, localContent);
      } else {
        await this.app.vault.create(conflictPath, localContent);
      }
      new Notice(
        `Markpad: conflits détectés sur « ${file.name} ».\n` +
        `Vos modifications locales hors-ligne ont été sauvegardées dans « ${conflictPath} ».\n` +
        `Le contenu collaboratif est conservé dans la note d'origine.`,
        12000
      );
    } catch (err) {
      markpadCollabDebug("handleReconcileConflict: échec sauvegarde", err);
      new Notice(
        `Markpad: conflits détectés sur « ${file.name} » mais impossible de créer le fichier de sauvegarde. ` +
        `Vos modifications locales hors-ligne ont été perdues.`
      );
    }
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
    if (options.seedFullFromEditor) {
      const full = view.editor.getValue();
      if (full.length > 0) {
        seedNoteRootFromMarkdown(doc, full, "markpad-seed-note");
      }
    }
    const yText = getNoteBodyYText(doc);
    const provider = new WebsocketProvider(`${wsBase}/ws`, roomId, doc, {
      params: {
        userId: this.settings.userId,
        name: this.settings.displayName,
        color: this.settings.color,
        password: options.roomPassword ?? ""
      }
    });
    const patchNote = patchYWebsocketProviderOutbound(provider);
    markpadCollabDebug(
      patchNote
        ? "patchYWebsocketProviderOutbound OK (note)"
        : "patchYWebsocketProviderOutbound ÉCHOUÉ (note) — _updateHandler absent",
      { patchNote }
    );
    if (!patchNote && !this.patchFailedNoticeShown) {
      this.patchFailedNoticeShown = true;
      new Notice(
        "Markpad: optimisation WebSocket indisponible sur cette version d'Obsidian.\nLa synchronisation peut générer du trafic réseau supplémentaire.",
        8000
      );
    }

    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
    let mountedCm: import("@codemirror/view").EditorView | null = null;
    const requireInitialSyncBeforeEdit = !options.seedFullFromEditor;
    let initialRemoteApplied = false;
    const applyInitialRemoteState = (): void => {
      if (initialRemoteApplied) return;
      initialRemoteApplied = true;
      try {
        // Au "join"/auto-reconnect, on applique Y→CM uniquement après le premier sync réseau.
        // Sinon un Y.Text vide local (avant sync) peut effacer le buffer Obsidian.
        const targetCm =
          this.activeRuntime?.provider === provider && this.activeRuntime.mode === "note"
            ? this.activeRuntime.cmView
            : mountedCm;
        if (!targetCm) {
          initialRemoteApplied = false;
          return;
        }
        const synced = applyYTextToCm(targetCm, yText);
        markpadCollabDebug("note: sync Y→CM après premier sync provider", {
          synced,
          yLen: yText.toString().length,
          cmLen: targetCm.state.doc.toString().length
        });
      } catch (error) {
        // Ne jamais laisser une exception Yjs interrompre le re-attach.
        markpadCollabDebug("note: erreur applyYTextToCm (post-sync)", error);
      }
      if (
        this.activeRuntime?.provider === provider &&
        this.activeRuntime.mode === "note" &&
        provider.wsconnected &&
        !this.collabIsReadonly
      ) {
        setCollabEditable(this.activeRuntime.cmView, true);
        markpadCollabDebug("note: éditable (premier sync terminé)");
      }
    };
    const onProviderSync = (synced: boolean): void => {
      markpadCollabDebug("note:provider sync", { synced, wsconnected: provider.wsconnected });
      if (!synced) return;
      if (requireInitialSyncBeforeEdit) applyInitialRemoteState();
      provider.off("sync", onProviderSync);
    };
    provider.on("sync", onProviderSync);
    // y-websocket n'émet 'disconnected' que sur fermeture volontaire ; lors d'une
    // coupure réseau, il passe directement 'connected' → 'connecting' (retry loop).
    // Le timer de lecture seule doit donc se déclencher aussi sur 'connecting',
    // mais uniquement après une première connexion (évite le readonly au démarrage).
    provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
      markpadCollabDebug("WebsocketProvider status", event);
      if (event.status === "connected") {
        this.collabHasEverConnected = true;
        this.collabIsReadonly = false;
        this.collabWsStatus = "connected";
        this.updatePresenceInStatusBar(provider);
        this.decorateSharedUi();
        // Annuler le timer de readonly et rendre la note éditable immédiatement.
        if (this.collabReadonlyTimer !== null) {
          window.clearTimeout(this.collabReadonlyTimer);
          this.collabReadonlyTimer = null;
        }
        if (this.activeRuntime?.mode === "note" && this.activeRuntime.cmView) {
          const canEditNow = !requireInitialSyncBeforeEdit || provider.synced;
          setCollabEditable(this.activeRuntime.cmView, canEditNow);
          markpadCollabDebug(
            canEditNow
              ? "note: éditable (WS reconnecté)"
              : "note: connecté, attente sync initial (lecture seule)"
          );
        }
        return;
      }
      if (event.status === "connecting") {
        this.collabWsStatus = "connecting";
        this.updateStatusBar("connecting");
        this.decorateSharedUi();
        // Coupure réseau : y-websocket ne passe jamais par 'disconnected' lors d'un retry,
        // on démarre le timer ici (annulé si reconnexion < 3 s).
        this.startCollabReadonlyTimerIfNeeded(provider);
        return;
      }
      // 'disconnected' : fermeture volontaire ou erreur fatale.
      this.collabWsStatus = "disconnected";
      this.updateStatusBar("offline");
      this.decorateSharedUi();
      this.startCollabReadonlyTimerIfNeeded(provider);
    });
    // Ne pas appeler decorateSharedUi sur chaque sync Yjs : ça sature le thread UI et peut casser CM↔Y.

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

    mountCollabExtensionWithYText(cm, yText, provider.awareness);
    mountedCm = cm;
    // En mode "start sharing", on seed le Y.Text depuis l'éditeur local, donc pas de
    // dépendance au premier sync distant: on peut aligner CM immédiatement.
    // En "join"/auto-reconnect, on attend le premier événement provider.sync(true)
    // pour éviter d'appliquer un Y.Text vide local avant réception de l'état distant.
    if (options.seedFullFromEditor) {
      try {
        applyYTextToCm(cm, yText);
      } catch (error) {
        markpadCollabDebug("note: erreur applyYTextToCm (seed local)", error);
      }
    }
    // Monter le compartment éditable. La note démarre éditable si le WS est déjà connecté
    // et qu'aucun sync initial n'est requis ; sinon lecture seule temporaire.
    const initialEditable =
      options.seedFullFromEditor || (provider.wsconnected && !requireInitialSyncBeforeEdit);
    mountCollabEditable(cm, initialEditable);
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

    this.collabWsStatus = provider.wsconnected ? "connected" : "connecting";
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
    if (requireInitialSyncBeforeEdit && provider.synced) {
      // Cas où le provider est déjà sync au moment du montage (re-attach ultra rapide).
      applyInitialRemoteState();
      provider.off("sync", onProviderSync);
    }
    if (options.reconcileLocalOnFirstSync !== false) {
      this.schedulePostSyncReconcile(file, doc, provider);
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

      await this.writeClipboardSafe(created.shareUrl, `Lien copié: ${created.shareUrl}`);
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
        const filePaths = validated.filePaths.filter((p) => isFolderSharePath(p));
        if (filePaths.length === 0) {
          throw new Error("folder_share_without_syncable_files");
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
        const openPath =
          meta.paths.find((p) => p.toLowerCase().endsWith(".md")) ?? meta.paths[0]!;
        const openedFile = await this.ensureMarkdownFileExists(openPath);
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
    if (status === "429" || msg.includes("share_limit_reached")) {
      return "Markpad: nombre maximum de partages atteint pour ce compte (limite serveur).";
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
    if (
      msg.includes("folder_share_without_markdown_files") ||
      msg.includes("folder_share_without_syncable_files")
    ) {
      return "Markpad: ce dossier partagé ne contient aucun fichier syncable (Markdown ou .base).";
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

  /**
   * Démarre le timer de passage en lecture seule (3 s après coupure WS).
   * Partagé entre le mode note et le mode dossier.
   */
  private startCollabReadonlyTimerIfNeeded(provider: WebsocketProvider): void {
    if (this.collabIsReadonly) return;
    if (this.collabReadonlyTimer !== null) return;
    this.collabReadonlyTimer = window.setTimeout(() => {
      this.collabReadonlyTimer = null;
      if (
        this.activeRuntime?.provider === provider &&
        !provider.wsconnected &&
        this.activeRuntime.cmView
      ) {
        this.collabIsReadonly = true;
        setCollabEditable(this.activeRuntime.cmView, false);
        markpadCollabDebug("lecture seule (WS déconnecté > 3 s)");
        new Notice(
          "Markpad: connexion perdue — note en lecture seule.\nVos modifications seront appliquées au reconnect.",
          8000
        );
      }
    }, 3000);
  }

  private disconnect(): void {
    if (!this.activeRuntime) return;
    if (this.collabReadonlyTimer !== null) {
      window.clearTimeout(this.collabReadonlyTimer);
      this.collabReadonlyTimer = null;
    }
    this.collabHasEverConnected = false;
    this.collabIsReadonly = false;
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
      // Restaurer l'editable avant de demonter (sinon la feuille reste bloquee en lecture seule).
      unmountCollabEditable(this.activeRuntime.cmView);
    } catch {
      // ignore
    }
    try {
      unmountCollabExtension(this.activeRuntime.cmView);
    } catch {
      // La vue peut etre invalide si l'onglet a ete ferme.
    }
    markpadCollabDebug("disconnect()");
    this.activeRuntime.provider.destroy();
    this.activeRuntime.doc.destroy();
    this.activeRuntime = null;
    this.clearDecorations();
    this.collabWsStatus = "disconnected";
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

  /**
   * Tente de copier `text` dans le presse-papiers.
   * Sur Android (WebView restrictif), clipboard.writeText peut lever une exception :
   * dans ce cas on affiche le lien dans une Notice longue pour copie manuelle.
   */
  private async writeClipboardSafe(text: string, successMsg: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      new Notice(successMsg);
    } catch {
      new Notice(`${successMsg}\n\n${text}`, 10000);
    }
  }

  private async copyShareLink(): Promise<void> {
    if (!this.activeRuntime) {
      new Notice("Aucune session Markpad active.");
      return;
    }
    await this.writeClipboardSafe(this.activeRuntime.shareUrl, "Lien de partage copié.");
  }

  private async copyShareLinkForPath(filePath: string): Promise<void> {
    const share = this.sharedNotes.get(filePath);
    if (!share) {
      new Notice("Aucun lien de partage pour cette note.");
      return;
    }
    await this.writeClipboardSafe(share.shareUrl, "Lien de partage copié.");
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
    for (const [root, meta] of this.folderSharesMeta) {
      if (meta.paths.includes(filePath)) {
        await this.removeSingleFileFromFolderShare(filePath, root, meta);
        return;
      }
    }

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

  /** Double frame : l’explorateur virtualisé monte souvent le DOM après `layout-change`. */
  private scheduleDecorateSharedUiSoon(): void {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => this.decorateSharedUi());
    });
  }

  private teardownFileExplorerDecorationObserver(): void {
    if (this.explorerMutateDebounceTimer != null) {
      window.clearTimeout(this.explorerMutateDebounceTimer);
      this.explorerMutateDebounceTimer = null;
    }
    this.fileExplorerObserver?.disconnect();
    this.fileExplorerObserver = null;
    this.fileExplorerObservedEl = null;
  }

  /**
   * Recolle un MutationObserver sur le conteneur de l’explorateur de fichiers
   * (listes virtualisées : les lignes dossier n’existent pas au premier paint).
   */
  private ensureFileExplorerDecorationObserver(): void {
    if (this.folderSharesMeta.size === 0) {
      this.teardownFileExplorerDecorationObserver();
      return;
    }
    const leaves = this.app.workspace.getLeavesOfType("file-explorer");
    const leaf = leaves[0];
    if (!leaf) return;
    const view = leaf.view as { containerEl?: HTMLElement };
    const root = view?.containerEl;
    if (!root || root === this.fileExplorerObservedEl) return;

    this.teardownFileExplorerDecorationObserver();
    this.fileExplorerObservedEl = root;
    this.fileExplorerObserver = new MutationObserver(() => {
      if (this.decorateSharedUiRunning) return;
      if (this.explorerMutateDebounceTimer != null) {
        window.clearTimeout(this.explorerMutateDebounceTimer);
      }
      this.explorerMutateDebounceTimer = window.setTimeout(() => {
        this.explorerMutateDebounceTimer = null;
        if (this.decorateSharedUiRunning) return;
        this.decorateSharedUi();
      }, 400);
    });
    this.fileExplorerObserver.observe(root, { childList: true, subtree: true });
  }

  /** Clé `folderSharesMeta` correspondant au chemin affiché dans le DOM (normalisation). */
  private resolveFolderShareMetaKey(domPath: string): string | null {
    if (this.folderSharesMeta.has(domPath)) return domPath;
    const n = normalizePath(domPath);
    if (this.folderSharesMeta.has(n)) return n;
    for (const k of this.folderSharesMeta.keys()) {
      if (normalizePath(k) === n) return k;
    }
    return null;
  }

  private collectFolderDecorationMounts(): Array<{ metaKey: string; mount: HTMLElement }> {
    const out: Array<{ metaKey: string; mount: HTMLElement }> = [];
    const seen = new Set<string>();

    const push = (rawPath: string | null, mount: HTMLElement | null | undefined): void => {
      if (!rawPath || !mount) return;
      const key = this.resolveFolderShareMetaKey(rawPath);
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ metaKey: key, mount });
    };

    // Obsidian récent : tree item + self[data-path]
    document
      .querySelectorAll<HTMLElement>(".tree-item.nav-folder .tree-item-self[data-path]")
      .forEach((self) => {
        push(self.getAttribute("data-path"), self);
      });

    // Ancien UI : data-path sur .nav-folder
    document.querySelectorAll<HTMLElement>(".nav-folder[data-path]").forEach((folderEl) => {
      push(
        folderEl.getAttribute("data-path"),
        folderEl.querySelector<HTMLElement>(".nav-folder-title") ?? folderEl
      );
    });

    document.querySelectorAll<HTMLElement>(".nav-folder-title[data-path]").forEach((title) => {
      push(title.getAttribute("data-path"), title);
    });

    // Fallback : data-path sur un enfant (virtualisation / thèmes)
    document.querySelectorAll<HTMLElement>(".nav-folder").forEach((folderEl) => {
      const p =
        folderEl.getAttribute("data-path") ??
        folderEl.querySelector<HTMLElement>(".tree-item-self[data-path]")?.getAttribute("data-path") ??
        folderEl.querySelector<HTMLElement>("[data-path]")?.getAttribute("data-path") ??
        null;
      const mount =
        folderEl.querySelector<HTMLElement>(".tree-item-self") ??
        folderEl.querySelector<HTMLElement>(".nav-folder-title") ??
        folderEl.querySelector<HTMLElement>(".tree-item-inner") ??
        folderEl;
      push(p, mount);
    });

    return out;
  }

  private decorateSharedUi(): void {
    if (this.decorateSharedUiRunning) {
      this.decorateSharedUiCoalesce = true;
      return;
    }
    this.decorateSharedUiRunning = true;

    let explorerWasObserving = false;
    if (this.fileExplorerObserver && this.fileExplorerObservedEl) {
      this.fileExplorerObserver.disconnect();
      explorerWasObserving = true;
    }

    try {
      this.clearDecorations();
      if (this.sharedNotes.size === 0 && this.folderSharesMeta.size === 0) return;

      const fileTitles = document.querySelectorAll<HTMLElement>(".nav-file-title[data-path]");
      fileTitles.forEach((title) => {
        const path = title.getAttribute("data-path");
        if (!path || !this.sharedNotes.has(path)) return;
        const icon = this.buildNoteSharedIndicator(path);
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
        const icon = this.buildNoteSharedIndicator(path);
        titleEl.appendChild(icon);
        this.decoratedEls.add(icon);
      });

      for (const { metaKey, mount } of this.collectFolderDecorationMounts()) {
        const icon = this.buildFolderSharedIndicator(metaKey);
        mount.appendChild(icon);
        this.decoratedEls.add(icon);
      }

      if (this.folderSharesMeta.size > 0) {
        this.ensureFileExplorerDecorationObserver();
      }
    } finally {
      if (
        explorerWasObserving &&
        this.fileExplorerObserver &&
        this.fileExplorerObservedEl
      ) {
        this.fileExplorerObserver.observe(this.fileExplorerObservedEl, {
          childList: true,
          subtree: true
        });
      }
      this.decorateSharedUiRunning = false;
      if (this.decorateSharedUiCoalesce) {
        this.decorateSharedUiCoalesce = false;
        queueMicrotask(() => this.decorateSharedUi());
      }
    }
  }

  /** Icône Lucide pour la session active (sync / WS / reconcile). */
  private getActiveSessionIconName(): string {
    if (!this.activeRuntime) return "link-2";
    const p = this.activeRuntime.provider;
    if (this.postSyncReconcileRunning) return "loader-2";
    if (this.collabWsStatus === "connecting") return "loader-2";
    if (!p.wsconnected) return "wifi-off";
    if (!p.synced) return "refresh-cw";
    return "link-2";
  }

  private buildNoteSharedIndicator(filePath: string): HTMLElement {
    const indicator = document.createElement("span");
    indicator.className = "markpad-shared-indicator";
    const active = this.activeRuntime?.filePath === filePath;
    setIcon(indicator, active ? this.getActiveSessionIconName() : "link-2");
    indicator.title = "Markpad partagé (clic pour copier le lien)";
    return indicator;
  }

  private buildFolderSharedIndicator(folderRootPath: string): HTMLElement {
    const indicator = document.createElement("span");
    indicator.className = "markpad-folder-shared-indicator";
    const active =
      this.activeRuntime?.mode === "folder" &&
      this.activeRuntime.folderRoot === folderRootPath;
    setIcon(indicator, active ? this.getActiveSessionIconName() : "folders");
    indicator.title = "Dossier Markpad partagé (clic pour copier le lien)";
    return indicator;
  }

  /** Signature compacte de la liste des partages (panneau latéral). */
  private getSharesPanelSignature(): string {
    return this.getSharesForPanel()
      .map((r) => `${r.kind}:${r.pathKey}:${r.roomId}`)
      .sort()
      .join("|");
  }

  private migrateYMapKeyAfterFileRename(oldPath: string, newPath: string, roomId: string): void {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.roomId !== roomId) return;
    const files = this.activeRuntime.doc.getMap("files");
    const entry = files.get(oldPath);
    if (!isNoteFileEntry(entry)) return;
    this.activeRuntime.doc.transact(() => {
      files.delete(oldPath);
      files.set(newPath, entry);
    }, "markpad-rename-file-key");
  }

  private migrateFolderKeysInYDoc(oldRoot: string, newRoot: string, roomId: string): void {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.roomId !== roomId) return;
    const files = this.activeRuntime.doc.getMap("files");
    const entries = Array.from(files.entries());
    for (const [k, v] of entries) {
      if (!isNoteFileEntry(v)) continue;
      let newKey: string | null = null;
      if (k.startsWith(`${oldRoot}/`)) {
        newKey = `${newRoot}/${k.slice(oldRoot.length + 1)}`;
      } else if (k === oldRoot) {
        newKey = newRoot;
      }
      if (newKey == null || newKey === k) continue;
      this.activeRuntime.doc.transact(() => {
        files.delete(k);
        files.set(newKey, v);
      }, "markpad-rename-folder-keys");
    }
  }

  private async applyFolderShareAfterFolderRename(oldPath: string, newPath: string): Promise<void> {
    const remap = (p: string): string => {
      if (p === oldPath) return newPath;
      if (p.startsWith(`${oldPath}/`)) return `${newPath}/${p.slice(oldPath.length + 1)}`;
      return p;
    };

    for (const [root, meta] of Array.from(this.folderSharesMeta.entries())) {
      if (root !== oldPath && !root.startsWith(`${oldPath}/`)) continue;
      const newRoot = remap(root);
      this.folderSharesMeta.delete(root);
      meta.paths = [...new Set(meta.paths.map(remap))];
      meta.anchorPath = remap(meta.anchorPath);
      this.folderSharesMeta.set(newRoot, meta);
      for (const p of meta.paths) {
        this.sharedNotes.set(p, { roomId: meta.roomId, shareUrl: meta.shareUrl });
      }
      this.migrateFolderKeysInYDoc(root, newRoot, meta.roomId);
      if (
        this.activeRuntime?.mode === "folder" &&
        this.activeRuntime.roomId === meta.roomId
      ) {
        this.activeRuntime.folderRoot = newRoot;
        this.activeRuntime.sharedPaths = meta.paths;
        this.activeRuntime.filePath = remap(this.activeRuntime.filePath);
      }
      try {
        await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      } catch {
        // meilleur effort
      }
    }
    this.rebuildSharedNotesFromFrontmatter();
    this.decorateSharedUi();
    this.refreshSharesPanel();
  }

  private async handleVaultDelete(file: TAbstractFile): Promise<void> {
    if (file instanceof TFolder) {
      for (const [root] of Array.from(this.folderSharesMeta.entries())) {
        if (root === file.path || root.startsWith(`${file.path}/`)) {
          await this.stopSharingFolderByPath(root);
        }
      }
      return;
    }
    if (!(file instanceof TFile)) return;

    if (file.name === FOLDER_SHARE_FILENAME) {
      const root = file.parent?.path ?? "";
      const meta = this.folderSharesMeta.get(root);
      if (meta && normalizePath(meta.anchorPath) === normalizePath(file.path)) {
        await this.stopSharingFolderByPath(root);
      }
      return;
    }

    for (const [root, meta] of this.folderSharesMeta) {
      if (!meta.paths.includes(file.path)) continue;
      await this.removeSingleFileFromFolderShare(file.path, root, meta);
      return;
    }

    const share = this.sharedNotes.get(file.path);
    if (!share) return;
    try {
      await endShareSession({
        serverUrl: this.settings.serverUrl,
        settings: this.settings,
        roomId: share.roomId
      });
    } catch {
      // room déjà absente
    }
    this.sharedNotes.delete(file.path);
    if (this.activeRuntime?.filePath === file.path) {
      this.disconnect();
    } else {
      this.decorateSharedUi();
    }
    this.refreshSharesPanel();
  }

  /** Retire un fichier du partage dossier (room conservée s’il reste des fichiers). */
  private async removeSingleFileFromFolderShare(
    filePath: string,
    folderRoot: string,
    meta: FolderShareMeta
  ): Promise<void> {
    if (!meta.paths.includes(filePath)) return;
    if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
      const files = this.activeRuntime.doc.getMap("files");
      this.activeRuntime.doc.transact(() => {
        files.delete(filePath);
      }, "markpad-remove-file-from-folder");
      if (this.activeRuntime.filePath === filePath) {
        this.disconnect();
      }
    }
    meta.paths = meta.paths.filter((p) => p !== filePath);
    this.sharedNotes.delete(filePath);
    this.folderSharesMeta.set(folderRoot, meta);
    if (
      this.activeRuntime?.mode === "folder" &&
      this.activeRuntime.roomId === meta.roomId
    ) {
      this.activeRuntime.sharedPaths = meta.paths;
    }

    if (meta.paths.length === 0) {
      try {
        await endShareSession({
          serverUrl: this.settings.serverUrl,
          settings: this.settings,
          roomId: meta.roomId
        });
      } catch {
        // ignore
      }
      this.folderSharesMeta.delete(folderRoot);
      const anchor = this.app.vault.getAbstractFileByPath(meta.anchorPath);
      if (anchor instanceof TFile) {
        try {
          await this.app.vault.delete(anchor);
        } catch {
          try {
            await this.app.fileManager.processFrontMatter(anchor, (fm) => {
              delete fm[FOLDER_SHARE_FM];
            });
          } catch {
            // ignore
          }
        }
      }
    } else {
      try {
        await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      } catch {
        // ignore
      }
    }
    this.decorateSharedUi();
    this.refreshSharesPanel();
    new Notice("Fichier retiré du partage dossier Markpad.");
  }

  private rebuildSharedNotesFromFrontmatter(): void {
    this.sharedNotes.clear();
    for (const file of this.app.vault.getMarkdownFiles()) {
      // Les fichiers ancres (commençant par '.') sont traités par rebuildFolderSharesFromFiles
      // qui utilise un accès direct au disque pour contourner le cache non indexé.
      if (file.name === FOLDER_SHARE_FILENAME) continue;
      this.syncShareFromFileFrontmatter(file);
    }
  }

  /**
   * Reconstruit folderSharesMeta depuis le vault en lisant directement les fichiers ancres.
   * Les fichiers dont le nom commence par '.' ne sont pas indexés par le metadataCache d'Obsidian,
   * donc on ne peut pas compter sur getFileCache(). On lit le fichier et on parse le YAML manuellement.
   */
  /**
   * Reconstruit folderSharesMeta en scannant le système de fichiers via vault.adapter.list().
   * vault.getFiles() peut exclure les fichiers dont le nom commence par '.' ;
   * l'adapter contourne cette restriction en lisant directement le disque.
   */
  private async rebuildFolderSharesFromFiles(): Promise<void> {
    this.folderSharesMeta.clear();

    // Collecte récursive des chemins d'ancres via le filesystem réel.
    const anchorPaths: string[] = [];
    const scanDir = async (dir: string): Promise<void> => {
      try {
        const listed = await this.app.vault.adapter.list(dir);
        for (const fp of listed.files) {
          const name = fp.includes("/") ? fp.slice(fp.lastIndexOf("/") + 1) : fp;
          if (name === FOLDER_SHARE_FILENAME) anchorPaths.push(fp);
        }
        for (const fd of listed.folders) {
          const name = fd.includes("/") ? fd.slice(fd.lastIndexOf("/") + 1) : fd;
          if (name === ".obsidian") continue; // jamais d'ancre dans .obsidian
          await scanDir(fd);
        }
      } catch { /* répertoire inaccessible ou non listé */ }
    };
    await scanDir("");

    for (const anchorPath of anchorPaths) {
      try {
        let raw: { roomId?: string; shareUrl?: string; filePaths?: string[] } | undefined;

        // Essai via le cache (fonctionne si Obsidian indexe ce fichier).
        const tfile = this.app.vault.getAbstractFileByPath(anchorPath);
        if (tfile instanceof TFile) {
          raw = this.app.metadataCache.getFileCache(tfile)?.frontmatter?.[FOLDER_SHARE_FM] as typeof raw;
        }

        // Lecture directe via adapter (contourne l'absence d'indexation des fichiers '.*').
        if (!raw) {
          const content = await this.app.vault.adapter.read(anchorPath);
          const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
          if (fmMatch) {
            const parsed = parseYaml(fmMatch[1]) as Record<string, unknown> | null;
            raw = parsed?.[FOLDER_SHARE_FM] as typeof raw;
          }
        }

        if (!raw?.roomId || !raw?.shareUrl || !Array.isArray(raw.filePaths)) continue;

        const lastSlash = anchorPath.lastIndexOf("/");
        const root = lastSlash > 0 ? anchorPath.slice(0, lastSlash) : "";
        const meta: FolderShareMeta = {
          roomId: raw.roomId,
          shareUrl: raw.shareUrl,
          paths: raw.filePaths,
          anchorPath
        };
        this.folderSharesMeta.set(root, meta);
        for (const p of raw.filePaths) {
          this.sharedNotes.set(p, { roomId: raw.roomId, shareUrl: raw.shareUrl });
        }
      } catch { continue; }
    }
    markpadCollabDebug("rebuildFolderSharesFromFiles", {
      scanned: anchorPaths.length,
      folderCount: this.folderSharesMeta.size,
      totalPaths: [...this.folderSharesMeta.values()].flatMap((m) => m.paths).length
    });
    this.refreshSharesPanel();
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
    // Ne pas effacer les fichiers membres d'un partage dossier : leur entrée dans sharedNotes
    // est gérée par syncFolderAnchorFromFile, pas par le frontmatter markpadShare du fichier lui-même.
    const isInFolder = [...this.folderSharesMeta.values()].some((m) => m.paths.includes(file.path));
    if (!isInFolder) this.sharedNotes.delete(file.path);
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

  private collectFolderShareSyncPathsInFolder(folder: TFolder): string[] {
    const out: string[] = [];
    const walk = (f: TAbstractFile): void => {
      if (f instanceof TFile && this.isFolderShareSyncFile(f)) {
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
    const paths = this.collectFolderShareSyncPathsInFolder(folder);
    if (paths.length === 0) {
      new Notice("Aucun fichier Markdown ni .base dans ce dossier.");
      return;
    }
    const openMarkdownPath = paths.find((p) => p.toLowerCase().endsWith(".md"));
    if (!openMarkdownPath) {
      new Notice(
        "Markpad : ajoutez au moins une note .md pour lancer le partage depuis Obsidian (les fichiers .base sont inclus pour le web)."
      );
      return;
    }
    this.disconnect();
    const anchorPath = normalizePath(`${folder.path}/${FOLDER_SHARE_FILENAME}`);
    markpadCollabDebug("folder:startSharing", {
      folderPath: folder.path,
      anchorPath,
      mdFiles: paths.length,
      pathsPreview: paths.slice(0, 8)
    });
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
        const first = this.app.vault.getAbstractFileByPath(openMarkdownPath);
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
      await this.writeClipboardSafe(created.shareUrl, `Dossier partagé — lien copié : ${created.shareUrl}`);
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
    const existing = this.app.vault.getAbstractFileByPath(pathNorm);
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
        const f = this.app.vault.getAbstractFileByPath(p);
        if (f instanceof TFile) {
          const raw = await this.app.vault.read(f);
          seedFileEntryFromMarkdown(doc, p, raw, "markpad-seed-folder");
        }
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
    const patchFolder = patchYWebsocketProviderOutbound(provider);
    markpadCollabDebug(
      patchFolder
        ? "folder:patchYWebsocket OK"
        : "folder:patchYWebsocket ÉCHOUÉ — _updateHandler absent (sortie WS cassée ?)",
      { patchFolder, roomId: meta.roomId, seedLocalFiles: options.seedLocalFiles }
    );
    if (!patchFolder && !this.patchFailedNoticeShown) {
      this.patchFailedNoticeShown = true;
      new Notice(
        "Markpad: optimisation WebSocket indisponible sur cette version d'Obsidian.\nLa synchronisation peut générer du trafic réseau supplémentaire.",
        8000
      );
    }
    provider.awareness.setLocalStateField("user", {
      name: this.settings.displayName,
      color: this.settings.color
    });
    provider.awareness.setLocalStateField("cursor", null);
    provider.awareness.on("change", () => this.updatePresenceInStatusBar(provider));
    provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
      markpadCollabDebug("folder:provider status", event);
      if (event.status === "connected") {
        this.collabHasEverConnected = true;
        this.collabIsReadonly = false;
        this.collabWsStatus = "connected";
        this.updatePresenceInStatusBar(provider);
        this.decorateSharedUi();
        if (this.collabReadonlyTimer !== null) {
          window.clearTimeout(this.collabReadonlyTimer);
          this.collabReadonlyTimer = null;
        }
        if (this.activeRuntime?.provider === provider && this.activeRuntime.cmView) {
          setCollabEditable(this.activeRuntime.cmView, true);
          markpadCollabDebug("folder: éditable (WS reconnecté)");
        }
        return;
      }
      if (event.status === "connecting") {
        this.collabWsStatus = "connecting";
        this.updateStatusBar("connecting");
        this.decorateSharedUi();
        this.startCollabReadonlyTimerIfNeeded(provider);
        return;
      }
      this.collabWsStatus = "disconnected";
      this.updateStatusBar("offline");
      this.decorateSharedUi();
      this.startCollabReadonlyTimerIfNeeded(provider);
    });
    provider.on("sync", (synced: boolean) => {
      markpadCollabDebug("folder:provider sync", { synced, wsconnected: provider.wsconnected });
    });
    if (!provider.synced) {
      await new Promise<void>((resolve) => {
        // Timeout de sécurité pour les réseaux mobiles instables (4G/Wi-Fi coupé).
        // Sans lui, la Promise ne se résoudrait jamais si le serveur est injoignable.
        // On continue sans premier sync ; Y.js se synchronisera dès que la connexion revient.
        const onSync = (synced: boolean) => {
          if (!synced) return;
          window.clearTimeout(timeoutId);
          provider.off("sync", onSync);
          resolve();
        };
        const timeoutId = window.setTimeout(() => {
          provider.off("sync", onSync);
          markpadCollabDebug("folder:sync timeout 15 s — poursuite sans attente initiale");
          resolve();
        }, 15000);
        provider.on("sync", onSync);
      });
    }
    let fileEntry = getFileEntry(doc, file.path);
    if (!fileEntry) {
      const raw = await this.app.vault.read(file);
      fileEntry = seedFileEntryFromMarkdown(doc, file.path, raw, "markpad-folder-open");
    }
    const yText = getBodyYText(fileEntry);
    const cm = resolveObsidianEditorView(view);
    if (!cm) {
      provider.destroy();
      doc.destroy();
      new Notice("Impossible de lier CodeMirror pour cette vue.");
      throw new Error("no_cm");
    }
    mountCollabExtensionWithYText(cm, yText, provider.awareness);
    applyYTextToCm(cm, yText);
    mountCollabEditable(cm, true);
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
    let folderRoot =
      anchorF instanceof TFile
        ? anchorF.parent?.path ?? ""
        : parentPathOf(normalizePath(meta.anchorPath));
    if (!folderRoot && meta.paths[0]) {
      folderRoot = parentPathOf(meta.paths[0]);
      markpadCollabDebug("folder:attach folderRoot dérivé de meta.paths[0] (ancre absente du cache)", {
        folderRoot,
        firstPath: meta.paths[0]
      });
    }
    markpadCollabDebug("folder:attach computed", {
      folderRoot,
      anchorPath: meta.anchorPath,
      activeFile: file.path,
      yMapKeys: [...files.keys()],
      metaPathsCount: meta.paths.length,
      wsconnected: provider.wsconnected,
      synced: provider.synced
    });
    const filesMap = doc.getMap("files");
    const onFilesChange = (): void => {
      if (!this.activeRuntime || this.activeRuntime.doc !== doc || this.activeRuntime.mode !== "folder") {
        return;
      }
      markpadCollabDebug("folder:Y.Map(files) observe → syncFolderFilesFromY");
      void this.syncFolderFilesFromY(meta, folderRoot, doc);
    };
    filesMap.observe(onFilesChange);
    this.collabWsStatus = provider.wsconnected ? "connected" : "connecting";
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
    const upgraded = migrateFilesMapLegacyToV2(doc, "markpad-folder-migrate-v2");
    if (upgraded > 0) {
      markpadCollabDebug("folder:migration Y.Text → body+meta", { upgraded });
    }
    void this.syncFolderFilesFromY(meta, folderRoot, doc);
    this.updatePresenceInStatusBar(provider);
  }

  private async onMarkdownCreated(file: TFile): Promise<void> {
    if (file.name === FOLDER_SHARE_FILENAME) return;
    if (!this.isFolderShareSyncFile(file)) return;
    for (const [root, meta] of this.folderSharesMeta) {
      if (!isPathInFolder(file.path, root)) continue;
      if (meta.paths.includes(file.path)) continue;
      meta.paths.push(file.path);
      this.sharedNotes.set(file.path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
      if (this.activeRuntime?.mode === "folder" && this.activeRuntime.roomId === meta.roomId) {
        const files = this.activeRuntime.doc.getMap("files");
        const cur = files.get(file.path);
        if (!(cur instanceof Y.Text) && !isNoteFileEntry(cur)) {
          const localRaw = await this.app.vault.read(file);
          seedFileEntryFromMarkdown(
            this.activeRuntime.doc,
            file.path,
            localRaw,
            "markpad-folder-new-file"
          );
        } else if (cur instanceof Y.Text) {
          upgradeLegacyFileEntry(
            this.activeRuntime.doc,
            file.path,
            cur,
            "markpad-folder-new-file"
          );
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
      markpadCollabDebug("folder:syncFolderFilesFromY skip (pas de runtime dossier actif)");
      return;
    }
    const files = doc.getMap("files");
    markpadCollabDebug("folder:syncFolderFilesFromY enter", {
      folderRoot,
      mapEntries: files.size,
      metaPaths: meta.paths.length
    });
    const activePath = this.activeRuntime.filePath;
    const yPaths = new Set<string>();
    let changed = false;
    this.suppressVaultToY = true;
    try {
      for (const [path, rawValue] of files.entries()) {
        if (typeof path !== "string") continue;
        let value: unknown = rawValue;
        if (value instanceof Y.Text) {
          value = upgradeLegacyFileEntry(doc, path, value, "markpad-folder-sync-upgrade");
        }
        if (!isNoteFileEntry(value)) {
          markpadCollabDebug("folder:sync skip (entrée non v2 body+meta)", path);
          continue;
        }
        if (!isFolderSharePath(path)) continue;
        if (!isPathInFolder(path, folderRoot)) continue;
        if (path.endsWith(`/${FOLDER_SHARE_FILENAME}`)) continue;

        yPaths.add(path);
        if (!meta.paths.includes(path)) {
          meta.paths.push(path);
          this.sharedNotes.set(path, { roomId: meta.roomId, shareUrl: meta.shareUrl });
          changed = true;
          markpadCollabDebug("folder:sync nouvelle entrée meta depuis Y", path);
        }

        const markdown = assembleFileEntry(value);
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (!existing) {
          try {
            const dir = folderPartOf(path);
            if (dir) await this.ensureFolderTree(dir);
            await this.app.vault.create(path, markdown);
            changed = true;
            markpadCollabDebug("folder:sync fichier créé sur le vault depuis Y", path);
          } catch (e) {
            markpadCollabDebug("folder:sync création vault échouée", path, e);
          }
        } else if (existing instanceof TFile && path !== activePath) {
          try {
            const onDisk = await this.app.vault.read(existing);
            if (onDisk !== markdown) {
              await this.app.vault.modify(existing, markdown);
              changed = true;
              markpadCollabDebug("folder:sync fichier mis à jour depuis Y", path);
            }
          } catch (e) {
            markpadCollabDebug("folder:sync modify vault échouée", path, e);
          }
        }
      }

      const removedFromY = meta.paths.filter(
        (p) =>
          isFolderSharePath(p) &&
          isPathInFolder(p, folderRoot) &&
          !p.endsWith(`/${FOLDER_SHARE_FILENAME}`) &&
          !yPaths.has(p)
      );
      for (const path of removedFromY) {
        meta.paths = meta.paths.filter((p) => p !== path);
        this.sharedNotes.delete(path);
        changed = true;
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (existing instanceof TFile) {
          try {
            await this.app.vault.delete(existing);
            markpadCollabDebug("folder:sync fichier supprimé du vault (absent de Y)", path);
          } catch (e) {
            markpadCollabDebug("folder:sync suppression vault échouée", path, e);
          }
        }
        if (activePath === path) {
          this.disconnect();
        }
      }
    } finally {
      this.suppressVaultToY = false;
    }

    if (changed) {
      this.folderSharesMeta.set(folderRoot, meta);
      if (this.activeRuntime.sharedPaths) {
        this.activeRuntime.sharedPaths = meta.paths;
      }
      await this.ensureFolderAnchorFile(meta.anchorPath, meta, meta.paths);
      this.decorateSharedUi();
      this.refreshSharesPanel();
    }
  }

  private async switchFolderActiveFile(file: TFile): Promise<void> {
    if (!this.activeRuntime || this.activeRuntime.mode !== "folder") return;
    if (this.activeRuntime.filePath === file.path) return;
    const files = this.activeRuntime.doc.getMap("files");
    let fileEntry = getFileEntry(this.activeRuntime.doc, file.path);
    const legacy = files.get(file.path);
    if (!fileEntry && legacy instanceof Y.Text) {
      fileEntry = upgradeLegacyFileEntry(
        this.activeRuntime.doc,
        file.path,
        legacy,
        "markpad-folder-switch"
      );
    } else if (!fileEntry) {
      const raw = await this.app.vault.read(file);
      fileEntry = seedFileEntryFromMarkdown(
        this.activeRuntime.doc,
        file.path,
        raw,
        "markpad-folder-switch"
      );
    }
    const yText = getBodyYText(fileEntry);
    const cm = this.activeRuntime.cmView;
    // Démonte les deux compartments proprement pour éviter une double extension sur le nouveau fichier.
    unmountCollabEditable(cm);
    unmountCollabExtension(cm);
    this.activeRuntime.yText = yText;
    this.activeRuntime.filePath = file.path;
    mountCollabExtensionWithYText(cm, yText, this.activeRuntime.provider.awareness);
    applyYTextToCm(cm, yText);
    mountCollabEditable(cm, !this.collabIsReadonly);
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

  /** Supprime les fichiers ancre `.markpad-folder-share.md`, arrête les sessions côté serveur (meilleur effort) et réinitialise l’état local. */
  public async purgeFolderShareAnchors(): Promise<void> {
    const roots = Array.from(this.folderSharesMeta.keys());
    for (const root of roots) {
      await this.stopSharingFolderByPath(root);
    }
    const orphans: TFile[] = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (f.name === FOLDER_SHARE_FILENAME) orphans.push(f);
    }
    for (const f of orphans) {
      try {
        await this.app.vault.delete(f);
      } catch {
        // ignore
      }
    }
    this.folderSharesMeta.clear();
    this.rebuildSharedNotesFromFrontmatter();
    this.disconnect();
    this.decorateSharedUi();
    this.refreshSharesPanel();
    new Notice("Fichiers .markpad-folder-share.md supprimés et métadonnées dossier réinitialisées.");
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

  public getActiveSharedRoom(): { roomId: string; filePath: string | null; kind: "note" | "folder" } | null {
    if (!this.activeRuntime) return null;
    return {
      roomId: this.activeRuntime.roomId,
      filePath: this.activeRuntime.mode === "folder" ? (this.activeRuntime.filePath ?? null) : null,
      kind: this.activeRuntime.mode
    };
  }

  public getActiveSharedDocumentText(): string | null {
    if (!this.activeRuntime) return null;
    const { doc, mode, filePath } = this.activeRuntime;
    if (mode === "folder") {
      const entry = getFileEntry(doc, filePath);
      if (entry) return assembleFileEntry(entry);
    } else {
      const root = doc.getMap("note");
      if (hasNoteFileShape(root)) return assembleFileEntry(root);
    }
    return this.activeRuntime.yText.toString();
  }

  public async openHistoryPanel(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(MARKPAD_HISTORY_VIEW_TYPE);
    if (existing.length > 0) {
      this.app.workspace.revealLeaf(existing[0]!);
      void (existing[0]!.view as MarkpadHistoryView).refresh();
      return;
    }
    const leaf =
      this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: MARKPAD_HISTORY_VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  private async copyShareLinkForFolder(folderRootPath: string): Promise<void> {
    const meta = this.folderSharesMeta.get(folderRootPath);
    if (!meta) {
      new Notice("Ce dossier n'a pas de partage Markpad.");
      return;
    }
    await this.writeClipboardSafe(meta.shareUrl, "Lien du dossier copié.");
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
