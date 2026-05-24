/** Nettoie la valeur collée depuis Mon compte (espaces, guillemets, préfixe Bearer). */
export const normalizeAuthToken = (raw: string): string => {
  let t = raw.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  return t.replace(/^Bearer\s+/i, "").trim();
};

/** Extrait le sujet (User ID) du payload JWT sans vérifier la signature (le serveur vérifie). */
export const jwtPayloadSub = (token: string): string | null => {
  const trimmed = normalizeAuthToken(token);
  if (!trimmed) return null;
  const parts = trimmed.split(".");
  if (parts.length < 2) return null;
  try {
    const part = parts[1];
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    const json = JSON.parse(atob(b64 + "=".repeat(pad))) as { sub?: string };
    return typeof json.sub === "string" && json.sub.length > 0 ? json.sub : null;
  } catch {
    return null;
  }
};

export const isJwtShape = (token: string): boolean =>
  normalizeAuthToken(token).split(".").length === 3;

/** Compte Markpad (création / suppression de partages) — exige un jeton JWT lisible. */
export const resolveAccountUserId = (authToken: string): string | null =>
  jwtPayloadSub(authToken);

/** Identité affichée dans la collab WebSocket (curseurs). */
export const resolveAwarenessUserId = (
  authToken: string,
  displayName: string,
  legacyUserId?: string
): string => {
  const fromToken = jwtPayloadSub(authToken);
  if (fromToken) return fromToken;
  const legacy = legacyUserId?.trim();
  if (legacy) return legacy;
  const name = displayName.trim();
  return name || "obsidian-user";
};

export type AuthTokenIssue = "missing" | "legacy_api_key" | "invalid_jwt";

export const diagnoseAuthToken = (authToken: string): AuthTokenIssue | null => {
  const token = normalizeAuthToken(authToken);
  if (!token) return "missing";
  if (!isJwtShape(token)) return "legacy_api_key";
  if (!jwtPayloadSub(token)) return "invalid_jwt";
  return null;
};
