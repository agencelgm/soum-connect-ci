## Objectif
Ajouter un bouton "Retour aux articles" bien visible en haut de la page lorsqu'on lit un article de blog, car actuellement l'utilisateur doit passer par le menu hamburger.

## Implémentation
1. Modifier `src/components/guides/ArticleLayout.tsx` pour ajouter un `<Link>` avec une flèche gauche (`ArrowLeft` de lucide-react) pointant vers `/guides`, positionné juste au-dessus du fil d'Ariane sur fond blanc.
2. Le bouton doit être visible, cliquable et bien intégré visuellement (style cohérent avec le design system existant).

## Aperçu du rendu
- Un lien "← Retour aux articles" apparaîtra en haut de chaque article rédigé, avant le fil d'Ariane.
- Tous les articles utilisant `ArticleLayout` en bénéficieront automatiquement.