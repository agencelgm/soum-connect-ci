## Objectif

Créer la page `/nous-contacter` (actuellement 404) avec un formulaire permettant aux clients de décrire le problème rencontré, puis transmettre les réponses au même webhook que les autres leads.

## Pages à créer

1. **`src/routes/nous-contacter.tsx`** (FR)
2. **`src/routes/en/contact-us.tsx`** (EN, version miroir pour cohérence avec le reste du site)

Mise à jour du mapping FR↔EN dans `src/lib/route-map.ts`, et du lien dans `src/routes/faq.tsx` (`<a href>` → `<Link to>`).

## Contenu du formulaire

Champs (tous obligatoires sauf mention) :
- **Nom complet** *
- **Email** *
- **Téléphone (mobile)** *
- **Entreprise** (optionnel)
- **Sujet du problème** — select :
  - Problème avec une soumission reçue
  - Cabinet partenaire ne répond pas
  - Problème de facturation / paiement
  - Question sur un service (création, comptabilité, fiscal, domiciliation)
  - Demande de modification / annulation
  - Autre
- **Service concerné** (optionnel, select) : Création d'entreprise / Comptabilité / Déclaration fiscale / Domiciliation / Logo / Site web / Autre
- **Date à laquelle le problème est survenu** (optionnel, date picker)
- **Description du problème** * (textarea, min 20 / max 1000 caractères)
- **Consentement RGPD** * (checkbox)

Validation Zod côté client (react-hook-form + zodResolver) et côté serveur.

## Endpoint serveur

Nouveau fichier : **`src/routes/api/public/contact.ts`**
- Schéma Zod identique au client.
- Forwarde vers `process.env.GHL_WEBHOOK_URL` avec `source: "contact-form"` + `leadId` + `received_at` + `user_agent` (même pattern que `lead.ts`).
- Log `LOST_LEAD` en cas d'échec webhook, comme l'existant.

## UX

- Design cohérent avec `LeadFormCard` / `OfferPage` : carte blanche `rounded-2xl`, fond `#F8FAFC`, bouton `bg-secondary` orange.
- Hero court : titre "Nous contacter" + sous-titre "Décrivez-nous votre problème, notre équipe vous répond sous 24h ouvrables."
- Bandeau de réassurance court (3 items : Réponse < 24h / Équipe locale Abidjan / Confidentialité).
- Après soumission réussie → redirection vers `/merci` (FR) ou `/en/thank-you` (EN) + toast succès.
- Gestion d'erreur réseau avec toast destructif et bouton "Réessayer".

## SEO

`buildPageHead` :
- FR title : "Nous contacter | SoumissionsComptables.ci"
- FR description : "Une question, un problème avec votre soumission ou un cabinet partenaire ? Contactez notre équipe à Abidjan, réponse sous 24h ouvrables."
- `altPath` : `/en/contact-us`
- Breadcrumb : Accueil → Nous contacter
- `robots: index,follow`

## Hors périmètre

- Pas de table Supabase / Lovable Cloud ajoutée (on réutilise le webhook GHL existant, comme les autres formulaires du site).
- Pas de modification du formulaire principal de demande de soumissions.
