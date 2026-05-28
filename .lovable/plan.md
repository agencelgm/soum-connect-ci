Je vais corriger ça précisément.

Constat confirmé : le script Chariow se charge bien, mais il ne détecte aucun widget parce que le code actuel rend des div avec des IDs uniques comme `chariow-widget-prd_kui1kil8`, alors que Chariow cherche strictement des éléments avec l’ID exact `chariow-widget`.

Plan :

1. Remettre le markup Chariow attendu
   - Remplacer l’ID dynamique par `id="chariow-widget"` dans chaque pack.
   - Garder les bons `data-product-id` :
     - 10 crédits : `prd_kui1kil8`
     - 25 crédits : `prd_ak61x0fl`
     - 60 crédits : `prd_mm3xnkwg`

2. Forcer l’initialisation côté React
   - Charger le CSS Chariow une seule fois.
   - Charger le script Chariow si nécessaire.
   - Appeler `window.Chariow.initializeWidget()` après le rendu des widgets, au lieu de compter uniquement sur l’auto-scan initial.

3. Éviter les cartes sans bouton
   - Ajouter un bouton de secours visible “Recharger X crédits” si le widget externe ne s’injecte pas après quelques secondes.
   - Le bouton de secours ne remplacera pas le paiement, il indiquera seulement que le module de paiement est en chargement ou doit être réessayé.

4. Vérifier dans la preview
   - Ouvrir `/recharger`.
   - Confirmer qu’un bouton Chariow apparaît dans chaque carte de crédits.