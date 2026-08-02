## Objectif

Savoir, côté admin :

1. Pour chaque prospect publié : quelles agences ont débloqué ses coordonnées (jusqu'à 5), et à quelle heure.
2. Quelles agences sont les plus actives sur une période (7 derniers jours, hier, 30 jours, ou dates personnalisées).
3. Combien de crédits chaque agence a consommés sur cette période, et sa fréquence de déblocage.

Les données existent déjà (chaque déblocage est enregistré avec l'agence, la publication et les crédits dépensés) — il manque uniquement la lecture et l'affichage. Aucune modification du schéma n'est nécessaire.

## Ce qui sera construit

### 1. Nouvel onglet « Activité » dans l'espace admin

Ajouté à la barre latérale staff, à côté de « Prospects » et « Partenaires ».

Sélecteur de période en haut : Aujourd'hui / Hier / 7 derniers jours / 30 derniers jours / Personnalisé (deux dates).

**Bandeau de synthèse** : nombre de déblocages, nombre d'agences actives, crédits consommés, nombre de prospects publiés sur la période, moyenne de déblocages par prospect.

**Classement des agences** (trié par déblocages, colonnes triables) :

- Cabinet, ville, statut, niveau (Régulier / Premium / Illimité)
- Déblocages sur la période
- Crédits consommés sur la période (0 pour un déblocage en illimité, affiché comme tel)
- Fréquence : moyenne de déblocages par jour actif + nombre de jours actifs
- Dernier déblocage (date relative), solde de crédits actuel
- Export CSV du classement

**Agences inactives** : liste des partenaires approuvés avec 0 déblocage sur la période (utile pour la relance).

### 2. Vue « qui a contacté ce prospect »

Dans l'onglet Prospects, chaque prospect publié affiche un compteur « X / 5 agences » cliquable qui ouvre un panneau détaillé :

- Liste des agences ayant débloqué, dans l'ordre chronologique (1er, 2e, …)
- Cabinet, contact, téléphone/email de l'agence, ville, niveau
- Heure exacte du déblocage + délai écoulé depuis la publication
- Crédits dépensés par ce déblocage
- Places restantes et indication si la fenêtre premium de 3 h est encore active
- Ajoute aussi une vue qui permet de voir dans la catégorie partenaire tous les prospects qu'ils ont débloqués. 

La même vue est accessible depuis la ligne d'une agence dans l'onglet Activité (liste de ses derniers prospects débloqués).

## Détails techniques

- Nouveau fichier `src/lib/partner-activity.functions.ts` avec des server functions protégées (vérification staff comme dans `marketplace.functions.ts`) :
  - `getPartnerActivityStats({ from, to })` — agrégation des `lead_unlocks` jointe à `partners`, plus la liste des partenaires approuvés sans activité.
  - `getPublicationUnlocks({ prospect_id })` — déblocages détaillés d'un prospect, joints aux infos agence.
- Nouveaux composants sous `src/components/admin/` : `PartnerActivityPanel.tsx` (onglet) et `ProspectUnlockersDialog.tsx` (panneau détaillé), pour ne pas alourdir `_authenticated.admin.tsx` (déjà ~2 660 lignes).
- Onglet `activite` ajouté au schéma de recherche de `_authenticated.admin.tsx` et à `NAV_STAFF` dans `AppShell.tsx`.
- Agrégation faite côté serveur ; l'export CSV est généré côté client à partir des données déjà chargées.
- Les coordonnées des agences (partenaires, pas des prospects) sont visibles par le staff uniquement — routes déjà sous `_authenticated` avec contrôle de rôle.
- Ajoute aussi une vue qui permet de voir dans la catégorie partenaire tous les prospects qu'ils ont débloqués. 