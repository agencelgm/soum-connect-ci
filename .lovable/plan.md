Objectif : remplacer les images actuelles des articles Blog/Guides par des photos réellement documentaires, moins lisses, sans rendu IA.

Plan d’action :

1. Remplacer les 7 images d’articles utilisées dans `src/assets/guides/`
   - `creer-sarl-cepici.jpg`
   - `sarl-sa-ei.jpg`
   - `calendrier-fiscal-2026.jpg`
   - `cout-cabinet-abidjan.jpg`
   - `diaspora-france-ci.jpg`
   - `impots-entreprise-ci.jpg`
   - `choisir-cabinet-abidjan.jpg`

2. Utiliser uniquement des sources photo réalistes
   - Photos réelles type Unsplash/Pexels/Wikimedia ou équivalent.
   - Style recherché : bureau réel, documents, entrepreneurs, Abidjan/Côte d’Ivoire/Afrique de l’Ouest, fiscalité, comptabilité, administration.
   - Éviter : visages trop parfaits, éclairage studio artificiel, mains trop propres/génériques, compositions “corporate IA”, arrière-plans trop flous ou trop retouchés.

3. Garder la structure technique actuelle
   - Ne pas changer les routes.
   - Ne pas rendre toute la carte cliquable.
   - Conserver uniquement le lien `Lire la suite` comme demandé.
   - Les pages `/blog`, `/guides` et `/guides/$slug` continueront d’utiliser les mêmes imports existants.

4. Vérifier le rendu
   - Contrôler que les nouvelles images s’affichent bien dans la grille Blog/Guides et dans les pages articles.
   - Vérifier qu’aucune image générée par IA ou trop lisse ne reste dans ces articles.

Note : je respecterai la règle projet déjà mémorisée : aucune image IA sur ce site, uniquement des photos réelles.