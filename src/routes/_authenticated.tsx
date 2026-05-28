import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyPartner } from "@/lib/partners.functions";
import { useEffect } from "react";
import { isUnauthorizedError, signOutAndClear } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";

export const Route = createFileRoute("/_authenticated")({
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 overflow-x-hidden">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-8 pb-4 border-b">
        <div className="text-sm text-muted-foreground truncate max-w-full">{user.email}</div>
        <div className="flex items-center gap-2 flex-wrap">
          {isStaff && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin">Admin</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/marketplace">Marketplace</Link>
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={signOut}>Déconnexion</Button>
        </div>
      </div>
      {unauthorized ? <UnauthorizedScreen /> : <Outlet />}
    </div>
  );
}