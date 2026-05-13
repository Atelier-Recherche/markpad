import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export type RoomChatMessage = {
  id: number;
  senderDisplayName: string;
  body: string;
  createdAt: string;
  senderClientId: string;
};

type ApiChatRow = {
  id: number;
  sender_display_name: string;
  body: string;
  created_at: string;
  sender_client_id: string;
};

type RoomChatPanelProps = {
  roomId: string;
  roomPassword: string;
  httpBaseUrl: string;
  wsBaseUrl: string;
  userId: string;
  displayName: string;
};

const mapRow = (r: ApiChatRow): RoomChatMessage => ({
  id: r.id,
  senderDisplayName: r.sender_display_name,
  body: r.body,
  createdAt: r.created_at,
  senderClientId: r.sender_client_id
});

export const RoomChatPanel = ({
  roomId,
  roomPassword,
  httpBaseUrl,
  wsBaseUrl,
  userId,
  displayName
}: RoomChatPanelProps) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<RoomChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed">("connecting");
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const appendUnique = useCallback((msg: RoomChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const u = new URL(
          `${httpBaseUrl}/sessions/${encodeURIComponent(roomId)}/chat`
        );
        u.searchParams.set("roomPassword", roomPassword);
        const res = await fetch(u.toString());
        if (!res.ok) return;
        const data = (await res.json()) as { messages?: ApiChatRow[] };
        if (cancelled) return;
        const rows = (data.messages ?? []).map(mapRow);
        setMessages(rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
      } catch {
        /* ignore */
      }
    };
    void load();

    const qs = new URLSearchParams({
      userId,
      password: roomPassword
    });
    if (displayName.trim()) qs.set("name", displayName.trim());
    const wsUrl = `${wsBaseUrl}/ws/chat/${encodeURIComponent(roomId)}?${qs.toString()}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    setWsStatus("connecting");

    ws.onopen = () => {
      setWsStatus("open");
    };

    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(String(ev.data)) as {
          type?: string;
          id?: number;
          senderDisplayName?: string;
          body?: string;
          createdAt?: string;
          senderClientId?: string;
        };
        if (data.type === "chat" && typeof data.id === "number" && data.body != null) {
          appendUnique({
            id: data.id,
            senderDisplayName: String(data.senderDisplayName ?? ""),
            body: String(data.body),
            createdAt: String(data.createdAt ?? new Date().toISOString()),
            senderClientId: String(data.senderClientId ?? "")
          });
        }
      } catch {
        /* ignore */
      }
    };

    ws.onclose = () => {
      setWsStatus("closed");
      wsRef.current = null;
    };

    return () => {
      cancelled = true;
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, roomPassword, userId, displayName, httpBaseUrl, wsBaseUrl, appendUnique]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (): void => {
    const text = draft.trim();
    if (!text || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        body: text,
        displayName: displayName.trim()
      })
    );
    setDraft("");
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel__head">
        <h3 className="chat-panel__title">{t("chat.title")}</h3>
        <p className="chat-panel__status" aria-live="polite">
          {wsStatus === "open"
            ? t("chat.connected")
            : wsStatus === "connecting"
              ? t("chat.connecting")
              : t("chat.disconnected")}
        </p>
      </div>
      <ul className="chat-panel__messages" aria-label={t("chat.title")}>
        {messages.length === 0 ? <li className="chat-panel__empty">{t("chat.empty")}</li> : null}
        {messages.map((m) => (
          <li key={m.id} className="chat-panel__msg">
            <div className="chat-panel__msg-meta">
              <strong>{m.senderDisplayName}</strong>
              <time dateTime={m.createdAt}>
                {new Date(m.createdAt).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short"
                })}
              </time>
            </div>
            <div className="chat-panel__msg-body">{m.body}</div>
          </li>
        ))}
        <div ref={listEndRef} />
      </ul>
      <div className="chat-panel__composer">
        <input
          type="text"
          className="chat-panel__input"
          value={draft}
          maxLength={4000}
          placeholder={t("chat.placeholder")}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button type="button" className="chat-panel__send" onClick={send} disabled={wsStatus !== "open"}>
          {t("chat.send")}
        </button>
      </div>
    </div>
  );
};
