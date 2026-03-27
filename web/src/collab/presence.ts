import type { Awareness } from "y-protocols/awareness";

export interface PresenceUser {
  id: string;
  name: string;
  color: string;
}

export const extractPresence = (awareness: Awareness): PresenceUser[] => {
  return [...awareness.getStates().entries()].map(([clientId, state]) => {
    const user = (state?.user ?? {}) as { name?: string; color?: string };
    return {
      id: String(clientId),
      name: user.name ?? "Anonymous",
      color: user.color ?? "#7c3aed"
    };
  });
};
