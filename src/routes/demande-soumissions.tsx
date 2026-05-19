import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Shield, Star, Phone, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const META_TITLE =
  "Demande de Soumissions | Cabinets Comptables CI | SoumissionsComptables.ci";
const META_DESC =
  "Recevez jusqu'à 5 soumissions gratuites de cabinets comptables agréés en Côte d'Ivoire. Formulaire simple, réponse en 48h. Création d'entreprise, comptabilité, déclaration fiscale.";

export const Route = createFileRoute("/demande-soumissions")({
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESC },
      { property: "og:title", content: META_TITLE },
      { property: "og:description", content: META_DESC },
      { property: "og:url", content: "/demande-soumissions" },
    ],
    links: [{ rel: "canonical", href: "/demande-soumissions" }],
  }),
  component: Page,
});

const SERVICES = [
  "🏢 Création d'entreprise (SARL, SA, EI via CEPICI)",
  "📊 Comptabilité générale (tenue de comptes)",
  "🧾 Déclaration fiscale (impôts, DGI)",
  "📍 Domiciliation d'entreprise à Abidjan",
  "🔍 Audit comptable",
  "⚖ Conseil juridique",
  "📦 Plusieurs services",
];
const STATUTS = [
  "J'ai déjà une entreprise",
  "Je veux créer mon entreprise",
  "Je suis en réflexion",
];
const LOCALISATIONS = [
  "Abidjan — Plateau",
  "Abidjan — Cocody",
  "Abidjan — Yopougon",
  "Abidjan — Marcory",
  "Abidjan — Treichville",
  "Abidjan — Deux Plateaux",
  "Abidjan — Adjamé",
  "Autre ville de Côte d'Ivoire",
  "France (diaspora)",
  "Canada (diaspora)",
  "USA (diaspora)",
  "Autre pays",
];
const DELAIS = [
  "Dès que possible (< 1 mois)",
  "Dans 1 à 3 mois",
  "Dans 3 à 6 mois",
  "Je suis en exploration",
];
const BUDGETS = [
  "Moins de 50 000 FCFA / mois",
  "50 000 — 150 000 FCFA / mois",
  "150 000 — 500 000 FCFA / mois",
  "Plus de 500 000 FCFA / mois",
  "Je ne sais pas encore",
];

const schema = z.object({
  service: z.string().min(1, "Veuillez choisir un service"),
  statut: z.string().min(1, "Veuillez choisir votre statut"),
  description: z.string().max(1000).optional().or(z.literal("")),
  localisation: z.string().min(1, "Veuillez choisir votre localisation"),
  delai: z.string().min(1, "Veuillez choisir un délai"),
  budget: z.string().optional().or(z.literal("")),
  nom: z.string().trim().min(2, "Nom requis").max(100),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Numéro WhatsApp invalide")
    .max(25)
    .regex(/^[+0-9 ]+$/, "Chiffres, espaces et + uniquement"),
  email: z.string().trim().email("Email invalide").max(255),
  entreprise: z.string().max(120).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter pour continuer" }),
  }),
});

type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: Record<1 | 2 | 3, (keyof FormValues)[]> = {
  1: ["service", "statut", "description"],
  2: ["localisation", "delai", "budget"],
  3: ["nom", "whatsapp", "email", "entreprise", "consent"],
};

