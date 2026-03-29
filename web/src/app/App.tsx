import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import {
  Bold,
  BookOpen,
  Braces,
  Code,
  Columns2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  ListTree,
  Minus,
  Moon,
  Pencil,
  Sun,
  TextQuote,
  Wifi,
  WifiOff,
  Hash
} from "lucide-react";
import { createCollabEditor, type CollabRuntime } from "../collab/editor";
import { getFrontmatterPrefixLength } from "../collab/frontmatter";

type ConnectionStatus = "connected" | "offline";
/** Comme Obsidian : édition (source CM6), lecture (aperçu), ou scission. */
type ViewMode = "edit" | "preview" | "split";
type ThemeMode = "dark" | "light";
type TocItem = { id: string; level: number; text: string };

const randomId = (): string => {
  const rnd = crypto.getRandomValues(new Uint32Array(2));
  return `web-${rnd[0].toString(16)}${rnd[1].toString(16)}`;
};

const iconBtnClass = (active: boolean): string =>
  `obsidian-tool ${active ? "obsidian-tool--active" : ""}`;

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
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("markpad-theme");
    return stored === "light" ? "light" : "dark";
  });
  const [tocOpen, setTocOpen] = useState(true);
  const [hideFrontmatter, setHideFrontmatter] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [runtime, setRuntime] = useState<CollabRuntime | null>(null);

  const wsBaseUrl = useMemo(() => {
    const raw = import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234";
    return String(raw).replace(/^http/i, "ws");
  }, []);

  useEffect(() => {
    if (!started || !mountRef.current || !roomId) return;
    const rt = createCollabEditor({
      parent: mountRef.current,
      wsBaseUrl,
      roomId,
      userId: randomId(),
      name,
      color: "#0ea5e9",
      password,
      initialHideFrontmatter: hideFrontmatter,
      initialShowLineNumbers: showLineNumbers,
      onStatus: setStatus,
      onPresence: setPresence,
      onTextChange: setMarkdown
    });
    setRuntime(rt);
    return () => {
      setRuntime(null);
      rt.destroy();
    };
  }, [started, roomId, wsBaseUrl, password]);

  useEffect(() => {
    runtime?.setFrontmatterFolded(hideFrontmatter);
  }, [hideFrontmatter, runtime]);

  useEffect(() => {
    runtime?.setLineNumbersVisible(showLineNumbers);
  }, [showLineNumbers, runtime]);

  const { renderedMarkdown, toc } = useMemo(() => {
    const fmLen = getFrontmatterPrefixLength(markdown);
    const body =
      hideFrontmatter && fmLen != null ? markdown.slice(fmLen) : markdown;
    const lines = body.split("\n");
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
      html = marked.parse(body, { async: false, renderer }) as string;
    } catch {
      const escaped = body
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
      html = `<pre>${escaped}</pre>`;
    }
    return { renderedMarkdown: html, toc: items };
  }, [markdown, hideFrontmatter]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("markpad-theme", theme);
  }, [theme]);

  const goToHeading = (id: string) => {
    const container = document.querySelector(".preview") as HTMLElement | null;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!el) return;
    container.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
  };

  const showEditor = viewMode === "edit" || viewMode === "split";
  const showPreview = viewMode === "preview" || viewMode === "split";
  const hasFrontmatter = getFrontmatterPrefixLength(markdown) != null;

  return (
    <main className="page">
      <header className="topbar">
        <div className="topbar-brand">
          <h1>Markpad</h1>
          <span className="topbar-sub">Invité · CodeMirror 6</span>
        </div>
        <div className="topbar-actions">
          {started ? (
            <div className="presence" aria-label="Personnes connectées">
              {presence.map((user) => (
                <span key={user.id} className="user" style={{ borderColor: user.color }}>
                  <i style={{ backgroundColor: user.color }} /> {user.name}
                </span>
              ))}
            </div>
          ) : null}
          <span className={`badge ${status}`}>
            {status === "connected" ? (
              <>
                <Wifi size={14} strokeWidth={2} aria-hidden />
                Connecté
              </>
            ) : (
              <>
                <WifiOff size={14} strokeWidth={2} aria-hidden />
                Hors-ligne
              </>
            )}
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

      {started ? (
        <div className="toolbar-stack">
          <nav className="obsidian-toolbar" aria-label="Mode d’affichage">
            <div className="obsidian-toolbar__group">
              <button
                type="button"
                className={iconBtnClass(viewMode === "edit")}
                title="Éditer (source)"
                aria-label="Éditer (source)"
                aria-pressed={viewMode === "edit"}
                onClick={() => setViewMode("edit")}
              >
                <Pencil size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={iconBtnClass(viewMode === "preview")}
                title="Lecture (aperçu)"
                aria-label="Lecture (aperçu)"
                aria-pressed={viewMode === "preview"}
                onClick={() => setViewMode("preview")}
              >
                <BookOpen size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={iconBtnClass(viewMode === "split")}
                title="Scinder édition / aperçu"
                aria-label="Scinder édition et aperçu"
                aria-pressed={viewMode === "split"}
                onClick={() => setViewMode("split")}
              >
                <Columns2 size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="obsidian-toolbar__sep" aria-hidden />
            <div className="obsidian-toolbar__group">
              <button
                type="button"
                className={iconBtnClass(tocOpen)}
                title="Plan du document"
                aria-label="Afficher ou masquer le plan"
                aria-pressed={tocOpen}
                onClick={() => setTocOpen((v) => !v)}
              >
                <ListTree size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="obsidian-tool"
                title={theme === "dark" ? "Thème clair" : "Thème sombre"}
                aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? (
                  <Sun size={18} strokeWidth={2} />
                ) : (
                  <Moon size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </nav>

          {showEditor ? (
            <nav className="obsidian-toolbar" aria-label="Édition Markdown">
              <div className="obsidian-toolbar__group">
                <button
                  type="button"
                  className={iconBtnClass(hideFrontmatter)}
                  title="Masquer le frontmatter (éditeur et aperçu)"
                  aria-label="Masquer le frontmatter YAML"
                  aria-pressed={hideFrontmatter}
                  disabled={!hasFrontmatter}
                  onClick={() => setHideFrontmatter((v) => !v)}
                >
                  <Braces size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={iconBtnClass(showLineNumbers)}
                  title="Numéros de ligne"
                  aria-label="Afficher ou masquer les numéros de ligne"
                  aria-pressed={showLineNumbers}
                  onClick={() => setShowLineNumbers((v) => !v)}
                >
                  <Hash size={18} strokeWidth={2} />
                </button>
              </div>
              <div className="obsidian-toolbar__sep" aria-hidden />
              <div className="obsidian-toolbar__group">
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Gras"
                  aria-label="Gras"
                  onClick={() => runtime?.formatBold()}
                >
                  <Bold size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Italique"
                  aria-label="Italique"
                  onClick={() => runtime?.formatItalic()}
                >
                  <Italic size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Titre 1"
                  aria-label="Titre niveau 1"
                  onClick={() => runtime?.formatHeading1()}
                >
                  <Heading1 size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Titre 2"
                  aria-label="Titre niveau 2"
                  onClick={() => runtime?.formatHeading2()}
                >
                  <Heading2 size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Titre 3"
                  aria-label="Titre niveau 3"
                  onClick={() => runtime?.formatHeading3()}
                >
                  <Heading3 size={18} strokeWidth={2} />
                </button>
              </div>
              <div className="obsidian-toolbar__sep" aria-hidden />
              <div className="obsidian-toolbar__group">
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Liste à puces"
                  aria-label="Liste à puces"
                  onClick={() => runtime?.formatBullet()}
                >
                  <List size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Liste numérotée"
                  aria-label="Liste numérotée"
                  onClick={() => runtime?.formatOrdered()}
                >
                  <ListOrdered size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Citation"
                  aria-label="Citation"
                  onClick={() => runtime?.formatQuote()}
                >
                  <TextQuote size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Code inline"
                  aria-label="Code inline"
                  onClick={() => runtime?.formatCode()}
                >
                  <Code size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Lien"
                  aria-label="Insérer un lien"
                  onClick={() => runtime?.formatLink()}
                >
                  <Link size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title="Ligne horizontale"
                  aria-label="Ligne horizontale"
                  onClick={() => runtime?.formatHr()}
                >
                  <Minus size={18} strokeWidth={2} />
                </button>
              </div>
            </nav>
          ) : null}
        </div>
      ) : null}

      <section
        className={`workspace workspace--${viewMode}${tocOpen ? "" : " workspace--no-toc"}`}
      >
        <section
          className={`editor-shell ${showEditor && showPreview ? "editor-shell--split" : ""}`}
        >
          <div
            ref={mountRef}
            className="editor"
            style={{ display: showEditor ? "block" : "none" }}
          />
          <article
            className="preview markdown-body"
            style={{ display: showPreview ? "block" : "none" }}
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
                  setViewMode((m) => (m === "edit" ? "split" : m));
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
