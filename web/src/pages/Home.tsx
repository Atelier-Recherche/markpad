import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const httpBase = () =>
  String(import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234").replace(/\/$/, "");

export const Home = () => {
  const { t } = useTranslation();
  const [allowSignup, setAllowSignup] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`${httpBase()}/auth/public-config`);
        if (!res.ok) return;
        const data = (await res.json()) as { allowPublicSignup?: boolean };
        if (!cancelled) setAllowSignup(data.allowPublicSignup !== false);
      } catch {
        if (!cancelled) setAllowSignup(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page me-page">
      <header className="me-top">
        <div>
          <h1 className="me-title">{t("home.title")}</h1>
          <p className="me-subtitle">{t("home.subtitle")}</p>
        </div>
      </header>

      <p className="me-intro">{t("home.lead")}</p>

      <section className="me-card">
        <h2 className="me-section-title">{t("home.accountTitle")}</h2>
        <p className="me-muted">{t("home.accountBody")}</p>
        {allowSignup === false ? (
          <p className="join-hint">{t("home.signupPaused")}</p>
        ) : null}
        <div className="me-actions" style={{ marginTop: 12 }}>
          <Link className="me-btn-primary" to="/me">
            {t("home.accountCta")}
          </Link>
        </div>
      </section>

      <section className="me-card">
        <h2 className="me-section-title">{t("home.collabTitle")}</h2>
        <p className="me-muted">{t("home.collabBody")}</p>
        <div className="me-actions" style={{ marginTop: 12 }}>
          <Link className="me-btn-secondary" to="/share/demo">
            {t("home.demoCta")}
          </Link>
        </div>
      </section>

      <p className="me-muted">{t("home.pluginHint")}</p>
    </main>
  );
};
