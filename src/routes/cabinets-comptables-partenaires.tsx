import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  TrendingUp,
  Target,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/cabinets-comptables-partenaires")({
  head: () => ({
    meta: [
      {
        title:
          "Rejoignez notre Réseau | Cabinets Comptables Partenaires | SoumissionsComptables.ci",
      },
      {
        name: "description",
        content:
          "Vous êtes cabinet comptable agréé en Côte d'Ivoire ? Rejoignez SoumissionsComptables.ci et recevez des leads qualifiés d'entrepreneurs qui cherchent vos services. Inscription simple.",
      },
      {
        property: "og:title",
        content:
          "Rejoignez notre Réseau | Cabinets Comptables Partenaires",
      },
      {
        property: "og:description",
        content:
          "Recevez des leads qualifiés d'entrepreneurs ivoiriens. Inscription simple et gratuite pour cabinets agréés OECCA-CI.",
      },
      { property: "og:url", content: "/cabinets-comptables-partenaires" },
    ],
    links: [
      { rel: "canonical", href: "/cabinets-comptables-partenaires" },
    ],
  }),
  component: Page,
});

const SERVICES = [
  "Création entreprise",
  "Comptabilité",
  "Fiscalité",
  "Audit",
  "Conseil juridique",
  "Domiciliation",
] as const;

const ZONES = [
  "Plateau",
  "Cocody",
  "Yopougon",
  "Marcory",
  "Toute la CI",
] as const;

const VALUE_PROPS = [
  {
    icon: TrendingUp,
    title: "Des leads qualifiés",
    text: "Les prospects ont déjà défini leur besoin et leur budget.",
  },
  {
    icon: Target,
    title: "Votre niche uniquement",
    text: "Recevez seulement les demandes correspondant à vos services.",
  },
  {
    icon: Briefcase,
    title: "Zéro prospection",
    text: "Concentrez-vous sur vos clients, on gère l'acquisition.",
  },
];

const STEPS = [
  { n: 1, title: "Inscrivez votre cabinet", text: "5 minutes pour créer votre profil et joindre votre agrément OECCA-CI." },
  { n: 2, title: "Définissez vos critères", text: "Services, zones géographiques, taille des clients ciblés." },
  { n: 3, title: "Recevez des leads correspondants", text: "Notifications email et WhatsApp dès qu'une demande matche votre profil." },
  { n: 4, title: "Contactez et soumettez votre offre", text: "Vous échangez directement avec le prospect et envoyez votre proposition." },
];

const PARTNER_FAQS = [
  {
    q: "Y a-t-il des frais d'inscription ?",
    a: "Non. L'inscription et la création de votre profil cabinet sont 100% gratuites. Nous facturons uniquement les leads qualifiés que vous décidez d'acquérir, selon une grille tarifaire transparente communiquée à l'activation de votre compte.",
  },
  {
    q: "Comment sont sélectionnés les leads qui me sont envoyés ?",
    a: "Chaque demande est filtrée selon vos critères : services proposés, zones desservies, type de client et budget indicatif. Vous ne recevez que les prospects compatibles avec votre activité, ce qui maximise votre taux de signature.",
  },
  {
    q: "Puis-je contrôler le volume de leads que je reçois ?",
    a: "Oui. Vous fixez un volume maximum mensuel et pouvez mettre votre compte en pause à tout moment depuis votre tableau de bord, par exemple en période de forte charge ou de congés.",
  },
];

const partnerSchema = z.object({
  cabinet: z.string().trim().min(2, "Nom du cabinet requis").max(120),
  director: z.string().trim().min(2, "Nom du directeur requis").max(120),
  agrement: z.string().trim().min(3, "Numéro d'agrément requis").max(60),
  email: z.string().trim().email("Email invalide").max(255),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Numéro WhatsApp invalide")
    .max(25)
    .regex(/^[0-9 +()-]+$/, "Numéro WhatsApp invalide"),
  services: z.array(z.string()).min(1, "Sélectionnez au moins un service"),
  zones: z.array(z.string()).min(1, "Sélectionnez au moins une zone"),
});

