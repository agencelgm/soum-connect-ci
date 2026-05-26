
# Plateforme partenaires & marketplace de leads — v3

Mise à jour : tous les emails partenaires passent par GoHighLevel via webhook dédié.

## Changement clé v3 — Emails déléguées à GHL

On **ne câble aucun service email** (pas de Resend). À la place, un **nouveau webhook GHL dédié partenaires**, séparé de celui des prospects.

### Deux webhooks GHL distincts

| Variable env | Usage | Tags envoyés |
|---|---|---|
| `GHL_WEBHOOK_URL` (existant) | Prospects formulaires lead | `soumissioncomptable` |
| `GHL_PARTNERS_WEBHOOK_URL` (nouveau) | Tous les événements partenaires | `soumissioncomptable` + `partenaire` |

### Événements partenaires envoyés à GHL

À chaque événement clé du cycle de vie partenaire, on POST vers `GHL_PARTNERS_WEBHOOK_URL` avec :
- Toutes les infos cabinet (nom cabinet, contact prénom/nom, email, téléphone, ville, site, Facebook, services, zones)
- `event_type` : `signup` | `approved` | `rejected` | `paused` | `reactivated` | `manual_creation` | `low_credits` | `zero_credits`
- `tags` : `["soumissioncomptable", "partenaire"]`
- `status` actuel du compte, `credits_balance`, `partner_id`
- Tracking : `submitted_at`, `user_agent`, `page_url`

GHL gère ensuite les emails (bienvenue, attente, approbation, refus, relances recharge, etc.) via ses automatisations. Toi tu configures les séquences côté GHL.

### Côté code

Nouveau fichier `src/lib/ghl-partners.server.ts` :
- Fonction `notifyPartnerEvent({ partner, event_type })` 
- Pattern identique à l'existant : try/catch, log `LOST_PARTNER_EVENT` si échec, ne bloque jamais l'action utilisateur
- Appelée depuis les server functions : `signupPartner()`, `approvePartner()`, `rejectPartner()`, `pausePartner()`, `reactivatePartner()`, `createPartnerManually()`, et déclenchée automatiquement quand `credits_balance` passe sous un seuil

### Secrets à ajouter

`GHL_PARTNERS_WEBHOOK_URL` — webhook GHL dédié partenaires (à créer côté GHL avant la phase 2).

## Reste inchangé par rapport à v2

- 5 statuts partenaire : `pending_review`, `approved`, `paused`, `rejected`, `deleted`
- Inscription self-service + page d'attente
- Création manuelle par admin/agent (auto-approuvé, 10 crédits)
- Approbation/pause/rejet/suppression par l'équipe
- Pas de crédit = bouton « Recharger pour débloquer » sur les leads
- Tables, RLS, rôles, RPC `unlock_lead()`, marketplace : identiques v1/v2

## Phases

- **Phase 1** : Cloud + auth + tables + enregistrement formulaires existants
- **Phase 2** : Inscription partenaire + dashboard admin + **webhook GHL partenaires** (tu me fournis l'URL avant qu'on lance la phase)
- **Phase 3** : Portail partenaire + marketplace + crédits + RPC
- **Phase 4** : Page recharge (placeholder Chariow) + polish + déclencheurs `low_credits`/`zero_credits` vers GHL

Valide cette v3 et je commence par la Phase 1.
