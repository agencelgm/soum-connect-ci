## Bilingual FR/EN System

Build on the existing `LanguageProvider` + `LangToggle` (already in `__root.tsx` and `Header`). Add a translations dictionary, mirror priority pages under `/en/*`, and sync language ↔ URL so the FR/EN toggle navigates between mirrored routes.

### 1. Translations dictionary — `src/lib/translations.ts`
Strongly typed `t(key, lang)` helper backed by a single object:
```
translations = {
  nav: { services, howItWorks, faq, about, partners, guides, getQuotes },
  services: { creation, accounting, tax, domiciliation, allServices },
  cta: { getQuotes, getQuotesNow, contactUs, submitRequest, readMore, ... },
  hero: { homeH1, homeSub, homeCTA, ... },
  process: { step1Title/Desc, step2..., step3... },
  form: { name, email, phone, company, service, message, placeholderX, submit, success, error },
  faq: { q1..qN, a1..aN },  // bilingual Q&A pairs
  footer: { tagline, rights, ... },
  common: { loading, required, ... }
}
```
French = current copy. English uses the glossary provided (Cabinet comptable → Accounting firm, CEPICI → Investment Promotion Center, etc.).

### 2. Language ↔ route mapping — `src/lib/route-map.ts`
Bidirectional table for the 4 priority pages + future ones:
```
fr "/"                               ↔ en "/en"
fr "/creation-entreprise-cote-divoire" ↔ en "/en/company-registration-ivory-coast"
fr "/cabinet-comptable-abidjan"      ↔ en "/en/accounting-firm-abidjan"
fr "/demande-soumissions"            ↔ en "/en/get-quotes"
```
Helpers: `getCounterpart(path, targetLang)`, `getLangFromPath(path)`.

### 3. Update `LanguageProvider`
- Derive language from URL pathname (`/en/*` → en, else fr) on every navigation, falling back to localStorage for ambiguous cases.
- `setLanguage(lang)` now also navigates to the counterpart route via `useRouter().navigate`.
- Expose `t(key)` shortcut bound to current language.

### 4. Header / LangToggle
- Toggle calls `setLanguage` which navigates to the mapped URL.
- Nav labels switch via `t()`. EN nav points to `/en/*` for the 4 mirrored routes; non-mirrored items keep FR routes (or are hidden in EN until translated).

### 5. English route files (mirror approach)
Create 4 thin route files that reuse the existing page components, passing `lang="en"`:
```
src/routes/en/index.tsx                              → "/en"
src/routes/en/company-registration-ivory-coast.tsx   → "/en/company-registration-ivory-coast"
src/routes/en/accounting-firm-abidjan.tsx            → "/en/accounting-firm-abidjan"
src/routes/en/get-quotes.tsx                         → "/en/get-quotes"
```
Each has its own `head()` built via `buildPageHead` with English title/description and `inLanguage: "en"`.

Refactor the 4 corresponding FR page components so all visible strings come from `t()` (currently hard-coded French). The same component renders both FR and EN — driven by `useLanguage()`. No content duplication.

English homepage H1: "Find the Best Accounting Firm in Côte d'Ivoire". English primary CTA: "Get My Free Quotes Now →".

### 6. hreflang alternates — extend `buildPageHead`
Add `alternates?: { fr?: string; en?: string }` option. For every mirrored page, emit:
```html
<link rel="alternate" hreflang="fr-CI" href={SITE_URL + frPath} />
<link rel="alternate" hreflang="en" href={SITE_URL + enPath} />
<link rel="alternate" hreflang="x-default" href={SITE_URL + frPath} />
```
Set `<html lang>` dynamically in `RootShell` via `useLanguage()` (fr-CI / en).

### 7. Schema localisation
- `WEBSITE_SCHEMA.inLanguage` becomes per-page (fr-CI default, en on /en/*).
- `FAQPage` schema on `/faq` stays FR; if EN FAQ added later, separate schema.

### Out of scope (this milestone)
- Translating FAQ, Guides, About, Partner, Diaspora, Comment ça marche, other service pages, Footer copy — only the 4 priority pages get full EN. Other pages stay FR-only; EN visitors landing on them see FR content (acceptable per brief).
- Backend search action.
- Sitemap.xml regeneration.

### Files
- New: `src/lib/translations.ts`, `src/lib/route-map.ts`, `src/routes/en/index.tsx`, `src/routes/en/company-registration-ivory-coast.tsx`, `src/routes/en/accounting-firm-abidjan.tsx`, `src/routes/en/get-quotes.tsx`
- Edit: `src/lib/language-context.tsx` (URL sync + `t` helper), `src/lib/seo.ts` (hreflang + inLanguage), `src/routes/__root.tsx` (dynamic `<html lang>`), `src/components/layout/Header.tsx` (translated labels, mapped toggle), `src/components/layout/Footer.tsx` (translated labels), and the 4 FR page components to consume `t()`.
