## Objectif

Rendre cliquables et lisibles les 6 articles **priorité 1** du blog qui affichent actuellement la page placeholder "Article en cours de rédaction".

La carte reste cliquable uniquement via le lien "Lire la suite" (comportement actuel conservé, comme demandé).

## Articles à rédiger

Slugs ciblés (tous priorité 1, déjà listés dans `src/lib/guides-data.tsx`) :

1. `sarl-sa-ei-cote-divoire` — SARL vs SA vs EI : quel statut choisir ?
2. `calendrier-fiscal-ci-2026` — Calendrier fiscal 2026 (TVA, IS, DSF, CNPS, patente)
3. `cout-cabinet-comptable-abidjan` — Combien coûte un cabinet comptable à Abidjan ?
4. `creer-entreprise-ci-depuis-france` — Créer son entreprise en CI depuis la France (diaspora)
5. `impots-entreprise-cote-divoire` — Quels impôts paye une entreprise en CI ?
6. `choisir-cabinet-comptable-abidjan` — Comment choisir son cabinet comptable à Abidjan ?

(`creer-sarl-cepici`, le 7ᵉ priorité 1, est déjà rédigé.)

## Structure SEO/AEO/GEO appliquée à chaque article

Conforme au cahier des charges fourni :

- **Longueur** : 1 200 – 1 500 mots
- **Title tag** : 50–60 caractères, mot-clé principal en tête
- **Meta description** : 150–160 caractères, déjà gérée via `buildPageHead` dans `guides.$slug.tsx`
- **H1** : unique (titre de l'article, déjà rendu par `ArticleLayout`)
- **H2** : 4–6, **formulés comme questions** (AEO)
- **Première phrase sous chaque H2** : réponse directe et concise (30–50 mots)
- **Paragraphes courts** : 2–4 phrases
- **Listes à puces** : au moins 2 par article (featured snippets)
- **FAQ finale** : 3–5 questions fréquentes en H3 sous une section "Questions fréquentes"
- **Maillage interne** : 3 liens minimum vers `/demande-soumissions`, `/comment-ca-marche`, `/cabinet-comptable-abidjan`, `/declaration-fiscale-cote-divoire`, autres guides pertinents, etc.
- **Mots-clés** : principal dans title + H1 + 1er paragraphe + conclusion ; densité ~1–2 %
- **Citations / contexte local** : 2–3 sources (CEPICI, DGI, OHADA, CNPS, OECCA-CI) + mentions Côte d'Ivoire / Abidjan / quartiers
- **Image hero** : 1 image générée par article, nom fichier descriptif, alt text avec mot-clé
- **Ton conversationnel** + définitions des termes techniques (DFE, RCCM, SYSCOHADA, etc.)
- **Cohérence droit OHADA** : uniquement SARL, SARLU, SA, EI, GIE (jamais SAS/SASU/EIRL/micro-entrepreneur)

## Changements techniques

```text
src/content/guides/
  sarl-sa-ei-cote-divoire.tsx              (nouveau)
  calendrier-fiscal-ci-2026.tsx            (nouveau)
  cout-cabinet-comptable-abidjan.tsx       (nouveau)
  creer-entreprise-ci-depuis-france.tsx    (nouveau)
  impots-entreprise-cote-divoire.tsx       (nouveau)
  choisir-cabinet-comptable-abidjan.tsx    (nouveau)

src/assets/guides/
  sarl-sa-ei.jpg                           (nouveau, généré)
  calendrier-fiscal-2026.jpg               (nouveau, généré)
  cout-cabinet-abidjan.jpg                 (nouveau, généré)
  diaspora-france-ci.jpg                   (nouveau, généré)
  impots-entreprise-ci.jpg                 (nouveau, généré)
  choisir-cabinet-abidjan.jpg              (nouveau, généré)

src/lib/guides-data.tsx                    (édité)
  → pour chacun des 6 articles : ajout des champs `image` (import) et
    `content` (composant) — le reste inchangé.
```

Chaque contenu utilise les blocs existants `ArticleSection`, `ArticleList`, `ArticleTable`, `ArticleCallout`, `ArticleCTA` (déjà disponibles dans `src/components/guides/article-blocks.tsx`).

### Effets automatiques (rien à coder en plus)

- La route `/guides/<slug>` détecte la présence de `content` et affiche `ArticleLayout` au lieu du placeholder.
- L'article passe automatiquement de `noindex` à indexable (logique déjà présente dans `src/routes/guides.$slug.tsx`).
- L'image hero est utilisée à la fois en visuel d'article et en `og:image` via `buildPageHead`.
- Les cartes du blog `/guides` continuent à pointer vers `/guides/<slug>` via "Lire la suite" — désormais elles ouvrent un vrai article au lieu du placeholder.

## Hors périmètre

- Les 13 autres articles (priorité 2 et 3) — feront l'objet d'une itération suivante.
- Carte 100 % cliquable — explicitement refusé.
- Refonte visuelle de `ArticleLayout` ou des blocs d'article.
- Création de nouvelles routes ou modifications du `route-map`.
