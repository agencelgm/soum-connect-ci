ALTER TABLE public.prospect_assignments
  ADD COLUMN IF NOT EXISTS assigned_by uuid,
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz NOT NULL DEFAULT now();

CREATE TABLE public.prospect_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id uuid NOT NULL REFERENCES public.prospects(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  author_name text,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX prospect_comments_prospect_idx ON public.prospect_comments(prospect_id, created_at DESC);
GRANT SELECT ON public.prospect_comments TO authenticated;
GRANT ALL ON public.prospect_comments TO service_role;
ALTER TABLE public.prospect_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff or assigned commercial read comments" ON public.prospect_comments FOR SELECT TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent')
    OR EXISTS (SELECT 1 FROM public.prospect_assignments a WHERE a.prospect_id = prospect_comments.prospect_id AND a.commercial_id = auth.uid())
  );