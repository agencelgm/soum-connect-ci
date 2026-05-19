## Objectif

Aligner `/guides` sur le plan éditorial de 20 articles et empêcher les liens de retourner du 404 en scaffoldant une route dynamique `/guides/$slug` avec un placeholder « article en cours de rédaction ».

La priorité (🔴/🟡/🟢) reste **interne au code** (champ `priority` non rendu) — pas de badge ni de filtre par priorité.

## Changements

### 1. `src/routes/guides.tsx` — remplacer la liste `ARTICLES`

- Étendre le type `Category` pour couvrir tout le plan : ajouter `"Domiciliation"`, `"Géo"`, `"Audit"` (en plus de Création d'entreprise / Comptabilité / Fiscalité / Diaspora). Renommer cohérent : la catégorie "Création" du plan = `"Création d'entreprise"` côté code.
- Étendre `Article` avec un champ `priority: 1 | 2 | 3` (1 = 🔴, 2 = 🟡, 3 = 🟢). Champ uniquement utilisé pour trier la liste (rouge → vert).
- Remplacer les 8 articles existants par les 20 du plan, dans l'ordre exact donné, avec :
  - `slug` = la dernière partie de l'URL fournie (sans `/guides/`)
  - `title` = titre du plan
  - `excerpt` = 1–2 phrases SEO accrochantes (rédigées à partir du titre)
  - `categories` = la catégorie principale du plan (+ Diaspora si pertinent pour 5 et 13)
  - `readTime` = estimation cohérente (5–10 min selon profondeur)
  - `priority` = 1/2/3
- Trier l'affichage par `priority` croissant. Garder le filtre par catégorie existant (mettre à jour `FILTERS` pour inclure les nouvelles catégories).
- Aucun rendu visuel de `priority`.

Slugs cibles (ordre du plan) :

```
creer-sarl-cepici              (1, 🔴, Création)
sarl-sa-ei-cote-divoire        (2, 🔴, Création)
calendrier-fiscal-ci-2026      (3, 🔴, Fiscalité)
cout-cabinet-comptable-abidjan (4, 🔴, Comptabilité)
creer-entreprise-ci-depuis-france (5, 🔴, Diaspora + Création)
impots-entreprise-cote-divoire (6, 🔴, Fiscalité)
choisir-cabinet-comptable-abidjan (7, 🔴, Comptabilité)
domiciliation-entreprise-abidjan (8, 🟡, Domiciliation)
obligations-comptables-sarl-ci (9, 🟡, Comptabilité)
cepici-cote-divoire            (10, 🟡, Création)
creer-sa-cote-divoire          (11, 🟡, Création)
tva-cote-divoire-pme           (12, 🟡, Fiscalité)
creer-entreprise-ci-canada     (13, 🟡, Diaspora)
cabinet-comptable-plateau-abidjan (14, 🟡, Géo)
capital-minimum-sarl-ohada     (15, 🟡, Création)
cnps-cote-divoire-employeurs   (16, 🟢, Fiscalité)
compte-bancaire-entreprise-abidjan (17, 🟢, Création)
entreprise-individuelle-vs-sarl (18, 🟢, Création)
audit-comptable-obligatoire-ci (19, 🟢, Audit)
erreurs-creation-entreprise-ci (20, 🟢, Création)
```

### 2. `src/routes/guides.$slug.tsx` — nouvelle route dynamique placeholder

Nouveau fichier. Comportement :

- Importe la liste `ARTICLES` (ou réexportée depuis un nouveau module `src/lib/guides-data.ts` si besoin pour éviter une dépendance circulaire avec la route guides — à valider à l'implémentation, peut rester inline avec une réexport simple).
- Dans `head()` : si l'`slug` matche un article du plan → utilise `title` + `excerpt` pour title/description ; sinon métadonnées génériques + `noindex,nofollow` (placeholder vide ne doit pas être indexé).
- Dans `notFoundComponent` : 404 standard via `NotFoundPage`.
- Composant : 
  - Si slug inconnu → `<NotFoundPage />`.
  - Si slug connu → page placeholder avec :
    - breadcrumb Accueil > Guides > {title}
    - H1 = title
    - badge catégorie(s)
    - encart « Article en cours de rédaction » + CTA « Demander une soumission » + CTA secondaire « Voir les autres guides ».
    - Lien « ← Retour aux guides ».

Tous les liens existants depuis `/guides` (`/guides/${slug}`) cessent donc de renvoyer 404 et présentent une page utile avec la bonne méta (noindex tant qu'il n'y a pas de contenu).

### 3. Module partagé `src/lib/guides-data.ts` (nouveau)

Pour éviter le couplage route↔route, déplacer `ARTICLES`, le type `Article`, le type `Category`, et `FILTERS` dans `src/lib/guides-data.ts` et l'importer depuis `guides.tsx` ET `guides.$slug.tsx`. Helper `getArticleBySlug(slug)`.

## Hors périmètre

- Pas de rédaction du contenu des articles (à venir, 2/semaine selon la cadence définie).
- Pas de schéma `Article` JSON-LD ni d'images de header par guide tant qu'il n'y a pas de contenu réel (placeholder = noindex).
- Pas de sitemap update : `/guides/$slug` placeholders ne doivent pas être listés (resteront à ajouter article par article lorsque rédigés).
- Pas de version EN des guides.
