import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { markPasswordChanged, getMyPartner } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/changer-mot-de-passe")({
  head: () => ({
    meta: [
      { title: "Changer mot de passe — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const markFn = useServerFn(markPasswordChanged);
  const meFn = useServerFn(getMyPartner);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/connexion", replace: true });
  }, [user, loading, navigate]);

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
    await markFn();
    setSubmitting(false);
    toast.success("Mot de passe mis à jour");
    const me = await meFn();
    if (me.roles.includes("admin") || me.roles.includes("agent")) {
      navigate({ to: "/admin", replace: true });
    } else {
      navigate({ to: "/marketplace", replace: true });
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Nouveau mot de passe</h1>
      <p className="text-muted-foreground mb-8">
        Pour des raisons de sécurité, vous devez définir votre propre mot de passe avant d'accéder à votre espace.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="pwd">Nouveau mot de passe</Label>
          <Input id="pwd" type="password" required minLength={10} value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">10 caractères minimum.</p>
        </div>
        <div>
          <Label htmlFor="confirm">Confirmer le mot de passe</Label>
          <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </form>
    </section>
  );
}