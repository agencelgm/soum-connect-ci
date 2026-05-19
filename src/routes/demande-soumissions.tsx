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
import { buildPageHead } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";

const META_TITLE =
  "Demande de Soumissions | Cabinets Comptables CI | SoumissionsComptables.ci";
const META_DESC =
  "Recevez jusqu'à 5 soumissions gratuites de cabinets comptables agréés en Côte d'Ivoire. Formulaire simple, réponse en 48h. Création d'entreprise, comptabilité, déclaration fiscale.";

export const Route = createFileRoute("/demande-soumissions")({
  head: () =>
    buildPageHead({
      path: "/demande-soumissions",
      title: META_TITLE,
      description: META_DESC,
      altPath: "/en/get-quotes",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Demande de soumissions", path: "/demande-soumissions" },
      ],
    }),
  component: Page,
});

const SERVICES_FR = [
  "🏢 Création d'entreprise (SARL, SA, EI via CEPICI)",
  "📊 Comptabilité générale (tenue de comptes)",
  "🧾 Déclaration fiscale (impôts, DGI)",
  "📍 Domiciliation d'entreprise à Abidjan",
  "🔍 Audit comptable",
  "⚖ Conseil juridique",
  "📦 Plusieurs services",
];
const SERVICES_EN = [
  "🏢 Company registration (SARL, SA, sole proprietorship via CEPICI)",
  "📊 General accounting (bookkeeping)",
  "🧾 Tax filing (taxes, DGI)",
  "📍 Business domiciliation in Abidjan",
  "🔍 Accounting audit",
  "⚖ Legal advisory",
  "📦 Several services",
];
const STATUTS_FR = [
  "J'ai déjà une entreprise",
  "Je veux créer mon entreprise",
  "Je suis en réflexion",
];
const STATUTS_EN = [
  "I already have a company",
  "I want to register a company",
  "I'm still exploring",
];
const LOCALISATIONS_FR = [
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
const LOCALISATIONS_EN = [
  "Abidjan — Plateau",
  "Abidjan — Cocody",
  "Abidjan — Yopougon",
  "Abidjan — Marcory",
  "Abidjan — Treichville",
  "Abidjan — Deux Plateaux",
  "Abidjan — Adjamé",
  "Other city in Côte d'Ivoire",
  "France (diaspora)",
  "Canada (diaspora)",
  "USA (diaspora)",
  "Other country",
];
const DELAIS_FR = [
  "Dès que possible (< 1 mois)",
  "Dans 1 à 3 mois",
  "Dans 3 à 6 mois",
  "Je suis en exploration",
];
const DELAIS_EN = [
  "As soon as possible (< 1 month)",
  "Within 1 to 3 months",
  "Within 3 to 6 months",
  "I'm exploring",
];
const BUDGETS_FR = [
  "Moins de 50 000 FCFA / mois",
  "50 000 — 150 000 FCFA / mois",
  "150 000 — 500 000 FCFA / mois",
  "Plus de 500 000 FCFA / mois",
  "Je ne sais pas encore",
];
const BUDGETS_EN = [
  "Less than 50,000 FCFA / month",
  "50,000 — 150,000 FCFA / month",
  "150,000 — 500,000 FCFA / month",
  "More than 500,000 FCFA / month",
  "I'm not sure yet",
];

const COPY = {
  fr: {
    h1: "Recevez jusqu'à 5 Soumissions de Cabinets Comptables Agréés",
    sub: "Gratuit · Sans engagement · Réponse en 48h",
    stepOf: (n: number) => `Étape ${n} sur 3`,
    s1Title: "Étape 1 sur 3 — Décrivez votre besoin",
    s2Title: "Étape 2 sur 3 — Votre localisation",
    s3Title: "Étape 3 sur 3 — Vos coordonnées",
    s3Note: "Ces informations sont transmises uniquement aux cabinets sélectionnés.",
    lService: "Quel service recherchez-vous ?",
    lStatut: "Quel est votre statut actuel ?",
    lDescription: "Décrivez brièvement votre besoin",
    descPh: "Ex: Je veux créer une SARL à Abidjan avec 2 associés. Capital de 1 000 000 FCFA...",
    lLoc: "Où êtes-vous situé ?",
    lDelai: "Dans quel délai souhaitez-vous démarrer ?",
    lBudget: "Quel est votre budget mensuel estimé ?",
    lNom: "Votre nom complet",
    lWhats: "Numéro WhatsApp",
    whatsPh: "+225 XX XX XX XX",
    lEmail: "Adresse email",
    lEnt: "Nom de votre entreprise",
    entPh: "Si déjà créée",
    consent: "J'accepte de recevoir les soumissions par email et WhatsApp",
    back: "← Retour",
    next: "Suivant →",
    submit: "Envoyer ma demande →",
    sending: "Envoi…",
    secNote: "🔒 Vos données sont confidentielles et ne seront jamais vendues.",
    okTitle: "✅ Votre demande a été envoyée !",
    okText: "Vous recevrez vos premières soumissions dans les 48 heures sur votre WhatsApp et votre email.",
    okNextTitle: "Ce qui se passe ensuite :",
    okStep1: "Nos cabinets partenaires examinent votre demande",
    okStep2: "Ils vous préparent une soumission personnalisée",
    okStep3: "Vous comparez et choisissez librement",
    backHome: "Retour à l'accueil",
    moreServices: "En savoir plus sur nos services",
    asideTitle: "Pourquoi nous faire confiance",
    asideSat: "4.8/5 satisfaction",
    asideData: "Données sécurisées",
    asideAccred: "Cabinets agréés OECCA-CI",
    asideWaLabel: "WhatsApp : +225 07 67 00 96 29",
    quote: "« J'ai reçu 4 soumissions en 24h. J'ai économisé 40 % par rapport à mon ancien cabinet. »",
    quoteAuthor: "— Aya K., Abidjan",
    errService: "Veuillez choisir un service",
    errStatut: "Veuillez choisir votre statut",
    errLoc: "Veuillez choisir votre localisation",
    errDelai: "Veuillez choisir un délai",
    errNom: "Nom requis",
    errWhats: "Numéro WhatsApp invalide",
    errWhatsFmt: "Chiffres, espaces et + uniquement",
    errEmail: "Email invalide",
    errConsent: "Vous devez accepter pour continuer",
  },
  en: {
    h1: "Get up to 5 Quotes from Certified Accounting Firms",
    sub: "Free · No commitment · Reply within 48h",
    stepOf: (n: number) => `Step ${n} of 3`,
    s1Title: "Step 1 of 3 — Describe your need",
    s2Title: "Step 2 of 3 — Your location",
    s3Title: "Step 3 of 3 — Your contact details",
    s3Note: "These details are only shared with the selected firms.",
    lService: "Which service are you looking for?",
    lStatut: "What's your current status?",
    lDescription: "Briefly describe your need",
    descPh: "E.g. I want to register a SARL in Abidjan with 2 partners. Capital of 1,000,000 FCFA...",
    lLoc: "Where are you based?",
    lDelai: "When do you want to start?",
    lBudget: "What's your estimated monthly budget?",
    lNom: "Your full name",
    lWhats: "WhatsApp number",
    whatsPh: "+225 XX XX XX XX",
    lEmail: "Email address",
    lEnt: "Your company name",
    entPh: "If already registered",
    consent: "I agree to receive quotes by email and WhatsApp",
    back: "← Back",
    next: "Next →",
    submit: "Send my request →",
    sending: "Sending…",
    secNote: "🔒 Your data is confidential and will never be sold.",
    okTitle: "✅ Your request has been sent!",
    okText: "You'll receive your first quotes within 48 hours on your WhatsApp and email.",
    okNextTitle: "What happens next:",
    okStep1: "Our partner firms review your request",
    okStep2: "They prepare a personalised quote for you",
    okStep3: "You compare and choose freely",
    backHome: "Back to home",
    moreServices: "Learn more about our services",
    asideTitle: "Why trust us",
    asideSat: "4.8/5 satisfaction",
    asideData: "Secure data",
    asideAccred: "OECCA-CI certified firms",
    asideWaLabel: "WhatsApp: +225 07 67 00 96 29",
    quote: "\"I received 4 quotes within 24h. I saved 40% compared to my previous firm.\"",
    quoteAuthor: "— Aya K., Abidjan",
    errService: "Please choose a service",
    errStatut: "Please choose your status",
    errLoc: "Please choose your location",
    errDelai: "Please choose a timeframe",
    errNom: "Name required",
    errWhats: "Invalid WhatsApp number",
    errWhatsFmt: "Digits, spaces and + only",
    errEmail: "Invalid email",
    errConsent: "You must accept to continue",
  },
} as const;

function makeSchema(c: (typeof COPY)["fr"]) {
  return z.object({
    service: z.string().min(1, c.errService),
    statut: z.string().min(1, c.errStatut),
    description: z.string().max(1000).optional().or(z.literal("")),
    localisation: z.string().min(1, c.errLoc),
    delai: z.string().min(1, c.errDelai),
    budget: z.string().optional().or(z.literal("")),
    nom: z.string().trim().min(2, c.errNom).max(100),
    whatsapp: z.string().trim().min(8, c.errWhats).max(25).regex(/^[+0-9 ]+$/, c.errWhatsFmt),
    email: z.string().trim().email(c.errEmail).max(255),
    entreprise: z.string().max(120).optional().or(z.literal("")),
    consent: z.literal(true, { errorMap: () => ({ message: c.errConsent }) }),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const STEP_FIELDS: Record<1 | 2 | 3, (keyof FormValues)[]> = {
  1: ["service", "statut", "description"],
  2: ["localisation", "delai", "budget"],
  3: ["nom", "whatsapp", "email", "entreprise", "consent"],
};

function Page() {
  const { language } = useLanguage();
  const c = COPY[language];
  const SERVICES = language === "en" ? SERVICES_EN : SERVICES_FR;
  const STATUTS = language === "en" ? STATUTS_EN : STATUTS_FR;
  const LOCALISATIONS = language === "en" ? LOCALISATIONS_EN : LOCALISATIONS_FR;
  const DELAIS = language === "en" ? DELAIS_EN : DELAIS_FR;
  const BUDGETS = language === "en" ? BUDGETS_EN : BUDGETS_FR;
  const homeHref = language === "en" ? "/en" : "/";
  const allServicesHref = getCounterpart("/cabinet-comptable-abidjan", language);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(makeSchema(c)),
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
          {c.h1}
        </h1>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">
          {c.sub}
        </p>
      </section>

      <section className="container-app pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="mx-auto w-full max-w-[640px]">
            <div className="rounded-2xl bg-white shadow-lg border border-border p-6 md:p-8">
              {step < 4 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
                    <span>{c.stepOf(step)}</span>
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
                      {c.s1Title}
                    </h2>

                    <Field
                      id="service"
                      label={c.lService}
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
                      label={c.lStatut}
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
                      label={c.lDescription}
                      error={errors.description?.message}
                    >
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder={c.descPh}
                        {...register("description")}
                      />
                    </Field>

                    <div className="flex justify-end pt-2">
                      <Button
                        type="button"
                        onClick={next}
                        className="bg-secondary hover:bg-secondary-dark text-white"
                      >
                        {c.next}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div key="s2" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      {c.s2Title}
                    </h2>

                    <Field
                      id="localisation"
                      label={c.lLoc}
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
                      label={c.lDelai}
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
                      label={c.lBudget}
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
                        {c.back}
                      </Button>
                      <Button
                        type="button"
                        onClick={next}
                        className="bg-secondary hover:bg-secondary-dark text-white"
                      >
                        {c.next}
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div key="s3" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      {c.s3Title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {c.s3Note}
                    </p>

                    <Field
                      id="nom"
                      label={c.lNom}
                      required
                      error={errors.nom?.message}
                    >
                      <Input id="nom" autoComplete="name" {...register("nom")} />
                    </Field>

                    <Field
                      id="whatsapp"
                      label={c.lWhats}
                      required
                      error={errors.whatsapp?.message}
                    >
                      <Input
                        id="whatsapp"
                        type="tel"
                        placeholder={c.whatsPh}
                        autoComplete="tel"
                        {...register("whatsapp")}
                      />
                    </Field>

                    <Field
                      id="email"
                      label={c.lEmail}
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
                      label={c.lEnt}
                      error={errors.entreprise?.message}
                    >
                      <Input
                        id="entreprise"
                        placeholder={c.entPh}
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
                        {c.consent}
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
                          {c.back}
                        </Button>
                        <Button
                          type="submit"
                          disabled={formState.isSubmitting}
                          className="flex-1 h-12 text-base bg-secondary hover:bg-secondary-dark text-white"
                        >
                          {formState.isSubmitting ? c.sending : c.submit}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {c.secNote}
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
                      {c.okTitle}
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                      {c.okText}
                    </p>

                    <div className="mt-6 rounded-xl bg-[#F8FAFC] border border-border p-5 text-left">
                      <p className="font-semibold text-primary mb-3">{c.okNextTitle}</p>
                      <ol className="space-y-2 text-sm text-foreground list-decimal list-inside">
                        <li>{c.okStep1}</li>
                        <li>{c.okStep2}</li>
                        <li>{c.okStep3}</li>
                      </ol>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild variant="outline">
                        <Link to={homeHref}>{c.backHome}</Link>
                      </Button>
                      <Button asChild className="bg-secondary hover:bg-secondary-dark text-white">
                        <Link to={allServicesHref}>{c.moreServices}</Link>
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
                {c.asideTitle}
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" /> {c.asideSat}
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> {c.asideData}
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-accent" /> {c.asideAccred}
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#25D366]" />
                  <a
                    href="https://wa.me/2250767009629"
                    className="hover:text-secondary"
                  >
                    {c.asideWaLabel}
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-primary text-white p-5 shadow-sm">
              <p className="italic text-sm leading-relaxed">
                {c.quote}
              </p>
              <p className="mt-3 text-xs text-white/80">{c.quoteAuthor}</p>
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
