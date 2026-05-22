Constat actuel : le personnage est rendu dans une fenêtre de seulement `h-[320px] xl:h-[360px]` alors que la carte orange du formulaire fait facilement 700–800px de haut. Résultat : la colonne gauche paraît vide, le personnage semble petit et perdu.

Objectif : rendre le personnage visuellement proportionné à la carte formulaire, sans changer le cadrage (toujours coupé au torse contre la section suivante).

Modifications prévues dans `src/routes/index.tsx` (hero, lignes ~115–126) :

1. Étirer la colonne gauche pour qu'elle occupe toute la hauteur du hero
   - Le grid a déjà `lg:items-stretch` — bon.
   - Remplacer la fenêtre fixe `h-[320px] xl:h-[360px]` par une fenêtre qui suit la hauteur de la colonne : `h-full min-h-[520px] xl:min-h-[620px]`.
   - Garder `overflow-hidden` pour continuer à masquer les jambes/chaussures.

2. Agrandir l'image du personnage proportionnellement
   - Passer de `h-[680px] xl:h-[760px]` à `h-[1100px] xl:h-[1280px]` pour que la tête remonte près du haut de la colonne et que le torse reste calé en bas.
   - Conserver `absolute left-1/2 -translate-x-1/2 top-0` et `object-contain`.
   - Conserver le crop au torse : l'image étant beaucoup plus haute que la fenêtre, le bas (jambes/pieds) est coupé naturellement.

3. Affiner l'équilibre avec la carte
   - Réduire un peu le décalage négatif droite (`lg:-mr-6 xl:-mr-10` → `lg:-mr-2 xl:-mr-4`) pour laisser la carte respirer sans rapprocher trop le personnage.
   - Pas de changement sur la carte orange ni sur ses paddings.

4. Responsive
   - Toutes les classes ajoutées sont préfixées `lg:`/`xl:` ; le mobile reste inchangé (personnage masqué).

Validation après implémentation
   - Capture desktop 1536×864 pour vérifier : tête haute dans la colonne, torse aligné avec le bas du hero, aucune jambe visible, carte orange non touchée.
   - Capture 1280px pour vérifier qu'il n'y a pas de débordement horizontal.