## Constat

L'article `/guides/calendrier-fiscal-ci-2026` existe déjà :
- Fichier de contenu : `src/content/guides/calendrier-fiscal-ci-2026.tsx` (538 lignes, complet, structuré avec `ArticleSection`, `ArticleTable`, `ArticleCallout`, `ArticleList`, `ArticleCTA`, FAQ, sources officielles).
- Métadonnées SEO bien câblées dans `src/lib/guides-data.tsx` (title, excerpt, image, readTime 12 min).
- Le rendu HTML serveur fonctionne : `curl` retourne le bon `<title>`, la bonne meta description, et le corps contient bien "TVA" (×9), "patente" (×6), etc.

Le message "rien ne sort en cliquant" vient probablement du cache Vite resté coincé après le bug `Cannot find module` corrigé au tour précédent par l'ajout de l'extension `.tsx` dans l'import.

## Plan

1. **Nettoyer l'import** dans `src/lib/guides-data.tsx` : retirer l'extension `.tsx` (incohérente avec les 6 autres imports de guides) maintenant que Vite a rechargé. Forme finale :
   ```
   import { CalendrierFiscal2026Content } from "@/content/guides/calendrier-fiscal-ci-2026";
   ```

2. **Redémarrer le dev server** pour purger tout cache résiduel.

3. **Vérifier** :
   - `curl` sur `/guides/calendrier-fiscal-ci-2026` → 200 + corps contenant le H1 + sections clés (TVA, patente, états financiers, FAQ, Sources officielles).
   - Screenshot navigateur de la page pour confirmer l'affichage complet (hero vert + image + corps article + CTA + RelatedLinks).
   - Test du parcours : `/blog` → clic "Lire la suite" sur la carte Calendrier fiscal → arrive bien sur l'article rendu.

## Hors périmètre

- Le contenu rédactionnel est déjà conforme au texte fourni (intro, "Qu'est-ce qu'un calendrier fiscal", obligations, déclarations mensuelles TVA/salaires/retenues/acomptes, états financiers, patente, taxe entreprenant, tableau calendrier 2026, préparation, documents par mois, Soumissions Comptable, erreurs à éviter, FAQ 7 questions, sources DGI/e-Impôts/225Invest/FNE, conclusion). Aucune réécriture nécessaire — uniquement vérification visuelle. Si après vérification une section manque ou diffère, je l'ajusterai.
