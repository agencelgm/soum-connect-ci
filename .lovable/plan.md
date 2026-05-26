## Problème

Sur la page d'accueil, la carte `LeadFormCard` est imbriquée dans un bloc hero `bg-secondary text-white` (`src/routes/index.tsx` lignes 152 et 577). La carte du formulaire a bien `bg-white`, mais aucune couleur de texte explicite n'est définie sur sa racine. Résultat : les `<label>`, les `<select>` natifs (étape 1/3 : Service, Statut, Localisation, Délai, Budget) et les boutons radio héritent de `color: white` venant du parent → texte blanc sur fond blanc, invisible. Seuls les emojis et le placeholder du `<Input>` shadcn restent visibles parce que ces composants forcent leur propre couleur.

Le formulaire dans `/demande-soumissions` ne souffre pas du problème parce qu'il vit dans un fond clair sans `text-white` hérité.

## Correction

Un seul fichier touché : `src/components/lead/MultiStepLeadForm.tsx`.

1. Ajouter `text-foreground` sur la `<div>` racine de la carte (ligne 336) pour casser tout héritage `text-white` venu du parent.
2. Ajouter `text-foreground` à la classe `selectClass` (ligne 331) pour que les `<select>` natifs aient explicitement le texte foncé même si un parent force une couleur.
3. Ajouter `text-foreground` aux `<Label>` des boutons radio Oui/Non (composant `RadioYesNo` plus bas dans le fichier) — même raison.

Aucune autre page n'est affectée : la carte reste blanche avec texte foncé partout, et le `/demande-soumissions` continue de s'afficher à l'identique.

## Vérification

Recharger `/` et vérifier que les libellés "Quel service recherchez-vous ?", "Quel est votre statut ?", les options des selects, et les radios Oui/Non sont bien lisibles sans devoir survoler.
