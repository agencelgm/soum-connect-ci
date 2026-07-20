
## État actuel (vérifié)

Le blocage à l'envoi existe déjà :
- `src/routes/lovable/email/suppression.ts` : le webhook Mailgun upsert chaque bounce dans `suppressed_emails` (raison = `bounce`).
- `src/routes/lovable/email/transactional/send.ts` (l.118-131) : vérification suppression avant tout envoi — fail-closed.
- `src/lib/email/send.server.ts` (l.45-64) : idem pour les envois serveur (cron, notify-partners…).
- Auth emails passent par la même queue, même check.

Donc dès qu'un bounce est reçu, tous les envois futurs vers cette adresse sont refusés. Rien à changer côté envoi.

## Ce qui manque

Un partenaire dont l'email bounce reste `approved` : la sélection continue de le cibler pour chaque nouveau prospect / relance illimité / drip académie. L'envoi est bloqué à la dernière étape (bien), mais :
- on gaspille du render + une ligne `suppressed` dans le log à chaque tentative,
- l'admin n'a aucune alerte visible qu'un partenaire est injoignable,
- le partenaire reste dans les stats "notifié" alors qu'il ne reçoit rien.

## Plan

### 1. Marquer les partenaires dont l'email bounce
Migration ajoutant à `partners` :
- `email_bounced_at timestamptz`
- `email_bounce_reason text` (`bounce` | `complaint`)

Dans `src/routes/lovable/email/suppression.ts`, après l'upsert de suppression, si `reason IN ('bounce','complaint')` : `UPDATE partners SET email_bounced_at = now(), email_bounce_reason = reason WHERE lower(email) = normalizedEmail AND email_bounced_at IS NULL`.

### 2. Exclure ces partenaires des sélections d'envoi
Dans `src/lib/notify-partners.server.ts` et tous les crons de `src/routes/api/public/hooks/*` : ajouter `.is('email_bounced_at', null)` aux requêtes qui listent les destinataires (nouveau prospect, illimité expiration, docs reminder, academy drip).

### 3. Rendre visible en admin
Dans `src/components/admin/SuppressionPanel.tsx` : afficher un badge "Partenaire bloqué" quand la suppression correspond à une ligne partners, plus un lien vers la fiche partenaire.
Dans la liste des partenaires (admin) : badge rouge "Email invalide (bounce)" et filtre dédié pour permettre soit un contact WhatsApp, soit une mise à jour manuelle de l'adresse (qui remet `email_bounced_at` à NULL après changement).

### 4. Réactivation manuelle
Une fois l'email corrigé côté admin, retirer aussi la ligne de `suppressed_emails` via le bouton existant du panneau Liste d'exclusion + reset `email_bounced_at`. (Un trigger sur `partners.email UPDATE` remet aussi `email_bounced_at = NULL` automatiquement pour éviter d'oublier.)

## Ce qui n'est PAS changé

- La logique d'envoi (déjà correcte).
- Le webhook Mailgun (déjà idempotent).
- Les templates.
