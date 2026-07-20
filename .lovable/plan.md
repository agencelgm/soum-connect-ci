## Diagnostic pour AMADOU KONÉ

Vérifié en base : sa fiche existe, elle est **qualifiée** et **publiée** (publication active du 17 juillet, 0/5 déblocages, position 12 sur 309 publications actives triées par date). Techniquement elle devrait apparaître dans les 100 leads chargés.

Donc deux problèmes cohabitent, et le plan les traite tous les deux :

1. **Limite dure à 100 publications** dans `listMarketplace` — invisible pour toi, mais 209 publications actives sur 309 ne sont jamais envoyées au front. C'est le vrai plafond silencieux.
2. **Aucune recherche ni filtre** dans la marketplace — impossible de retrouver un prospect par nom, ville ou service. Si un lead est masqué par un onglet ("Disponibles" par défaut) ou noyé dans la liste, on ne peut pas le retrouver.

## Plan

1. **Marketplace — supprimer le plafond de 100**
   - Remonter la limite à 500 côté serveur (`src/lib/marketplace.functions.ts`) et garder l'ordre "publiés récemment d'abord".
   - Afficher un compteur clair "X leads disponibles / Y au total" en haut de page.

2. **Marketplace — ajouter une barre de recherche + filtres**
   - Recherche libre (nom du prospect n'est pas exposé aux partenaires, donc côté partenaire la recherche portera sur ville / service / résumé / forme juridique / budget).
   - Filtres : ville, service, "publiés depuis" (24h / 7j / 30j).
   - Ces filtres travaillent sur la liste complète chargée (jusqu'à 500).

3. **Admin — liste des prospects sans limite invisible**
   - Passer `listProspects` de 200 à 1000 max, avec badge "397 prospects · 26 en attente".
   - Ajouter dans l'onglet Admin > Prospects une recherche par nom/email/téléphone et un filtre statut (en attente / qualifié / rejeté).

4. **Marketplace — indicateur "nouveau"**
   - Badge visuel "Nouveau" sur les leads publiés dans les dernières 24h pour qu'ils sautent aux yeux.

## Résultat attendu

- AMADOU KONÉ (et tous les autres au-delà des 100 premiers) redeviennent visibles.
- Tu peux les retrouver instantanément par recherche.
- Plus aucun lead publié n'est silencieusement caché par une limite technique.