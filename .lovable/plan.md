# Supprimer le lien « Passer »

## Objectif
Forcer les visiteurs à choisir Oui ou Non sur les pages d'upsell — plus de raccourci pour sauter l'étape.

## Changement
**`src/components/upsell/OfferPage.tsx`** — supprimer le bloc `<p>…<Link>Passer</Link>…</p>` situé sous la carte. Retirer aussi les imports devenus inutilisés (`Link`).

Cela couvre automatiquement les 4 pages : `/offre-logo`, `/offre-site-internet`, `/en/logo-offer`, `/en/website-offer`.

## Hors scope
Aucun changement de routing, de contenu ou de logique de soumission.
