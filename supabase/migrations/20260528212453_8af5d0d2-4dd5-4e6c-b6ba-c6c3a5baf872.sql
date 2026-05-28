-- Table membres d'équipe rattachés à un cabinet partenaire
CREATE TABLE public.partner_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id uuid NOT NULL,
  user_id uuid NOT NULL,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  invited_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (partner_id, user_id)
);

CREATE INDEX idx_partner_members_partner ON public.partner_members(partner_id);
CREATE INDEX idx_partner_members_user ON public.partner_members(user_id);

GRANT SELECT ON public.partner_members TO authenticated;
GRANT ALL ON public.partner_members TO service_role;

ALTER TABLE public.partner_members ENABLE ROW LEVEL SECURITY;

-- Fonction utilitaire : ce user est-il membre (owner ou team) de ce partner ?
CREATE OR REPLACE FUNCTION public.is_partner_team(_user_id uuid, _partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = _partner_id AND p.profile_id = _user_id AND p.deleted_at IS NULL
  ) OR EXISTS (
    SELECT 1 FROM public.partner_members m
    WHERE m.partner_id = _partner_id AND m.user_id = _user_id
  );
$$;

-- Fonction utilitaire : retourne le partner_id auquel ce user a accès (owner ou team)
CREATE OR REPLACE FUNCTION public.partner_id_for_user(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id FROM public.partners p
  WHERE p.profile_id = _user_id AND p.deleted_at IS NULL
  UNION ALL
  SELECT m.partner_id FROM public.partner_members m
  WHERE m.user_id = _user_id
  LIMIT 1;
$$;

CREATE POLICY "Members: team read"
ON public.partner_members
FOR SELECT
TO authenticated
USING (
  public.is_partner_team(auth.uid(), partner_id)
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'agent'::app_role)
);

CREATE TRIGGER trg_partner_members_updated_at
BEFORE UPDATE ON public.partner_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Élargir les policies partners pour les membres d'équipe
DROP POLICY IF EXISTS "Partners: self read" ON public.partners;
CREATE POLICY "Partners: self read"
ON public.partners
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'agent'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.partner_members m
    WHERE m.partner_id = partners.id AND m.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Partners: self update limited" ON public.partners;
CREATE POLICY "Partners: self update limited"
ON public.partners
FOR UPDATE
TO authenticated
USING (
  profile_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'agent'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.partner_members m
    WHERE m.partner_id = partners.id AND m.user_id = auth.uid()
  )
);

-- Permettre aux membres de voir les transactions de crédits / unlocks du cabinet
DROP POLICY IF EXISTS "Credits: partner own read" ON public.credit_transactions;
CREATE POLICY "Credits: partner own read"
ON public.credit_transactions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = credit_transactions.partner_id
      AND (
        p.profile_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.partner_members m
          WHERE m.partner_id = p.id AND m.user_id = auth.uid()
        )
      )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'agent'::app_role)
);

DROP POLICY IF EXISTS "Unlocks: partner own read" ON public.lead_unlocks;
CREATE POLICY "Unlocks: partner own read"
ON public.lead_unlocks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = lead_unlocks.partner_id
      AND (
        p.profile_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.partner_members m
          WHERE m.partner_id = p.id AND m.user_id = auth.uid()
        )
      )
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'agent'::app_role)
);