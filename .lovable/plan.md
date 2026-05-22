## Objectif
Remplacer le cutout `heroAccountant` (vide autour, coupé au torse) par la photo `seoAccountantDesk` — image riche (comptable + bureau + documents) qui remplit naturellement la colonne sans paraître vide. Réutilisée à l'identique dans le hero et la section CTA finale.

## Fichier modifié
`src/routes/index.tsx` uniquement.

## Hero (~ligne 117-126)
Remplacer le wrapper actuel par une carte image pleine :

```tsx
<div className="hidden lg:flex lg:col-span-5 items-end justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative w-full max-w-[520px] xl:max-w-[580px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
    <img
      src={seoAccountantDesk}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  </div>
</div>
```

## Section "FINAL CTA REPEAT" (~ligne 555-566)
Même structure, image identique, `loading="lazy"` :

```tsx
<div className="lg:col-span-5 hidden lg:flex items-end justify-center lg:-mr-2 xl:-mr-4">
  <div className="relative w-full max-w-[520px] xl:max-w-[580px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
    <img
      src={seoAccountantDesk}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  </div>
</div>
```

## Détails
- `aspect-[4/5]` garde une carte verticale équilibrée qui remplit la colonne sans dépendre d'une hauteur fixe.
- `object-cover` recadre la photo proprement, jamais d'espace vide.
- `shadow-2xl` + `ring-1 ring-black/5` donnent de la présence à la carte sur le fond beige.
- `heroAccountant` n'est plus utilisé : import retiré du fichier.
- Mobile : carte cachée (`hidden lg:flex`), aucun changement.

## Validation
- Hero et section finale : carte photo riche, plus de sensation de vide autour.
- Aucun débordement horizontal.
- Mobile inchangé.