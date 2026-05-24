# Markpad

Markpad est un mono-repo de collaboration temps reel pour notes Markdown avec 3 composants :

- `plugin/` : plugin Obsidian (source de partage)
- `server/` : backend Node.js + Yjs + WebSocket + Redis
- `web/` : frontend React + CodeMirror 6 (markdown source, collab Yjs) + aperçu HTML, barre d’outils type Obsidian (icônes [Lucide](https://lucide.dev/)) ; l’arborescence des partages **dossier** affiche des chemins **relatifs** au dossier partagé (sans exposer le préfixe « en amont » du vault).

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
- **Indicateurs dans l’explorateur et les onglets** (Lucide via l’API Obsidian) : icône **lien** pour une note partagée ; icône **dossiers** pour la racine d’un partage dossier. Pour la **session WebSocket active**, l’icône reflète l’état (ex. chargement pendant la connexion ou la réconciliation post-sync, rafraîchissement si Yjs n’est pas encore à jour, hors ligne si le WS est coupé).
- **Sens Obsidian → Web** : en plus de y-codemirror, un petit module CodeMirror réaligne `Y.Text` sur le document si la frappe locale et Y divergent (contourne des cas où le binding CM→Y ne propage pas, selon la version Obsidian / Live Preview). La bonne instance `EditorView` est résolue (source, `editorComponent`, sous-mode d’édition) avant de monter la collab.
- **Dépannage** : dans les réglages du plugin, activer « Logs diagnostic (console) », ouvrir la console développeur (Ctrl+Shift+I), filtrer sur `Markpad:collab` : tu verras les événements horodatés (résolution CM, pont, `Y.Doc update`, WebSocket, `editor-change`). En **partage dossier**, les lignes préfixées `folder:` détaillent le démarrage (`startSharing`, `attach computed`, clés du `Y.Map`, `syncFolderFilesFromY`, patch WebSocket sortant) — indispensable si la sync dossier ou les icônes dossier posent problème.

## Infrastructure Docker

`docker-compose.yml` orchestre :

- `redis` : stockage temporaire des documents Yjs
- `server` : API + WebSocket, expose `1234`
- `web` : frontend statique Nginx, expose `WEB_PORT` (defaut `8080`)

Variables principales (voir [`.env.example`](.env.example)) :

- `SERVER_PORT`, `SERVER_HOST`
- `WEB_PORT`
- `PUBLIC_SERVER_URL`, `PUBLIC_WEB_URL`
- `REDIS_URL`
- `SESSION_MAX_IDLE_MS` — durée sans activité avant suppression de la room (défaut ~1 an)
- `SESSION_CLEANUP_INTERVAL_MS` — fréquence du nettoyage des rooms expirées
- `JWT_SECRET` — signature des jetons web (connexion par e-mail)
- `ADMIN_EMAILS` — liste d’e-mails (séparés par des virgules) ayant le rôle admin à la première connexion
- `MARKPAD_SQLITE_PATH` — fichier SQLite (métadonnées partages, utilisateurs, index)
- `MAX_SHARES_PER_USER` — nombre maximal de **sessions de partage** actives par utilisateur dans l’index SQLite (défaut `200`) ; au-delà, `POST /sessions` répond **429** avec `{ "error": "share_limit_reached" }`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` — envoi des liens magiques (optionnel ; sans SMTP le lien est loggé dans la console serveur). **Important** : l’hôte SMTP est en général celui du **fournisseur de messagerie** (ex. `smtp.…`, `ssl0.ovh.net` pour une boîte OVH), pas forcément le nom de domaine du site seul ; si le port **465** ne se connecte pas, essayez **587** avec `SMTP_SECURE=false` (STARTTLS). Voir aussi `SMTP_CONNECTION_TIMEOUT_MS` dans `.env.example`.

## Web : interface invité

- **Langue** : français, anglais, espagnol, allemand (sélecteur dans la barre du haut, mémorisé dans `localStorage`).
- **Nom affiché** : mémorisé (`markpad-display-name`). Si la room n’a **pas** de mot de passe, la connexion se fait sans écran « Rejoindre ». **Clic droit** sur la pastille « Vous » pour renommer.
- **Panneaux** : arborescence (partage dossier), éditeur, aperçu, plan — largeurs ajustables par poignées entre colonnes (jusqu’à ~72 % pour les panneaux latéraux). Pour un partage dossier, les entrées de l’arborescence sont affichées en **chemin relatif** au dossier partagé ; le chemin complet du vault reste disponible en **infobulle** (`title`) sur chaque fichier.
- **Routes utiles** : `/share/:roomId` (édition collaborative), `/auth/verify?token=…` (après le lien reçu par e-mail), `/me` (liste des partages avec un compte web), `/admin` (administration — voir ci‑dessous).

## Compte web et liste des partages

1. `POST /auth/magic/request` avec `{ "email": "vous@exemple.com" }` (ou utiliser la page **`/me`** dans l’app web pour saisir l’e‑mail).
2. Ouvrir le lien reçu (ou celui affiché dans les **logs du serveur** si SMTP n’est pas configuré) : **`/auth/verify?token=…`** retourne un **JWT** et l’**id utilisateur** ; le jeton est stocké côté navigateur (`localStorage`, clé `markpad-jwt`).
3. **`GET /me/shares`** (en-tête `Authorization: Bearer <JWT>`) liste les partages dont le propriétaire est le même **`User ID`** que celui configuré dans le plugin Obsidian (copier l’id affiché après vérification dans les réglages du plugin).

## Compte administrateur (web)

- Renseigner **`ADMIN_EMAILS`** avec votre adresse (ex. `vous@exemple.com`) dans `.env`, **ou** promouvoir un utilisateur en base (champ `is_admin` sur la table `users`).
- Se connecter avec le **lien magique** comme n’importe quel utilisateur (même adresse que dans `ADMIN_EMAILS` si vous utilisez cette méthode).
- Appeler les routes **`/admin/shares`**, **`/admin/users`**, **`DELETE /admin/sessions/:roomId`**, etc. avec le même **`Authorization: Bearer <JWT>`** que pour `/me`. La page **`/admin`** du frontend affiche un aperçu JSON (à compléter selon vos besoins).

## Plugin Obsidian : partage dossier et panneau des partages

- **Partager un dossier** : clic droit sur le dossier dans l’explorateur → « Markpad : partager ce dossier ». Un fichier **`.markpad-folder-share.md`** est créé dans le dossier ; les notes `.md` du dossier sont synchronisées dans une même room Yjs (`Y.Map` `files`).
- **Dossier déjà partagé** : le même menu contextuel propose **copier le lien** et **arrêter le partage du dossier**. La ligne du dossier dans l’explorateur affiche aussi une **icône** (clic pour copier le lien du dossier).
- **Panneau latéral** : commande **« Ouvrir le panneau des partages »** — liste tous les partages (notes et dossiers) avec **copier le lien** et **supprimer le partage** (côté serveur + nettoyage local). La liste se met à jour quand le frontmatter ou l’ancre change (y compris après suppression depuis le panneau).
- **Suppression dans le vault** : supprimer l’ancre **`.markpad-folder-share.md`**, un **dossier** racine de partage, ou un **fichier** inclus dans un partage dossier met à jour ou termine le partage côté plugin et serveur (selon le cas : arrêt du dossier, retrait d’un fichier, ou dernière note → fin de room). Pour une **note seule** partagée, la suppression du fichier déclenche aussi la fin de session côté serveur (meilleur effort).
- **Renommage / déplacement** : renommer ou déplacer un dossier ou une note **dans** un partage dossier met à jour les chemins dans la méta locale, l’ancre et, si une session dossier est ouverte, les **clés** du `Y.Map` `files` pour rester aligné avec le web.
- **Clic droit sur une note** dans un dossier partagé : **arrêter le partage** ne supprime plus toute la room par erreur : le fichier est **retiré** du partage dossier ; la room n’est fermée que s’il ne reste plus aucun fichier.
- **Réglages** : bouton **« Purger… »** (section fin de page) — après confirmation, arrêt des partages dossier, suppression des fichiers **`.markpad-folder-share.md`** restants et réinitialisation de l’état local (sessions serveur terminées si possible).

## Désynchronisation et reconnexion (rappel)

- **Note seule, auteur Obsidian** : après reconnexion, une **réconciliation** peut fusionner le `.md` local avec le `Y.Text` (voir plus haut) : en cas de forte divergence, le résultat est un **CRDT au niveau caractères**, pas une résolution « intelligente » du markdown.
- **Note rejointe depuis Obsidian** (« join ») : le **distant** prime au premier sync ; le brouillon local peut être recouvert.
- **Partage dossier** : pour le **contenu** des fichiers, **Yjs** est la source de vérité tant que les clients sont connectés ; le plugin écrit sur le disque depuis Y (ex. nouveaux fichiers vus sur le web). Après une coupure, la reprise suit le merge Yjs habituel.
- Il n’y a pas de verrou « qui a raison » au niveau document : plusieurs éditeurs peuvent produire un texte **fusionné** caractère par caractère.

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

### Déploiement Morglaf (`deploy-to-morglaf.ps1`, local, gitignored)

Le script pousse `main` sur GitHub puis exécute `docker-compose up -d --build` sur le serveur. Pour voir l’**onglet Admin → Réglages** (rendu avancé / modules) :

1. **Commiter** les changements web localement (le script fait `git add .` + commit sauf si `-NoCommit`).
2. Lancer le déploiement **sans** `-NoRebuild` (sinon l’ancienne image Docker `web` reste servie).
3. Sur https://obsidian.morglaf.com/admin : **Ctrl+F5** (cache navigateur).

Si Firefox affiche `Cannot GET /admin/` après F5 : l’image Docker **web** doit inclure le correctif nginx (page `/admin` servie par `index.html`, API seulement sous `/admin/shares`, etc.). Rebuild obligatoire : `docker-compose up -d --build web`.

Exemple :

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy-to-morglaf.ps1 -FastDeploy
```

`-FastDeploy` = `git pull` + rebuild Docker (sans effacer tout le dossier serveur).

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
2. Configure `Server URL`, puis collez le **jeton de connexion** copié depuis **Mon compte**.
3. Ouvre une note et lance `Start Sharing`.

## Dev local manuel (sans script)

- Build global : `npm run build`
- Lint global : `npm run lint`
- Server dev : `npm run -w server dev`
- Web dev : `npm run -w web dev`
- Plugin watch : `npm run -w plugin dev`

## Sauvegardes et durabilité des données

Les rôles du vault Obsidian, de Redis, de SQLite et les recommandations de sauvegarde sont décrits dans **[docs/strategies-sauvegarde.md](docs/strategies-sauvegarde.md)**.

## Notes

- La persistance des rooms est faite via Redis.
- Le frontend est servi en statique via Nginx.
- Le serveur exige un JWT (connexion par e-mail) pour créer ou supprimer des partages depuis le plugin ; un mot de passe optionnel protège chaque room.
- Sur le web, l’éditeur est le **texte brut Markdown** dans `Y.Text` (comme Obsidian en mode source), ce qui aligne la collab avec le plugin.
