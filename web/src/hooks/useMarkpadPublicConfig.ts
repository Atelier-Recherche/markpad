import { useEffect, useState } from "react";

export type MarkpadPublicFeatures = {
  kanban: boolean;
  /** Tableaux GFM : aperçu HTML + surlignage dans l’éditeur. */
  markdownTables: boolean;
  chat: boolean;
  history: boolean;
  folderTree: boolean;
};

const DEFAULT_FEATURES: MarkpadPublicFeatures = {
  kanban: true,
  markdownTables: true,
  chat: true,
  history: true,
  folderTree: true
};

const httpBase = (): string =>
  String(import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:1234").replace(/\/$/, "");

/** Config publique serveur (flags modularisés + signup). */
export function useMarkpadPublicConfig(): {
  features: MarkpadPublicFeatures;
  loading: boolean;
} {
  const [features, setFeatures] = useState<MarkpadPublicFeatures>(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(`${httpBase()}/auth/public-config`);
        const data = (await res.json()) as { features?: Partial<MarkpadPublicFeatures> };
        if (!cancelled && data.features && typeof data.features === "object") {
          setFeatures({ ...DEFAULT_FEATURES, ...data.features });
        }
      } catch {
        /* garde les défauts */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { features, loading };
}
