import { requestUrl } from "obsidian";
import type { MarkpadSettings } from "./settings";

export interface ShareSessionResult {
  roomId: string;
  shareUrl: string;
}

export const createShareSession = async (payload: {
  serverUrl: string;
  settings: MarkpadSettings;
  noteId: string;
  roomPassword?: string;
}): Promise<ShareSessionResult> => {
  const endpoint = `${payload.serverUrl}/sessions`;
  const response = await requestUrl({
    url: endpoint,
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${payload.settings.apiKey}`
    },
    body: JSON.stringify({
      noteId: payload.noteId,
      userId: payload.settings.userId,
      roomPassword: payload.roomPassword
    })
  });

  if (response.status < 200 || response.status > 299) {
    throw new Error(`session_create_failed (${response.status})`);
  }

  const json = response.json as { roomId: string; shareUrl: string };
  return {
    roomId: json.roomId,
    shareUrl: json.shareUrl
  };
};

export const endShareSession = async (payload: {
  serverUrl: string;
  settings: MarkpadSettings;
  roomId: string;
}): Promise<void> => {
  const endpoint = `${payload.serverUrl}/sessions/${payload.roomId}`;
  const response = await requestUrl({
    url: endpoint,
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${payload.settings.apiKey}`
    },
    body: JSON.stringify({
      userId: payload.settings.userId
    })
  });

  if (response.status < 200 || response.status > 299) {
    throw new Error(`session_delete_failed (${response.status})`);
  }
};
