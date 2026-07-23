
# Nouvelle structure de prix + promotions ciblées

## 1. Retour au prix régulier

Grille standard affichée sur `/recharger` :
- 10 000 FCFA = **10 prospects**
- 25 000 FCFA = **25 prospects**
- 50 000 FCFA = **Illimité 30 jours**

Fichier `src/lib/credit-packs.ts` : les 3 productIds Chariow existants sont conservés, seule la valeur `credits` retombe à 10 / 25 (au lieu de 50 / 125). L'Illimité reste 30 jours par défaut.

## 2. Système de promotions

### Nouvelle table `partner_promotions`

```text
id uuid pk
partner_id uuid fk -> partners
kind text        -- '50pct_consumed' | 'zero_credit_winback'
credit_multiplier int   -- 5 (×5 : 10 crédits → 50, 25 → 125)
unlimited_days int      -- 60 (au lieu de 30) pour le pack illimité
ab_variant text         -- 'A_credits' ou 'B_price_per_lead' (test A/B)
expires_at timestamptz
used_at timestamptz null
created_at timestamptz default now()
```

RLS : lecture par le partenaire propriétaire, écriture service_role uniquement.

Une seule promo active à la fois par partenaire (index partiel `WHERE used_at IS NULL AND expires_at > now()`).

### Promo A — « 50 % consommé »

Déclencheur : dans `unlock_lead` (ou côté serveur après unlock), quand un partenaire a consommé **≥ 15 crédits sur les 30 offerts** (bonus signup uniquement, on regarde `credit_transactions` type = `signup_bonus`) ET n'a jamais acheté sur Chariow ET n'a pas déjà de promo active.

Action :
1. Insérer une ligne `partner_promotions` (kind=`50pct_consumed`, multiplier=5, unlimited_days=60, expires_at = now()+4j, ab_variant aléatoire A/B).
2. Envoyer un email via la queue transactionnelle avec 2 variantes :
   - **Variante A (crédits)** : « Rechargez 10 000 FCFA et obtenez 50 prospects au lieu de 10 » + « Illimité 2 mois pour 50 000 FCFA ».
   - **Variante B (prix par lead)** : « 1 prospect à 200 FCFA au lieu de 1 000 » + « Illimité 60 jours pour 50 000 FCFA ».
3. Compte à rebours dans l'email : « Offre valable 4 jours, expire le [date] ».

### Promo B — « Relance 0 crédit »

Cible : partenaires `approved` (ou `paused` non-bounced), `credits_balance = 0`, `unlimited_until` null/expiré, **aucun achat Chariow** (jamais de ligne dans `chariow_payments` pour ce partenaire).

Séquence sur 4 jours (jeudi → dimanche) : email matin (09h), après-midi (14h), soir (19h) heure Abidjan = **12 emails max** par partenaire sur la fenêtre. Chaque partenaire reçoit une promo `zero_credit_winback` créée à l'entrée dans la campagne (expires_at = dimanche 23h59), multiplier=5, unlimited_days=60. Progression du ton dans le sujet/copie : douceur jeudi → « il ne reste que 24 h » dimanche soir.

Idempotence via nouvelle table `promo_email_sends (promotion_id, slot_key)` unique pour éviter les doublons si le cron est rejoué.

### Multiplicateur côté paiement (Chariow webhook)

Dans `src/routes/api/public/chariow-webhook.ts` :
1. Résoudre le `partner_id` (via `customer_reference` ou metadata, déjà fait).
2. Charger la promo active (`used_at IS NULL AND expires_at > now()`).
3. Si promo présente :
   - Pack 10k/25k → crédits × `credit_multiplier` (10 → 50, 25 → 125).
   - Pack Illimité 50k → `unlimited_until = stack(now, unlimited_days)` (60 j au lieu de 30).
   - Marquer `used_at = now()` sur la promo.
   - Écrire une note dans `credit_transactions` (« Bonus promo ×5 » / « Bonus promo Illimité 2 mois »).
4. Sinon : comportement actuel (crédits ou illimité 30 j).

## 3. Templates email

Nouveaux fichiers dans `src/lib/email-templates/` + enregistrement dans `registry.ts` :
- `promo-50pct-variant-a.tsx` — angle « crédits x5 »
- `promo-50pct-variant-b.tsx` — angle « 200 FCFA par prospect »
- `promo-winback-morning.tsx` — jeudi/vendredi/samedi/dimanche matin
- `promo-winback-afternoon.tsx` — après-midi
- `promo-winback-evening.tsx` — soir (urgence croissante, sujet « Plus que Xh »)

Chaque template :
- Contient le message du prospect / valeur perçue (rappel des leads récents dans la ville du partenaire, bonus).
- CTA vers `/recharger`.
- Footer unsubscribe standard (automatique).

## 4. Crons

- **Trigger promo A** : logique inline dans `unlock_lead` côté serveur (déjà un chemin existant après unlock dans `marketplace.functions.ts`) — pas de cron.
- **Winback 0 crédit** : nouveau cron `pg_cron` toutes les heures qui appelle `/api/public/hooks/promo-winback-dispatch`. Cette route :
  1. Identifie les partenaires éligibles (0 crédit + jamais acheté).
  2. Crée la promo si absente.
  3. Envoie l'email du slot horaire en cours (matin/aprem/soir) si pas déjà envoyé.
  4. S'arrête dimanche 23h59.

## 5. UI

Dans `/recharger` : si `partner_promotions` actif existe → bannière « Promotion exclusive : ×5 crédits — expire le [date] », prix affichés « barré » vs « après promo ». Le clic sur le widget Chariow reste identique (multiplicateur appliqué côté webhook).

## 6. Admin

Nouvel onglet « Promotions » dans `_authenticated.admin.tsx` : liste des promos actives, taux de conversion (utilisées / envoyées) et split A/B pour piloter les futurs messages.

## Détails techniques

**Migrations SQL** :
- Créer `partner_promotions`, `promo_email_sends` avec GRANTs + RLS.
- Ajouter la logique de déclenchement dans une fonction `maybe_grant_50pct_promo(_partner_id uuid)` appelée depuis le server fn après unlock (pas dans le RPC `unlock_lead` pour ne pas casser le trigger anti-escalation).
- Cron `pg_cron` horaire pour le winback.

**Fichiers touchés** :
- `src/lib/credit-packs.ts` (retour 10 / 25)
- `src/routes/_authenticated.recharger.tsx` (bannière promo, prix comparatif)
- `src/routes/api/public/chariow-webhook.ts` (multiplicateur)
- `src/lib/marketplace.functions.ts` (appel `maybe_grant_50pct_promo` après unlock)
- `src/lib/email-templates/*` (5 nouveaux templates)
- `src/lib/email-templates/registry.ts`
- `src/routes/api/public/hooks/promo-winback-dispatch.ts` (nouveau)
- `src/routes/_authenticated.admin.tsx` (onglet Promotions)
- Migration SQL : table + cron + fonction

**Anti-abus** : contrainte unique (partner_id, kind) sur les promos actives, contrôle bounce (`email_bounced_at IS NULL`) avant chaque envoi, respect de `suppressed_emails`.
