import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getMyPartner, markPasswordChanged } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reinitialiser-mot-de-passe")({
  head: () => ({
    meta: [
      { title: "Réinitialiser mot de passe — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const meFn = useServerFn(getMyPartner);
  const markFn = useServerFn(markPasswordChanged);
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase pose une session temporaire dès que la page se charge suite
    // au clic sur le lien de récupération (event PASSWORD_RECOVERY).
    let cancelled = false;
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(!!session);
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.length < 10) {
      toast.error("Mot de passe : 10 caractères minimum.");
      return;
    }
    if (pwd !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      setSubmitting(false);
      toast.error(error.message);
      return;
    }
    // On retire le flag "must_change_password" si présent, puis on route.
    try {
      await markFn();
    } catch {
      // best-effort
    }
    setSubmitting(false);
    toast.success("Mot de passe mis à jour");
    try {
      const me = await meFn();
      if (me.roles.includes("admin") || me.roles.includes("agent")) {
        navigate({ to: "/admin", replace: true });
      } else {
        navigate({ to: "/marketplace", replace: true });
      }
    } catch {
      navigate({ to: "/connexion", replace: true });
    }
  }

  if (!ready) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center text-muted-foreground">
        Chargement…
      </section>
    );
  }

  if (!hasSession) {
    return (
      <section className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-bold mb-2">Lien invalide ou expiré</h1>
        <p className="text-muted-foreground mb-6">
          Ce lien de réinitialisation n'est plus valide. Les liens expirent au bout
          d'une heure.
        </p>
        <Button asChild>
          <Link to="/mot-de-passe-oublie">Demander un nouveau lien</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Nouveau mot de passe</h1>
      <p className="text-muted-foreground mb-8">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pwd">Nouveau mot de passe</Label>
          <Input
            id="pwd"
            type="password"
            required
            minLength={10}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground mt-1">10 caractères minimum.</p>
        </div>
        <div>
          <Label htmlFor="confirm">Confirmer le mot de passe</Label>
          <Input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}
        </Button>
      </form>
    </section>
  );
}
