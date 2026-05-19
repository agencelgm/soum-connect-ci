## Plan: Page Diaspora + Hub Guides

### Page 1 — `/creation-entreprise-diaspora-ivoirienne`

Réécriture complète du fichier existant en réutilisant le composant `ServicePage` (déjà utilisé pour les autres pages services) pour rester cohérent.

Props passées à `ServicePage` :
- `title` : "Créer votre Entreprise en Côte d'Ivoire depuis la France, Canada ou les USA"
- `metaTitle` / `metaDescription` : exactement le texte fourni
- `serviceIcon` : `Globe` (lucide)
- `heroSubtitle` : intro courte diaspora
- `relatedServices` : Création entreprise CI, Comptabilité Abidjan, Domiciliation Abidjan
- `faqs` : 5 FAQ diaspora (paiement à distance, présence physique, choix de banque, délais, frais cabinet mandataire) + injection JSON-LD `FAQPage`
- `mainContent` (JSX) avec les sections demandées :
  - A) Bloc rassurant "Oui, c'est possible depuis l'étranger" (~100 mots)
  - B) Liste "Ce que le CEPICI permet en ligne"
  - C) Bloc "Le rôle du cabinet mandataire"
  - D) Étapes 1→6 sous forme de timeline numérotée (réutilise le style steps déjà présent)
  - E) "Documents requis" — liste avec `CheckSquare` icônes (visuel checkbox, non interactif)
  - G) CTA bloc orange interne pointant vers `/demande-soumissions` ("Trouvez votre cabinet mandataire en CI")

Breadcrumb : Accueil > Création d'entreprise > Diaspora.

### Page 2 — `/guides` (Hub blog)

Réécriture du fichier `src/routes/guides.tsx` (placeholder actuel).

Structure :
- `head()` avec title/description fournis + canonical + og:url
- Hero compact (H1 + sous-titre)
- Tabs de filtre catégorie (composant shadcn `Tabs`) : Tous · Création d'entreprise · Comptabilité · Fiscalité · Diaspora
  - État local `useState` pour la catégorie active, filtrage côté client de la liste d'articles
- Article featured (le premier de la liste filtrée) : carte large avec badge catégorie, titre H2, excerpt, read time, lien "Lire la suite →"
- Grille 2 colonnes (desktop) / 1 colonne (mobile) pour les 7 autres
- Données : tableau `ARTICLES` statique avec les 8 entrées listées, chacune `{ slug, title, excerpt, category, readTime }`
  - Les liens "Lire la suite" pointent vers un `href` placeholder (`/guides/<slug>`) — les pages individuelles ne sont pas créées dans ce plan, seul le hub est demandé
- Catégories mappées : 1,2,6 = Création ; 3,5,7 = Comptabilité ; 4,8 = Fiscalité ; 6 = aussi Diaspora (l'article 6 sera marqué Diaspora pour que le filtre fonctionne)

### Détails techniques

- Composants shadcn utilisés : `Tabs`, `Card`, `Badge`, `Button`, `Accordion` (déjà installés)
- Icônes lucide : `Globe`, `CheckSquare`, `ArrowRight`, `Clock`, `MapPin`
- Pas de backend, pas de migration. Pas d'images (pas d'`og:image`).
- Tokens : `bg-primary`, `bg-secondary` (orange), `bg-background-alt`, `text-muted-foreground` — aucune couleur en dur.
- SSR-safe : pas d'accès `window` côté module ; `useState` est dans le composant client.

### Fichiers touchés

- `src/routes/creation-entreprise-diaspora-ivoirienne.tsx` (réécriture)
- `src/routes/guides.tsx` (réécriture)
