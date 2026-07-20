-- 1) Empêcher l'escalade de privilèges sur la table partners via un trigger BEFORE UPDATE
CREATE OR REPLACE FUNCTION public.prevent_partner_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Les mises à jour depuis service_role (auth.uid() IS NULL) ou par un admin sont autorisées
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent') THEN
    RETURN NEW;
  END IF;

  IF NEW.status                IS DISTINCT FROM OLD.status
  OR NEW.credits_balance       IS DISTINCT FROM OLD.credits_balance
  OR NEW.tier                  IS DISTINCT FROM OLD.tier
  OR NEW.unlimited_until       IS DISTINCT FROM OLD.unlimited_until
  OR NEW.approved_at           IS DISTINCT FROM OLD.approved_at
  OR NEW.approved_by           IS DISTINCT FROM OLD.approved_by
  OR NEW.paused_at             IS DISTINCT FROM OLD.paused_at
  OR NEW.paused_by             IS DISTINCT FROM OLD.paused_by
  OR NEW.pause_reason          IS DISTINCT FROM OLD.pause_reason
  OR NEW.deleted_at            IS DISTINCT FROM OLD.deleted_at
  OR NEW.profile_id            IS DISTINCT FROM OLD.profile_id
  OR NEW.email_bounced_at      IS DISTINCT FROM OLD.email_bounced_at
  OR NEW.email_bounce_reason   IS DISTINCT FROM OLD.email_bounce_reason
  OR NEW.docs_received_at      IS DISTINCT FROM OLD.docs_received_at
  OR NEW.last_login_at         IS DISTINCT FROM OLD.last_login_at
  THEN
    RAISE EXCEPTION 'forbidden: cannot modify admin-controlled fields' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_prevent_privilege_escalation ON public.partners;
CREATE TRIGGER partners_prevent_privilege_escalation
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.prevent_partner_privilege_escalation();

-- 2) Ajouter search_path sur les fonctions SECURITY DEFINER de la file email qui n'en avaient pas
ALTER FUNCTION public.enqueue_email(text, jsonb)     SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint)     SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- 3) Révoquer EXECUTE sur les fonctions SECURITY DEFINER qui ne doivent pas être appelables
--    via l'API PostgREST par anon / authenticated. Les rôles service_role (edge server functions,
--    cron via pg_cron/pg_net) conservent l'accès. On garde has_role/unlock_lead/publish_prospect_as_lead
--    qui sont utilisées par les policies RLS ou exposées volontairement en RPC authentifiée.

-- Fonctions internes (queue emails, cron, triggers helpers)
REVOKE ALL ON FUNCTION public.enqueue_email(text, jsonb)                FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.read_email_batch(text, integer, integer)  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_email(text, bigint)                FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.email_queue_dispatch()                    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.auto_pause_inactive_partners()            FROM PUBLIC, anon, authenticated;

-- Helpers utilisés uniquement à l'intérieur des policies RLS (pas besoin d'EXECUTE direct pour anon)
REVOKE ALL ON FUNCTION public.is_partner_team(uuid, uuid)   FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.partner_id_for_user(uuid)     FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- RPC exposées mais réservées aux utilisateurs signés (l'admin est revérifié dans le corps)
REVOKE ALL ON FUNCTION public.publish_prospect_as_lead(uuid, text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.unlock_lead(uuid)                             FROM PUBLIC, anon;

-- Réaccorder EXECUTE seulement là où c'est nécessaire
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)         TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_partner_team(uuid, uuid)             TO authenticated;
GRANT EXECUTE ON FUNCTION public.partner_id_for_user(uuid)               TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_prospect_as_lead(uuid, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unlock_lead(uuid)                       TO authenticated;

-- service_role garde tout par sécurité (déjà le cas via ALL PRIVILEGES sur schéma)
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb)              TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint)              TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb)  TO service_role;
GRANT EXECUTE ON FUNCTION public.email_queue_dispatch()                  TO service_role;
GRANT EXECUTE ON FUNCTION public.auto_pause_inactive_partners()          TO service_role;