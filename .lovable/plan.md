**Objectif** : Rendre l'ensemble de la carte article cliquable sur la page `/guides`, pas seulement le lien « Lire la suite ».

**Problème actuel** : Le composant `ArticleCard` dans `src/routes/guides.tsx` est un `<article>` statique. Seul le petit lien « Lire la suite » en bas de chaque carte déclenche la navigation. Les utilisateurs s'attendent à pouvoir cliquer n'importe où sur la carte (titre, image, résumé) pour ouvrir l'article.

**Solution** : Transformer chaque carte en un élément de navigation global.

**Modifications prévues** :

1. **`src/routes/guides.tsx`** — Modifier le composant `ArticleCard` :
   - Remplacer l'élément `<article>` racine par un `<Link>` de TanStack Router pointant vers `/guides/$slug`.
   - Conserver tous les styles Tailwind existants (hover, bordures, ombres) sur le lien.
   - Transformer le bouton « Lire la suite » interne en un simple `<span>` (car un lien ne peut pas en contenir un autre).
   - Conserver l'ordre visuel : image, badges, titre, extrait, métadonnées de lecture.
   - Ajouter un effet `group-hover` sur le titre et le texte « Lire la suite » pour garder le feedback visuel au survol de la carte entière.
   - Pas de changement de design — même apparence, seul le comportement au clic change.

**Fichier impacté** : `src/routes/guides.tsx` uniquement.

**Risque** : Néant — modification front-end pure, aucun impact sur la logique métier ou le backend.