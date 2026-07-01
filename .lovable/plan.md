## Vérification

Le formulaire **Nouveau partenaire** (`/admin` → onglet Créer) contient déjà tous les champs obligatoires :

| Champ | Statut | Ligne |
|---|---|---|
| Rôle du contact * | ✅ requis | 1361 |
| Ville * | ✅ requis | 1395 |
| Site internet souhaité ? (Oui/Non) | ✅ requis (validation submit) | 1400 |
| Logo souhaité ? (Oui/Non) | ✅ requis (validation submit) | 1405 |
| Services * | ✅ requis | 1422 |
| Zones * | ✅ requis | 1426 |
| Site web | optionnel (normal) | 1413 |

## Améliorations proposées

1. **Rendre visuellement clair que les Oui/Non sont obligatoires** : ajouter `*` sur les labels "Site internet souhaité ?" et "Logo souhaité ?", et un fin liseré rouge autour du bloc quand aucune réponse n'est encore donnée après tentative de soumission.
2. **Feedback d'erreur inline** : quand l'admin clique "Créer" sans avoir répondu Oui/Non, on affiche déjà un toast — mais on va aussi surligner le bloc concerné pour qu'il soit immédiat à repérer.
3. **Aucun changement backend** — la sauvegarde de `contact_role`, `wants_website`, `wants_logo` est déjà en place dans `createPartnerManually`.

## Fichier modifié

- `src/routes/_authenticated.admin.tsx` — ajout du `*` sur les 2 labels Yes/No et d'un état `attemptedSubmit` pour appliquer un `ring-destructive` sur le bloc si non répondu.

Rien d'autre à toucher.