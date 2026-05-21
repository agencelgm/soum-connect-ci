# Alignement de la structure Guides sur la maquette

## Constat

La page `/guides/$slug` (composant `ArticleLayout`) a déjà la bonne logique : hero vert avec titre à gauche + `LeadFormCard` à droite, puis image, puis corps. Mais quelques détails diffèrent de la maquette uploadée.

## Différences à corriger

1. **Fil d'Ariane** : actuellement DANS le hero vert (texte blanc). Sur la maquette, il est SOUS le hero, sur fond blanc, centré sous la largeur du contenu.
2. **Hero épuré** : retirer les badges de catégories et la durée de lecture du hero vert — la maquette ne montre que le titre (pas d'excerpt visible non plus, mais on peut le garder discret car utile SEO/lecture).
3. **Image héro** : actuellement chevauche le hero (`-mt-10`). Sur la maquette elle est nettement séparée, centrée, avec marge au-dessus et au-dessous. À recadrer en simple bloc centré sans overlap.
4. **Largeur du corps** : la maquette montre un corps assez étroit et centré (~max-w-2xl) avec texte justifié/aligné gauche. Notre `max-w-3xl` actuel est OK, à confirmer.
5. **Tableau** : header vert foncé, lignes alternées très claires — déjà conforme dans `ArticleTable`, à vérifier visuellement.
6. **Callout orange** (style "petit encadré orange clair" visible sur la maquette) : notre variante `tip` est verte (`secondary`). Ajouter ou ajuster pour matcher l'orange chaud de la maquette → utiliser la variante `warning` (ambre) ou créer une variante `highlight` orange douce alignée sur `--secondary` si secondary est orange dans le thème.

## Changements de fichiers

### `src/components/guides/ArticleLayout.tsx`
- Retirer le fil d'Ariane et les badges du hero vert.
- Conserver titre + excerpt + LeadFormCard à droite uniquement.
- Ajouter une bande blanche sous le hero contenant le fil d'Ariane (aligné container).
- Retirer `-mt-6 md:-mt-10` sur l'image et la placer dans sa propre section avec `py-8 md:py-12`.
- Garder le corps article en `max-w-3xl mx-auto`.

### `src/components/guides/article-blocks.tsx`
- Vérifier la couleur de `ArticleCallout variant="tip"` : si secondary n'est pas orange, ajouter une variante `highlight` qui utilise un fond orange clair + bordure orange (tokens du design system, pas de hex direct).
- Garder `info`, `warning`, `tip` existants pour compatibilité avec le contenu déjà rédigé.

### `src/content/guides/creer-sarl-cepici.tsx`
- Aucun changement de contenu nécessaire ; éventuellement passer le callout final en `highlight` si la nouvelle variante est ajoutée.

## Hors scope

- Aucune modification du formulaire `LeadFormCard`.
- Aucune modification des routes, du SEO ou de la data des guides.
- Aucun nouveau contenu d'article rédigé dans ce lot (on aligne d'abord la structure).

## Validation après implémentation

Rafraîchir `/guides/creer-sarl-cepici` et comparer visuellement avec la maquette : hero vert épuré + form, fil d'Ariane blanc, image centrée séparée, corps texte + tableau + callouts.
