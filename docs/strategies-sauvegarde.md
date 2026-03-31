# Stratégies de sauvegarde Markpad

Ce document complète le [README](../README.md) en précisant **où vivent les données**, ce qui est **durable ou éphémère**, et comment **réduire le risque de perte** en production ou en usage personnel.

## Où sont stockées les données ?

| Couche | Rôle | Durabilité typique |
|--------|------|--------------------|
| **Vault Obsidian** (fichiers `.md` sur disque) | Source de vérité pour toi : notes, dossiers, fichier ancre `.markpad-folder-share.md` | Durable — c’est ton backup principal si tu sauvegardes le dossier du vault |
| **Redis** (serveur Markpad) | État collaboratif **Yjs** des rooms (contenu en cours d’édition, reprise après reconnexion) | **Non** une archive long terme : conçu pour la session / la disponibilité, avec expiration configurable (`SESSION_MAX_IDLE_MS`, etc.) |
| **SQLite** (serveur, `MARKPAD_SQLITE_PATH`) | Métadonnées serveur : utilisateurs, index des partages, liens magiques, admin | Durable côté serveur si le fichier est sauvegardé ; distinct du contenu markdown des notes |
| **Navigateur (web)** | Cache local (JWT, nom affiché, langue) | Non : le contenu édité vit dans la room Yjs + ce que tu exportes ou ce qui est dans le vault côté Obsidian |

## Principes à retenir

1. **Le markdown dans ton vault Obsidian** reste la référence la plus simple pour « posséder » tes notes. Le plugin y écrit en sync dossier ; en partage note simple, le corps est aligné avec Yjs selon les règles décrites dans le README (réconciliation, anti-vide).
2. **Redis** permet à plusieurs clients de reprendre une session sans tout perdre à chaque déconnexion, mais **n’est pas un substitut** à une sauvegarde de fichiers ni à un historique versionné de ton choix (Git, Time Machine, etc.).
3. **Le serveur** peut être recréé : restaure alors SQLite + Redis (si tu les sauvegardes) et la même config ; sinon les rooms et comptes côté serveur sont à recréer — **le vault local garde tes fichiers** tant que tu ne les écrases pas.

## Stratégies recommandées

### Côté utilisateur (vault)

- **Sauvegarder tout le répertoire du vault** (copie incrémentielle, synchronisation que tu maîtrises, ou snapshots système).
- Pour les dossiers partagés, garder une copie du dossier (ou du vault entier) avant des opérations risquées (fusion manuelle, gros renommages).
- **Versionner** (Git dans le vault, ou export périodique) si tu veux un historique exploitable au-delà de ce que Markpad synchronise en temps réel.

### Côté serveur auto-hébergé

- **Sauvegardes régulières** du volume ou des fichiers :
  - Fichier **SQLite** (`MARKPAD_SQLITE_PATH`) si tu t’en sers pour comptes / admin / métadonnées.
  - Données **Redis** (dump RDB/AOF selon ta config Docker) seulement si tu veux **réduire la perte de sessions en cours** après incident — pas obligatoire pour « retrouver tes notes », qui sont dans le vault.
- Documenter **`PUBLIC_SERVER_URL` / `PUBLIC_WEB_URL`** et les secrets (JWT, clés API) pour une restauration propre.
- Tester une **restauration** (même minimale) sur une machine de secours.

### Collaboration web + Obsidian

- Les invités **web** n’ont pas automatiquement une copie dans un vault : la continuité dépend du **serveur (Redis)** et des **éditeurs connectés**. Pour du contenu critique, prévoir **export** ou **compte / flux** qui ramène le travail vers un vault (processus manuel ou outillage maison).
- Après une **panne longue** Redis ou une **room supprimée**, le contenu peut être reconstitué à partir des **fichiers locaux** des participants qui avaient encore la note ouverte / synchronisée — d’où l’intérêt de sauvegardes vault côté chaque auteur.

## Arrêt d’un partage dossier

- Le fichier **`.markpad-folder-share.md`** peut être supprimé ou nettoyé lors de l’arrêt du partage : les **notes `.md` du dossier restent** dans le vault ; seul le lien serveur et la méta de partage sont retirés côté plugin quand tu « supprimes le partage ».
- **Supprimer l’ancre ou le dossier** depuis l’explorateur Obsidian est équivalent à un arrêt de partage côté plugin (session terminée côté serveur si possible, état local nettoyé).
- **Réglages du plugin** : l’action **« Purger… »** supprime en bloc les ancres **`.markpad-folder-share.md`** et réinitialise les métadonnées de partage dossier (voir le README) — utile si des fichiers ancre sont restés orphelins.

## Renommages et déplacements dans le vault

- Pour un **partage dossier**, renommer ou déplacer le dossier partagé (ou des notes à l’intérieur) met à jour les chemins enregistrés et, pendant une session ouverte, les clés Yjs associées, afin de limiter la divergence avec les clients web. **Sauvegarde / versionnement** du vault restent recommandés avant de gros déplacements.

## En résumé

- **Ne pas** considérer Redis comme archive markdown.
- **Considérer** le vault Obsidian (et tes backups de ce vault) comme base de rétablissement « contenu ».
- **Considérer** SQLite + config serveur comme base de rétablissement « comptes / listes / admin », distincte du contenu des notes.

Pour l’architecture technique détaillée (API, Docker, plugin), se reporter au [README](../README.md).
