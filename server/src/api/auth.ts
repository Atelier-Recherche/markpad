import { randomBytes, createHash, randomUUID } from "node:crypto";
import type { Express, Request } from "express";
import type Database from "better-sqlite3";
import * as jose from "jose";
import nodemailer from "nodemailer";
import { config } from "../config.js";
import { getAllowPublicSignup } from "../db/sqlite.js";

const TOKEN_BYTES = 24;
const TOKEN_TTL_MS = 15 * 60 * 1000;

const hashToken = (raw: string): string =>
  createHash("sha256").update(raw).digest("hex");

const parseBearer = (req: Request): string | null => {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return null;
  return h.slice(7).trim() || null;
};

export type AuthUser = { sub: string; email: string };

export async function verifyJwt(token: string): Promise<AuthUser | null> {
  try {
    const key = new TextEncoder().encode(config.jwtSecret);
    const { payload } = await jose.jwtVerify(token, key, { algorithms: ["HS256"] });
    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    if (!sub || !email) return null;
    return { sub, email };
  } catch {
    return null;
  }
}

export async function getAuthUser(req: Request): Promise<AuthUser | null> {
  const fromHeader = parseBearer(req);
  if (fromHeader) {
    return verifyJwt(fromHeader);
  }
  return null;
}

export const registerAuthApi = (app: Express, db: Database.Database): void => {
  app.post("/auth/magic/request", async (req, res) => {
    const email = String((req.body as { email?: string }).email ?? "")
      .trim()
      .toLowerCase();
    if (!email.includes("@")) {
      res.status(400).json({ error: "invalid_email" });
      return;
    }

    const existingUser = db
      .prepare(`SELECT 1 AS ok FROM users WHERE email = ? LIMIT 1`)
      .get(email) as { ok: number } | undefined;
    if (!getAllowPublicSignup(db) && !existingUser) {
      res.status(403).json({ error: "signup_disabled" });
      return;
    }

    const raw = randomBytes(TOKEN_BYTES).toString("hex");
    const tokenHash = hashToken(raw);
    const expiresAt = Date.now() + TOKEN_TTL_MS;

    db.prepare(`DELETE FROM magic_tokens WHERE email = ?`).run(email);
    db.prepare(
      `INSERT INTO magic_tokens (token_hash, email, expires_at) VALUES (?, ?, ?)`
    ).run(tokenHash, email, expiresAt);

    const link = `${config.publicWebUrl}/auth/verify?token=${encodeURIComponent(raw)}`;

    if (config.smtpHost) {
      try {
        const secure = config.smtpSecure ?? config.smtpPort === 465;
        const transport = nodemailer.createTransport({
          host: config.smtpHost,
          port: config.smtpPort,
          secure,
          auth:
            config.smtpUser && config.smtpPass
              ? { user: config.smtpUser, pass: config.smtpPass }
              : undefined,
          connectionTimeout: config.smtpConnectionTimeoutMs,
          greetingTimeout: config.smtpConnectionTimeoutMs,
          socketTimeout: config.smtpSocketTimeoutMs,
          tls: {
            rejectUnauthorized: config.smtpTlsRejectUnauthorized
          }
        });
        await transport.sendMail({
          from: config.emailFrom,
          to: email,
          subject: "Markpad — lien de connexion",
          text: `Ouvrez ce lien pour vous connecter (valide 15 min) :\n\n${link}\n`,
          html: `<p><a href="${link}">Connexion à Markpad</a></p><p>Ce lien expire dans 15 minutes.</p>`
        });
      } catch (e) {
        const err = e as NodeJS.ErrnoException & {
          responseCode?: number;
          response?: string;
          code?: string;
        };
        console.error("Markpad: SMTP send failed", e);
        const body: Record<string, unknown> = { error: "email_send_failed" };
        if (err.code) body.smtpCode = err.code;
        if (err.responseCode) body.smtpResponseCode = err.responseCode;
        if (process.env.NODE_ENV !== "production") {
          if (err.response) body.smtpResponse = err.response;
          if (err.message) body.smtpMessage = err.message;
        }
        res.status(500).json(body);
        return;
      }
    } else {
      console.log(`Markpad magic link (no SMTP) for ${email}: ${link}`);
    }

    res.json({ ok: true });
  });

  app.get("/auth/magic/verify", async (req, res) => {
    const raw = String(req.query.token ?? "").trim();
    if (!raw) {
      res.status(400).json({ error: "token_required" });
      return;
    }
    const tokenHash = hashToken(raw);
    const row = db
      .prepare(`SELECT email, expires_at FROM magic_tokens WHERE token_hash = ?`)
      .get(tokenHash) as { email: string; expires_at: number } | undefined;

    if (!row || row.expires_at < Date.now()) {
      res.status(400).json({ error: "invalid_or_expired_token" });
      return;
    }

    let user = db.prepare(`SELECT id, email FROM users WHERE email = ?`).get(row.email) as
      | { id: string; email: string }
      | undefined;

    if (!user && !getAllowPublicSignup(db)) {
      res.status(403).json({ error: "signup_disabled" });
      return;
    }

    db.prepare(`DELETE FROM magic_tokens WHERE token_hash = ?`).run(tokenHash);

    const isAdmin = config.adminEmails.some(
      (a) => a.toLowerCase() === row.email.toLowerCase()
    );

    if (!user) {
      const id = randomUUID();
      db.prepare(
        `INSERT INTO users (id, email, is_admin, created_at) VALUES (?, ?, ?, ?)`
      ).run(id, row.email, isAdmin ? 1 : 0, new Date().toISOString());
      user = { id, email: row.email };
    } else if (isAdmin) {
      db.prepare(`UPDATE users SET is_admin = 1 WHERE id = ?`).run(user.id);
    }

    const key = new TextEncoder().encode(config.jwtSecret);
    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(key);

    res.json({ token, userId: user.id, email: user.email });
  });

  app.get("/auth/public-config", (_req, res) => {
    res.json({ allowPublicSignup: getAllowPublicSignup(db) });
  });
};
