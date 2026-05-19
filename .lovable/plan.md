Réécrire `src/routes/demande-soumissions.tsx` en page de conversion focalisée avec un formulaire multi-étapes.

## SEO
- Title : "Demande de Soumissions | Cabinets Comptables CI | SoumissionsComptables.ci"
- Meta description fournie + og:title / og:description / og:url
- Canonical `/demande-soumissions`

## Layout
- Hero minimal (fond `bg-[#F8FAFC]`, H1 + sous-titre centrés, pas d'image)
- Bloc principal `.container-app .section` en grille `lg:grid-cols-[1fr_320px]` :
  - Colonne gauche (max-w-[640px]) : carte formulaire blanche, ombrée, arrondie
  - Colonne droite (desktop only, `hidden lg:block`) : sidebar trust signals

## Formulaire multi-étapes (client component)
- État local `step` (1→4) + `react-hook-form` avec `zodResolver` (zod déjà compatible)
- Schéma zod en 3 sous-schémas (un par étape) ; validation par étape via `trigger(['champs…'])`
- Barre de progression en haut de la carte : "Étape X sur 3" + barre `bg-secondary` largeur 33/66/100 %
- Transitions : wrapper avec `key={step}` et classe `animate-fade-in` (utilitaire existant) — léger slide via `translate-x` Tailwind

### Étape 1 — Votre besoin
- Select `service` (Required) avec les 7 options (emoji + libellé)
- Select `statut` (Required) — 3 options
- Textarea `description` (optionnel, placeholder fourni)
- Bouton "Suivant →" (orange)

### Étape 2 — Localisation
- Select `localisation` (Required) — 12 options (quartiers Abidjan, autre ville, diaspora)
- Select `delai` (Required) — 4 options
- Select `budget` (optionnel) — 5 options
- Boutons "← Retour" (outline) + "Suivant →" (orange)

### Étape 3 — Coordonnées
- Petit texte rassurant
- `nom` (text, Required, min 2)
- `whatsapp` (tel, Required, regex chiffres/espaces/+, min 8)
- `email` (email, Required)
- `entreprise` (text, optionnel)
- Checkbox `consent` (Required)
- Boutons "← Retour" + "Envoyer ma demande →" (gros bouton orange, full width)
- Sous le bouton : "🔒 Vos données sont confidentielles…"

### Étape 4 — Confirmation
- Affichée après submit réussi (pas de backend ici → simule `await new Promise` 500 ms, passe à step 4)
- Cercle vert avec icône `CheckCircle2` (Lucide)
- H2 "✅ Votre demande a été envoyée !"
- Paragraphe 48h WhatsApp + email
- Liste numérotée 3 étapes "Ce qui se passe ensuite"
- Boutons : Link "/" + Link "/cabinet-comptable-abidjan"

### Validation & UX
- Erreurs sous chaque champ en `text-destructive text-sm`
- Composants shadcn : `Input`, `Textarea`, `Select`, `Checkbox`, `Label`, `Button`
- Tous les labels en français, ARIA via `htmlFor`/`id`

## Sidebar trust (desktop)
- Carte blanche shadow avec liste : ⭐ 4.8/5, 🔒 données sécurisées, ✅ OECCA-CI, 📞 WhatsApp `+225 07 67 00 96 29` (lien `wa.me/2250767009629`)
- Carte témoignage Aya K., Abidjan

## Aspects techniques
- Aucune modification du Header/Footer (la consigne "no footer navigation" concerne la mise en page interne ; on garde le layout global du site)
- Aucune dépendance nouvelle (`react-hook-form`, `zod`, `@hookform/resolvers`, Lucide, shadcn déjà présents — à vérifier rapidement avant écriture, sinon `bun add` ce qui manque)
- Aucun appel backend : submit local + step 4. Une note de commentaire indiquera le point d'intégration futur.