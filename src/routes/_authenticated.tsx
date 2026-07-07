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
import { PendingApprovalBanner } from "@/components/partner/PendingApprovalBanner";
import { PausedBanner } from "@/components/partner/PausedBanner";

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

  // Tutoriel obligatoire : accessible en permanence via le menu et rappelé
  // par un bandeau tant que la vidéo n'a pas été terminée.
  const needsTutorial =
    !isStaff &&
    !!me?.partner &&
    !me?.partner?.tutorial_watched_at;

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
  const isPending = !isStaff && me?.partner?.status === "pending_review";
  const isPaused = !isStaff && me?.partner?.status === "paused";
  // Ne pas afficher le bandeau "en attente" sur la page tutoriel (info déjà présente)
  const showPendingBanner = isPending && pathname !== "/tutoriel-partenaire";
  const showTutorialBanner = needsTutorial && pathname !== "/tutoriel-partenaire";

  return (
    <AppShell
      email={user.email ?? ""}
      creditsBalance={creditsBalance}
      isStaff={isStaff}
      isAdmin={isAdmin}
      showTutorialLink={!isStaff && !!me?.partner}
      onSignOut={signOut}
    >
      <div className="mx-auto max-w-6xl w-full">
        {unauthorized ? (
          <UnauthorizedScreen />
        ) : (
          <>
            {showTutorialBanner && (
              <TutorialReminderBanner />
            )}
            {showPendingBanner && <PendingApprovalBanner cabinetName={me?.partner?.cabinet_name} />}
            {isPaused && (
              <PausedBanner
                cabinetName={me?.partner?.cabinet_name}
                pauseReason={me?.partner?.pause_reason}
              />
            )}
            <Outlet />
          </>
        )}
      </div>
    </AppShell>
  );
}

function TutorialReminderBanner() {
  return (
    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
          <PlayCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-red-900">
            Vidéo tutoriel obligatoire non terminée
          </p>
          <p className="mt-1 text-sm text-red-900/90">
            Sans visionnage complet de la vidéo, votre compte ne sera pas approuvé
            par notre équipe. Vous pouvez reprendre là où vous vous êtes arrêté.
          </p>
          <div className="mt-3">
            <Button asChild className="bg-red-600 text-white hover:bg-red-700">
              <Link to="/tutoriel-partenaire">
                <PlayCircle className="h-4 w-4" />
                Regarder la vidéo maintenant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}