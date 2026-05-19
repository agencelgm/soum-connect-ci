import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search,
  ShieldCheck,
  Clock,
  Eye,
  Award,
  Heart,
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPageHead } from "@/lib/seo";

const META_TITLE = "À Propos de SoumissionsComptables.ci | Notre Mission";
const META_DESC =
  "SoumissionsComptables.ci est la première plateforme de mise en relation entre entrepreneurs et cabinets comptables agréés en Côte d'Ivoire. Découvrez notre mission.";

const PROBLEMS = [
  {
    icon: Search,
    title: "Un marché opaque",
    text: "Difficile pour un entrepreneur de comparer les cabinets comptables ivoiriens, leurs tarifs et leurs spécialisations.",
  },
  {
    icon: ShieldCheck,
    title: "Le risque du non-agréé",
    text: "Beaucoup de prestataires se disent « comptables » sans être inscrits à l'OECCA-CI, ce qui expose l'entreprise à des sanctions DGI.",
  },
  {
    icon: Clock,
    title: "Des démarches CEPICI complexes",
    text: "Les entrepreneurs et la diaspora perdent du temps faute de connaître les bons interlocuteurs locaux.",
  },
];

const VALUES = [
  {
    icon: Eye,
    title: "Transparence",
    text: "Des tarifs clairs, des cabinets vérifiés, aucune commission cachée à l'utilisateur.",
  },
  {
    icon: Award,
    title: "Fiabilité",
    text: "Tous nos cabinets partenaires sont agréés OECCA-CI et passent une validation manuelle.",
  },
  {
    icon: Heart,
    title: "Accessibilité",
    text: "Gratuit pour les entrepreneurs, ouvert à la diaspora, disponible en français et en anglais.",
  },
];

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@soumissionscomptables.ci",
    href: "mailto:contact@soumissionscomptables.ci",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+225 07 67 00 96 29",
    href: "https://wa.me/2250767009629",
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Plateau, Abidjan, Côte d'Ivoire",
  },
];

export const Route = createFileRoute("/a-propos")({
  head: () =>
    buildPageHead({
      path: "/a-propos",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "À propos", path: "/a-propos" },
      ],
    }),
  component: Page,
});

function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground">
        <div className="container-app py-16 md:py-24 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Notre Mission : Faciliter l'Accès aux Services Comptables en Côte d'Ivoire
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            Connecter entrepreneurs, diaspora et cabinets agréés OECCA-CI en toute transparence.
          </p>
        </div>
      </section>

      {/* Section 1 — Qui nous sommes */}
      <section className="container-app py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
            Qui nous sommes
          </h2>
          <div className="mt-5 space-y-4 text-foreground leading-relaxed">
            <p>
              <strong>SoumissionsComptables.ci</strong> est la première plateforme de mise en relation comptable en Côte d'Ivoire. Nous connectons les entrepreneurs, les membres de la diaspora ivoirienne et les entreprises avec des cabinets comptables agréés et vérifiés.
            </p>
            <p>
              Notre rôle est simple : qualifier vos besoins en quelques minutes, les transmettre à des cabinets agréés OECCA-CI sélectionnés, et vous laisser comparer jusqu'à cinq propositions claires — gratuitement, en 48 heures. Nous ne facturons rien aux entrepreneurs : ce sont les cabinets partenaires qui financent la plateforme en accédant aux demandes qualifiées.
            </p>
            <p>
              Notre ambition est d'apporter au marché comptable ivoirien la transparence et la simplicité qui font défaut aujourd'hui, et de devenir le réflexe naturel de tout entrepreneur cherchant un partenaire comptable de confiance — qu'il soit à Abidjan, en région ou à l'étranger.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Notre Constat */}
      <section className="bg-background-alt border-y border-border">
        <div className="container-app py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
              Notre Constat
            </h2>
            <p className="mt-3 text-muted-foreground">
              Trois problèmes que rencontrent chaque jour les entrepreneurs ivoiriens — et que nous résolvons.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-border bg-background p-6 shadow-sm"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-primary text-lg">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Nos Valeurs */}
      <section className="container-app py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">Nos Valeurs</h2>
          <p className="mt-3 text-muted-foreground">
            Trois principes qui guident chaque décision produit et chaque partenariat.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-xl bg-primary text-primary-foreground p-6 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-lg">{v.title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/85 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 — Équipe */}
      <section className="bg-background-alt border-y border-border">
        <div className="container-app py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
              L'Équipe Derrière le Projet
            </h2>
            <p className="mt-5 text-foreground leading-relaxed">
              SoumissionsComptables.ci est une réalisation de <strong>LGM — Les Gens du Marketing</strong>, agence de marketing digital spécialisée dans la performance commerciale.
            </p>
            <div className="mt-6">
              <a
                href="https://lgm.ci"
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-semibold"
              >
                Découvrir LGM
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5 — Contact */}
      <section className="container-app py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">Contact</h2>
          <p className="mt-3 text-muted-foreground">
            Une question, un partenariat, une presse ? Voici comment nous joindre.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CONTACTS.map((c) => {
            const inner = (
              <>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                  <c.icon className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {c.label}
                </p>
                <p className="mt-2 text-foreground font-medium break-words">{c.value}</p>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-border bg-background p-6 text-center hover:border-secondary/40 hover:shadow-md transition-all"
              >
                {inner}
              </a>
            ) : (
              <div
                key={c.label}
                className="rounded-xl border border-border bg-background p-6 text-center"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary">
        <div className="container-app py-12 md:py-16 text-center">
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl">
            Prêt à trouver votre cabinet comptable ?
          </h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Recevez jusqu'à 5 soumissions de cabinets agréés OECCA-CI. Gratuit, sous 48h.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-white text-secondary hover:bg-white/90 font-semibold">
              <Link to="/demande-soumissions">
                Obtenir mes soumissions gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}