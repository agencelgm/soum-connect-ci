
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

  -- Incrémente le compteur mais NE désactive PAS le lead quand il est plein :
  -- il restera visible dans la marketplace avec un état "Complet".
  UPDATE public.lead_publications
    SET unlock_count = unlock_count + 1,
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

-- Réactive les publications passées à inactive uniquement parce qu'elles étaient pleines
-- (pour qu'elles s'affichent à nouveau avec l'état "Complet"). On ne touche pas aux
-- publications désactivées manuellement par un admin qui n'étaient pas pleines.
UPDATE public.lead_publications
  SET is_active = true
  WHERE is_active = false
    AND unlock_count >= max_unlocks;
