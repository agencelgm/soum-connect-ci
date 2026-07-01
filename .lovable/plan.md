Plan de correction :

1. Corriger l’affichage du formulaire admin
   - Vérifier que l’onglet “Nouveau partenaire / Créer un partenaire” affiche bien les champs ajoutés :
     - Rôle du contact
     - Site internet : Oui / Non
     - Logo : Oui / Non
   - Rendre ces champs plus visibles et placés avant les champs optionnels pour éviter qu’ils soient manqués.

2. Corriger la création côté backend
   - La validation demande déjà `contact_role`, `wants_website` et `wants_logo`, mais l’insertion en base ne les enregistre pas encore dans `createPartnerManually`.
   - Ajouter ces 3 champs dans l’insertion du partenaire créé manuellement.

3. Mettre à jour le texte obsolète
   - Remplacer “La marketplace ouvre 6 places” par “5 places”.

4. Vérifier le résultat
   - Confirmer que le formulaire visible contient les nouveaux champs.
   - Confirmer que la création manuelle envoie et sauvegarde ces réponses.