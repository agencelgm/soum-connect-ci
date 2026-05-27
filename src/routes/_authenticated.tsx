import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyPartner } from "@/lib/partners.functions";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const meFn = useServerFn(getMyPartner);
  const { data: me } = useQuery({
    queryKey: ["my-partner"],
    queryFn: () => meFn(),
    enabled: !!user,
  });

  useEffect(() => {
    if (me?.mustChangePassword) {
      navigate({ to: "/changer-mot-de-passe", replace: true });
    }
  }, [me?.mustChangePassword, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center text-muted-foreground">
        Chargement…
      </div>
    );
  }
  if (!user) {
    // Soft redirect (no SSR session)
    if (typeof window !== "undefined") {
      navigate({ to: "/connexion", replace: true });
    }
    return null;
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/connexion", replace: true });
  }

  const isStaff = (me?.roles ?? []).some((r) => r === "admin" || r === "agent");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex justify-between items-center mb-8 pb-4 border-b">
        <div className="text-sm text-muted-foreground">{user.email}</div>
        <div className="flex items-center gap-2">
          {isStaff && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin">Admin</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/espace-partenaire">Mon espace</Link>
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={signOut}>
            Déconnexion
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
