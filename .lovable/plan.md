ns# Plan — Interconnexion SEO/GEO/AEO de toutes les pages

## Objectif

Créer un **maillage interne fort** entre toutes les pages du site pour :
- **SEO** : faire circuler l'autorité (PageRank interne), aider Google à découvrir et hiérarchiser les pages
- **GEO** (Generative Engine Optimization) : donner aux LLM (ChatGPT, Perplexity, Claude) des chemins clairs pour comprendre la structure et citer le bon contenu
- **AEO** (Answer Engine Optimization) : relier les questions/réponses aux pages services et conversion

## État actuel (audit)

**Pages FR existantes (16)** :
- `/` (accueil)
- Services : `/creation-entreprise-cote-divoire`, `/comptabilite-entreprise-abidjan`, `/declaration-fiscale-cote-divoire`, `/domiciliation-entreprise-abidjan`
- Géo / Cabinets : `/cabinet-comptable-abidjan`, `/cabinets-comptables-partenaires`
- Diaspora : `/creation-entreprise-diaspora-ivoirienne`
- Conversion : `/demande-soumissions`
- Contenu : `/blog`, `/guides`, `/guides/$slug`, `/faq`, `/comment-ca-marche`, `/a-propos`

**Pages EN (5)** : `/en`, `/en/about`, `/en/get-quotes`, `/en/company-registration-ivory-coast`, `/en/accounting-firm-abidjan`

**Constats** :
- Le **Header** ne liste que 4 services + 4 liens nav → toutes les pages ne sont pas atteignables en 1 clic
- Le **Footer** couvre déjà bien les services et liens utiles ✅
- **Aucun lien contextuel** entre pages services (ex : page Comptabilité ne renvoie pas vers Fiscalité)
- **Pas de breadcrumbs visibles** (seulement dans JSON-LD)
- **Pas de bloc "Pages liées" / "Voir aussi"** en bas de page
- **FAQ** ne renvoie pas vers les pages services correspondantes
- **Guides** ne renvoient pas vers services/conversion
- Pas de liens entre Blog ↔ Guides ↔ Services
- `cabinets-comptables-partenaires` orphelin (uniquement dans footer)
- `creation-entreprise-diaspora-ivoirienne` orphelin du header

## Étape 1 (cette session) — Fondations du maillage

Périmètre limité et concret. On posera les briques réutilisables avant d'enrichir page par page.

### 1.1 Composant `<Breadcrumbs />` visible
- Nouveau composant `src/components/seo/Breadcrumbs.tsx`
- Affiché en haut de chaque page intérieure (sous le header)
- Format : `Accueil › Services › Création d'entreprise`
- Liens cliquables (sauf le dernier)
- Synchronisé avec le breadcrumb JSON-LD déjà présent dans `seo.ts`

### 1.2 Composant `<RelatedLinks />` (bloc "Voir aussi")
- Nouveau composant `src/components/seo/RelatedLinks.tsx`
- Bloc en bas de chaque page avec 3–4 liens contextuels vers pages connexes + 1 CTA vers `/demande-soumissions`
- Configurable par page (titre + liste de `{to, label, description}`)

### 1.3 Mapping des relations entre pages
- Nouveau fichier `src/lib/page-relations.ts`
- Définit pour chaque route : breadcrumb + pages liées (sémantiquement pertinentes)
- Exemple :
  - `/comptabilite-entreprise-abidjan` → liés : Fiscalité, Création, Cabinet Abidjan, Guides comptabilité
  - `/faq` → liens vers chaque service mentionné dans les questions
  - `/guides/$slug` → liens vers le service correspondant + 2 guides connexes

### 1.4 Intégration sur les 4 pages services + page géo
- Brancher Breadcrumbs + RelatedLinks sur :
  - `/creation-entreprise-cote-divoire`
  - `/comptabilite-entreprise-abidjan`
  - `/declaration-fiscale-cote-divoire`
  - `/domiciliation-entreprise-abidjan`
  - `/cabinet-comptable-abidjan`

### 1.5 Header — menu services étendu
- Ajouter dans le dropdown "Services" du header : `Cabinet comptable Abidjan`, `Création diaspora`, `Cabinets partenaires`
- Garantit que les pages orphelines sont atteignables depuis n'importe où

## Étapes suivantes (sessions futures, à valider après l'étape 1)

- **Étape 2** : Maillage des pages contenus (FAQ ↔ Services, Guides ↔ Services, Blog ↔ Guides)
- **Étape 3** : Liens contextuels *dans le corps* du texte (in-content linking, le plus puissant en SEO) — réécriture light des sections clés pour intégrer des liens naturels vers les pages cibles
- **Étape 4** : Bloc "Questions fréquentes" sur chaque page service (extrait de la FAQ ciblé) avec lien vers FAQ complète
- **Étape 5** : Pages EN — mirrorer la même logique de maillage en anglais
- **Étape 6** : JSON-LD avancé (`mentions`, `isPartOf`, `about`) pour expliciter les relations sémantiques aux LLM (GEO/AEO)
- **Étape 7** : Sitemap HTML public `/plan-du-site` (utile SEO + GEO)

## Détails techniques

- **Composants 100% frontend**, aucun changement backend
- Liens via `<Link to=...>` de TanStack Router (type-safe, preload)
- Tokens design existants (`text-secondary`, `bg-muted`, etc.) — pas de couleurs custom
- Tout en français (règle projet)
- Mapping centralisé pour éviter la duplication et faciliter l'évolution

## Livrable de l'étape 1

3 nouveaux fichiers (`Breadcrumbs.tsx`, `RelatedLinks.tsx`, `page-relations.ts`) + intégration sur 5 pages + extension du header. Résultat : chaque page service devient un **hub** qui renvoie vers ses voisines sémantiques, et chaque page est atteignable en ≤ 2 clics depuis n'importe quel point du site.
