import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const redirectTo = `${window.location.origin}/reinitialiser-mot-de-passe`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    setSubmitting(false);
    if (error) {
      // On affiche quand même le message neutre pour ne pas révéler si l'email existe.
      console.error("[forgot-password]", error);
    }
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Mot de passe oublié</h1>
      <p className="text-muted-foreground mb-8">
        Entrez votre email. Si un compte existe, nous vous enverrons un lien pour
        définir un nouveau mot de passe.
      </p>

      {sent ? (
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 space-y-3">
          <p className="font-semibold">Email envoyé (si le compte existe)</p>
          <p className="text-sm text-muted-foreground">
            Vérifiez votre boîte de réception ainsi que vos spams. Le lien est valable
            une heure.
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/connexion">Retour à la connexion</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Envoi…" : "Envoyer le lien"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            <Link to="/connexion" className="text-primary font-semibold underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      )}
    </section>
  );
}
