import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorState } from "@codemirror/state";
import { EditorView, placeholder } from "@codemirror/view";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { yCollab } from "y-codemirror.next";
import { basicSetup } from "codemirror";
import {
  getNoteBodyYText,
  getOrCreateFileEntry,
  getBodyYText
} from "@markpad/collab-note";
import { patchYWebsocketProviderOutbound } from "./patchYWebsocketProviderOutbound";
import { extractPresence } from "./presence";
import * as mdFmt from "./markdownFormat";
import { createLivePreviewExtension } from "./livePreview/index";

export interface CollabRuntime {
  doc: Y.Doc;
  provider: WebsocketProvider;
  /** Présent après la première sync Yjs. */
  view: EditorView | null;
  /** Corps seul dans Yjs v2 ; le pliage FM n’a plus d’effet (conservé pour l’API). */
  setFrontmatterFolded: (folded: boolean) => void;
  setLineNumbersVisible: (visible: boolean) => void;
  setLocalDisplayName: (name: string) => void;
  formatBold: () => void;
  formatItalic: () => void;
  formatHeading1: () => void;
  formatHeading2: () => void;
  formatHeading3: () => void;
  formatBullet: () => void;
  formatOrdered: () => void;
  formatQuote: () => void;
  formatCode: () => void;
  formatLink: () => void;
  formatHr: () => void;
  /** Recalcule la mise en page CodeMirror (p.ex. après changement de panneau). */
  refreshLayout: () => void;
  /** Déplace le conteneur CM sans recréer le WebSocket (changement vue Kanban / aperçu). */
  reparent: (parent: HTMLElement) => void;
  switchActiveFile: (activeFilePath: string | null, folderPaths?: string[]) => void;
  destroy: () => void;
}

const markpadCmTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      fontSize: "15px",
      backgroundColor: "var(--surface-strong)",
      color: "var(--text)"
    },
    ".cm-scroller": {
      fontFamily:
        '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
      lineHeight: "1.55"
    },
    ".cm-content": { padding: "16px 18px", minHeight: "100%" },
    ".cm-gutters": {
      backgroundColor: "var(--surface)",
      color: "color-mix(in srgb, var(--text) 45%, transparent)",
      borderRight: "1px solid var(--border)"
    },
    ".cm-activeLineGutter": {
      backgroundColor: "color-mix(in srgb, var(--button-bg) 12%, transparent)"
    },
    ".cm-activeLine": {
      backgroundColor: "color-mix(in srgb, var(--text) 4%, transparent)"
    },
    ".cm-selectionBackground": {
      backgroundColor: "color-mix(in srgb, var(--button-bg) 35%, transparent) !important"
    },
    "&.cm-focused .cm-selectionBackground": {
      backgroundColor: "color-mix(in srgb, var(--button-bg) 45%, transparent) !important"
    },
    ".cm-cursor": { borderLeftColor: "var(--text)" }
  }
);

const resolveBodyYText = (
  ydoc: Y.Doc,
  folderPaths: string[] | undefined,
  activeFilePath: string | null | undefined
): Y.Text => {
  const path = activeFilePath;
  if (folderPaths?.length && path) {
    return getBodyYText(getOrCreateFileEntry(ydoc, path));
  }
  return getNoteBodyYText(ydoc);
};

