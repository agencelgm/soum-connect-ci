Constat : `/historique` n’est pas inclus dans la liste des routes immersives du layout racine, donc le Header/Footer publics restent visibles. C’est pour ça que la page ne matche pas Marketplace, Recharger crédits et Mon compte.

Plan de correction :

1. Mettre `/historique` dans les routes immersives
- Ajouter `/historique` et `/historique/*` à la condition `immersiveAuth` dans `src/routes/__root.tsx`.
- Résultat : plus de header/footer public ni barre CTA mobile sur la page historique.

2. Harmoniser le layout de `/historique`
- Garder le shell partenaire avec sidebar, comme les autres pages auth.
- Ajuster le conteneur de `/historique` pour mieux reprendre le modèle de `/recharger` : page plein écran, centrée verticalement quand l’espace le permet, fond immersif, largeur cohérente.
- Conserver les trois onglets et toutes les fonctionnalités déjà créées.

3. Vérifier l’intégration visuelle
- Comparer rapidement la structure avec `/marketplace`, `/recharger` et `/espace-partenaire`.
- S’assurer que `/historique` n’affiche plus aucun élément public et reste propre sur desktop/mobile.

Fichiers concernés :
- `src/routes/__root.tsx`
- `src/routes/_authenticated.historique.tsx`