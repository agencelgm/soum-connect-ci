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
  --  - appel via une fonction SECURITY DEFINER de confiance (ex: unlock_lead) :
  --    current_user (owner de la fonction, ex: postgres) diffère de session_user
  --    (authenticated). Un UPDATE direct par le partenaire via PostgREST garde
  --    current_user = session_user = 'authenticated' et reste bloqué.
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