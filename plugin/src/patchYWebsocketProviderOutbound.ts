import * as bc from "lib0/broadcastchannel";
import * as encoding from "lib0/encoding";
import * as syncProtocol from "y-protocols/sync";
import type { WebsocketProvider } from "y-websocket";

const MESSAGE_SYNC = 0;

const broadcastMessage = (provider: WebsocketProvider, buf: Uint8Array): void => {
  const ws = provider.ws;
  if (provider.wsconnected && ws && ws.readyState === ws.OPEN) {
    ws.send(buf);
  }
  const p = provider as unknown as { bcconnected?: boolean; bcChannel: string };
  if (p.bcconnected) {
    bc.publish(p.bcChannel, buf, provider);
  }
};

/**
 * Remplace le handler interne de y-websocket qui teste `origin !== this`.
 * Dans le bundle CJS Obsidian, `this` peut ne plus être le provider, donc aucune
 * mise à jour locale n’est envoyée au serveur (web→Obsidian OK via le flux entrant,
 * Obsidian→web cassé sur le flux sortant).
 */
/** Retourne false si le correctif n’a pas pu s’appliquer (Yjs ne montera pas vers le serveur). */
export const patchYWebsocketProviderOutbound = (provider: WebsocketProvider): boolean => {
  const doc = provider.doc;
  const provAny = provider as unknown as {
    _updateHandler?: (update: Uint8Array, origin: unknown) => void;
  };
  const old = provAny._updateHandler;
  if (!old) return false;

  doc.off("update", old);

  const fixed = (update: Uint8Array, origin: unknown): void => {
    if (origin !== provider) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeUpdate(encoder, update);
      broadcastMessage(provider, encoding.toUint8Array(encoder));
    }
  };

  doc.on("update", fixed);
  provAny._updateHandler = fixed;
  return true;
};
