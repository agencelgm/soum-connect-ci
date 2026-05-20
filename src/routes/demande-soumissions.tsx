import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Star, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { buildPageHead } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

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
    stepOf: (n: number) => `Étape ${n} sur 4`,
    s1Title: "Étape 1 sur 4 — Décrivez votre besoin",
    s2Title: "Étape 2 sur 4 — Votre présence commerciale",
    s3Title: "Étape 3 sur 4 — Votre localisation",
    s4Title: "Étape 4 sur 4 — Vos coordonnées",
    s4Note: "Ces informations sont transmises uniquement aux cabinets sélectionnés.",
    lService: "Quel service recherchez-vous ?",
    lStatut: "Quel est votre statut actuel ?",
    lDescription: "Pouvons-nous avoir des détails sur votre projet ?",
    descPh: "Ex: Je veux créer une SARL à Abidjan avec 2 associés. Capital de 1 000 000 FCFA...",
    lAssocies: "Combien d'associés avez-vous ?",
    lBureau: "Avez-vous un bureau ?",
    lLogo: "Avez-vous un logo ?",
    lSite: "Avez-vous un site internet ?",
    lPub: "Faites-vous de la publicité ?",
    yes: "Oui",
    no: "Non",
    lLoc: "Où êtes-vous situé ?",
    lDelai: "Dans quel délai souhaitez-vous démarrer ?",
    lBudget: "Quel est votre budget mensuel estimé ?",
    lNom: "Votre nom complet",
    lWhats: "Numéro de téléphone",
    whatsPh: "+225 XX XX XX XX",
    lEmail: "Adresse email",
    lEnt: "Nom de votre entreprise",
    entPh: "Si déjà créée",
    consent: "J'accepte de recevoir les soumissions par email et SMS",
    back: "← Retour",
    next: "Suivant →",
    submit: "Envoyer ma demande →",
    sending: "Envoi…",
    secNote: "🔒 Vos données sont confidentielles et ne seront jamais vendues.",
    okTitle: "✅ Votre demande a été envoyée !",
    okText: "Vous recevrez vos premières soumissions dans les 48 heures par email et téléphone.",
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
    asideWaLabel: "",
    quote: "« J'ai reçu 4 soumissions en 24h. J'ai économisé 40 % par rapport à mon ancien cabinet. »",
    quoteAuthor: "— Aya K., Abidjan",
    errService: "Veuillez choisir un service",
    errStatut: "Veuillez choisir votre statut",
    errLoc: "Veuillez choisir votre localisation",
    errDelai: "Veuillez choisir un délai",
    errNom: "Nom requis",
    errWhats: "Numéro de téléphone invalide",
    errMobileFmt: "Chiffres, espaces et + uniquement",
    errEmail: "Email invalide",
    errConsent: "Vous devez accepter pour continuer",
    errDescription: "Veuillez décrire brièvement votre besoin",
    errBudget: "Veuillez choisir un budget",
    errEnt: "Nom de votre entreprise requis",
    errAssocies: "Indiquez un nombre entre 1 et 50",
    errBureau: "Veuillez répondre",
    errLogo: "Veuillez répondre",
    errSite: "Veuillez répondre",
    errPub: "Veuillez répondre",
  },
  en: {
    h1: "Get up to 5 Quotes from Certified Accounting Firms",
    sub: "Free · No commitment · Reply within 48h",
    stepOf: (n: number) => `Step ${n} of 4`,
    s1Title: "Step 1 of 4 — Describe your need",
    s2Title: "Step 2 of 4 — Your business presence",
    s3Title: "Step 3 of 4 — Your location",
    s4Title: "Step 4 of 4 — Your contact details",
    s4Note: "These details are only shared with the selected firms.",
    lService: "Which service are you looking for?",
    lStatut: "What's your current status?",
    lDescription: "Can you share details about your project?",
    descPh: "E.g. I want to register a SARL in Abidjan with 2 partners. Capital of 1,000,000 FCFA...",
    lAssocies: "How many business partners do you have?",
    lBureau: "Do you have an office?",
    lLogo: "Do you have a logo?",
    lSite: "Do you have a website?",
    lPub: "Do you run any advertising?",
    yes: "Yes",
    no: "No",
    lLoc: "Where are you based?",
    lDelai: "When do you want to start?",
    lBudget: "What's your estimated monthly budget?",
    lNom: "Your full name",
    lWhats: "Phone number",
    whatsPh: "+225 XX XX XX XX",
    lEmail: "Email address",
    lEnt: "Your company name",
    entPh: "If already registered",
    consent: "I agree to receive quotes by email and SMS",
    back: "← Back",
    next: "Next →",
    submit: "Send my request →",
    sending: "Sending…",
    secNote: "🔒 Your data is confidential and will never be sold.",
    okTitle: "✅ Your request has been sent!",
    okText: "You'll receive your first quotes within 48 hours by email and phone.",
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
    asideWaLabel: "",
    quote: "\"I received 4 quotes within 24h. I saved 40% compared to my previous firm.\"",
    quoteAuthor: "— Aya K., Abidjan",
    errService: "Please choose a service",
    errStatut: "Please choose your status",
    errLoc: "Please choose your location",
    errDelai: "Please choose a timeframe",
    errNom: "Name required",
    errWhats: "Invalid phone number",
    errMobileFmt: "Digits, spaces and + only",
    errEmail: "Invalid email",
    errConsent: "You must accept to continue",
    errDescription: "Please briefly describe your need",
    errBudget: "Please choose a budget",
    errEnt: "Company name required",
    errAssocies: "Enter a number between 1 and 50",
    errBureau: "Please answer",
    errLogo: "Please answer",
    errSite: "Please answer",
    errPub: "Please answer",
  },
} as const;

