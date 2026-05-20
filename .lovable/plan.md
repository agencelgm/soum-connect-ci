## Objectif

Refondre deux sections de la page d'accueil pour qu'elles ressemblent au visuel de référence envoyé : texte mieux organisé, intégré avec de vraies images créées sur mesure (cabinets comptables, équipes, bureaux Abidjan), et non plus des blocs de texte éparpillés avec des icônes génériques.

## Sections concernées

1. **Section 10 — Article SEO** (long bloc de texte avec gradients vides et icônes Lucide)
2. **Section 11 — Trust badges** (4 puces avec icônes rondes orange)

## Direction visuelle

Reproduire la structure de la référence (image jointe par l'utilisateur) :
- Texte en colonnes étroites façon magazine, alterné gauche/droite avec de **vraies photos** intégrées (pas de gradients vides avec une icône au centre)
- Images en orientations variées (portrait, paysage) pour créer un rythme éditorial
- Liste à puces avec coches vertes alignées
- Badge bas de section orange pleine largeur avec les 4 garanties (fusion section 11 dans le même bloc final, comme dans la référence)

## Images à générer (5 visuels)

Photos réalistes, ambiance Côte d'Ivoire / Abidjan, palette cohérente avec la marque (bleu marine + orange en accent) :

1. `seo-team-meeting.jpg` — équipe d'experts-comptables ivoiriens en réunion dans un bureau moderne d'Abidjan (paysage)
2. `seo-accountant-desk.jpg` — comptable au bureau avec ordinateur et documents fiscaux (portrait)
3. `seo-handshake-client.jpg` — poignée de main entre comptable et entrepreneur (paysage)
4. `seo-office-abidjan.jpg` — façade/intérieur cabinet professionnel à Abidjan (paysage)
5. `seo-entrepreneurs.jpg` — groupe de jeunes entrepreneurs ivoiriens souriants (portrait)

Style : photographie professionnelle, lumière naturelle, tons chauds, contexte africain authentique. Pas de stock générique occidental.

## Structure de la nouvelle section 10

```
┌────────────────────────────────────────────┐
│  H2 + sous-titre centrés                   │
├──────────────────┬─────────────────────────┤
│ Paragraphe intro │  [IMAGE 1 - paysage]    │
│ (P1 services)    │                         │
├──────────────────┴─────────────────────────┤
│  [IMAGE 2 portrait] │ "Vous avez le choix  │
│                     │  entre 3 types..."   │
│                     │  + liste 3 types     │
├─────────────────────┴─────────────────────┤
│  Paragraphe plateforme + listes besoins   │
│  en 2 colonnes, image 3 à droite          │
├────────────────────────────────────────────┤
│  [IMAGE 4] │ Avantages (liste cochée)     │
├────────────────────────────────────────────┤
│  Citation mission (blockquote)            │
├────────────────────────────────────────────┤
│  Bandeau orange final : 4 trust badges    │
│  (section 11 fusionnée ici)               │
└────────────────────────────────────────────┘
```

## Détails techniques

- Conserver tout le contenu textuel actuel (rien supprimé, juste réorganisé)
- Conserver i18n via `t.home2` et `h.seo*` / `h.trustBadges`
- Remplacer les `<div class="bg-gradient-to-br ...">` qui contiennent une icône Lucide par des `<img>` réelles avec `loading="lazy"`, `width`, `height`
- Garder les coches vertes Lucide (`CheckCircle`) — c'est cohérent avec la référence
- Responsive : empilement vertical en mobile, alternance 2 colonnes en `md:` et plus
- Fusionner section 11 (trust badges) dans le pied de section 10 sur fond orange pleine largeur, comme la référence

## Fichiers modifiés

- `src/routes/index.tsx` — refonte sections 10 et 11
- `src/assets/home/` — 5 nouvelles images générées

## Hors périmètre

- Pas de changement aux autres sections (hero, stats, services, FAQ, etc.)
- Pas de changement aux textes (traductions inchangées)
- Pas de changement à la page `/en`
