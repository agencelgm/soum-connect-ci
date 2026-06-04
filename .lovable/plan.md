## Diagnostic

Le tracking est **déjà codé** dans le projet :

- `src/lib/meta-pixel.ts` — helper `trackMetaConversion()` qui déclenche **Pixel navigateur + Conversions API serveur** avec un `event_id` partagé (déduplication automatique côté Meta).
- `src/routes/__root.tsx` — Pixel `695405827723663` initialisé + `PageView` auto sur chaque navigation SPA.
- `src/routes/api/public/meta-capi.ts` — endpoint serveur qui hash les PII (SHA-256) et envoie à Graph API v21.
- `src/components/lead/MultiStepLeadForm.tsx` — envoie **`Lead`** quand un prospect soumet un devis.
- `src/routes/inscription-partenaire.tsx` — envoie **`CompleteRegistration`** quand un cabinet s'inscrit.
- SAV / `ContactForm` : non tracké (volontaire).
- Le secret `META_CAPI_ACCESS_TOKEN` est bien présent côté serveur.

**Pourquoi Meta ne voit probablement rien aujourd'hui** : le code n'a jamais été **publié**. Le Pixel n'existe que sur l'URL preview, pas sur ton domaine de production (`soumissioncomptable.com`). Le `LOVABLE_API_KEY` etc. n'a rien à voir — c'est juste la mise en ligne qui manque.

## Plan

### 1. Publier le site
Cliquer sur **Publier** depuis l'interface Lovable pour déployer la dernière version sur `soumissioncomptable.com`. Sans cette étape, ni le Pixel ni la CAPI ne tournent en production.

### 2. Activer le mode test pour valider
Ajouter un secret runtime **`META_TEST_EVENT_CODE`** (récupérable dans Events Manager → ton Pixel → onglet **Test Events** : code de la forme `TEST12345`). Le code lit déjà cette variable dans `meta-capi.ts` et l'ajoute au payload — donc dès qu'il est défini, les événements remontent dans la fenêtre Test Events en quelques secondes.

### 3. Procédure de validation
1. Publier le site.
2. Ajouter `META_TEST_EVENT_CODE` (secret Lovable Cloud).
3. Ouvrir Events Manager → Pixel `695405827723663` → **Test Events**, coller `https://www.soumissioncomptable.com` et "Open Website".
4. Soumettre un faux devis → vérifier `Lead` apparaît avec **Browser + Server** (déduplication OK).
5. Créer un faux compte partenaire → vérifier `CompleteRegistration` idem.
6. Vérifier le score EMQ (Event Match Quality) dans Diagnostics — viser ≥ 6/10 grâce aux champs hashés (email, téléphone, prénom, ville).
7. Supprimer `META_TEST_EVENT_CODE` une fois validé (les événements repartent en production normale).

### 4. Hors scope (à traiter séparément si tu veux)
- Bannière de consentement RGPD/cookies.
- `ViewContent` sur les pages de service (signal upstream qui améliore l'attribution).
- Domaine personnalisé vérifié dans Meta Business (recommandé pour iOS 14.5+).

## Détails techniques

- **Déduplication** : Pixel et CAPI envoient le même `event_id` (UUID généré client). Meta dédupplique automatiquement dans une fenêtre de 48 h → 1 seul événement compté même si les deux remontent.
- **Anti-adblock** : si un adblocker tue le Pixel navigateur, la CAPI passe quand même côté serveur — c'est tout l'intérêt du double envoi.
- **Confidentialité** : les PII (email, tel, prénom, nom, ville) ne sont **jamais** envoyées en clair à Meta. Elles sont normalisées puis hashées SHA-256 dans le handler serveur avant l'appel Graph API.
- **Rate-limit** : 30 req/min/IP sur `/api/public/meta-capi` pour limiter les abus.