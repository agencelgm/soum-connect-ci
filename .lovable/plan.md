## Objectif

Remplacer l'illustration du comptable en hero d'accueil (`src/assets/home/hero-accountant.png`) par une image **photographique** qui :
- a un rendu réaliste (style photo, pas illustration 3D lisse / "trop IA"),
- montre le personnage **en pied jusqu'aux jambes** (cadrage similaire à l'image de référence du livreur),
- conserve un fond détourable propre pour rester intégrée au bandeau crème actuel (`bg-[#F5F1EA]`).

## Ce qui change

- **`src/assets/home/hero-accountant.png`** : remplacé par une nouvelle image générée en `premium` (meilleure fidélité photo), fond blanc puis détouré en PNG transparent.
- Prompt orienté photo studio réaliste : homme ivoirien, ~30 ans, chemise bleu marine, manches retroussées, tenant un dossier cartonné brun et quelques documents, regard caméra, sourire sobre, **plan en pied (de la tête aux chevilles)**, lumière douce naturelle, grain photo, texture peau réaliste, légère profondeur de champ, **pas de style 3D/CGI/illustration**.
- Format vertical 768×1280 environ pour permettre le plan en pied sans coupe.

## Ce qui ne change pas

- Le composant `src/routes/index.tsx` continue d'importer `heroAccountant` depuis le même chemin → aucune modification de code nécessaire.
- Mise en page du hero, formulaire orange, traductions, autres pages : inchangés.
- Pas de modification de la page `/nous-contacter` ni d'autres assets.

## Limite à connaître

Même en mode premium, les modèles génératifs gardent une signature visuelle reconnaissable. On va pousser un prompt photo très spécifique (objectif 50 mm, lumière naturelle, grain), mais si le rendu reste trop "IA" après cet essai, l'étape suivante recommandée est d'utiliser une vraie photo stock (par ex. Unsplash / Pexels) — je peux l'intégrer si vous fournissez le lien ou validez ce fallback.
