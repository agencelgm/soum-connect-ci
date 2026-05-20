## Ajouter deux pages d'offres exclusives entre le formulaire et la page de remerciement

### Nouveau flux
```
Formulaire soumis
   → /offre-logo (FR) ou /en/logo-offer (EN)
   → /offre-site-internet (FR) ou /en/website-offer (EN)
   → /merci (FR) ou /en/thank-you (EN)
```

### 1. Nouvelles routes (4 fichiers)

**`src/routes/offre-logo.tsx`** et **`src/routes/en/logo-offer.tsx`**
- Bandeau **« OFFRE EXCLUSIVE !! »**
- Titre : *Conception de LOGO à partir de 50 000 FCFA*
- Court paragraphe de bénéfice (logo professionnel, fichiers livrés, etc.)
- Deux boutons :
  - **Oui, je suis intéressé(e)** → navigue vers `/offre-site-internet` (ou `/en/website-offer`)
  - **Non, merci** → navigue vers la même page suivante
- Les deux choix sont envoyés à l'API (voir §4) avant la navigation.

**`src/routes/offre-site-internet.tsx`** et **`src/routes/en/website-offer.tsx`**
- Même structure
- Titre : *Conception de SITE INTERNET à partir de 165 000 FCFA*
- Les deux boutons redirigent vers `/merci` (ou `/en/thank-you`), après envoi du choix.

### 2. Page de remerciement — message mis à jour
`src/routes/merci.tsx` et `src/routes/en/thank-you.tsx` :

> *Merci, toutes vos réponses ont bien été enregistrées pour ce service ainsi que pour les services supplémentaires. Un conseiller vous contactera dans les prochaines 24 heures ouvrables.*

Version EN équivalente. CTA (accueil / services) conservés.

### 3. Redirection depuis le formulaire
Dans `src/routes/demande-soumissions.tsx`, à la place de la redirection actuelle vers `/merci`, rediriger vers `/offre-logo` (ou `/en/logo-offer` selon la langue). Le `leadId` retourné par l'API est passé via le state du router pour permettre l'envoi des upsells (voir §4).

### 4. Suivi des choix d'upsell (sans changer le schéma actuel)
Pour ne pas perdre l'information :
- L'API `/api/public/lead` retourne déjà `{ ok: true }` ; on ajoute un `leadId` (UUID généré côté serveur) renvoyé au client et inclus dans le payload envoyé au webhook GHL.
- Nouvelle route API **`/api/public/lead-upsell`** (POST) :
  - Body : `{ leadId, offer: "logo" | "site", interested: boolean, language: "fr"|"en" }`
  - Validation Zod, puis forward vers `GHL_WEBHOOK_URL` (même webhook, payload distinct avec `type: "upsell"`).
- Les pages d'offre récupèrent le `leadId` depuis le state de navigation et appellent cette route au clic sur l'un des deux boutons, puis naviguent vers la page suivante.
- Si le `leadId` est absent (accès direct à la page), les boutons fonctionnent quand même mais l'appel API est skippé — la page reste utilisable.

### 5. Route-map et navigation
Ajouter dans `src/lib/route-map.ts` :
```
{ fr: "/offre-logo", en: "/en/logo-offer" },
{ fr: "/offre-site-internet", en: "/en/website-offer" },
```

### 6. SEO
Les deux pages d'offres utilisent `buildPageHead` avec `noindex` via meta robots (ce sont des pages intermédiaires de tunnel, pas indexables). Si `buildPageHead` ne supporte pas `noindex`, on ajoute manuellement la balise meta dans `head()`.

### Style
Aligné au site : `bg-[#F8FAFC]`, carte blanche centrée `max-w-[640px]`, badge accent « OFFRE EXCLUSIVE !! », titre `font-heading`, prix mis en valeur, deux boutons (`secondary` pour Oui, `outline` pour Non).

### Fichiers touchés
- `src/routes/offre-logo.tsx` (création)
- `src/routes/offre-site-internet.tsx` (création)
- `src/routes/en/logo-offer.tsx` (création)
- `src/routes/en/website-offer.tsx` (création)
- `src/routes/api/public/lead.ts` (retour `leadId`)
- `src/routes/api/public/lead-upsell.ts` (création)
- `src/routes/demande-soumissions.tsx` (redirection vers `/offre-logo` + transmission du `leadId`)
- `src/routes/merci.tsx` + `src/routes/en/thank-you.tsx` (nouveau message)
- `src/lib/route-map.ts` (2 nouvelles paires)
- `src/lib/translations.ts` (clés des nouvelles pages)
