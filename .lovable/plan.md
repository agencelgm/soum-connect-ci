# Espace Commerciaux + Rebooster les prospects

## 1. Rebooster un prospect jamais contacté
- Dans l'admin, les prospects publiés sans aucun déblocage affichent un badge « Jamais contacté » et un bouton **Rebooster**.
- Le bouton les fait remonter en tête de la Marketplace : nouvelle date de publication, nouvelle fenêtre Premium de 3 h et nouvelle alerte email aux comptables (même circuit que pour une nouvelle publication).
- Un filtre « Jamais contactés » est ajouté dans l'admin.

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
- Fonction `rebooster_publication(_publication_id)` (admin/agent) : met à jour `published_at`, `premium_until`, `is_active` et relance les notifications.
- Server functions dans `src/lib/commercial.functions.ts` ; liste masquée renvoyée sans PII.
- Nouvelle route `src/routes/_authenticated.commercial.tsx` (noindex), menu dédié dans `AppShell`, redirection des commerciaux hors des pages partenaires/admin.
- Gestion des comptes commerciaux (création/retrait) dans l'admin.
