Corriger le hero : le personnage doit être grand, à côté du formulaire, et ses pieds doivent toucher le bord bas de la section (= haut de la bande Stats). Le formulaire orange garde son aération.

## Bug actuel

L'image en `position: absolute` avec `bottom-0 h-[92%]` est calculée par rapport à la hauteur totale de la section hero. Comme cette section est très grande (le formulaire est long), `bottom-0` se retrouve sous le pli et la silhouette finit toute petite à mi-hauteur. Mauvaise approche.

## Nouvelle approche

Revenir au flux grid à 2 colonnes (image + formulaire), en utilisant `items-stretch` pour que la colonne image fasse exactement la hauteur du formulaire. L'image, en `h-full w-auto object-contain object-bottom`, occupe toute cette hauteur et ses pieds touchent le bord bas de la section.

- Section : `pb-0` pour qu'il n'y ait aucun padding sous le personnage.
- Grid : `lg:grid-cols-12 lg:items-stretch` (chaque colonne fait la hauteur de la row).
- Colonne image (`lg:col-span-5`) : `flex items-end` ; image `h-full w-auto max-h-[640px] object-contain object-bottom`. Hauteur = hauteur du formulaire, largeur libre selon ratio (768×1024 → ~3/4 de la hauteur). Le personnage est donc grand et solidement ancré en bas.
- Colonne formulaire (`lg:col-span-7`) : `pt-0 pb-10 md:pb-16`. Formulaire inchangé, garde son aération en bas.
- Sur mobile : image masquée, badge + H1 affichés.
- Fond photo flouté + overlay : inchangés.

## Détails techniques (`src/routes/index.tsx`, section hero)

```text
<section className="relative overflow-hidden">
  <img src={seoOfficeAbidjan} className="absolute inset-0 w-full h-full object-cover blur-md scale-110" />
  <div className="absolute inset-0 bg-[#F5F1EA]/75" />

  <div className="relative container-app pt-10 md:pt-16 pb-0 grid gap-8 lg:gap-4 lg:grid-cols-12 lg:items-stretch">
    <div className="hidden lg:flex lg:col-span-5 items-end justify-center lg:-mr-6 xl:-mr-10">
      <img
        src={heroAccountant}
        className="h-full w-auto max-h-[640px] object-contain object-bottom"
      />
    </div>
    <div className="lg:hidden text-center">{/* badge + h1 mobile */}</div>
    <div className="lg:col-span-7 pb-10 md:pb-16">{/* form inchangé */}</div>
  </div>
</section>
```

Effet attendu : personnage grand (≈ hauteur du formulaire), pieds collés au bord bas de la section, formulaire avec padding intact.

## Approche

Sortir l'image du flux grid : la positionner en absolu, ancrée bas-gauche de la section hero. Sa hauteur n'est plus liée à la colonne formulaire — elle est libre de descendre jusqu'au bord. Le formulaire reste en flux normal avec son `pb` habituel.

- Personnage : `absolute bottom-0 left-0`, occupant ~5 colonnes de large à gauche (`w-[42%] xl:w-[40%]`, `max-h-[560px]` pour borner la hauteur).
- `object-bottom` pour que les pieds touchent exactement le bord bas.
- La colonne grid gauche devient un simple spacer vide en desktop (juste pour réserver la place horizontale et empêcher le formulaire de prendre toute la largeur).
- Le formulaire conserve son `pb-10 md:pb-16` — donc espace inchangé entre formulaire et Stats.
- Sur mobile, image toujours masquée.

## Détails techniques (`src/routes/index.tsx`, section hero)

```text
<section className="relative overflow-hidden">
  <img src={seoOfficeAbidjan} className="absolute inset-0 ... blur-md" />
  <div className="absolute inset-0 bg-[#F5F1EA]/75" />

  {/* Personnage en absolu, indépendant de la grille */}
  <img
    src={heroAccountant}
    className="hidden lg:block absolute bottom-0 left-0 z-10
               w-[42%] xl:w-[40%] max-h-[560px] object-contain object-bottom
               pl-4 xl:pl-12"
  />

  <div className="relative container-app pt-10 md:pt-16 pb-0 grid lg:grid-cols-12">
    <div className="hidden lg:block lg:col-span-5" />     {/* spacer pour la place de l'image */}
    <div className="lg:col-span-7 pb-10 md:pb-16">{/* form inchangé */}</div>
    <div className="lg:hidden">{/* badge + h1 mobile inchangé */}</div>
  </div>
</section>
```

Résultat : les pieds du personnage touchent le bord bas de la section hero (donc le haut de la bande Stats), pendant que le formulaire orange garde son aération.

## Ce qui change visuellement

- Fond : remplacer le beige `#F5F1EA` par une vraie photo de bureau comptable abidjanais déjà présente (`seoOfficeAbidjan`), floutée et assombrie via un overlay, pour donner le même effet "image en arrière brouillée" que la référence.
- Personnage : agrandi (de `max-w-sm` à `max-w-md` puis `xl:max-w-lg`), aligné en bas absolu de la section, débordant légèrement vers le formulaire.
- Espacement : supprimer le padding bas de la section hero (`pb-0`) pour que le personnage touche la bande "Stats" suivante, exactement comme dans la référence.
- Formulaire orange : inchangé en contenu, mais on garde un padding bas sur sa colonne pour qu'il reste à bonne hauteur pendant que l'image descend jusqu'au bord.
- Mobile : on garde l'image cachée (`hidden lg:flex`) — pas de changement mobile.

## Contraintes respectées

- Aucune image générée par IA. On réutilise une photo réelle déjà importée (`src/assets/home/seo-office-abidjan.jpg`) comme fond flouté.
- Aucun changement de copy, de formulaire, ni du reste de la page.
- Nettoyage : la page interne `src/routes/preview.hero-compare.tsx` (créée précédemment pour comparer les versions) est supprimée, elle n'a plus d'utilité.

## Détails techniques (`src/routes/index.tsx`, section hero uniquement)

```text
<section className="relative overflow-hidden">
  <img src={seoOfficeAbidjan} className="absolute inset-0 w-full h-full object-cover blur-md scale-110" />
  <div className="absolute inset-0 bg-[#F5F1EA]/70" />   // overlay clair pour lisibilité
  <div className="relative container-app pt-10 md:pt-16 pb-0 grid lg:grid-cols-12 lg:items-end">
    <div className="lg:col-span-5 self-end">
      <img src={heroAccountant} className="w-full max-w-md xl:max-w-lg object-contain object-bottom" />
    </div>
    <div className="lg:col-span-7 pb-10 md:pb-16">{/* form */}</div>
  </div>
</section>
```

Points clés :
- `pb-0` sur le conteneur hero + `lg:items-end` pour que l'image touche la section suivante.
- `pb-10 md:pb-16` réintroduit sur la colonne formulaire pour conserver son aération.
- `blur-md scale-110` sur l'image de fond évite les bords nets du flou.