Deux corrections sur `src/routes/index.tsx`.

## 1. Hero — la main pointée est coupée

Cause : le wrapper `overflow-hidden` que nous utilisons pour masquer les jambes coupe AUSSI horizontalement. La main droite du personnage, qui dépasse la largeur de la colonne, est donc rognée.

Fix : remplacer `overflow-hidden` par `overflow-x-visible overflow-y-hidden` sur le wrapper image. Le crop vertical au torse reste, mais la main peut déborder horizontalement vers la carte (comportement souhaité, comme dans la maquette initiale).

```tsx
// ligne ~118
<div className="relative h-full min-h-[520px] xl:min-h-[620px] w-full overflow-x-visible overflow-y-hidden">
```

## 2. Section "FINAL CTA REPEAT" — appliquer le même traitement

Actuellement (lignes 555–564) le personnage est rendu en pleine hauteur centré (`w-full max-w-sm mx-auto`), donc on voit les pieds et il paraît petit à côté de la carte orange.

Fix : reproduire la structure du hero — colonne `items-stretch`, wrapper avec crop vertical au torse, image agrandie, hand qui peut déborder.

```tsx
<div className="lg:col-span-5 hidden lg:flex items-stretch justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative h-full min-h-[520px] xl:min-h-[620px] w-full overflow-x-visible overflow-y-hidden">
    <img
      src={heroAccountant}
      alt=""
      width={768}
      height={1024}
      loading="lazy"
      className="absolute left-1/2 top-0 h-[1100px] xl:h-[1280px] w-auto max-w-none -translate-x-1/2 object-contain pointer-events-none"
    />
  </div>
</div>
```

## Validation
- Capture desktop : main visible débordant vers la carte sur le hero ET sur la section finale, torse calé au bas dans les deux cas, jambes masquées.
- Mobile inchangé (personnage masqué `hidden lg:flex`).