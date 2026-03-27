import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { extractPresence } from "./presence";

export interface CollabRuntime {
  view: EditorView;
  doc: Y.Doc;
  provider: WebsocketProvider;
  destroy: () => void;
}

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
  const yTextObserver = () => {
    input.onTextChange?.(yText.toString());
  };
  yText.observe(yTextObserver);
  yTextObserver();

  const state = EditorState.create({
    extensions: [
      keymap.of([]),
      markdown(),
      EditorView.lineWrapping,
      yCollab(yText, provider.awareness)
    ]
  });

  const view = new EditorView({
    state:
      state as unknown as NonNullable<
        ConstructorParameters<typeof EditorView>[0]
      >["state"],
    parent: input.parent
  });

  return {
    view,
    doc,
    provider,
    destroy: () => {
      yText.unobserve(yTextObserver);
      provider.destroy();
      view.destroy();
      doc.destroy();
    }
  };
};
