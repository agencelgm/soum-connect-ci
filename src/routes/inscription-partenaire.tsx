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
import { Eye, EyeOff, Check, X } from "lucide-react";
import { trackMetaConversion } from "@/lib/meta-pixel";

export const Route = createFileRoute("/inscription-partenaire")({
  head: () => ({
    meta: [
      { title: "Devenir partenaire — SoumissionsComptables.ci" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: InscriptionPage,
});

function passwordChecks(pw: string): { label: string; ok: boolean }[] {
  return [
    { label: "Au moins 8 caractères", ok: pw.length >= 8 },
    { label: "Une lettre majuscule (A-Z)", ok: /[A-Z]/.test(pw) },
    { label: "Une lettre minuscule (a-z)", ok: /[a-z]/.test(pw) },
    { label: "Un chiffre (0-9)", ok: /[0-9]/.test(pw) },
    { label: "Un caractère spécial (!@#$…)", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
}

function InscriptionPage() {
  const navigate = useNavigate();
  const signup = useServerFn(signupPartner);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
  const [wantsWebsite, setWantsWebsite] = useState<boolean | null>(null);
  const [wantsLogo, setWantsLogo] = useState<boolean | null>(null);

  function up<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const checks = passwordChecks(form.password);
    if (!checks.every((c) => c.ok)) {
      toast.error("Le mot de passe ne respecte pas tous les critères.");
      return;
    }
    setSubmitting(true);
    try {
      // 1) Create auth user
      const { error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin + "/marketplace",
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
          services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
          zones: form.zones.split(",").map((s) => s.trim()).filter(Boolean),
          wants_website: wantsWebsite,
          wants_logo: wantsLogo,
        },
      });

      toast.success("Compte créé et activé. Bienvenue !");
      trackMetaConversion(
        "CompleteRegistration",
        {
          content_category: "inscription_terminee",
          content_name: form.cabinet_name,
          city: form.city,
        },
        {
          em: form.email,
          ph: form.phone,
          fn: form.contact_first_name,
          ln: form.contact_last_name,
          ct: form.city,
        },
      );
      navigate({ to: "/marketplace", replace: true });
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
        Recevez des demandes qualifiées d'entrepreneurs en Côte d'Ivoire. Inscription gratuite
        et activation immédiate de votre compte.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label>Nom du cabinet *</Label>
          <Input required value={form.cabinet_name} onChange={(e) => up("cabinet_name", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Prénom contact *</Label>
            <Input required value={form.contact_first_name} onChange={(e) => up("contact_first_name", e.target.value)} />
          </div>
          <div>
            <Label>Nom contact *</Label>
            <Input required value={form.contact_last_name} onChange={(e) => up("contact_last_name", e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email *</Label>
            <Input type="email" required value={form.email} onChange={(e) => up("email", e.target.value)} />
          </div>
          <div>
            <Label>Téléphone *</Label>
            <Input required value={form.phone} onChange={(e) => up("phone", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Mot de passe *</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={form.password}
              onChange={(e) => up("password", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {passwordChecks(form.password).map((c) => (
              <li
                key={c.label}
                className={c.ok ? "text-green-600 flex items-center gap-1.5" : "text-muted-foreground flex items-center gap-1.5"}
              >
                {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {c.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Label>Ville *</Label>
          <Input required value={form.city} onChange={(e) => up("city", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Site web</Label>
            <Input value={form.website} onChange={(e) => up("website", e.target.value)} placeholder="https://" />
          </div>
          <div>
            <Label>Facebook</Label>
            <Input value={form.facebook_url} onChange={(e) => up("facebook_url", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Services (séparés par virgules)</Label>
          <Textarea value={form.services} onChange={(e) => up("services", e.target.value)} placeholder="création d'entreprise, comptabilité, fiscalité" />
        </div>
        <div>
          <Label>Zones d'intervention (séparées par virgules)</Label>
          <Textarea value={form.zones} onChange={(e) => up("zones", e.target.value)} placeholder="Abidjan, Yamoussoukro, Bouaké" />
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
          <p className="text-sm font-semibold">
            Pour aller plus loin, on peut vous aider avec :
          </p>
          <UpsellQuestion
            label="Voulez-vous un site internet pour votre cabinet ?"
            hint="À partir de 165 000 FCFA"
            value={wantsWebsite}
            onChange={setWantsWebsite}
            name="wants_website"
          />
          <UpsellQuestion
            label="Voulez-vous un logo professionnel ?"
            hint="À partir de 50 000 FCFA"
            value={wantsLogo}
            onChange={setWantsLogo}
            name="wants_logo"
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

function UpsellQuestion({
  label,
  hint,
  value,
  onChange,
  name,
}: {
  label: string;
  hint: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  name: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground mb-2">{hint}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          aria-pressed={value === true}
          className={
            "px-4 py-2 rounded-md border text-sm font-medium transition " +
            (value === true
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-muted border-border")
          }
        >
          Oui
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          aria-pressed={value === false}
          className={
            "px-4 py-2 rounded-md border text-sm font-medium transition " +
            (value === false
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-muted border-border")
          }
        >
          Non
        </button>
      </div>
      <input type="hidden" name={name} value={value === null ? "" : value ? "1" : "0"} />
    </div>
  );
}