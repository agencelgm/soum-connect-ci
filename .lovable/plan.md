Je vais corriger le problème à la source : la route `/guides/$slug` est bien enregistrée, mais elle est actuellement traitée comme une sous-route de `/guides`. Or la page `/guides` ne rend pas d’`Outlet`, donc après le clic l’URL change mais le contenu visible reste la liste des articles.

Plan d’implémentation :

1. Corriger la structure de la page `/guides`
- Ajouter un rendu d’`Outlet` dans `src/routes/guides.tsx` pour que la page article `/guides/calendrier-fiscal-ci-2026` puisse réellement s’afficher.
- Garder la liste des guides uniquement quand l’utilisateur est exactement sur `/guides`.

2. Conserver une vraie page article complète
- Maintenir `src/routes/guides.$slug.tsx` comme page dédiée à l’article complet.
- Vérifier que l’article “Calendrier fiscal 2026 en Côte d’Ivoire” affiche bien tout le contenu fourni : introduction, sections, tableaux, FAQ, CTA et liens liés.

3. Images réalistes, pas d’IA
- Conserver uniquement des photos réelles déjà présentes dans `src/assets/guides`.
- Si l’image actuelle de l’article n’est pas assez adaptée, la remplacer par une photo réelle de type calendrier fiscal / bureau / comptabilité, sans génération IA.

4. Validation
- Tester le parcours : `/guides` → clic sur “Lire la suite” → `/guides/calendrier-fiscal-ci-2026`.
- Vérifier que le titre, l’image et le corps complet de l’article s’affichent sur une autre page, sans rester sur la liste des guides.