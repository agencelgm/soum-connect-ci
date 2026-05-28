Objectif : rendre la page Recharger plus centrée, plus dense visuellement, et nettement plus belle — sans toucher au comportement Chariow qui fonctionne.

1. Centrage vertical et horizontal
   - Faire occuper toute la hauteur de la zone de contenu par la page Recharger.
   - Centrer verticalement le bloc (titre + cartes) au milieu de l'écran.
   - Garder une largeur max confortable (max-w 5xl) centrée horizontalement.

2. En-tête plus impactant
   - Titre plus grand, mieux espacé, avec un sous-titre clair.
   - Petit badge décoratif au-dessus du titre ("Paiement sécurisé · Crédits LGM").
   - Solde actuel transformé en petite "pill" élégante alignée avec le titre, plus discrète.

3. Cartes de packs repensées
   - Cartes plus hautes, padding généreux, coins arrondis (rounded-2xl), ombre douce, bordure fine.
   - La carte "25 crédits" mise en avant : légèrement plus grande (scale up), bordure dorée, glow subtil, badge "Le plus choisi" repositionné proprement.
   - Hiérarchie typographique : chiffre énorme (text-6xl), label "crédits", prix bien lisible, micro-bénéfices listés avec checkmarks (paiement sécurisé, livraison instantanée des crédits, sans abonnement).
   - Bouton Chariow conservé tel quel, mais aligné en bas de carte avec espacement régulier.

4. Ambiance visuelle
   - Fond légèrement dégradé (gradient subtil from-background to-muted/30) sur toute la zone.
   - Petits éléments décoratifs : icône Sparkles ou Zap discrète à côté du chiffre.
   - Note de réassurance en bas : "Paiement traité par Chariow · Aucune donnée bancaire stockée".

5. Responsive
   - Sur mobile : cartes empilées, padding réduit, centrage conservé.
   - Sur desktop : grille 3 colonnes centrée, carte du milieu mise en avant.

6. Vérification
   - Capture d'écran de la preview /recharger après modification pour valider le rendu centré et l'esthétique.

Fichier touché : `src/routes/_authenticated.recharger.tsx`. AppShell et logique Chariow inchangés.