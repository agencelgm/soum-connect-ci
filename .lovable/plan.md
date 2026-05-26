## Bilan de l'existant

J'ai audité **toutes les pages** : il existe en réalité **4 points d'entrée de soumission** sur le site (le reste des "boutons CTA" sont juste des liens qui redirigent vers `/demande-soumissions`). Tous les 4 envoient déjà leurs réponses vers `GHL_WEBHOOK_URL` côté serveur — il manque juste à brancher le webhook et à fiabiliser l'étiquette source.


| #   | Formulaire                        | Endpoint                  | Où il apparaît                                                                                                         |
| --- | --------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1   | MultiStepLeadForm (5 étapes)      | `/api/public/lead`        | Accueil `/`, `/creer-son-entreprise-cote-divoire`, **tous les articles de guides** `/guides/*`, `/demande-soumissions` |
| 2   | ContactForm                       | `/api/public/contact`     | `/nous-contacter`                                                                                                      |
| 3   | OfferPage Logo (oui/non)          | `/api/public/lead-upsell` | `/offre-logo`, `/en/logo-offer`                                                                                        |
| 4   | OfferPage Site internet (oui/non) | `/api/public/lead-upsell` | `/offre-site-internet`, `/en/website-offer`                                                                            |


## Problèmes à corriger

1. **Webhook GHL non branché** — la variable `GHL_WEBHOOK_URL` n'existe pas encore.
2. **Étiquette source imprécise** :
  - Tous les articles de guide envoient `source: "home-lead-form"` → impossible de savoir si le lead vient de "TVA en Côte d'Ivoire" ou de "Créer une SARL CEPICI"
  - `/creer-son-entreprise-cote-divoire` envoie aussi `"home-lead-form"` au lieu de son nom
  - Les pages OfferPage logo/site n'envoient **aucun** champ `source`

## Plan

### Étape 1 — Activer le webhook (toi, 2 min dans GHL)

1. Dans GoHighLevel : **Automation → Workflows → New → Trigger : Inbound Webhook**
2. Copier l'URL générée (format `https://services.leadconnectorhq.com/hooks/...`)
3. Me communiquer l'URL — je l'enregistre dans le secret `GHL_WEBHOOK_URL`

À partir de là, les 4 formulaires envoient déjà tout en JSON vers GHL.

### Étape 2 — Étiquette source précise sur chaque page (moi, code)

Je vais propager une étiquette unique sur chaque emplacement de formulaire :


| Page                                            | Valeur `source` envoyée à GHL                 |
| ----------------------------------------------- | --------------------------------------------- |
| Accueil `/`                                     | `home-hero`                                   |
| `/creer-son-entreprise-cote-divoire`            | `page-creer-son-entreprise`                   |
| `/demande-soumissions`                          | `page-demande-soumissions`                    |
| `/guides/cout-creation-entreprise-cote-divoire` | `guide-cout-creation-entreprise-cote-divoire` |
| `/guides/<slug>` (générique)                    | `guide-<slug>`                                |
| `/nous-contacter`                               | `contact-form`                                |
| `/offre-logo`                                   | `upsell-logo`                                 |
| `/offre-site-internet`                          | `upsell-site-internet`                        |
| Pages `/en/*` correspondantes                   | suffixe `-en`                                 |


Changements de code :

- `src/components/home/LeadFormCard.tsx` : déjà prêt, accepte une prop `source` — il suffira de la passer depuis chaque page.
- `src/routes/index.tsx` : passer `source="home-hero"`.
- `src/routes/creer-son-entreprise-cote-divoire.tsx` : passer `source="page-creer-son-entreprise"`.
- `src/components/guides/ArticleLayout.tsx` : recevoir le `slug` de l'article et passer `source={"guide-" + slug}` à `<LeadFormCard />`. Mettre à jour `src/routes/guides.$slug.tsx` pour transmettre le slug.
- `src/routes/demande-soumissions.tsx` : changer le source en `"page-demande-soumissions"` (plus explicite).
- `src/components/upsell/OfferPage.tsx` : ajouter `source: offer === "logo" ? "upsell-logo" : "upsell-site-internet"` au payload, plus un suffixe `-en` quand `language === "en"`.
- `src/routes/api/public/lead-upsell.ts` : ajouter `source: z.string().max(64).optional()` au schéma Zod pour qu'il soit accepté et relayé à GHL.

### Étape 3 — Champs de traçabilité supplémentaires (moi, code)

Ajouter dans **chaque** payload envoyé à GHL :

- `page_url` : URL exacte de la page où le formulaire a été soumis (`window.location.pathname + search`)
- `referrer` : `document.referrer` (utile pour voir si le lead vient d'Instagram, Google, etc.)
- `submitted_at` : date côté client (le serveur ajoute déjà `received_at`)

Côté serveur, étendre les 3 schémas Zod (`lead.ts`, `contact.ts`, `lead-upsell.ts`) pour accepter ces 3 nouveaux champs optionnels et les forwarder tels quels dans le payload GHL.

### Étape 4 — Test bout-en-bout

1. Je remplis le formulaire de l'accueil → on vérifie dans GHL que le payload arrive avec `source: "home-hero"` et toutes les réponses (logo, siteWeb, publicite, bureau, etc.)
2. Idem depuis un article de guide → on vérifie `source: "guide-<slug>"`
3. Idem depuis `/offre-logo` (clic "Oui" puis "Non") → on vérifie `source: "upsell-logo"` + `interested: true/false`
4. Idem `/nous-contacter` → on vérifie `source: "contact-form"`

## Exemple de payload final reçu par GHL (depuis un article de guide)

```json
{
  "source": "guide-cout-creation-entreprise-cote-divoire",
  "page_url": "/guides/cout-creation-entreprise-cote-divoire",
  "referrer": "https://www.google.com/",
  "language": "fr",
  "service": "Création d'entreprise",
  "statut": "SARL",
  "localisation": "Cocody",
  "delai": "Dans le mois",
  "budget": "500 000 - 1 000 000 FCFA",
  "logo": "oui",
  "siteWeb": "non",
  "publicite": "oui",
  "bureau": "non",
  "nbAssocies": 2,
  "nom": "Kader Konan",
  "mobile": "+225 07 00 00 00 00",
  "email": "kader@example.com",
  "entreprise": "LGM",
  "consent": true,
  "leadId": "uuid-v4",
  "received_at": "2026-05-26T20:56:00.000Z",
  "user_agent": "..."
  "tag": "soumissioncomptable"
}
```

Avec ça, dans GHL tu pourras créer des automatisations différentes par étiquette (ex. "si source commence par `guide-` → tag 'éducation' ; si `upsell-logo` + `interested: true` → workflow logo direct").

## Évolutions possibles (pas dans ce plan)

- Webhooks GHL distincts par type (un pour leads, un pour upsells, un pour contact) — facile à ajouter
- Signature HMAC pour sécuriser
- Sauvegarde miroir dans Lovable Cloud pour avoir un historique consultable côté site