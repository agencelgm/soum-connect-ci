## Nouveau composant `src/components/service/ServicePage.tsx`

Composant réutilisable pour toutes les pages de service. Props :
- `title: string` (H1)
- `heroSubtitle: string`
- `serviceIcon: LucideIcon`
- `mainContent: ReactNode`
- `faqs: { question: string; answer: string }[]`
- `relatedServices: { title: string; link: string; icon: LucideIcon }[]`
- `breadcrumb: { label: string; to?: string }[]` (pour affichage générique)

Note : `metaTitle` / `metaDescription` ne sont **pas** props du composant. En TanStack Start, le `head()` doit être défini dans le fichier route (`createFileRoute(...).head()`). On expose donc plutôt depuis le route file, et `ServicePage` ne gère que le visuel. Je le signale dans le code (commentaire) pour le pattern à réutiliser.

### Structure visuelle
- **Hero** `bg-[#F8FAFC]` :
  - shadcn `Breadcrumb` (Accueil > Services > …)
  - Icône (rond navy 56×56 avec `serviceIcon` blanc)
  - H1 (Poppins bold, `text-3xl md:text-5xl`, `text-primary`)
  - Sous-titre (`text-muted-foreground`, max-w-2xl)
  - CTA orange → `/demande-soumissions` : "Obtenir mes soumissions gratuitement →"
- **Layout principal** `.container-app .section grid lg:grid-cols-[1fr_300px] gap-10` :
  - Colonne gauche : `<article className="prose-like">{mainContent}</article>` puis bloc FAQ
  - Sidebar droite (`hidden lg:block sticky top-24`) : carte "Services associés" listant `relatedServices`, + mini carte CTA orange compacte
- **FAQ** : shadcn `Accordion` (type single, collapsible). Chaque item rendu avec ids stables. Schéma `FAQPage` JSON-LD injecté dans la route (pas le composant) via `head().scripts`.
- **Bannière CTA bas** : section pleine largeur `bg-secondary text-white`, H2 + bouton blanc texte orange.

### Bloc "Services associés" mobile
Sous le `mainContent`, en `lg:hidden`, on rend le même bloc pour ne pas pénaliser mobile.

## Route `src/routes/creation-entreprise-cote-divoire.tsx`

Réécriture : utilise `ServicePage` + définit `head()` avec :
- title, description fournis
- og:title, og:description, og:url, og:type "article" (page de service éditoriale — laisser défaut website convient aussi ; on garde `website`)
- `<link rel="canonical">`
- `scripts` JSON-LD : `HowTo` (5 étapes) + `FAQPage` (5 Q/R)

Props passées :
- `title` : "Création d'Entreprise en Côte d'Ivoire"
- `heroSubtitle` : texte fourni
- `serviceIcon` : `Building2` (Lucide)
- `breadcrumb` : Accueil → Services (`/cabinet-comptable-abidjan`) → Création d'entreprise
- `mainContent` : JSX avec Sections A→E :
  - A : paragraphe intro (CEPICI, OHADA, expertise comptable)
  - B : H2 + `<ol>` numérotée 5 étapes
  - C : H2 + tableau responsive (`<table>` stylé Tailwind, scroll-x sur mobile) SARL/SA/EI
  - D : H2 + liste à puces documents requis
  - E : H2 + paragraphe coût avec note CEPICI
- `faqs` : 5 Q/R fournies
- `relatedServices` :
  - Comptabilité générale → `/comptabilite-entreprise-abidjan` (icône `Calculator`)
  - Déclaration fiscale → `/declaration-fiscale-cote-divoire` (icône `Receipt`)
  - Domiciliation Abidjan → `/domiciliation-entreprise-abidjan` (icône `MapPin`)

## Aspects techniques
- Tokens du design system uniquement (`text-primary`, `bg-secondary`, `border-border`, `text-muted-foreground`, `.container-app`, `.section`).
- shadcn déjà disponibles : `Breadcrumb`, `Accordion`, `Button`. Lucide déjà installé.
- HTML sémantique : `<main>` au niveau route (déjà géré par layout ?) → on enveloppe dans `<main>` dans `ServicePage`, sections en `<section aria-labelledby>`.
- Aucune dépendance ajoutée. Aucune modif Header/Footer.