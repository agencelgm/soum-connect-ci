
CREATE TABLE IF NOT EXISTS public.email_alert_state (
  scope text NOT NULL,
  metric text NOT NULL,
  last_alert_at timestamptz NOT NULL DEFAULT now(),
  last_rate numeric,
  last_volume integer,
  PRIMARY KEY (scope, metric)
);
GRANT SELECT ON public.email_alert_state TO authenticated;
GRANT ALL ON public.email_alert_state TO service_role;
ALTER TABLE public.email_alert_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view alert state"
  ON public.email_alert_state FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
