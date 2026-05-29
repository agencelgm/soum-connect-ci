import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/lib/language-context";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getTrackingFields } from "@/lib/lead-tracking";
import { trackMetaConversion } from "@/lib/meta-pixel";

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
// Tranches budgétaires adaptées au service choisi.
// Basé sur nos guides tarifaires :
// - création : 120k minimum (CEPICI + honoraires de base)
// - comptabilité : 50k/mois minimum (forfait micro/TPE)
// - domiciliation : 30k/mois minimum (adresse simple)
// - audit / conseil : projets ponctuels, fourchettes plus larges
type BudgetConfig = { kind: "monthly" | "project" | "generic"; options: string[] };

function getBudgetConfig(service: string, language: "fr" | "en"): BudgetConfig {
  const s = service.toLowerCase();
  const isFr = language === "fr";
  const dontKnow = isFr ? "Je ne sais pas encore" : "I'm not sure yet";

  // Création d'entreprise — projet ponctuel, min 120 000 FCFA
  if (s.includes("création") || s.includes("registration")) {
    return {
      kind: "project",
      options: isFr
        ? [
            "120 000 — 250 000 FCFA",
            "250 000 — 500 000 FCFA",
            "500 000 — 1 000 000 FCFA",
            "Plus de 1 000 000 FCFA",
            dontKnow,
          ]
        : [
            "120,000 — 250,000 FCFA",
            "250,000 — 500,000 FCFA",
            "500,000 — 1,000,000 FCFA",
            "More than 1,000,000 FCFA",
            dontKnow,
          ],
    };
  }

  // Domiciliation — récurrent, min 30 000 FCFA/mois
  if (s.includes("domiciliation")) {
    return {
      kind: "monthly",
      options: isFr
        ? [
            "30 000 — 50 000 FCFA / mois",
            "50 000 — 100 000 FCFA / mois",
            "100 000 — 200 000 FCFA / mois",
            "Plus de 200 000 FCFA / mois",
            dontKnow,
          ]
        : [
            "30,000 — 50,000 FCFA / month",
            "50,000 — 100,000 FCFA / month",
            "100,000 — 200,000 FCFA / month",
            "More than 200,000 FCFA / month",
            dontKnow,
          ],
    };
  }

  // Audit comptable — projet ponctuel, min 200 000 FCFA
  if (s.includes("audit")) {
    return {
      kind: "project",
      options: isFr
        ? [
            "200 000 — 500 000 FCFA",
            "500 000 — 1 000 000 FCFA",
            "1 000 000 — 3 000 000 FCFA",
            "Plus de 3 000 000 FCFA",
            dontKnow,
          ]
        : [
            "200,000 — 500,000 FCFA",
            "500,000 — 1,000,000 FCFA",
            "1,000,000 — 3,000,000 FCFA",
            "More than 3,000,000 FCFA",
            dontKnow,
          ],
    };
  }

  // Conseil juridique — projet ponctuel, min 50 000 FCFA
  if (s.includes("conseil") || s.includes("legal") || s.includes("juridique")) {
    return {
      kind: "project",
      options: isFr
        ? [
            "50 000 — 150 000 FCFA",
            "150 000 — 500 000 FCFA",
            "500 000 — 1 500 000 FCFA",
            "Plus de 1 500 000 FCFA",
            dontKnow,
          ]
        : [
            "50,000 — 150,000 FCFA",
            "150,000 — 500,000 FCFA",
            "500,000 — 1,500,000 FCFA",
            "More than 1,500,000 FCFA",
            dontKnow,
          ],
    };
  }

  // Comptabilité générale & Déclaration fiscale — récurrent, min 50 000 FCFA/mois
  if (
    s.includes("comptabilité") ||
    s.includes("accounting") ||
    s.includes("bookkeeping") ||
    s.includes("déclaration") ||
    s.includes("fiscale") ||
    s.includes("tax filing") ||
    s.includes("impôts")
  ) {
    return {
      kind: "monthly",
      options: isFr
        ? [
            "50 000 — 100 000 FCFA / mois",
            "100 000 — 250 000 FCFA / mois",
            "250 000 — 500 000 FCFA / mois",
            "Plus de 500 000 FCFA / mois",
            dontKnow,
          ]
        : [
            "50,000 — 100,000 FCFA / month",
            "100,000 — 250,000 FCFA / month",
            "250,000 — 500,000 FCFA / month",
            "More than 500,000 FCFA / month",
            dontKnow,
          ],
    };
  }

  // Plusieurs services / fallback générique
  return {
    kind: "generic",
    options: isFr
      ? [
            "Moins de 150 000 FCFA",
            "150 000 — 500 000 FCFA",
            "500 000 — 1 500 000 FCFA",
            "Plus de 1 500 000 FCFA",
            dontKnow,
        ]
      : [
            "Less than 150,000 FCFA",
            "150,000 — 500,000 FCFA",
            "500,000 — 1,500,000 FCFA",
            "More than 1,500,000 FCFA",
            dontKnow,
        ],
  };
}

