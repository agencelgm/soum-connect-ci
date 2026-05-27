import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { signupPartner } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/inscription-partenaire")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InscriptionPage,
});

function InscriptionPage() {
  const navigate = useNavigate();
  const signup = useServerFn(signupPartner);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    cabinet_name: "",
    contact_first_name: "",
    contact_last_name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    website: "",
    facebook_url: "",
    services: "",
    zones: "",
  });

  function up<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1) Create auth user
      const { error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin + "/espace-partenaire",
          data: { full_name: `${form.contact_first_name} ${form.contact_last_name}` },
        },
      });
      if (authErr) throw new Error(authErr.message);

      // 2) Ensure signed in (in case email confirm off)
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const { error: signinErr } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signinErr) throw new Error("Compte créé. Vérifiez votre email puis connectez-vous.");
      }

      // 3) Create partner row
      await signup({
        data: {
          cabinet_name: form.cabinet_name,
          contact_first_name: form.contact_first_name,
          contact_last_name: form.contact_last_name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          website: form.website,
          facebook_url: form.facebook_url,
          services: form.services
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          zones: form.zones
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });

      toast.success("Compte créé. Notre équipe vous contacte sous 24-48h.");
      navigate({ to: "/espace-partenaire", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Devenir cabinet partenaire</h1>
      <p className="text-muted-foreground mb-8">
        Recevez des demandes qualifiées d'entrepreneurs en Côte d'Ivoire. Inscription gratuite.
        Notre équipe valide votre compte sous 24-48h ouvrables.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Nom du cabinet *</Label>
          <Input
            required
            value={form.cabinet_name}
            onChange={(e) => up("cabinet_name", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prénom contact *</Label>
            <Input
              required
              value={form.contact_first_name}
              onChange={(e) => up("contact_first_name", e.target.value)}
            />
          </div>
          <div>
            <Label>Nom contact *</Label>
            <Input
              required
              value={form.contact_last_name}
              onChange={(e) => up("contact_last_name", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => up("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Téléphone *</Label>
            <Input required value={form.phone} onChange={(e) => up("phone", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Mot de passe * (8 caractères minimum)</Label>
          <Input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => up("password", e.target.value)}
          />
        </div>
        <div>
          <Label>Ville *</Label>
          <Input required value={form.city} onChange={(e) => up("city", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Site web</Label>
            <Input
              value={form.website}
              onChange={(e) => up("website", e.target.value)}
              placeholder="https://"
            />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input value={form.facebook_url} onChange={(e) => up("facebook_url", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Services (séparés par virgules)</Label>
          <Textarea
            value={form.services}
            onChange={(e) => up("services", e.target.value)}
            placeholder="création d'entreprise, comptabilité, fiscalité"
          />
        </div>
        <div>
          <Label>Zones d'intervention (séparées par virgules)</Label>
          <Textarea
            value={form.zones}
            onChange={(e) => up("zones", e.target.value)}
            placeholder="Abidjan, Yamoussoukro, Bouaké"
          />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Création…" : "Créer mon compte cabinet"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground">
        Déjà partenaire ?{" "}
        <Link to="/connexion" className="text-primary font-semibold underline">
          Se connecter
        </Link>
      </p>
    </section>
  );
}
