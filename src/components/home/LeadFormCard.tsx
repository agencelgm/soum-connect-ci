import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function LeadFormCard() {
  const { t, language } = useLanguage();
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(e.currentTarget);
    const payload = {
      service,
      localisation: city,
      fullName: form.get("fullName"),
      mobile: form.get("mobile"),
      email: form.get("email"),
    };
    if (!service || !city || !payload.fullName || !payload.mobile || !payload.email) {
      toast.error(t.leadForm.errAll);
      return;
    }
    setSubmitting(true);
    try {
      const mobileRaw = String(payload.mobile ?? "").trim();
      const mobile = mobileRaw.startsWith("+") ? mobileRaw : `+225 ${mobileRaw}`;
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "home-lead-form",
          language,
          service: payload.service,
          localisation: payload.localisation,
          nom: payload.fullName,
          mobile,
          email: payload.email,
          consent: true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackEvent("soumission_envoyee", {
        service: payload.service,
        localisation: String(payload.localisation ?? ""),
        language,
        source: "home-lead-form",
      });
      toast.success(t.leadForm.success);
      formEl.reset();
      setService("");
      setCity("");
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
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="service">{t.leadForm.service}</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="service">
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="city">{t.leadForm.city}</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city">
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
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullName">{t.leadForm.fullName}</Label>
          <Input id="fullName" name="fullName" placeholder={t.leadForm.fullNamePh} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mobile">{t.leadForm.mobile}</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +225
            </span>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              inputMode="tel"
              placeholder={t.leadForm.mobilePh}
              className="rounded-l-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t.leadForm.email}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t.leadForm.emailPh}
            required
          />
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