## Plan — Page `/comment-ca-marche`

Remplace le placeholder existant `src/routes/comment-ca-marche.tsx` par une page complète en français suivant le brief.

### Fichier modifié
`src/routes/comment-ca-marche.tsx` (réécriture complète)

### Head / SEO
- `title`: "Comment Ça Marche | SoumissionsComptables.ci"
- `description`: brief verbatim
- `og:title`, `og:description`, `og:url=/comment-ca-marche`, `og:type=website`
- `links`: canonical `/comment-ca-marche`

### Structure (sémantique : `<section aria-labelledby>` + H2 avec ids)

**HERO** — `bg-[#F8FAFC]`, `.container-app .section`
- Breadcrumb : `<nav aria-label="breadcrumb">` avec composant shadcn `Breadcrumb` (Accueil → Comment ça marche), utilisant `<Link to="/">`
- H1 (Poppins Bold, text-3xl md:text-5xl, text-primary)
- Subtitle (text-lg text-muted-foreground)

**SECTION 1 — Processus détaillé** — fond blanc
- H2 centré "3 Étapes pour Recevoir vos Soumissions"
- 3 cards full-width empilées (`flex flex-col gap-6`), chacune `<article>` :
  - Layout `md:grid-cols-[auto_1fr]` : à gauche grand cercle navy avec numéro blanc (01/02/03) + icône Lucide en orange dessous ; à droite titre H3, description, liste à puces `<ul>` des détails, badge info (pill orange clair avec texte orange)
  - Icônes : `ClipboardList`, `MessageSquare`, `BarChart3`

**SECTION 2 — Pour vous rassurer** — `bg-[#F8FAFC]`
- H2 centré "Vos Questions, Nos Réponses"
- Grid `md:grid-cols-3 gap-6`, 3 cards blanches arrondies bordées : icône en haut (cercle orange clair), question en H3, réponse 2 phrases
  - 🔒 Sécurité : "Toutes vos données sont chiffrées et utilisées uniquement pour transmettre votre demande aux cabinets sélectionnés. Nous ne revendons jamais vos informations à des tiers."
  - 💰 Frais : "Le service est 100% gratuit pour vous. Les cabinets paient une commission uniquement si vous choisissez de travailler avec eux."
  - 📋 Obligation : "Non, absolument pas. Vous comparez les soumissions à votre rythme et vous êtes libre de ne retenir aucun cabinet si aucune offre ne vous convient."

**SECTION 3 — Pour qui** — fond blanc
- H2 centré "La Plateforme est Faite Pour..."
- Grid `md:grid-cols-2 lg:grid-cols-4 gap-6`, mêmes 4 personas que la home (cohérence) :
  - 🏢 Entrepreneurs & PME en Côte d'Ivoire
  - 🌍 Ivoiriens de la diaspora
  - 💼 Investisseurs étrangers
  - 🚀 Startups & créateurs d'entreprise
- Chaque card : grand emoji, titre bold, description courte

**SECTION 4 — CTA final** — `bg-secondary` (#F4732A), texte blanc, centré
- H2 "Prêt ? C'est gratuit et sans engagement"
- Sous-titre court
- Bouton blanc avec texte orange, taille `lg`, → `<Link to="/demande-soumissions">` "Recevoir mes soumissions →"

### Notes techniques
- Imports Lucide : `ClipboardList, MessageSquare, BarChart3, Shield, Wallet, FileCheck, Building2, Globe, Briefcase, Rocket`
- Tokens existants : `text-primary`, `bg-secondary`, `.container-app`, `.section` (cf. styles.css du projet)
- Tout en français
- Composant `Breadcrumb` shadcn déjà disponible dans `src/components/ui/breadcrumb.tsx`
- `<Link to="/demande-soumissions">` et `<Link to="/">` : routes existantes (pas d'erreur TS)

### Hors scope
- Pas de modification du Header/Footer
- Pas de nouveau composant extrait (page autonome, lisible d'un bloc)
- Pas de backend
