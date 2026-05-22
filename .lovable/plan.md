Compris. On garde le crop vertical au torse (bas masqué, jambes/pieds invisibles), mais on arrête de couper le côté droit du personnage. Tout le haut du corps doit être visible en entier : tête, épaules, deux bras, main pointée, jusqu'au torse.

## Méthode
- Afficher l'image à la largeur de la colonne (pas plus grande). Comme ça aucun débordement latéral, aucun crop horizontal.
- Cropper uniquement verticalement, via un wrapper `overflow-hidden` de hauteur fixe qui ne laisse voir que la moitié supérieure (de la tête au torse).
- L'image est centrée horizontalement et alignée en haut du wrapper.

## Calcul rapide
Image source 768×1024 (ratio 0.75). À une largeur ≈ 460–500px, la hauteur naturelle est ≈ 613–667px. Le torse se situe ~mi-image. Donc une fenêtre wrapper de `h-[340px] xl:h-[380px]` montre la tête jusqu'au bas du torse.

## Modifications dans `src/routes/index.tsx`

### Hero (~ligne 117)
```tsx
<div className="hidden lg:flex lg:col-span-5 items-end justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative w-full max-w-[460px] xl:max-w-[520px] h-[340px] xl:h-[380px] overflow-hidden">
    <img
      src={heroAccountant}
      alt=""
      aria-hidden="true"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto object-contain pointer-events-none"
    />
  </div>
</div>
```

### Section "FINAL CTA REPEAT" (~ligne 555)
Même structure et mêmes dimensions :
```tsx
<div className="lg:col-span-5 hidden lg:flex items-end justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative w-full max-w-[460px] xl:max-w-[520px] h-[340px] xl:h-[380px] overflow-hidden">
    <img
      src={heroAccountant}
      alt=""
      width={768}
      height={1024}
      loading="lazy"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto object-contain"
    />
  </div>
</div>
```

## Validation
- Hero et section finale : on voit le personnage en entier de la tête au torse (les deux bras, la main pointée, le visage complet), coupé proprement au niveau du torse contre la section suivante.
- Plus aucune scrollbar horizontale.
- Mobile inchangé.