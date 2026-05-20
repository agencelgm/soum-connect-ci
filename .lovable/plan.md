## Créer une page de remerciement dédiée après soumission du formulaire

### Contexte
Le formulaire multi-étapes `/demande-soumissions` (et sa version EN `/en/get-quotes`) affiche actuellement un écran de succès intégré (étape 5). L'objectif est de le remplacer par une **route dédiée** (`/merci` et `/en/thank-you`) affichant le message demandé et des appels à l'action.

### Livrables

#### 1. Nouvelles routes
- **`src/routes/merci.tsx`** — page FR avec :
  - Titre SEO : "Merci | SoumissionsComptables.ci"
  - Message principal : *"Merci d'avoir rempli notre formulaire. Un membre de notre équipe vous contactera dans les 24 heures ouvrables afin de vous référer au meilleur cabinet comptable."*
  - CTA secondaire : bouton "Retour à l'accueil" + lien vers les services
  - Design aligné au site existant (tokens CSS, composants Button/Card, icône CheckCircle2)

- **`src/routes/en/thank-you.tsx`** — page EN avec :
  - Titre SEO : "Thank You | SoumissionsComptables.ci"
  - Message EN : *"Thank you for filling out our form. A team member will contact you within 24 business hours to refer you to the best accounting firm."*
  - CTA "Back to home" + services link

#### 2. Mise à jour du route-map
Ajouter la paire `{ fr: "/merci", en: "/en/thank-you" }` dans `src/lib/route-map.ts` (`ROUTE_PAIRS`) pour que le sélecteur de langue et les liens alternatifs fonctionnent.

#### 3. Redirection post-formulaire
Dans `src/routes/demande-soumissions.tsx` :
- Importer `useNavigate` depuis `@tanstack/react-router`.
- Remplacer `setStep(5)` dans `onSubmit` par `navigate({ to: language === "en" ? "/en/thank-you" : "/merci" })`.
- Supprimer le bloc JSX `step === 5` (écran de succès intégré) et toutes les clés de traduction `okTitle`, `okText`, `okNextTitle`, `okStep1…3`, `backHome`, `moreServices` qui ne serviront plus.
- Nettoyer la logique `progress` et `stepOf` qui gérait l'étape 5.

#### 4. Traductions partagées
Ajouter les nouvelles clés dans `src/lib/translations.ts` (objets `fr` et `en`) :
- `thankYou.title`, `thankYou.message`, `thankYou.ctaHome`, `thankYou.ctaServices`, `thankYou.metaTitle`

### Décisions techniques
- **Route distincte plutôt qu'étape interne** : meilleure pour le SEO, le partage, le rechargement, et l'analytique.
- **Pas de paramètre d'URL** : la redirection est simple et stateless. Pas besoin de passer les données du formulaire dans l'URL.
- **Hors périmètre** : aucun changement sur le formulaire d'accueil (`LeadFormCard`), sur la route API (`/api/public/lead`), ni sur le formulaire cabinets partenaires.

### Fichiers touchés
- `src/routes/merci.tsx` (création)
- `src/routes/en/thank-you.tsx` (création)
- `src/lib/route-map.ts` (ajout paire)
- `src/routes/demande-soumissions.tsx` (redirect + suppression écran succès)
- `src/lib/translations.ts` (nouvelles clés)