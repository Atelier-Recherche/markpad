J'ai lu tous les fichiers sources du plugin. Voici mon rapport.

---

# Rapport — Compatibilité Obsidian Mobile (Android)

## Problèmes critiques

### 1. `patchYWebsocketProviderOutbound` — Sync sortante cassée si le patch échoue

Le fichier `patchYWebsocketProviderOutbound.ts` accède à `provider._updateHandler`, une propriété **interne privée** de `y-websocket`. Sur le bundle mobile d'Obsidian (Android), la compilation peut différer du bundle desktop, et cette propriété peut ne pas exister ou être renommée.

Si le patch échoue (retourne `false`), **aucune modification locale n'est envoyée au serveur** (le flux Obsidian→serveur est silencieusement cassé). Le plugin log déjà cet avertissement, mais l'utilisateur ne voit rien.

```ts
// patchYWebsocketProviderOutbound.ts
const old = provAny._updateHandler;
if (!old) return false;  // ← sur mobile, ce cas est probablement plus fréquent
```

---

### 2. `resolveObsidianEditorView` — Accès aux internals de l'éditeur

La fonction tente plusieurs chemins non documentés pour récupérer la `EditorView` CodeMirror :

```ts
editor.cm, editor.editorComponent?.cm, currentMode?.cm, editMode?.cm ...
```

Sur Obsidian Android, la structure interne de l'éditeur peut être différente. Si **aucun chemin** ne fonctionne, le plugin retourne `null → throw "no_cm"` et est totalement inopérant. Il n'y a aucun fallback ni message d'erreur clair pour guider l'utilisateur.

---

### 3. `navigator.clipboard` — API soumise à permissions sur Android

Le plugin utilise `clipboard.writeText()` et `clipboard.readText()` à de nombreux endroits. Sur Android :

- `readText()` requiert la **permission explicite de l'utilisateur** (dialog système) ou un geste utilisateur récent, sans quoi elle lève une exception.
- `writeText()` peut aussi échouer dans certaines configurations Android (WebView restreint, contexte non-sécurisé).

Le `readText()` est protégé par un `try/catch` silencieux — c'est bien. Mais les nombreux appels à `writeText()` dans `startSharing`, `startSharingFolder`, `copyShareLink*`… ne sont pas tous robustes. Un échec fera remonter l'erreur dans le handler général avec un message peu clair, ou sera silencieux.

---

### 4. `attachFolderSharedSession` — Attente infinie sans timeout

```ts
// main.ts ~ligne 2165
if (!provider.synced) {
  await new Promise<void>((resolve) => {
    const onSync = (synced: boolean) => {
      if (!synced) return;
      provider.off("sync", onSync);
      resolve();
    };
    provider.on("sync", onSync);
  });
}
```

Si le serveur est injoignable (réseau mobile instable, coupure 4G, Wi-Fi perdu), cette `Promise` **ne se résout jamais**. Sur desktop le réseau est généralement stable, mais sur Android ce cas est fréquent. L'appel à `attachFolderSharedSession` se retrouve suspendu indéfiniment sans notification à l'utilisateur.

---

## Problèmes significatifs

### 5. `window.confirm()` — Bloqué sur Android WebView

```ts
// settings.ts ligne 158
if (!window.confirm("Supprimer les ancres...")) return;
```

Sur Android, les `window.confirm/alert/prompt` sont **bloqués par défaut dans les WebViews** depuis Android 4.4+. Le bouton "Purger…" peut donc confirmer silencieusement sans que l'utilisateur voie la dialog, ou échouer sans retour.

---

### 6. Cycle de vie Android — WebSocket interrompu en arrière-plan

Sur Android, quand Obsidian passe en arrière-plan, le système peut **tuer les connexions réseau** (WebSocket compris) après quelques secondes. Le plugin gère une reconnexion via le timer de `readonly` (3 secondes), mais :
- Le timer est de 3 secondes, alors que Android peut couper le réseau quasi-instantanément.
- À la remise en avant-plan, `queueAutoConnect` se déclenche avec un délai de 450ms, ce qui peut être insuffisant si Android n'a pas encore rétabli le réseau.

Le résultat probable : l'utilisateur voit une note en lecture seule à chaque retour dans l'app, même brièvement.

---

### 7. Status bar — Invisible sur mobile

```ts
this.statusBarEl = this.addStatusBarItem();
```

La barre de statut (Markpad: off / en ligne / hors-ligne…) **n'est pas affichée sur Obsidian mobile** (Android). L'utilisateur n'a aucun retour visuel sur l'état de la connexion, sauf via les `Notice` (toasts).

---

### 8. `MutationObserver` sur l'explorateur de fichiers — DOM mobile différent

Le plugin observe le DOM de l'explorateur de fichiers pour décorer les notes partagées :

```ts
this.fileExplorerObserver = new MutationObserver(...);
this.fileExplorerObserver.observe(root, { childList: true, subtree: true });
```

Sur Android, l'explorateur de fichiers est dans un **drawer** (tiroir latéral) qui peut ne pas être dans le DOM quand il est fermé, ou avoir une structure virtuelle différente. Les icônes de partage peuvent ne jamais apparaître.

---

## Problèmes mineurs

### 9. URL serveur par défaut inutilisable

```ts
serverUrl: "http://localhost:1234"
```

Sur Android, `localhost` désigne l'appareil lui-même, pas le PC de développement. Sans configuration explicite, toutes les tentatives de connexion échouent. Ce n'est pas un bug de code mais un piège à l'onboarding mobile.

---

### 10. `BroadcastChannel` via `lib0`

`patchYWebsocketProviderOutbound.ts` utilise `lib0/broadcastchannel`. L'API `BroadcastChannel` est disponible sur Android Chrome/Chromium récent, mais peut avoir des limitations dans le contexte WebView restreint d'Obsidian mobile.

---

## Résumé des priorités

| # | Problème | Sévérité | Impact |
|---|----------|----------|--------|
| 1 | `_updateHandler` absent → sync sortante silencieusement cassée | 🔴 Critique | Écriture locale jamais envoyée au serveur |
| 2 | `resolveObsidianEditorView` échoue → `no_cm` | 🔴 Critique | Plugin totalement inopérant |
| 3 | `clipboard.writeText/readText` instable | 🟠 Élevé | Liens jamais copiés, join peut planter |
| 4 | Attente infinie dans `attachFolderSharedSession` | 🟠 Élevé | Freeze silencieux sur réseau mobile |
| 5 | `window.confirm` bloqué Android | 🟡 Moyen | Bouton purge inopérant |
| 6 | WebSocket tué en arrière-plan | 🟡 Moyen | Note en readonly à chaque retour |
| 7 | Status bar absent | 🟡 Moyen | UX dégradée sans feedback d'état |
| 8 | MutationObserver DOM mobile | 🟡 Moyen | Décorations absentes |
| 9 | `localhost` par défaut | 🔵 Info | Onboarding cassé si non reconfiguré |
| 10 | `BroadcastChannel` WebView | 🔵 Info | Sync locale inter-onglets potentiellement cassée |