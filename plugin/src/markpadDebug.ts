/** Logs console horodatés pour diagnostiquer la collab (désactivé par défaut). */

let collabDebugEnabled = false;

export const setMarkpadCollabDebug = (enabled: boolean): void => {
  collabDebugEnabled = enabled;
};

export const markpadCollabDebug = (...args: unknown[]): void => {
  if (!collabDebugEnabled) return;
  const ts = new Date().toISOString();
  console.log(`[${ts}] [Markpad:collab]`, ...args);
};

/** Libellé court pour une origin Yjs / transaction (évite les gros objets). */
export const debugOriginLabel = (origin: unknown): string => {
  if (origin === null) return "null";
  if (origin === undefined) return "undefined";
  if (typeof origin === "string") return `str:${origin.slice(0, 40)}`;
  if (typeof origin === "number" || typeof origin === "boolean") return String(origin);
  if (typeof origin === "object") {
    const o = origin as { constructor?: { name?: string } };
    const n = o.constructor?.name ?? "Object";
    if (n === "YSyncConfig" || n === "Object") {
      const keys = Object.keys(origin as object).slice(0, 4).join(",");
      return `${n}{${keys}}`;
    }
    return n;
  }
  return typeof origin;
};
