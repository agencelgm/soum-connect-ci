Je vois pourquoi vous dites que ce n’est toujours pas visible : le code contient les nouveaux champs, mais votre capture montre encore l’ancien bloc directement avec “Nom du cabinet”, donc le preview affiché ne rend pas la bonne version du formulaire.

Plan proposé :

1. Remplacer le formulaire “Créer un partenaire” par une version restructurée où les champs obligatoires apparaissent tout en haut, impossible à manquer :
   - Rôle au sein de l’entreprise
   - Site internet souhaité ? Oui / Non, avec “À partir de 165 000 FCFA”
   - Logo professionnel souhaité ? Oui / Non, avec “À partir de 50 000 FCFA”
   - Services obligatoires
   - Zones d’intervention obligatoires

2. Ajouter un titre très visible dans le formulaire :
   - “Champs obligatoires avant création”
   - avec un encadré coloré et une bordure forte.

3. Renommer clairement les anciens champs pour éviter la confusion :
   - “Site web existant” restera optionnel
   - les questions “Site internet souhaité” et “Logo souhaité” seront séparées et placées en haut.

4. Ajouter une vérification visuelle côté formulaire : si on clique sur “Créer le partenaire” sans répondre à Site/Logo, l’encadré obligatoire devient rouge et affiche le message d’erreur.

5. Après modification, je vérifierai dans le preview que le texte exact “Rôle au sein de l’entreprise”, “Site internet souhaité”, “Logo professionnel souhaité”, “Services obligatoires” et “Zones d’intervention obligatoires” est bien présent sur la page /admin?tab=create.