function Page() {
  const [services, setServices] = useState<string[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (
    value: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      cabinet: String(form.get("cabinet") ?? ""),
      director: String(form.get("director") ?? ""),
      agrement: String(form.get("agrement") ?? ""),
      email: String(form.get("email") ?? ""),
      whatsapp: String(form.get("whatsapp") ?? ""),
      services,
      zones,
    };
    const result = partnerSchema.safeParse(data);
    if (!result.success) {
      const first = result.error.issues[0];
      toast.error(first?.message ?? "Formulaire invalide");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Candidature envoyée. Notre équipe vous contactera sous 48h.");
      (e.target as HTMLFormElement).reset();
      setServices([]);
      setZones([]);
    }, 600);
  };

  return (
    <main>
      {/* HERO */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-app py-20 md:py-28 text-center">
          <h1 className="text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
            Développez votre Cabinet avec des Leads Qualifiés
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            Rejoignez le premier réseau de mise en relation comptable de Côte d'Ivoire. Recevez des demandes d'entrepreneurs prêts à signer.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary-dark text-white font-semibold"
            >
              <a href="#inscription">
                Devenir partenaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 1 — Value props */}
      <section className="container-app py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Pourquoi Rejoindre SoumissionsComptables.ci ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Un canal d'acquisition dédié aux cabinets agréés OECCA-CI.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {VALUE_PROPS.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-border bg-background p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 — Process */}
      <section className="bg-background-alt border-y border-border">
        <div className="container-app py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Le Processus pour les Cabinets
            </h2>
            <p className="mt-3 text-muted-foreground">
              De l'inscription à votre première signature, en 4 étapes claires.
            </p>
          </div>
          <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="relative rounded-xl bg-background border border-border p-6"
              >
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION 3 — Testimonial */}
      <section className="container-app py-16 md:py-20">
        <figure className="max-w-3xl mx-auto rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 relative">
          <Quote className="absolute top-6 left-6 h-10 w-10 text-secondary opacity-60" />
          <blockquote className="text-lg md:text-2xl font-medium leading-relaxed pl-12">
            "Depuis que nous sommes sur SoumissionsComptables.ci, nous recevons 3 à 5 nouveaux prospects qualifiés par mois sans effort de prospection."
          </blockquote>
          <figcaption className="mt-6 pl-12 text-primary-foreground/80 text-sm">
            — Cabinet Expertise Plus, Abidjan Plateau
          </figcaption>
        </figure>
      </section>

      {/* SECTION 4 — Form */}
      <section id="inscription" className="bg-background-alt border-y border-border scroll-mt-20">
        <div className="container-app py-16 md:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                Inscrivez votre Cabinet Maintenant
              </h2>
              <p className="mt-3 text-muted-foreground">
                Cabinet agréé OECCA-CI uniquement. Validation manuelle sous 48h.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-border bg-background p-6 md:p-8 space-y-5 shadow-sm"
              noValidate
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="cabinet">Nom du cabinet *</Label>
                  <Input id="cabinet" name="cabinet" required maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="director">Nom du directeur / expert-comptable *</Label>
                  <Input id="director" name="director" required maxLength={120} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="agrement">Numéro d'agrément OECCA-CI *</Label>
                  <Input id="agrement" name="agrement" required maxLength={60} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email professionnel *</Label>
                  <Input id="email" name="email" type="email" required maxLength={255} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">Numéro WhatsApp *</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="+225 07 00 00 00 00"
                  required
                  maxLength={25}
                />
              </div>

              <div className="space-y-3">
                <Label>Services proposés *</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {SERVICES.map((s) => {
                    const id = `srv-${s}`;
                    const checked = services.includes(s);
                    return (
                      <label
                        key={s}
                        htmlFor={id}
                        className="flex items-center gap-3 rounded-md border border-border bg-background-alt/40 px-3 py-2 cursor-pointer hover:bg-background-alt"
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={() =>
                            toggle(s, services, setServices)
                          }
                        />
                        <span className="text-sm text-foreground">{s}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Zones desservies *</Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ZONES.map((z) => {
                    const id = `zn-${z}`;
                    const checked = zones.includes(z);
                    return (
                      <label
                        key={z}
                        htmlFor={id}
                        className="flex items-center gap-3 rounded-md border border-border bg-background-alt/40 px-3 py-2 cursor-pointer hover:bg-background-alt"
                      >
                        <Checkbox
                          id={id}
                          checked={checked}
                          onCheckedChange={() => toggle(z, zones, setZones)}
                        />
                        <span className="text-sm text-foreground">{z}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-semibold"
              >
                {submitting ? "Envoi…" : "Soumettre ma candidature"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                Notre équipe vous contactera sous 48h pour valider votre agrément et finaliser votre accès à la plateforme.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 5 — Partner FAQs */}
      <section className="container-app py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Questions Fréquentes des Cabinets
            </h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {PARTNER_FAQS.map((f, i) => (
              <AccordionItem key={i} value={`pf-${i}`}>
                <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}