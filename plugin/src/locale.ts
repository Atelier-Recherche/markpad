export type LocaleId = "fr" | "en" | "es" | "de";

const STRINGS: Record<
  LocaleId,
  Record<
    | "serverUrl"
    | "apiKey"
    | "apiKeyDesc"
    | "userId"
    | "displayName"
    | "cursorColor"
    | "defaultRoomPassword"
    | "autoReconnect"
    | "debugLogs"
    | "language"
    | "cmdStartSharing"
    | "cmdJoinShared"
    | "cmdCopyLink"
    | "cmdStopSharing"
    | "ribbonStart"
    | "folderShareMenu"
    | "folderCopyLink"
    | "folderStopSharing"
    | "cmdSharesPanel",
    string
  >
> = {
  fr: {
    serverUrl: "URL du serveur",
    apiKey: "Clé API ou jeton JWT",
    apiKeyDesc:
      "Deux options : (1) la clé secrète du serveur dans ALLOWED_API_KEYS — même valeur pour tous les postes autorisés ; (2) le jeton JWT copié depuis la page Mon compte après connexion par e-mail — identifie votre compte sans partager la clé serveur. Dans les deux cas le champ User ID doit correspondre à votre compte.",
    userId: "Identifiant utilisateur",
    displayName: "Nom affiché",
    cursorColor: "Couleur du curseur",
    defaultRoomPassword: "Mot de passe room par défaut",
    autoReconnect: "Reconnexion auto",
    debugLogs: "Logs diagnostic (console)",
    language: "Langue",
    cmdStartSharing: "Démarrer le partage",
    cmdJoinShared: "Rejoindre une note/dossier partagé",
    cmdCopyLink: "Copier le lien de partage",
    cmdStopSharing: "Arrêter le partage (note courante)",
    ribbonStart: "Markpad : démarrer le partage",
    folderShareMenu: "Markpad : partager ce dossier",
    folderCopyLink: "Markpad : copier le lien du dossier",
    folderStopSharing: "Markpad : arrêter le partage du dossier",
    cmdSharesPanel: "Ouvrir le panneau des partages"
  },
  en: {
    serverUrl: "Server URL",
    apiKey: "API key or JWT",
    apiKeyDesc:
      "Either: (1) the server secret from ALLOWED_API_KEYS (same for every trusted client), or (2) the JWT copied from My account after email sign-in — proves your account without sharing the server key. User ID must match your account in both cases.",
    userId: "User ID",
    displayName: "Display name",
    cursorColor: "Cursor color",
    defaultRoomPassword: "Default room password",
    autoReconnect: "Auto reconnect",
    debugLogs: "Diagnostic logs (console)",
    language: "Language",
    cmdStartSharing: "Start sharing",
    cmdJoinShared: "Join shared note/folder",
    cmdCopyLink: "Copy share link",
    cmdStopSharing: "Stop sharing (current note)",
    ribbonStart: "Markpad: Start sharing",
    folderShareMenu: "Markpad: Share this folder",
    folderCopyLink: "Markpad: Copy folder share link",
    folderStopSharing: "Markpad: Stop sharing folder",
    cmdSharesPanel: "Open shares panel"
  },
  es: {
    serverUrl: "URL del servidor",
    apiKey: "Clave API o JWT",
    apiKeyDesc:
      "Opciones: (1) el secreto del servidor (ALLOWED_API_KEYS), común a los clientes de confianza ; (2) el JWT copiado de Mi cuenta tras iniciar sesión — identifica tu cuenta sin la clave del servidor. El User ID debe coincidir con tu cuenta.",
    userId: "ID de usuario",
    displayName: "Nombre mostrado",
    cursorColor: "Color del cursor",
    defaultRoomPassword: "Contraseña de sala por defecto",
    autoReconnect: "Reconexión automática",
    debugLogs: "Registros de diagnóstico (consola)",
    language: "Idioma",
    cmdStartSharing: "Iniciar uso compartido",
    cmdJoinShared: "Unirse a nota/carpeta compartida",
    cmdCopyLink: "Copiar enlace",
    cmdStopSharing: "Detener uso compartido (nota actual)",
    ribbonStart: "Markpad: Iniciar uso compartido",
    folderShareMenu: "Markpad: Compartir esta carpeta",
    folderCopyLink: "Markpad: Copiar enlace de la carpeta",
    folderStopSharing: "Markpad: Dejar de compartir carpeta",
    cmdSharesPanel: "Abrir panel de enlaces compartidos"
  },
  de: {
    serverUrl: "Server-URL",
    apiKey: "API-Schlüssel oder JWT",
    apiKeyDesc:
      "Entweder: (1) der Server-Schlüssel aus ALLOWED_API_KEYS (für alle vertrauenswürdigen Clients gleich), oder (2) das JWT von Mein Konto nach E-Mail-Anmeldung — identifiziert Ihr Konto ohne Server-Schlüssel. User ID muss zum Konto passen.",
    userId: "Benutzer-ID",
    displayName: "Anzeigename",
    cursorColor: "Cursorfarbe",
    defaultRoomPassword: "Standard-Raumpasswort",
    autoReconnect: "Automatisch neu verbinden",
    debugLogs: "Diagnoseprotokoll (Konsole)",
    language: "Sprache",
    cmdStartSharing: "Freigabe starten",
    cmdJoinShared: "Geteilte Notiz/Ordner beitreten",
    cmdCopyLink: "Freigabelink kopieren",
    cmdStopSharing: "Freigabe beenden (aktuelle Notiz)",
    ribbonStart: "Markpad: Freigabe starten",
    folderShareMenu: "Markpad: Diesen Ordner teilen",
    folderCopyLink: "Markpad: Ordner-Freigabelink kopieren",
    folderStopSharing: "Markpad: Ordnerfreigabe beenden",
    cmdSharesPanel: "Freigaben-Panel öffnen"
  }
};

export const t = (locale: LocaleId, key: keyof (typeof STRINGS)["fr"]): string =>
  STRINGS[locale]?.[key] ?? STRINGS.en[key] ?? key;
