import { requestUrl } from "obsidian";
import type { MarkpadSettings } from "./settings";

const parseSessionErrorBody = (response: { json: unknown }): string | undefined => {
  try {
    const j = response.json as { error?: string };
    return typeof j?.error === "string" ? j.error : undefined;
  } catch {
    return undefined;
  }
};

export interface ShareSessionResult {
  roomId: string;
  shareUrl: string;
}

export interface ValidatedSession {
  roomId: string;
  kind: "note" | "folder";
  filePaths: string[];
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
    const err = parseSessionErrorBody(response);
    throw new Error(
      err
        ? `session_create_failed (${response.status}):${err}`
        : `session_create_failed (${response.status})`
    );
  }

  const json = response.json as { roomId: string; shareUrl: string };
  return {
    roomId: json.roomId,
    shareUrl: json.shareUrl
  };
};

export const createFolderShareSession = async (payload: {
  serverUrl: string;
  settings: MarkpadSettings;
  /** Id stable pour la session (fichier ancre dans le dossier). */
  noteId: string;
  folderPath: string;
  filePaths: string[];
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
      roomPassword: payload.roomPassword,
      kind: "folder",
      folderPath: payload.folderPath,
      filePaths: payload.filePaths
    })
  });

  if (response.status < 200 || response.status > 299) {
    const err = parseSessionErrorBody(response);
    throw new Error(
      err
        ? `session_create_failed (${response.status}):${err}`
        : `session_create_failed (${response.status})`
    );
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

export const validateShareSession = async (payload: {
  serverUrl: string;
  roomId: string;
  roomPassword?: string;
}): Promise<ValidatedSession> => {
  const endpoint = `${payload.serverUrl}/sessions/${payload.roomId}/validate`;
  const response = await requestUrl({
    url: endpoint,
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      roomPassword: payload.roomPassword
    })
  });

  if (response.status < 200 || response.status > 299) {
    throw new Error(`session_validate_failed (${response.status})`);
  }

  const json = response.json as {
    valid?: boolean;
    roomId?: string;
    kind?: "note" | "folder";
    filePaths?: string[];
  };

  return {
    roomId: json.roomId ?? payload.roomId,
    kind: json.kind === "folder" ? "folder" : "note",
    filePaths: Array.isArray(json.filePaths) ? json.filePaths : []
  };
};
