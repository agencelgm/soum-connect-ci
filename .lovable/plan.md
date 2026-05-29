## Objectif

Séparer l'expérience du staff LGM de celle des cabinets partenaires. Le staff a sa propre sidebar, son propre tableau de bord immersif, et ne voit plus rien lié aux crédits.

## 1. Sidebar conditionnelle (`AppShell.tsx`)

Aujourd'hui `AppShell` affiche les mêmes 5 entrées pour tout le monde. On passe à deux jeux de navigation selon `isStaff` :

**Sidebar Partenaire (inchangée)** — Marketplace, Recharger crédits, Historique, Mon compte. Bloc solde + bouton Recharger conservés.

**Sidebar Staff (nouvelle)** :
- Tableau de bord → `/admin`
- Prospects → `/admin?tab=prospects`
- Partenaires → `/admin?tab=partners`
- Créer un partenaire → `/admin?tab=create`
- Équipe LGM → `/admin?tab=team` (admin uniquement)
- Mon compte → `/espace-partenaire`

Le bloc « Solde / Recharger » est **masqué** côté staff. À la place, un petit encart « Mode opérateur » avec le rôle (Admin / Agent) et un indicateur de prospects en attente (badge count récupéré comme aujourd'hui dans `_authenticated.admin.tsx`).

Le clic sur le logo en haut de la sidebar pointe vers `/` (homepage publique) pour le staff, et reste sur `/marketplace` pour les partenaires.

## 2. Page `/admin` — vrai dashboard immersif

Refonte de `_authenticated.admin.tsx` : on garde toute la logique métier (queries, panels Partners/Prospects/Create/Team), mais on change le layout d'entrée.

**Header de stats** (4 cartes KPI en grille) :
- Prospects en attente de qualification
- Publications actives sur la marketplace
- Partenaires actifs / en attente de validation
- Recharges crédits du mois (somme `chariow_payments.credits_granted` status=`credited`)

**Sous le header** : on lit `?tab=` dans l'URL pour piloter les `Tabs` existants (au lieu du `defaultValue` actuel). Les onglets restent — Partenaires / Prospects / Créer / Équipe — mais ils sont aussi pilotables depuis la sidebar.

Conservation totale des panels existants : `PartnersPanel`, `ProspectsPanel`, `CreatePartnerPanel`, `TeamPanel`. Aucune logique serveur n'est modifiée.

**Style** : même thème (tokens existants de `styles.css`), mais layout dense type back-office — bordures fines, cartes compactes, typographie monospace pour les chiffres KPI, séparateurs marqués. Distinct visuellement du portail partenaire (qui est plus aéré et chaleureux) sans changer de palette.

## 3. Redirections

- `/marketplace`, `/recharger`, `/historique` : ajout d'un `beforeLoad` qui, si l'utilisateur est staff, redirige vers `/admin`. Évite qu'un admin tombe par hasard sur une page sans valeur pour lui.
- `/admin` : si l'utilisateur n'est pas staff, redirige vers `/marketplace` (au lieu d'afficher « Accès réservé »).
- Login (`connexion.tsx`) : déjà OK, staff → `/admin`.

## 4. KPI — nouvelle server fn

Une seule nouvelle server fn `getAdminDashboardStats` dans `src/lib/partners.functions.ts`, protégée par `requireSupabaseAuth` + check de rôle staff, qui renvoie les 4 compteurs (counts simples, pas de jointures lourdes).

## Détails techniques

```text
src/components/layout/AppShell.tsx
  ├── NAV_PARTNER = [marketplace, recharger, historique, espace-partenaire]
  ├── NAV_STAFF   = [admin, admin?tab=prospects, admin?tab=partners, admin?tab=create, admin?tab=team(admin), espace-partenaire]
  └── Bloc solde : render uniquement si !isStaff

src/routes/_authenticated.admin.tsx
  ├── + useSearch() pour lire ?tab=
  ├── + <DashboardKpis /> au-dessus des Tabs
  └── <Tabs value={tabFromSearch} onValueChange={navigate} ...>

src/routes/_authenticated.marketplace.tsx / recharger / historique
  └── + beforeLoad: redirect staff → /admin

src/lib/partners.functions.ts
  └── + getAdminDashboardStats (counts: prospects pending, publications active,
        partners pending/approved, credits du mois)
```

## Hors scope

- Pas de refonte des panels internes (`PartnersPanel`, etc.).
- Pas de modification des permissions DB / RLS.
- Pas de changement de palette ou de typographie globale.
- Pas de nouvelle page route (tout passe par `/admin` + query param `tab`).
