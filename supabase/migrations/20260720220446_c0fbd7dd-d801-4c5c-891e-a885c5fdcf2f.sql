
CREATE TABLE public.growth_email_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  slot text NOT NULL CHECK (slot IN ('monday','wednesday','friday')),
  subject text NOT NULL,
  preview text NOT NULL,
  body_markdown text NOT NULL,
  cta_label text NOT NULL,
  cta_url text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  generated_by text NOT NULL DEFAULT 'gemini-2.5-flash',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (week_start, slot)
);

GRANT SELECT ON public.growth_email_batches TO authenticated;
GRANT ALL ON public.growth_email_batches TO service_role;
ALTER TABLE public.growth_email_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view growth batches"
  ON public.growth_email_batches FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.growth_email_sends (
  batch_id uuid NOT NULL REFERENCES public.growth_email_batches(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  sent_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (batch_id, partner_id)
);

GRANT ALL ON public.growth_email_sends TO service_role;
ALTER TABLE public.growth_email_sends ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_growth_batches_scheduled ON public.growth_email_batches (sent_at, scheduled_for);
