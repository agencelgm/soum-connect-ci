Je vais corriger l’interprétation : l’objectif n’est pas que les chaussures touchent la section suivante, mais que le personnage soit cadré/coupé de façon à ce que le bas visible soit au niveau du torse/buste contre la section suivante.

Plan :

1. Garder l’espace du formulaire
- Ne pas supprimer le padding inférieur du formulaire.
- Ne pas faire toucher la carte orange à la section Stats.
- Le formulaire reste visuellement séparé et respirant.

2. Repositionner uniquement l’image du personnage
- Transformer la colonne image en zone de cadrage avec `overflow-hidden`.
- Agrandir et descendre l’image dans cette zone pour que les jambes/chaussures sortent sous le hero et soient masquées.
- Le bord inférieur visible de l’image correspondra au torse/bas du buste, aligné avec le début de la section suivante.

3. Garder le comportement responsive actuel
- Desktop : personnage visible et cadré au torse contre la section suivante.
- Mobile/tablette : personnage toujours masqué, comme actuellement.

Détail technique prévu :
- Dans `src/routes/index.tsx`, modifier seulement les classes de la colonne image et de l’image `heroAccountant`.
- Remplacer l’approche `h-full ... -mb-6` qui force les chaussures au bas du hero.
- Utiliser un cadrage du type wrapper `relative overflow-hidden` + image plus grande et translatée vers le bas, afin que le point de contact avec la section suivante soit le torse.

Validation :
- Reprendre une capture desktop après modification.
- Vérifier visuellement que le torse touche la section suivante, que les chaussures ne sont plus le point d’alignement, et que le formulaire ne touche pas la section Stats.