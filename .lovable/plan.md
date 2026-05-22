## Objectif
Remplacer le contenu de l'article "Créer une SARL au CEPICI" par le texte complet fourni, avec mise à jour des métadonnées SEO.

## Fichiers à modifier

### 1. `src/content/guides/creer-sarl-cepici.tsx` (réécriture complète)
Réécrire le composant `CreerSarlCepiciContent` avec le contenu fourni, structuré via les blocs existants :
- Intro (paragraphe d'accroche)
- `ArticleSection` : Qu'est-ce qu'une SARL en Côte d'Ivoire ?
- `ArticleSection` : Pourquoi créer une SARL au CEPICI ?
- `ArticleSection` : Différence entre créer et enregistrer une SARL
- `ArticleSection` : Les 8 étapes (chaque étape comme sous-section)
- `ArticleSection` + `ArticleList` : Documents à préparer
- `ArticleCallout` : IDU
- `ArticleSection` : Délais (2 à 4 jours)
- `ArticleSection` : Pourquoi organiser la comptabilité dès le départ
- `ArticleSection` : Comment Soumissions Comptable accompagne
- `ArticleSection` + `ArticleList` : Documents à garder
- `ArticleSection` + `ArticleList` : Erreurs à éviter
- `ArticleSection` : FAQ (7 questions/réponses)
- `ArticleSection` : Sources officielles (CEPICI, 225Invest, eRegulations, Service Public CI)
- `ArticleCTA` final vers Soumissions Comptable

### 2. `src/lib/guides-data.tsx` (métadonnées)
- `title` : "Comment créer une SARL au CEPICI en 2026 : guide complet"
- `excerpt` : "Découvrez comment créer une SARL au CEPICI en 2026 : étapes, documents, RCCM, IDU, frais, délais et accompagnement comptable."
- `readTime` : "12 min"
- **Slug** : conserver `creer-sarl-cepici` (l'URL `/guides/creer-sarl-cepici` est déjà indexable et stable ; changer pour `creer-sarl-cepici-2026` casserait les liens existants sans bénéfice SEO).

### 3. `src/routes/guides.$slug.tsx` (head meta)
Vérifier que le `head()` de la route lit bien `title` et `excerpt` depuis `ARTICLES` — les nouvelles valeurs seront automatiquement reprises pour `<title>`, `meta description`, `og:title`, `og:description`.

## Question avant build
Le slug actuel est `/guides/creer-sarl-cepici`. Le brief demande `/guides/creer-sarl-cepici-2026`. Je conserve l'ancien pour préserver les liens existants — confirmez si vous préférez basculer sur le nouveau slug (avec risque de liens cassés et perte SEO acquise).

## Validation
Naviguer vers `/guides/creer-sarl-cepici` après build : vérifier titre H1, sections, FAQ, sources, CTA.
