CREATE TABLE public.chariow_payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  product_id text NOT NULL,
  chariow_payment_id uuid,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.chariow_payment_intents TO authenticated;
GRANT ALL ON public.chariow_payment_intents TO service_role;

ALTER TABLE public.chariow_payment_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Intents: self insert"
  ON public.chariow_payment_intents
  FOR INSERT TO authenticated
  WITH CHECK (
    profile_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.id = chariow_payment_intents.partner_id
        AND p.profile_id = auth.uid()
        AND p.deleted_at IS NULL
    )
  );

CREATE POLICY "Intents: self read"
  ON public.chariow_payment_intents
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE INDEX idx_chariow_intents_pending
  ON public.chariow_payment_intents (product_id, created_at DESC)
  WHERE consumed_at IS NULL;
