## Problème

Sur mobile (390px), la page `/admin` provoque un défilement horizontal de toute la page (barre de scroll en bas visible sur la capture). Les causes :

1. La `TabsList` contient 4 onglets ("Partenaires", "Prospects", "+ Créer un partenaire", "Équipe") qui dépassent la largeur de l'écran.
2. Certains panneaux (tableaux de partenaires/prospects, cartes avec emails longs, IDs, etc.) contiennent du contenu large qui pousse la mise en page au-delà du viewport.
3. Le layout `_authenticated.tsx` utilise `max-w-6xl px-6` sans garde-fou contre l'overflow.

Résultat : tout le `<body>` devient scrollable horizontalement au lieu que seul l'élément trop large scrolle à l'intérieur de son conteneur.

## Correction (UI/CSS uniquement, aucune logique modifiée)

1. **`src/routes/_authenticated.tsx`** : ajouter `overflow-x-hidden` sur le conteneur racine et réduire le padding mobile (`px-4 sm:px-6`) pour éviter que le header (email + boutons) ne déborde.

2. **`src/routes/_authenticated.admin.tsx`** :
   - Envelopper la `TabsList` dans un wrapper `overflow-x-auto` avec `-mx-4 px-4` pour permettre le scroll horizontal des onglets uniquement, sans casser la page.
   - Ajouter `flex-nowrap` et `w-max` sur la `TabsList` pour qu'elle conserve ses onglets sur une seule ligne scrollable.
   - Ajouter `min-w-0` sur les conteneurs de panneaux pour empêcher le contenu enfant (emails, tableaux) de forcer un élargissement.
   - Sur les cartes/lignes de partenaires et prospects qui affichent des emails ou IDs longs : ajouter `break-words` / `truncate` selon le cas, et `overflow-x-auto` sur les éventuels tableaux.

3. **Vérification globale** : ajouter `overflow-x-hidden` sur le `<main>` dans `src/routes/__root.tsx` comme filet de sécurité pour éviter toute régression future (mobile uniquement n'est pas nécessaire — c'est sans effet sur desktop).

## Vérification

- Recharger `/admin` à 390px : plus de barre de scroll horizontale en bas de page.
- Les onglets restent atteignables via un scroll horizontal local à la barre d'onglets.
- Le contenu de chaque onglet s'enroule proprement, les tableaux deviennent scrollables individuellement si nécessaire.
- Aucun changement sur desktop.
