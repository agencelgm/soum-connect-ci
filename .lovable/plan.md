## Objectif

Rendre **tous** les champs des formulaires du site obligatoires, et signaler clairement à la soumission chaque champ vide, mal rempli ou invalide avec :
- une **étoile rouge `*`** à droite du libellé de chaque champ requis,
- une **bordure rouge** + **message d'erreur** sous le champ concerné quand l'utilisateur soumet sans le remplir correctement,
- un **scroll automatique** vers le premier champ en erreur.

## Formulaires concernés

Trois formulaires existent dans le site :

1. `src/routes/demande-soumissions.tsx` — formulaire multi-étapes (utilisé aussi par `/en/get-quotes`)
2. `src/components/home/LeadFormCard.tsx` — formulaire court sur la page d'accueil
3. `src/routes/cabinets-comptables-partenaires.tsx` — formulaire candidature cabinet partenaire

## Changements par formulaire

### 1. `demande-soumissions.tsx`
État actuel : déjà sur `react-hook-form` + `zod`, le composant `Field` gère déjà l'étoile et les erreurs. Manquent uniquement :
- `description` (étape 1), `budget` (étape 2), `entreprise` (étape 3) → marqués optionnels.

Actions :
- Dans le schéma Zod : passer ces 3 champs en `.min(1, "Champ requis")` (avec longueur max raisonnable).
- Ajouter `required` sur les 3 `<Field>` correspondants → l'étoile rouge apparaît automatiquement.
- Vérifier que la couleur de l'étoile et des messages utilise bien `text-destructive` (token oklch).

### 2. `LeadFormCard.tsx` (accueil)
État actuel : validation native HTML + `toast.error` global, pas de signalement par champ.

Actions :
- Migrer vers `react-hook-form` + schéma Zod (service, ville, nom, mobile, email — tous requis, email validé, mobile regex `^[+0-9 ]+$` min 6).
- Ajouter une **étoile rouge** à droite de chaque `<Label>` (composant local `RequiredLabel` ou réutilisable).
- En cas d'erreur : `aria-invalid` + classe `border-destructive ring-destructive/40` sur le champ + message rouge dessous.
- À la soumission, scroll vers le premier champ en erreur (`setFocus`).
- Conserver le POST vers `/api/public/lead` et le tracking `trackEvent` actuels.

### 3. `cabinets-comptables-partenaires.tsx`
État actuel : `<Input required>` natif, étoiles `*` en texte gris dans le libellé, checkbox groups sans validation visible.

Actions :
- Passer la soumission en validation contrôlée (état local ou react-hook-form) : à la soumission, vérifier chaque champ (cabinet, directeur, agrément, email, mobile, ≥1 service coché, ≥1 zone cochée, consentement).
- Remplacer les `*` texte par une **étoile rouge** (`<span className="text-destructive">*</span>`).
- Champs invalides : bordure `border-destructive`, groupes checkbox invalides : libellé en rouge + petit message.
- Message d'erreur global en haut du formulaire listant le nombre de champs à corriger.

## Composant partagé

Créer `src/components/ui/required-label.tsx` :
```tsx
export function RequiredLabel({ htmlFor, children }) {
  return (
    <Label htmlFor={htmlFor}>
      {children} <span className="text-destructive" aria-hidden>*</span>
    </Label>
  );
}
```
Réutilisé par les 3 formulaires + `Field` existant de `demande-soumissions`.

## Détails techniques

- Couleur étoile et bordure d'erreur : token sémantique `text-destructive` / `border-destructive` déjà défini dans `src/styles.css` (rouge oklch).
- Messages d'erreur en français (et anglais pour `/en/get-quotes` via les `c.errXxx` déjà présents dans `demande-soumissions`).
- `aria-invalid="true"` + `aria-describedby` vers l'id du message → accessibilité.
- Aucune modification backend ni du schéma `LeadSchema` dans `src/routes/api/public/lead.ts` (déjà strict).

## Hors périmètre

- Pas de modification du design global ni des couleurs du thème.
- Pas de changement de logique d'envoi (webhook GHL inchangé).
- Pas d'ajout de nouveaux champs.
