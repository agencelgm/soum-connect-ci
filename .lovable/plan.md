## Diagnostic

Vérifié en base : Koffi Gabin a été **soumis le 11/07** (`prospects.created_at`) mais **publié le 17/07** (`lead_publications.published_at`, quand l'admin l'a approuvé). Aujourd'hui c'est le 20/07 — le badge « il y a 2 j » calcule à partir de `published_at` (17/07 ≈ 3 j), pas de la date à laquelle le prospect a réellement rempli le formulaire.

Deux choses sont donc à corriger dans `src/routes/_authenticated.marketplace.tsx` et `src/lib/marketplace.functions.ts` :

1. La date affichée ("Publié il y a X j") vient de `published_at` alors que ce qui compte pour toi et les partenaires, c'est **quand le prospect a fait sa demande**.
2. Le tri par défaut suit `published_at` — un lead soumis le 11/07 mais approuvé aujourd'hui se retrouverait en haut, ce qui masque son ancienneté réelle.

## Plan

1. **Exposer la date de soumission côté serveur** — `src/lib/marketplace.functions.ts`
   - Récupérer `prospects.created_at` en même temps que `raw_payload.delai` (déjà fait dans la même requête).
   - Ajouter `submitted_at: <prospect.created_at>` à chaque lead renvoyé.

2. **Utiliser `submitted_at` partout dans l'UI** — `src/routes/_authenticated.marketplace.tsx`
   - Badge : "Reçu il y a X h / j" basé sur `submitted_at` (formulation plus juste que "Publié").
   - Badge "Nouveau" (24h) : basé sur `submitted_at`.
   - Filtre "Publiés depuis 24h / 7j / 30j" : renommer en **"Reçus depuis"** et le calculer sur `submitted_at`.
   - Tri par défaut : plus récents (par `submitted_at` desc) en haut.

3. **Ajouter un sélecteur de tri visible**
   - Nouveau `<Select>` "Trier par" à côté des filtres, avec 3 options :
     - Plus récents d'abord (défaut)
     - Plus anciens d'abord
     - Bientôt complets (leads avec le plus de déblocages, utile pour l'urgence)
   - Le tri s'applique après les filtres, avant la séparation "disponibles / complets".

## Détails techniques

- Le serveur charge déjà `prospects` pour lire `raw_payload.delai` — on ajoute juste `created_at` au `select` et à la Map.
- Le tri "plus récents" remplace l'ordre naturel renvoyé par le serveur (qui reste `published_at desc` comme filet de sécurité pour les cas où `submitted_at` serait manquant).
- Aucun changement de schéma, aucune migration.
- Aucune modification du back-office admin dans ce lot.

## Résultat attendu

- Koffi Gabin affichera "Reçu il y a 9 j" (11/07 → 20/07), pas "il y a 2 j".
- Par défaut, les leads les plus récemment soumis par les prospects sont en haut.
- Tu peux basculer sur "plus anciens d'abord" pour repérer les leads qui traînent, ou sur "bientôt complets" pour les urgences.
