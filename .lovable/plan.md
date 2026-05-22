## Objectif

Rendre la section "10. SEO ARTICLE" de `src/routes/index.tsx` plus lisible sur mobile (390px) et éviter que deux images se retrouvent collées l'une au-dessus de l'autre lors du passage en colonne unique.

## Constats actuels (mobile)

1. La liste sélectionnée ("50 000+ soumissions… / 150+ cabinets… / Rapide, 100% gratuit… / Formulaire simple…") est rendue sans aération suffisante : icônes 16px, texte `text-sm`, espacement `space-y-2`. Les lignes se touchent presque et les ✓ se perdent.
2. Les images portrait (`aspect-[3/4]`) des blocs 2 et 4 prennent toute la largeur sur mobile → elles deviennent énormes (≈ 520px de haut sur un écran de 390px), ce qui pousse le texte hors écran.
3. Bloc 3 finit par une image (à droite en desktop, en bas sur mobile) et Bloc 4 commence par une image (à gauche en desktop, en haut sur mobile). Résultat sur mobile : **image de bureau Abidjan suivie immédiatement de l'image entrepreneurs** → deux photos qui se suivent verticalement sans texte entre elles. C'est ce que l'utilisateur ne veut pas.
4. Les paragraphes longs (`seoP1`, `seoP2`) restent en `text-sm` sur mobile alors qu'ils sont denses.

## Changements proposés

### A. Listes d'avantages (✓) — incluant la liste sélectionnée
Dans les 3 `<ul>` (`seoTypes`, `seoNeeds`, `seoAdvantages`) :
- Passer à `space-y-3` (au lieu de `space-y-2`) sur mobile.
- Icône `CheckCircle` : `h-5 w-5` mobile, `md:h-4 md:w-4`.
- Texte : `text-[15px] leading-relaxed` mobile, `md:text-sm`.
- Ajouter un fond léger optionnel `rounded-lg bg-muted/30 p-4 md:bg-transparent md:p-0` pour mieux délimiter le bloc sur mobile.

### B. Images portrait (blocs 2 et 4)
Sur mobile, contraindre la hauteur et centrer :
- Remplacer `w-full h-auto … aspect-[3/4]` par `mx-auto w-2/3 max-w-[260px] h-auto aspect-[3/4] md:w-full md:max-w-none`.
- Résultat : sur mobile, ces deux images deviennent des vignettes centrées (~260px de large) au lieu d'occuper toute la largeur.

### C. Images paysage (blocs 1, 3 et mission)
- Réduire l'aspect sur mobile : `aspect-[16/10] md:aspect-[4/3]` pour libérer du scroll.

### D. Régler les "deux images qui se suivent" entre blocs 3 et 4
Inverser l'ordre du bloc 4 sur mobile pour intercaler le texte :
- Bloc 4 actuel : `[image] [texte]` (et stacke `image → texte` en mobile).
- Nouveau bloc 4 : ajouter `order-2 md:order-1` au texte et `order-1 md:order-2` à l'image (comme le bloc 1).
- Conséquence mobile : Bloc 3 finit par image bureau → Bloc 4 commence par **texte "Avantages"** → puis image entrepreneurs. Plus de doublon visuel d'images consécutives.

### E. Typographie des paragraphes
- `seoP1`, `seoP2`, `seoP3`, `seoLocation` : passer à `text-[15px] md:text-base`.
- Espacement vertical entre blocs : `mt-10 md:mt-12` au lieu de `mt-12` partout.

### F. Bandeau trust badges (orange)
Sur mobile (`grid-cols-2`), passer les icônes de `h-16 w-16` à `h-12 w-12` et le texte à `text-xs md:text-sm` pour éviter le débordement.

## Fichiers modifiés
- `src/routes/index.tsx` (uniquement la section "10. SEO ARTICLE" et son bandeau trust, lignes ~380–527).

Aucune modification de logique métier, traductions, ou structure de données.
