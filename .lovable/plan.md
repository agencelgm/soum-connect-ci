Ajouter une vue de comparaison avant/après du personnage du hero pour valider visuellement le retour à l'ancienne version avant de confirmer le revert.

## Objectif

Vous voulez revenir à une version antérieure de l'image `hero-accountant-cutout.png`, mais avant de confirmer, voir côte à côte l'image actuelle (qui pointe vers le formulaire) et l'ancienne version pour comparer.

## Approche proposée

Comme Lovable ne peut pas restaurer programmatiquement un ancien fichier binaire, le plan est :

1. Régénérer une "ancienne version candidate" du personnage (pose neutre face caméra, sans pointer du doigt, grand sourire) et l'enregistrer comme `hero-accountant-cutout-v1.png` — l'image actuelle (`hero-accountant-cutout.png`) reste intacte.
2. Créer une page de comparaison temporaire `/preview/hero-compare` (non liée dans la navigation, `noindex`) qui affiche :
   - À gauche : version actuelle (pointe le formulaire)
   - À droite : version candidate (neutre)
   - Sous chaque image, un bouton "Garder cette version"
3. Une fois votre choix fait, on remplace `hero-accountant-cutout.png` par la version retenue et on supprime la page de comparaison et le fichier non utilisé.

## Alternative recommandée

Si vous avez vraiment l'ancien fichier exact dans l'historique du chat, le plus fiable reste de cliquer sur le bouton revert (↪️) sous le message AI qui contenait la bonne version. Cela restaure le fichier au byte près, sans regénération approximative.

## Détails techniques

- Nouveau fichier : `src/assets/home/hero-accountant-cutout-v1.png` (généré via imagegen).
- Nouvelle route : `src/routes/preview.hero-compare.tsx`, avec `head()` en `noindex` et layout deux colonnes responsive.
- Aucune modification de `src/routes/index.tsx` tant que vous n'avez pas validé.