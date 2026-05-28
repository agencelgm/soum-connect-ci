## Objectif

1. Quand un membre de l'équipe (admin/agent) se connecte, attirer immédiatement l'attention sur les prospects et partenaires **en attente** via un badge rouge bien visible.
2. Pouvoir cliquer sur n'importe quel prospect (ou partenaire) pour voir **toutes** les informations renseignées (y compris les réponses du genre "Avez-vous un logo ?", "Voulez-vous un site internet ?", etc. qui sont actuellement stockées dans `raw_payload` mais jamais affichées).

## Ce qui sera modifié

Un seul fichier : `src/routes/_authenticated.admin.tsx`.

### 1. Badges rouges sur les onglets

- Sur l'onglet principal **Prospects**, ajouter un pastille rouge `(N)` indiquant le nombre de prospects au statut `pending_qualification`. Visible dès l'arrivée sur `/admin`.
- Sur l'onglet principal **Partenaires**, même pastille rouge pour les partenaires au statut `pending_review`.
- À l'intérieur des sous-onglets (Partenaires → "En attente", Prospects → "En attente"), la pastille rouge est répétée sur le sous-onglet correspondant pour bien marquer là où il faut cliquer.
- Style : petite puce ronde rouge (`bg-destructive text-destructive-foreground`) avec le compteur en blanc. Masquée si le compteur = 0.

Pour pouvoir afficher le compteur global Partenaires sur le `Tabs` racine, on remonte d'un cran les requêtes `listPartners` et `listProspects` au niveau de `AdminPage` (ou on lit simplement le compteur via `useQuery` en double — TanStack Query dédupliquera la requête grâce à la même `queryKey`, donc pas d'appel réseau supplémentaire).

### 2. Vue détail prospect / partenaire

- Chaque carte prospect et chaque carte partenaire devient cliquable (ou avec un bouton "Voir détails").
- Au clic, ouverture d'un `Dialog` (shadcn) plein écran sur mobile, large sur desktop, affichant :
  - **Prospect** : toutes les colonnes structurées (nom, email, téléphone, audience, statut, service, ville, budget, forme juridique, message, date, source, page_url, referrer, user_agent, etc.) **plus** un rendu lisible de toutes les clés présentes dans `raw_payload` (logo, siteWeb, bureau, publicite, delai, nbAssocies, entreprise, description, statut, localisation, …). Les clés techniques (`leadId`, `tag`, `received_at`, `user_agent`, `language`) sont regroupées dans une section "Métadonnées" repliée par défaut.
  - **Partenaire** : toutes les colonnes (cabinet, contact, email, téléphone, ville, site web, Facebook, services, zones, statut, crédits, dates approve/pause/reject, motifs, etc.).
- Les actions existantes (Approuver / Rejeter / Publier / Supprimer / +Crédits) sont également disponibles directement depuis le dialog pour ne pas devoir le fermer.
- Le rendu de `raw_payload` est générique : on traduit les clés techniques en libellés français quand on les connaît (mapping `logo` → "A déjà un logo ?", `siteWeb` → "A déjà un site internet ?", `bureau` → "A un bureau physique ?", `publicite` → "Fait de la publicité ?", `delai` → "Délai souhaité", `nbAssocies` → "Nombre d'associés", `entreprise` → "Nom envisagé", `description` → "Description du projet", `localisation` → "Localisation précise", `statut` → "Situation actuelle"), avec fallback brut pour les clés inconnues. Cela garantit qu'aucune info renseignée par le prospect n'est perdue, même si on ajoute de nouveaux champs au formulaire plus tard.

## Hors périmètre

- Aucune migration base de données (toutes les données sont déjà stockées dans `prospects.raw_payload`, simplement non affichées).
- Aucune modification des server functions (le `select("*")` actuel renvoie déjà `raw_payload`).
- Pas de notification email/push : seule la signalisation visuelle dans l'admin est demandée.
