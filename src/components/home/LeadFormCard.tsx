import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RequiredLabel } from "@/components/ui/required-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function LeadFormCard() {
  const { t, language } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const SERVICES = [
    t.services.creation,
    t.services.accounting,
    t.services.tax,
    t.services.domiciliation,
    t.services.audit,
    t.services.legal,
  ];
  const CITIES = t.leadForm.cities;

  const errReq = language === "en" ? "Required field" : "Champ requis";
  const errEmail = language === "en" ? "Invalid email" : "Email invalide";
  const errPhone =
    language === "en" ? "Invalid phone number" : "Numéro de téléphone invalide";

  const schema = z.object({
    service: z.string().min(1, errReq),
    city: z.string().min(1, errReq),
    fullName: z.string().trim().min(2, errReq).max(100),
    mobile: z
      .string()
      .trim()
      .min(6, errPhone)
      .max(25)
      .regex(/^[+0-9 ]+$/, errPhone),
    email: z.string().trim().email(errEmail).max(255),
  });
  type FormValues = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { service: "", city: "", fullName: "", mobile: "", email: "" },
  });

  const service = watch("service");
  const city = watch("city");

  // Register hidden fields managed by Select
  register("service");
  register("city");

  const onInvalid = () => {
    toast.error(t.leadForm.errAll);
    const order: (keyof FormValues)[] = ["service", "city", "fullName", "mobile", "email"];
    const first = order.find((k) => errors[k]);
    if (first && first !== "service" && first !== "city") {
      setFocus(first);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const mobileRaw = values.mobile.trim();
      const mobile = mobileRaw.startsWith("+") ? mobileRaw : `+225 ${mobileRaw}`;
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "home-lead-form",
          language,
          service: values.service,
          localisation: values.city,
          nom: values.fullName,
          mobile,
          email: values.email,
          consent: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackEvent("soumission_envoyee", {
        service: values.service,
        localisation: values.city,
        language,
        source: "home-lead-form",
      });
      toast.success(t.leadForm.success);
      reset();
    } catch (err) {
      console.error("Lead form submission failed", err);
      toast.error(t.leadForm.errAll);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5 text-foreground">
      <h2 className="font-heading text-xl font-semibold text-primary">
        {t.leadForm.title}
      </h2>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <RequiredLabel htmlFor="service">{t.leadForm.service}</RequiredLabel>
          <Select
            value={service}
            onValueChange={(v) => setValue("service", v, { shouldValidate: true })}
          >
            <SelectTrigger
              id="service"
              aria-invalid={!!errors.service}
              className={cn(errors.service && "border-destructive ring-1 ring-destructive/40")}
            >
              <SelectValue placeholder={t.leadForm.servicePh} />
            </SelectTrigger>
            <SelectContent>
              {SERVICES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.service && (
            <p className="text-xs text-destructive">{errors.service.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <RequiredLabel htmlFor="city">{t.leadForm.city}</RequiredLabel>
          <Select
            value={city}
            onValueChange={(v) => setValue("city", v, { shouldValidate: true })}
          >
            <SelectTrigger
              id="city"
              aria-invalid={!!errors.city}
              className={cn(errors.city && "border-destructive ring-1 ring-destructive/40")}
            >
              <SelectValue placeholder={t.leadForm.cityPh} />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <RequiredLabel htmlFor="fullName">{t.leadForm.fullName}</RequiredLabel>
          <Input
            id="fullName"
            placeholder={t.leadForm.fullNamePh}
            aria-invalid={!!errors.fullName}
            className={cn(errors.fullName && "border-destructive ring-1 ring-destructive/40")}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <RequiredLabel htmlFor="mobile">{t.leadForm.mobile}</RequiredLabel>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +225
            </span>
            <Input
              id="mobile"
              type="tel"
              inputMode="tel"
              placeholder={t.leadForm.mobilePh}
              aria-invalid={!!errors.mobile}
              className={cn(
                "rounded-l-none",
                errors.mobile && "border-destructive ring-1 ring-destructive/40",
              )}
              {...register("mobile")}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-destructive">{errors.mobile.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <RequiredLabel htmlFor="email">{t.leadForm.email}</RequiredLabel>
          <Input
            id="email"
            type="email"
            placeholder={t.leadForm.emailPh}
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-destructive ring-1 ring-destructive/40")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-dark h-12 text-base font-semibold"
        >
          {submitting ? t.leadForm.sending : t.leadForm.submit}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          {t.leadForm.security}
        </p>
      </form>
    </div>
  );
}