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

const SERVICES = [
  "Création d'entreprise",
  "Comptabilité générale",
  "Déclaration fiscale",
  "Domiciliation Abidjan",
  "Audit comptable",
  "Conseil juridique",
];

const CITIES = ["Abidjan", "Autre ville de CI", "Je suis à l'étranger"];

export function LeadFormCard() {
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      service,
      city,
      fullName: form.get("fullName"),
      whatsapp: form.get("whatsapp"),
      email: form.get("email"),
    };
    if (!service || !city || !payload.fullName || !payload.whatsapp || !payload.email) {
      toast.error("Merci de remplir tous les champs.");
      return;
    }
    setSubmitting(true);
    // TODO: backend wiring (out of scope)
    console.log("Lead form submission", payload);
    setTimeout(() => {
      toast.success("Demande envoyée ! Nous vous contactons sous 48h.");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      setService("");
      setCity("");
    }, 600);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5 text-foreground">
      <h2 className="font-heading text-xl font-semibold text-primary">
        Obtenez vos soumissions gratuitement
      </h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="service">Quel service cherchez-vous ?</Label>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger id="service">
              <SelectValue placeholder="Choisir un service" />
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
          <Label htmlFor="city">Votre ville</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Choisir une option" />
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
          <Label htmlFor="fullName">Votre nom complet</Label>
          <Input id="fullName" name="fullName" placeholder="Jean Kouassi" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">Votre numéro WhatsApp</Label>
          <div className="flex">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
              +225
            </span>
            <Input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              placeholder="07 00 00 00 00"
              className="rounded-l-none"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Votre email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary-dark h-12 text-base font-semibold"
        >
          {submitting ? "Envoi..." : "Recevoir mes 5 soumissions →"}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          Vos informations sont confidentielles. Aucun spam.
        </p>
      </form>
    </div>
  );
}