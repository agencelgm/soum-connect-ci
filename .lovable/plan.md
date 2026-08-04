# Nouveau tarif Illimité : 100 000 FCFA (promo 50 000)

## Ce qui change

L'accès illimité passe à **100 000 FCFA pour 30 jours** en prix public. La promotion « 2 mois pour 50 000 » est supprimée partout. La nouvelle offre promotionnelle devient **1 mois à 50 000 FCFA au lieu de 100 000** (–50 %).

## 1. Tarification

- Pack Illimité : prix affiché **100 000 FCFA**, durée **30 jours** (inchangée).
- Le webhook Chariow accorde toujours 30 jours, avec empilement si l'accès est encore actif.
- Plus aucun cas où un achat accorde 60 jours.

## 2. Page /recharger

- Le pack Illimité affiche 100 000 FCFA par défaut.
- Pour un partenaire ayant une **promotion active**, le prix s'affiche `100 000 FCFA` barré → **50 000 FCFA**, avec un badge « Offre exclusive » et le compte à rebours d'expiration de la promo.
- Sans promo active, aucun tarif à 50 000 n'est visible.
- Correction au passage du tableau comparatif : il annonce encore « 200 FCFA / prospect » alors que le tarif est revenu à 1 000 FCFA/crédit — remis à jour.

## 3. Emails promotionnels

Les envois continuent, mais l'offre est réécrite :

- Variantes A et B (promo 50 % consommé) : le bloc « 50 000 → Illimité 2 mois » devient « Illimité 1 mois : ~~100 000~~ **50 000 FCFA** ».
- Winback matin / après-midi / soir : même correction ; plus aucune mention de 2 mois ou 60 jours.
- Le multiplicateur ×5 sur les packs Starter/Pro est conservé dans les emails et dans le webhook.

## 4. Logique promotions

- Les promotions créées (promo 50 % consommé et winback) passent de `unlimited_days = 60` à `30`, et servent désormais à débloquer le **prix réduit**, pas des jours supplémentaires.
- Les promotions déjà en base avec 60 jours sont ramenées à 30 jours pour ne plus accorder l'ancien avantage.

## Détails techniques

- `src/lib/credit-packs.ts` : pack illimité → `price: "100 000 FCFA"`, `unlimitedDays: 30`, ajout d'un `promoPrice: "50 000 FCFA"` et d'un `promoProductId` (même produit Chariow tant qu'un second produit n'est pas créé côté Chariow).
- `src/routes/_authenticated.recharger.tsx` : lecture de la promo active du partenaire pour afficher le prix barré et le bouton Chariow correspondant.
- `src/routes/api/public/chariow-webhook.ts` : `effectiveUnlimitedDays` ne prend plus `promoUnlimitedDays` pour l'illimité (toujours `pack.unlimitedDays`) ; le multiplicateur crédits reste actif.
- `src/routes/api/public/hooks/promo-winback-dispatch.ts` : `unlimited_days: 30`.
- `maybe_grant_50pct_promo` (fonction base de données) : `unlimited_days` 60 → 30, plus mise à jour des lignes existantes non consommées.
- Templates modifiés : `promo-50pct-variant-a.tsx`, `promo-50pct-variant-b.tsx`, `promo-winback-morning.tsx`, `promo-winback-afternoon.tsx`, `promo-winback-evening.tsx`.

## À faire de ton côté

Sur Chariow, mettre le produit illimité à **100 000 FCFA**. Si tu veux un bouton distinct à 50 000 pour les promos, crée un second produit et envoie-moi son ID : je le brancherai sur l'affichage promo.
