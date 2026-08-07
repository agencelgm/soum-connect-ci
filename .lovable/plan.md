# Test A/B de la destination "Oui" sur la page formation

## Objectif

Envoyer 50 % des personnes qui cliquent « Oui » vers `https://clientsurdemande.com/methode-10-etapes`
au lieu du checkout Chariow actuel (`https://academielgm.com/prd_p987fb31`), et pouvoir comparer les
deux variantes dans **Stats formation**.

## Comment ça marche

1. À la première visite de `/formation-clients`, la personne est tirée au sort dans une variante :
   - **A** : checkout Chariow (actuel)
   - **B** : page `clientsurdemande.com/methode-10-etapes`
2. La variante est mémorisée dans la session : si la personne recharge la page, elle reste dans le
   même groupe (pas de double comptage, pas de changement de destination).
3. Au clic sur « Oui », redirection vers l'URL de la variante attribuée. Le clic « Non » et tout le
   reste du tunnel ne changent pas.
4. Chaque événement du tunnel enregistre la variante, donc le tableau **Stats formation** peut
   afficher les vues, lectures vidéo, « Oui » et « Non » séparément pour A et B.

## Ce qui s'affiche dans Stats formation

Un bloc « Test A/B » avec, pour chaque variante : nombre de sessions, clics « Oui », taux de « Oui ».
Les achats Chariow remontés par webhook restent comptés globalement (Chariow ne notifie que la
variante A) — la comparaison fiable se fait donc sur le taux de clic « Oui » par variante, et sur les
ventes réelles côté clientsurdemande.com pour la variante B.

## Détails techniques

- `src/routes/formation-clients.tsx` : constantes `VARIANT_A_URL` / `VARIANT_B_URL`, attribution
  aléatoire 50/50 persistée dans `sessionStorage` (`formationVariant`), envoyée dans le corps de
  chaque appel `/api/public/funnel-track`, et utilisée pour la redirection sur « Oui ».
- `src/routes/api/public/funnel-track.ts` : accepter et stocker `variant` dans `metadata`. Ajouter
  aussi `video_75` à `ALLOWED_EVENTS` — cet événement est actuellement rejeté (400) par l'endpoint.
- `src/lib/funnel-stats.functions.ts` : lire `metadata` et agréger les totaux par variante.
- `src/routes/_authenticated.stats-formation.tsx` : nouvelle section comparant A et B.
- L'événement Meta `AddToCart` continue d'être envoyé dans les deux cas, avec la variante en
  `content_category` pour distinguer les deux flux dans Meta.
