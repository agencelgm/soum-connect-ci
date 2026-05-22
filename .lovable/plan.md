## Objectif
Remplacer le contenu de l'article "SARL vs SA vs Entreprise Individuelle en CI" par le texte complet fourni, avec mise à jour des métadonnées.

## Fichiers à modifier

### 1. `src/content/guides/sarl-sa-ei-cote-divoire.tsx` — réécriture complète
Composant `SarlSaEiContent` structuré avec les blocs existants :
- Intro
- `ArticleSection` : Pourquoi le choix du statut est important
- `ArticleSection` : Qu'est-ce qu'une entreprise individuelle / SARL / SA (3 sections)
- `ArticleSection` : Différence entre les trois
- `ArticleSection` : Pour qui est-ce adapté ? (EI / SARL / SA — `ArticleList`)
- `ArticleSection` : Démarrer seul / avec associés / inspirer confiance / niveau de comptabilité
- `ArticleTable` : tableau comparatif EI / SARL / SA
- `ArticleSection` : Comment Soumissions Comptable peut aider
- `ArticleSection` + `ArticleList` : Documents à garder
- `ArticleSection` + `ArticleList` + `ArticleCallout warning` : Erreurs à éviter
- `ArticleSection` : FAQ (8 Q/R)
- `ArticleSection` + `ArticleList` : Sources officielles (OHADA, RCCM OHADA, 225Invest, Service Public CI, eRegulations) — liens cliquables
- `ArticleSection` : Conclusion
- `ArticleCTA` final

Mémoire projet respectée : seules SARL, SA, EI mentionnées (pas de SAS/SASU/EIRL/micro-entrepreneur).

### 2. `src/lib/guides-data.tsx` — métadonnées
- `title` : "SARL vs SA vs Entreprise Individuelle en CI : quel statut choisir ?"
- `excerpt` : "SARL, SA ou entreprise individuelle en Côte d'Ivoire : découvrez les différences, avantages, limites, obligations et le meilleur statut selon votre projet."
- `readTime` : "11 min"
- **Slug** : conservé à `sarl-sa-ei-cote-divoire` pour préserver les liens existants (le slug demandé `sarl-sa-entreprise-individuelle-ci-statut` casserait l'URL actuelle sans bénéfice SEO).

## Validation
Naviguer vers `/guides/sarl-sa-ei-cote-divoire` après build, vérifier H1, sections, tableau comparatif et FAQ.
