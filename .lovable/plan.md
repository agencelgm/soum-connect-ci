# Fiche prospect admin : un bouton Enregistrer par note et une mise en page plus claire

## Le problème
- Les notes ne sont enregistrées que par le bouton « Enregistrer » tout en haut de la fiche. Quand on écrit en bas, on ne le voit pas, et on perd ce qu'on a écrit en changeant de prospect.
- La fiche est une longue colonne de champs modifiables (contact, demande, notes), sans indication de ce qui a été modifié ni de ce qui reste à enregistrer.

## La solution

### 1. Un bouton Enregistrer pour chaque note
- **Note LGM** (visible par les partenaires) et **Note interne** ont chacune leur propre bouton **Enregistrer**, placé juste sous le champ.
- Le bouton n'est actif que si le texte a changé. Il indique ensuite « Enregistré ✓ » avec l'heure.
- Seule la note concernée est sauvegardée, sans toucher au reste de la fiche.
- Raccourci clavier : Ctrl/Cmd + Entrée enregistre la note en cours.

### 2. Rien ne se perd
- Une pastille « Modifications non enregistrées » apparaît à côté de chaque bloc modifié.
- Si on change de prospect ou qu'on quitte la page avec des modifications non enregistrées, une confirmation s'affiche.

### 3. Une fiche plus lisible
- **Lecture d'abord** : les blocs Contact et Demande s'affichent en lecture simple (libellé + valeur, avec téléphone et email cliquables). Un bouton **Modifier** sur chaque bloc ouvre les champs, avec ses propres boutons **Enregistrer / Annuler**.
- **Ordre logique** : Notes et Commentaires remontent juste sous l'en-tête (ce qu'on utilise le plus), puis Contact, puis Demande.
- **Barre d'actions fixe** : les actions principales (Publier, Rejeter) restent visibles en haut de la fiche quand on fait défiler.
- Le bloc « Publication » en double dans la colonne de droite est retiré, puisque le bouton existe déjà dans la barre d'actions.

## Détails techniques
- `src/routes/_authenticated.admin.tsx`, `ProspectQualificationPanel` : on conserve un état d'origine (`savedForm`) en plus de `form` pour détecter les modifications par champ ou par bloc.
- Nouvelle fonction `saveFields(keys[])`, qui appelle `updateProspect` avec le formulaire complet normalisé (aucun changement côté serveur), puis met à jour `savedForm` et l'heure du dernier enregistrement.
- Nouveaux composants `NoteField` (textarea + Enregistrer + Ctrl/Cmd+Entrée + état) et `EditableSection` (mode lecture/édition avec Enregistrer/Annuler).
- Garde-fous : une confirmation dans `setSelectedId` si des modifications ne sont pas enregistrées, et un `beforeunload` tant qu'il en reste.
- En-tête d'actions en `sticky top-0` avec un fond aux couleurs du thème.
