
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'regular';

ALTER TABLE public.partners
  DROP CONSTRAINT IF EXISTS partners_tier_check;
ALTER TABLE public.partners
  ADD CONSTRAINT partners_tier_check CHECK (tier IN ('premium','regular'));

ALTER TABLE public.lead_publications
  ADD COLUMN IF NOT EXISTS premium_until timestamptz;

-- Migration des leads existants vers le nouveau plafond de 5
UPDATE public.lead_publications
  SET max_unlocks = 5
  WHERE max_unlocks > 5 AND unlock_count < 5;

-- Republie la fonction de publication: défaut 5, fenêtre premium 3h
CREATE OR REPLACE FUNCTION public.publish_prospect_as_lead(_prospect_id uuid, _summary text DEFAULT NULL::text, _max_unlocks integer DEFAULT 5)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_prospect public.prospects%ROWTYPE;
  v_pub_id uuid;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent')) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO v_prospect FROM public.prospects WHERE id = _prospect_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'prospect_not_found' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.lead_publications (
    prospect_id, published_by, service, city, audience, legal_form, budget, summary, max_unlocks, premium_until
  ) VALUES (
    v_prospect.id,
    auth.uid(),
    v_prospect.service,
    v_prospect.city,
    v_prospect.audience,
    v_prospect.legal_form,
    v_prospect.budget,
    COALESCE(_summary, v_prospect.message),
    GREATEST(1, LEAST(_max_unlocks, 10)),
    now() + interval '3 hours'
  )
  RETURNING id INTO v_pub_id;

  UPDATE public.prospects
    SET status = 'qualified',
        qualified_at = now(),
        qualified_by = auth.uid(),
        updated_at = now()
    WHERE id = v_prospect.id AND status <> 'qualified';

  RETURN v_pub_id;
END;
$function$;

-- Republie unlock_lead pour respecter la fenêtre premium
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

  IF v_partner.credits_balance < 1 THEN
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

  -- Fenêtre premium : seuls les partenaires premium peuvent débloquer
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
      'prospect', to_jsonb(v_prospect)
    );
  END IF;

  UPDATE public.partners
    SET credits_balance = credits_balance - 1,
        updated_at = now()
    WHERE id = v_partner.id
    RETURNING credits_balance INTO v_new_balance;

  INSERT INTO public.lead_unlocks (partner_id, publication_id, credits_spent)
    VALUES (v_partner.id, v_pub.id, 1);

  UPDATE public.lead_publications
    SET unlock_count = unlock_count + 1,
        is_active = CASE WHEN unlock_count + 1 >= max_unlocks THEN false ELSE is_active END,
        updated_at = now()
    WHERE id = v_pub.id;

  INSERT INTO public.credit_transactions (partner_id, amount, balance_after, tx_type, reference_id, note, created_by)
    VALUES (v_partner.id, -1, v_new_balance, 'unlock_spend', v_pub.id, 'Déblocage lead', auth.uid());

  SELECT * INTO v_prospect FROM public.prospects WHERE id = v_pub.prospect_id;

  RETURN jsonb_build_object(
    'already_unlocked', false,
    'credits_balance', v_new_balance,
    'prospect', to_jsonb(v_prospect)
  );
END;
$function$;
