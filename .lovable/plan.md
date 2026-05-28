## Diagnostic

Le webhook Chariow est bien arrivé pour la licence `PYDL-YK6O-9HFT-D8L2` (pack 10 crédits), mais :
- L'achat a été fait avec `kkaderkonan@gmail.com`
- Le compte connecté est `test1@gmail.com`
- Le webhook cherche un partenaire par email exact → aucun match → ligne enregistrée en `status: unmatched` avec 0 crédits.

C'est le comportement attendu du code actuel, mais c'est trop fragile : un client qui achète avec un email perso différent de son email partenaire ne sera jamais crédité automatiquement.

## Corrections à apporter

### 1. Régulariser le paiement test (one-shot)
- Attribuer 10 crédits à `test1@gmail.com` (partner `78661ae8…`) : `credits_balance` 18 → 28.
- Insérer une ligne `credit_transactions` (tx_type `chariow_purchase`, ref = id du paiement, note licence).
- Mettre à jour `chariow_payments` (id `26db14b0…`) : `status='credited'`, `partner_id`, `credits_granted=10`.

### 2. Passer le `partner_id` dans le widget Chariow
Sur `/recharger`, ajouter au div `#chariow-widget` les attributs `data-metadata-*` (ou `data-customer-reference`, selon ce que Chariow renvoie dans le payload) avec l'ID du partenaire connecté. Objectif : que Chariow réémette cette valeur dans le webhook.

### 3. Élargir le matching côté webhook (`src/routes/api/public/chariow-webhook.ts`)
Ordre de résolution du partenaire :
1. `partner_id` extrait de `payload.metadata.partner_id` / `payload.custom_fields.partner_id` / `payload.reference` → match direct par `partners.id`.
2. Fallback : match par email (comportement actuel).
3. Sinon : `status='unmatched'` (comportement actuel) — pour réclamation manuelle.

### 4. UI de réclamation manuelle sur `/recharger`
- Petit bloc « J'ai déjà payé, je n'ai pas reçu mes crédits » avec un champ `license_code`.
- Nouveau server fn `claimChariowPayment` protégé par `requireSupabaseAuth` :
  - Cherche dans `chariow_payments` la ligne `license_code = ?` ET `status IN ('unmatched','pending')`.
  - Si trouvée : crédite le partenaire connecté, écrit `credit_transactions`, met le paiement à `status='credited'` avec son `partner_id`.
  - Idempotent : si déjà `credited`, renvoie une erreur claire.
- Migration : ajouter une policy `INSERT` minimale sur `partners`/`chariow_payments` n'est pas requise (on passe par `supabaseAdmin` dans le server fn).

## Notes techniques

- Le webhook reste idempotent grâce à la contrainte unique sur `license_code`.
- La réclamation manuelle court-circuite l'email mismatch ; elle valide juste que le code existe et n'a pas déjà été crédité.
- Aucune modification de schéma DB nécessaire (les colonnes `partner_id`, `status`, `credits_granted` existent déjà sur `chariow_payments`).
- Aucune nouvelle dépendance.

## Question ouverte (peut être tranchée pendant l'implémentation)

Le nom exact de l'attribut `data-*` exposé par le widget Chariow pour la metadata n'est pas dans le code. Je tenterai `data-metadata-partner-id` + `data-customer-reference`, et j'inspecterai le payload reçu lors d'un test pour confirmer le bon champ avant de finaliser l'extraction côté webhook.
