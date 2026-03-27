import dotenv from "dotenv";

dotenv.config();

const parseList = (value: string | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseIntOr = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  host: process.env.SERVER_HOST ?? "0.0.0.0",
  port: parseIntOr(process.env.SERVER_PORT, 1234),
  publicServerUrl: process.env.PUBLIC_SERVER_URL ?? "http://localhost:1234",
  publicWebUrl: process.env.PUBLIC_WEB_URL ?? "http://localhost:8080",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  allowedApiKeys: parseList(process.env.ALLOWED_API_KEYS),
  rateLimitWindowMs: parseIntOr(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  rateLimitMax: parseIntOr(process.env.RATE_LIMIT_MAX, 200),
  maxRoomPasswordLength: parseIntOr(process.env.MAX_ROOM_PASSWORD_LENGTH, 128)
};

if (config.allowedApiKeys.length === 0) {
  throw new Error("ALLOWED_API_KEYS must contain at least one key.");
}
