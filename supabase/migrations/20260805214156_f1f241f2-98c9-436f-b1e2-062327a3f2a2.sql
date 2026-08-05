CREATE OR REPLACE FUNCTION public.maybe_grant_50pct_promo(_partner_id uuid)
 RETURNS TABLE(granted boolean, promotion_id uuid, ab_variant text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_bonus_total integer;
  v_bonus_spent integer;
  v_has_purchase boolean;
  v_has_active_promo boolean;
  v_variant text;
  v_promo_id uuid;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_bonus_total
    FROM public.credit_transactions
    WHERE partner_id = _partner_id AND tx_type = 'signup_bonus';

  IF v_bonus_total <= 0 THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text;
    RETURN;
  END IF;

  SELECT COALESCE(SUM(-amount), 0) INTO v_bonus_spent
    FROM public.credit_transactions
    WHERE partner_id = _partner_id AND tx_type = 'unlock_spend' AND amount < 0;

  SELECT EXISTS (
    SELECT 1 FROM public.chariow_payments
    WHERE partner_id = _partner_id AND status = 'credited'
  ) INTO v_has_purchase;

  SELECT EXISTS (
    SELECT 1 FROM public.partner_promotions
    WHERE partner_id = _partner_id AND used_at IS NULL AND expires_at > now()
  ) INTO v_has_active_promo;

  IF v_bonus_spent < (v_bonus_total * 0.5) OR v_has_purchase OR v_has_active_promo THEN
    RETURN QUERY SELECT false, NULL::uuid, NULL::text;
    RETURN;
  END IF;

  v_variant := CASE WHEN random() < 0.5 THEN 'A_credits' ELSE 'B_price_per_lead' END;

  INSERT INTO public.partner_promotions (
    partner_id, kind, credit_multiplier, unlimited_days, ab_variant, expires_at
  ) VALUES (
    _partner_id, '50pct_consumed', 5, 30, v_variant, now() + interval '4 days'
  )
  RETURNING id INTO v_promo_id;

  RETURN QUERY SELECT true, v_promo_id, v_variant;
END;
$function$;

UPDATE public.partner_promotions
   SET unlimited_days = 30
 WHERE used_at IS NULL AND unlimited_days <> 30;