import type { Awareness } from "y-protocols/awareness";

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
}

/** Exclut le client local et les entrées awareness « vides » (fantômes / états incomplets). */
export const extractPresence = (
  awareness: Awareness,
  localClientId: number,
  guestLabel = "Invité"
): PresenceUser[] => {
  const out: PresenceUser[] = [];
  for (const [clientId, state] of awareness.getStates()) {
    if (clientId === localClientId) continue;
    const user = (state?.user ?? {}) as { name?: string; color?: string };
    const hasCursor =
      state != null &&
      typeof state === "object" &&
      (state as { cursor?: unknown }).cursor != null &&
      typeof (state as { cursor?: { anchor?: unknown; head?: unknown } }).cursor ===
        "object";
    const hasUser =
      typeof user.name === "string" && user.name.trim().length > 0;
    if (!hasUser && !hasCursor) continue;

    out.push({
      id: String(clientId),
      name: hasUser ? user.name!.trim() : guestLabel,
      color: user.color ?? "#7c3aed"
    });
  }
  return out;
};
