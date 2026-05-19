## Objectif

Étendre le système bilingue déjà en place pour que le toggle FR/EN dans l'en-tête traduise réellement le contenu de la page **À propos** (et ses métadonnées SEO), au lieu de renvoyer l'utilisateur sur `/en`. La même mécanique servira de patron pour les autres pages texte par la suite.

## Constat

- Le toggle FR/EN existe déjà dans `Header.tsx` et appelle `setLanguage`, qui navigue vers la contrepartie via `getCounterpart`.
- `/a-propos` n'est pas dans `ROUTE_PAIRS`, donc cliquer sur EN renvoie sur `/en` (perte de contexte).
- Le contenu de `/a-propos` est entièrement en français codé en dur dans `src/routes/a-propos.tsx`.
- L'infrastructure i18n (`translations.ts`, `useLanguage`, `buildPageHead` avec `lang` + `altPath`) est prête — il manque seulement le contenu et le routage miroir pour cette page.

## Changements

### 1. Contenu traduit centralisé
Dans `src/lib/translations.ts`, ajouter une section `about` (FR + EN) couvrant :
- Hero (h1, sous-titre)
- "Qui nous sommes" (titre + 3 paragraphes)
- "Notre Constat" (titre, intro, 3 cartes problème)
- "Nos Valeurs" (titre, intro, 3 cartes valeur)
- "L'Équipe" (titre, paragraphe LGM, lien)
- "Contact" (titre, intro, labels Email / WhatsApp / Adresse)
- CTA final (titre, sous-titre, bouton)
- Fil d'Ariane ("Accueil" / "Home", "À propos" / "About")
- Méta SEO (`metaTitle`, `metaDescription`)

Glossaire respecté : Accounting firm, CEPICI = Investment Promotion Center, OECCA-CI conservé tel quel.

### 2. Routage miroir
- Ajouter la paire `{ fr: "/a-propos", en: "/en/about" }` dans `src/lib/route-map.ts`.
- Créer `src/routes/en/about.tsx` qui réutilise le même composant page que `/a-propos` mais en mode EN.

### 3. Composant page partagé
Extraire le JSX actuel de `src/routes/a-propos.tsx` dans un composant partagé `src/components/pages/AboutPage.tsx` qui :
- Consomme `useLanguage()` pour récupérer `t.about` et l'utilise pour tout le texte visible.
- Les icônes Lucide, structure et styles restent inchangés.
- Le lien CTA final pointe vers `getCounterpart("/demande-soumissions", language)`.

Les deux fichiers de route (`/a-propos` et `/en/about`) restent fins :
- chacun appelle `buildPageHead` avec sa langue, son `path`, son `altPath`, son `breadcrumb` localisé, ses `metaTitle`/`metaDescription` traduits ;
- chacun rend `<AboutPage />`.

### 4. SEO
- Réutiliser `buildPageHead` existant. Sur `/a-propos` : `lang: "fr"`, `altPath: "/en/about"`. Sur `/en/about` : `lang: "en"`, `altPath: "/a-propos"`. Cela génère automatiquement `hreflang fr-CI / en / x-default` et `og:locale` corrects.
- Le titre EN suivra le format : *About SoumissionsComptables.ci | Our Mission*.
- La description EN reprendra la promesse : plateforme de mise en relation entre entrepreneurs et cabinets comptables agréés en CI.

## Hors scope (à ce stade)

- Pas de traduction des autres pages encore FR-only (FAQ, Guides, Comment ça marche, pages services secondaires, Diaspora, Partenaires) — elles continuent de retomber sur `/en` lors du switch, comportement actuel inchangé.
- Pas de modification du Header / Footer / formulaires (déjà bilingues).

## Fichiers touchés

- `src/lib/translations.ts` — ajout du bloc `about` FR + EN.
- `src/lib/route-map.ts` — nouvelle paire `/a-propos` ↔ `/en/about`.
- `src/components/pages/AboutPage.tsx` *(nouveau)* — composant rendu, lit `t.about`.
- `src/routes/a-propos.tsx` — devient un fichier mince : `head()` FR + render `<AboutPage />`.
- `src/routes/en/about.tsx` *(nouveau)* — pendant EN.
