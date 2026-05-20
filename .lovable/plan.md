
## Pourquoi les images paraissent pixélisées

État actuel : les 3 fichiers `seo-meeting/entrepreneur/diaspora.jpg` font **1536×1024** mais sont affichés dans une colonne de **320 px** seulement → en théorie suffisant, mais :

1. **Compression JPEG agressive** : les fichiers ne pèsent que 120–180 KB pour 1,5 mégapixel → artefacts visibles sur les visages (peau, contours).
2. **Colonne trop étroite** : 320 px à côté d'un texte long écrase la photo et accentue la sensation de "petite + floue".
3. Pas de tailles responsive : le navigateur affiche toujours le même fichier, peu importe l'écran.

## Plan correctif

### 1. Régénérer les 3 photos en résolution maximale

- Modèle `premium`, dimensions **1920×1440** (au lieu de 1024×768 demandé → renvoyé en 1536×1024).
- Mêmes prompts qu'avant (réalisme documentaire, grain de peau, pas de plastique IA).
- Écrasement des 3 fichiers existants au même chemin → aucun changement d'import à faire.

### 2. Agrandir les images dans la page d'accueil

Fichier : `src/routes/index.tsx`, section 10 (article SEO).

- Grille passe de `md:grid-cols-[1fr_320px]` (et inverse) à **`md:grid-cols-2`** → photo et texte à parts égales.
- Photos : `rounded-xl shadow-lg` au lieu de `rounded-lg shadow-md`, toujours en `aspect-[4/3] object-cover`.
- Mises à jour symétriques sur les 3 paires zigzag (réunion, entrepreneur, diaspora).

### 3. Hors scope

- Pas de format `srcset`/responsive multi-tailles (gain marginal pour le coût ; on peut le faire dans une itération SEO/perf dédiée si besoin).
- Pas de conversion WebP (à voir plus tard, gain ~30 % de poids).
- Aucune autre section modifiée.

### Vérification

Après régénération + édition, ouvrir la home, screenshot la zone article SEO et vérifier que les visages sont nets sans bloc JPEG visible.
