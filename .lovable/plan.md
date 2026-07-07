## Deux ajustements demandés

### 1. Accès permanent à la vidéo tutoriel pour les partenaires

**Problème** : la page `/tutoriel-partenaire` n'est accessible que via la redirection forcée quand `tutorial_watched_at` est `null`. Dès qu'un partenaire quitte la page (ou si son statut change), il ne peut plus y revenir — donc s'il n'a pas terminé la vidéo, il n'a aucun moyen de la reprendre.

**Correctif** :
- Retirer la redirection forcée automatique. Le partenaire arrive directement dans son espace après inscription, mais on affiche un **bandeau rouge très visible** en haut de l'espace partenaire tant que `tutorial_watched_at` est `null` :
  > « ⚠️ Vidéo tutoriel obligatoire non terminée — sans visionnage complet, votre compte ne sera pas approuvé. » + bouton **« Regarder la vidéo »** qui mène à `/tutoriel-partenaire`.
- Ajouter un **lien permanent « Tutoriel »** dans le menu partenaire (header/AppShell), visible pour tous les partenaires (même ceux qui l'ont déjà vue, pour révision).
- La page `/tutoriel-partenaire` reste accessible en permanence via ce lien, avec la progression déjà sauvegardée (grâce à `tutorial_max_progress`) qui permet de reprendre où on s'est arrêté.
- Côté admin, la colonne « Vidéo vue » reste le critère de validation — rien ne change dans la logique d'approbation.

### 2. Filtre « Doublons uniquement » côté Prospects (déjà en place, à confirmer)

Le filtre a été ajouté lors de l'itération précédente dans `_authenticated.admin.tsx` (toggle **Doublons uniquement** + badge rouge sur chaque prospect flagué + compteur global). 

**Si le comportement actuel te convient**, cette partie est déjà livrée — pas de changement à faire.

**Si tu veux aller plus loin**, je peux ajouter :
- Un **filtre croisé partenaire ↔ prospect** : détecter qu'un prospect utilise le même email/téléphone qu'un partenaire déjà inscrit (utile pour repérer les faux prospects créés par des partenaires).
- Un **bouton « Rejeter »** en un clic directement sur les prospects flagués comme doublons.
- Un **regroupement visuel** : afficher tous les doublons d'un même email côte à côte (au lieu de simples badges).

Dis-moi lequel de ces trois tu veux, ou si le filtre actuel suffit.

### Fichiers concernés
- `src/routes/_authenticated.tsx` : remplacer la redirection forcée par un bandeau + lien permanent.
- `src/components/partner/PendingApprovalBanner.tsx` ou nouveau `TutorialReminderBanner.tsx` : bandeau « vidéo non terminée ».
- `src/components/layout/AppShell.tsx` : ajouter le lien « Tutoriel » dans la nav partenaire.
- `src/routes/_authenticated.admin.tsx` : uniquement si tu veux le croisement partenaire↔prospect ou l'action rapide.

Aucune migration DB nécessaire.