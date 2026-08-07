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

## Savoir nominativement qui est parti en A et qui en B

Oui, c'est possible : à ce stade du tunnel la personne a déjà rempli un formulaire, donc son nom,
son email et son téléphone sont connus et déjà liés à la session (`leadId`).

- Chaque événement enregistré sur la page vidéo porte désormais le nom, l'email et le téléphone du
  prospect en plus de la variante.
- Dans **Stats formation**, deux listes nominatives : « Envoyés en version A » et « Envoyés en
  version B », avec nom, email, téléphone, date/heure et le choix fait (Oui / Non).
- Ces listes sont exportables en CSV pour être croisées avec tes ventes Chariow et
  clientsurdemande.com.
- Quand un achat Chariow est reçu par webhook, il est rapproché par email du prospect : la ligne
  correspondante affiche « Acheté » et sa variante. Pour la variante B, le rapprochement se fait à
  la main via l'export CSV (nous n'avons pas de webhook côté clientsurdemande.com — dis-le-moi si
  tu peux en configurer un, je l'intégrerai pareil).
- Ces listes restent réservées aux comptes admin/agent.

## Détails techniques

- `src/routes/formation-clients.tsx` : constantes `VARIANT_A_URL` / `VARIANT_B_URL`, attribution
  aléatoire 50/50 persistée dans `sessionStorage` (`formationVariant`), envoyée dans le corps de
  chaque appel `/api/public/funnel-track`, et utilisée pour la redirection sur « Oui ».
- `src/routes/api/public/funnel-track.ts` : accepter et stocker `variant` dans `metadata`. Ajouter
  aussi `video_75` à `ALLOWED_EVENTS` — cet événement est actuellement rejeté (400) par l'endpoint.
  Accepter également `name` et `phone` (l'email est déjà géré) pour l'identification nominative.
- `src/routes/formation-clients.tsx` : lire `leadUser` en session et transmettre nom/téléphone/email
  à `funnel-track`.
- `src/lib/funnel-stats.functions.ts` : agréger les totaux par variante et retourner la liste des
  sessions (variante, identité, choix, horodatage), avec rapprochement par email des événements
  `purchase` issus du webhook Chariow.
- `src/routes/_authenticated.stats-formation.tsx` : section comparative A/B + tableaux nominatifs
  par variante avec export CSV.
- L'événement Meta `AddToCart` continue d'être envoyé dans les deux cas, avec la variante en
  `content_category` pour distinguer les deux flux dans Meta.
