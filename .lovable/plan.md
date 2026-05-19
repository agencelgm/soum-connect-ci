# Plan — SoumissionsComptables (scaffold initial)

Mise en place du squelette de l'application : design system, routing complet, placeholders par page, et état de langue FR/EN.

## Note technique importante

Ce projet utilise **TanStack Start** (pas React Router DOM, pas Vite+CRA classique). Tailwind v4 est configuré via `src/styles.css` (pas de `tailwind.config.js`). J'adapte donc la demande au stack réel sans changer l'intention :

- Routing : fichiers sous `src/routes/` (file-based routing TanStack), navigation via `<Link>` de `@tanstack/react-router`
- Design tokens : déclarés dans `src/styles.css` via `@theme` + variables CSS (équivalent fonctionnel de la config Tailwind demandée)
- Polices Poppins + Inter : importées via Google Fonts dans `src/styles.css`
- Toutes les autres libs demandées (React Hook Form, Lucide, Shadcn/UI) sont déjà disponibles ou installables

Si tu préfères absolument React Router DOM + tailwind.config.js, dis-le moi avant que je lance le build (cela impliquerait de remplacer toute la couche routing).

## 1. Design system (`src/styles.css`)

Ajout des tokens demandés, convertis en `oklch` pour rester cohérent avec le template :

- `--primary` (#1B3A6B), `--primary-dark` (#152D55)
- `--secondary` (#F4732A — utilisé comme CTA), `--secondary-dark` (#E05B15)
- `--accent` (#10B981)
- `--background` (#F8FAFC), `--background-alt` (#F1F5F9)
- `--foreground` (#0F172A), `--muted-foreground` (#475569)
- `--border` (#E2E8F0)
- Foregrounds adaptés (blanc sur primary/secondary/accent)
- Polices : `--font-heading: "Poppins"`, `--font-sans: "Inter"`, déclarées dans `@theme inline` pour exposer `font-heading` / `font-sans` côté Tailwind
- Import Google Fonts (Poppins 400/600/700, Inter 400/500/600) en haut de `styles.css`
- Application globale : `body` en Inter, `h1–h6` en Poppins
- Variable `--container-max: 1200px` + utilitaire `.container-app` (max-width 1200px, padding responsive)
- Variable `--section-py` (80px desktop / 40px mobile) + utilitaire `.section`

## 2. Contexte de langue (FR par défaut)

Création de `src/lib/language-context.tsx` :

- `type Language = "fr" | "en"`
- `LanguageProvider` avec état `language` (default `"fr"`) + `toggleLanguage()` + `setLanguage()`
- Hook `useLanguage()`
- Provider monté dans `src/routes/__root.tsx` autour du `<Outlet />` (à l'intérieur du `QueryClientProvider` existant)
- Persistance simple dans `localStorage` (clé `lang`)

## 3. Layout racine partagé

Mise à jour de `src/routes/__root.tsx` pour wrapper l'`<Outlet />` dans un layout commun :

- `<Header />` : logo "SoumissionsComptables", nav vers les pages principales, bouton CTA "Demander des soumissions" (→ `/demande-soumissions`), toggle langue FR/EN à droite
- `<Footer />` : liens secondaires (À propos, FAQ, Guides, Cabinets partenaires), mentions
- Composants extraits dans `src/components/layout/Header.tsx` et `Footer.tsx`
- Nav responsive (menu hamburger mobile via Sheet de shadcn)

Toute l'UI est en français.

## 4. Routes (file-based, `src/routes/`)

Création d'un fichier par route, chacun avec :

- `createFileRoute("/...")` + `head()` (title + description FR uniques, pertinents SEO local Côte d'Ivoire)
- Un composant placeholder structuré : `<section class="section container-app">` avec `<h1>` = nom lisible de la page + courte phrase descriptive en français

Liste des fichiers à créer / mettre à jour :

| Fichier | URL |
|---|---|
| `src/routes/index.tsx` (remplace placeholder) | `/` |
| `src/routes/comment-ca-marche.tsx` | `/comment-ca-marche` |
| `src/routes/demande-soumissions.tsx` | `/demande-soumissions` |
| `src/routes/faq.tsx` | `/faq` |
| `src/routes/a-propos.tsx` | `/a-propos` |
| `src/routes/creation-entreprise-cote-divoire.tsx` | service |
| `src/routes/comptabilite-entreprise-abidjan.tsx` | service |
| `src/routes/declaration-fiscale-cote-divoire.tsx` | service |
| `src/routes/domiciliation-entreprise-abidjan.tsx` | service |
| `src/routes/cabinet-comptable-abidjan.tsx` | géo |
| `src/routes/creation-entreprise-diaspora-ivoirienne.tsx` | diaspora |
| `src/routes/cabinets-comptables-partenaires.tsx` | partenaires |
| `src/routes/guides.tsx` | blog hub |

`routeTree.gen.ts` est régénéré automatiquement par le plugin Vite — je n'y touche pas.

## 5. Page `/demande-soumissions` (placeholder un peu plus complet)

Comme c'est la page de conversion principale, je pose dès maintenant la structure d'accueil (h1, sous-titre, encart "formulaire à venir") sans implémenter encore le vrai formulaire React Hook Form — ce sera un milestone dédié pour respecter le scope demandé ici (scaffold uniquement).

## 6. Hors scope de ce milestone

Pour rester strictement dans la demande "scaffold + routing + design system" :

- Pas de formulaire de soumission fonctionnel (juste la page placeholder)
- Pas de contenu rédactionnel détaillé par page
- Pas de backend / Lovable Cloud
- Pas de vraies traductions EN (le toggle est branché, mais les chaînes restent FR — les traductions viendront avec le contenu)
- Pas encore de modèle de données (Produit/Site, Opportunité, Initiative, Demande de support) — à traiter dans un milestone "data model" séparé

Confirme et je lance l'implémentation.