function Page() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      service: "",
      statut: "",
      description: "",
      localisation: "",
      delai: "",
      budget: "",
      nom: "",
      whatsapp: "",
      email: "",
      entreprise: "",
      consent: false as unknown as true,
    },
  });

  const { register, handleSubmit, trigger, formState, setValue, watch } = form;
  const errors: FieldErrors<FormValues> = formState.errors;

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step as 1 | 2]);
    if (ok) setStep((s) => ((s < 3 ? s + 1 : s) as 1 | 2 | 3 | 4));
  };

  const onSubmit = async (_values: FormValues) => {
    // TODO: brancher l'envoi backend (Lovable Cloud) ici.
    await new Promise((r) => setTimeout(r, 500));
    setStep(4);
  };

  const progress = step === 4 ? 100 : (step / 3) * 100;

  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <section className="container-app pt-10 md:pt-14 pb-4 text-center">
        <h1 className="font-heading font-bold text-primary text-3xl md:text-4xl leading-tight">
          Recevez jusqu'à 5 Soumissions de Cabinets Comptables Agréés
        </h1>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">
          Gratuit · Sans engagement · Réponse en 48h
        </p>
      </section>

      <section className="container-app pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="mx-auto w-full max-w-[640px]">
            <div className="rounded-2xl bg-white shadow-lg border border-border p-6 md:p-8">
              {step < 4 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                    <span>Étape {step} sur 3</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 1 && (
                  <div key="s1" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      Étape 1 sur 3 — Décrivez votre besoin
                    </h2>

                    <Field
                      id="service"
                      label="Quel service recherchez-vous ?"
                      required
                      error={errors.service?.message}
                    >
                      <select
                        id="service"
                        {...register("service")}
                        className="w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="">— Choisir —</option>
                        {SERVICES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="statut"
                      label="Quel est votre statut actuel ?"
                      required
                      error={errors.statut?.message}
                    >
                      <select
                        id="statut"
                        {...register("statut")}
                        className="w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="">— Choisir —</option>
                        {STATUTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="description"
                      label="Décrivez brièvement votre besoin"
                      error={errors.description?.message}
                    >
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder="Ex: Je veux créer une SARL à Abidjan avec 2 associés. Capital de 1 000 000 FCFA..."
                        {...register("description")}
                      />
                    </Field>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={next}
                        className="bg-secondary hover:bg-secondary-dark text-white"
                      >
                        Suivant →
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div key="s2" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      Étape 2 sur 3 — Votre localisation
                    </h2>

                    <Field
                      id="localisation"
                      label="Où êtes-vous situé ?"
                      required
                      error={errors.localisation?.message}
                    >
                      <select
                        id="localisation"
                        {...register("localisation")}
                        className="w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="">— Choisir —</option>
                        {LOCALISATIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="delai"
                      label="Dans quel délai souhaitez-vous démarrer ?"
                      required
                      error={errors.delai?.message}
                    >
                      <select
                        id="delai"
                        {...register("delai")}
                        className="w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="">— Choisir —</option>
                        {DELAIS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      id="budget"
                      label="Quel est votre budget mensuel estimé ?"
                      error={errors.budget?.message}
                    >
                      <select
                        id="budget"
                        {...register("budget")}
                        className="w-full h-11 rounded-md border border-input bg-white px-3 text-sm"
                      >
                        <option value="">— Choisir —</option>
                        {BUDGETS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <div className="flex justify-between pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        ← Retour
                      </Button>
                      <Button
                        type="button"
                        onClick={next}
                        className="bg-secondary hover:bg-secondary-dark text-white"
                      >
                        Suivant →
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div key="s3" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      Étape 3 sur 3 — Vos coordonnées
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Ces informations sont transmises uniquement aux cabinets sélectionnés.
                    </p>

                    <Field
                      id="nom"
                      label="Votre nom complet"
                      required
                      error={errors.nom?.message}
                    >
                      <Input id="nom" autoComplete="name" {...register("nom")} />
                    </Field>

                    <Field
                      id="whatsapp"
                      label="Numéro WhatsApp"
                      required
                      error={errors.whatsapp?.message}
                    >
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="+225 XX XX XX XX"
                        autoComplete="tel"
                        {...register("whatsapp")}
                      />
                    </Field>

                    <Field
                      id="email"
                      label="Adresse email"
                      required
                      error={errors.email?.message}
                    >
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        {...register("email")}
                      />
                    </Field>

                    <Field
                      id="entreprise"
                      label="Nom de votre entreprise"
                      error={errors.entreprise?.message}
                    >
                      <Input
                        id="entreprise"
                        placeholder="Si déjà créée"
                        {...register("entreprise")}
                      />
                    </Field>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={watch("consent") === true}
                        onCheckedChange={(v) =>
                          setValue("consent", v === true ? true : (false as unknown as true), {
                            shouldValidate: true,
                          })
                        }
                      />
                      <Label htmlFor="consent" className="text-sm font-normal leading-snug">
                        J'accepte de recevoir les soumissions par email et WhatsApp
                      </Label>
                    </div>
                    {errors.consent?.message && (
                      <p className="text-sm text-destructive -mt-3">{errors.consent.message}</p>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                      <div className="flex justify-between gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                        >
                          ← Retour
                        </Button>
                        <Button
                          type="submit"
                          disabled={formState.isSubmitting}
                          className="flex-1 h-12 text-base bg-secondary hover:bg-secondary-dark text-white"
                        >
                          {formState.isSubmitting ? "Envoi…" : "Envoyer ma demande →"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        🔒 Vos données sont confidentielles et ne seront jamais vendues.
                      </p>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div key="s4" className="animate-fade-in text-center py-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10 text-accent" />
                    </div>
                    <h2 className="mt-5 font-heading text-2xl font-bold text-primary">
                      ✅ Votre demande a été envoyée !
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      Vous recevrez vos premières soumissions dans les 48 heures sur votre WhatsApp et votre email.
                    </p>

                    <div className="mt-6 rounded-xl bg-[#F8FAFC] border border-border p-5 text-left">
                      <p className="font-semibold text-primary mb-3">Ce qui se passe ensuite :</p>
                      <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
                        <li>Nos cabinets partenaires examinent votre demande</li>
                        <li>Ils vous préparent une soumission personnalisée</li>
                        <li>Vous comparez et choisissez librement</li>
                      </ol>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild variant="outline">
                        <Link to="/">Retour à l'accueil</Link>
                      </Button>
                      <Button asChild className="bg-secondary hover:bg-secondary-dark text-white">
                        <Link to="/cabinet-comptable-abidjan">En savoir plus sur nos services</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-5 sticky top-24">
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
              <p className="font-heading font-semibold text-primary mb-3">
                Pourquoi nous faire confiance
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" /> 4.8/5 satisfaction
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Données sécurisées
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-accent" /> Cabinets agréés OECCA-CI
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <a
                    href="https://wa.me/2250767009629"
                    className="hover:text-secondary"
                  >
                    WhatsApp : +225 07 67 00 96 29
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-primary text-white p-5 shadow-sm">
              <p className="italic text-sm leading-relaxed">
                « J'ai reçu 4 soumissions en 24h. J'ai économisé 40 % par rapport à mon ancien cabinet. »
              </p>
              <p className="mt-3 text-xs text-white/80">— Aya K., Abidjan</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
