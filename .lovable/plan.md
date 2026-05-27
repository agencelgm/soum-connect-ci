# Deux nouvelles fonctionnalités admin

## 1. Rejeter / supprimer un prospect (onglet Prospects)

**Cas d'usage** : après un appel, l'agent constate que le prospect n'est pas fiable (faux numéro, demande non sérieuse, doublon, hors zone). Aujourd'hui un prospect ne peut qu'être "publié comme lead" — il manque les actions négatives.

**Ajouts UI** dans `ProspectsPanel` (`src/routes/_authenticated.admin.tsx`) :

- Un filtre par statut en haut : Tous · En attente · Qualifiés · Rejetés
- Sur chaque carte prospect non publié, deux nouveaux boutons à côté de "Publier comme lead" :
  - **Rejeter** (orange, demande un motif court obligatoire — réutilise `RejectButton` existant) → passe `status = 'rejected'`, garde la ligne pour audit
  - **Supprimer** (rouge, `admin` uniquement, confirmation native) → suppression dure (le prospect est inutile, pas de FK utile)
- Les prospects rejetés s'affichent grisés, avec le motif visible et un bouton "Réactiver" pour annuler une erreur.

**Backend** : 3 nouveaux serverFn dans `src/lib/prospects.server.ts` + wrappers dans un nouveau `src/lib/prospects.functions.ts` (le fichier `.server.ts` existe déjà mais n'est pas exposé en RPC) :

- `rejectProspect({ prospect_id, reason })` — staff (admin+agent), met `status='rejected'`, stocke `qualification_notes = reason`, `qualified_by = auth.uid()`, `qualified_at = now()`
- `reactivateProspect({ prospect_id })` — staff, repasse en `pending_qualification`
- `deleteProspect({ prospect_id })` — admin seul, hard delete

**Migration nécessaire** :

- Ajouter la valeur `'rejected'` à l'enum `prospect_status` si absente (à vérifier — l'enum actuel a `pending_qualification` et `qualified`).
- Ajouter policy RLS `DELETE` sur `prospects` réservée à `admin` (aujourd'hui aucun DELETE n'est autorisé).

## 2. Gestion d'équipe (nouvel onglet "Équipe" dans /admin)

**Visibilité** : onglet visible uniquement si `roles.includes('admin')` — les agents ne voient pas cet onglet.

**UI** : nouvel onglet `Équipe` dans le `Tabs` d'`AdminPage`, à côté de "Création manuelle". Il liste les membres staff (admin + agent) avec pour chacun :

- Email, nom, rôle (badge), statut (actif / suspendu), date d'ajout
- Actions par ligne : **Changer rôle** (admin ⇄ agent), **Réinitialiser mot de passe** (génère un nouveau mot de passe temporaire + force `must_change_password=true`), **Suspendre** / **Réactiver**, **Supprimer**
- Bouton en haut : **+ Ajouter un membre** → formulaire (email, prénom, nom, rôle admin/agent, mot de passe temporaire généré automatiquement, copiable)

**Backend** : nouveau `src/lib/team.functions.ts` avec serverFn protégés (`requireSupabaseAuth` + check `has_role(admin)` à l'intérieur du handler, sinon throw) utilisant `supabaseAdmin` :

- `listTeam()` — retourne profils + rôles + statut suspension (jointure `profiles` + `user_roles` + lecture de `banned_until` via Admin API)
- `addTeamMember({ email, first_name, last_name, role, password })` — crée le compte via `supabaseAdmin.auth.admin.createUser`, insère profil + `user_roles`, marque `must_change_password=true`
- `updateTeamRole({ user_id, role })` — remplace l'entrée `user_roles` (admin ne peut pas se rétrograder lui-même)
- `resetTeamPassword({ user_id, new_password })` — `supabaseAdmin.auth.admin.updateUserById` + remet `must_change_password=true`
- `suspendTeamMember({ user_id })` / `unsuspendTeamMember({ user_id })` — utilise `ban_duration` de l'Admin API (ban 100 ans / `none`)
- `deleteTeamMember({ user_id })` — `supabaseAdmin.auth.admin.deleteUser` (refuse si c'est soi-même)

**Garde-fous** :

- Un admin ne peut ni se supprimer, ni se suspendre, ni se rétrograder lui-même (sinon plus aucun admin → site bloqué)
- Refuser la suppression du dernier admin

**Migration** : aucune nécessaire côté schéma (les rôles passent par `user_roles` qui existe déjà, la suspension via `auth.users.banned_until` est nativement gérée par Supabase).

## Fichiers touchés

- **migration SQL** : enum `prospect_status` += `rejected` (si absent) + policy DELETE admin sur `prospects`
- **nouveaux** : `src/lib/prospects.functions.ts`, `src/lib/team.functions.ts`
- **édités** : `src/lib/prospects.server.ts` (3 fns reject/reactivate/delete), `src/routes/_authenticated.admin.tsx` (onglet Équipe, filtre statut + boutons sur ProspectsPanel)

## Questions avant build

1. Pour la **suppression de prospect** : hard delete (la ligne disparaît) ou soft delete (on garde un flag `deleted_at` pour audit) ? Je recommande hard delete vu qu'il n'y a aucune dépendance FK et que les prospects rejetés restent visibles. - ok
2. Le **mot de passe temporaire** à l'ajout d'un membre : généré automatiquement (12 caractères aléatoires affichés une fois, copiables) ou saisi manuellement par l'admin ? Je recommande génération auto pour éviter les mots de passe faibles. - ok
3. **Suspension** : empêche juste la connexion (le membre garde son rôle mais ne peut plus se logger) — OK ou tu veux aussi retirer l'affichage de l'onglet Admin pour lui ? La suspension Supabase bloque déjà la connexion à la racine donc la 2e question est moot. - je veux pouvoir supprimer des utilisateurs de mon équipe, ou juste suspendre leur accès
