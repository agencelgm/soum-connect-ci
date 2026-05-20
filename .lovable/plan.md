## Objectif

Remplacer les 5 images de la section SEO de la page d'accueil par des versions beaucoup plus photoréalistes, sans le "lissé IA" actuel (peau trop nette, lumière trop parfaite, regards trop posés).

## Approche technique

Utiliser le modèle **`premium`** (au lieu de `fast`) pour la génération, qui produit des résultats nettement plus photographiques. Réécrire chaque prompt avec un vocabulaire de photographie documentaire/éditoriale :

- Spécifier l'appareil et l'objectif (ex. "shot on Canon EOS R5, 50mm f/1.8")
- Demander grain de film, imperfections de peau, micro-défauts
- Lumière naturelle imparfaite (contre-jour, ombres dures, fenêtre latérale)
- Pose candide / moment volé, pas de regard caméra figé
- Style "reportage éditorial" / "documentary photography" / "photojournalism"
- Interdire explicitement : "no plastic skin, no AI look, no overly smooth, no symmetrical perfect faces, no glossy retouching"
- Référencer des publications photo crédibles (ex. "in the style of Magnum Photos / National Geographic / The New York Times feature")

## Les 5 images à régénérer (mêmes chemins, écrasement)

1. `seo-team-meeting.jpg` (1280×896) — réunion de cabinet à Abidjan, plan candide
2. `seo-accountant-desk.jpg` (896×1280) — comptable concentrée à son poste
3. `seo-handshake-client.jpg` (1280×896) — poignée de main client/cabinet
4. `seo-office-abidjan.jpg` (1280×896) — intérieur de cabinet (sans personnes — plus facile à rendre réaliste)
5. `seo-entrepreneurs.jpg` (896×1280) — entrepreneurs ivoiriens devant un immeuble

## Hors périmètre

- Aucune modification de mise en page, code, ou texte
- Aucune modification d'autres images (hero, process, etc.)
- Les imports restent identiques (mêmes noms de fichiers)

## Note

Le modèle `premium` est plus coûteux que `fast`, mais c'est requis pour atteindre le niveau photoréaliste demandé. Si après cette passe une image reste trop "IA", on pourra l'itérer individuellement.
