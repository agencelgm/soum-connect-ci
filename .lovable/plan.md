Je vais corriger l’affichage du formulaire “Nouveau partenaire” dans /admin pour que les modifications soient visibles sans ambiguïté.

Plan :
1. Vérifier que l’onglet “Créer un partenaire” est bien celui qui affiche le formulaire manuel, et pas une ancienne vue ou un autre formulaire.
2. Repositionner les champs obligatoires directement dans le formulaire, avec des libellés très visibles :
   - Rôle au sein de l’entreprise
   - Services
   - Zones d’intervention
   - Site internet souhaité ? Oui/Non, à partir de 165 000 FCFA
   - Logo souhaité ? Oui/Non, à partir de 50 000 FCFA
3. Renommer l’élément du menu en “Nouveau partenaire” si nécessaire, pour correspondre exactement à ce que vous cherchez dans l’interface.
4. Ajouter un encadré visuel clair “Champs obligatoires” pour éviter que ces questions passent inaperçues.
5. Garder la sauvegarde backend existante, car le code enregistre déjà `contact_role`, `wants_website`, `wants_logo`, `services` et `zones`.
6. Vérifier après modification que le formulaire rendu contient bien tous ces libellés visibles.