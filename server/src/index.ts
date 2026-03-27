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

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

registerSessionsApi(app, sessionStore, docStore);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
new MarkpadYjsServer(wss, docStore, sessionStore).start();

server.listen(config.port, config.host, () => {
  console.log(`Markpad server listening on ${config.host}:${config.port}`);
});
