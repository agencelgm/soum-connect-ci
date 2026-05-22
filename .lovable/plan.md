## Objectif
Sur mobile (≤ 640px), plusieurs sections de la home s'empilent verticalement avec de gros icônes circulaires, ce qui donne une impression de blocs « superposés » et oblige à beaucoup scroller. Objectif : compacter et passer en disposition horizontale là où c'est pertinent, sans casser le rendu desktop.

## Sections à corriger (`src/routes/index.tsx`)

### 1. Stats bar « 150+ Cabinets partenaires / 50 000+ / Côte d'Ivoire »
Aujourd'hui : `grid-cols-1 sm:grid-cols-3` + icônes 56px + texte 24px → 3 lignes très hautes sur mobile.

Cible :
- Passer en `grid-cols-3` dès mobile (3 colonnes compactes côte-à-côte).
- Icône réduite sur mobile : `h-10 w-10` (au lieu de `h-14 w-14`), `h-14 w-14` sur md+.
- Layout vertical à l'intérieur de chaque stat sur mobile (icône au-dessus, valeur dessous, libellé en dessous) → `flex-col items-center text-center`, puis `sm:flex-row sm:items-center sm:text-left` sur tablette+.
- Valeur : `text-lg` mobile / `text-2xl` md+. Libellé : `text-xs` mobile / `text-sm` md+.
- Corriger la 3ᵉ stat dont la valeur/libellé se lisent à l'envers ("Côte d'Ivoire" comme chiffre, "Service partout en" comme libellé) : remplacer par `{ value: "100%", label: "Couverture nationale" }` (FR) et `{ value: "100%", label: "Nationwide coverage" }` (EN), dans `src/lib/translations.ts`.
- Réduire le padding section : `py-8` → `py-6 md:py-8`.

### 2. Features row (3 phrases avec icônes)
Aujourd'hui : `md:grid-cols-3`, icônes 64px, blocs très hauts sur mobile.

Cible :
- Conserver l'empilement vertical (les phrases sont trop longues pour 3 colonnes mobile), mais réduire le bloc :
- Icône : `h-12 w-12` mobile / `h-16 w-16` md+.
- Layout : `flex-row items-start text-left gap-4` sur mobile (icône à gauche, texte à droite) / `md:flex-col md:items-center md:text-center` sur md+.
- Section padding : `section` → `py-8 md:section`.

### 3. Highlights (3 cartes avec image hero pleine largeur)
Aujourd'hui : chaque carte a une image hero ~200px de haut sur mobile, accentuant l'effet « blocs successifs ».

Cible (révision légère) :
- Réduire la hauteur image sur mobile : `aspect-[16/10]` au lieu d'aspect carré/4:3.
- Espacement vertical inter-cartes : `gap-6` → `gap-4 md:gap-6`.
- Titre carte : `text-base` mobile / `text-lg` md+.

### 4. Mobile CTA bar collante
Le bouton orange « Obtenir mes soumissions » visible en bas de chaque capture chevauche parfois le contenu (le footer notamment). Ajouter un padding-bottom conditionnel au `<main>` (ou à `body`) pour réserver l'espace : `pb-20 sm:pb-0` au niveau du wrapper de la page d'accueil.

### 5. Footer mobile
Les sections « Nos Services / Liens utiles / Contact » s'empilent en 1 colonne avec beaucoup d'espace. Garder 1 colonne (la lecture reste claire) mais :
- Réduire le `gap-y` global du footer à `gap-y-8` sur mobile (au lieu de gap-y-12 si présent).
- Aucune autre modification de contenu.

## Hors scope
- Pas de changement de typo, palette ou tokens design.
- Pas de retrait/ajout de section.
- Pas de modification desktop autre que ce qui découle naturellement des classes responsives ajoutées (le rendu ≥ md doit rester identique au pixel près).

## Validation
Après implémentation : capture mobile (390×844) du haut → milieu de la home + capture desktop (1280×800) pour confirmer la non-régression desktop.
