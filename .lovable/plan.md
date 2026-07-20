## Règle finale

**Un seul email de notification par partenaire par période de 24h.** Objectif : les amener à se connecter une fois par jour, sans les spammer.

- **Partenaires Premium / Illimité** : dès qu'un prospect est approuvé aujourd'hui pour la première fois, ils reçoivent immédiatement un email listant ce prospect + tous ceux qui seront approuvés ensuite dans la même journée seront visibles sur leur dashboard (mais pas de 2ᵉ email).
  - Techniquement : on envoie l'email à la première approbation du jour uniquement. Les approbations suivantes de la journée n'envoient plus rien à ces partenaires.
- **Tous les autres partenaires** (Approved standard + Paused) : aucun email immédiat. À **T+3h** après la première approbation du jour, on leur envoie **un seul email digest** listant tous les prospects approuvés entre T et T+3h.
  - Les prospects approuvés après T+3h le même jour ne déclenchent aucun autre email. Le prochain cycle démarrera à la première approbation du lendemain.

Résultat : **au maximum 1 email/partenaire/24h**.

## Impact volume

Aujourd'hui : ~1 300 emails/jour (16 leads × 83 partenaires).
Après : 83 partenaires × 1 email/jour max = **≤ 83 emails/jour** (~15× moins).

## Plan d'implémentation

### 1. Nouvelle table `daily_notification_state`
Suit ce qui a déjà été envoyé aujourd'hui à chaque partenaire, et l'horaire prévu du digest non-premium.

```sql
CREATE TABLE public.daily_notification_state (
  day date NOT NULL,
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  first_notified_at timestamptz,          -- horodatage du 1er email envoyé aujourd'hui
  PRIMARY KEY (day, partner_id)
);
```

Et une table planifiant le digest global du jour (une seule ligne / jour) :

```sql
CREATE TABLE public.digest_schedule (
  day date PRIMARY KEY,
  first_publication_at timestamptz NOT NULL,   -- 1er prospect approuvé du jour
  scheduled_for timestamptz NOT NULL,          -- first_publication_at + 3h
  sent_at timestamptz
);
```

Buffer des prospects à inclure dans le digest de chaque partenaire non-premium :

```sql
CREATE TABLE public.pending_lead_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  publication_id uuid NOT NULL REFERENCES lead_publications(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  UNIQUE (partner_id, publication_id)
);
```

Les trois tables : RLS activée, `GRANT ALL … TO service_role` uniquement, aucune policy `authenticated` (accès serveur exclusif).

### 2. Refactor `src/lib/notify-partners.server.ts`
À chaque nouvelle publication de lead :
1. Charger les partenaires éligibles (`approved`/`paused`, non supprimés, `email_bounced_at IS NULL`).
2. Pour chaque partenaire :
   - **Premium ou `unlimited_until > now()`** :
     - Regarder `daily_notification_state` (day = aujourd'hui, partner_id).
     - Si aucune ligne → envoyer l'email `new-prospect` immédiatement et insérer la ligne avec `first_notified_at = now()`.
     - Sinon → skip (déjà notifié aujourd'hui).
   - **Autres partenaires** :
     - Insérer une ligne dans `pending_lead_notifications` (unicité par `partner_id + publication_id`).
3. Si `digest_schedule` n'a pas de ligne pour aujourd'hui, l'insérer (`scheduled_for = now() + interval '3 hours'`).

### 3. Nouveau template `new-prospects-digest`
Fichier : `src/lib/email-templates/new-prospects-digest.tsx`.

- Reçoit `{ partnerFirstName, isPaused, creditsBalance, hasUnlimited, unlimitedUntil, leads: [...], loginUrl, rechargeUrl }`.
- Rend N cartes prospect (nom, service, ville, budget, audience, message, CTA vers `/marketplace?lead=<id>`).
- Bloc conditionnel "Vous êtes en pause" (avec CTA WhatsApp de réactivation) vs bloc solde crédits / illimité.
- Enregistré dans `src/lib/email-templates/registry.ts`.

### 4. Nouveau cron `src/routes/api/public/hooks/send-lead-digests.ts`
Programmé toutes les 15 min via pg_cron.
- Lire `digest_schedule` où `sent_at IS NULL AND scheduled_for <= now()`.
- Pour chaque partenaire ayant des `pending_lead_notifications` non envoyées ET **pas de ligne `daily_notification_state` pour aujourd'hui** :
  - Envoyer le digest avec `idempotencyKey = "lead-digest:<partner_id>:<day>"`.
  - Insérer `daily_notification_state (day, partner_id, first_notified_at = now())`.
  - Marquer les `pending_lead_notifications` correspondantes `sent_at = now()`.
- Marquer `digest_schedule.sent_at = now()`.

Ainsi, un Premium qui aurait exceptionnellement basculé côté "non premium" en cours de journée ne reçoit pas de 2ᵉ email — la règle 1/24h est appliquée par `daily_notification_state`.

pg_cron : `*/15 * * * *` → `net.http_post` vers `/api/public/hooks/send-lead-digests`.

### 5. Registry & nettoyage
- Ajouter `new-prospects-digest` dans `src/lib/email-templates/registry.ts`.
- Conserver `new-prospect` (utilisé pour l'envoi immédiat Premium/Illimité).
- `new-prospect-paused` devient inutilisé — on le laisse en place mais on ne l'appelle plus (suppression possible plus tard).

## Fichiers touchés
- Migration SQL (3 nouvelles tables + GRANT + RLS)
- `src/lib/notify-partners.server.ts` (nouvelle logique de dispatch)
- `src/lib/email-templates/new-prospects-digest.tsx` (nouveau)
- `src/lib/email-templates/registry.ts` (enregistrement)
- `src/routes/api/public/hooks/send-lead-digests.ts` (nouveau cron)
- Insert `cron.schedule` toutes les 15 min

## Confirmation avant que je code
Je pars sur ces défauts sauf si tu me dis autrement :
- **Fuseau du "jour"** : `day = (now() AT TIME ZONE 'Africa/Abidjan')::date` (UTC en Côte d'Ivoire, donc aucun décalage — juste pour être explicite).
- **Premium immédiat** = `tier = 'premium'` **OU** `unlimited_until > now()`.
- Aucun plancher/plafond horaire — si le premier prospect est approuvé à 22h30, le digest part à 01h30. Si tu veux borner (ex. jamais avant 7h, jamais après 21h), dis-le-moi et je l'intègre.
