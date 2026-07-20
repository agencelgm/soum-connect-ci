
-- Daily notification state: one row per (day, partner) to enforce 1 email / 24h
CREATE TABLE public.daily_notification_state (
  day date NOT NULL,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  first_notified_at timestamptz NOT NULL DEFAULT now(),
  channel text NOT NULL DEFAULT 'unknown',
  PRIMARY KEY (day, partner_id)
);
GRANT ALL ON public.daily_notification_state TO service_role;
ALTER TABLE public.daily_notification_state ENABLE ROW LEVEL SECURITY;

-- Global daily digest schedule (one row per day)
CREATE TABLE public.digest_schedule (
  day date PRIMARY KEY,
  first_publication_at timestamptz NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz
);
GRANT ALL ON public.digest_schedule TO service_role;
ALTER TABLE public.digest_schedule ENABLE ROW LEVEL SECURITY;

-- Buffer of pending leads to include in each partner's next digest
CREATE TABLE public.pending_lead_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  publication_id uuid NOT NULL REFERENCES public.lead_publications(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  UNIQUE (partner_id, publication_id)
);
CREATE INDEX pending_lead_notifications_partner_pending_idx
  ON public.pending_lead_notifications (partner_id)
  WHERE sent_at IS NULL;
GRANT ALL ON public.pending_lead_notifications TO service_role;
ALTER TABLE public.pending_lead_notifications ENABLE ROW LEVEL SECURITY;
