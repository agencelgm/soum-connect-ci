CREATE TABLE public.partner_video_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  video_slug text NOT NULL,
  max_progress numeric NOT NULL DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, video_slug)
);

GRANT SELECT, INSERT, UPDATE ON public.partner_video_progress TO authenticated;
GRANT ALL ON public.partner_video_progress TO service_role;

ALTER TABLE public.partner_video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can read own partner progress"
  ON public.partner_video_progress FOR SELECT
  TO authenticated
  USING (public.is_partner_team(auth.uid(), partner_id));

CREATE POLICY "Team can insert own partner progress"
  ON public.partner_video_progress FOR INSERT
  TO authenticated
  WITH CHECK (public.is_partner_team(auth.uid(), partner_id));

CREATE POLICY "Team can update own partner progress"
  ON public.partner_video_progress FOR UPDATE
  TO authenticated
  USING (public.is_partner_team(auth.uid(), partner_id))
  WITH CHECK (public.is_partner_team(auth.uid(), partner_id));

CREATE POLICY "Staff can read all progress"
  ON public.partner_video_progress FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE TRIGGER trg_partner_video_progress_updated_at
  BEFORE UPDATE ON public.partner_video_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();