type Copy = (typeof COPY)["fr"];
function makeSchema(c: Copy) {
  return z.object({
    service: z.string().min(1, c.errService),
    statut: z.string().min(1, c.errStatut),
    description: z.string().trim().min(10, c.errDescription).max(1000),
    nbAssocies: z.coerce.number({ invalid_type_error: c.errAssocies }).int().min(1, c.errAssocies).max(50, c.errAssocies),
    bureau: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errBureau }) }),
    logo: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errLogo }) }),
    siteWeb: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errSite }) }),
    publicite: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errPub }) }),
    localisation: z.string().min(1, c.errLoc),
    delai: z.string().min(1, c.errDelai),
    budget: z.string().min(1, c.errBudget),
    nom: z.string().trim().min(2, c.errNom).max(100),
    mobile: z.string().trim().min(8, c.errWhats).max(25).regex(/^[+0-9 ]+$/, c.errMobileFmt),
    email: z.string().trim().email(c.errEmail).max(255),
    entreprise: z.string().trim().min(2, c.errEnt).max(120),
    consent: z.literal(true, { errorMap: () => ({ message: c.errConsent }) }),
  });
}

type FormValues = z.infer<ReturnType<typeof makeSchema>>;

const STEP_FIELDS: Record<1 | 2 | 3 | 4, (keyof FormValues)[]> = {
  1: ["service", "statut", "description", "nbAssocies", "bureau"],
  2: ["logo", "siteWeb", "publicite"],
  3: ["localisation", "delai", "budget"],
  4: ["nom", "mobile", "email", "entreprise", "consent"],
};

