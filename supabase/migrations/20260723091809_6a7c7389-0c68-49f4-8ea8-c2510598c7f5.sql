
-- Promotions ciblées : ×5 crédits ou +2 mois illimité
CREATE TABLE public.partner_promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('50pct_consumed','zero_credit_winback')),
  credit_multiplier integer NOT NULL DEFAULT 5,
  unlimited_days integer NOT NULL DEFAULT 60,
  ab_variant text NOT NULL DEFAULT 'A_credits' CHECK (ab_variant IN ('A_credits','B_price_per_lead')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz NULL,
  used_payment_id uuid NULL REFERENCES public.chariow_payments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.partner_promotions TO authenticated;
GRANT ALL ON public.partner_promotions TO service_role;

ALTER TABLE public.partner_promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners see their own promotions"
  ON public.partner_promotions FOR SELECT
  TO authenticated
  USING (
    public.is_partner_team(auth.uid(), partner_id)
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'agent')
  );

-- Une seule promo active par partenaire (non utilisée ET non expirée).
CREATE UNIQUE INDEX partner_promotions_one_active
  ON public.partner_promotions (partner_id)
  WHERE used_at IS NULL;

CREATE INDEX partner_promotions_partner_idx ON public.partner_promotions (partner_id);
CREATE INDEX partner_promotions_expires_idx ON public.partner_promotions (expires_at);

-- Idempotence des envois email par promo × slot
CREATE TABLE public.promo_email_sends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid NOT NULL REFERENCES public.partner_promotions(id) ON DELETE CASCADE,
  slot_key text NOT NULL,
  template_name text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (promotion_id, slot_key)
);

GRANT SELECT ON public.promo_email_sends TO authenticated;
GRANT ALL ON public.promo_email_sends TO service_role;

ALTER TABLE public.promo_email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read promo email sends"
  ON public.promo_email_sends FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

-- Fonction : accorde la promo "50% consommé" si conditions remplies.
-- Appelée depuis le server fn après unlock. SECURITY DEFINER + search_path verrouillé.
CREATE OR REPLACE FUNCTION public.maybe_grant_50pct_promo(_partner_id uuid)
RETURNS TABLE (granted boolean, promotion_id uuid, ab_variant text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bonus_total integer;
  v_bonus_spent integer;
  v_has_purchase boolean;
  v_has_active_promo boolean;
  v_variant text;
  v_promo_id uuid;
BEGIN
  -- Total des crédits accordés en bonus signup (typiquement 30)
  SELECT COALESCE(SUM(amount), 0) INTO v_bonus_total
    FROM public.credit_transactions
    WHERE partner_id = _partner_id AND tx_type = 'signup_bonus';

  IF v_bonus_total <= 0 THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text;
    RETURN;
  END IF;

  -- Crédits consommés (montants négatifs des unlock)
  SELECT COALESCE(SUM(-amount), 0) INTO v_bonus_spent
    FROM public.credit_transactions
    WHERE partner_id = _partner_id AND tx_type = 'unlock_spend' AND amount < 0;

  -- Le partenaire a-t-il déjà acheté sur Chariow ?
  SELECT EXISTS (
    SELECT 1 FROM public.chariow_payments
    WHERE partner_id = _partner_id AND status = 'credited'
  ) INTO v_has_purchase;

  -- Promo déjà active ?
  SELECT EXISTS (
    SELECT 1 FROM public.partner_promotions
    WHERE partner_id = _partner_id AND used_at IS NULL AND expires_at > now()
  ) INTO v_has_active_promo;

  -- Conditions : ≥50% du bonus consommé, jamais acheté, pas de promo active
  IF v_bonus_spent < (v_bonus_total * 0.5) OR v_has_purchase OR v_has_active_promo THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text;
    RETURN;
  END IF;

  -- Attribution aléatoire A/B (50/50)
  v_variant := CASE WHEN random() < 0.5 THEN 'A_credits' ELSE 'B_price_per_lead' END;

  INSERT INTO public.partner_promotions (
    partner_id, kind, credit_multiplier, unlimited_days, ab_variant, expires_at
  ) VALUES (
    _partner_id, '50pct_consumed', 5, 60, v_variant, now() + interval '4 days'
  )
  RETURNING id INTO v_promo_id;

  RETURN QUERY SELECT true, v_promo_id, v_variant;
END;
$$;

REVOKE ALL ON FUNCTION public.maybe_grant_50pct_promo(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.maybe_grant_50pct_promo(uuid) TO service_role;

-- Cron horaire pour la campagne winback (jeudi -> dimanche)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'promo-winback-dispatch') THEN
    PERFORM cron.schedule(
      'promo-winback-dispatch',
      '10 * * * *',
      $cron$
        SELECT net.http_post(
          url := 'https://project--69d480db-5675-4318-9200-2d195d8c8033.lovable.app/api/public/hooks/promo-winback-dispatch',
          headers := jsonb_build_object(
            'Content-Type','application/json',
            'apikey', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
          ),
          body := '{}'::jsonb
        );
      $cron$
    );
  END IF;
END $$;
