## Objectif
Ajouter recherche + filtres dans l'admin (Partenaires et Prospects) et détecter automatiquement les doublons d'email / téléphone pour identifier les fraudes potentielles.

## 1. Panneau "Partenaires" (`PartnersPanel`)

Ajouter au-dessus de la liste :
- Un **champ de recherche** (Input avec icône) qui filtre en temps réel sur : nom du cabinet, prénom, nom du contact, email, téléphone, ville.
- Une barre de **filtres** (chips) :
  - Ville (dropdown alimenté par les villes distinctes des partenaires)
  - Service (dropdown)
  - Tier (Tous / Regular / Premium)
  - **Doublons uniquement** (toggle) — n'affiche que les cabinets flagués
- Le filtre "Vidéo vue / non vue" déjà présent reste (onglet En attente).
- Compteur `X cabinets affichés (sur Y)`.

La recherche/les filtres s'appliquent à l'intérieur de chaque onglet (En attente / Actifs / En pause / Rejetés) sans en changer la logique.

## 2. Panneau "Prospects" (`ProspectsPanel`)

Ajouter au-dessus de la liste :
- Un **champ de recherche** qui filtre sur : nom, email, téléphone, ville, service demandé, message.
- Une barre de **filtres** :
  - Ville
  - Service demandé
  - Période (7 j / 30 j / Tous)
  - **Doublons uniquement** (toggle)
- Le filtre de statut (Tous / En attente / Qualifiés / Rejetés) déjà présent reste.
- Compteur `X prospects affichés (sur Y)`.

## 3. Détection automatique des doublons

Logique côté client (aucun changement DB), calculée une fois par liste :

Pour chaque entité (partenaires d'une part, prospects d'autre part) :
- Normaliser l'email : trim + lowercase.
- Normaliser le téléphone : ne garder que les chiffres, ignorer l'indicatif pays (comparer sur les 8 à 10 derniers chiffres).
- Grouper par email normalisé, puis par téléphone normalisé.
- Tout élément appartenant à un groupe ≥ 2 est marqué `isDuplicate` avec le type (`email` / `phone` / `both`).

Rendu :
- Un **badge rouge "⚠ Doublon email"** ou **"⚠ Doublon téléphone"** (ou les deux) sur la carte du partenaire / du prospect concerné.
- Au clic sur le badge, une petite popover liste les autres entrées partageant la même valeur (nom + date d'inscription + statut) pour vérification manuelle.
- Un compteur global en haut du panneau : `N doublons détectés` (cliquable → active le toggle "Doublons uniquement").

Les doublons croisés partenaire ↔ prospect ne sont **pas** couverts dans cette itération (chaque liste est traitée séparément), à moins que tu le demandes explicitement.

## 4. Détails techniques

- Aucun changement de schéma DB, aucun nouveau server function : la détection et le filtrage sont 100 % client.
- Fichier modifié : `src/routes/_authenticated.admin.tsx` uniquement.
- Nouveaux utilitaires locaux dans le même fichier (ou petit helper `src/lib/duplicates.ts`) :
  - `normalizeEmail(email)`
  - `normalizePhone(phone)` → 8 derniers chiffres
  - `computeDuplicates(items, getEmail, getPhone)` → `Map<id, { email?: string[]; phone?: string[] }>`
- Utilisation de `useMemo` pour recalculer uniquement quand la liste change.
- Recherche insensible à la casse et aux accents (`.normalize('NFD').replace(/\p{Diacritic}/gu,'')`).

## 5. Hors périmètre
- Pas de fusion/suppression automatique des doublons (uniquement flag + affichage).
- Pas de blocage à l'inscription (uniquement détection a posteriori dans l'admin).
- Pas de recherche/filtrage côté serveur (les listes actuelles sont chargées en entier).