function Page() {
  const { language } = useLanguage();
  const c = COPY[language] as Copy;
  const SERVICES = language === "en" ? SERVICES_EN : SERVICES_FR;
  const STATUTS = language === "en" ? STATUTS_EN : STATUTS_FR;
  const LOCALISATIONS = language === "en" ? LOCALISATIONS_EN : LOCALISATIONS_FR;
  const DELAIS = language === "en" ? DELAIS_EN : DELAIS_FR;
  const BUDGETS = language === "en" ? BUDGETS_EN : BUDGETS_FR;
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(makeSchema(c)),
    mode: "onBlur",
    defaultValues: {
      service: "",
      statut: "",
      description: "",
      nbAssocies: "" as unknown as number,
      bureau: "" as unknown as "oui",
      logo: "" as unknown as "oui",
      siteWeb: "" as unknown as "oui",
      publicite: "" as unknown as "oui",
      localisation: "",
      delai: "",
      budget: "",
      nom: "",
      mobile: "",
      email: "",
      entreprise: "",
      consent: false as unknown as true,
    },
  });

  const { register, handleSubmit, trigger, formState, setValue, watch } = form;
  const errors: FieldErrors<FormValues> = formState.errors;

  const next = async () => {
    const ok = await trigger(STEP_FIELDS[step]);
    if (ok) setStep((s) => ((s < 4 ? s + 1 : s) as 1 | 2 | 3 | 4));
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          source: "demande-soumissions",
          language,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        const json = (await res.json()) as { leadId?: string };
        if (json?.leadId) {
          sessionStorage.setItem("leadId", json.leadId);
        }
      } catch {}
      trackEvent("soumission_envoyee", {
        service: values.service,
        localisation: values.localisation,
        language,
      });
      navigate({ to: language === "en" ? "/en/logo-offer" : "/offre-logo" });
    } catch (err) {
      console.error("Lead submission failed", err);
      toast.error(
        language === "en"
          ? "Submission failed. Please try again or contact us by email."
          : "Échec de l'envoi. Réessayez ou contactez-nous par email.",
      );
    }
  };

  const progress = (step / 4) * 100;

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
                      required
                      error={errors.description?.message}
                    >
                      <Textarea
                        id="description"
                        rows={4}
                        placeholder={c.descPh}
                        {...register("description")}
                      />
                    </Field>

                    <Field
                      id="nbAssocies"
                      label={c.lAssocies}
                      required
                      error={errors.nbAssocies?.message}
                    >
                      <Input
                        id="nbAssocies"
                        type="number"
                        min={1}
                        max={50}
                        inputMode="numeric"
                        {...register("nbAssocies")}
                      />
                    </Field>

                    <Field
                      id="bureau"
                      label={c.lBureau}
                      required
                      error={errors.bureau?.message}
                    >
                      <RadioYesNo name="bureau" register={register} yes={c.yes} no={c.no} />
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
                      id="logo"
                      label={c.lLogo}
                      required
                      error={errors.logo?.message}
                    >
                      <RadioYesNo name="logo" register={register} yes={c.yes} no={c.no} />
                    </Field>

                    <Field
                      id="siteWeb"
                      label={c.lSite}
                      required
                      error={errors.siteWeb?.message}
                    >
                      <RadioYesNo name="siteWeb" register={register} yes={c.yes} no={c.no} />
                    </Field>

                    <Field
                      id="publicite"
                      label={c.lPub}
                      required
                      error={errors.publicite?.message}
                    >
                      <RadioYesNo name="publicite" register={register} yes={c.yes} no={c.no} />
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
                      required
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
                        onClick={() => setStep(2)}
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

                {step === 4 && (
                  <div key="s4" className="animate-fade-in space-y-5">
                    <h2 className="font-heading text-xl font-semibold text-primary">
                      {c.s4Title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {c.s4Note}
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
                      id="mobile"
                      label={c.lWhats}
                      required
                      error={errors.mobile?.message}
                    >
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder={c.whatsPh}
                        autoComplete="tel"
                        {...register("mobile")}
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
                      required
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
                          onClick={() => setStep(3)}
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
    <div data-invalid={error ? "true" : undefined} className="group">
      <Label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div
        className={
          error
            ? "[&_input]:border-destructive [&_input]:ring-1 [&_input]:ring-destructive/40 [&_textarea]:border-destructive [&_textarea]:ring-1 [&_textarea]:ring-destructive/40 [&_select]:border-destructive [&_select]:ring-1 [&_select]:ring-destructive/40"
            : undefined
        }
      >
        {children}
      </div>
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}

function RadioYesNo({
  name,
  register,
  yes,
  no,
}: {
  name: "bureau" | "logo" | "siteWeb" | "publicite";
  register: ReturnType<typeof useForm<FormValues>>["register"];
  yes: string;
  no: string;
}) {
  return (
    <div className="flex gap-3">
      {[
        { v: "oui", label: yes },
        { v: "non", label: no },
      ].map((opt) => (
        <label
          key={opt.v}
          className="flex-1 cursor-pointer rounded-md border border-input bg-white px-3 py-2.5 text-sm flex items-center justify-center gap-2 hover:border-secondary has-[:checked]:border-secondary has-[:checked]:bg-secondary/5 has-[:checked]:text-secondary-dark transition-colors"
        >
          <input
            type="radio"
            value={opt.v}
            className="accent-secondary"
            {...register(name)}
          />
          <span className="font-medium">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
