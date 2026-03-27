import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { createCollabEditor } from "../collab/editor";

type ConnectionStatus = "connected" | "offline";
type ViewMode = "edit" | "source" | "preview";
type ThemeMode = "dark" | "light";
type TocItem = { id: string; level: number; text: string };

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
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("markpad-theme");
    return stored === "light" ? "light" : "dark";
  });
  const [tocOpen, setTocOpen] = useState(true);

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

  const { renderedMarkdown, toc } = useMemo(() => {
    const lines = markdown.split("\n");
    const items: TocItem[] = [];
    const slugCount = new Map<string, number>();
    const slugify = (text: string): string => {
      const base = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      const count = slugCount.get(base) ?? 0;
      slugCount.set(base, count + 1);
      return count === 0 ? base : `${base}-${count}`;
    };
    for (const line of lines) {
      const match = /^(#{1,6})\s+(.+)$/.exec(line);
      if (!match) continue;
      const text = match[2].trim();
      items.push({ id: slugify(text), level: match[1].length, text });
    }

    const renderer = new marked.Renderer();
    renderer.heading = function ({ tokens, depth }) {
      const plain = (tokens as Array<{ raw?: string; text?: string }>)
        .map((t) => (t.raw ?? t.text ?? ""))
        .join("")
        .trim();
      const id = slugify(plain || `section-${depth}`);
      const inline = this.parser.parseInline(tokens);
      return `<h${depth} id="${id}">${inline}</h${depth}>`;
    };
    let html = "";
    try {
      html = marked.parse(markdown, { async: false, renderer }) as string;
    } catch {
      // Fallback simple pour ne jamais casser toute la vue preview.
      const escaped = markdown
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
      html = `<pre>${escaped}</pre>`;
    }
    return { renderedMarkdown: html, toc: items };
  }, [markdown]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("markpad-theme", theme);
  }, [theme]);

  const onSourceChange = (value: string) => {
    setMarkdown(value);
  };

  const goToHeading = (id: string) => {
    const container = document.querySelector(".preview") as HTMLElement | null;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!el) return;
    container.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  };

  return (
    <main className="page">
      <header className="topbar">
        <h1>Markpad</h1>
        <div className="topbar-actions">
          <button className={`mode-toggle ${viewMode === "edit" ? "active" : ""}`} onClick={() => setViewMode("edit")}>Édition</button>
          <button className={`mode-toggle ${viewMode === "source" ? "active" : ""}`} onClick={() => setViewMode("source")}>Source</button>
          <button className={`mode-toggle ${viewMode === "preview" ? "active" : ""}`} onClick={() => setViewMode("preview")}>Preview</button>
          <button className="mode-toggle" onClick={() => setTocOpen((v) => !v)}>
            {tocOpen ? "Masquer plan" : "Afficher plan"}
          </button>
          <button
            className="mode-toggle"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "Thème clair" : "Thème sombre"}
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

      <section className="workspace">
        <section className="editor-container">
          <div
            ref={mountRef}
            className="editor"
            style={{ display: viewMode === "edit" ? "block" : "none" }}
          />
          <textarea
            className="source-editor"
            style={{ display: viewMode === "source" ? "block" : "none" }}
            value={markdown}
            onChange={(e) => onSourceChange(e.target.value)}
          />
          <article
            className="preview markdown-body"
            style={{ display: viewMode === "preview" ? "block" : "none" }}
            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
          />
        </section>
        {tocOpen ? (
          <aside className="toc-panel">
            <h3>Plan</h3>
            {toc.length === 0 ? <p>Aucun titre.</p> : null}
            {toc.map((item) => (
              <button
                key={item.id}
                className="toc-item"
                style={{ paddingLeft: `${item.level * 10}px` }}
                onClick={() => {
                  setViewMode("preview");
                  setTimeout(() => goToHeading(item.id), 20);
                }}
              >
                {item.text}
              </button>
            ))}
          </aside>
        ) : null}
      </section>
    </main>
  );
};
