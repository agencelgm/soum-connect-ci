## Nouvelle structure de prix

| Formule | Prix | Crédits ajoutés | Contacts prospects |
|---|---|---|---|
| **Starter** | 10 000 FCFA | +50 crédits | 50 prospects (200 FCFA / prospect) |
| **Pro** | 25 000 FCFA | +125 crédits | 125 prospects |
| **Illimité** | 50 000 FCFA | Illimité 30 jours | Aucun plafond |

Base : 1 crédit = 1 prospect débloqué = 200 FCFA.
Achat manuel (pas d'abonnement auto — l'utilisateur rachète quand il veut, comme aujourd'hui).
Les crédits non utilisés restent au solde (comportement actuel conservé).

## Ce qui change

### 1. Packs Chariow (`src/lib/credit-packs.ts`)
Remplacer les 3 packs actuels (10/25/60 crédits à 10k/25k/60k) par :
- Starter : 50 crédits @ 10 000 FCFA
- Pro : 125 crédits @ 25 000 FCFA (marqué "populaire")
- Illimité : @ 50 000 FCFA — flag `unlimited: true`, durée 30 jours

Les `productId` Chariow existants (`prd_kui1kil8`, `prd_ak61x0fl`, `prd_mm3xnkwg`) seront réutilisés/réaffectés — **à confirmer côté Chariow** que les prix des produits ont bien été mis à jour à 10k/25k/50k avant mise en prod, sinon le webhook créditera sur un montant qui ne correspond pas au paiement réel.

### 2. Base de données (migration)
Ajouter sur `partners` :
- `unlimited_until timestamptz null` — date de fin de la formule Illimité.

Modifier la RPC `unlock_lead` :
- Si `unlimited_until > now()` → autoriser le déblocage **sans décrémenter** `credits_balance`, insérer une `credit_transactions` avec `amount = 0`, `tx_type = 'unlock_unlimited'`.
- Sinon, comportement actuel (débit d'1 crédit).

### 3. Webhook Chariow (`src/routes/api/public/chariow-webhook.ts`)
Quand le pack acheté a `unlimited: true` :
- Ne pas ajouter de crédits.
- Mettre `unlimited_until = GREATEST(unlimited_until, now()) + interval '30 days'` (empilable si racheté avant expiration).
- Insérer une `credit_transactions` `tx_type = 'chariow_unlimited'` avec `amount = 0` et note « Formule Illimité 30 jours ».

### 4. Page `/recharger` (`src/routes/_authenticated.recharger.tsx`)
Nouvelle UI 3 cartes reflétant le tableau ci-dessus. Sur la carte Illimité : afficher « Prospects illimités pendant 30 jours ». Si le partenaire a déjà `unlimited_until > now()`, afficher un badge « Formule Illimité active jusqu'au JJ/MM » et la date d'expiration.

### 5. Affichage du solde (partenaire)
- AppShell / espace-partenaire / marketplace : si `unlimited_until > now()`, remplacer « X crédits » par « **Illimité** — jusqu'au JJ/MM ». Sinon inchangé.
- Marketplace : bouton « Débloquer » actif sans coût crédit pour les Illimités.

### 6. Admin
- Carte partenaire : afficher badge « Illimité jusqu'au JJ/MM » quand actif.
- Filtres : ajouter option « Formule Illimité » dans les filtres tier existants.

### 7. Pages publiques
Mettre à jour toute mention du prix des crédits (page comment-ca-marche, FAQ, page cabinets-partenaires si applicable) pour refléter les 3 nouvelles formules. Je repérerai les occurrences à la mise en œuvre.

## Points à confirmer avant exécution
1. **Chariow** : les 3 produits (`prd_kui1kil8`, `prd_ak61x0fl`, `prd_mm3xnkwg`) doivent être renommés/reprisés côté Chariow (Starter 10k / Pro 25k / Illimité 50k). Si vous préférez créer 3 nouveaux `productId`, dites-le — j'utiliserai les nouveaux IDs.
2. **Rétroactivité** : les partenaires ayant déjà un solde de crédits le conservent tel quel (aucune conversion). OK ?
3. **Ordre d'usage** : si un partenaire achète Illimité alors qu'il a encore des crédits, on consomme d'abord Illimité (gratuit) et on garde ses crédits pour après expiration. Confirmez-vous cette logique ?
