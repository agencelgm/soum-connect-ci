## Problème

Quand on ouvre `/academie/vente/prospect-vs-client` (ou n'importe quelle vidéo), c'est la page d'index de l'Académie qui s'affiche à la place de la vidéo.

## Cause

TanStack Router traite `src/routes/academie.tsx` comme le **parent** de `academie.$module.$slug.tsx` (à cause du nommage à points). Un parent qui a des enfants doit rendre `<Outlet />` pour laisser l'enfant s'afficher. Or `academie.tsx` rend directement `<AcademieIndex />` (le listing des vidéos), donc quand on va sur une page vidéo, la route enfant matche bien mais son contenu n'a nulle part où s'afficher — c'est le listing du parent qui reste visible.

## Correctif

Renommer `src/routes/academie.tsx` en `src/routes/academie.index.tsx`.

Avec ce nommage :
- `academie.index.tsx` → `/academie` (leaf, pas parent)
- `academie.$module.$slug.tsx` → `/academie/$module/$slug` (leaf, indépendant)

Les deux routes deviennent des feuilles sœurs sans relation parent/enfant, plus besoin d'`<Outlet />`, et chaque URL affiche son propre contenu.

## Vérification

Recharger `/academie/vente/prospect-vs-client` et confirmer que le lecteur vidéo apparaît avec le bon titre.

## Détails techniques

- Aucun changement de code interne dans le fichier — juste un renommage.
- `createFileRoute("/academie")({...})` reste valide car `academie.index.tsx` a la même route ID `/academie`.
- `src/routeTree.gen.ts` sera régénéré automatiquement par le plugin Vite.
