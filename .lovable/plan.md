## Ajouter un onglet « Blog » dans la navigation

### Objectif
Ajouter un onglet **Blog** dans le menu principal du header (desktop + mobile), pointant vers une nouvelle page `/blog` distincte des guides existants. La page affichera une section blog vide pour le moment (placeholder « Articles à venir bientôt »), prête à recevoir les futurs articles.

### Étapes

1. **Créer la route `/blog`** (`src/routes/blog.tsx`)
   - `createFileRoute("/blog")` avec `head()` SEO dédié (title, description, og)
   - Hero simple : titre « Blog » + sous-titre
   - Section « Articles à venir bientôt » (état vide élégant, cohérent avec le design du site)
   - Structure prête pour accueillir une grille d'articles plus tard (type `BlogPost`, liste vide à remplir)
   - Texte FR uniquement (règle projet)

2. **Ajouter le lien dans le Header** (`src/components/layout/Header.tsx`)
   - Ajouter `{ to: "/blog", label: t.nav.blog }` dans le tableau `NAV` (entre `howItWorks` et `faq`, ou avant `about`)
   - S'applique automatiquement au menu desktop et au menu mobile (les deux itèrent sur `NAV`)

3. **Ajouter la clé de traduction** (`src/lib/translations.ts`)
   - Ajouter `blog: "Blog"` dans `t.nav` (FR)
   - Ajouter `blog: "Blog"` côté EN également pour éviter une clé manquante (même si la page reste FR pour l'instant)

### Hors périmètre
- Pas de système CMS / base de données pour les articles (à voir plus tard)
- Pas de version `/en/blog` pour cette étape
- Pas de lien depuis le footer (peut être ajouté ensuite si souhaité)

### Question ouverte
Veux-tu que je pré-remplisse la page avec 2-3 articles d'exemple, ou simplement l'état « Articles à venir » pour démarrer ?
