## Objectif

Créer une landing page autonome dédiée au service « montage de dossier de crédit / financement » à l'URL `/montage-dossier-credit`, non indexée (invisible depuis la nav, le footer, le sitemap et les moteurs), avec formulaire 3 étapes dédié et page de remerciement `/merci-demande-financement` pour le suivi de conversion.

Structure calquée sur la landing business plan existante (`/redaction-business-plan-cote-divoire`) pour cohérence technique et visuelle.

## Positionnement (règles éditoriales strictes)

- Soumission Comptable = plateforme de mise en relation, **jamais** garante d'un financement.
- Ne jamais promettre l'obtention du crédit, ni délai, ni taux d'acceptation, ni partenariat bancaire.
- Formulations autorisées : « Recevez plusieurs propositions… », « Comparez avant de choisir… », « Préparez un dossier clair et structuré… ».
- Aucun faux témoignage, logo de banque, statistique inventée.
- Vouvoiement, ton rassurant, contexte ivoirien, FCFA.

## Fichiers à créer

1. `src/routes/montage-dossier-credit.tsx`
   - Route publique avec `noindex,nofollow` dans le `head()` + exclue du sitemap.
   - Structure : Header allégé local → Hero + formulaire (2 colonnes desktop) → bandeau réassurance (Gratuit / Plusieurs propositions / Sans engagement) → Section problème → Importance du dossier (4 cartes) → Contenu du dossier → Fonctionnement en 3 étapes → Besoins/projets concernés (grille) → 5 avantages → Bande de réassurance → FAQ (7 questions, accordéon `<details>` HTML statique) → CTA final avec disclaimer → Footer allégé local avec mention légale complète.
   - Rendu autonome : n'utilise pas `Header`/`Footer`/`MobileCtaBar` globaux (ajout à la liste `immersiveAuth` dans `__root.tsx`).
   - Bouton fixe mobile (« Recevoir des propositions ») qui scrolle vers `#formulaire`.
   - Multiples CTA (hero, après problème, après 3 étapes, avant FAQ, section finale) — tous scrollent vers le formulaire, tous avec le même wording « Recevoir des propositions gratuitement ».
   - Analytics `trackEvent` : `landing_page_view`, `form_start`, `form_step_1_complete`, `form_step_2_complete`, `form_submit`, `cta_click`, `phone_click`, conversion `financing_lead`.
   - Meta Pixel `Lead` via `trackMetaConversion` à la soumission.

2. `src/components/financing/FinancingLeadForm.tsx`
   - Formulaire 3 étapes dédié :
     - **Étape 1 — Votre projet** : entreprise déjà en activité (oui/non) · type de financement recherché (crédit bancaire / investisseur / fonds / matériel / trésorerie / lancement / autre) · montant approximatif (6 fourchettes de « <5M » à « >100M FCFA » + « je ne sais pas ») · état des documents (oui partiel / non / je ne sais pas).
     - **Étape 2 — Détails** : nom entreprise ou projet · description libre du projet/besoin (textarea) · ville.
     - **Étape 3 — Contact** : nom complet · téléphone · email · moyen de contact préféré (téléphone/WhatsApp/email) · consentement obligatoire.
   - Indicateur « Étape X sur 3 », validation Zod côté client, POST JSON vers `/api/public/financing-lead`.
   - Après succès : `router.navigate({ to: "/merci-demande-financement" })`.
   - Message de confirmation intermédiaire avant redirection : « Votre demande a bien été enregistrée. »

3. `src/routes/api/public/financing-lead.ts`
   - Endpoint public calqué sur `business-plan-lead.ts` : Zod strict, `recordProspect({ form_type: "lead", service: "Montage dossier de financement", audience: "creation", source: "landing-financement", tag: "financement", ... })`.
   - Forward vers `GHL_WEBHOOK_URL` si défini.
   - **Aucune modification de schéma DB** — on réutilise `prospects` tel quel (détails spécifiques dans `raw_payload`).

4. `src/routes/merci-demande-financement.tsx`
   - Page de remerciement minimale, `noindex,nofollow`, message : « Votre demande a bien été enregistrée. Des professionnels pourront vous contacter afin de mieux comprendre votre besoin et vous proposer un accompagnement adapté. »
   - Lien discret retour accueil. Sert de destination conversion GA4/Ads/Pixel.

## Fichiers à modifier

- `src/routes/__root.tsx` : ajouter `/montage-dossier-credit` et `/merci-demande-financement` à la liste `immersiveAuth` pour masquer Header/Footer/MobileCtaBar globaux.
- `src/routes/sitemap[.]xml.ts` : vérifier que ces routes ne sont PAS listées (sitemap explicite, rien à ajouter).
- `public/robots.txt` : aucune modification (le `noindex` suffit et évite de signaler l'URL).

## Direction visuelle

- Réutilisation stricte des tokens (`bg-background`, `text-primary`, `bg-primary`, ombres/rounded existants). Aucune nouvelle couleur.
- Typo actuelle (Poppins headings / Inter body).
- Sections alternées blanc / gris très clair. Cartes arrondies, ombres discrètes.
- Icônes lucide-react cohérentes (déjà utilisées ailleurs).

## Images

- **Règle mémoire projet respectée** : aucune image IA. Photos Unsplash réelles.
- Hero : entrepreneur/entrepreneure noir·e 30-50 ans devant ordinateur avec documents financiers (Unsplash). `loading="eager"` sur le hero, `loading="lazy"` ailleurs.
- Alt hero : « Entrepreneur ivoirien préparant son dossier de financement avec l'aide d'un professionnel comptable ».

## SEO & tracking

- `head()` : title « Montage de dossier de crédit en Côte d'Ivoire | Soumission Comptable », meta description du brief, `<meta name="robots" content="noindex,nofollow">`, `og:title`/`og:description` cohérents, **pas** de canonical, **pas** d'ajout sitemap.
- Pas de schema JSON-LD (page cachée — cohérent avec l'approche BP).
- GA4 via `trackEvent`, Meta `Lead` via `trackMetaConversion`.

## Ce qui n'est PAS fait (confirmez si besoin)

- Aucune migration DB.
- Aucune modification du `MultiStepLeadForm` existant (formulaire dédié isolé).
- Aucun lien vers cette landing depuis le site public (conforme à la demande).
- Aucun ajout à la nav, footer, sitemap, ni lien interne depuis d'autres pages.
