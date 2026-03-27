import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { createCollabEditor } from "../collab/editor";

type ConnectionStatus = "connected" | "offline";
type ViewMode = "edit" | "preview";

const randomId = (): string => {
  const rnd = crypto.getRandomValues(new Uint32Array(2));
  return `web-${rnd[0].toString(16)}${rnd[1].toString(16)}`;
};

export const App = () => {
  const { roomId = "" } = useParams();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("offline");
  const [password, setPassword] = useState("");
  const [presence, setPresence] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState("Guest");
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  const wsBaseUrl = useMemo(() => {
    const raw = import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234";
    return String(raw).replace(/^http/i, "ws");
  }, []);

  useEffect(() => {
    if (!started || !mountRef.current || !roomId) return;
    const runtime = createCollabEditor({
      parent: mountRef.current,
      wsBaseUrl,
      roomId,
      userId: randomId(),
      name,
      color: "#0ea5e9",
      password,
      onStatus: setStatus,
      onPresence: setPresence,
      onTextChange: setMarkdown
    });
    return () => runtime.destroy();
  }, [started, roomId, wsBaseUrl, name, password]);

  const renderedMarkdown = useMemo(
    () => marked.parse(markdown, { async: false }) as string,
    [markdown]
  );

  return (
    <main className="page">
      <header className="topbar">
        <h1>Markpad</h1>
        <div className="topbar-actions">
          <button
            className="mode-toggle"
            onClick={() =>
              setViewMode((prev) => (prev === "edit" ? "preview" : "edit"))
            }
          >
            {viewMode === "edit" ? "Aperçu" : "Édition"}
          </button>
          <span className={`badge ${status}`}>
            {status === "connected" ? "Connecté" : "Hors-ligne"}
          </span>
        </div>
      </header>

      {!started ? (
        <section className="join">
          <h2>Rejoindre la room</h2>
          <label>
            Votre nom
            <input
              autoComplete="off"
              name="markpad_display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Mot de passe room (optionnel)
            <input
              type="password"
              autoComplete="new-password"
              name="markpad_room_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button onClick={() => setStarted(true)}>Se connecter</button>
        </section>
      ) : null}

      <section className="presence">
        {presence.map((user) => (
          <span key={user.id} className="user" style={{ borderColor: user.color }}>
            <i style={{ backgroundColor: user.color }} /> {user.name}
          </span>
        ))}
      </section>

      <section className="editor-container">
        <div
          ref={mountRef}
          className="editor"
          style={{ display: viewMode === "edit" ? "block" : "none" }}
        />
        <article
          className="preview markdown-body"
          style={{ display: viewMode === "preview" ? "block" : "none" }}
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />
      </section>
    </main>
  );
};
