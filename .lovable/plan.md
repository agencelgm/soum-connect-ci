Supprimer l'espace blanc entre les pieds du personnage et la bande "Stats", pour que le corps touche réellement la section suivante (comme dans la référence déménageurs).

## Cause

Le PNG `hero-accountant-cutout.png` contient une zone transparente sous les pieds du personnage. Même avec `object-bottom` et `pb-0`, ce padding interne au PNG crée un vide visuel entre les chaussures et la bande Stats.

## Approche

On ne peut pas recadrer le PNG sans le régénérer (interdit par la règle "pas d'IA"). On compense côté CSS :

- Agrandir le personnage (`xl:max-w-xl`) pour qu'il occupe plus de hauteur visuelle.
- Ajouter une marge négative basse à l'image (`-mb-6 lg:-mb-10`) pour que la partie visible (chaussures) recouvre la limite de la section et morde sur la bande Stats.
- Conserver `overflow-hidden` sur la section pour ne pas casser le layout si la marge négative dépasse.
- Garder le formulaire orange tel quel.

Aucun changement sur mobile (image toujours masquée sous `lg`).

## Détails techniques (`src/routes/index.tsx`, colonne image du hero)

```text
<img
  src={heroAccountant}
  className="w-full max-w-md xl:max-w-xl object-contain object-bottom -mb-6 lg:-mb-10"
/>
```

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