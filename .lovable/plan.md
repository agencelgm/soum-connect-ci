## Objectif
Forcer le rechargement du formulaire "Nouveau partenaire" côté admin pour que les derniers champs obligatoires (rôle, site internet, logo, services, zones) apparaissent immédiatement, sans dépendre du cache navigateur ou du bundle en cache.

## Changements

1. **`src/routes/_authenticated.admin.tsx`**
   - Ajouter en haut du fichier une constante `FORM_VERSION = "v3-2026-07-01"` importée/utilisée comme `key` sur le composant `CreatePartnerPanel` pour forcer React à démonter/remonter le formulaire.
   - Ajouter un petit badge visible "Formulaire v3" en haut du panneau — sert de témoin visuel : si le badge n'apparaît pas, le user sait que c'est un cache navigateur, pas un problème de code.
   - Ajouter un bouton "🔄 Recharger le formulaire" qui appelle `window.location.reload()` avec `?v=${Date.now()}` en query string pour casser tout cache HTTP/SW.

2. **`src/routes/__root.tsx`**
   - Ajouter dans le `<head>` les meta cache-control pour les routes admin :
     ```
     <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
     <meta http-equiv="Pragma" content="no-cache" />
     <meta http-equiv="Expires" content="0" />
     ```
   - Portée : global (impact minime, admin uniquement rechargé fréquemment).

3. **Vérification via Playwright**
   - Après build, lancer un script qui ouvre `/admin`, va sur l'onglet "Nouveau partenaire", et screenshot le formulaire pour confirmer que les champs Rôle / Site internet / Logo / Services / Zones sont visibles.

## Instructions pour vous
Après déploiement de ces changements :
- Faites **Ctrl+Shift+R** (Windows) ou **Cmd+Shift+R** (Mac) sur la page admin.
- Si le badge "Formulaire v3" apparaît en haut → tout est bon.
- Sinon, cliquez le bouton "🔄 Recharger le formulaire".
