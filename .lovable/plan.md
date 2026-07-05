## Objectif
Suivre la dernière connexion de chaque cabinet partenaire, mettre automatiquement en pause ceux inactifs depuis 14 jours, et exposer un tableau de bord d'activité à l'admin. Un cabinet en pause peut toujours se connecter et parcourir la marketplace, mais ne peut plus débloquer de prospects tant qu'il n'a pas contacté l'équipe LGM sur WhatsApp pour réactivation.

---

## 1. Base de données (migration)

Ajouter à la table `partners` :
- `last_login_at TIMESTAMPTZ` — mise à jour à chaque appel `getMyPartner` par le partenaire.
- Index `partners_last_login_idx` sur `(status, last_login_at)` pour le cron.

Créer une **fonction SQL** `public.auto_pause_inactive_partners()` (SECURITY DEFINER) qui :
- Sélectionne les partenaires `status = 'approved'` dont `last_login_at < now() - interval '14 days'` (ou `NULL` avec `approved_at < now() - interval '14 days'`).
- Passe leur `status` à `'paused'`, set `paused_at = now()`, `pause_reason = 'Inactivité (14 jours sans connexion)'`, `paused_by = NULL`.
- Retourne le nombre de comptes affectés (pour logs cron).

Planifier via `pg_cron` : exécution **quotidienne à 03:00 UTC** (`0 3 * * *`) qui appelle `SELECT public.auto_pause_inactive_partners();`. Pas de `pg_net`, pas d'endpoint HTTP — logique 100 % SQL, plus fiable et gratuit.

## 2. Backend — mise à jour du "dernier login"

**`src/lib/partners.functions.ts` → `getMyPartner`**
- Après avoir récupéré le partenaire (branche `profile_id = userId`, donc pas les membres d'équipe), mettre à jour `last_login_at = now()` via `supabaseAdmin` **si** l'appelant est bien le propriétaire du cabinet.
- Fire-and-forget (pas de `await` bloquant sur le résultat) pour ne pas ralentir chaque appel.

Cette approche évite d'ajouter un endpoint dédié : `getMyPartner` est déjà appelé sur chaque page authentifiée et à chaque login.

## 3. Frontend — bandeau "Compte en pause"

Créer `src/components/partner/PausedBanner.tsx` (basé sur `PendingApprovalBanner`) :
- Couleur orange (distincte de l'amber "pending").
- Titre : *"Compte en pause — réactivation requise"*
- Texte : *"Votre compte est actuellement en pause (motif : {pause_reason}). Vous pouvez toujours parcourir la marketplace, mais le déblocage de prospects est désactivé. Contactez-nous sur WhatsApp pour réactiver votre compte."*
- Bouton **WhatsApp** vert → +225 07 98 17 23 39 avec message pré-rempli :
  > *"Bonjour LGM, je souhaite réactiver mon compte partenaire ({cabinet_name}). Merci."*

Intégration dans `src/routes/_authenticated.tsx` : afficher `PausedBanner` quand `me.partner.status === 'paused'` (mêmes règles d'exclusion staff que le bandeau pending).

## 4. Frontend — marketplace (extension du blocage existant)

`src/routes/_authenticated.marketplace.tsx` :
- Ajouter `partnerPaused = data.partner.status === 'paused'` et passer à `LeadCard`.
- Étendre la branche *"Approbation requise"* pour couvrir aussi le cas paused, avec un libellé conditionnel : *"Réactivation requise"* si paused, *"Approbation requise"* si pending.

La garde serveur `unlock_lead` refuse déjà tout statut ≠ `approved` (`partner_not_approved`) — aucune modification RPC nécessaire.

## 5. Admin — Tableau de bord "Activité partenaires"

Nouvelle server function `getPartnerActivity` (dans `src/lib/partners.functions.ts`, middleware admin/agent) qui retourne pour tous les partenaires non-supprimés :
- `id, cabinet_name, contact_first_name, contact_last_name, email, phone, city, status, last_login_at, approved_at, paused_at, pause_reason, credits_balance`
- Trié par `last_login_at` croissant (les plus inactifs en tête), avec `NULL` en premier (jamais connectés).

Nouvelle section dans `src/routes/_authenticated.admin.tsx` (nouvel onglet `?tab=activity` ou bloc dans l'onglet Partners existant, à décider — cf. question ci-dessous) affichant un tableau avec :
| Cabinet | Contact | Ville | Statut | Dernière connexion | Jours d'inactivité | Crédits | Actions |
- Colonne "Dernière connexion" : *"il y a X jours"* + date brute au survol. Rouge si ≥ 14 j, orange 7-13 j, vert < 7 j, gris "Jamais connecté".
- Colonne Actions : bouton **Réactiver** (visible si `status = paused`) — utilise le flux existant `resumePartner`. Bouton **Mettre en pause** manuel si `approved`.
- Filtres rapides : *Tous / Actifs / En pause / Inactifs 7+ jours / Jamais connectés*.

## 6. Fichiers touchés
- **Migration** : ajout colonne `last_login_at`, index, fonction `auto_pause_inactive_partners`, planification `pg_cron`.
- `src/lib/partners.functions.ts` : bump `last_login_at` dans `getMyPartner` + nouvelle `getPartnerActivity`.
- `src/components/partner/PausedBanner.tsx` (nouveau).
- `src/routes/_authenticated.tsx` : montage du bandeau paused.
- `src/routes/_authenticated.marketplace.tsx` : prise en compte de `paused`.
- `src/routes/_authenticated.admin.tsx` : nouvelle section activité.
- `src/lib/contact.ts` : ajout d'un helper `whatsappReactivationUrl(cabinet_name)`.

---

## Résultat attendu
- À chaque connexion partenaire, `last_login_at` est mis à jour.
- Chaque nuit, le cron passe automatiquement en pause les cabinets inactifs ≥ 14 j.
- Un cabinet paused voit un bandeau orange avec bouton WhatsApp de réactivation, parcourt la marketplace mais ne peut pas débloquer de leads.
- L'admin dispose d'un tableau trié par inactivité pour piloter la réactivation manuelle et les relances commerciales.

---

## Questions avant de coder
1. **Placement du tableau d'activité** : nouvel onglet dédié dans `/admin?tab=activity`, ou intégré directement à l'onglet **Partenaires** existant (colonne "Dernière connexion" ajoutée à la liste actuelle) ?
2. **Seuil confirmé** à 14 jours ? (option : 21 j / 30 j si tu veux être plus souple pour le lancement)
