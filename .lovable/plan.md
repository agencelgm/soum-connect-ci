## Objectif

Créer une landing page autonome dédiée au service "rédaction de business plan" à l'URL `/redaction-business-plan-cote-divoire`, non indexée (invisible depuis la nav, le footer, le sitemap et les moteurs), avec un formulaire 3 étapes dédié et une page de remerciement `/merci-demande-business-plan` pour le suivi de conversion.

## Positionnement (règles éditoriales)

- Soumission Comptable = plateforme de mise en relation, jamais rédacteur.
- Formulations autorisées uniquement : « Trouvez un professionnel… », « Recevez jusqu'à 5 propositions… », « Comparez… ».
- Jamais de promesse de financement, de faux témoignages, de chiffres inventés, de logos de banques.
- Vouvoiement, ton rassurant, contexte ivoirien, FCFA.

## Fichiers à créer

1. `src/routes/redaction-business-plan-cote-divoire.tsx`
   - Route publique mais `noindex,nofollow` dans le `head()` + exclue du sitemap.
   - Structure exacte du brief : Header allégé → Hero + formulaire → bandeau réassurance → Problème → Agitation → Solution → 3 étapes → Contenu du BP → Profils → Comparer les offres → Questions à poser → Confiance → FAQ (accordéon `<details>` HTML statique, conforme aux règles projet) → CTA final → Footer allégé.
   - Rendu autonome : n'utilise pas `Header`/`Footer`/`MobileCtaBar` globaux (retire les chromes via un flag `immersive` dans `__root.tsx`, comme déjà fait pour marketplace/recharger). Header/footer minimaux locaux (logo à gauche, bouton "Recevoir mes soumissions" à droite qui scrolle vers `#formulaire`).
   - Bouton fixe mobile (`Recevoir mes propositions`) qui scrolle vers le formulaire, sans masquer les champs.
   - Événements analytics via `trackEvent` : `landing_page_view` (mount), `form_start`, `form_step_1_complete`, `form_step_2_complete`, `form_submit`, `cta_click`, `phone_click`, `whatsapp_click`, et conversion `business_plan_lead`.
   - Meta Pixel `Lead` déclenché à la soumission via `trackMetaConversion`.

2. `src/components/business-plan/BusinessPlanLeadForm.tsx`
   - Formulaire 3 étapes dédié (les champs ne correspondent pas au `MultiStepLeadForm` existant — objectifs BP, avancement, secteur, description, ville, délai, budget spécifique BP, coordonnées + moyen de contact préféré + consentement).
   - Indicateur "Étape X sur 3", validation Zod côté client, envoi POST JSON vers `/api/public/business-plan-lead`.
   - Après succès : `router.navigate({ to: "/merci-demande-business-plan" })`.

3. `src/routes/api/public/business-plan-lead.ts`
   - Endpoint public (calqué sur `contact.ts` / `lead.ts`) : Zod strict, `recordProspect({ form_type: "lead", service: "Rédaction business plan", audience: "creation", source: "landing-business-plan", ... })`.
   - Forward vers `GHL_WEBHOOK_URL` si défini, avec `tag: "business-plan"` pour segmenter côté CRM.
   - Aucune modification de schéma DB — on réutilise `prospects` tel quel (le détail spécifique BP part dans `raw_payload`).

4. `src/routes/merci-demande-business-plan.tsx`
   - Page de remerciement minimale, `noindex,nofollow`, message exact du brief, lien retour discret vers l'accueil. Sert de destination pour tracking conversion GA4/Ads/Pixel.

## Fichiers à modifier

- `src/routes/__root.tsx` : ajouter `/redaction-business-plan-cote-divoire` et `/merci-demande-business-plan` à la liste `immersiveAuth` (renommée mentalement en "immersive") pour masquer Header/Footer/MobileCtaBar globaux sur ces pages.
- `src/routes/sitemap[.]xml.ts` : s'assurer que ces deux routes ne sont PAS listées (par défaut le sitemap est explicite — vérifier lors de l'implémentation, ne rien ajouter).
- Aucune modification de `public/robots.txt` : le `noindex` dans `head()` suffit et évite de signaler l'URL.

## Direction visuelle

- Réutilisation stricte des tokens existants (`bg-background`, `text-primary`, `bg-primary`, ombres/rounded déjà en place). Aucune nouvelle couleur.
- Typo actuelle (Poppins headings / Inter body déjà chargées dans `__root.tsx`).
- Cartes arrondies, ombres discrètes, sections alternées blanc / gris très clair.

## Images

- Hero : 1 photo réaliste (entrepreneur ivoirien + professionnel autour d'un document) via Unsplash — pas d'IA (règle mémoire projet). URL Unsplash directe avec `loading="eager"` sur le hero, `loading="lazy"` sur le reste.
- Alt du hero : « Entrepreneur ivoirien recherchant un professionnel pour la rédaction de son business plan en Côte d'Ivoire ».

## SEO & tracking

- `head()` : title « Business plan Côte d'Ivoire | Comparez 5 offres », meta description du brief, `<meta name="robots" content="noindex,nofollow">`, `og:title`/`og:description` cohérents, PAS de canonical (page cachée), PAS d'ajout au sitemap.
- Schema JSON-LD FAQPage à partir de la FAQ (utile même si noindex, ne coûte rien) — optionnel, à confirmer si vous préférez zéro schema sur une page cachée.
- Événements GA4 via `trackEvent` (helper existant `src/lib/analytics.ts`), Meta `Lead` via `trackMetaConversion` existant.

## Ce qui n'est PAS fait (à me confirmer si besoin)

- Aucune migration DB.
- Aucune modification du `MultiStepLeadForm` existant (formulaire séparé pour ne pas polluer les autres pages).
- Pas de lien vers cette landing depuis le site public (conforme à votre demande "ne doit pas apparaitre dans la vraie page").
