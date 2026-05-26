# Unifier les formulaires de demande de soumissions

## Problème

Aujourd'hui il existe **deux formulaires différents** qui demandent des informations différentes :

1. **Formulaire de la page d'accueil** (`LeadFormCard`) — carte à droite du hero "Recevez jusqu'à 5 soumissions gratuites". 5 champs simples : service, ville, nom, téléphone, email.
2. **Formulaire de la page `/demande-soumissions`** — 4 étapes complètes : service + statut + description + nb associés + bureau → logo + site web + publicité → localisation + délai + budget → coordonnées.

Le même formulaire est aussi utilisé dans :
- `src/routes/creer-son-entreprise-cote-divoire.tsx`
- `src/components/guides/ArticleLayout.tsx` (sidebar de tous les guides/articles)

Résultat : un visiteur qui remplit l'accueil reçoit un formulaire totalement différent de celui qui clique sur "Obtenir mes soumissions", ce qui crée incohérence et perte de qualification des leads.

## Objectif

Que **tous les emplacements** affichent les **mêmes 4 étapes** que `/demande-soumissions`, avec exactement les mêmes questions, le même schéma de validation et la même barre de progression.

## Solution

### 1. Extraire le multi-étapes dans un composant partagé

Créer `src/components/lead/MultiStepLeadForm.tsx` qui contient :
- Les constantes `SERVICES_FR/EN`, `STATUTS_FR/EN`, `LOCALISATIONS_FR/EN`, `DELAIS_FR/EN`, `BUDGETS_FR/EN`
- L'objet `COPY` (FR/EN)
- Le `makeSchema` Zod et `STEP_FIELDS`
- L'état `step`, le `useForm`, la barre de progression, les 4 étapes JSX
- Le `onSubmit` qui POSTe sur `/api/public/lead` puis redirige vers `/offre-logo` (ou `/en/logo-offer`)
- Le composant `Field` interne

Prop optionnelle `source` (défaut `"demande-soumissions"`) pour distinguer l'origine dans les analytics et le CRM (ex. `"home-lead-form"`, `"article-sidebar"`).

Prop optionnelle `variant: "page" | "card"` :
- `"page"` : padding et largeur actuels de `/demande-soumissions`
- `"card"` : version compacte pour s'insérer dans la carte blanche du hero accueil et dans la sidebar des articles (typo titre plus petite, padding réduit, pas de bloc latéral "Pourquoi nous faire confiance").

### 2. Remplacer `/demande-soumissions`

Le fichier `src/routes/demande-soumissions.tsx` ne garde que la mise en page (h1, sous-titre, aside "Pourquoi nous faire confiance", témoignage) et appelle `<MultiStepLeadForm variant="page" source="demande-soumissions" />`.

### 3. Remplacer `LeadFormCard` partout

`src/components/home/LeadFormCard.tsx` devient un wrapper simple :
```tsx
<MultiStepLeadForm variant="card" source="home-lead-form" />
```

Les 3 fichiers qui importent déjà `LeadFormCard` (`index.tsx`, `creer-son-entreprise-cote-divoire.tsx`, `ArticleLayout.tsx`) n'ont rien à changer — ils afficheront automatiquement les 4 étapes.

### 4. API `/api/public/lead`

Le schéma Zod côté serveur (`src/routes/api/public/lead.ts`) accepte déjà tous les champs du multi-étapes (`statut`, `description`, `delai`, `budget`, `nbAssocies`, `bureau`, `logo`, `siteWeb`, `publicite`, `entreprise`). Aucun changement nécessaire.

### 5. Analytics

L'event `soumission_envoyee` continue d'être envoyé avec `service`, `localisation`, `language`, plus `source` pour distinguer l'origine (accueil vs page dédiée vs article).

## Détails techniques

- Aucun changement de schéma DB ni de webhook GHL — les champs sont déjà supportés.
- Conserver la redirection vers `/offre-logo` (FR) ou `/en/logo-offer` (EN) après envoi, pour ne pas casser le tunnel d'upsell existant.
- La variante `card` doit rester lisible sur mobile dans la carte blanche du hero accueil (largeur ~360–400 px). Vérifier que les selects et la barre de progression tiennent sans débordement.
- Garder l'animation `animate-fade-in` entre les étapes.

## Fichiers touchés

- **Créé** : `src/components/lead/MultiStepLeadForm.tsx`
- **Modifié** : `src/routes/demande-soumissions.tsx` (utilise le composant partagé)
- **Modifié** : `src/components/home/LeadFormCard.tsx` (devient un wrapper)
- Inchangés mais bénéficient automatiquement : `src/routes/index.tsx`, `src/routes/creer-son-entreprise-cote-divoire.tsx`, `src/components/guides/ArticleLayout.tsx`
