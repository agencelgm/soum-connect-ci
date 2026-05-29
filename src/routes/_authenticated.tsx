import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPartner } from "@/lib/partners.functions";
import { useEffect } from "react";
import { isUnauthorizedError, signOutAndClear } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_authenticated")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow" }] }),
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const meFn = useServerFn(getMyPartner);
  const { data: me, error: meError } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return meFn();
    },
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (me?.mustChangePassword) {
      navigate({ to: "/changer-mot-de-passe", replace: true });
    }
  }, [me?.mustChangePassword, navigate]);

  if (loading) {
    return <div className="mx-auto max-w-md px-6 py-16 text-center text-muted-foreground">Chargement…</div>;
  }
  if (!user) {
    // Soft redirect (no SSR session)
    if (typeof window !== "undefined") {
      navigate({ to: "/connexion", replace: true });
    }
    return null;
  }

  async function signOut() {
    await signOutAndClear(qc, (to) => navigate({ to, replace: true }));
  }

  const isStaff = (me?.roles ?? []).some((r) => r === "admin" || r === "agent");
  const unauthorized = isUnauthorizedError(meError);
  const creditsBalance = me?.partner?.credits_balance ?? null;

  return (
    <AppShell
      email={user.email ?? ""}
      creditsBalance={creditsBalance}
      isStaff={isStaff}
      onSignOut={signOut}
    >
      <div className="mx-auto max-w-6xl w-full">
        {unauthorized ? <UnauthorizedScreen /> : <Outlet />}
      </div>
    </AppShell>
  );
}