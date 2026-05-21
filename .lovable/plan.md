
# Optimisation responsive du layout d'article (/guides/$slug)

## Objectif
Aligner `ArticleLayout` sur la maquette : hero plus aéré en desktop, contenu mieux calibré en mobile, image et corps cohérents.

## Changements ciblés — `src/components/guides/ArticleLayout.tsx`

### 1. Hero (section verte)
- Padding vertical : `py-10 md:py-16` → `py-12 md:py-20 lg:py-24` (plus de respiration desktop).
- Grille : `lg:grid-cols-[1fr_420px] lg:gap-12` → `lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-8 lg:gap-16`.
- Titre : `text-3xl md:text-5xl` → `text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem]` avec `tracking-tight`.
- Excerpt : `mt-4 text-base md:text-lg` → `mt-5 text-base md:text-lg lg:text-xl` + `leading-relaxed`.
- `LeadFormCard` : retirer `lg:sticky lg:top-24` (provoque overlap sur écrans intermédiaires), garder simple wrapper.

### 2. Fil d'Ariane
- `pt-6` → `pt-5 md:pt-6 pb-2`.
- Alignement : retirer `justify-center` (la maquette l'a aligné à gauche dans la largeur du contenu) → `justify-start`.
- Wrap dans `max-w-3xl mx-auto` pour cadrer avec image + corps.

### 3. Image hero
- Wrapper : `pt-8 md:pt-10` → `pt-6 md:pt-8`.
- Image : `max-w-3xl` reste, ajouter `rounded-lg md:rounded-xl` (mobile plus doux), `aspect-[16/10]` → `aspect-[16/9] md:aspect-[16/10]` (mieux en mobile).

### 4. Corps article
- Section : `py-10 md:py-14` → `py-8 md:py-12 lg:py-16`.
- `<article>` : `max-w-2xl mx-auto` → `max-w-2xl lg:max-w-3xl mx-auto` pour un peu plus de confort de lecture en grand écran tout en restant étroit en mobile/tablette.

### 5. Container
- Confirmer que `.container-app` utilise déjà `px-4 md:px-8` (oui dans `styles.css`). Pas de changement.

## Hors scope
- `LeadFormCard`, `article-blocks.tsx`, contenu des articles, SEO, routes.

## Validation
- Preview mobile (375px), tablette (768px), desktop (1280px+).
- Vérifier : titre lisible sans débordement, formulaire ne chevauche jamais le titre, image proportionnée, marges latérales cohérentes entre hero / breadcrumb / image / corps.
