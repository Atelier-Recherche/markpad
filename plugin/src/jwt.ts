/** Extrait le sujet (User ID) du payload JWT sans vérifier la signature (le serveur vérifie). */
export const jwtPayloadSub = (token: string): string | null => {
  const trimmed = token.trim();
  if (!trimmed) return null;
  try {
    const part = trimmed.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const pad = (4 - (b64.length % 4)) % 4;
    const json = JSON.parse(atob(b64 + "=".repeat(pad))) as { sub?: string };
    return typeof json.sub === "string" && json.sub.length > 0 ? json.sub : null;
  } catch {
    return null;
  }
};

export const syncUserIdFromAuthToken = (settings: {
  authToken: string;
  userId: string;
}): void => {
  const sub = jwtPayloadSub(settings.authToken);
  if (sub) settings.userId = sub;
};
