ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS wants_website boolean,
  ADD COLUMN IF NOT EXISTS wants_logo boolean;