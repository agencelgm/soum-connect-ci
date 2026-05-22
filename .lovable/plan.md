Je vais remplacer entièrement le contenu de l'article « Combien coûte un cabinet comptable à Abidjan ? » par le texte que tu as fourni, pour qu'il s'affiche en entier quand on clique sur « Lire la suite » depuis le blog.

1. Mettre à jour le contenu de l'article
- Réécrire `src/content/guides/cout-cabinet-comptable-abidjan.tsx` avec :
  - introduction
  - toutes les sections (pourquoi un cabinet, tarifs moyens, pourquoi les tarifs varient, types de prestations, tarifs par profil EI / SARL / PME, bilan & états financiers, indépendant vs cabinet, ce qui fait monter le prix, comment réduire le coût)
  - tableau « Exemple de budget selon le type d'entreprise »
  - sections « bon devis », « comment choisir », « Soumissions Comptable », « erreurs à éviter »
  - FAQ complète
  - liste des sources officielles (OECCA-CI, e-Impôts, DGI) avec liens externes
  - conclusion + CTA Soumissions Comptable
- Utiliser les blocs déjà existants : `ArticleSection`, `ArticleTable`, `ArticleList`, `ArticleCallout`, `ArticleCTA`.

2. Mettre à jour les métadonnées dans `src/lib/guides-data.tsx`
- Titre : « Combien coûte un cabinet comptable à Abidjan ? »
- Excerpt : « Découvrez combien coûte un cabinet comptable à Abidjan : tarifs mensuels, bilan, déclarations fiscales, paie, facteurs de prix et conseils pour choisir. »
- Garder le slug actuel `cout-cabinet-comptable-abidjan` (déjà lié au routing et probablement déjà partagé/indexé). Le slug demandé `combien-coute-cabinet-comptable-abidjan` peut être ajouté plus tard si tu préfères, mais changer un slug peut casser des liens existants.
- Garder l'image réelle existante `cout-cabinet-abidjan.jpg` (vraie photo, pas IA).

3. Validation
- Aller sur `/guides`, cliquer « Lire la suite » sur cet article, vérifier que la page complète s'affiche avec toutes les sections, le tableau, la FAQ et les sources officielles.

Veux-tu que je change aussi le slug en `/guides/combien-coute-cabinet-comptable-abidjan` ? Si oui, je peux ajouter une redirection depuis l'ancien slug. Par défaut, je garde l'actuel.