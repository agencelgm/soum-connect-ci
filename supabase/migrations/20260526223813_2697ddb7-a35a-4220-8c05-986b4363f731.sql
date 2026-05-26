
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'partner');
CREATE TYPE public.partner_status AS ENUM ('pending_review', 'approved', 'paused', 'rejected');
CREATE TYPE public.prospect_status AS ENUM ('pending_qualification', 'qualified', 'rejected', 'published');
CREATE TYPE public.audience_type AS ENUM ('creation', 'gestion', 'unknown');
CREATE TYPE public.credit_tx_type AS ENUM ('signup_bonus', 'manual_creation_bonus', 'admin_grant', 'admin_revoke', 'unlock_spend', 'recharge');

-- ============================================================
-- HELPER: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- USER ROLES (separate table — security best practice)
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer fn to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============================================================
-- PROFILE POLICIES
-- ============================================================
CREATE POLICY "Profiles: own read"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Profiles: own update"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Profiles: self insert"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- USER ROLES POLICIES
-- ============================================================
CREATE POLICY "Roles: own read"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Only admins can write roles (no INSERT/UPDATE/DELETE for non-admins)
CREATE POLICY "Roles: admin write"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- PROSPECTS (form submissions)
-- ============================================================
CREATE TABLE public.prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact info (PII)
  full_name TEXT,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  -- Form data
  statut TEXT,
  service TEXT,
  city TEXT,
  budget TEXT,
  message TEXT,
  legal_form TEXT,
  -- Audience routing
  audience public.audience_type NOT NULL DEFAULT 'unknown',
  audience_hint TEXT,
  -- Source / tracking
  source TEXT,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ,
  form_type TEXT NOT NULL DEFAULT 'lead',
  -- Workflow
  status public.prospect_status NOT NULL DEFAULT 'pending_qualification',
  qualified_at TIMESTAMPTZ,
  qualified_by UUID REFERENCES auth.users(id),
  qualification_notes TEXT,
  -- Raw payload backup
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX prospects_status_idx ON public.prospects(status);
CREATE INDEX prospects_created_at_idx ON public.prospects(created_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.prospects TO authenticated;
GRANT ALL ON public.prospects TO service_role;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Only admin + agent can read/write prospects (PII)
CREATE POLICY "Prospects: staff read"
  ON public.prospects FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

CREATE POLICY "Prospects: staff update"
  ON public.prospects FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

-- ============================================================
-- PARTNERS
-- ============================================================
CREATE TABLE public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Cabinet info
  cabinet_name TEXT NOT NULL,
  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  facebook_url TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  zones TEXT[] NOT NULL DEFAULT '{}',
  -- Status / lifecycle
  status public.partner_status NOT NULL DEFAULT 'pending_review',
  credits_balance INTEGER NOT NULL DEFAULT 0 CHECK (credits_balance >= 0),
  -- Audit
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  paused_at TIMESTAMPTZ,
  paused_by UUID REFERENCES auth.users(id),
  pause_reason TEXT,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX partners_status_idx ON public.partners(status);
CREATE INDEX partners_profile_id_idx ON public.partners(profile_id);

GRANT SELECT, INSERT, UPDATE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Partners: self read"
  ON public.partners FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'agent')
  );

CREATE POLICY "Partners: self update limited"
  ON public.partners FOR UPDATE TO authenticated
  USING (
    profile_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'agent')
  );

-- Self-signup: a logged-in user can create their own partner record
CREATE POLICY "Partners: self insert"
  ON public.partners FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- ============================================================
-- LEAD PUBLICATIONS (sanitized prospect for marketplace, no PII)
-- ============================================================
CREATE TABLE public.lead_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL UNIQUE REFERENCES public.prospects(id) ON DELETE CASCADE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_by UUID NOT NULL REFERENCES auth.users(id),
  -- Public (non-PII) fields
  service TEXT,
  city TEXT,
  audience public.audience_type NOT NULL DEFAULT 'unknown',
  legal_form TEXT,
  budget TEXT,
  summary TEXT,
  -- Marketplace caps
  unlock_count INTEGER NOT NULL DEFAULT 0,
  max_unlocks INTEGER NOT NULL DEFAULT 6,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX lead_publications_active_idx ON public.lead_publications(is_active, published_at DESC);

GRANT SELECT, INSERT, UPDATE ON public.lead_publications TO authenticated;
GRANT ALL ON public.lead_publications TO service_role;
ALTER TABLE public.lead_publications ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER lead_publications_updated_at
  BEFORE UPDATE ON public.lead_publications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Staff manages publications
CREATE POLICY "Publications: staff manage"
  ON public.lead_publications FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'agent'));

-- Approved partners see active publications (read-only, no PII columns anyway)
CREATE POLICY "Publications: approved partners read active"
  ON public.lead_publications FOR SELECT TO authenticated
  USING (
    is_active = true
    AND unlock_count < max_unlocks
    AND EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.profile_id = auth.uid()
        AND p.status = 'approved'
        AND p.deleted_at IS NULL
    )
  );

-- ============================================================
-- LEAD UNLOCKS
-- ============================================================
CREATE TABLE public.lead_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  publication_id UUID NOT NULL REFERENCES public.lead_publications(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  credits_spent INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(publication_id, partner_id)
);

CREATE INDEX lead_unlocks_partner_idx ON public.lead_unlocks(partner_id, unlocked_at DESC);

GRANT SELECT, INSERT ON public.lead_unlocks TO authenticated;
GRANT ALL ON public.lead_unlocks TO service_role;
ALTER TABLE public.lead_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Unlocks: partner own read"
  ON public.lead_unlocks FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.id = lead_unlocks.partner_id AND p.profile_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'agent')
  );

-- ============================================================
-- CREDIT TRANSACTIONS
-- ============================================================
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  tx_type public.credit_tx_type NOT NULL,
  note TEXT,
  reference_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX credit_transactions_partner_idx ON public.credit_transactions(partner_id, created_at DESC);

GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Credits: partner own read"
  ON public.credit_transactions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.partners p
      WHERE p.id = credit_transactions.partner_id AND p.profile_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'agent')
  );
