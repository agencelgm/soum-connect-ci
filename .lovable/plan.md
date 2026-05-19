## Audit — état actuel

Bonnes nouvelles, déjà en place :
- `public/robots.txt` : OK (Allow /, Disallow admin/api, Sitemap déclaré, GPTBot/ClaudeBot/Perplexity autorisés, CCBot bloqué).
- `public/llms.txt` : présent (mémoire projet).
- `src/routes/sitemap[.]xml.ts` : route serveur, priorités + guides dynamiques alignés.
- Meta titles/descriptions uniques sur chaque route via `buildPageHead()` dans `src/lib/seo.ts`.
- Schema JSON-LD : `Organization` + `LocalBusiness` (home), `BreadcrumbList` partout, `FAQPage` (FAQ), `HowTo` (diaspora), `Article` (guides).
- Hreflang FR↔EN, canonical en leaf only (pas de doublon root).
- HTTPS : géré automatiquement par Lovable au publish.

Manques bloquants pour les Phases 2 + 3 :
1. **Formulaires non branchés** — `LeadFormCard.tsx` et `/demande-soumissions` ont un `// TODO` et ne font qu'un `setTimeout`. Aucune soumission ne part vraiment.
2. **Aucun tracking** — pas de GA4, pas de `dataLayer`, pas d'événement `soumission_envoyee`.
3. **Image OG manquante** — `DEFAULT_OG_IMAGE = "/og-image.png"` référencée mais le fichier n'existe pas dans `public/`. Conséquence : pas d'aperçu sur WhatsApp / réseaux sociaux.
4. **Vérification Google Search Console** — pas de balise `<meta name="google-site-verification">`.

## Ce que je vais faire (sans bloquer sur des infos externes)

### 1. Brancher le formulaire `/demande-soumissions` à un endpoint serveur
Créer `src/routes/api/public/lead.ts` (route serveur TanStack Start, `/api/public/lead`) qui :
- valide le payload avec Zod (mêmes règles que le formulaire),
- accepte les champs : service, statut, description, localisation, délai, budget, nom, whatsapp, email, entreprise, consent, source, language,
- si la variable d'env `GHL_WEBHOOK_URL` est définie → forward POST JSON vers GHL,
- sinon → log structuré (les leads ne se perdent pas dans la console serveur en attendant que vous me donniez l'URL GHL),
- répond 200 `{ ok: true }`.

Côté client :
- `src/routes/demande-soumissions.tsx` : remplacer le TODO par un `fetch('/api/public/lead', { method: 'POST', body: JSON.stringify(values) })` avec gestion d'erreur (toast + reste sur l'étape 3 si échec), et push `dataLayer` au succès.
- Idem pour `src/components/home/LeadFormCard.tsx`.

### 2. Préparer le tracking GA4 (prêt-à-allumer)
- Ajouter `src/lib/analytics.ts` exposant `trackEvent(name, params)` qui push dans `window.dataLayer` (no-op si absent).
- Dans `src/routes/__root.tsx`, ajouter conditionnellement le snippet `gtag.js` via `head().scripts` si `import.meta.env.VITE_GA4_ID` est défini. Tant qu'aucun ID n'est fourni, rien n'est chargé (zéro impact perf).
- Câbler `trackEvent('soumission_envoyee', { service, localisation, language })` au succès des deux formulaires.

### 3. Image OG par défaut
- Générer une image OG 1200×630 « SoumissionsComptables.ci — Comparez 5 cabinets agréés en 48h » et l'écrire dans `public/og-image.png`, pour que la référence dans `seo.ts` cesse d'être cassée.

### 4. Préparer la vérification Google Search Console
- Ajouter dans `__root.tsx` un `<meta name="google-site-verification">` lu depuis `import.meta.env.VITE_GSC_VERIFICATION`. Tant que vide → la balise n'est pas émise. Quand vous me passerez le code, il suffira de l'ajouter aux secrets.

### 5. Vérifications post-changement
- `curl -I` sur `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/api/public/lead` (OPTIONS) pour confirmer 200.
- Validation rapide du JSON-LD principal sur `schema.org/validator` (je donne les URLs à coller, pas de moyen de l'automatiser depuis ici).
- Lancer un scan SEO Lovable (`seo--trigger_scan`) après les corrections.

## Hors périmètre (vous devez agir)
- Achat domaines `.ci` / `.com` (Phase 1).
- Création comptes Google Search Console / GA4 / Business Profile.
- Configuration WhatsApp Business.
- Création du compte GoHighLevel + récupération de l'URL webhook + emails de confirmation.
- Rédaction des 7 articles de blog (Phase 4) et des pages géographiques Cocody/Yopougon/Marcory/Plateau (Phase 4).
- Soumission du sitemap à GSC, configuration des conversions GA4 côté Google.
- PageSpeed Insights (je peux mesurer après publish, pas avant).
- Campagne Facebook Ads, contacts partenaires, article invité.

## Ce dont j'aurai besoin de vous quand vous serez prêt
- `GHL_WEBHOOK_URL` (à ajouter via Secrets Lovable) → branchera vraiment les leads.
- `VITE_GA4_ID` (genre `G-XXXXXXXXXX`) → activera gtag.js et l'event de conversion.
- Code de vérification GSC (`google-site-verification`).

## Détails techniques

```
src/
├─ lib/
│  └─ analytics.ts             ← nouveau (helper dataLayer)
├─ routes/
│  ├─ __root.tsx               ← + gtag.js conditionnel + meta GSC conditionnelle
│  ├─ api/
│  │  └─ public/
│  │     └─ lead.ts            ← nouveau (POST, zod, forward GHL ou log)
│  ├─ demande-soumissions.tsx  ← onSubmit → fetch + trackEvent
│  └─ ...
├─ components/home/
│  └─ LeadFormCard.tsx         ← onSubmit → fetch + trackEvent
public/
└─ og-image.png                ← généré (1200×630)
```

Pas de migration DB, pas de Lovable Cloud activé pour cette étape (le `/api/public/lead` se contente de forwarder ou logger). On pourra ajouter une table `leads` plus tard si vous voulez aussi stocker en base, mais ce n'est pas dans la checklist.