const COPY = {
  fr: {
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
    lBudgetMonthly: "Quel est votre budget mensuel estimé ?",
    lBudgetProject: "Quel budget global avez-vous pour ce projet ?",
    lBudgetGeneric: "Quel est votre budget estimé ?",
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
    choose: "— Choisir —",
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
    lBudgetMonthly: "What's your estimated monthly budget?",
    lBudgetProject: "What's your overall budget for this project?",
    lBudgetGeneric: "What's your estimated budget?",
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
    choose: "— Choose —",
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
    nbAssocies: z.coerce
      .number({ invalid_type_error: c.errAssocies })
      .int()
      .min(1, c.errAssocies)
      .max(50, c.errAssocies),
    bureau: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errBureau }) }),
    logo: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errLogo }) }),
    siteWeb: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errSite }) }),
    publicite: z.enum(["oui", "non"], { errorMap: () => ({ message: c.errPub }) }),
    localisation: z.string().min(1, c.errLoc),
    delai: z.string().min(1, c.errDelai),
    budget: z.string().min(1, c.errBudget),
    nom: z.string().trim().min(2, c.errNom).max(100),
    mobile: z
      .string()
      .trim()
      .min(8, c.errWhats)
      .max(25)
      .regex(/^[+0-9 ]+$/, c.errMobileFmt),
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

export interface MultiStepLeadFormProps {
  source?: string;
  variant?: "page" | "card";
  title?: string;
  audienceHint?: "creation" | "gestion" | "both";
}

