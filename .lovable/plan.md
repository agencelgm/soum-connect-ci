# Espace Commerciaux + Rebooster les prospects

## 1. Rebooster les prospects peu contactés
- **Reboost automatique** : si, 2 jours après sa publication (ou son dernier reboost), un prospect a été débloqué par moins de 2 cabinets, il remonte automatiquement en tête de la Marketplace. Cela se répète tous les 2 jours tant qu'il n'a pas atteint 2 déblocages et qu'il reste actif.
- **Reboost manuel** : dans l'admin, les prospects publiés avec moins de 2 déblocages affichent un badge « Peu contacté » (« Jamais contacté » si 0) et un bouton **Rebooster**.
- Un reboost = nouvelle date de publication (remonte en tête), nouvelle fenêtre Premium de 3 h, nouvelle alerte email aux comptables (règle 1 email/jour conservée), et un badge « Remis en avant » sur la Marketplace.
- L'admin voit le nombre de reboosts et la date du dernier ; filtre « Peu contactés » ajouté.

## 2. Nouveau rôle « Commercial »
- Nouveau type de compte, créé par un admin (même principe que les membres de l'équipe). Les agents actuels gardent leurs accès.
- Les commerciaux ont leur propre tableau de bord (`/commercial`), séparé de l'admin et de la Marketplace des comptables.

## 3. Tableau de bord Commercial
- **File des nouveaux prospects** (à qualifier) : seuls le prénom/nom et la demande (création d'entreprise, business plan, etc.) sont visibles. Téléphone, email et message restent masqués.
- **Débloquer** : le prospect est assigné au commercial (son nom devient propriétaire) et disparaît de la file des autres. Deux commerciaux ne peuvent jamais débloquer le même prospect.
- **Mes prospects** : coordonnées complètes, réponses au formulaire, historique des notes.

## 4. Règles anti-gaspillage
- Avant de débloquer un nouveau prospect, le commercial doit avoir clôturé le précédent : **note d'au moins 10 mots + décision (Approuver / Refuser)**.
- **Délai de 5 minutes minimum** entre deux déblocages par commercial, avec compte à rebours visible.
- Ces règles sont vérifiées côté serveur (impossible de les contourner depuis le navigateur).

## 5. Décision du commercial
- **Approuver** : le prospect passe en « qualifié » et apparaît dans l'admin, prêt à être publié sur la Marketplace (la publication reste une action admin).
- **Refuser** : le prospect passe en « refusé » avec la note comme motif.
- L'admin voit sur chaque fiche : commercial propriétaire, date de déblocage, note et décision.

## Détails techniques
- Ajout de `commercial` à l'enum `app_role`.
- Nouvelle table `prospect_assignments` (prospect_id unique, commercial_id, unlocked_at, note, decision, decided_at) avec GRANT + RLS (commercial voit ses lignes, admin voit tout).
- Fonction SECURITY DEFINER `commercial_unlock_prospect(_prospect_id)` : vérifie le rôle, l'absence d'assignation ouverte, le délai de 5 min, verrouille la ligne (FOR UPDATE) et assigne.
- Fonction `commercial_close_prospect(_prospect_id, _note, _decision)` : vérifie ≥10 mots et met à jour `prospects.status`.
- Colonnes `boost_count` et `last_boosted_at` sur `lead_publications`. Fonction `rebooster_publication(_publication_id)` (admin/agent) : met à jour `published_at`, `premium_until`, `is_active` et relance les notifications.
- Tâche planifiée horaire `/api/public/hooks/auto-reboost` (protégée par secret) : sélectionne les publications actives avec `unlock_count < 2` et `published_at < now() - 2 jours`, puis les reboost.
- Server functions dans `src/lib/commercial.functions.ts` ; liste masquée renvoyée sans PII.
- Nouvelle route `src/routes/_authenticated.commercial.tsx` (noindex), menu dédié dans `AppShell`, redirection des commerciaux hors des pages partenaires/admin.
- Gestion des comptes commerciaux (création/retrait) dans l'admin.
