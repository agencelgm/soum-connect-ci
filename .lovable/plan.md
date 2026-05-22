Cause de la scrollbar : j'ai mis `overflow-x-visible` sur le wrapper image. L'image (≈825px de large à `h-[1100px]`) déborde alors hors de sa colonne (~460px). Sur le hero la section a `overflow-hidden` donc OK ; mais sur la section "FINAL CTA REPEAT" il n'y a pas d'`overflow-hidden`, donc l'image pousse le layout et crée une scrollbar horizontale.

Correctif propre, sans scrollbar et en gardant la main visible :

1. Revenir à `overflow-hidden` sur les deux wrappers (vertical ET horizontal).
2. Positionner l'image alignée à droite de la colonne au lieu de centrée : remplacer `left-1/2 -translate-x-1/2` par `right-0`. Comme la main pointée est sur le côté droit du personnage, elle reste alors entièrement dans la colonne ; seul le côté gauche (épaule gauche / bras gauche) est rogné par le crop, ce qui est invisible.

Fichier : `src/routes/index.tsx`

Hero (~ligne 117) :
```tsx
<div className="hidden lg:flex lg:col-span-5 items-stretch justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative h-full min-h-[520px] xl:min-h-[620px] w-full overflow-hidden">
    <img
      src={heroAccountant}
      alt=""
      aria-hidden="true"
      className="absolute right-0 top-0 h-[1100px] xl:h-[1280px] w-auto max-w-none object-contain pointer-events-none"
    />
  </div>
</div>
```

Section finale (~ligne 555) : même structure, `overflow-hidden` + `right-0`.

3. Validation : recharger `/`, confirmer plus de scrollbar horizontale, et que la main pointée vers la carte orange est entière dans les deux sections.