export function MultiStepLeadForm({
  source = "demande-soumissions",
  variant = "page",
  title,
  audienceHint,
}: MultiStepLeadFormProps) {
  const { language } = useLanguage();
  const c = COPY[language] as Copy;
  const SERVICES = language === "en" ? SERVICES_EN : SERVICES_FR;
  const STATUTS = language === "en" ? STATUTS_EN : STATUTS_FR;
  const LOCALISATIONS = language === "en" ? LOCALISATIONS_EN : LOCALISATIONS_FR;
  const DELAIS = language === "en" ? DELAIS_EN : DELAIS_FR;
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

  const watchedService = watch("service");
  const watchedBudget = watch("budget");
  const budgetCfg = getBudgetConfig(watchedService ?? "", language);
  const budgetLabel =
    budgetCfg.kind === "monthly"
      ? c.lBudgetMonthly
      : budgetCfg.kind === "project"
        ? c.lBudgetProject
        : c.lBudgetGeneric;

  // Si l'utilisateur change de service, on réinitialise le budget si l'ancienne
  // valeur n'est plus proposée par les nouvelles tranches.
  useEffect(() => {
    if (watchedBudget && !budgetCfg.options.includes(watchedBudget)) {
      setValue("budget", "", { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedService]);

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
          source,
          language,
          audience_hint: audienceHint,
          ...getTrackingFields(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        const json = (await res.json()) as { leadId?: string };
        if (json?.leadId) sessionStorage.setItem("leadId", json.leadId);
      } catch {}
      trackMetaConversion(
        "Lead",
        {
          content_category: "quote_request",
          content_name: values.service,
          service: values.service,
          city: values.localisation,
          audience: audienceHint,
          source,
          value: 0,
          currency: "XOF",
        },
        {
          em: values.email,
          ph: values.mobile,
          fn: values.nom,
          ct: values.localisation,
        },
      );
      trackEvent("soumission_envoyee", {
        service: values.service,
        localisation: values.localisation,
        language,
        source,
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
  const isCard = variant === "card";

  const selectClass =
    "w-full h-12 rounded-md border border-input bg-white px-3 text-base text-foreground";

  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-lg border border-border text-foreground",
        isCard ? "p-5 md:p-6" : "p-6 md:p-8",
      )}
    >
      {title && (
        <h2 className="font-heading text-lg md:text-xl font-semibold text-primary mb-4">
          {title}
        </h2>
      )}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          {([1, 2, 3, 4] as const).map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={[
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  s < step ? "bg-accent text-white" :
                  s === step ? "bg-secondary text-white shadow-[var(--shadow-cta)]" :
                  "bg-muted text-muted-foreground"
                ].join(" ")}
              >
                {s < step ? "✓" : s}
              </div>
            </div>
          ))}
        </div>
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-secondary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">{c.stepOf(step)}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {step === 1 && (
          <div key="s1" className="animate-fade-in space-y-5">
            <h3
              className={cn(
                "font-heading font-semibold text-primary",
                isCard ? "text-lg" : "text-xl",
              )}
            >
              {c.s1Title}
            </h3>

            <Field id="service" label={c.lService} required error={errors.service?.message}>
              <select id="service" {...register("service")} className={selectClass}>
                <option value="">{c.choose}</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field id="statut" label={c.lStatut} required error={errors.statut?.message}>
              <select id="statut" {...register("statut")} className={selectClass}>
                <option value="">{c.choose}</option>
                {STATUTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
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
                rows={isCard ? 3 : 4}
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

            <Field id="bureau" label={c.lBureau} required error={errors.bureau?.message}>
              <RadioYesNo name="bureau" register={register} yes={c.yes} no={c.no} />
            </Field>

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={next}
                className="h-12 bg-secondary hover:bg-secondary-dark text-white"
              >
                {c.next}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div key="s2" className="animate-fade-in space-y-5">
            <h3
              className={cn(
                "font-heading font-semibold text-primary",
                isCard ? "text-lg" : "text-xl",
              )}
            >
              {c.s2Title}
            </h3>

            <Field id="logo" label={c.lLogo} required error={errors.logo?.message}>
              <RadioYesNo name="logo" register={register} yes={c.yes} no={c.no} />
            </Field>

            <Field id="siteWeb" label={c.lSite} required error={errors.siteWeb?.message}>
              <RadioYesNo name="siteWeb" register={register} yes={c.yes} no={c.no} />
            </Field>

            <Field id="publicite" label={c.lPub} required error={errors.publicite?.message}>
              <RadioYesNo name="publicite" register={register} yes={c.yes} no={c.no} />
            </Field>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" className="h-12" onClick={() => setStep(1)}>
                {c.back}
              </Button>
              <Button
                type="button"
                onClick={next}
                className="h-12 bg-secondary hover:bg-secondary-dark text-white"
              >
                {c.next}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div key="s3" className="animate-fade-in space-y-5">
            <h3
              className={cn(
                "font-heading font-semibold text-primary",
                isCard ? "text-lg" : "text-xl",
              )}
            >
              {c.s3Title}
            </h3>

            <Field
              id="localisation"
              label={c.lLoc}
              required
              error={errors.localisation?.message}
            >
              <select id="localisation" {...register("localisation")} className={selectClass}>
                <option value="">{c.choose}</option>
                {LOCALISATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field id="delai" label={c.lDelai} required error={errors.delai?.message}>
              <select id="delai" {...register("delai")} className={selectClass}>
                <option value="">{c.choose}</option>
                {DELAIS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field id="budget" label={budgetLabel} required error={errors.budget?.message}>
              <select id="budget" {...register("budget")} className={selectClass}>
                <option value="">{c.choose}</option>
                {budgetCfg.options.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" className="h-12" onClick={() => setStep(2)}>
                {c.back}
              </Button>
              <Button
                type="button"
                onClick={next}
                className="h-12 bg-secondary hover:bg-secondary-dark text-white"
              >
                {c.next}
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div key="s4" className="animate-fade-in space-y-5">
            <h3
              className={cn(
                "font-heading font-semibold text-primary",
                isCard ? "text-lg" : "text-xl",
              )}
            >
              {c.s4Title}
            </h3>
            <p className="text-sm text-muted-foreground">{c.s4Note}</p>

            <Field id="nom" label={c.lNom} required error={errors.nom?.message}>
              <Input id="nom" autoComplete="name" {...register("nom")} />
            </Field>

            <Field id="mobile" label={c.lWhats} required error={errors.mobile?.message}>
              <Input
                id="mobile"
                type="tel"
                placeholder={c.whatsPh}
                autoComplete="tel"
                {...register("mobile")}
              />
            </Field>

            <Field id="email" label={c.lEmail} required error={errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...register("email")} />
            </Field>

            <Field
              id="entreprise"
              label={c.lEnt}
              required
              error={errors.entreprise?.message}
            >
              <Input id="entreprise" placeholder={c.entPh} {...register("entreprise")} />
            </Field>

            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={watch("consent") === true}
                onCheckedChange={(v) =>
                  setValue(
                    "consent",
                    v === true ? true : (false as unknown as true),
                    { shouldValidate: true },
                  )
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
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  {c.back}
                </Button>
                <Button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="flex-1 btn-cta-primary h-12"
                >
                  {formState.isSubmitting ? c.sending : c.submit}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">{c.secNote}</p>
            </div>
          </div>
        )}
      </form>
    </div>
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
  register: UseFormRegister<FormValues>;
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
          className="flex-1 cursor-pointer rounded-md border border-input bg-white px-3 py-3 min-h-[48px] text-sm text-foreground flex items-center justify-center gap-2 hover:border-secondary has-[:checked]:border-secondary has-[:checked]:bg-secondary/5 has-[:checked]:text-secondary-dark transition-colors"
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