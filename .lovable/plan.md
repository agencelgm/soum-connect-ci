## Objectif

Remplacer entièrement le contenu de l'article de blog `calendrier-fiscal-ci-2026` par le nouveau contenu fourni (long format, plus complet, avec FAQ étendue, tableau récapitulatif, sources officielles, conseils pratiques).

## Fichiers modifiés

### 1. `src/content/guides/calendrier-fiscal-ci-2026.tsx` (réécriture complète)

Restructurer le contenu avec les blocs existants (`ArticleSection`, `ArticleTable`, `ArticleCallout`, `ArticleList`, `ArticleCTA`) en suivant le plan suivant :

- **Intro** : paragraphe d'ouverture (importance du calendrier, public visé, villes CI)
- **Section** : Qu'est-ce qu'un calendrier fiscal ?
- **Section** : Pourquoi le calendrier fiscal est important pour une entreprise ?
- **Section** : Quelles sont les principales obligations fiscales en 2026 ?
- **Section** : Les déclarations mensuelles à suivre en 2026
  - Sous-parties : TVA (avec tableau régimes/DGE/DME), Impôts sur les salaires, Retenues à la source, Acomptes d'impôt
  - Conseils pratiques via `ArticleCallout`
- **Section** : Les états financiers (échéances 30 mai / 30 juin)
- **Section** : Contribution des patentes (dates mars/juillet)
- **Section** : Taxe d'État de l'entreprenant
- **Section** : Calendrier fiscal 2026 — grandes dates à retenir (`ArticleTable` Période / Obligations)
- **Section** : Comment préparer son calendrier fiscal en pratique ?
- **Section** : Quels documents préparer chaque mois ? (`ArticleList`)
- **Section** : Comment Soumissions Comptable peut vous accompagner ?
- **Section** : Quelles erreurs éviter en 2026 ? (`ArticleList`)
- **`ArticleCTA`** : déléguer le suivi fiscal
- **Section FAQ** : 7 questions (calendrier, dates uniformes, TVA, états financiers, patente, retard, accompagnement)
- **Section Sources officielles** : liens DGI, e-Impôts, 225Invest, FNE (liens externes `rel="noopener"`)
- **Conclusion**

### 2. Métadonnées SEO (`src/lib/guides-data.tsx`)

Vérifier/mettre à jour pour cet article :
- `title` : "Calendrier fiscal 2026 en Côte d'Ivoire : dates clés pour les entreprises"
- `excerpt` (utilisé comme meta description) : "Découvrez le calendrier fiscal 2026 en Côte d'Ivoire : TVA, ITS, BIC, BNC, patentes, déclarations fiscales et dates clés à respecter pour les entreprises."
- Garder le slug actuel `calendrier-fiscal-ci-2026` (l'URL souhaitée `calendrier-fiscal-2026-cote-divoire-entreprises` casserait les liens internes et le sitemap — je conserve le slug existant sauf indication contraire).

## Conformité mémoire projet

- Formes juridiques : seules SARL, SARLU, SA, EI, GIE sont mentionnées. Le contenu fourni ne mentionne que SARL / entreprise individuelle / PME — OK.
- UI en français — OK.
- Aucune image IA ajoutée.

## Points à confirmer

1. **Slug** : je garde `calendrier-fiscal-ci-2026` (changer casserait les liens et le SEO acquis). Souhaitez-vous quand même renommer en `calendrier-fiscal-2026-cote-divoire-entreprises` avec une redirection ?
2. **Tableau TVA** : l'ancien article avait un tableau "régime réel normal / simplifié". Le nouveau contenu détaille plutôt DGE/DME par activité (industrielle 10, commerciale 15, services 20). Je remplace par cette nouvelle structure plus précise.
