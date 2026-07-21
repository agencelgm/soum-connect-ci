## Cause

Le message « forbidden: cannot modify admin-controlled fields » vient du trigger `prevent_partner_privilege_escalation` sur `public.partners`. Il bloque toute modification des champs sensibles (dont `credits_balance`) sauf si :
- `auth.uid() IS NULL` (appel service_role), OU
- l'appelant a le rôle `admin` ou `agent`.

Mais notre RPC `public.unlock_lead` (SECURITY DEFINER) fait `UPDATE public.partners SET credits_balance = credits_balance - 1` pendant que `auth.uid()` reste l'ID du **partenaire** appelant (JWT du user). Résultat : le trigger considère cela comme une escalade et lève l'erreur.

Autrement dit : l'utilisateur voyait cette erreur en cliquant "Débloquer ce lead" (visible sur la capture) — pas au moment de l'approbation. Toute action qui passe par une RPC SECURITY DEFINER qui touche à un champ protégé de `partners` déclenche le même blocage (ce serait aussi le cas de futurs RPC de recharge, etc.).

## Correctif

Mettre à jour la fonction trigger `prevent_partner_privilege_escalation` pour autoriser également les appels provenant d'une fonction SECURITY DEFINER de confiance, sans affaiblir la protection contre les auto-modifications par un partenaire directement via PostgREST.

Migration (un seul `CREATE OR REPLACE FUNCTION`) :

```sql
CREATE OR REPLACE FUNCTION public.prevent_partner_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Autorisé :
  --  - service_role / pas de JWT : auth.uid() IS NULL
  --  - admin / agent
  --  - appel via une fonction SECURITY DEFINER (ex: unlock_lead) :
  --    dans ce cas current_user (postgres, owner de la fonction) diffère
  --    de session_user (authenticated). PostgREST en accès direct garde
  --    current_user = session_user = 'authenticated', donc les updates
  --    directs d'un partenaire restent bloqués.
  IF auth.uid() IS NULL
     OR current_user IS DISTINCT FROM session_user
     OR public.has_role(auth.uid(), 'admin')
     OR public.has_role(auth.uid(), 'agent') THEN
    RETURN NEW;
  END IF;

  IF NEW.status              IS DISTINCT FROM OLD.status
  OR NEW.credits_balance     IS DISTINCT FROM OLD.credits_balance
  OR NEW.tier                IS DISTINCT FROM OLD.tier
  OR NEW.unlimited_until     IS DISTINCT FROM OLD.unlimited_until
  OR NEW.approved_at         IS DISTINCT FROM OLD.approved_at
  OR NEW.approved_by         IS DISTINCT FROM OLD.approved_by
  OR NEW.paused_at           IS DISTINCT FROM OLD.paused_at
  OR NEW.paused_by           IS DISTINCT FROM OLD.paused_by
  OR NEW.pause_reason        IS DISTINCT FROM OLD.pause_reason
  OR NEW.deleted_at          IS DISTINCT FROM OLD.deleted_at
  OR NEW.profile_id          IS DISTINCT FROM OLD.profile_id
  OR NEW.email_bounced_at    IS DISTINCT FROM OLD.email_bounced_at
  OR NEW.email_bounce_reason IS DISTINCT FROM OLD.email_bounce_reason
  OR NEW.docs_received_at    IS DISTINCT FROM OLD.docs_received_at
  OR NEW.last_login_at       IS DISTINCT FROM OLD.last_login_at
  THEN
    RAISE EXCEPTION 'forbidden: cannot modify admin-controlled fields'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;
```

## Vérification

- Un partenaire clique "Débloquer ce lead" → RPC `unlock_lead` décrémente `credits_balance`, plus d'erreur.
- Un partenaire tentant un `UPDATE public.partners SET credits_balance = 999 WHERE id = <soi>` en direct via PostgREST reste bloqué (current_user = session_user = 'authenticated').
- L'approbation admin/agent (via `supabaseAdmin`, `auth.uid()` IS NULL) reste OK, comme avant.
