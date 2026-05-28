CREATE POLICY "Chariow payments: partner own read"
ON public.chariow_payments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partners p
    WHERE p.id = chariow_payments.partner_id
      AND (p.profile_id = auth.uid()
           OR EXISTS (
             SELECT 1 FROM public.partner_members m
             WHERE m.partner_id = p.id AND m.user_id = auth.uid()
           ))
  )
);