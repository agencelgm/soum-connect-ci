## Trois changements au formulaire d'inscription partenaire

### 1. Événement Facebook « Inscription terminée »

L'événement `CompleteRegistration` (Pixel + Conversions API) est déjà déclenché à la fin de l'inscription dans `src/routes/inscription-partenaire.tsx`. On le garde tel quel et on s'assure simplement qu'il se déclenche bien **après** la création réussie du compte partenaire (déjà le cas) — pas de changement nécessaire ici, sauf renommer le `content_category` en `inscription_terminee` pour matcher le libellé souhaité côté Meta Events Manager.

### 2. Approbation automatique + connexion automatique

Modifier `signupPartner` dans `src/lib/partners.functions.ts` :

- Insérer le partenaire avec `status: "approved"`, `approved_at: now()`, `approved_by: userId` (auto-approbation).
- Créditer automatiquement le bonus de bienvenue (30 crédits, même montant que `approvePartner`) via `grantCredits(..., "signup_bonus", ...)`.
- Émettre `emitPartnerEvent(partner, "approved")` en plus de `signup` pour que le webhook GHL reçoive l'événement.

Côté UI (`src/routes/inscription-partenaire.tsx`) :

- L'utilisateur est déjà connecté juste avant l'appel à `signup()` (via `supabase.auth.signUp` puis `signInWithPassword` au besoin), donc la session est active.
- Après le succès, rediriger directement vers `/marketplace` (déjà le cas) — il atterrira immédiatement dans son espace sans écran « en attente d'approbation ».
- Adapter le toast et le sous-titre de la page pour refléter l'activation immédiate (ex. « Votre compte est actif, vous pouvez commencer à recevoir des leads. »).

### 3. Deux nouvelles questions obligatoire : site internet et logo

**Formulaire** (`src/routes/inscription-partenaire.tsx`) :
Ajouter deux blocs de questions juste avant le bouton de soumission :

- « Voulez-vous un site internet pour votre cabinet ? » — Oui / Non — sous-texte : « À partir de 165 000 FCFA »
- « Voulez-vous un logo professionnel ? » — Oui / Non — sous-texte : « À partir de 50 000 FCFA »

Stockage : ajouter `wants_website: boolean | null` et `wants_logo: boolean | null` dans le state du formulaire (par défaut `null` = pas répondu). Les transmettre à `signupPartner`.

**Schéma** (`PartnerInfoSchema` dans `partners.functions.ts`) :
Étendre avec `wants_website: z.boolean().nullable().optional()` et `wants_logo: z.boolean().nullable().optional()`.

**Base de données** — nouvelle migration :

```sql
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS wants_website boolean,
  ADD COLUMN IF NOT EXISTS wants_logo boolean;
```

(Aucun GRANT/policy supplémentaire — la table en a déjà.)

**Visibilité admin** (`src/routes/_authenticated.admin.tsx`, panneau Partenaires) :
Dans la fiche/détails du partenaire, ajouter deux lignes :

- « Intéressé par un site internet : Oui / Non / — »
- « Intéressé par un logo : Oui / Non / — »
avec un badge visuel (vert pour Oui) pour repérer rapidement les opportunités d'upsell.

**Webhook GHL** (`src/lib/ghl-partners.server.ts`) :
Inclure `wants_website` et `wants_logo` dans le payload `emitPartnerEvent` pour pouvoir déclencher des relances commerciales depuis GHL.

### Récap des fichiers touchés

- `src/routes/inscription-partenaire.tsx` — 2 nouvelles questions, libellé Meta event
- `src/lib/partners.functions.ts` — auto-approve dans `signupPartner`, schéma étendu
- `src/lib/ghl-partners.server.ts` — payload enrichi
- `src/routes/_authenticated.admin.tsx` — affichage des réponses upsell
- `supabase/migrations/<timestamp>_partner_upsell_answers.sql` — 2 colonnes