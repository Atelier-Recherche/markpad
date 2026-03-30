import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Racine du dépôt (server/src → ../..), valable en dev (tsx) et après build (dist/). */
const repoRoot = path.resolve(__dirname, "../..");
const envRepo = path.join(repoRoot, ".env");
const envServer = path.join(repoRoot, "server", ".env");

/**
 * Même `.env` que les scripts (`test-smtp`) : toujours la racine du repo, pas `process.cwd()`.
 * `override: true` : les valeurs du fichier priment sur des variables déjà présentes (shell, IDE).
 */
/** Sans fichier : rien à charger (Docker / K8s injectent déjà les variables). */
if (fs.existsSync(envRepo)) {
  dotenv.config({ path: envRepo, override: true });
} else if (fs.existsSync(envServer)) {
  dotenv.config({ path: envServer, override: true });
} else {
  const cwdEnv = path.join(process.cwd(), ".env");
  if (fs.existsSync(cwdEnv)) {
    dotenv.config({ path: cwdEnv, override: true });
  }
}

const parseList = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseIntOr = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/** true / false / undefined (laisser nodemailer selon le port). */
const parseBoolOrUndef = (value: string | undefined): boolean | undefined => {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return undefined;
};

/**
 * Docker Compose interprète `$VAR` dans le fichier `.env` du projet : utiliser `$$` pour un `$` littéral.
 * Dotenv (Node) laisse `$$` tel quel dans la chaîne : on réduit en un seul `$` pour retrouver le vrai mot de passe.
 */
const smtpPassFromEnv = (value: string | undefined): string =>
  (value ?? "").replaceAll("$$", "$");

export const config = {
  host: process.env.SERVER_HOST ?? "0.0.0.0",
  port: parseIntOr(process.env.SERVER_PORT, 1234),
  publicServerUrl: process.env.PUBLIC_SERVER_URL ?? "http://localhost:1234",
  publicWebUrl: process.env.PUBLIC_WEB_URL ?? "http://localhost:8080",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  allowedApiKeys: parseList(process.env.ALLOWED_API_KEYS),
  rateLimitWindowMs: parseIntOr(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: parseIntOr(process.env.RATE_LIMIT_MAX, 200),
  maxRoomPasswordLength: parseIntOr(process.env.MAX_ROOM_PASSWORD_LENGTH, 128),
  /** Durée sans activité avant suppression (défaut 365 j). */
  sessionMaxIdleMs: parseIntOr(process.env.SESSION_MAX_IDLE_MS, 365 * 24 * 60 * 60 * 1000),
  sessionCleanupIntervalMs: parseIntOr(process.env.SESSION_CLEANUP_INTERVAL_MS, 60 * 60 * 1000),
  jwtSecret: process.env.JWT_SECRET ?? "dev-change-me-markpad",
  adminEmails: parseList(process.env.ADMIN_EMAILS),
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseIntOr(process.env.SMTP_PORT, 587),
  /** Si absent : 465 → TLS implicite, 587 → STARTTLS. */
  smtpSecure: parseBoolOrUndef(process.env.SMTP_SECURE),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: smtpPassFromEnv(process.env.SMTP_PASS),
  emailFrom: process.env.EMAIL_FROM ?? "markpad@localhost",
  smtpConnectionTimeoutMs: parseIntOr(process.env.SMTP_CONNECTION_TIMEOUT_MS, 12_000),
  smtpSocketTimeoutMs: parseIntOr(process.env.SMTP_SOCKET_TIMEOUT_MS, 25_000),
  /** Mettre à false uniquement pour du dépannage (certificat SMTP invalide). */
  smtpTlsRejectUnauthorized: parseBoolOrUndef(process.env.SMTP_TLS_REJECT_UNAUTHORIZED) ?? true,
  /** Valeur initiale en base (`app_settings`) si la clé n’existe pas encore. Les admins peuvent changer via l’API admin. */
  allowPublicSignupDefault:
    parseBoolOrUndef(process.env.ALLOW_PUBLIC_SIGNUP) !== false
};

if (config.allowedApiKeys.length === 0) {
  throw new Error("ALLOWED_API_KEYS must contain at least one key.");
}
