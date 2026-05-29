## Meta Pixel + Conversions API

**Pixel ID** `695405827723663` traité comme constante publique (visible côté client de toute façon) — pas de build secret nécessaire.
**Token CAPI** déjà stocké côté serveur (`META_CAPI_ACCESS_TOKEN`).

### Événements
- Formulaire devis (`MultiStepLeadForm`) → `Lead`
- Inscription cabinet partenaire → `CompleteRegistration`
- SAV / `ContactForm` → **non tracké**
- PageView : auto côté browser uniquement

### Fichiers

1. **`src/lib/meta-pixel.ts`** (nouveau)
   - Constante `META_PIXEL_ID = "695405827723663"`
   - `trackMetaConversion(eventName, params, userData)` :
     - génère `event_id` (crypto.randomUUID)
     - appelle `fbq('track', name, params, {eventID})` côté navigateur
     - `fetch('/api/public/meta-capi', ...)` en fire-and-forget avec mêmes données + event_id + event_source_url + user_agent
   - Garde SSR-safe (no-op si `window` absent)

2. **`src/routes/__root.tsx`**
   - Ajouter le snippet Pixel (init + PageView initial) dans `scripts`
   - Hook `useEffect` dans `RootComponent` qui écoute `useRouterState(pathname)` et déclenche `fbq('track', 'PageView')` à chaque navigation SPA
   - `<noscript>` fallback non nécessaire (TanStack SSR, mais bon à ajouter pour la complétude)

3. **`src/routes/api/public/meta-capi.ts`** (nouveau)
   - POST handler avec validation Zod stricte (whitelist `Lead`, `CompleteRegistration`)
   - Hash SHA-256 des PII côté serveur (em, ph, fn, ln, ct) — bien plus sécurisé
   - POST vers `https://graph.facebook.com/v21.0/695405827723663/events?access_token=...`
   - Lit le token depuis `process.env.META_CAPI_ACCESS_TOKEN` dans le handler (jamais module-scope)
   - Rate-limit basique IP (en mémoire, 30 req/min)
   - Aucune erreur ne remonte au client (log uniquement, ne casse jamais l'UX)

4. **`src/components/lead/MultiStepLeadForm.tsx`**
   - Après `res.ok` (avant `trackEvent`), appeler :
     ```ts
     trackMetaConversion("Lead", {
       content_category: "quote_request",
       content_name: values.service,
       service: values.service,
       city: values.localisation,
       audience: audienceHint,
       source,
       value: 0, currency: "XOF",
     }, { em: values.email, ph: values.mobile, fn: values.nom, ct: values.localisation });
     ```

5. **`src/routes/inscription-partenaire.tsx`**
   - Après `toast.success`, avant `navigate`, appeler :
     ```ts
     trackMetaConversion("CompleteRegistration", {
       content_category: "partner_signup",
       content_name: form.cabinet_name,
       city: form.city,
     }, { em: form.email, ph: form.phone, fn: form.contact_first_name, ln: form.contact_last_name, ct: form.city });
     ```

### Hors scope
- Bannière de consentement RGPD (à traiter séparément si besoin)
- Test Events Manager : tu pourras coller un `META_TEST_EVENT_CODE` plus tard si tu veux valider

### Validation après build
1. Charger n'importe quelle page → Pixel Helper (extension Chrome) doit montrer PageView
2. Soumettre un devis test → 1 événement `Lead` (Pixel + CAPI dédupliqué via `event_id`)
3. Créer un compte partenaire test → 1 événement `CompleteRegistration`
4. Vérifier dans Events Manager → Diagnostics que l'EMQ ≥ 6/10
