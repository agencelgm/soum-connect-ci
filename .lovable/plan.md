# Accès admin pour les propriétaires du site

## Constat

L'infra admin existe déjà côté code :

- Route `/admin` (`src/routes/_authenticated.admin.tsx`) avec tableau de bord (Partenaires, Prospects, Création manuelle).
- Table `user_roles` avec enum `app_role` (`admin`, `agent`, `user`) et fonction `has_role()` sécurisée.
- RLS qui ouvre lecture/écriture prospects, publication leads, gestion partenaires aux rôles `admin` et `agent`.

**Mais 3 trous bloquent l'usage** :

1. La table `user_roles` est vide → personne n'est admin.
2. `/connexion` redirige TOUT le monde vers `/espace-partenaire`, même un admin.
3. Aucun lien visible vers `/admin` nulle part dans l'UI (route "cachée" qu'il faut taper à la main).

## Ce que je propose

### 1. Créer ton compte propriétaire (et celui de ton équipe)

Tu te crées un compte normal via `/connexion` (ou je te crée un compte direct avec un mot de passe temporaire que tu changes ensuite). Une fois l'email connu, je lance une migration qui :

- insère ton `user_id` dans `public.user_roles` avec `role = 'admin'`,
- (optionnel) ajoute un ou deux comptes `agent` pour ton équipe support.

Pour ça j'ai juste besoin de **ton email** (celui que tu veux utiliser comme compte propriétaire). Je peux aussi prévoir un second email `agent` si tu veux séparer "toi propriétaire" et "ton assistante qui qualifie les prospects".

### 2. Redirection intelligente après login

Modifier `/connexion` (et `/inscription-partenaire`) pour, après authentification, appeler un petit serverFn `getMyRedirect()` qui regarde :

- si l'utilisateur a le rôle `admin` ou `agent` → `/admin`
- sinon (= partenaire ou nouveau) → `/espace-partenaire`

Comme ça un seul formulaire de connexion sert pour tout le monde, propriétaires comme cabinets. Pas de page `/admin-login` séparée (mauvaise pratique, doublon inutile).

### 3. Lien admin visible quand pertinent

Dans le header du layout `_authenticated.tsx`, afficher un lien `Admin` à côté de `Déconnexion` **uniquement** si l'utilisateur a un rôle staff. Pour les cabinets normaux, le header reste identique à aujourd'hui (ils ne voient rien).

### 4. Sécurité du `/admin`

Le composant `AdminPage` vérifie déjà côté client `isStaff` et affiche "Accès réservé à l'équipe" sinon. Ajouter en plus un `beforeLoad` sur la route qui appelle `getMyPartner()` et `throw redirect({ to: "/espace-partenaire" })` si pas staff → évite le flash de chargement et bloque même si quelqu'un trafique le client.

## Détails techniques

- **Nouveau serverFn** `getMyRole()` dans `src/lib/partners.functions.ts` (ou nouveau `src/lib/auth.functions.ts`) : protégé par `requireSupabaseAuth`, retourne `{ roles: app_role[] }` en lisant `user_roles`.
- **Migration SQL** : `INSERT INTO public.user_roles (user_id, role) SELECT id, 'admin' FROM auth.users WHERE email = '<ton-email>' ON CONFLICT DO NOTHING;`
- **Edits** :
  - `src/routes/connexion.tsx` — après `signInWithPassword`, attendre `getMyRole()` et router.
  - `src/routes/_authenticated.tsx` — afficher lien `Admin` si staff.
  - `src/routes/_authenticated.admin.tsx` — ajouter `beforeLoad` de garde.

## Questions à confirmer avant que je passe en build

1. **Quel email** veux-tu utiliser comme compte propriétaire admin ? agencelgm@gmail.com
2. Veux-tu aussi créer un ou plusieurs comptes `agent` (équipe support qui qualifie les prospects sans accès aux fonctions destructives comme supprimer un partenaire) ? Si oui, donne-moi les emails. [fatemexpertjuniorlgm@gmail.com](mailto:fatemexpertjuniorlgm@gmail.com), [gracecoordlgm@gmail.com](mailto:gracecoordlgm@gmail.com), [loistianoulgm@gmail.com](mailto:loistianoulgm@gmail.com)
3. OK pour que `/connexion` serve à la fois aux propriétaires ET aux cabinets (avec redirection automatique selon rôle) plutôt qu'une page `/admin-login` séparée - yes  
4- Pour moi et mon équipe, met un mot de passe temporaire qui demande qu'on crée un nouveau à la première connection