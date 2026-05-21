Plan proposé :

1. Corriger la page Blog
- Remplacer l’état vide de `/blog` par une grille d’articles réelle.
- Réutiliser les articles déjà rédigés et structurés dans `guides-data`.
- Chaque carte affichera : vraie image réaliste, catégorie, titre, extrait, temps de lecture et lien `Lire la suite`.
- Garder une navigation claire en français.

2. Rendre les articles lisibles depuis le Blog
- Ajouter une route dynamique `/blog/$slug` pour ouvrir un article complet depuis le blog.
- Réutiliser la mise en page article existante pour garder le même rendu professionnel.
- Si un article n’est pas encore rédigé, afficher une page “article en cours de rédaction” au lieu d’un écran vide.

3. Respecter ta structure SEO/AEO/GEO
- Pour chaque article ouvert : un seul H1, plusieurs H2 formulés en questions, paragraphes courts, FAQ, sources externes, contexte Côte d’Ivoire / Abidjan.
- Balises meta dynamiques : title, description, URL slug court et descriptif.
- Image pertinente avec alt text descriptif.
- Maillage interne naturel vers les pages services et autres articles.

4. Corriger l’affichage des cartes
- Remplacer les blocs bleus avec une lettre par les vraies photos déjà présentes dans `src/assets/guides`.
- Ne pas utiliser d’images IA.
- Garder seulement le lien `Lire la suite` comme action principale, sauf si tu confirmes vouloir rendre toute la carte cliquable.

5. Vérifier le comportement
- Vérifier que le menu “Blog” ouvre bien la page blog.
- Vérifier que `Lire la suite` ouvre bien l’article complet.
- Vérifier que les images s’affichent correctement et que la page reste responsive sur mobile.