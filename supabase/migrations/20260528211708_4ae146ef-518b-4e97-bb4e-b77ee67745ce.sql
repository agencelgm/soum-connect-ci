-- 1) Ajouter le nouveau type de transaction
ALTER TYPE public.credit_tx_type ADD VALUE IF NOT EXISTS 'chariow_purchase';

-- 2) Table d'idempotence des paiements Chariow
CREATE TABLE IF NOT EXISTS public.chariow_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  license_code text NOT NULL UNIQUE,
  product_id text NOT NULL,
  email text NOT NULL,
  partner_id uuid NULL,
  credits_granted integer NOT NULL DEFAULT 0,
  amount_label text NULL,
  status text NOT NULL DEFAULT 'pending', -- pending | credited | unmatched | error
  error_message text NULL,
  raw_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NULL
);

CREATE INDEX IF NOT EXISTS chariow_payments_email_idx ON public.chariow_payments (email);
CREATE INDEX IF NOT EXISTS chariow_payments_partner_idx ON public.chariow_payments (partner_id);

GRANT ALL ON public.chariow_payments TO service_role;

ALTER TABLE public.chariow_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Chariow payments: admin read"
ON public.chariow_payments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));