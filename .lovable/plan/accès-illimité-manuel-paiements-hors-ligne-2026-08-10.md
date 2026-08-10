# Accès Illimité manuel (paiements hors ligne)

## Objectif
Pouvoir accorder, prolonger ou retirer l'accès Illimité à un cabinet directement depuis l'espace admin, comme on le fait déjà pour le statut Premium — utile quand un partenaire paie hors ligne (cash, virement, mobile money).

## Ce qui sera ajouté

Sur chaque fiche partenaire (liste Partenaires), à côté du bouton « Passer Premium » :

- Un bouton **« Gérer l'illimité »** qui ouvre une petite fenêtre avec :
  - **Date de paiement** (par défaut aujourd'hui) — c'est le point de départ de l'abonnement.
  - **Durée** : 30 jours par défaut, modifiable (30 / 60 / 90 ou nombre libre de jours).
  - **Empiler sur l'accès en cours** : coché par défaut si le cabinet a déjà un accès actif — la durée s'ajoute alors à la date de fin actuelle (même règle que les achats Chariow). Décoché = l'accès repart de la date de paiement.
  - Aperçu de la **date de renouvellement** calculée avant validation.
  - Un champ **note** (ex. « Paiement espèces 100 000 FCFA — reçu n°12 »).
  - Un bouton **« Retirer l'illimité »** pour annuler immédiatement l'accès.

- Le badge Illimité et la date de renouvellement déjà affichés dans la liste se mettent à jour aussitôt.
- L'opération est tracée dans l'historique de crédits du partenaire (type `chariow_unlimited`, montant 0, note indiquant « octroi manuel par <staff> ») donc visible dans l'historique côté partenaire et côté admin.

## Règles

- Réservé aux membres du staff (admin/agent), comme les autres actions partenaires.
- Durée entre 1 et 365 jours.
- Le calcul d'empilement réutilise la logique existante `stackUnlimitedUntil` pour rester cohérent avec les achats en ligne.
- Aucune modification du statut Premium : les deux restent indépendants (un cabinet peut être Illimité sans être Premium).

## Détails techniques

- `src/lib/partners.functions.ts` : nouvelle server fn `setPartnerUnlimited` (`partner_id`, `paid_at`, `days`, `stack`, `note`) et `revokePartnerUnlimited`, protégées par `assertStaff`, écrivant `unlimited_until` sur `partners` + une ligne `credit_transactions`.
- `src/lib/credit-packs.ts` : réutilisation de `stackUnlimitedUntil` (aucun changement).
- `src/routes/_authenticated.admin.tsx` : nouveau composant `UnlimitedDialog` dans la fiche partenaire (bouton + formulaire date/durée/note + aperçu), invalidation de la liste après action.
