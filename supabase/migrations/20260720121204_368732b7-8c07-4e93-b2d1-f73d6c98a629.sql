
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS email_bounced_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_bounce_reason text;

CREATE INDEX IF NOT EXISTS partners_email_lower_idx ON public.partners (lower(email));
CREATE INDEX IF NOT EXISTS partners_email_bounced_at_idx ON public.partners (email_bounced_at) WHERE email_bounced_at IS NOT NULL;

-- Reset the bounce flag automatically when the email address changes.
CREATE OR REPLACE FUNCTION public.reset_partner_email_bounce()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    NEW.email_bounced_at := NULL;
    NEW.email_bounce_reason := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS partners_reset_email_bounce ON public.partners;
CREATE TRIGGER partners_reset_email_bounce
BEFORE UPDATE OF email ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.reset_partner_email_bounce();
