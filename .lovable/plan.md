## Objectif

Ajouter le JSON-LD `LocalBusiness` fourni à la signature schema.org du site, sans dupliquer l'`Organization` déjà émis sur chaque page par `buildPageHead`.

## Stratégie

1. **`src/lib/seo.ts`** — créer une constante exportée :

```ts
export const LOCAL_BUSINESS_SCHEMA: Schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  "@id": SITE_URL,
  description:
    "Plateforme de mise en relation entre entrepreneurs et cabinets comptables agréés en Côte d'Ivoire.",
  url: SITE_URL,
  areaServed: [
    { "@type": "City", name: "Abidjan" },
    { "@type": "Country", name: "Côte d'Ivoire" },
  ],
  availableLanguage: ["French", "English"],
  priceRange: "Gratuit",
  serviceType: "Mise en relation cabinets comptables",
};
```

2. **Où l'injecter** — uniquement sur les pages à intention locale Abidjan / CI, via `extraSchemas` dans leur `buildPageHead`. On évite de l'ajouter sitewide (le root n'émet pas de JSON-LD ; c'est `buildPageHead` qui le fait, et dupliquer LocalBusiness sur 100 % des pages dilue le signal).

Pages cibles :
- `src/routes/index.tsx` (accueil FR)
- `src/routes/en/index.tsx` (accueil EN)
- `src/routes/cabinet-comptable-abidjan.tsx`
- `src/routes/en/accounting-firm-abidjan.tsx`
- `src/routes/comptabilite-entreprise-abidjan.tsx`
- `src/routes/domiciliation-entreprise-abidjan.tsx`

Chaque page importera `LOCAL_BUSINESS_SCHEMA` et l'ajoutera à son tableau `extraSchemas` existant (à côté de `faqSchema`, `howToSchema`, etc.). Aucune autre modification de la `head()`.

## Hors périmètre

- Pas d'ajout sur les pages génériques (FAQ, à-propos, guides, comment-ça-marche, partenaires, diaspora, déclaration fiscale, création d'entreprise) — pas pertinent localement.
- Pas de changement à `ORG_SCHEMA` (Organization sitewide reste l'identité officielle ; LocalBusiness s'ajoute en complément sur les pages locales).
- Pas d'`address` postale ajoutée ici (l'adresse Angré Château / camp militaire est déjà dans le footer/translations ; le template fourni n'inclut pas `address`, on respecte le scope du template).
