Rapprocher le personnage du formulaire orange pour qu'il semble inciter le visiteur à le remplir.

Ajustements dans `src/routes/index.tsx` (colonne hero gauche uniquement) :
- Aligner l'image à droite (`justify-end`) au lieu du centre.
- Permettre un léger débordement vers la colonne du formulaire via `mr-[-2rem]` ou `-mr-12` pour coller au bloc orange.
- Réduire le `gap-8` de la grille hero à `lg:gap-4` pour resserrer l'ensemble.
- Garder la même image détourée, ancrée en bas (`object-bottom`).

Aucun changement au formulaire ni au reste de la page.