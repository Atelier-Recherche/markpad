import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const httpBase = () =>
  String(import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234").replace(/\/$/, "");

type ShareRow = {
  roomId: string;
  noteId: string;
  kind: string;
  shareUrl: string;
  active: boolean;
};

function readJwt(): string | null {
  try {
    return localStorage.getItem("markpad-jwt");
  } catch {
    return null;
  }
}

function jwtSub(token: string): string | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(b64)) as { sub?: string };
    return typeof json.sub === "string" ? json.sub : null;
  } catch {
    return null;
  }
}

type MeProfile = { userId: string; email: string; isAdmin: boolean };

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [shares, setShares] = useState<ShareRow[]>([]);
  const [err, setErr] = useState("");
  const [loadingShares, setLoadingShares] = useState(false);
  const [jwt, setJwt] = useState<string | null>(() => readJwt());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [profile, setProfile] = useState<MeProfile | null>(null);
  const [userIdCopied, setUserIdCopied] = useState(false);
  const [jwtCopied, setJwtCopied] = useState(false);

  const [verifiedBanner] = useState(
    () => Boolean((location.state as { justVerified?: boolean } | null)?.justVerified)
  );

  useEffect(() => {
    if ((location.state as { justVerified?: boolean } | null)?.justVerified) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const sync = () => setJwt(readJwt());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const loadProfile = useCallback(async () => {
    const token = readJwt();
    if (!token) {
      setProfile(null);
      return;
    }
    try {
      const res = await fetch(`${httpBase()}/me/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setProfile(null);
        return;
      }
      setProfile((await res.json()) as MeProfile);
    } catch {
      setProfile(null);
    }
  }, []);

  const loadShares = useCallback(async () => {
    const token = readJwt();
    setJwt(token);
    if (!token) {
      setShares([]);
      return;
    }
    setErr("");
    setLoadingShares(true);
    try {
      const res = await fetch(`${httpBase()}/me/shares`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setErr(t("me.errorSession"));
        setShares([]);
        return;
      }
      const data = (await res.json()) as { shares: ShareRow[] };
      setShares(data.shares ?? []);
    } catch {
      setErr(t("me.errorNetwork"));
      setShares([]);
    } finally {
      setLoadingShares(false);
    }
  }, [t]);

  useEffect(() => {
    void loadShares();
  }, [loadShares, jwt]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile, jwt]);

  const requestLink = async () => {
    setErr("");
    setSending(true);
    try {
      const res = await fetch(`${httpBase()}/auth/magic/request`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          smtpCode?: string;
          smtpMessage?: string;
        };
        if (data.error === "signup_disabled") {
          setErr(t("me.signupDisabled"));
          return;
        }
        let msg = t("me.errorSend");
        if (data.smtpCode === "ETIMEDOUT" || data.smtpCode === "ESOCKETTIMEDOUT") {
          msg = t("me.errorSmtpTimeout");
        } else if (data.smtpCode === "ECONNREFUSED" || data.smtpCode === "ENOTFOUND") {
          msg = t("me.errorSmtpHost");
        } else if (data.smtpCode === "EAUTH") {
          msg = t("me.errorSmtpAuth");
        }
        if (data.smtpMessage) {
          msg = `${msg} ${data.smtpMessage}`;
        } else if (data.smtpCode) {
          msg = `${msg} (${data.smtpCode})`;
        }
        setErr(msg);
        return;
      }
      setSent(true);
    } catch {
      setErr(t("me.errorNetwork"));
    } finally {
      setSending(false);
    }
  };

  const copyLink = async (key: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setErr(t("me.errorNetwork"));
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("markpad-jwt");
    } catch {
      /* ignore */
    }
    setJwt(null);
    setShares([]);
    setProfile(null);
    setErr("");
  };

  const copyUserId = async (id: string) => {
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
      setUserIdCopied(true);
      window.setTimeout(() => setUserIdCopied(false), 2000);
    } catch {
      setErr(t("me.errorNetwork"));
    }
  };

  const copyJwtForPlugin = async () => {
    const token = readJwt();
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setJwtCopied(true);
      window.setTimeout(() => setJwtCopied(false), 2000);
    } catch {
      setErr(t("me.errorNetwork"));
    }
  };

  const displayUserId = profile?.userId ?? (jwt ? jwtSub(jwt) : null) ?? "";

  const kindLabel = (kind: string) =>
    kind === "folder" ? t("me.kindFolder") : t("me.kindNote");

  return (
    <main className="page me-page">
      <header className="me-top">
        <div>
          <h1 className="me-title">{t("me.title")}</h1>
          <p className="me-subtitle">{t("me.subtitle")}</p>
        </div>
        <div className="me-actions">
          <Link className="me-btn-secondary me-admin-nav-link" to="/">
            {t("me.backHome")}
          </Link>
          <Link className="me-link-demo" to="/share/demo">
            {t("me.backCollab")}
          </Link>
        </div>
      </header>

      {verifiedBanner ? <div className="me-banner">{t("me.verifiedBanner")}</div> : null}

      {jwt && displayUserId ? (
        <section className="me-card me-card-userid">
          <h2 className="me-section-title">{t("me.userIdLabel")}</h2>
          <div className="me-userid-row">
            <div className="me-userid-value" role="status">
              {displayUserId}
            </div>
            <button
              type="button"
              className="me-btn-secondary"
              onClick={() => void copyUserId(displayUserId)}
            >
              {userIdCopied ? t("me.copied") : t("me.copyUserId")}
            </button>
          </div>
          {profile?.email ? (
            <p className="me-muted me-connected-email">
              {profile.email}
            </p>
          ) : null}
          {profile?.isAdmin ? (
            <div className="me-admin-block">
              <p className="me-muted">{t("me.adminHint")}</p>
              <Link to="/admin" className="me-btn-primary me-admin-link">
                {t("me.adminLink")}
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      {jwt ? (
        <section className="me-card">
          <h2 className="me-section-title">{t("me.jwtPluginTitle")}</h2>
          <p className="me-muted">{t("me.jwtPluginHint")}</p>
          <div className="me-actions" style={{ marginTop: 10 }}>
            <button type="button" className="me-btn-secondary" onClick={() => void copyJwtForPlugin()}>
              {jwtCopied ? t("me.copied") : t("me.copyJwt")}
            </button>
          </div>
        </section>
      ) : null}

      <p className="me-intro">{t("me.intro")}</p>

      <section className="me-card join">
        <label htmlFor="markpad-dashboard-email">
          {t("me.emailLabel")}
          <input
            id="markpad-dashboard-email"
            name="markpad-dashboard-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            data-lpignore="true"
            data-1p-ignore=""
            data-bwignore=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="button" disabled={sending} onClick={() => void requestLink()}>
          {sending ? t("me.loading") : t("me.sendLink")}
        </button>
        {sent ? <p className="join-hint">{t("me.sentHint")}</p> : null}
        {err ? <p className="join-error">{err}</p> : null}
      </section>

      <section className="me-card">
        <div className="me-card-head">
          <h2 className="me-section-title">{t("me.sharesSection")}</h2>
          {jwt ? (
            <div className="me-actions">
              <button type="button" className="me-btn-secondary" onClick={() => void loadShares()}>
                {t("me.refresh")}
              </button>
              <button type="button" className="me-btn-secondary" onClick={logout}>
                {t("me.logout")}
              </button>
            </div>
          ) : null}
        </div>

        {!jwt ? <p className="me-muted">{t("me.noToken")}</p> : null}

        {jwt && loadingShares ? <p className="me-muted">{t("me.loading")}</p> : null}

        {jwt && !loadingShares && shares.length === 0 ? (
          <p className="me-muted">{t("me.emptyShares")}</p>
        ) : null}

        {jwt && !loadingShares && shares.length > 0 ? (
          <ul className="me-share-list">
            {shares.map((s) => {
              const key = `${s.roomId}:${s.noteId}`;
              return (
                <li key={key} className="me-share-row">
                  <div className="me-share-main">
                    <span className="me-share-id">{s.noteId}</span>
                    <span className="me-share-meta">
                      {kindLabel(s.kind)} · {s.active ? t("me.statusActive") : t("me.statusInactive")}
                    </span>
                  </div>
                  <div className="me-actions">
                    <button
                      type="button"
                      className="me-btn-secondary"
                      onClick={() => void copyLink(key, s.shareUrl)}
                    >
                      {copiedKey === key ? t("me.copied") : t("me.copyLink")}
                    </button>
                    <a className="me-btn-primary" href={s.shareUrl} target="_blank" rel="noreferrer">
                      {t("me.openLink")}
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>
    </main>
  );
};
