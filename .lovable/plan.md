# Plan — Header & Footer SoumissionsComptables

Refonte des composants `Header` et `Footer` existants pour matcher exactement la spec demandée. Le layout racine (`__root.tsx`) les wrappe déjà autour de toutes les routes — pas besoin de toucher au routing.

## Note technique

Le projet utilise **TanStack Start** (pas React Router DOM, pas d'`App.tsx`). Le « Layout wrapper appliqué à toutes les routes » est déjà en place dans `src/routes/__root.tsx` (Header + `<Outlet />` + Footer dans `RootComponent`). J'y touche uniquement si besoin de réglage mineur.

## 1. Header (`src/components/layout/Header.tsx` — réécriture)

Structure (sticky, fond blanc, border-bottom `#E2E8F0`, shadow légère au scroll-state via classe statique `shadow-sm`) :

- Container `max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4`
- **Gauche — Logo** : `<Link to="/">` avec icône Lucide `BarChart2` couleur `text-secondary` (#F4732A) + texte "SoumissionsComptables" en `font-heading font-bold text-primary`
- **Centre (desktop ≥ lg)** : `<nav>` `font-sans text-sm font-medium` avec :
  - Dropdown **Services** (shadcn `NavigationMenu` ou `DropdownMenu` — je pars sur `DropdownMenu` plus simple et plus prévisible visuellement) ouvert au hover/click, items :
    - Création d'entreprise → `/creation-entreprise-cote-divoire`
    - Comptabilité générale → `/comptabilite-entreprise-abidjan`
    - Déclaration fiscale → `/declaration-fiscale-cote-divoire`
    - Domiciliation Abidjan → `/domiciliation-entreprise-abidjan`
    - Séparateur + "Tous les services →" (lien vers `/cabinet-comptable-abidjan` qui fait office de hub services existant ; à confirmer s'il faut une vraie page `/services`)
  - Lien "Comment ça marche" → `/comment-ca-marche`
  - Lien "FAQ" → `/faq`
  - Lien "À propos" → `/a-propos`
- **Droite (desktop)** :
  - Toggle langue `FR | EN` (texte petit `text-xs text-muted-foreground`, langue active en `text-primary font-semibold`, séparateur `|`), branché sur `useLanguage().toggleLanguage()`
  - Bouton WhatsApp : fond vert `#25D366`, icône WhatsApp (Lucide n'a pas d'icône WhatsApp officielle → j'utilise `MessageCircle` colorée OU une petite SVG inline du logo WhatsApp ; je pars sur **SVG inline du glyphe WhatsApp** pour rester fidèle à la marque sans dépendance), texte "+225 XX XX XX XX", `rounded-lg`, `<a href="https://wa.me/225XXXXXXXX">`
  - CTA "Obtenir mes soumissions" : `bg-secondary text-white rounded-lg px-4 py-2 font-semibold hover:bg-secondary-dark`, lien vers `/demande-soumissions`
- **Mobile (< lg)** :
  - Hamburger (`Menu` / `X` Lucide) qui ouvre un **panneau slide-down** sous le header (animation `data-[state=open]:slide-in-from-top`, fond blanc, full width)
  - Le panneau liste : Services (sous-items dépliés en accordéon shadcn `Accordion` ou simple `<details>`), Comment ça marche, FAQ, À propos, le toggle FR/EN, le bouton WhatsApp et la CTA en pleine largeur

## 2. Footer (`src/components/layout/Footer.tsx` — réécriture)

- Fond `bg-[#0F172A]` (dark navy), texte `text-slate-300`, titres `text-white font-semibold`
- Container `max-w-[1200px] mx-auto px-6 py-12`
- Grille `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` :
  - **Colonne 1 — Marque** : Logo (BarChart2 orange + nom blanc), tagline "Trouvez le meilleur cabinet comptable en Côte d'Ivoire", icônes sociales `Facebook`, `Linkedin` (Lucide) + WhatsApp (SVG inline) dans une rangée, chacune `hover:text-secondary`
  - **Colonne 2 — Nos Services** : 6 liens (Création d'entreprise, Comptabilité, Déclaration fiscale, Domiciliation Abidjan, Audit comptable, Conseil juridique). Les deux derniers n'ont pas de route dédiée → liens vers `/cabinet-comptable-abidjan` (ou `#` si tu préfères ne rien casser ; je propose `/cabinet-comptable-abidjan` pour rester fonctionnel)
  - **Colonne 3 — Liens utiles** : Comment ça marche, FAQ, À propos, Cabinets partenaires, Guides & Ressources
  - **Colonne 4 — Contact** : icône `MessageCircle`/WhatsApp + "+225 XX XX XX XX", icône `Mail` + "contact@soumissionscomptables.ci", icône `MapPin` + "Abidjan, Côte d'Ivoire"
- **Barre du bas** :
  - `border-t border-slate-700`, container `py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-400`
  - Gauche : "© 2026 SoumissionsComptables.ci — Tous droits réservés"
  - Centre : "Politique de confidentialité | Conditions d'utilisation" (liens `#` placeholders puisque aucune route dédiée n'existe — je peux créer `/politique-confidentialite` et `/conditions-utilisation` si tu veux, dis-le moi)
  - Droite : "Une réalisation de LGM — Les Gens du Marketing"

## 3. Layout racine

`src/routes/__root.tsx` enveloppe déjà toutes les routes avec `<Header />` + `<main><Outlet /></main>` + `<Footer />` à l'intérieur du `LanguageProvider`. **Aucun changement nécessaire** sauf si l'audit révèle un souci.

## Hors scope

- Pas de vraies pages "Politique de confidentialité" / "Conditions d'utilisation" (liens `#` pour l'instant)
- Pas de vrai numéro WhatsApp (placeholder "+225 XX XX XX XX")
- Pas de page `/services` hub (le lien "Tous les services →" pointe sur `/cabinet-comptable-abidjan`, à arbitrer)
- Pas de traduction EN des libellés du header/footer (le toggle est branché, libellés restent FR comme convenu au scaffold)

Confirme et je lance l'implémentation.
