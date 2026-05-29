## 1. Supprimer la barre d'onglets interne sur `/admin`

La sidebar pilote déjà la section affichée via `?tab=`. La `TabsList` en haut de la page fait doublon et brouille la hiérarchie.

Changements dans `src/routes/_authenticated.admin.tsx` :
- Retirer `<TabsList>` et le wrapper `<Tabs value=… onValueChange=…>`.
- Remplacer par un rendu conditionnel direct selon `search.tab` :
  - `partners` (défaut) → `<PartnersPanel />`
  - `prospects` → `<ProspectsPanel />`
  - `create` → `<CreatePartnerPanel />`
  - `team` (admin uniquement) → `<TeamPanel />`
- Ajouter un petit en-tête de section au-dessus du panel (titre + sous-titre) pour que l'utilisateur sache toujours où il est, vu qu'on perd les onglets visuels. Ex : « Partenaires — 1 cabinet actif, 0 en attente ».
- Les compteurs `pendingPartners` / `pendingProspects` continuent d'alimenter les badges de la **sidebar** (à ajouter aussi côté `AppShell` pour garder le signal d'alerte visible).

Les sous-onglets internes au panel Partenaires (En attente / Actifs / En pause / Rejetés) **restent** — ils filtrent une seule liste, c'est leur rôle légitime.

## 2. Construire une vraie page « Mon compte » pour le staff

Aujourd'hui `_authenticated.espace-partenaire.tsx` ne rend rien quand l'utilisateur est staff sans cabinet associé (le bloc `BootstrapOrInscriptionCard` est masqué par `!isStaff`, et tous les autres blocs dépendent d'un `partner`). D'où la page vide.

Changements dans `src/routes/_authenticated.espace-partenaire.tsx` :
- Si `isStaff && !partner` → afficher un nouveau bloc `StaffAccountCard` :
  - Nom complet (depuis `profiles.full_name`) + email + badge rôle (Admin / Agent)
  - Bouton « Changer mon mot de passe » → `/changer-mot-de-passe`
  - Bouton « Déconnexion »
  - Lien rapide vers `/admin`
- Garder la logique partenaire intacte pour les cabinets.
- Retirer le bouton « Tableau de bord admin » du header de la page (redondant avec la sidebar) ou le laisser uniquement quand on n'est PAS sur /admin — au choix, je propose de le retirer.

Pas de changement DB. La server fn `getMyPartner` renvoie déjà `roles` et le `user.email` est accessible via `useAuth()`. Pour le `full_name`, on l'ajoute au retour de `getMyPartner` (lecture du `profiles` du user courant — déjà chargé probablement, sinon une requête supplémentaire négligeable).

## Hors scope

- Pas de refonte visuelle du panel Partenaires.
- Pas de page profil dédiée séparée pour le staff (on réutilise `/espace-partenaire`).
- Pas de modification des permissions ou de la DB.
