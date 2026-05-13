import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const httpBase = () =>
  String(import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234").replace(/\/$/, "");

function readToken(): string | null {
  try {
    return localStorage.getItem("markpad-jwt");
  } catch {
    return null;
  }
}

function shortId(id: string, left = 8, right = 4): string {
  if (id.length <= left + right + 1) return id;
  return `${id.slice(0, left)}…${id.slice(-right)}`;
}

function sharePublicUrl(roomId: string): string {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "";
  return `${origin}/share/${roomId}`;
}

type AdminShare = {
  room_id: string;
  owner_key: string;
  note_id: string;
  kind: string;
  folder_path: string | null;
  created_at: string;
};

type AdminUser = {
  id: string;
  email: string;
  is_admin: number;
  created_at: string;
};

type Tab = "shares" | "users";

export const AdminPanel = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState<string | null>(() => readToken());
  const [tab, setTab] = useState<Tab>("shares");
  const [shares, setShares] = useState<AdminShare[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [allowPublicSignup, setAllowPublicSignup] = useState<boolean | null>(null);
  const [chatRetentionHours, setChatRetentionHours] = useState<number | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);

  useEffect(() => {
    const sync = () => setToken(readToken());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const loadShares = useCallback(async () => {
    const tk = readToken();
    if (!tk) return;
    const res = await fetch(`${httpBase()}/admin/shares`, {
      headers: { Authorization: `Bearer ${tk}` }
    });
    if (res.status === 401) throw new Error("unauthorized");
    if (res.status === 403) throw new Error("forbidden");
    if (!res.ok) throw new Error("load");
    const data = (await res.json()) as { shares: AdminShare[] };
    setShares(data.shares ?? []);
  }, []);

  const loadUsers = useCallback(async () => {
    const tk = readToken();
    if (!tk) return;
    const res = await fetch(`${httpBase()}/admin/users`, {
      headers: { Authorization: `Bearer ${tk}` }
    });
    if (res.status === 401) throw new Error("unauthorized");
    if (res.status === 403) throw new Error("forbidden");
    if (!res.ok) throw new Error("load");
    const data = (await res.json()) as { users: AdminUser[] };
    setUsers(data.users ?? []);
  }, []);

  const loadSettings = useCallback(async () => {
    const tk = readToken();
    if (!tk) return;
    const res = await fetch(`${httpBase()}/admin/settings`, {
      headers: { Authorization: `Bearer ${tk}` }
    });
    if (res.status === 401 || res.status === 403) return;
    if (!res.ok) return;
    const data = (await res.json()) as { allowPublicSignup?: boolean; chatRetentionHours?: number };
    setAllowPublicSignup(data.allowPublicSignup !== false);
    if (typeof data.chatRetentionHours === "number" && Number.isFinite(data.chatRetentionHours)) {
      setChatRetentionHours(data.chatRetentionHours);
    } else {
      setChatRetentionHours(24);
    }
  }, []);

  const loadAll = useCallback(async () => {
    const tk = readToken();
    if (!tk) {
      setError("");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await Promise.all([loadShares(), loadUsers(), loadSettings()]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg === "forbidden") setError(t("admin.forbidden"));
      else if (msg === "unauthorized") setError(t("admin.noToken"));
      else setError(t("admin.loadError"));
    } finally {
      setLoading(false);
    }
  }, [loadShares, loadUsers, loadSettings, t]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setError(t("admin.loadError"));
    }
  };

  const deleteShare = async (roomId: string) => {
    if (!window.confirm(t("admin.confirmDeleteShare"))) return;
    const tk = readToken();
    if (!tk) return;
    const res = await fetch(`${httpBase()}/admin/sessions/${encodeURIComponent(roomId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tk}` }
    });
    if (!res.ok) {
      setError(t("admin.deleteError"));
      return;
    }
    setError("");
    await loadShares();
  };

  const saveAllowSignup = async (next: boolean) => {
    const tk = readToken();
    if (!tk) return;
    setSettingsSaving(true);
    setError("");
    try {
      const res = await fetch(`${httpBase()}/admin/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ allowPublicSignup: next })
      });
      if (!res.ok) {
        setError(t("admin.settingsSaveError"));
        return;
      }
      const data = (await res.json()) as {
        allowPublicSignup?: boolean;
        chatRetentionHours?: number;
      };
      setAllowPublicSignup(data.allowPublicSignup !== false);
      if (typeof data.chatRetentionHours === "number" && Number.isFinite(data.chatRetentionHours)) {
        setChatRetentionHours(data.chatRetentionHours);
      }
    } catch {
      setError(t("admin.settingsSaveError"));
    } finally {
      setSettingsSaving(false);
    }
  };

  const saveChatRetention = async () => {
    const tk = readToken();
    if (!tk || chatRetentionHours == null) return;
    setSettingsSaving(true);
    setError("");
    try {
      const res = await fetch(`${httpBase()}/admin/settings`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${tk}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chatRetentionHours })
      });
      if (!res.ok) {
        setError(t("admin.settingsSaveError"));
        return;
      }
      const data = (await res.json()) as {
        allowPublicSignup?: boolean;
        chatRetentionHours?: number;
      };
      setAllowPublicSignup(data.allowPublicSignup !== false);
      if (typeof data.chatRetentionHours === "number" && Number.isFinite(data.chatRetentionHours)) {
        setChatRetentionHours(data.chatRetentionHours);
      }
    } catch {
      setError(t("admin.settingsSaveError"));
    } finally {
      setSettingsSaving(false);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!window.confirm(t("admin.confirmDeleteUser", { email }))) return;
    const tk = readToken();
    if (!tk) return;
    const res = await fetch(`${httpBase()}/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${tk}` }
    });
    if (res.status === 400) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error === "cannot_delete_self" ? t("admin.cannotDeleteSelf") : t("admin.deleteError"));
      return;
    }
    if (!res.ok) {
      setError(t("admin.deleteError"));
      return;
    }
    setError("");
    await loadUsers();
  };

  const displayNote = (s: AdminShare) =>
    s.folder_path ? `${s.folder_path} · ${s.note_id}` : s.note_id;

  if (!token) {
    return (
      <main className="page me-page admin-page">
        <p className="join-error">{t("admin.noToken")}</p>
        <Link className="me-link-demo" to="/me">
          {t("admin.backMe")}
        </Link>
      </main>
    );
  }

  return (
    <main className="page me-page admin-page">
      <header className="me-top admin-header">
        <div>
          <h1 className="me-title">{t("admin.title")}</h1>
          <p className="me-subtitle">{t("admin.tabShares")} · {t("admin.tabUsers")}</p>
        </div>
        <div className="me-actions admin-header-actions">
          <button type="button" className="me-btn-secondary" disabled={loading} onClick={() => void loadAll()}>
            {loading ? t("me.loading") : t("admin.refresh")}
          </button>
          <Link className="me-btn-secondary me-admin-nav-link" to="/me">
            {t("admin.backMe")}
          </Link>
          <Link className="me-btn-primary me-admin-nav-link" to="/share/demo">
            {t("admin.backDemo")}
          </Link>
        </div>
      </header>

      <div className="admin-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "shares"}
          className={`admin-tab ${tab === "shares" ? "admin-tab--active" : ""}`}
          onClick={() => setTab("shares")}
        >
          {t("admin.tabShares")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "users"}
          className={`admin-tab ${tab === "users" ? "admin-tab--active" : ""}`}
          onClick={() => setTab("users")}
        >
          {t("admin.tabUsers")}
        </button>
      </div>

      {error ? <p className="join-error admin-error">{error}</p> : null}

      {allowPublicSignup !== null && chatRetentionHours !== null ? (
        <section className="me-card" style={{ marginBottom: 16 }}>
          <h2 className="me-section-title">{t("admin.settingsCardTitle")}</h2>
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              cursor: settingsSaving ? "wait" : "pointer"
            }}
          >
            <input
              type="checkbox"
              checked={allowPublicSignup}
              disabled={settingsSaving}
              onChange={(e) => void saveAllowSignup(e.target.checked)}
            />
            <span>
              <strong>{t("admin.allowPublicSignup")}</strong>
              <br />
              <span className="me-muted">{t("admin.allowPublicSignupHint")}</span>
            </span>
          </label>
          <div style={{ marginTop: 18 }}>
            <label className="me-muted" style={{ display: "block", marginBottom: 6 }}>
              {t("admin.chatRetentionLabel")}
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <input
                type="number"
                min={1}
                max={8760}
                value={chatRetentionHours}
                disabled={settingsSaving}
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10);
                  setChatRetentionHours(Number.isFinite(v) ? v : 24);
                }}
                style={{ width: 100 }}
              />
              <button
                type="button"
                className="me-btn-secondary"
                disabled={settingsSaving}
                onClick={() => void saveChatRetention()}
              >
                {t("admin.chatRetentionSave")}
              </button>
            </div>
            <p className="me-muted" style={{ marginTop: 8, fontSize: 13 }}>
              {t("admin.chatRetentionHint")}
            </p>
          </div>
        </section>
      ) : null}

      {tab === "shares" ? (
        <section className="me-card admin-table-card">
          {shares.length === 0 && !loading ? (
            <p className="me-muted">{t("admin.emptyShares")}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.colNote")}</th>
                    <th>{t("admin.colKind")}</th>
                    <th>{t("admin.colOwner")}</th>
                    <th>{t("admin.colRoom")}</th>
                    <th>{t("admin.colCreated")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {shares.map((s) => {
                    const url = sharePublicUrl(s.room_id);
                    const ck = `s:${s.room_id}`;
                    return (
                      <tr key={s.room_id}>
                        <td className="admin-cell-note">{displayNote(s)}</td>
                        <td>{s.kind === "folder" ? t("me.kindFolder") : t("me.kindNote")}</td>
                        <td>
                          <span className="admin-mono" title={s.owner_key}>
                            {shortId(s.owner_key)}
                          </span>
                        </td>
                        <td>
                          <span className="admin-mono" title={s.room_id}>
                            {shortId(s.room_id)}
                          </span>
                        </td>
                        <td className="admin-cell-date">{new Date(s.created_at).toLocaleString()}</td>
                        <td>
                          <div className="admin-row-actions">
                            <a className="admin-link" href={url} target="_blank" rel="noreferrer">
                              {t("admin.open")}
                            </a>
                            <button
                              type="button"
                              className="admin-link-btn"
                              onClick={() => void copyText(ck, url)}
                            >
                              {copiedKey === ck ? t("admin.copied") : t("admin.copyLink")}
                            </button>
                            <button
                              type="button"
                              className="admin-link-btn admin-link-btn--danger"
                              onClick={() => void deleteShare(s.room_id)}
                            >
                              {t("admin.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : (
        <section className="me-card admin-table-card">
          {users.length === 0 && !loading ? (
            <p className="me-muted">{t("admin.emptyUsers")}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t("admin.colEmail")}</th>
                    <th>{t("admin.colUserId")}</th>
                    <th>{t("admin.colAdmin")}</th>
                    <th>{t("admin.colCreated")}</th>
                    <th>{t("admin.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>
                        <span className="admin-mono" title={u.id}>
                          {shortId(u.id)}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${u.is_admin ? "admin-badge--yes" : ""}`}>
                          {u.is_admin ? t("admin.badgeAdmin") : t("admin.badgeUser")}
                        </span>
                      </td>
                      <td className="admin-cell-date">{new Date(u.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          type="button"
                          className="admin-link-btn admin-link-btn--danger"
                          onClick={() => void deleteUser(u.id, u.email)}
                        >
                          {t("admin.delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  );
};
