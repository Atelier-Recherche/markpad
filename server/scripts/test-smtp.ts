/**
 * Test d’envoi SMTP avec les variables du dépôt (`.env` à la racine).
 * Usage : depuis la racine du repo — npm run test-smtp -w server
 * Optionnel : TEST_SMTP_TO=autre@mail.com npm run test-smtp -w server
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const parseIntOr = (v: string | undefined, fb: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : fb;
};

const parseBoolOrUndef = (v: string | undefined): boolean | undefined => {
  const s = (v ?? "").trim().toLowerCase();
  if (s === "1" || s === "true" || s === "yes") return true;
  if (s === "0" || s === "false" || s === "no") return false;
  return undefined;
};

const smtpHost = process.env.SMTP_HOST ?? "";
const smtpPort = parseIntOr(process.env.SMTP_PORT, 587);
const smtpSecure = parseBoolOrUndef(process.env.SMTP_SECURE);
const smtpUser = process.env.SMTP_USER ?? "";
/** Même règle que `config.ts` : `.env` avec `$$` pour Docker Compose. */
const smtpPass = (process.env.SMTP_PASS ?? "").replaceAll("$$", "$");
const emailFrom = process.env.EMAIL_FROM ?? "markpad@localhost";
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const to = process.env.TEST_SMTP_TO?.trim() || adminEmails[0] || "";

const secure = smtpSecure ?? smtpPort === 465;
const connMs = parseIntOr(process.env.SMTP_CONNECTION_TIMEOUT_MS, 12_000);
const sockMs = parseIntOr(process.env.SMTP_SOCKET_TIMEOUT_MS, 25_000);
const tlsReject = parseBoolOrUndef(process.env.SMTP_TLS_REJECT_UNAUTHORIZED) ?? true;

async function main(): Promise<void> {
  if (!smtpHost) {
    console.error("SMTP_HOST est vide. Renseignez le .env à la racine du dépôt.");
    process.exit(1);
  }
  if (!to) {
    console.error(
      "Aucun destinataire : renseignez ADMIN_EMAILS dans .env ou TEST_SMTP_TO=email@…"
    );
    process.exit(1);
  }
  if (!smtpUser || !smtpPass) {
    console.error("SMTP_USER et SMTP_PASS sont requis pour l’envoi.");
    process.exit(1);
  }

  console.log(`SMTP ${smtpHost}:${smtpPort} secure=${secure} → ${to}`);

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure,
    auth: { user: smtpUser, pass: smtpPass },
    connectionTimeout: connMs,
    greetingTimeout: connMs,
    socketTimeout: sockMs,
    tls: { rejectUnauthorized: tlsReject }
  });

  try {
    const info = await transport.sendMail({
      from: emailFrom,
      to,
      subject: "Markpad — test SMTP",
      text: `Message de test envoyé le ${new Date().toISOString()}.\nSi vous lisez ceci, la configuration SMTP fonctionne.`
    });
    console.log("OK", info.messageId ?? info.response ?? "");
    process.exit(0);
  } catch (e) {
    console.error("Échec SMTP :", e);
    process.exit(1);
  }
}

void main();
