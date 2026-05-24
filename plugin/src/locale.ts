export type LocaleId = "fr" | "en" | "es" | "de";

const STRINGS: Record<
  LocaleId,
  Record<
    | "serverUrl"
    | "authToken"
    | "authTokenDesc"
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
    authToken: "Jeton de connexion",
    authTokenDesc:
      "Copiez-le depuis la page Mon compte du serveur Markpad, après connexion par e-mail (bouton « Copier le jeton »). Il identifie votre compte pour créer et supprimer vos partages.",
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
    authToken: "Sign-in token",
    authTokenDesc:
      "Copy it from the Markpad server's My account page after email sign-in (Copy token button). It identifies your account to create and delete your shares.",
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
    authToken: "Token de conexión",
    authTokenDesc:
      "Cópialo desde Mi cuenta en el servidor Markpad, tras iniciar sesión por correo (botón «Copiar token»). Identifica tu cuenta para crear y eliminar tus compartidos.",
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
    authToken: "Anmeldetoken",
    authTokenDesc:
      "Aus „Mein Konto“ auf dem Markpad-Server nach E-Mail-Anmeldung kopieren (Schaltfläche „Token kopieren“). Identifiziert Ihr Konto zum Erstellen und Löschen von Freigaben.",
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
