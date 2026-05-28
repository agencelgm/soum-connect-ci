## Changements

### 1. Bonus d'inscription : 30 crédits au lieu de 10
Dans `src/lib/partners.functions.ts` :
- Ligne 176 (approbation d'un partenaire) : `grantCredits(partner, 10, ...)` → `30`. Mettre à jour le label `"Bonus d'approbation"` (montant inchangé sinon).
- Ligne 328 (création manuelle par un admin) : `grantCredits(partner, 10, ...)` → `30` pour rester cohérent.
- Mettre à jour le texte du bouton dans `src/routes/_authenticated.admin.tsx` : `"Approuver (+10 crédits)"` → `"Approuver (+30 crédits)"`.
- Vérifier qu'aucun autre endroit de l'UI ne mentionne encore "10 crédits" comme bonus d'inscription (page d'inscription partenaire, emails de confirmation, etc.) et corriger si trouvé.

### 2. Tarification : 1 crédit = 1 000 FCFA
Dans `src/routes/_authenticated.recharger.tsx`, remplacer les 3 packs par des prix strictement proportionnels :
- 10 crédits → **10 000 FCFA**
- 25 crédits → **25 000 FCFA**
- 60 crédits → **60 000 FCFA**

Aucune réduction sur les gros packs (sinon ce n'est plus 1 crédit = 1 000 FCFA). Si tu veux conserver un effet "pack populaire", garder uniquement le marquage visuel sans modifier le prix.

## Hors périmètre
- Pas de migration base de données (le solde est calculé via `grantCredits`, pas via un défaut SQL).
- Aucun changement sur le mécanisme de paiement ou la marketplace.
