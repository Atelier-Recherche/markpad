import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import {
  Bold,
  BookOpen,
  Braces,
  Clock,
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
  Hash,
  Languages,
  FolderTree
} from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { createCollabEditor, type CollabRuntime } from "../collab/editor";
import { getFrontmatterPrefixLength } from "../collab/frontmatter";
import { SUPPORTED_LOCALES, setLocale, type SupportedLocale } from "../i18n/index";
import { FileTreePanel } from "./FileTreePanel";
import { HistoryPanel } from "./HistoryPanel";

const DISPLAY_NAME_KEY = "markpad-display-name";
const UI_ONBOARDING_KEY = "markpad-ui-onboarding";

const hasCompletedUiOnboarding = (): boolean => {
  try {
    return localStorage.getItem(UI_ONBOARDING_KEY) === "1";
  } catch {
    return true;
  }
};

type ConnectionStatus = "connected" | "offline";
type ViewMode = "edit" | "preview" | "split";
type ThemeMode = "dark" | "light";
type TocItem = { id: string; level: number; text: string };
type JoinGate = "checking" | "open" | "password" | "missing" | "error";

const randomId = (): string => {
  const rnd = crypto.getRandomValues(new Uint32Array(2));
  return `web-${rnd[0].toString(16)}${rnd[1].toString(16)}`;
};

const iconBtnClass = (active: boolean): string =>
  `obsidian-tool ${active ? "obsidian-tool--active" : ""}`;

const getStableUserId = (): string => {
  const key = "markpad-user-id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = randomId();
    sessionStorage.setItem(key, id);
  }
  return id;
};

