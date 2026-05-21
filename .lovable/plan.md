## Restructurer les pages Guides comme un vrai article (hero + formulaire + image + contenu riche)

Reproduire la mise en page de la référence : bandeau vert avec titre à gauche et formulaire de demande à droite, fil d'Ariane, grande image hero, puis corps d'article structuré (paragraphes, H2, tableaux, callouts, listes).

### Périmètre
Uniquement les routes `/guides/$slug`. La page `/guides` (liste) et `/blog` ne changent pas.

### 1. Nouveau composant `ArticleLayout`
Fichier : `src/components/guides/ArticleLayout.tsx`

Structure :

```text
┌──────────────────────────────────────────────────────┐
│  HERO (bg primary vert)                              │
│  ┌──────────────────────┬──────────────────────┐     │
│  │ Titre H1 (blanc)     │  LeadFormCard        │     │
│  │ Sous-titre / excerpt │  (sticky desktop)    │     │
│  │ Badges catégories    │                      │     │
│  └──────────────────────┴──────────────────────┘     │
└──────────────────────────────────────────────────────┘
   Breadcrumb (Accueil > Guides > Titre)
┌──────────────────────────────────────────────────────┐
│            Image hero (max-w-4xl, rounded)           │
└──────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────┐
│  Corps article (prose, max-w-3xl centré)             │
│  - Intro                                             │
│  - H2 + paragraphes                                  │
│  - Tableau                                           │
│  - Callout                                           │
│  - H2 + listes                                       │
│  - CTA final vers /demande-soumissions               │
└──────────────────────────────────────────────────────┘
   RelatedLinks
```

Le composant accepte :
- `article` (titre, excerpt, categories, readTime)
- `heroImage` (string import)
- `children` (le contenu MDX-like en JSX)

Mobile : le formulaire passe sous le titre, l'image hero reste pleine largeur.

### 2. Sous-composants de contenu réutilisables
Dans `src/components/guides/article-blocks.tsx` :
- `<ArticleSection title="...">` — H2 + paragraphes
- `<ArticleTable headers={[...]} rows={[[...]]} />` — tableau stylé (bordures, header coloré)
- `<ArticleCallout variant="info|warning|tip">` — encadré coloré (style identique au callout vert de la référence)
- `<ArticleList items={[...]} />` — liste à puces stylée
- `<ArticleCTA />` — bloc CTA final standardisé vers le formulaire

Ces blocs utilisent les tokens du design system (primary, secondary, border, muted) — aucun hex en dur.

### 3. Données enrichies
Étendre `src/lib/guides-data.ts` :
- Ajouter `image?: string` (chemin de l'image hero) au type `Article`
- Ajouter `content?: () => ReactNode` optionnel pour le contenu rédigé

Les articles sans `content` continuent d'afficher le placeholder existant. Au fil de l'eau on remplit `content` pour chaque guide rédigé.

### 4. Refonte de `src/routes/guides.$slug.tsx`
- Si `article.content` existe → render `<ArticleLayout article={...} heroImage={article.image}>{article.content()}</ArticleLayout>`
- Sinon → garder le placeholder actuel ("Article en cours de rédaction")
- Le `head()` retire le `noindex` quand le contenu existe (article indexable)

### 5. Premier article rédigé (démo)
Rédiger **`creer-sarl-cepici`** (priorité 1) comme exemple complet :
- Fichier dédié : `src/content/guides/creer-sarl-cepici.tsx` (contenu JSX)
- Image générée via IA : `src/assets/guides/creer-sarl-cepici.jpg` (16:9, illustration professionnelle d'un guichet CEPICI / documents d'entreprise, style éditorial cohérent avec le ton du site)
- Contenu : intro, sections (Étapes, Documents, Capital minimum, Délais, Coûts), tableau récap des coûts, callout "Bon à savoir", liste des erreurs fréquentes, CTA
- Respect strict de la mémoire : uniquement SARL/SARLU/SA/EI/GIE OHADA

### 6. SEO
- L'article rédigé : `head()` complet (title, description, og:image avec l'image hero, breadcrumb, JSON-LD `Article`)
- Retirer `noindex` pour les articles avec contenu

### Fichiers touchés
- `src/components/guides/ArticleLayout.tsx` (création)
- `src/components/guides/article-blocks.tsx` (création)
- `src/content/guides/creer-sarl-cepici.tsx` (création — contenu rédigé)
- `src/assets/guides/creer-sarl-cepici.jpg` (création — image IA)
- `src/lib/guides-data.ts` (ajout champs `image` + `content`, branche l'article rédigé)
- `src/routes/guides.$slug.tsx` (utilise `ArticleLayout` quand contenu présent + SEO ajusté)

### Suite (après validation)
Une fois le template validé sur `creer-sarl-cepici`, je rédige les autres guides par lots de priorité 1 (6 articles), puis priorité 2, puis 3. Chaque article = un fichier `src/content/guides/<slug>.tsx` + une image IA. Demande-moi simplement "rédige les guides P1 suivants" pour continuer.
