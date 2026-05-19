## Objectif

Pass final de polissage : performance, accessibilité, mobile, intégrations marketing (WhatsApp, sticky CTA), et fichiers SEO (sitemap, robots, llms.txt, 404).

## Constat

- Aucune balise `<img>` n'est utilisée dans `src/` — les images sont des SVG inline et `og-image.png` est servi statiquement. Donc `loading="lazy"` / `width` / `height` n'a pas vraiment d'application sur la base actuelle. À documenter, pas à appliquer aveuglément.
- Pas de chargement de données client → pas de squelettes nécessaires (les pages sont statiques/SSR).
- Pas de Google Fonts via `<link>` détecté ; les polices viennent de Tailwind/styles.css. On ajoutera quand même les `preconnect` standards si une font Google est utilisée (à vérifier dans `src/styles.css`).
- Pas de `public/robots.txt`, pas de sitemap.
- Le 404 actuel est en anglais dans `__root.tsx` et générique.

## Changements

### 1. Performance & en-tête HTML (`src/routes/__root.tsx`)
- Ajouter `preconnect` vers `https://fonts.googleapis.com` et `https://fonts.gstatic.com` (crossOrigin) dans `head().links` — bénéfique si fonts Google chargées via CSS `@import`.
- Vérifier `src/styles.css` — si `@import url("https://fonts.googleapis.com/...")` est utilisé, garder ; sinon les preconnect restent inoffensifs.
- Pas d'ajout de `loading="lazy"` (aucun `<img>` dans le code).

### 2. Accessibilité
- Ajouter un lien **Skip to main content** en haut de `RootComponent` (`__root.tsx`), visible au focus, ciblant `#main`. Ajouter `id="main"` et `tabIndex={-1}` au `<main>`.
- Audit rapide des icônes Lucide actuellement utilisées dans composants nav/CTA : ajouter `aria-hidden="true"` quand purement décoratif (Header, Footer, AboutPage cards). Les SVG WhatsApp et X sont déjà OK.
- Boutons icon-only existants (toggle menu mobile) : déjà `aria-label="Menu"` ✅.
- Pas de refonte de contraste — palette tokens déjà conforme.

### 3. Mobile
- Toucher la `Header.tsx` toggle mobile : ajouter `min-h-11 min-w-11`.
- **Sticky CTA mobile** : nouveau composant `src/components/layout/MobileCtaBar.tsx`, rendu dans `RootComponent` :
  - barre orange (`bg-secondary`) fixée en bas, `lg:hidden`, full-width, hauteur 56px.
  - bouton « Obtenir mes soumissions → » (texte FR/EN via `useLanguage`).
  - lien vers `getCounterpart("/demande-soumissions", lang)`.
  - Padding bottom global sur `<main>` en mobile (`pb-16 lg:pb-0`) pour compenser.
  - Masqué quand on est *déjà* sur la page de demande de soumissions.

### 4. WhatsApp flottant
- Nouveau composant `src/components/layout/WhatsAppFab.tsx`, rendu dans `RootComponent` :
  - cercle `bg-[#25D366]`, 56×56, position `fixed bottom-20 right-4 lg:bottom-6 lg:right-6` (au-dessus du sticky CTA mobile).
  - SVG WhatsApp réutilisé du Header.
  - `href="https://wa.me/2250767009629?text=" + encodeURIComponent("Bonjour, je voudrais obtenir des soumissions de cabinets comptables.")`.
  - `aria-label="Contacter sur WhatsApp"` ; `target="_blank" rel="noopener noreferrer"`.
  - On utilise le numéro existant `+225 07 67 00 96 29` (déjà dans Header/About), pas le `22500000000` placeholder du brief — j'aligne sur le contact réel du site.

### 5. Sitemap (`src/routes/sitemap[.]xml.ts`)
- Server route TanStack qui renvoie XML.
- `BASE_URL = "https://soumissionscomptables.ci"`.
- Entries (toutes pages publiques découvertes dans `src/routes/`) :
  - `/` priority 1.0 changefreq weekly
  - `/comment-ca-marche`, `/faq`, `/a-propos`, `/cabinets-comptables-partenaires`, `/guides`, `/demande-soumissions` → 0.7 / monthly
  - Pages services (`/cabinet-comptable-abidjan`, `/comptabilite-entreprise-abidjan`, `/declaration-fiscale-cote-divoire`, `/domiciliation-entreprise-abidjan`, `/creation-entreprise-cote-divoire`, `/creation-entreprise-diaspora-ivoirienne`) → 0.8 / monthly
  - Pages EN miroir (`/en`, `/en/get-quotes`, `/en/about`, `/en/company-registration-ivory-coast`, `/en/accounting-firm-abidjan`) → 0.6 / monthly
  - `lastmod` = date de build (ISO).
- Pas de blog réel → catégorie 0.6 prévue pour futur ajout.

### 6. `public/robots.txt`
Contenu exact du brief, avec la directive `Sitemap: https://soumissionscomptables.ci/sitemap.xml`.

### 7. `public/llms.txt`
Contenu exact du brief (en français), inchangé.

### 8. Page 404 friendly
- Remplacer `NotFoundComponent` dans `__root.tsx` par un composant `src/components/pages/NotFoundPage.tsx` :
  - SVG simple inline d'un personnage perplexe (point d'interrogation flottant + visage rond minimaliste, design system tokens).
  - H1 « Oops, cette page n'existe pas » (FR par défaut, EN si langue EN détectée via pathname).
  - Sous-titre court.
  - Deux CTA : `Retour à l'accueil` (variant outline, vers `/`) et `Obtenir mes soumissions →` (variant secondary, vers `/demande-soumissions`).
  - Utilise les classes design system, responsive.
- Le composant lit la langue via `useLanguage`. Texte EN traduit dans `translations.ts` (nouvelle clé `notFound`).

## Hors scope
- Migration Google Fonts vers self-host : trop large.
- Squelettes : pas de fetch client à squeleter actuellement.
- Optimisation images : aucune `<img>` à toucher.

## Fichiers touchés

- `src/routes/__root.tsx` — skip link, preconnect, intégration FAB + sticky CTA, 404 component remplacé.
- `src/components/layout/Header.tsx` — `aria-hidden` sur icônes Lucide + min-h/min-w sur bouton menu.
- `src/components/layout/MobileCtaBar.tsx` *(nouveau)*.
- `src/components/layout/WhatsAppFab.tsx` *(nouveau)*.
- `src/components/pages/NotFoundPage.tsx` *(nouveau)*.
- `src/lib/translations.ts` — clés `notFound` + `mobileCta` FR/EN.
- `src/routes/sitemap[.]xml.ts` *(nouveau)*.
- `public/robots.txt` *(nouveau)*.
- `public/llms.txt` *(nouveau)*.
