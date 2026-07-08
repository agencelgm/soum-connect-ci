## Diagnostic

L'onglet Prospects affiche `ProspectQualificationPanel` (ligne 1404), pas `ProspectsPanel` (ligne 930). Les filtres avaient été ajoutés dans `ProspectsPanel` — qui n'est jamais rendu. C'est pour ça que rien n'apparaît côté prospects.

## Correctif

Enrichir `ProspectQualificationPanel` dans `src/routes/_authenticated.admin.tsx` — sans toucher au reste (formulaire de qualification, publication, rejet, notes).

### Ajouts dans la sidebar gauche (au-dessus de la liste)

- **Barre de recherche** : nom, email, téléphone, entreprise, ville, service (matching insensible casse/accents via `normalizeText` de `src/lib/duplicates.ts`).
- **Select « Site internet »** : Tous · Oui · Non · Sans réponse (lit `raw_payload.upsell_site`).
- **Select « Logo »** : Tous · Oui · Non · Sans réponse (lit `raw_payload.upsell_logo`).
- **Select « Ancienneté »** : Tous · Nouveaux (≤7 j) · Récents (≤30 j) · Anciens (>30 j) (basé sur `created_at`).
- **Checkbox « Doublons uniquement »** : utilise `computeDuplicates` sur `email`/`phone` de **tous** les prospects (avant filtre statut) — un prospect qualifié + un nouveau prospect du même email ressortent tous deux.
- **Badge doublon** dans chaque carte de la liste : petit tag rouge « Doublon email » / « Doublon tél » à côté du nom quand détecté, cliquable en tooltip qui affiche combien d'autres correspondances existent.
- **Bouton « Réinitialiser »** qui remet à zéro recherche + les 4 selects/checkbox.

### Compteur

Sous les filtres, afficher `X prospect(s) affiché(s) (sur Y)` — reflète le filtrage combiné.

### Logique

Filtrage AND, tout côté client dans un `useMemo` :
1. filtre statut actuel (À qualifier / Publiés / Rejetés) — inchangé, reste en boutons segmentés en haut ;
2. recherche texte ;
3. upsell site ;
4. upsell logo ;
5. ancienneté ;
6. doublons uniquement.

Les compteurs des 3 boutons statut (`À qualifier`, `Publiés`, `Rejetés`) continuent de refléter le **total** par statut (non filtré), pour ne pas cacher qu'il reste des prospects ailleurs.

### Nettoyage

Supprimer la fonction `ProspectsPanel` inutilisée (ligne 930, ~285 lignes de code mort) pour éviter la confusion future.

## Détails techniques

- Réutilise `matchBoolFilter`, `matchAgeFilter`, `UpsellSelect`, `AgeSelect` déjà définis (lignes 12-83).
- Réutilise `computeDuplicates`, `normalizeText` de `src/lib/duplicates.ts`.
- Types : `BoolFilter = "all" | "yes" | "no" | "unknown"`, `AgeFilter = "all" | "new" | "recent" | "old"`.
- Aucune migration DB, aucun changement webhook/formulaire.
- Aucun changement dans `PartnersPanel`.

## Hors périmètre

- Pas d'export CSV filtré.
- Pas de fusion automatique des doublons — juste flagage visuel.
- Pas de modification du formulaire de qualification à droite.
