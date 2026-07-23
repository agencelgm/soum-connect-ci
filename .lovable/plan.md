## Modifications à appliquer

### 1. Formulaire Business Plan — budget obligatoire
`src/components/business-plan/BusinessPlanLeadForm.tsx`
- Remplacer la liste `BUDGETS` par exactement :
  - "100 000 – 200 000 FCFA"
  - "300 000 – 500 000 FCFA"
  - "500 000 FCFA et plus"
  - "Je ne sais pas encore"
- Changer le libellé de la question : « Combien êtes-vous prêt à payer votre prestataire pour la rédaction de votre business plan ? »
- Ajouter `!budget` à la validation de `goStep3` (bloquant).
- Conserver le nom de champ `budget` dans le payload.
- Après succès API : au lieu de rediriger vers `/merci-demande-business-plan`, stocker le contexte dans `sessionStorage` puis rediriger vers `/offre-logo`.

`src/routes/api/public/business-plan-lead.ts`
- Rendre `budget` obligatoire côté backend : `z.string().min(1).max(120)`.

### 2. Persistance du contexte d'origine (sessionStorage)
Après réponse API OK des formulaires Business Plan et Financing, avant `navigate("/offre-logo")` :
```ts
sessionStorage.setItem("leadId", json.leadId);
sessionStorage.setItem("leadSource", "business-plan" | "financement");
sessionStorage.setItem("finalThankYouPath", "/merci-demande-business-plan" | "/merci-demande-financement");
```

Fichiers touchés :
- `src/components/business-plan/BusinessPlanLeadForm.tsx`
- `src/components/financing/FinancingLeadForm.tsx`

### 3. Nouveau parcours upsell (3 étapes)

`src/routes/offre-logo.tsx`
- `nextPath="/offre-site-internet"` (inchangé)
- `progressLabel="Étape 1 sur 3 — Offres complémentaires"`, `progressPercent={33}`

`src/routes/offre-site-internet.tsx`
- `nextPath="/offre-gestion-marketing"` (au lieu de `/merci`)
- `progressLabel="Étape 2 sur 3 — Offres complémentaires"`, `progressPercent={66}`

### 4. Nouvelle page `/offre-gestion-marketing`
Nouveau fichier `src/routes/offre-gestion-marketing.tsx`.
Comme les autres pages upsell est bâtie sur `OfferPage`, mais celle-ci a un CTA WhatsApp externe + logique de fin de parcours différente. Deux options :
- **Option retenue** : créer un composant inline dédié (calqué visuellement sur `OfferPage`) qui :
  - Affiche : badge « OFFRE EXCLUSIVE !! », titre « Besoin d'aide pour développer votre entreprise ? », sous-titre « Consultation en GESTION MARKETING », prix « Premier rendez-vous gratuit », description prévue, barre de progression 100 % (Étape 3 sur 3).
  - Bouton principal « Prendre mon rendez-vous gratuit » → enregistre `offer=marketing, interested=true` via `/api/public/lead-upsell`, puis ouvre `https://wa.me/2250798172339?text=…` (message pré-rempli demandé), puis redirige vers le `finalThankYouPath` récupéré dans `sessionStorage` (fallback `/merci-demande-business-plan`).
  - Bouton secondaire « Non merci, terminer ma demande » → enregistre `offer=marketing, interested=false`, redirige vers `finalThankYouPath`.
- `head()` avec `noindex, nofollow`.

Aussi : `src/components/upsell/OfferPage.tsx` doit lire `sessionStorage.finalThankYouPath` et remplacer `nextPath === "/merci"` par ce chemin si présent, pour couvrir le cas où le parcours change. Approche plus simple retenue : la navigation via `OfferPage` reste vers `nextPath` fixe (logo→site→marketing), et seule la page marketing consulte `finalThankYouPath`.

### 5. API `/api/public/lead-upsell` étendue
`src/routes/api/public/lead-upsell.ts`
- `offer` enum étendu à `["logo", "site", "marketing"]`.
- Dans la persistance sur `prospects.raw_payload` : ajouter mapping `marketing` → champs `upsell_marketing` et `upsell_marketing_at`.

### 6. Parcours Financing
`src/components/financing/FinancingLeadForm.tsx`
- Après succès, stocker `leadId`, `leadSource="financement"`, `finalThankYouPath="/merci-demande-financement"` dans `sessionStorage`, puis `navigate("/offre-logo")` au lieu de `/merci-demande-financement`.

### 7. Correction texte `/montage-dossier-credit`
`src/routes/montage-dossier-credit.tsx`
- Remplacer le paragraphe principal actuel par la version fournie (« constituer un dossier d'investissement… »).

### 8. Vérifications
- `tsgo` typecheck.
- Test manuel des deux parcours via Playwright headless : soumission BP → logo → site → marketing → page finale correcte ; idem pour financement.
- Confirmer que `leadId` reste attaché sur les 3 appels upsell et que la page finale correspond à la source.

### Fichiers modifiés/créés
Modifiés :
1. `src/components/business-plan/BusinessPlanLeadForm.tsx`
2. `src/routes/api/public/business-plan-lead.ts`
3. `src/components/financing/FinancingLeadForm.tsx`
4. `src/routes/offre-logo.tsx`
5. `src/routes/offre-site-internet.tsx`
6. `src/routes/api/public/lead-upsell.ts`
7. `src/routes/montage-dossier-credit.tsx`

Créés :
8. `src/routes/offre-gestion-marketing.tsx`

Non modifiés : offres EN, `OfferPage` (sauf besoin), Meta Pixel, webhooks GHL, autres formulaires/routes.
