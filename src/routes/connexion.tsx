import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import { getMyPartner } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion partenaire — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" && s.next.startsWith("/") && !s.next.startsWith("//")
      ? s.next
      : undefined,
  }),
  component: ConnexionPage,
});

function ConnexionPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const meFn = useServerFn(getMyPartner);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (next) {
        window.location.href = next;
        return;
      }
      meFn().then((me) => {
        if (me.mustChangePassword) {
          navigate({ to: "/changer-mot-de-passe", replace: true });
        } else if (me.roles.includes("admin") || me.roles.includes("agent")) {
          navigate({ to: "/admin", replace: true });
        } else {
          navigate({ to: "/marketplace", replace: true });
        }
      });
    }
  }, [user, loading, navigate, meFn]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Connexion réussie");
    if (next) {
      window.location.href = next;
      return;
    }
    try {
      const me = await meFn();
      if (me.mustChangePassword) {
        navigate({ to: "/changer-mot-de-passe", replace: true });
      } else if (me.roles.includes("admin") || me.roles.includes("agent")) {
        navigate({ to: "/admin", replace: true });
      } else {
        navigate({ to: "/marketplace", replace: true });
      }
    } catch {
      navigate({ to: "/marketplace", replace: true });
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Connexion</h1>
      <p className="text-muted-foreground mb-8">Accédez à votre espace partenaire.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-2 text-right">
            <Link
              to="/mot-de-passe-oublie"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Pas encore partenaire ?{" "}
        <Link to="/inscription-partenaire" className="text-primary font-semibold underline">
          Créer un compte cabinet
        </Link>
      </p>
    </section>
  );
}