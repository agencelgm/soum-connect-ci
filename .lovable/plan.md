Refaire le personnage pour qu'il pointe activement le formulaire avec un grand sourire, puis le rapprocher encore plus.

Actions :
1. Générer une nouvelle version détourée via `imagegen--edit_image` à partir de l'image existante : même homme, même costume bleu marine, mais bras droit tendu pointant vers la droite (vers le formulaire), grand sourire ouvert, fond transparent.
2. Sauvegarder sous `src/assets/home/hero-accountant-cutout.png` (écrasement).
3. Dans `src/routes/index.tsx`, augmenter le débordement vers le formulaire (`lg:-mr-16 xl:-mr-24`) pour qu'il soit collé au bloc orange.

Aucun changement au formulaire ni au reste de la page.