## Problème

Les 6 images hero des nouveaux articles guides ont été générées par IA (rendu lisse, artificiel). Vous avez répété que vous voulez des **photos réelles**, pas du contenu IA.

## Solution proposée

Remplacer les 6 images générées par des **photos réelles libres de droits** issues d'Unsplash (photos d'auteurs vérifiés, gratuites pour usage commercial, sans attribution obligatoire mais créditées dans le code).

## Images à remplacer

| Article | Direction photo réelle |
|---|---|
| `sarl-sa-ei.jpg` | Bureau réel avec documents juridiques / poignée de main professionnels africains |
| `calendrier-fiscal-2026.jpg` | Agenda papier réel, stylo, calculatrice sur bureau |
| `cout-cabinet-abidjan.jpg` | Comptable réel devant ordinateur avec factures papier |
| `diaspora-france-ci.jpg` | Photo réelle (passeport, avion, ou bureau avec ordinateur portable) |
| `impots-entreprise-ci.jpg` | Documents fiscaux réels, calculatrice, dossiers |
| `choisir-cabinet-abidjan.jpg` | Réunion réelle de professionnels en cabinet |

## Méthode technique

1. Télécharger via `curl` les photos depuis Unsplash (URLs directes `images.unsplash.com/...` en 1600px de large, format JPG).
2. Écraser les 6 fichiers existants dans `src/assets/guides/` en gardant les mêmes noms → aucun changement à faire dans `guides-data.tsx`.
3. Sélectionner uniquement des photos avec personnes/scènes africaines quand pertinent (Abidjan/CI context), et bureaux/documents réels pour les sujets fiscaux.

## Règle à mémoriser

Sauvegarder dans la mémoire projet : **« Jamais d'images générées par IA pour ce site. Toujours utiliser des photos réelles (Unsplash ou équivalent). »** — pour ne plus jamais refaire l'erreur.

## Hors périmètre

- Contenu des articles (déjà écrit, validé).
- Image hero de la page d'accueil (déjà retravaillée précédemment).
- Les 13 autres articles priorité 2/3 (pas encore d'images).
