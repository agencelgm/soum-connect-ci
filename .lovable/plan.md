Objectif : retirer la photo de la femme blonde visible dans le hero de la landing page `/montage-dossier-credit`.

Changements prévus :
1. Dans `src/routes/montage-dossier-credit.tsx`, supprimer le bloc `<div className="mt-8 hidden lg:block">...</div>` (lignes 279-287) qui affiche l'image `HERO_IMAGE` sous le CTA du hero.
2. Supprimer la constante `HERO_IMAGE` (ligne 36-37) qui ne sera plus utilisée.
3. Vérifier visuellement que la landing page s'affiche correctement sans l'image et que le formulaire reste bien positionné.

Aucun autre changement de contenu ou de style n'est prévu.