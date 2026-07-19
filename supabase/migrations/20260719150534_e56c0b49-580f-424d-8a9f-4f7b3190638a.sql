-- Add unlimited access support + tx type for unlimited purchases
ALTER TYPE credit_tx_type ADD VALUE IF NOT EXISTS 'chariow_unlimited';

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS unlimited_until timestamptz;

-- Update unlock_lead to bypass credit check + spend when unlimited is active.
-- Solde intact : on n'incrémente PAS credits_balance et on log un tx à 0 pour traçabilité.
CREATE OR REPLACE FUNCTION public.unlock_lead(_publication_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_partner public.partners%ROWTYPE;
  v_pub public.lead_publications%ROWTYPE;
  v_prospect public.prospects%ROWTYPE;
  v_new_balance integer;
  v_is_unlimited boolean;
  v_spend integer;
BEGIN
  SELECT * INTO v_partner
  FROM public.partners
  WHERE profile_id = auth.uid() AND deleted_at IS NULL
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'partner_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF v_partner.status <> 'approved' THEN
    RAISE EXCEPTION 'partner_not_approved' USING ERRCODE = 'P0001';
  END IF;

  v_is_unlimited := (v_partner.unlimited_until IS NOT NULL AND v_partner.unlimited_until > now());

  IF NOT v_is_unlimited AND v_partner.credits_balance < 1 THEN
    RAISE EXCEPTION 'insufficient_credits' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO v_pub
  FROM public.lead_publications
  WHERE id = _publication_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'publication_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF NOT v_pub.is_active THEN
    RAISE EXCEPTION 'publication_inactive' USING ERRCODE = 'P0001';
  END IF;

  IF v_pub.unlock_count >= v_pub.max_unlocks THEN
    RAISE EXCEPTION 'publication_full' USING ERRCODE = 'P0001';
  END IF;

  IF v_pub.premium_until IS NOT NULL
     AND v_pub.premium_until > now()
     AND v_partner.tier <> 'premium' THEN
    RAISE EXCEPTION 'premium_window_active' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.lead_unlocks
    WHERE partner_id = v_partner.id AND publication_id = v_pub.id
  ) THEN
    SELECT * INTO v_prospect FROM public.prospects WHERE id = v_pub.prospect_id;
    RETURN jsonb_build_object(
      'already_unlocked', true,
      'credits_balance', v_partner.credits_balance,
      'unlimited_until', v_partner.unlimited_until,
      'prospect', to_jsonb(v_prospect)
    );
  END IF;

  IF v_is_unlimited THEN
    v_spend := 0;
    v_new_balance := v_partner.credits_balance;
  ELSE
    v_spend := 1;
    UPDATE public.partners
      SET credits_balance = credits_balance - 1,
          updated_at = now()
      WHERE id = v_partner.id
      RETURNING credits_balance INTO v_new_balance;
  END IF;

  INSERT INTO public.lead_unlocks (partner_id, publication_id, credits_spent)
    VALUES (v_partner.id, v_pub.id, v_spend);

  UPDATE public.lead_publications
    SET unlock_count = unlock_count + 1,
        updated_at = now()
    WHERE id = v_pub.id;

  INSERT INTO public.credit_transactions (partner_id, amount, balance_after, tx_type, reference_id, note, created_by)
    VALUES (
      v_partner.id,
      CASE WHEN v_is_unlimited THEN 0 ELSE -1 END,
      v_new_balance,
      'unlock_spend',
      v_pub.id,
      CASE WHEN v_is_unlimited THEN 'Déblocage lead (accès illimité)' ELSE 'Déblocage lead' END,
      auth.uid()
    );

  SELECT * INTO v_prospect FROM public.prospects WHERE id = v_pub.prospect_id;

  RETURN jsonb_build_object(
    'already_unlocked', false,
    'credits_balance', v_new_balance,
    'unlimited_until', v_partner.unlimited_until,
    'prospect', to_jsonb(v_prospect)
  );
END;
$function$;