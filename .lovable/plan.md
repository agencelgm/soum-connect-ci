## Pourquoi ce message apparaît
Le message apparaît parce que les champs **Site internet souhaité ?** et **Logo professionnel souhaité ?** sont actuellement initialisés à `null`. Tant qu’on ne clique pas explicitement sur **Oui** ou **Non**, le formulaire bloque la création et affiche : “Répondez Oui ou Non…”.

## Plan
1. Modifier le formulaire **Nouveau partenaire** pour que :
   - **Site internet souhaité ?** soit sur **Non** par défaut.
   - **Logo professionnel souhaité ?** soit sur **Non** par défaut.
2. Supprimer/neutraliser le message bloquant lié uniquement à l’absence de choix Oui/Non, puisque le choix existera toujours par défaut.
3. Garder la possibilité de cliquer sur **Oui** si le partenaire est intéressé.
4. Vérifier que les données envoyées au backend contiennent bien :
   - `wants_website: false` par défaut
   - `wants_logo: false` par défaut
   - ou `true` si l’admin clique sur Oui.

## Résultat attendu
Tu ne verras plus cette erreur quand tu crées un partenaire sans toucher aux questions Site/Logo. Elles seront automatiquement enregistrées comme **Non**, sauf si tu sélectionnes **Oui**.