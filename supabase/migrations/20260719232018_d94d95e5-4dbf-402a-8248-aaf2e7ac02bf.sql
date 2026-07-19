
ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS docs_reminder_last_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS academy_drip_index int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS academy_drip_last_sent_at timestamptz;
