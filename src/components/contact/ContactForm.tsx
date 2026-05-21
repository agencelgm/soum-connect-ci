import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Lock, Clock, MapPin, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RequiredLabel } from "@/components/ui/required-label";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Lang = "fr" | "en";

const COPY = {
  fr: {
    heroEyebrow: "Support client",
    heroTitle: "Nous contacter",
    heroSub:
      "Décrivez-nous votre problème, notre équipe vous répond sous 24 heures ouvrables.",
    reassure: [
      { icon: Clock, label: "Réponse < 24h ouvrables" },
      { icon: MapPin, label: "Équipe locale à Abidjan" },
      { icon: Shield, label: "Confidentialité garantie" },
    ],
    formTitle: "Décrivez votre problème",
    fullName: "Nom complet",
    fullNamePh: "Ex. Aya Koffi",
    email: "Email",
    emailPh: "vous@exemple.com",
    mobile: "Téléphone mobile",
    mobilePh: "07 00 00 00 00",
    company: "Entreprise (optionnel)",
    companyPh: "Nom de votre entreprise",
    subject: "Sujet du problème",
    subjectPh: "Sélectionnez un sujet",
    subjects: [
      "Problème avec une soumission reçue",
      "Cabinet partenaire ne répond pas",
      "Problème de facturation / paiement",
      "Question sur un service",
      "Demande de modification / annulation",
      "Autre",
    ],
    service: "Service concerné (optionnel)",
    servicePh: "Sélectionnez un service",
    services: [
      "Création d'entreprise",
      "Comptabilité",
      "Déclaration fiscale",
      "Domiciliation",
      "Logo",
      "Site internet",
      "Autre",
    ],
    occurredAt: "Date du problème (optionnel)",
    description: "Description du problème",
    descriptionPh:
      "Décrivez le plus précisément possible ce qui s'est passé, les dates, les personnes concernées...",
    descriptionHelp: "Entre 20 et 1000 caractères.",
    consent:
      "J'accepte d'être recontacté par l'équipe SoumissionsComptables.ci au sujet de cette demande.",
    submit: "Envoyer ma demande",
    sending: "Envoi en cours...",
    security: "Vos informations restent confidentielles.",
    errReq: "Champ requis",
    errEmail: "Email invalide",
    errPhone: "Numéro de téléphone invalide",
    errDescMin: "Décrivez le problème en au moins 20 caractères",
    errDescMax: "Maximum 1000 caractères",
    errConsent: "Vous devez accepter pour continuer",
    errAll: "Veuillez corriger les champs en rouge",
    success: "Message envoyé. Nous revenons vers vous sous 24h ouvrables.",
    errSubmit: "L'envoi a échoué. Veuillez réessayer.",
  },
  en: {
    heroEyebrow: "Customer support",
    heroTitle: "Contact us",
    heroSub:
      "Tell us what went wrong — our team replies within 24 business hours.",
    reassure: [
      { icon: Clock, label: "Reply within 24 business hours" },
      { icon: MapPin, label: "Local team in Abidjan" },
      { icon: Shield, label: "Strict confidentiality" },
    ],
    formTitle: "Describe your issue",
    fullName: "Full name",
    fullNamePh: "E.g. Aya Koffi",
    email: "Email",
    emailPh: "you@example.com",
    mobile: "Mobile phone",
    mobilePh: "07 00 00 00 00",
    company: "Company (optional)",
    companyPh: "Your company name",
    subject: "Issue topic",
    subjectPh: "Select a topic",
    subjects: [
      "Issue with a quote received",
      "Partner firm not responding",
      "Billing / payment issue",
      "Question about a service",
      "Change or cancellation request",
      "Other",
    ],
    service: "Related service (optional)",
    servicePh: "Select a service",
    services: [
      "Company registration",
      "Accounting",
      "Tax filing",
      "Business address",
      "Logo",
      "Website",
      "Other",
    ],
    occurredAt: "Date the issue occurred (optional)",
    description: "Issue description",
    descriptionPh:
      "Tell us exactly what happened, the dates and people involved...",
    descriptionHelp: "Between 20 and 1000 characters.",
    consent:
      "I agree to be contacted by the SoumissionsComptables.ci team about this request.",
    submit: "Send my request",
    sending: "Sending...",
    security: "Your information stays confidential.",
    errReq: "Required field",
    errEmail: "Invalid email",
    errPhone: "Invalid phone number",
    errDescMin: "Please describe the issue in at least 20 characters",
    errDescMax: "Maximum 1000 characters",
    errConsent: "You must accept to continue",
    errAll: "Please fix the highlighted fields",
    success: "Message sent. We'll get back to you within 24 business hours.",
    errSubmit: "Sending failed. Please try again.",
  },
} as const;

