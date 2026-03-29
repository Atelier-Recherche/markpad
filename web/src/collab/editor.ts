import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorState } from "@codemirror/state";
import { EditorView, placeholder } from "@codemirror/view";
import { foldEffect, unfoldEffect } from "@codemirror/language";
import { markdown } from "@codemirror/lang-markdown";
import { yCollab } from "y-codemirror.next";
import { basicSetup } from "codemirror";
import { patchYWebsocketProviderOutbound } from "./patchYWebsocketProviderOutbound";
import { extractPresence } from "./presence";
import { getFrontmatterPrefixLength } from "./frontmatter";
import * as mdFmt from "./markdownFormat";

export interface CollabRuntime {
  doc: Y.Doc;
  provider: WebsocketProvider;
  view: EditorView;
  setFrontmatterFolded: (folded: boolean) => void;
  setLineNumbersVisible: (visible: boolean) => void;
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
}): CollabRuntime => {
  const ydoc = new Y.Doc();
  const yText = ydoc.getText("content");

  const provider = new WebsocketProvider(`${input.wsBaseUrl}/ws`, input.roomId, ydoc, {
    params: {
      userId: input.userId,
      name: input.name,
      color: input.color,
      password: input.password ?? ""
    }
  });
  patchYWebsocketProviderOutbound(provider);

  provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
    input.onStatus(event.status === "connected" ? "connected" : "offline");
  });

  const emitPresence = () => {
    input.onPresence(
      extractPresence(provider.awareness, provider.awareness.doc.clientID)
    );
  };

  provider.awareness.on("update", emitPresence);
  provider.awareness.setLocalStateField("user", {
    name: input.name,
    color: input.color
  });
  emitPresence();

  input.parent.innerHTML = "";
  const root = document.createElement("div");
  root.className = "markpad-cm-root";
  input.parent.appendChild(root);

  type YCollabUiOpts = {
    getUserColor?: (u: { color?: string }) => string;
    getUserName?: (u: { name?: string }) => string;
  };
  const yCollabUi: YCollabUiOpts = {
    getUserColor: (u: { color?: string }) => u.color ?? "#0ea5e9",
    getUserName: (u: { name?: string }) => u.name?.trim() || "Invité"
  };
  // @ts-expect-error La définition TypeScript de yCollab omet getUserName/getUserColor (supportées à l’exécution).
  const yCollabExt = yCollab(yText, provider.awareness, yCollabUi);

  const pushCursor = (view: EditorView): void => {
    const sel = view.state.selection.main;
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

  const view = new EditorView({
    parent: root,
    state: EditorState.create({
      doc: initial,
      extensions: [
        basicSetup,
        markdown(),
        markpadCmTheme,
        placeholder("Markdown collaboratif…"),
        yCollabExt,
        EditorView.updateListener.of((u) => {
          if (u.docChanged) {
            input.onTextChange?.(yText.toString());
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

  const applyFrontmatterFold = (folded: boolean): void => {
    const text = yText.toString();
    const len = getFrontmatterPrefixLength(text);
    if (len == null || len <= 0) {
      return;
    }
    const range = { from: 0, to: len };
    view.dispatch({
      effects: folded ? foldEffect.of(range) : unfoldEffect.of(range)
    });
  };

  if (input.initialHideFrontmatter) {
    requestAnimationFrame(() => applyFrontmatterFold(true));
  }

  const cursorInterval = window.setInterval(() => {
    pushCursor(view);
  }, 150);

  const onSel = () => {
    pushCursor(view);
  };
  document.addEventListener("selectionchange", onSel);

  return {
    doc: ydoc,
    provider,
    view,
    setFrontmatterFolded: applyFrontmatterFold,
    setLineNumbersVisible: (visible: boolean) => {
      root.classList.toggle("markpad-cm-root--no-linenum", !visible);
    },
    formatBold: () => mdFmt.insertAround(view, "**"),
    formatItalic: () => mdFmt.insertAround(view, "*"),
    formatHeading1: () => mdFmt.setHeadingLevel(view, 1),
    formatHeading2: () => mdFmt.setHeadingLevel(view, 2),
    formatHeading3: () => mdFmt.setHeadingLevel(view, 3),
    formatBullet: () => mdFmt.toggleLinePrefix(view, "- "),
    formatOrdered: () => mdFmt.toggleLinePrefix(view, "1. "),
    formatQuote: () => mdFmt.toggleLinePrefix(view, "> "),
    formatCode: () => mdFmt.insertInlineCode(view),
    formatLink: () => mdFmt.insertLink(view),
    formatHr: () => mdFmt.insertHr(view),
    destroy: () => {
      window.clearInterval(cursorInterval);
      document.removeEventListener("selectionchange", onSel);
      provider.awareness.off("update", emitPresence);
      provider.destroy();
      view.destroy();
      ydoc.destroy();
      input.parent.innerHTML = "";
    }
  };
};