export const createCollabEditor = (input: {
  parent: HTMLElement;
  wsBaseUrl: string;
  roomId: string;
  userId: string;
  name: string;
  color: string;
  password?: string;
  initialHideFrontmatter?: boolean;
  initialShowLineNumbers?: boolean;
  onStatus: (status: "connected" | "offline") => void;
  onPresence: (users: Array<{ id: string; name: string; color: string }>) => void;
  onTextChange?: (text: string) => void;
  guestLabel?: string;
  folderPaths?: string[];
  activeFilePath?: string | null;
  /** Aperçu live éditeur : surlignage des tableaux GFM (défaut true). */
  markdownTables?: boolean;
}): CollabRuntime => {
  void input.initialHideFrontmatter;
  const ydoc = new Y.Doc();

  const provider = new WebsocketProvider(`${input.wsBaseUrl}/ws`, input.roomId, ydoc, {
    /** Évite la fusion inter-onglets (BroadcastChannel) qui peut brouiller la présence. */
    disableBc: true,
    params: {
      userId: input.userId,
      name: input.name,
      color: input.color,
      password: input.password ?? ""
    }
  });
  patchYWebsocketProviderOutbound(provider);

  const guestFallback = input.guestLabel?.trim() || "Guest";

  provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
    input.onStatus(event.status === "connected" ? "connected" : "offline");
  });

  const emitPresence = () => {
    input.onPresence(
      extractPresence(
        provider.awareness,
        provider.awareness.doc.clientID,
        guestFallback
      )
    );
  };

  provider.awareness.on("update", emitPresence);
  provider.awareness.setLocalStateField("user", {
    name: input.name,
    color: input.color
  });
  emitPresence();

  let view: EditorView | null = null;
  let root: HTMLDivElement | null = null;
  let hostParent: HTMLElement = input.parent;
  let yText: Y.Text | null = null;
  let cursorInterval = 0;
  let onSel: (() => void) | null = null;
  let folderPathsRef = input.folderPaths;
  let activeFilePathRef = input.activeFilePath ?? null;

  const teardownCursor = (): void => {
    if (cursorInterval) {
      window.clearInterval(cursorInterval);
      cursorInterval = 0;
    }
    if (onSel) {
      document.removeEventListener("selectionchange", onSel);
      onSel = null;
    }
  };

  const mountEditorView = (): void => {
    if (!yText || !root) return;
    teardownCursor();
    if (view) {
      view.destroy();
      view = null;
    }

    type YCollabUiOpts = {
      getUserColor?: (u: { color?: string }) => string;
      getUserName?: (u: { name?: string }) => string;
    };
    const yCollabUi: YCollabUiOpts = {
      getUserColor: (u: { color?: string }) => u.color ?? "#0ea5e9",
      getUserName: (u: { name?: string }) => u.name?.trim() || guestFallback
    };
    // @ts-expect-error La définition TypeScript de yCollab omet getUserName/getUserColor (supportées à l’exécution).
    const yCollabExt = yCollab(yText, provider.awareness, yCollabUi);

    const pushCursor = (ed: EditorView): void => {
      if (!yText) return;
      const sel = ed.state.selection.main;
      const anchor = Y.createRelativePositionFromTypeIndex(yText, sel.anchor);
      const head = Y.createRelativePositionFromTypeIndex(yText, sel.head);
      const local = provider.awareness.getLocalState();
      const cur = local?.cursor as { anchor?: object; head?: object } | null;
      const ca =
        cur?.anchor == null ? null : Y.createRelativePositionFromJSON(cur.anchor);
      const ch = cur?.head == null ? null : Y.createRelativePositionFromJSON(cur.head);
      if (
        ca != null &&
        ch != null &&
        Y.compareRelativePositions(ca, anchor) &&
        Y.compareRelativePositions(ch, head)
      ) {
        return;
      }
      provider.awareness.setLocalStateField("cursor", { anchor, head });
    };

    const initial = yText.length > 0 ? yText.toString() : "";

    view = new EditorView({
      parent: root,
      state: EditorState.create({
        doc: initial,
        extensions: [
          basicSetup,
          markdown({ base: markdownLanguage }),
          markpadCmTheme,
          createLivePreviewExtension({
            tables: input.markdownTables !== false
          }),
          placeholder("Markdown collaboratif…"),
          yCollabExt,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              input.onTextChange?.(yText!.toString());
            }
            if (u.selectionSet || u.docChanged) {
              pushCursor(u.view);
            }
          })
        ]
      })
    });

    input.onTextChange?.(yText.toString());

    const showLineNumbers = input.initialShowLineNumbers !== false;
    if (!showLineNumbers) {
      root.classList.add("markpad-cm-root--no-linenum");
    }

    cursorInterval = window.setInterval(() => {
      if (view) pushCursor(view);
    }, 150);

    onSel = () => {
      if (view) pushCursor(view);
    };
    document.addEventListener("selectionchange", onSel);
  };

  const buildEditor = (): void => {
    if (view) return;
    yText = resolveBodyYText(ydoc, folderPathsRef, activeFilePathRef);
    hostParent.innerHTML = "";
    root = document.createElement("div");
    root.className = "markpad-cm-root";
    hostParent.appendChild(root);
    mountEditorView();
  };

  const reparent = (nextParent: HTMLElement): void => {
    if (hostParent === nextParent && root?.parentElement === nextParent) return;
    hostParent = nextParent;
    if (!root) return;
    nextParent.innerHTML = "";
    nextParent.appendChild(root);
    view?.requestMeasure();
  };

  const switchActiveFile = (
    activeFilePath: string | null,
    folderPaths?: string[]
  ): void => {
    if (folderPaths !== undefined) folderPathsRef = folderPaths;
    activeFilePathRef = activeFilePath;
    if (!provider.synced) return;
    yText = resolveBodyYText(ydoc, folderPathsRef, activeFilePathRef);
    if (!root) {
      buildEditor();
      return;
    }
    mountEditorView();
  };

  if (provider.synced) {
    buildEditor();
  } else {
    provider.on("sync", (synced: boolean) => {
      if (synced) buildEditor();
    });
  }

  return {
    doc: ydoc,
    provider,
    get view(): EditorView | null {
      return view;
    },
    setFrontmatterFolded: () => {
      /* Yjs v2 : le corps est dans body, le YAML dans meta — pas de masquage CM. */
    },
    setLineNumbersVisible: (visible: boolean) => {
      root?.classList.toggle("markpad-cm-root--no-linenum", !visible);
    },
    setLocalDisplayName: (name: string) => {
      const cur = provider.awareness.getLocalState()?.user as
        | { color?: string }
        | undefined;
      provider.awareness.setLocalStateField("user", {
        name,
        color: cur?.color ?? input.color
      });
      emitPresence();
    },
    formatBold: () => view && mdFmt.insertAround(view, "**"),
    formatItalic: () => view && mdFmt.insertAround(view, "*"),
    formatHeading1: () => view && mdFmt.setHeadingLevel(view, 1),
    formatHeading2: () => view && mdFmt.setHeadingLevel(view, 2),
    formatHeading3: () => view && mdFmt.setHeadingLevel(view, 3),
    formatBullet: () => view && mdFmt.toggleLinePrefix(view, "- "),
    formatOrdered: () => view && mdFmt.toggleLinePrefix(view, "1. "),
    formatQuote: () => view && mdFmt.toggleLinePrefix(view, "> "),
    formatCode: () => view && mdFmt.insertInlineCode(view),
    formatLink: () => view && mdFmt.insertLink(view),
    formatHr: () => view && mdFmt.insertHr(view),
    refreshLayout: () => {
      if (view) {
        view.requestMeasure();
      }
    },
    reparent,
    switchActiveFile,
    destroy: () => {
      window.clearInterval(cursorInterval);
      if (onSel) document.removeEventListener("selectionchange", onSel);
      provider.awareness.off("update", emitPresence);
      provider.destroy();
      if (view) {
        view.destroy();
        view = null;
      }
      ydoc.destroy();
      hostParent.innerHTML = "";
    }
  };
};
