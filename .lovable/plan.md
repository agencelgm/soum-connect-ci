## Objectif
Vérifier en bout-en-bout que `GHL_WEBHOOK_URL` reçoit bien les soumissions des formulaires du site.

## Méthode

Je vais envoyer **3 requêtes de test** directement sur les 3 endpoints publics du site en production, avec des données clairement marquées « TEST » pour qu'elles soient faciles à repérer et à supprimer dans GHL.

| # | Endpoint | Payload de test | Étiquettes |
|---|---|---|---|
| 1 | `POST /api/public/lead` | Formulaire principal complet | `source: "test-webhook"`, `nom: "TEST Webhook"`, `email: "test+webhook@soumissioncomptable.com"` |
| 2 | `POST /api/public/contact` | Formulaire contact | `source: "test-webhook"`, `nom: "TEST Contact"` |
| 3 | `POST /api/public/lead-upsell` | Upsell logo, `interested: true` | `source: "test-webhook-upsell"` |

Pour chaque appel je vérifie :
1. **Status HTTP 200** retourné par le serveur Lovable → le schéma Zod a accepté le payload
2. **Logs serveur** (via `stack_modern--server-function-logs`) → je cherche les traces `[ghl] sent` ou `[ghl] failed` pour confirmer que le code a tenté l'envoi à GHL
3. **Confirmation de ton côté dans GHL** : ouvrir l'historique du workflow Inbound Webhook et vérifier que les 3 entrées « TEST » sont arrivées avec :
   - `tag: "soumissioncomptable"`
   - `source: "test-webhook"` (ou `test-webhook-upsell`)
   - `page_url`, `referrer`, `submitted_at`, `received_at`, `user_agent` présents

## Ce que ça va produire dans GHL

3 leads de test apparaîtront dans ton workflow GHL. Si tu as déjà branché des automatisations (SMS de bienvenue, ajout de tag, email…), elles vont se déclencher pour ces 3 entrées. Tu pourras ensuite les supprimer manuellement (recherche `TEST Webhook`).

## Si le test échoue

Diagnostic dans cet ordre :
- **HTTP 400** côté Lovable → un champ du schéma Zod est invalide, je corrige le payload de test
- **HTTP 200 mais rien dans GHL** → je relis les logs serveur (`[ghl] failed: <raison>`), je vérifie que `GHL_WEBHOOK_URL` est bien lu côté worker, et que l'URL pointe vers le bon workflow
- **HTTP 500** → erreur côté handler, je corrige le code

## Validation finale

Tu me confirmes ce que tu vois dans GHL (« j'ai bien reçu les 3 TEST » ou « rien n'arrive »), et on conclut.
