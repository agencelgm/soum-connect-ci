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
    prospect_id, published_by, service, city, audience, legal_form, budget, summary, max_unlocks
  ) VALUES (
    v_prospect.id,
    auth.uid(),
    v_prospect.service,
    v_prospect.city,
    v_prospect.audience,
    v_prospect.legal_form,
    v_prospect.budget,
    COALESCE(_summary, v_prospect.message),
    GREATEST(1, LEAST(_max_unlocks, 20))
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
$function$