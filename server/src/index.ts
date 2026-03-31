import http from "node:http";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import { Redis } from "ioredis";
import { WebSocketServer } from "ws";
import { config } from "./config.js";
import { registerSessionsApi } from "./api/sessions.js";
import { SessionStore } from "./sessionStore.js";
import { RedisDocStore } from "./persistence/redisDocStore.js";
import { MarkpadYjsServer } from "./ws/yjsServer.js";
import { registerAuthApi } from "./api/auth.js";
import { registerMeApi } from "./api/me.js";
import { registerAdminApi } from "./api/admin.js";
import { deleteShareRow, initDb, seedAllowPublicSignupIfMissing } from "./db/sqlite.js";

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    limit: config.rateLimitMax
  })
);

const redis = new Redis(config.redisUrl);
const sessionStore = new SessionStore(redis);
const docStore = new RedisDocStore(redis);
const db = initDb();
seedAllowPublicSignupIfMissing(db, config.allowPublicSignupDefault);

void sessionStore.backfillActivityIndex().catch((err) => {
  console.error("Markpad: backfill activity index failed", err);
});

const runIdleCleanup = async (): Promise<void> => {
  const cutoff = Date.now() - config.sessionMaxIdleMs;
  const stale = await sessionStore.findStaleRooms(cutoff);
  for (const roomId of stale) {
    const session = await sessionStore.getSession(roomId);
    if (!session) continue;
    const last = new Date(session.lastActivityAt).getTime();
    if (last > cutoff) continue;
    await sessionStore.deleteSession(roomId);
    await docStore.delete(roomId);
    deleteShareRow(db, roomId);
    console.log(`Markpad: removed idle session ${roomId}`);
  }
};

setInterval(() => {
  void runIdleCleanup();
}, config.sessionCleanupIntervalMs);

app.get("/healthz", (_req, res) => {
  res.json({
    ok: true,
    smtpConfigured: Boolean(config.smtpHost && config.smtpUser && config.smtpPass)
  });
});

registerSessionsApi(app, sessionStore, docStore, db);
registerAuthApi(app, db);
registerMeApi(app, db, sessionStore);
registerAdminApi(app, db, sessionStore, docStore);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
new MarkpadYjsServer(wss, docStore, sessionStore, db).start();

server.listen(config.port, config.host, () => {
  console.log(`Markpad server listening on ${config.host}:${config.port}`);
  if (config.smtpHost) {
    console.log(
      `Markpad: SMTP ${config.smtpHost}:${config.smtpPort} user=${config.smtpUser || "?"} from=${config.emailFrom}`
    );
  } else {
    console.log("Markpad: SMTP disabled (magic links only in server logs)");
  }
});
