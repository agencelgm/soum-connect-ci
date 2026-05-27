-- Stabilise le workflow prospect -> publication -> déblocage crédits.

ALTER TABLE public.lead_publications
  ADD COLUMN IF NOT EXISTS non_contact_details jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Les anciennes publications utilisaient implicitement `qualified`; elles sont
-- maintenant explicitement publiées.
UPDATE public.prospects p
SET status = 'published',
    updated_at = now()
FROM public.lead_publications lp
WHERE lp.prospect_id = p.id
  AND p.status = 'qualified';

-- Backfill des infos visibles avant déblocage, avec allowlist non-contact.
UPDATE public.lead_publications lp
SET non_contact_details = jsonb_strip_nulls(jsonb_build_object(
    'company_name', p.company_name,
    'statut', p.statut,
    'delai', NULLIF(p.raw_payload ->> 'delai', ''),
    'nb_associes', p.raw_payload -> 'nbAssocies',
    'bureau', NULLIF(p.raw_payload ->> 'bureau', ''),
    'logo', NULLIF(p.raw_payload ->> 'logo', ''),
    'site_web', NULLIF(p.raw_payload ->> 'siteWeb', ''),
    'publicite', NULLIF(p.raw_payload ->> 'publicite', ''),
    'sujet', NULLIF(p.raw_payload ->> 'sujet', ''),
    'date_probleme', NULLIF(p.raw_payload ->> 'dateProbleme', ''),
    'source', p.source,
    'page_url', p.page_url,
    'form_type', p.form_type,
    'language', NULLIF(p.raw_payload ->> 'language', ''),
    'submitted_at', p.submitted_at
  ))
FROM public.prospects p
WHERE lp.prospect_id = p.id
  AND lp.non_contact_details = '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.unlock_lead(_publication_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_partner public.partners%ROWTYPE;
  v_pub public.lead_publications%ROWTYPE;
  v_prospect public.prospects%ROWTYPE;
  v_new_balance integer;
  v_already_unlocked boolean;
BEGIN
  SELECT * INTO v_partner
  FROM public.partners
  WHERE profile_id = auth.uid() AND deleted_at IS NULL
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'partner_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF v_partner.status <> 'approved' THEN
    RAISE EXCEPTION 'partner_not_approved' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO v_pub
  FROM public.lead_publications
  WHERE id = _publication_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'publication_not_found' USING ERRCODE = 'P0001';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.lead_unlocks
    WHERE partner_id = v_partner.id AND publication_id = v_pub.id
  ) INTO v_already_unlocked;

  IF v_already_unlocked THEN
    SELECT * INTO v_prospect FROM public.prospects WHERE id = v_pub.prospect_id;
    RETURN jsonb_build_object(
      'already_unlocked', true,
      'credits_balance', v_partner.credits_balance,
      'prospect', to_jsonb(v_prospect)
    );
  END IF;

  IF NOT v_pub.is_active THEN
    RAISE EXCEPTION 'publication_inactive' USING ERRCODE = 'P0001';
  END IF;

  IF v_pub.unlock_count >= v_pub.max_unlocks THEN
    RAISE EXCEPTION 'publication_full' USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.partners
  SET credits_balance = credits_balance - 1,
      updated_at = now()
  WHERE id = v_partner.id
    AND credits_balance >= 1
  RETURNING credits_balance INTO v_new_balance;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'insufficient_credits' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.lead_unlocks (partner_id, publication_id, credits_spent)
  VALUES (v_partner.id, v_pub.id, 1);

  UPDATE public.lead_publications
  SET unlock_count = unlock_count + 1,
      is_active = CASE WHEN unlock_count + 1 >= max_unlocks THEN false ELSE is_active END,
      updated_at = now()
  WHERE id = v_pub.id;

  INSERT INTO public.credit_transactions (
    partner_id,
    amount,
    balance_after,
    tx_type,
    reference_id,
    note,
    created_by
  )
  VALUES (
    v_partner.id,
    -1,
    v_new_balance,
    'unlock_spend',
    v_pub.id,
    'Déblocage lead',
    auth.uid()
  );

  SELECT * INTO v_prospect FROM public.prospects WHERE id = v_pub.prospect_id;

  RETURN jsonb_build_object(
    'already_unlocked', false,
    'credits_balance', v_new_balance,
    'prospect', to_jsonb(v_prospect)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_prospect_as_lead(
  _prospect_id uuid,
  _summary text DEFAULT NULL,
  _max_unlocks integer DEFAULT 6
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prospect public.prospects%ROWTYPE;
  v_pub_id uuid;
  v_details jsonb;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent')) THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = 'P0001';
  END IF;

  SELECT * INTO v_prospect
  FROM public.prospects
  WHERE id = _prospect_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'prospect_not_found' USING ERRCODE = 'P0001';
  END IF;

  IF v_prospect.status = 'rejected' THEN
    RAISE EXCEPTION 'prospect_rejected' USING ERRCODE = 'P0001';
  END IF;

  IF v_prospect.status = 'published' THEN
    RAISE EXCEPTION 'prospect_already_published' USING ERRCODE = 'P0001';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.lead_publications WHERE prospect_id = v_prospect.id
  ) THEN
    RAISE EXCEPTION 'prospect_already_has_publication' USING ERRCODE = 'P0001';
  END IF;

  v_details := jsonb_strip_nulls(jsonb_build_object(
    'company_name', v_prospect.company_name,
    'statut', v_prospect.statut,
    'delai', NULLIF(v_prospect.raw_payload ->> 'delai', ''),
    'nb_associes', v_prospect.raw_payload -> 'nbAssocies',
    'bureau', NULLIF(v_prospect.raw_payload ->> 'bureau', ''),
    'logo', NULLIF(v_prospect.raw_payload ->> 'logo', ''),
    'site_web', NULLIF(v_prospect.raw_payload ->> 'siteWeb', ''),
    'publicite', NULLIF(v_prospect.raw_payload ->> 'publicite', ''),
    'sujet', NULLIF(v_prospect.raw_payload ->> 'sujet', ''),
    'date_probleme', NULLIF(v_prospect.raw_payload ->> 'dateProbleme', ''),
    'source', v_prospect.source,
    'page_url', v_prospect.page_url,
    'form_type', v_prospect.form_type,
    'language', NULLIF(v_prospect.raw_payload ->> 'language', ''),
    'submitted_at', v_prospect.submitted_at
  ));

  INSERT INTO public.lead_publications (
    prospect_id,
    published_by,
    service,
    city,
    audience,
    legal_form,
    budget,
    summary,
    non_contact_details,
    max_unlocks
  ) VALUES (
    v_prospect.id,
    auth.uid(),
    v_prospect.service,
    v_prospect.city,
    v_prospect.audience,
    v_prospect.legal_form,
    v_prospect.budget,
    COALESCE(_summary, v_prospect.message),
    v_details,
    GREATEST(1, LEAST(_max_unlocks, 20))
  )
  RETURNING id INTO v_pub_id;

  UPDATE public.prospects
  SET status = 'published',
      qualified_at = now(),
      qualified_by = auth.uid(),
      updated_at = now()
  WHERE id = v_prospect.id;

  RETURN v_pub_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.unlock_lead(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.publish_prospect_as_lead(uuid, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.unlock_lead(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_prospect_as_lead(uuid, text, integer) TO authenticated;
