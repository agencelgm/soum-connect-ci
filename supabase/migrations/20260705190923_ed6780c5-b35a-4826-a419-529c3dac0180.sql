-- 1) Colonne last_login_at
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS partners_last_login_idx
  ON public.partners (status, last_login_at);

-- 2) Extensions cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3) Fonction auto-pause
CREATE OR REPLACE FUNCTION public.auto_pause_inactive_partners()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  WITH updated AS (
    UPDATE public.partners
       SET status = 'paused',
           paused_at = now(),
           paused_by = NULL,
           pause_reason = 'Inactivité (14 jours sans connexion)',
           updated_at = now()
     WHERE status = 'approved'
       AND deleted_at IS NULL
       AND (
         (last_login_at IS NOT NULL AND last_login_at < now() - interval '14 days')
         OR (last_login_at IS NULL AND approved_at IS NOT NULL AND approved_at < now() - interval '14 days')
       )
     RETURNING 1
  )
  SELECT COUNT(*) INTO v_count FROM updated;
  RETURN v_count;
END;
$$;

-- 4) Planification quotidienne 03:00 UTC
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-pause-inactive-partners') THEN
    PERFORM cron.unschedule('auto-pause-inactive-partners');
  END IF;
  PERFORM cron.schedule(
    'auto-pause-inactive-partners',
    '0 3 * * *',
    $cron$ SELECT public.auto_pause_inactive_partners(); $cron$
  );
END $$;