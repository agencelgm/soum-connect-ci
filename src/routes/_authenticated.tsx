import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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

  const isStaff = (me?.roles ?? []).some((r) => r === "admin" || r === "agent");
  const isAdmin = (me?.roles ?? []).includes("admin");

  // Le staff n'a pas accès aux pages partenaires (marketplace/recharger/historique)
  useEffect(() => {
    if (!isStaff) return;
    if (
      pathname === "/marketplace" ||
      pathname.startsWith("/marketplace/") ||
      pathname === "/recharger" ||
      pathname === "/historique" ||
      pathname.startsWith("/historique/")
    ) {
      navigate({ to: "/admin", replace: true });
    }
  }, [isStaff, pathname, navigate]);

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

  const unauthorized = isUnauthorizedError(meError);
  const creditsBalance = me?.partner?.credits_balance ?? null;

  return (
    <AppShell
      email={user.email ?? ""}
      creditsBalance={creditsBalance}
      isStaff={isStaff}
      isAdmin={isAdmin}
      onSignOut={signOut}
    >
      <div className="mx-auto max-w-6xl w-full">
        {unauthorized ? <UnauthorizedScreen /> : <Outlet />}
      </div>
    </AppShell>
  );
}