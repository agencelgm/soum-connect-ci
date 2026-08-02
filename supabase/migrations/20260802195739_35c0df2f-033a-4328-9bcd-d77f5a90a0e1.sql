CREATE TABLE public.funnel_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page text NOT NULL,
  event text NOT NULL,
  session_id text,
  lead_id uuid,
  email text,
  amount_label text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.funnel_events TO authenticated;
GRANT ALL ON public.funnel_events TO service_role;

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read funnel events"
ON public.funnel_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE INDEX idx_funnel_events_page_created ON public.funnel_events (page, created_at DESC);
CREATE INDEX idx_funnel_events_event ON public.funnel_events (event);
CREATE UNIQUE INDEX idx_funnel_events_session_event
  ON public.funnel_events (page, session_id, event)
  WHERE session_id IS NOT NULL;