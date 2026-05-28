## Problème

Le webhook Chariow ne crédite pas automatiquement parce que :
1. **`data-metadata-partner-id` n'est pas transmis** par le widget Chariow → `product.metadata: null` dans le payload reçu.
2. **L'email du paiement** (kkaderkonan@gmail.com) **ne correspond pas** à l'email du compte partenaire connecté → fallback email échoue.
3. Aucun mécanisme fiable ne lie un paiement Chariow à un partenaire connecté.

## Solution — 3 niveaux de matching

### Niveau 1 — Table d'intentions de paiement (le vrai fix)

Avant d'ouvrir le widget Chariow, on enregistre une "intention" côté serveur, indexée par `(product_id, partner_id, created_at)`. Le webhook matche le paiement le plus récent pour ce `product_id` dans une fenêtre courte (ex. 30 min) si aucun autre indice ne fonctionne.

**Migration** : nouvelle table `chariow_payment_intents`
- `id`, `partner_id` (FK partners), `product_id`, `created_at`, `consumed_at`, `chariow_payment_id` (nullable)
- RLS : partner peut INSERT pour son propre partner_id, lecture admin uniquement
- Index sur `(product_id, created_at DESC) WHERE consumed_at IS NULL`

**Server fn** `createChariowIntent(productId)` (auth requis) appelée au clic sur le bouton Chariow, juste avant d'ouvrir le widget.

### Niveau 2 — Matching dans le webhook

Ordre de résolution du `partner_id` :
1. `metadata.partner_id` (au cas où Chariow finit par le transmettre)
2. **Email exact** sur `partners.email`
3. **Email exact** sur `profiles.email` → remonter au `partners.profile_id`
4. **Intention non consommée** la plus récente (<30 min) pour ce `product_id` → marquer `consumed_at`
5. Sinon `status = unmatched` (UI de réclamation existante)

### Niveau 3 — UX recharger

- Afficher clairement : "Payez avec **votre email de compte : `<email>`** pour un crédit automatique"
- Bouton "Copier mon email" à côté du widget
- Garder le formulaire "J'ai payé mais pas reçu" avec le `license_code`

## Fichiers à modifier

- **Migration SQL** : créer `chariow_payment_intents` + GRANTs + RLS + index
- **`src/lib/chariow.functions.ts`** : nouvelle server fn `createChariowIntent`
- **`src/routes/api/public/chariow-webhook.ts`** : ajouter niveaux 3 (profiles) et 4 (intent), consommer l'intent
- **`src/routes/_authenticated.recharger.tsx`** :
  - Appeler `createChariowIntent` au clic via un wrapper autour du bouton Chariow
  - Afficher l'email du compte avec bouton copier
  - Garder l'attribut `data-metadata-partner-id` (au cas où, sans dépendre de lui)

## Notes techniques

- Le widget Chariow n'expose visiblement pas de mécanisme fiable de metadata custom → l'intent table est plus robuste qu'un attribut HTML qu'on ne maîtrise pas.
- Idempotence : le webhook reste sécurisé par `chariow_payments.license_code UNIQUE`.
- Le paiement actuel non matché (`9a08baa4...`, kkaderkonan@gmail.com) sera traité manuellement après confirmation de l'utilisateur (créer un partner pour kkaderkonan ou créditer un partner existant).

## Question avant build

Pour le paiement test actuel non matché (10 crédits, kkaderkonan@gmail.com) : à qui les attribuer ? Au même compte test que la dernière fois (test1@gmail.com / partner `78661ae8…`), ou bien créer un partner pour kkaderkonan ?
