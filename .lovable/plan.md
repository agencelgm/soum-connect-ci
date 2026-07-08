## Objectif

Ajouter dans l'admin (`/admin`) des filtres pour identifier rapidement :
- Qui veut un **logo** (Oui / Non / Sans réponse)
- Qui veut un **site internet** (Oui / Non / Sans réponse)
- **Ancienneté** : nouveaux (≤ 7 j), récents (≤ 30 j), anciens (> 30 j)

Appliqué aux deux onglets : **Partenaires** et **Prospects**.

## Données déjà disponibles

- **Partenaires** : colonnes `wants_website` et `wants_logo` (booleans, nullable) — remplies à l'inscription.
- **Prospects** : réponses upsell stockées dans `raw_payload` sous les clés `upsell_logo` et `upsell_site` (valeurs `"oui"` / `"non"`) — remplies après soumission du lead via `/api/public/lead-upsell`.
- **Ancienneté** : `created_at` existe sur les deux tables.

Aucune migration DB nécessaire.

## Changements UI

Fichier unique : `src/routes/_authenticated.admin.tsx`.

### Panneau Partenaires
Ajouter à la barre de filtres existante (à côté de Ville / Service / Tier / Tutoriel) :
- **Select « Site internet »** : Tous · Oui · Non · Sans réponse
- **Select « Logo »** : Tous · Oui · Non · Sans réponse
- **Select « Ancienneté »** : Tous · Nouveaux (≤ 7 j) · Récents (≤ 30 j) · Anciens (> 30 j)

Logique : filtrage client-side dans le `useMemo` existant, basé sur `wants_website`, `wants_logo`, `created_at`.

### Panneau Prospects
Mêmes trois selects, avec la même sémantique. Lecture des valeurs upsell via `prospect.raw_payload?.upsell_logo` / `upsell_site` (comparaison à `"oui"` / `"non"`, sinon « sans réponse »).

Le filtre « période » actuel (7 j / 30 j) reste — le nouveau filtre « Ancienneté » est complémentaire (permet aussi d'isoler les **anciens** > 30 j, ce que la période actuelle ne permet pas).

### Bouton « Réinitialiser filtres »
Étendre le reset existant pour remettre à zéro les trois nouveaux selects.

### Compteur
Le compteur global affiché en haut de chaque panneau (« X partenaires », « Y prospects ») reflète déjà le résultat filtré — aucun changement nécessaire.

## Détails techniques

- Type des états : `"all" | "yes" | "no" | "unknown"` pour logo/site, `"all" | "new" | "recent" | "old"` pour ancienneté.
- Helper `matchUpsell(value, filter)` : `value` est `boolean | null` (partenaires) ou `"oui" | "non" | null` (prospects) — normaliser en amont.
- Helper `matchAge(created_at, filter)` : compare à `Date.now() - 7*86400_000` et `30*86400_000`.
- Les filtres se combinent en AND avec ceux existants (search, ville, service, doublons, etc.).

## Ce qui n'est pas inclus

- Pas d'export CSV filtré (peut être ajouté plus tard si besoin).
- Pas de nouvelle colonne DB, pas de migration.
- Pas de changement côté formulaires ou webhooks.
