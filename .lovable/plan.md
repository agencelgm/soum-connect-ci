# Rendre le badge « OFFRE EXCLUSIVE !! » lisible

## Problème
Le badge en haut de la carte (`/offre-logo` et `/offre-site-internet`) utilise `bg-accent/15` + `text-accent-foreground`, ce qui donne un texte clair sur fond clair — quasi invisible.

## Correction
**`src/components/upsell/OfferPage.tsx`** — remplacer les classes du `<span>` badge :
- Fond plein et contrasté : `bg-secondary` (orange de la marque) avec `text-white`.
- Garder l'icône `Sparkles` mais en `text-white`.
- Conserver la forme pill, padding et typo actuels.

Résultat : badge orange plein, texte blanc, parfaitement lisible sur fond blanc de la carte. Couvre les 4 pages (FR + EN, logo + site).

## Hors scope
Aucun autre changement de mise en page ou de contenu.
