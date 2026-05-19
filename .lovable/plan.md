# Plan — Homepage `/` for SoumissionsComptables.ci

## Goal
Replace the current placeholder `src/routes/index.tsx` with a complete French homepage matching the detailed brief: 7 ordered sections, mini lead-capture form in hero, semantic HTML, and updated SEO metadata.

## Files

### 1. `src/routes/index.tsx` (rewrite)
Single route file holding all 7 sections. Updated `head()`:
- title: "Cabinet Comptable Côte d'Ivoire | Comparez 5 Soumissions Gratuitement | SoumissionsComptables.ci"
- description: full FR meta as specified
- og:title / og:description / og:url=`/` / canonical=`/`

Component renders `<main>` with 7 `<section>` blocks in order.

### 2. `src/components/home/LeadFormCard.tsx` (new)
Extract the hero mini-form into its own client component to keep `index.tsx` readable.
- Uses `react-hook-form` (already in stack) with local state
- Fields: service (Select), city (Select), fullName (Input), whatsapp (Input with +225 prefix via flex-row addon), email (Input)
- Submit handler: for now, `console.log` + toast "Demande envoyée" (no backend yet — out of scope)
- Uses shadcn `Select`, `Input`, `Label`, `Button`

## Section breakdown

### S1 — Hero
- `<section>` full-bleed, `bg-[linear-gradient(135deg,#1B3A6B,#1a2f5a)]`, white text
- `.container-app` grid `lg:grid-cols-5`: left col `lg:col-span-3` (60%), right col `lg:col-span-2` (40%)
- Left: orange pill badge, H1 (text-3xl md:text-5xl font-heading font-bold), subtitle (text-lg/xl opacity-80), 3 trust badges (flex-wrap gap-4 with CheckCircle icons)
- Right: `<LeadFormCard />` (card hidden `lg:block` per spec — note: spec says "hidden on mobile in hero — show below"; we'll render it below the left column on mobile via order classes so it still appears, just below hero text)
- Social proof line under card: "⭐ 4.8/5 · 127 soumissions envoyées ce mois"

### S2 — Comment ça marche
- White bg, `.section .container-app`
- H2 centered + subtitle
- Grid `md:grid-cols-3 gap-6`, each card: white, border, rounded-xl, p-8, centered
- Number badge (absolute top-right orange circle), Lucide icon (FileText / Users / CheckCircle) in navy circle bg
- Centered orange CTA button below → `/demande-soumissions`

### S3 — Nos Services
- `bg-[#F8FAFC]`
- H2 + subtitle centered
- Grid `md:grid-cols-2 lg:grid-cols-3 gap-6`, 6 cards
- Each: white, rounded-xl, border `#E2E8F0`, hover:shadow-lg transition, icon in orange-100 circle with orange icon, title, 2-line description, "En savoir plus →" Link in primary
- Note: routes `/audit-comptable-cote-divoire` and `/conseil-juridique-abidjan` do not exist yet — links will 404. Listed as out-of-scope; will use plain `<a>` href to avoid TS errors from typed `<Link to>` and add a TODO comment.

### S4 — Pour Qui
- White bg
- H2 centered
- Grid `md:grid-cols-2 lg:grid-cols-4 gap-6`, 4 columns, each with large emoji, bold title, description

### S5 — Statistiques
- Same navy gradient as hero, white text
- Grid `grid-cols-2 md:grid-cols-4`, each stat: large number (text-4xl font-bold orange), label below

### S6 — FAQ Rapide
- `bg-[#F8FAFC]`
- H2 centered
- shadcn `Accordion type="single" collapsible` with 5 items (Q1–Q5 verbatim)
- Link below: "Voir toutes les questions →" → `/faq`

### S7 — CTA Final
- `bg-secondary` (#F4732A), white text, centered
- H2 + subtitle + white button with orange text → `/demande-soumissions`

## Technical details

- Use existing design tokens where possible (`text-primary`, `bg-secondary`, `.container-app`, `.section`). Hard-coded hex values only where the spec explicitly requires the gradient/bg color.
- All icons from `lucide-react`: `FileText, Users, CheckCircle, Building2, Calculator, FileCheck, MapPin, Search, Scale, ShieldCheck`.
- Mobile-first responsive: tested at 831px viewport (current preview) and below.
- Semantic: `<main>` is already in `__root.tsx`; page wraps each section in `<section aria-labelledby="...">` with H2s carrying matching ids. Step cards wrapped in `<article>`.
- No backend wiring — form submit is a stub.

## Out of scope (not built in this plan)
- Real form submission to a backend / database
- Translations (EN strings) — page is FR only per global rule
- Pages for `/audit-comptable-cote-divoire` and `/conseil-juridique-abidjan` (links present but will 404 until those routes are created)
- Real social-proof counter (hardcoded "127" / "4.8/5")
