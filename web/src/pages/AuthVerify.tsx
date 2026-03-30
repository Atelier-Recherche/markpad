import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const httpBase = () =>
  String(import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234").replace(/\/$/, "");

type VerifyResult =
  | { ok: true; jwt: string; userId?: string }
  | { ok: false; error: string };

/**
 * Une seule requête /auth/magic/verify par jeton, même si React StrictMode monte
 * l’effet deux fois : le serveur supprime le jeton au premier succès.
 */
const verifyByToken = new Map<string, Promise<VerifyResult>>();

function verifyMagicToken(token: string): Promise<VerifyResult> {
  let p = verifyByToken.get(token);
  if (p) {
    return p;
  }

  p = (async (): Promise<VerifyResult> => {
    try {
      const res = await fetch(
        `${httpBase()}/auth/magic/verify?token=${encodeURIComponent(token)}`
      );
      const data = (await res.json()) as { token?: string; userId?: string; error?: string };
      if (!res.ok) {
        return { ok: false, error: data.error ?? "verify_failed" };
      }
      if (!data.token) {
        return { ok: false, error: "verify_failed" };
      }
      return { ok: true, jwt: data.token, userId: data.userId };
    } catch {
      return { ok: false, error: "network" };
    } finally {
      window.setTimeout(() => verifyByToken.delete(token), 120_000);
    }
  })();

  verifyByToken.set(token, p);
  return p;
}

export const AuthVerify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMsg(t("auth.verify.invalid"));
      return;
    }
    setMsg(t("auth.verify.loading"));
    let cancelled = false;
    void (async () => {
      const result = await verifyMagicToken(token);
      if (cancelled) return;
      if (!result.ok) {
        if (result.error === "network") {
          setMsg(t("auth.verify.network"));
        } else if (result.error === "invalid_or_expired_token") {
          setMsg(t("auth.verify.expired"));
        } else if (result.error === "signup_disabled") {
          setMsg(t("auth.verify.signupDisabled"));
        } else {
          setMsg(result.error === "verify_failed" ? t("auth.verify.fail") : result.error);
        }
        return;
      }
      localStorage.setItem("markpad-jwt", result.jwt);
      navigate("/me", {
        replace: true,
        state: { justVerified: true, userId: result.userId }
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t volontairement exclu
  }, [params, navigate]);

  return (
    <main className="page me-page">
      <p className="me-muted">{msg}</p>
    </main>
  );
};
