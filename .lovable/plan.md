
# Hero — F1 + Sujet #5

## Choix retenus
- **Fond (F1)** : photo Unsplash d'un open space lumineux de cabinet (grandes baies, bureaux bois clair), floutée + overlay bleu marine
- **Premier plan (#5)** : duo homme + femme africains professionnels, debout côte à côte, costume/tailleur, posture confiante — **PNG détouré** (fond transparent) pour fusion naturelle avec le fond

## Implémentation

1. **Téléchargement assets** (vraies photos Unsplash, jamais d'IA — règle projet)
   - `src/assets/home/hero-office-bg.jpg` — open space cabinet (1600×1066, optimisé)
   - `src/assets/home/hero-duo.png` — duo détouré sur fond transparent (portrait, ~1200×1500)

2. **Refonte du bloc hero dans `src/routes/index.tsx`**
   - Retirer `hero-gradient-bg` → `<img>` en `absolute inset-0 object-cover blur-2xl scale-110` + overlay `bg-primary/65`
   - Remplacer l'image actuelle (femme stressée, encadrée) par `<img src={heroDuo}>` **sans** `rounded-2xl`, `ring`, `shadow-2xl`, `bg-white` — juste l'image flottante avec un léger `drop-shadow-2xl` pour ancrer les sujets
   - Garder le layout 2 colonnes, le titre, les CTA et les cercles décoratifs intacts
   - Vérifier le rendu mobile (sujet centré en bas sous le texte)

3. **Vérification visuelle** en preview après build (desktop 1130px + mobile).

## Fichiers touchés
- `src/assets/home/hero-office-bg.jpg` *(nouveau)*
- `src/assets/home/hero-duo.png` *(nouveau, transparent)*
- `src/routes/index.tsx` *(refonte hero uniquement)*

Aucune logique métier modifiée.
