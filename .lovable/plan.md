## Plan : Page À Propos + SEO technique global

### PART A — `/a-propos`

Réécriture du fichier placeholder existant en une vraie page :

- `head()` avec title/description fournis exactement + og:* + canonical `/a-propos`
- 5 sections H2 sur une mise en page centrée (`container-app`, sections ~`py-12`) :
  1. **Qui nous sommes** — paragraphe ~150 mots
  2. **Notre Constat** — 3 cartes problèmes/solutions avec icônes lucide (`Search`, `ShieldCheck`, `Clock`) : opacité du marché, méfiance vis-à-vis des cabinets non agréés, démarches CEPICI complexes
  3. **Nos Valeurs** — 3 cartes (Transparence, Fiabilité, Accessibilité) avec icônes (`Eye`, `Award`, `Heart`)
  4. **L'Équipe Derrière le Projet** — bloc avec crédit LGM et lien externe `target="_blank" rel="noopener nofollow"` vers `https://lgm.ci`
  5. **Contact** — 3 cartes (Email `contact@soumissionscomptables.ci`, WhatsApp `+225 07 00 00 00 00`, Adresse `Plateau, Abidjan, Côte d'Ivoire`) avec icônes `Mail`, `MessageCircle`, `MapPin`
- CTA final orange vers `/demande-soumissions`

### PART B — SEO technique global

#### 1. Helper centralisé `src/lib/seo.ts`

Nouveau module exportant :

```ts
const SITE_URL = "https://soumissionscomptables.ci";

buildPageHead({
  path,            // ex: "/a-propos"
  title,
  description,
  ogImage?,        // défaut "/og-image.png"
  type?,           // défaut "website"
  breadcrumb?,     // [{name, path}]
  extraSchemas?,   // [Article, FAQPage, HowTo, …]
})
```

Retourne un objet `{ meta, links, scripts }` prêt à être renvoyé par `head()` contenant :

- title (meta entry, jamais top-level)
- description
- og:title, og:description, og:type, og:url (absolu), og:image (absolu), og:locale = `fr_CI`, og:site_name
- twitter:card = `summary_large_image`, twitter:title, twitter:description, twitter:image
- canonical → `${SITE_URL}${path}` (uniquement sur la feuille, jamais root)
- alternates `hreflang="fr"` (`${SITE_URL}${path}`), `hreflang="en"` (`${SITE_URL}/en${path}`), `hreflang="x-default"` (FR)
- JSON-LD Organization (toujours)
- JSON-LD BreadcrumbList si `breadcrumb` fourni
- N'importe quel schéma additionnel passé via `extraSchemas`

Le fichier exporte aussi `ORG_SCHEMA` brut pour réutilisation. Une seconde fonction `buildHomeHead(...)` ajoute le schéma `WebSite` + `SearchAction` (cible `/?q={search_term_string}`).

#### 2. Migration des routes existantes

Modification des `head()` de toutes les routes pour appeler `buildPageHead` :

- `src/routes/__root.tsx` — retire title/description/og placeholders "Lovable". Garde uniquement viewport + charset + `og:site_name` + `og:locale` par défaut (le helper réinjectera per-page). Pas de canonical au root (caveat dedupe).
- `src/routes/index.tsx` — `buildHomeHead(...)` (Organization + WebSite/SearchAction). Pas de breadcrumb (homepage exclue).
- Autres routes (a-propos, faq, comment-ca-marche, demande-soumissions, guides, cabinets-comptables-partenaires, cabinet-comptable-abidjan, comptabilite-entreprise-abidjan, declaration-fiscale-cote-divoire, domiciliation-entreprise-abidjan, creation-entreprise-cote-divoire, creation-entreprise-diaspora-ivoirienne) — `buildPageHead(...)` avec breadcrumb adapté.
- Les `scripts` JSON-LD existants (FAQPage, HowTo, LocalBusiness) sont passés via `extraSchemas` au lieu d'être déclarés à la main → un seul `<script type="application/ld+json">` par schéma, sans duplication d'Organization.

Aucun changement de contenu textuel : on conserve les title/description déjà définis par page (consigne du prompt).

#### 3. Fichier `public/og-image.png`

Placeholder créé (image générée 1200×630 simple, branding SoumissionsComptables.ci). Référence absolue dans le helper.

#### 4. Langue HTML

`__root.tsx` : `<html lang="fr">` au lieu de `"en"`.

### Fichiers touchés

- `src/lib/seo.ts` (nouveau)
- `src/routes/__root.tsx` (head + lang)
- `src/routes/a-propos.tsx` (réécriture complète)
- `src/routes/index.tsx` (head via buildHomeHead)
- `src/routes/{faq, comment-ca-marche, demande-soumissions, guides, cabinets-comptables-partenaires, cabinet-comptable-abidjan, comptabilite-entreprise-abidjan, declaration-fiscale-cote-divoire, domiciliation-entreprise-abidjan, creation-entreprise-cote-divoire, creation-entreprise-diaspora-ivoirienne}.tsx` (head migrés vers helper, contenu inchangé)
- `public/og-image.png` (nouveau, généré)

### Hors scope

- Pages `/en/*` réelles. Le hreflang anglais pointe vers une URL prévisible mais les pages n'existent pas encore. À créer dans un prompt dédié bilingue (mentionné dans le prompt comme PROMPT 12).
- Implémentation backend de la recherche du SearchAction (URL convention `?q=` posée pour Google, UI à venir).
