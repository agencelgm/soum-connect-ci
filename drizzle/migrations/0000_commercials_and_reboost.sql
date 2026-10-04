ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'commercial';

ALTER TABLE public.lead_publications
  ADD COLUMN IF NOT EXISTS boost_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_boosted_at timestamptz;

CREATE TABLE public.prospect_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL UNIQUE REFERENCES public.prospects(id) ON DELETE CASCADE,
  commercial_id uuid NOT NULL,
  commercial_name text,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  note text,
  decision text CHECK (decision IN ('approved','rejected')),
  decided_at timestamptz
);
CREATE INDEX prospect_assignments_commercial_idx ON public.prospect_assignments(commercial_id, unlocked_at DESC);
GRANT SELECT ON public.prospect_assignments TO authenticated;
GRANT ALL ON public.prospect_assignments TO service_role;
ALTER TABLE public.prospect_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own assignments or admin" ON public.prospect_assignments FOR SELECT TO authenticated
  USING (commercial_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.commercial_unlock_prospect(_prospect_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_last timestamptz;
  v_p public.prospects%ROWTYPE;
  v_name text;
BEGIN
  IF v_uid IS NULL OR NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = v_uid AND role::text = 'commercial') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = 'P0001';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext('commercial:' || v_uid::text));
  IF EXISTS (SELECT 1 FROM public.prospect_assignments WHERE commercial_id = v_uid AND decided_at IS NULL) THEN
    RAISE EXCEPTION 'open_assignment' USING ERRCODE = 'P0001';
  END IF;
  SELECT max(unlocked_at) INTO v_last FROM public.prospect_assignments WHERE commercial_id = v_uid;
  IF v_last IS NOT NULL AND v_last > now() - interval '5 minutes' THEN
    RAISE EXCEPTION 'cooldown' USING ERRCODE = 'P0001';
  END IF;
  SELECT * INTO v_p FROM public.prospects WHERE id = _prospect_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'prospect_not_found' USING ERRCODE = 'P0001'; END IF;
  IF v_p.status <> 'pending_qualification' THEN RAISE EXCEPTION 'already_taken' USING ERRCODE = 'P0001'; END IF;
  IF EXISTS (SELECT 1 FROM public.prospect_assignments WHERE prospect_id = _prospect_id) THEN
    RAISE EXCEPTION 'already_taken' USING ERRCODE = 'P0001';
  END IF;
  SELECT COALESCE(NULLIF(full_name,''), email) INTO v_name FROM public.profiles WHERE id = v_uid;
  INSERT INTO public.prospect_assignments (prospect_id, commercial_id, commercial_name) VALUES (_prospect_id, v_uid, v_name);
  RETURN to_jsonb(v_p);
END; $$;

CREATE OR REPLACE FUNCTION public.commercial_close_prospect(_prospect_id uuid, _note text, _decision text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF _decision NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'bad_decision' USING ERRCODE = 'P0001'; END IF;
  IF array_length(regexp_split_to_array(btrim(coalesce(_note,'')), '\s+'), 1) < 10 OR btrim(coalesce(_note,'')) = '' THEN
    RAISE EXCEPTION 'note_too_short' USING ERRCODE = 'P0001';
  END IF;
  UPDATE public.prospect_assignments SET note = btrim(_note), decision = _decision, decided_at = now()
    WHERE prospect_id = _prospect_id AND commercial_id = v_uid AND decided_at IS NULL;
  IF NOT FOUND THEN RAISE EXCEPTION 'not_found' USING ERRCODE = 'P0001'; END IF;
  UPDATE public.prospects SET
    status = (CASE WHEN _decision = 'approved' THEN 'qualified' ELSE 'rejected' END)::prospect_status,
    qualified_at = now(), qualified_by = v_uid,
    qualification_notes = btrim(_note), updated_at = now()
  WHERE id = _prospect_id;
END; $$;

CREATE OR REPLACE FUNCTION public.reboost_publication(_publication_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.lead_publications SET
    published_at = now(), premium_until = now() + interval '3 hours',
    is_active = true, boost_count = boost_count + 1, last_boosted_at = now(), updated_at = now()
  WHERE id = _publication_id;
END; $$;

REVOKE ALL ON FUNCTION public.reboost_publication(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reboost_publication(uuid) TO service_role;
REVOKE ALL ON FUNCTION public.commercial_unlock_prospect(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.commercial_close_prospect(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.commercial_unlock_prospect(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.commercial_close_prospect(uuid, text, text) TO authenticated;