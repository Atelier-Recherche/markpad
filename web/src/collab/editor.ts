import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { extractPresence } from "./presence";

export interface CollabRuntime {
  doc: Y.Doc;
  provider: WebsocketProvider;
  destroy: () => void;
}

type FrontmatterSplit = {
  frontmatter: string;
  body: string;
};

const splitFrontmatter = (raw: string): FrontmatterSplit => {
  if (!raw.startsWith("---\n")) {
    return { frontmatter: "", body: raw };
  }
  const lines = raw.split("\n");
  let closing = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i] === "---" || lines[i] === "...") {
      closing = i;
      break;
    }
  }
  if (closing === -1) {
    return { frontmatter: "", body: raw };
  }
  const frontmatter = `${lines.slice(0, closing + 1).join("\n")}\n`;
  const body = lines.slice(closing + 1).join("\n");
  return { frontmatter, body };
};

export const createCollabEditor = (input: {
  parent: HTMLElement;
  wsBaseUrl: string;
  roomId: string;
  userId: string;
  name: string;
  color: string;
  password?: string;
  onStatus: (status: "connected" | "offline") => void;
  onPresence: (users: Array<{ id: string; name: string; color: string }>) => void;
  onTextChange?: (text: string) => void;
}): CollabRuntime => {
  const doc = new Y.Doc();
  const provider = new WebsocketProvider(`${input.wsBaseUrl}/ws`, input.roomId, doc, {
    params: {
      userId: input.userId,
      name: input.name,
      color: input.color,
      password: input.password ?? ""
    }
  });

  provider.on("status", (event: { status: "connected" | "disconnected" | "connecting" }) => {
    input.onStatus(event.status === "connected" ? "connected" : "offline");
  });

  provider.awareness.on("update", () => {
    input.onPresence(extractPresence(provider.awareness));
  });

  provider.awareness.setLocalStateField("user", {
    name: input.name,
    color: input.color
  });

  const yText = doc.getText("content");
  const host = document.createElement("div");
  host.className = "milkdown-host";
  input.parent.innerHTML = "";
  input.parent.appendChild(host);

  let destroyed = false;
  let applyingRemote = false;
  let hiddenFrontmatter = "";
  let localMirror = splitFrontmatter(yText.toString()).body;
  type MilkdownLike = {
    create?: () => Promise<void>;
    destroy?: () => void;
    getMarkdown?: () => string;
    setMarkdown?: (value: string) => void;
  };
  let editor: MilkdownLike | null = null;

  const yTextObserver = () => {
    const nextRaw = yText.toString();
    const split = splitFrontmatter(nextRaw);
    hiddenFrontmatter = split.frontmatter;
    localMirror = split.body;
    input.onTextChange?.(split.body);
    if (!editor || !editor.setMarkdown || applyingRemote) return;
    applyingRemote = true;
    try {
      editor.setMarkdown(split.body);
    } finally {
      applyingRemote = false;
    }
  };
  yText.observe(yTextObserver);
  yTextObserver();

  void (async () => {
    const { Crepe } = await import("@milkdown/crepe");
    if (destroyed) return;
    const crepe = new Crepe({
      root: host,
      defaultValue: localMirror
    }) as unknown as MilkdownLike;
    editor = crepe;
    if (typeof editor?.create === "function") {
      await editor.create();
    }
    if (destroyed) return;
    if (typeof editor?.setMarkdown === "function") {
      editor.setMarkdown(localMirror);
    }
  })();

  const syncTimer = window.setInterval(() => {
    if (!editor || !editor.getMarkdown || applyingRemote) return;
    const current = editor.getMarkdown();
    if (current === localMirror) return;
    localMirror = current;
    input.onTextChange?.(current);
    const nextRaw = `${hiddenFrontmatter}${current}`;
    doc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, nextRaw);
    }, "milkdown-local");
  }, 250);

  return {
    doc,
    provider,
    destroy: () => {
      destroyed = true;
      window.clearInterval(syncTimer);
      yText.unobserve(yTextObserver);
      provider.destroy();
      if (editor && typeof editor.destroy === "function") {
        editor.destroy();
      }
      doc.destroy();
      input.parent.innerHTML = "";
    }
  };
};
