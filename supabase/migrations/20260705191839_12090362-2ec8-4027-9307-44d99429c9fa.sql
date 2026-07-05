ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS tutorial_watched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tutorial_max_progress REAL NOT NULL DEFAULT 0;