export function ContactForm({ language }: { language: Lang }) {
  const t = COPY[language];
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const schema = z.object({
    fullName: z.string().trim().min(2, t.errReq).max(100),
    email: z.string().trim().email(t.errEmail).max(255),
    mobile: z
      .string()
      .trim()
      .min(6, t.errPhone)
      .max(25)
      .regex(/^[+0-9 ]+$/, t.errPhone),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    subject: z.string().min(1, t.errReq),
    service: z.string().optional().or(z.literal("")),
    occurredAt: z.string().optional().or(z.literal("")),
    description: z
      .string()
      .trim()
      .min(20, t.errDescMin)
      .max(1000, t.errDescMax),
    consent: z.literal(true, { errorMap: () => ({ message: t.errConsent }) }),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      company: "",
      subject: "",
      service: "",
      occurredAt: "",
      description: "",
      consent: false as unknown as true,
    },
  });

  register("subject");
  register("service");
  register("consent");
  const subject = watch("subject");
  const service = watch("service");
  const consent = watch("consent");

  const onInvalid = () => toast.error(t.errAll);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const mobileRaw = values.mobile.trim();
      const mobile = mobileRaw.startsWith("+") ? mobileRaw : `+225 ${mobileRaw}`;
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact-form",
          language,
          nom: values.fullName,
          email: values.email,
          mobile,
          entreprise: values.company ?? "",
          sujet: values.subject,
          service: values.service ?? "",
          dateProbleme: values.occurredAt ?? "",
          description: values.description,
          consent: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast.success(t.success);
      navigate({ to: language === "en" ? "/en/thank-you" : "/merci" });
    } catch (err) {
      console.error("Contact form submission failed", err);
      toast.error(t.errSubmit);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-app py-12 md:py-16 text-center">
          <p className="text-xs md:text-sm font-semibold tracking-widest text-secondary uppercase">
            {t.heroEyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl md:text-5xl font-bold">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-primary-foreground/90">
            {t.heroSub}
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {t.reassure.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground/10 px-3 py-2 text-sm"
              >
                <Icon className="h-4 w-4 text-secondary" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container-app py-12 md:py-16">
        <div className="mx-auto max-w-[720px] rounded-2xl bg-white shadow-lg border border-border p-6 md:p-10">
          <h2 className="font-heading text-2xl font-bold text-primary">
            {t.formTitle}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="mt-6 space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <RequiredLabel htmlFor="fullName">{t.fullName}</RequiredLabel>
                <Input
                  id="fullName"
                  placeholder={t.fullNamePh}
                  aria-invalid={!!errors.fullName}
                  className={cn(
                    errors.fullName &&
                      "border-destructive ring-1 ring-destructive/40",
                  )}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <RequiredLabel htmlFor="email">{t.email}</RequiredLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPh}
                  aria-invalid={!!errors.email}
                  className={cn(
                    errors.email &&
                      "border-destructive ring-1 ring-destructive/40",
                  )}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <RequiredLabel htmlFor="mobile">{t.mobile}</RequiredLabel>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    +225
                  </span>
                  <Input
                    id="mobile"
                    type="tel"
                    inputMode="tel"
                    placeholder={t.mobilePh}
                    aria-invalid={!!errors.mobile}
                    className={cn(
                      "rounded-l-none",
                      errors.mobile &&
                        "border-destructive ring-1 ring-destructive/40",
                    )}
                    {...register("mobile")}
                  />
                </div>
                {errors.mobile && (
                  <p className="text-xs text-destructive">
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="company">{t.company}</Label>
                <Input
                  id="company"
                  placeholder={t.companyPh}
                  {...register("company")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <RequiredLabel htmlFor="subject">{t.subject}</RequiredLabel>
              <Select
                value={subject}
                onValueChange={(v) =>
                  setValue("subject", v, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="subject"
                  aria-invalid={!!errors.subject}
                  className={cn(
                    errors.subject &&
                      "border-destructive ring-1 ring-destructive/40",
                  )}
                >
                  <SelectValue placeholder={t.subjectPh} />
                </SelectTrigger>
                <SelectContent>
                  {t.subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject && (
                <p className="text-xs text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="service">{t.service}</Label>
                <Select
                  value={service}
                  onValueChange={(v) => setValue("service", v)}
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder={t.servicePh} />
                  </SelectTrigger>
                  <SelectContent>
                    {t.services.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="occurredAt">{t.occurredAt}</Label>
                <Input
                  id="occurredAt"
                  type="date"
                  {...register("occurredAt")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <RequiredLabel htmlFor="description">
                {t.description}
              </RequiredLabel>
              <Textarea
                id="description"
                rows={6}
                placeholder={t.descriptionPh}
                aria-invalid={!!errors.description}
                className={cn(
                  errors.description &&
                    "border-destructive ring-1 ring-destructive/40",
                )}
                {...register("description")}
              />
              <p className="text-xs text-muted-foreground">
                {t.descriptionHelp}
              </p>
              {errors.description && (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={!!consent}
                  onCheckedChange={(v) =>
                    setValue("consent", v === true ? (true as const) : (false as unknown as true), {
                      shouldValidate: true,
                    })
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="consent"
                  className="text-sm font-normal leading-snug text-foreground cursor-pointer"
                >
                  {t.consent}
                </Label>
              </div>
              {errors.consent && (
                <p className="text-xs text-destructive">
                  {errors.consent.message as string}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-secondary text-white hover:bg-secondary-dark h-12 text-base font-semibold"
            >
              {submitting ? t.sending : t.submit}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              {t.security}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}