export const App = () => {
  const { t, i18n } = useTranslation();
  const { roomId = "" } = useParams();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stableUserId = useMemo(() => getStableUserId(), []);

  const [status, setStatus] = useState<ConnectionStatus>("offline");
  const [password, setPassword] = useState("");
  const [presence, setPresence] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const [started, setStarted] = useState(false);
  const [name, setName] = useState(() => localStorage.getItem(DISPLAY_NAME_KEY) ?? "");
  const [markdown, setMarkdown] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (!hasCompletedUiOnboarding()) return "edit";
    const s = localStorage.getItem("markpad-view-mode");
    if (s === "edit" || s === "preview" || s === "split") return s;
    return "split";
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("markpad-theme");
    return stored === "light" ? "light" : "dark";
  });
  const [tocOpen, setTocOpen] = useState(() => {
    if (!hasCompletedUiOnboarding()) return false;
    return localStorage.getItem("markpad-toc-open") !== "false";
  });
  const [historyOpen, setHistoryOpen] = useState(() => {
    if (!hasCompletedUiOnboarding()) return false;
    return localStorage.getItem("markpad-history-open") === "true";
  });
  const [treeOpen, setTreeOpen] = useState(() => {
    if (!hasCompletedUiOnboarding()) return false;
    return localStorage.getItem("markpad-tree-open") !== "false";
  });
  const [hideFrontmatter, setHideFrontmatter] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(() => {
    if (!hasCompletedUiOnboarding()) return false;
    return localStorage.getItem("markpad-line-numbers") !== "false";
  });
  const [runtime, setRuntime] = useState<CollabRuntime | null>(null);
  const [joinGate, setJoinGate] = useState<JoinGate>("checking");
  const [folderMode, setFolderMode] = useState(false);
  const [folderPaths, setFolderPaths] = useState<string[]>([]);
  const [folderRootPrefix, setFolderRootPrefix] = useState("");
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null);

  const showEditor = viewMode === "edit" || viewMode === "split";
  const showPreview = viewMode === "preview" || viewMode === "split";
  /** Ne change qu’entre aperçu seul (montage Yjs dérobé) et les modes avec éditeur visible. */
  const editorMountSurface =
    !showEditor && showPreview ? "preview-only" : "editor-surface";

  const displayName =
    name.trim() ||
    `${t("presence.webTag")} · ${stableUserId.replace(/^web-/, "")}`;

  const wsBaseUrl = useMemo(() => {
    const raw = import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234";
    return String(raw).replace(/^http/i, "ws");
  }, []);

  const httpBaseUrl = useMemo(() => {
    const raw = import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234";
    return String(raw).replace(/\/$/, "");
  }, []);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setJoinGate("checking");
    setStarted(false);

    const run = async (): Promise<void> => {
      try {
        const res = await fetch(`${httpBaseUrl}/sessions/${encodeURIComponent(roomId)}/validate`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ roomPassword: "" })
        });
        if (cancelled) return;
        if (res.ok) {
          const data = (await res.json()) as {
            kind?: string;
            filePaths?: string[];
            folderPath?: string;
          };
          if (data.kind === "folder" && Array.isArray(data.filePaths)) {
            setFolderMode(true);
            setFolderPaths(data.filePaths);
            setFolderRootPrefix(typeof data.folderPath === "string" ? data.folderPath : "");
            setActiveFilePath(data.filePaths[0] ?? null);
          } else {
            setFolderMode(false);
            setFolderPaths([]);
            setFolderRootPrefix("");
            setActiveFilePath(null);
          }
          const stored = localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
          if (stored) setName(stored);
          setStarted(true);
          setJoinGate("open");
          return;
        }
        if (res.status === 401) {
          setFolderMode(false);
          setJoinGate("password");
          return;
        }
        if (res.status === 404) {
          setJoinGate("missing");
          return;
        }
        setJoinGate("error");
      } catch {
        if (!cancelled) setJoinGate("error");
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [roomId, httpBaseUrl]);

  useEffect(() => {
    localStorage.setItem(DISPLAY_NAME_KEY, name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("markpad-view-mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem("markpad-toc-open", tocOpen ? "true" : "false");
  }, [tocOpen]);

  useEffect(() => {
    localStorage.setItem("markpad-history-open", historyOpen ? "true" : "false");
  }, [historyOpen]);

  useEffect(() => {
    localStorage.setItem("markpad-tree-open", treeOpen ? "true" : "false");
  }, [treeOpen]);

  useEffect(() => {
    localStorage.setItem("markpad-line-numbers", showLineNumbers ? "true" : "false");
  }, [showLineNumbers]);

  useEffect(() => {
    if (started) {
      try {
        localStorage.setItem(UI_ONBOARDING_KEY, "1");
      } catch {
        /* ignore */
      }
    }
  }, [started]);

  useEffect(() => {
    if (!started || !mountRef.current || !roomId) return;
    const rt = createCollabEditor({
      parent: mountRef.current,
      wsBaseUrl,
      roomId,
      userId: stableUserId,
      name: displayName,
      color: "#0ea5e9",
      password,
      initialHideFrontmatter: hideFrontmatter,
      initialShowLineNumbers: showLineNumbers,
      onStatus: setStatus,
      onPresence: setPresence,
      onTextChange: setMarkdown,
      guestLabel: t("guest"),
      folderPaths: folderMode ? folderPaths : undefined,
      activeFilePath: folderMode ? activeFilePath : undefined
    });
    setRuntime(rt);
    return () => {
      setRuntime(null);
      rt.destroy();
    };
  }, [
    started,
    roomId,
    wsBaseUrl,
    password,
    stableUserId,
    folderMode,
    folderPaths,
    activeFilePath,
    hideFrontmatter,
    showLineNumbers,
    displayName,
    editorMountSurface
  ]);

  useEffect(() => {
    if (!runtime) return;
    const id = window.requestAnimationFrame(() => {
      runtime.refreshLayout();
      window.requestAnimationFrame(() => runtime.refreshLayout());
    });
    return () => window.cancelAnimationFrame(id);
  }, [viewMode, tocOpen, treeOpen, runtime]);

  useEffect(() => {
    runtime?.setLocalDisplayName(displayName);
  }, [displayName, runtime]);

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

  const tryJoinWithPassword = useCallback(async (): Promise<void> => {
    if (!roomId) return;
    try {
      const res = await fetch(`${httpBaseUrl}/sessions/${encodeURIComponent(roomId)}/validate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roomPassword: password })
      });
      if (!res.ok) {
        setJoinGate(res.status === 404 ? "missing" : "password");
        return;
      }
      const data = (await res.json()) as {
        kind?: string;
        filePaths?: string[];
        folderPath?: string;
      };
      if (data.kind === "folder" && Array.isArray(data.filePaths)) {
        setFolderMode(true);
        setFolderPaths(data.filePaths);
        setFolderRootPrefix(typeof data.folderPath === "string" ? data.folderPath : "");
        setActiveFilePath(data.filePaths[0] ?? null);
      } else {
        setFolderMode(false);
        setFolderPaths([]);
        setFolderRootPrefix("");
        setActiveFilePath(null);
      }
      setStarted(true);
      setJoinGate("open");
    } catch {
      setJoinGate("error");
    }
  }, [roomId, httpBaseUrl, password]);

  const onRenameSelf = (e: React.MouseEvent): void => {
    e.preventDefault();
    const next = window.prompt(t("presence.rename"), name || displayName);
    if (next === null) return;
    const trimmed = next.trim();
    if (!trimmed) return;
    setName(trimmed);
  };

  const hasFrontmatter = getFrontmatterPrefixLength(markdown) != null;

  const showJoinUi = joinGate === "password" || joinGate === "missing" || joinGate === "error";
  const showChecking = joinGate === "checking";

  return (
    <main className="page">
      <header className="topbar">
        <div className="topbar-brand">
          <h1>{t("brand.title")}</h1>
          <span className="topbar-sub">{t("brand.subtitle")}</span>
        </div>
        <div className="topbar-actions">
          <label className="lang-select" title={t("language.label")}>
            <Languages size={14} strokeWidth={2} aria-hidden />
            <select
              value={i18n.language.startsWith("de") ? "de" : i18n.language.slice(0, 2)}
              onChange={(e) => setLocale(e.target.value as SupportedLocale)}
              aria-label={t("language.label")}
            >
              {SUPPORTED_LOCALES.map((lng) => (
                <option key={lng} value={lng}>
                  {lng.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          {started ? (
            <>
              <button
                type="button"
                className="user user--local"
                title={t("presence.rename")}
                onContextMenu={onRenameSelf}
                aria-label={`${t("presence.you")}: ${displayName}`}
              >
                <i style={{ backgroundColor: "#0ea5e9" }} />
                {t("presence.you")}: {displayName}
              </button>
              <div className="presence" aria-label={t("presence.label")}>
                {presence.map((user) => (
                  <span key={user.id} className="user" style={{ borderColor: user.color }}>
                    <i style={{ backgroundColor: user.color }} /> {user.name}
                  </span>
                ))}
              </div>
            </>
          ) : null}
          <span className={`badge ${status}`}>
            {status === "connected" ? (
              <>
                <Wifi size={14} strokeWidth={2} aria-hidden />
                {t("connection.connected")}
              </>
            ) : (
              <>
                <WifiOff size={14} strokeWidth={2} aria-hidden />
                {t("connection.offline")}
              </>
            )}
          </span>
        </div>
      </header>

      {showChecking ? (
        <section className="join join--status">
          <p>{t("join.checking")}</p>
        </section>
      ) : null}

      {showJoinUi ? (
        <section className="join">
          <h2>{t("join.title")}</h2>
          {joinGate === "missing" ? <p className="join-error">{t("join.notFound")}</p> : null}
          {joinGate === "error" ? <p className="join-error">{t("join.notFound")}</p> : null}
          {joinGate === "password" ? <p>{t("join.passwordRequired")}</p> : null}
          <label>
            {t("join.yourName")}
            <input
              autoComplete="off"
              name="markpad_display_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            {t("join.roomPassword")}
            <span className="join-hint">{t("join.roomPasswordOptional")}</span>
            <input
              type="password"
              autoComplete="new-password"
              name="markpad_room_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="button" onClick={() => void tryJoinWithPassword()}>
            {t("join.connect")}
          </button>
        </section>
      ) : null}

      {started ? (
        <div className="toolbar-stack">
          <nav className="obsidian-toolbar" aria-label={t("toolbar.viewMode")}>
            <div className="obsidian-toolbar__group">
              <button
                type="button"
                className={iconBtnClass(viewMode === "edit")}
                title={t("toolbar.editSource")}
                aria-label={t("toolbar.editSource")}
                aria-pressed={viewMode === "edit"}
                onClick={() => setViewMode("edit")}
              >
                <Pencil size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={iconBtnClass(viewMode === "preview")}
                title={t("toolbar.preview")}
                aria-label={t("toolbar.preview")}
                aria-pressed={viewMode === "preview"}
                onClick={() => setViewMode("preview")}
              >
                <BookOpen size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={iconBtnClass(viewMode === "split")}
                title={t("toolbar.split")}
                aria-label={t("toolbar.split")}
                aria-pressed={viewMode === "split"}
                onClick={() => setViewMode("split")}
              >
                <Columns2 size={18} strokeWidth={2} />
              </button>
            </div>
            <div className="obsidian-toolbar__sep" aria-hidden />
            <div className="obsidian-toolbar__group">
              {folderMode && folderPaths.length > 0 ? (
                <button
                  type="button"
                  className={iconBtnClass(treeOpen)}
                  title={t("toolbar.fileTree")}
                  aria-label={t("toolbar.fileTree")}
                  aria-pressed={treeOpen}
                  onClick={() => setTreeOpen((v) => !v)}
                >
                  <FolderTree size={18} strokeWidth={2} />
                </button>
              ) : null}
              <button
                type="button"
                className={iconBtnClass(tocOpen)}
                title={t("toolbar.toc")}
                aria-label={t("toolbar.toc")}
                aria-pressed={tocOpen}
                onClick={() => setTocOpen((v) => !v)}
              >
                <ListTree size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className={iconBtnClass(historyOpen)}
                title={t("toolbar.history")}
                aria-label={t("toolbar.history")}
                aria-pressed={historyOpen}
                onClick={() => setHistoryOpen((v) => !v)}
              >
                <Clock size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                className="obsidian-tool"
                title={theme === "dark" ? t("toolbar.themeLight") : t("toolbar.themeDark")}
                aria-label={
                  theme === "dark" ? t("toolbar.themeLight") : t("toolbar.themeDark")
                }
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
            <nav className="obsidian-toolbar" aria-label={t("toolbar.markdown")}>
              <div className="obsidian-toolbar__group">
                <button
                  type="button"
                  className={iconBtnClass(hideFrontmatter)}
                  title={t("toolbar.hideFrontmatter")}
                  aria-label={t("toolbar.hideFrontmatter")}
                  aria-pressed={hideFrontmatter}
                  disabled={!hasFrontmatter}
                  onClick={() => setHideFrontmatter((v) => !v)}
                >
                  <Braces size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={iconBtnClass(showLineNumbers)}
                  title={t("toolbar.lineNumbers")}
                  aria-label={t("toolbar.lineNumbers")}
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
                  title={t("toolbar.bold")}
                  aria-label={t("toolbar.bold")}
                  onClick={() => runtime?.formatBold()}
                >
                  <Bold size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.italic")}
                  aria-label={t("toolbar.italic")}
                  onClick={() => runtime?.formatItalic()}
                >
                  <Italic size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.heading1")}
                  aria-label={t("toolbar.heading1")}
                  onClick={() => runtime?.formatHeading1()}
                >
                  <Heading1 size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.heading2")}
                  aria-label={t("toolbar.heading2")}
                  onClick={() => runtime?.formatHeading2()}
                >
                  <Heading2 size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.heading3")}
                  aria-label={t("toolbar.heading3")}
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
                  title={t("toolbar.bulletList")}
                  aria-label={t("toolbar.bulletList")}
                  onClick={() => runtime?.formatBullet()}
                >
                  <List size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.orderedList")}
                  aria-label={t("toolbar.orderedList")}
                  onClick={() => runtime?.formatOrdered()}
                >
                  <ListOrdered size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.quote")}
                  aria-label={t("toolbar.quote")}
                  onClick={() => runtime?.formatQuote()}
                >
                  <TextQuote size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.inlineCode")}
                  aria-label={t("toolbar.inlineCode")}
                  onClick={() => runtime?.formatCode()}
                >
                  <Code size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.link")}
                  aria-label={t("toolbar.link")}
                  onClick={() => runtime?.formatLink()}
                >
                  <Link size={18} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="obsidian-tool"
                  title={t("toolbar.horizontalRule")}
                  aria-label={t("toolbar.horizontalRule")}
                  onClick={() => runtime?.formatHr()}
                >
                  <Minus size={18} strokeWidth={2} />
                </button>
              </div>
            </nav>
          ) : null}
        </div>
      ) : null}

      {started ? (
        <Group
          orientation="horizontal"
          id="markpad-outer"
          className={`workspace workspace--${viewMode}${tocOpen ? "" : " workspace--no-toc"}${historyOpen ? "" : " workspace--no-history"}${folderMode ? " workspace--folder" : ""}${folderMode && !treeOpen ? " workspace--no-tree" : ""}`}
        >
          {folderMode && treeOpen && folderPaths.length > 0 ? (
            <>
              <Panel
                id="tree"
                defaultSize="22%"
                minSize="8%"
                maxSize="92%"
                className="workspace-panel"
              >
                <FileTreePanel
                  title={t("folder.treeTitle")}
                  paths={folderPaths}
                  rootPrefix={folderRootPrefix}
                  activePath={activeFilePath}
                  onSelect={(p) => setActiveFilePath(p)}
                />
              </Panel>
              <Separator className="resize-handle" />
            </>
          ) : null}

          <Panel
            id="main"
            defaultSize={
              folderMode && treeOpen && folderPaths.length > 0 ? "50%" : "72%"
            }
            minSize="12%"
            maxSize="96%"
          >
            <section
              className={`editor-shell ${showEditor && showPreview ? "editor-shell--fill" : ""}${!showEditor && showPreview ? " editor-shell--preview-only" : ""}`}
            >
              {showEditor ? (
                <Group orientation="horizontal" id="markpad-editor-layout">
                  <Panel
                    id="editor"
                    defaultSize={showPreview ? "50%" : "100%"}
                    minSize={showPreview ? "22%" : "12%"}
                  >
                    <div
                      ref={mountRef}
                      className="editor"
                      style={{ height: "100%", minHeight: 0 }}
                    />
                  </Panel>
                  {showPreview ? (
                    <>
                      <Separator className="resize-handle" />
                      <Panel id="preview" defaultSize="50%" minSize="22%">
                        <article
                          className="preview markdown-body"
                          style={{ height: "100%", minHeight: 0, overflow: "auto" }}
                          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                        />
                      </Panel>
                    </>
                  ) : null}
                </Group>
              ) : null}
              {!showEditor && showPreview ? (
                <>
                  <div
                    ref={mountRef}
                    className="editor editor--yjs-mount-only"
                    aria-hidden
                  />
                  <article
                    className="preview markdown-body editor-shell-preview-article"
                    dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
                  />
                </>
              ) : null}
            </section>
          </Panel>

          {tocOpen ? (
            <>
              <Separator className="resize-handle" />
              <Panel
                id="toc"
                defaultSize="28%"
                minSize="10%"
                maxSize="92%"
                className="workspace-panel"
              >
                <aside className="toc-panel">
                  <h3>{t("toc.title")}</h3>
                  {toc.length === 0 ? <p>{t("toc.empty")}</p> : null}
                  {toc.map((item) => (
                    <button
                      key={item.id}
                      type="button"
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
              </Panel>
            </>
          ) : null}

          {historyOpen ? (
            <>
              <Separator className="resize-handle" />
              <Panel
                id="history"
                defaultSize="28%"
                minSize="12%"
                maxSize="92%"
                className="workspace-panel"
              >
                <HistoryPanel
                  roomId={roomId}
                  httpBaseUrl={httpBaseUrl}
                  folderMode={folderMode}
                  activeFilePath={activeFilePath}
                  currentContent={markdown}
                />
              </Panel>
            </>
          ) : null}
        </Group>
      ) : null}
    </main>
  );
};
