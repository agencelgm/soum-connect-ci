## Objectif

Transformer la fin de parcours (business plan, financement, demande de soumissions) en tunnel de vente : offre site internet en promo, puis une sales page vidéo pour la formation, puis une page de confirmation avec le canal WhatsApp.

## 1. Suppression de l'offre logo

- Suppression des pages `/offre-logo` et `/en/logo-offer`.
- Les 3 formulaires (business plan, financement, demande de soumissions) redirigent désormais directement vers `/offre-site-internet` (`/en/website-offer` en anglais).
- Retrait des entrées logo du sitemap et de la table de correspondance FR/EN.
- Note : la question « voulez-vous un logo ? » du formulaire d'inscription **partenaire** (cabinets) on doit retirer toutes les questions en lien avec le logo. On ne fait plus de logo donc on ne pose plus la question : « Est-ce que vous avez besoin de logo ou pas ? » On enlève tout ça, que ce soit pour les partenaires que pour les prospectus.

## 2. Offre site internet à 70 000 FCFA

- Prix affiché : **165 000 FCFA barré → 70 000 FCFA**, badge « Promotion ».
- **Compte à rebours en direct** jusqu'au vendredi 17:00 (heure d'Abidjan), avec la date exacte affichée (« Offre valable jusqu'au vendredi 7 août à 17h00 »).
- Le calcul est automatique et hebdomadaire : dès que le vendredi 17:00 est passé, le compteur repart sur le vendredi suivant. Aucun renouvellement manuel nécessaire.
- Version anglaise alignée (mêmes prix, même minuterie).

## 3. Nouvelle sales page formation `/formation-clients`

Après l'étape « gestion marketing », le prospect arrive sur cette page (sans menu, sans footer, plein écran) :

- Titre très visible : **« Ne quittez pas cette page »** + sous-titre « Regardez cette vidéo pour savoir quoi faire maintenant ».
- La vidéo que vous venez d'envoyer (2 min 15), lecteur intégré, mise en avant.
- Deux boutons sous la vidéo :
  - **« Oui, je veux la formation — je veux savoir comment avoir des clients »** (bouton principal)
  - **« Non merci, je n'ai pas besoin de savoir comment avoir des clients »** (bouton secondaire, discret)
- Alors quand les gens choisissent « oui je veux la formation », envoie un événement « add to cart » à Facebook.
- Le bouton « Oui » ouvrira le lien de paiement Chariow. En attendant que vous me le donniez, il redirige vers la page de confirmation avec un message « nous vous envoyons le lien » — je le branche dès que vous me transmettez l'URL.

## 4. Page de confirmation finale

Les pages `/merci-demande-business-plan`, `/merci-demande-financement` et `/merci` sont refondues avec le même bloc :

- « D'accord, nous avons bien reçu votre demande. »
- Explication : notre équipe vous appellera pour **valider votre demande** avant que les cabinets comptables ne vous contactent. Bureau ouvert du **lundi au vendredi, de 9h00 à 17h00**.
- Un seul bouton WhatsApp : **« Rejoindre le canal WhatsApp gratuit »** → [https://whatsapp.com/channel/0029Va5QvIu6BIEdk2Gbcq0U](https://whatsapp.com/channel/0029Va5QvIu6BIEdk2Gbcq0U) (astuces et vidéos gratuites).
- Pour ceux qui ont refusé la formation : rappel discret « Vous avez changé d'avis ? Découvrir la formation ».
- Plus aucun autre lien WhatsApp de support sur ces pages.

## Détails techniques

- Vidéo uploadée sur le CDN Lovable via `lovable-assets` (pointeur `.asset.json`), pas de binaire dans le dépôt.
- Nouvelle route `src/routes/formation-clients.tsx` + ajout à la liste des pages immersives dans `__root.tsx`, en `noindex, nofollow`, hors sitemap.
- Réponse formation persistée via `/api/public/lead-upsell` (nouveau type d'offre `formation`) dans `raw_payload` du prospect.
- Le minuteur est calculé côté client à partir de l'heure courante (fuseau UTC = heure d'Abidjan), pas de valeur codée en dur.