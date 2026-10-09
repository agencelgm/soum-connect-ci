# Attribution automatique des prospects + commentaires enregistrés

## 1. Attribution automatique, chacun son tour
- Dès qu'un prospect remplit un formulaire (devis, contact, business plan, financement), il est attribué automatiquement à un commercial actif (non suspendu).
- On attribue chacun son tour : le prospect va au commercial qui a reçu un prospect le moins récemment.
- S'il n'y a aucun commercial actif, le prospect reste « non attribué » et l'admin peut l'attribuer à la main.
- Dans la fiche prospect de l'admin, un menu permet de **réattribuer** le prospect à un autre commercial.

## 2. Visibilité
- Un commercial ne voit que ses propres prospects. Les autres commerciaux ne les voient pas.
- Les admins et agents voient tout, avec le nom du commercial sur chaque prospect et un filtre par commercial.

## 3. Espace commercial simplifié
- Le bouton « Débloquer », la file masquée et le délai de 5 minutes sont supprimés.
- Le commercial voit directement ses prospects attribués, coordonnées comprises, triés par statut (« À traiter » en premier).
- La décision Approuver / Refuser reste disponible et demande toujours une note d'au moins 10 mots.

## 4. Commentaires enregistrés (espace commercial et admin)
- Nouveau bloc **Commentaires** sur chaque prospect, avec un vrai bouton **Enregistrer**.
- Chaque commentaire est daté et signé (nom de l'auteur). Rien ne se perd, même sans prendre de décision.
- Ce sont les mêmes commentaires des deux côtés : ce que note le commercial, l'admin le voit, et l'inverse.
- Je vérifierai aussi que les champs de notes existants de la fiche admin (« Note LGM partenaires », « Note interne ») sont bien sauvegardés par « Enregistrer », et je corrigerai s'ils ne le sont pas.

## Détails techniques
- `prospect_assignments` : on ajoute `assigned_by` (null = attribution automatique) et `assigned_at`. Le déblocage n'existe plus et les RPC `commercial_unlock_prospect` ne sont plus appelées.
- Nouvelle fonction SECURITY DEFINER `auto_assign_prospect(_prospect_id)`, avec verrou consultatif : choisit le commercial actif dont le `max(assigned_at)` est le plus ancien (sans attribution = prioritaire). Elle est appelée après l'enregistrement dans `recordProspect` (`prospects.server.ts`), sans bloquer l'envoi du formulaire. Le statut suspendu est vérifié via l'API d'administration de l'authentification.
- Une action ponctuelle attribue chacun son tour les prospects `pending_qualification` déjà présents mais non attribués.
- Server function `reassignProspect` (admin/agent).
- Nouvelle table `prospect_comments` (id, prospect_id, author_id, author_name, body, created_at) avec GRANT + RLS : lecture et écriture pour admin/agent, ou pour le commercial à qui le prospect est attribué (vérifié dans les server functions). Fonctions `listProspectComments` et `addProspectComment` (texte non vide, 5 000 caractères max).
- Composant partagé `ProspectComments` utilisé dans `_authenticated.commercial.tsx` et dans la fiche prospect admin, avec le panneau commercial affiché même si le prospect n'est pas publié.
- `getCommercialDashboard` renvoie uniquement les attributions du commercial connecté. On ajoute un test de la règle de rotation (le commercial servi le moins récemment est choisi).
