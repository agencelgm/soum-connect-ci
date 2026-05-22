## Plan

1. **Corriger le lien “Lire la suite” dans la page Guides**
   - Remplacer le lien HTML manuel `href=/guides/...` par le composant de navigation TanStack `Link`.
   - Utiliser la route typée `to="/guides/$slug"` avec `params={{ slug: article.slug }}` pour garantir une vraie navigation vers l’article.

2. **S’assurer que la page article peut afficher son contenu complet**
   - Vérifier que l’article `calendrier-fiscal-ci-2026` utilise bien `CalendrierFiscal2026Content`.
   - Garder l’affichage existant : titre, résumé, image, formulaire, corps complet de l’article, CTA et liens liés.

3. **Nettoyer le routage généré si nécessaire**
   - Ne pas modifier manuellement `routeTree.gen.ts`.
   - Laisser TanStack régénérer la route `/guides/$slug` depuis `src/routes/guides.$slug.tsx`.

4. **Valider le résultat**
   - Vérifier que le clic sur “Lire la suite” depuis `/guides` ou `/blog` ouvre bien `/guides/calendrier-fiscal-ci-2026`.
   - Vérifier que le corps de l’article complet s’affiche, notamment les sections TVA, ITS, BIC/BNC, patente, états financiers, FAQ et CTA final.