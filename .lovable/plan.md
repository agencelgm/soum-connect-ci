Détourer le personnage de l'image hero (fond transparent) et l'afficher comme dans la référence : silhouette debout, face au formulaire, à gauche du bloc orange.

Actions :
1. Détourer `src/assets/home/hero-accountant.png` via `imagegen--edit_image` avec `transparent_background=true` → produit un PNG transparent où seul l'homme reste (le bureau, mur blanc, classeurs et plante sont supprimés).
2. Sauvegarder le résultat sous `src/assets/home/hero-accountant-cutout.png` et mettre à jour l'import dans `src/routes/index.tsx`.
3. Ajuster le rendu dans la colonne gauche du hero (`lg:col-span-5`) :
   - image ancrée en bas (`object-bottom`)
   - hauteur pleine alignée sur le bloc formulaire
   - aucune carte/fond derrière, juste le personnage qui se détache sur le beige `#F5F1EA`
4. Aucun changement au formulaire orange ni au reste de la page.