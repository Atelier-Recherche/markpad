# Markpad

Markpad est un mono-repo de collaboration temps reel pour notes Markdown avec 3 composants :

- `plugin/` : plugin Obsidian (source de partage)
- `server/` : backend Node.js + Yjs + WebSocket + Redis
- `web/` : frontend React + CodeMirror 6 (markdown source, collab Yjs) + aperçu HTML, barre d’outils type Obsidian (icônes [Lucide](https://lucide.dev/))

## Architecture

- Le plugin cree une session via l'API REST du serveur.
- Le serveur retourne un `roomId` et une URL de partage.
- Plugin et Web se connectent au WebSocket de la room.
- Les updates Yjs sont relayees en temps reel.
- L'etat Yjs est persiste dans Redis pour reprise de session.
- Le plugin enregistre `markpadShare` dans le frontmatter (`roomId`, `shareUrl`) pour retrouver la room à l'ouverture de la note.

### Plugin Obsidian : sync et reconnexion

- **Reconnexion automatique** (paramètre dans les réglages du plugin, activé par défaut) : si la note active contient déjà un partage et que `User ID` est renseigné, le plugin ouvre la session WebSocket au démarrage / au changement de note, sans relancer « Start Sharing ».
- **Réconciliation** après le premier sync : le fichier `.md` sur le vault est comparé au corps du document Yjs (hors frontmatter). En cas de divergences (édition hors ligne, Redis vide ou ancien), le plugin applique un fusionnement par patches (diff-match-patch) dans Yjs pour limiter les pertes au lieu d’écraser un côté. Si Yjs est vide et la note locale non vide, le contenu local est réinjecté (protection **anti-vide** après redémarrage Redis/serveur).
- **Barre d’état** : affiche notamment connecté, synchronisation en cours, ou hors ligne.
- **Sens Obsidian → Web** : en plus de y-codemirror, un petit module CodeMirror réaligne `Y.Text` sur le document si la frappe locale et Y divergent (contourne des cas où le binding CM→Y ne propage pas, selon la version Obsidian / Live Preview). La bonne instance `EditorView` est résolue (source, `editorComponent`, sous-mode d’édition) avant de monter la collab.
- **Dépannage** : dans les réglages du plugin, activer « Logs diagnostic (console) », ouvrir la console développeur (Ctrl+Shift+I), filtrer sur `Markpad:collab` : tu verras les événements horodatés (résolution CM, pont, `Y.Doc update`, WebSocket, `editor-change`).

## Infrastructure Docker

`docker-compose.yml` orchestre :

- `redis` : stockage temporaire des documents Yjs
- `server` : API + WebSocket, expose `1234`
- `web` : frontend statique Nginx, expose `WEB_PORT` (defaut `8080`)

Variables principales (voir `.env.example`) :

- `SERVER_PORT`
- `WEB_PORT`
- `PUBLIC_SERVER_URL`
- `PUBLIC_WEB_URL`
- `ALLOWED_API_KEYS`
- `REDIS_URL`

## Prerequis

- Node.js / npm
- Docker Desktop
- Obsidian (pour charger le plugin)

## Script de deployment unique

Le script `deploy-markpad.ps1` couvre :

- build npm
- rebuild/restart Docker (global ou cible)
- deployment du plugin dans le vault Obsidian

### Usage rapide

Execution complete (build monorepo + stack Docker + plugin) :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-markpad.ps1
```

Build + restart **server uniquement** :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-markpad.ps1 -Target server
```

Build + restart **web uniquement** :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-markpad.ps1 -Target web
```

Build + deployment **plugin uniquement** :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-markpad.ps1 -Target plugin
```

Si tu veux aussi redeployer le plugin apres un build `web` ou `server` :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-markpad.ps1 -Target web -DeployPluginAfterServiceBuild
```

Options utiles :

- `-VaultPluginsPath "D:\Notes\.obsidian\plugins"` (chemin vault)
- `-PluginId "markpad"` (nom dossier plugin cible)
- `-SkipNpmInstall`
- `-SkipDocker`

En cas de conflit de port web (ex: `8080` deja utilise), change dans `.env` :

```env
WEB_PORT=8081
PUBLIC_WEB_URL=http://localhost:8081
```

## Installation du plugin dans Obsidian

Le script copie automatiquement :

- `plugin/main.js`
- `plugin/manifest.json`
- `plugin/versions.json`

vers :

- `D:\Notes\.obsidian\plugins\markpad` (par defaut)

Ensuite, dans Obsidian :

1. Active le plugin communautaire `Markpad`.
2. Configure `Server URL`, `API Key`, `User ID`.
3. Ouvre une note et lance `Start Sharing`.

## Dev local manuel (sans script)

- Build global : `npm run build`
- Lint global : `npm run lint`
- Server dev : `npm run -w server dev`
- Web dev : `npm run -w web dev`
- Plugin watch : `npm run -w plugin dev`

## Notes

- La persistance des rooms est faite via Redis.
- Le frontend est servi en statique via Nginx.
- Le serveur applique des controles d'acces de base via API key + mot de passe optionnel de room.
- Sur le web, l’éditeur est le **texte brut Markdown** dans `Y.Text` (comme Obsidian en mode source), ce qui aligne la collab avec le plugin.
