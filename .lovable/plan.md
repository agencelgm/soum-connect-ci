## Objectif

Donner au staff LGM une vue claire de tous les achats de crédits faits via Chariow : qui a acheté, quand, combien de crédits, et quel montant (label) — avec totaux et filtres simples.

## Source de données

Tout est déjà capturé dans la table `chariow_payments` (alimentée par le webhook Chariow). Champs utilisés :
- `received_at` / `processed_at` — date
- `email` — acheteur
- `partner_id` — cabinet rattaché (jointure vers `partners.cabinet_name`)
- `credits_granted` — nombre de crédits livrés
- `amount_label` — montant (ex. "25 000 FCFA pour 25 crédits")
- `product_id` — identifiant produit Chariow
- `status` — `processed` / `pending` / `error`
- `error_message` — si échec

Aucune migration nécessaire. Pas de changement de RLS (la policy admin existe déjà).

## Changements

### 1. `src/lib/partners.functions.ts` — nouvelle serverFn `listChariowPayments`
- Protégée par `requireSupabaseAuth` + check `admin` ou `agent`
- Retourne les 200 derniers paiements, joints à `partners(cabinet_name)`
- Calcule en plus 3 KPI : total crédits accordés ce mois, total ce mois (count), total all-time crédits

### 2. `src/components/layout/AppShell.tsx`
- Ajouter `"paiements"` à l'union du type `search.tab`
- Ajouter entrée nav staff : `{ to: "/admin", search: { tab: "paiements" }, label: "Paiements crédits", icon: Coins }`

### 3. `src/routes/_authenticated.admin.tsx`
- Étendre `validateSearch` pour accepter `"paiements"`
- Ajouter le rendu conditionnel d'un nouveau composant `PaymentsPanel` quand `tab === "paiements"`
- `PaymentsPanel` affiche :
  - **3 cartes KPI** en haut : Crédits accordés (mois), Nb transactions (mois), Crédits accordés (total)
  - **Tableau** trié par date desc, colonnes : Date, Email, Cabinet, Produit, Crédits, Montant, Statut
  - Badge couleur pour `status` (vert processed, orange pending, rouge error)
  - Ligne `error_message` repliable si statut error
  - Filtre simple par statut (boutons : Tous / Traités / En erreur)
  - Bouton "Exporter CSV" (génère côté client à partir des données chargées)

## Hors scope

- Pas d'édition/remboursement depuis l'UI (Chariow reste la source de vérité)
- Pas de webhook ni de schéma DB modifiés
- Pas de pagination serveur (200 dernières lignes suffisent pour l'usage actuel ; à itérer si besoin)
