## Objectif
Améliorer 4 aspects des articles de guides (`/guides/$slug`) : mobile, SEO structuré, expérience de lecture, et maillage interne.

## 1. Fil d'Ariane + bouton « Retour aux articles » mobile-friendly
Fichier : `src/components/guides/ArticleLayout.tsx`
- Bouton « Retour aux articles » : pleine largeur sur mobile (`w-full sm:w-auto`), centré, hauteur tactile (min 44px), icône bien alignée.
- Fil d'Ariane : passer en taille `text-xs` strict sur mobile, autoriser le wrap propre, tronquer le titre de l'article sur 1 ligne avec `truncate` au lieu de `line-clamp-1` qui peut casser le flex.
- Espacements verticaux compacts sur mobile (`pt-4 pb-2`), plus aérés en md+.

## 2. JSON-LD enrichi + Title/Meta auto-optimisés
Fichier : `src/routes/guides.$slug.tsx`
- Enrichir le schéma `Article` existant : ajouter `author` (Organization SoumissionsComptables.ci), `publisher` (avec logo), `datePublished` / `dateModified` (à dériver d'un nouveau champ `publishedAt` / `updatedAt` ajouté dans `guides-data.tsx` — fallback à une date par défaut si absent), `inLanguage: "fr-CI"`, `articleSection` (1ère catégorie), `keywords`.
- Ajouter un schéma `BreadcrumbList` JSON-LD (Accueil → Blog → Article).
- Si l'article contient des FAQ (présence détectable via un nouveau champ optionnel `faq?: {q,a}[]` dans `Article`), ajouter `FAQPage` JSON-LD. Sinon, on saute proprement.
- Title auto-optimisé : tronquer intelligemment pour rester < 60 caractères (format `{title} | SoumissionsComptables.ci`, si trop long → titre seul).
- Meta description auto-optimisée : tronquer à 155 caractères max sur un mot complet + « … ».
- Helpers ajoutés dans `src/lib/seo.ts` (`truncateTitle`, `truncateDescription`).

## 3. Barre de progression de lecture
Nouveau composant : `src/components/guides/ReadingProgressBar.tsx`
- Barre fine (`h-1`) fixée tout en haut (`fixed top-0 left-0 right-0 z-50`), couleur `bg-secondary` sur fond translucide.
- Calcule le `scrollTop / (scrollHeight - innerHeight)` via un listener `scroll` + `requestAnimationFrame` pour la perf.
- Intégrée dans `ArticleLayout.tsx` (donc active sur tous les articles rédigés automatiquement).
- Accessible : `role="progressbar"`, `aria-valuenow`.

## 4. Section « Articles similaires »
Nouveau composant : `src/components/guides/RelatedArticles.tsx`
- Affiche 3 cartes d'articles (image, catégorie, titre, extrait court, temps de lecture, lien).
- Logique de sélection dans `src/lib/guides-data.tsx` : nouvelle fonction `getRelatedArticles(currentSlug, limit=3)` qui privilégie les articles partageant ≥ 1 catégorie, puis complète avec les plus récents si pas assez.
- Exclut l'article courant et les articles sans contenu (`!a.content`).
- Intégrée dans `src/routes/guides.$slug.tsx`, **avant** le bloc `RelatedLinks` existant (qui pointe vers les services), pour avoir : Article → Articles similaires (blog) → Pages liées (services).
- Style cohérent avec la grille existante des `/guides` (cards blanches, ombre légère, hover subtil).

## Détails techniques
- Aucune modification de schéma DB ni de backend.
- `publishedAt`/`updatedAt` ajoutés au type `Article` comme champs optionnels ; fallback `"2026-01-01"` si non renseigné, pour ne pas avoir à modifier chaque article d'un coup.
- La barre de progression n'apparaît que sur les articles **rédigés** (`article.content` présent), pas sur les placeholders.
- Tous les nouveaux textes UI en français.

## Aperçu du rendu
- Mobile : bouton retour large et tappable, fil d'Ariane lisible sans débordement.
- Au scroll d'un article : fine barre verte progresse en haut.
- Snippet Google enrichi (auteur, date, fil d'Ariane).
- Sous chaque article : « Articles similaires » avec 3 cartes, puis « Pages liées ».
