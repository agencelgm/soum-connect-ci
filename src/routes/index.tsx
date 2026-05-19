import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Users,
  CheckCircle,
  Building2,
  Calculator,
  FileCheck,
  MapPin,
  Search,
  Scale,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadFormCard } from "@/components/home/LeadFormCard";

const TITLE =
  "Cabinet Comptable Côte d'Ivoire | Comparez 5 Soumissions Gratuitement | SoumissionsComptables.ci";
const DESCRIPTION =
  "Trouvez le meilleur cabinet comptable en Côte d'Ivoire. Remplissez un formulaire, recevez jusqu'à 5 soumissions gratuites de cabinets agréés en 48h. Création d'entreprise, comptabilité, fiscalité.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const STEPS = [
  {
    icon: FileText,
    n: "1",
    title: "Décrivez votre besoin",
    desc: "Remplissez notre formulaire en 2 minutes. Dites-nous quel service vous cherchez et où vous êtes situé.",
  },
  {
    icon: Users,
    n: "2",
    title: "Recevez jusqu'à 5 offres",
    desc: "Nos cabinets partenaires agréés vous contactent dans les 48h avec une soumission personnalisée.",
  },
  {
    icon: CheckCircle,
    n: "3",
    title: "Choisissez le meilleur",
    desc: "Comparez les offres, posez vos questions, et choisissez le cabinet qui correspond à votre budget et vos besoins.",
  },
];

const SERVICES = [
  {
    icon: Building2,
    title: "Création d'entreprise",
    desc: "SARL, SAS, entreprise individuelle — constitution complète et accompagnement OHADA.",
    href: "/creation-entreprise-cote-divoire",
  },
  {
    icon: Calculator,
    title: "Comptabilité générale",
    desc: "Tenue, révision, états financiers conformes au SYSCOHADA pour votre activité.",
    href: "/comptabilite-entreprise-abidjan",
  },
  {
    icon: FileCheck,
    title: "Déclaration fiscale",
    desc: "TVA, IS, ITS, BIC — déclarations en ligne et optimisation fiscale légale.",
    href: "/declaration-fiscale-cote-divoire",
  },
  {
    icon: MapPin,
    title: "Domiciliation Abidjan",
    desc: "Adresse professionnelle à Abidjan avec gestion du courrier et services associés.",
    href: "/domiciliation-entreprise-abidjan",
  },
  {
    icon: Search,
    title: "Audit comptable",
    desc: "Audit légal, contractuel ou financier réalisé par un commissaire aux comptes.",
    href: "/audit-comptable-cote-divoire",
  },
  {
    icon: Scale,
    title: "Conseil juridique",
    desc: "Statuts, pactes d'associés, contrats commerciaux et accompagnement juridique.",
    href: "/conseil-juridique-abidjan",
  },
];

const AUDIENCES = [
  {
    emoji: "🏢",
    title: "Entrepreneurs locaux",
    desc: "Abidjan, Bouaké, San-Pédro et partout en Côte d'Ivoire.",
  },
  {
    emoji: "✈️",
    title: "Diaspora ivoirienne",
    desc: "Créez votre entreprise depuis la France, le Canada ou les USA.",
  },
  {
    emoji: "🌍",
    title: "Expatriés en CI",
    desc: "Des cabinets qui parlent votre langue et connaissent vos contraintes.",
  },
  {
    emoji: "🏭",
    title: "Entreprises francophones",
    desc: "Implantation et accompagnement complet en Côte d'Ivoire.",
  },
];

const STATS = [
  { value: "127+", label: "Soumissions envoyées ce mois" },
  { value: "48h", label: "Délai de réponse moyen" },
  { value: "5", label: "Soumissions max par demande" },
  { value: "100%", label: "Gratuit pour les prospects" },
];

const FAQS = [
  {
    q: "Est-ce vraiment gratuit pour moi ?",
    a: "Oui, totalement. SoumissionsComptables.ci est entièrement gratuit pour les entrepreneurs. Ce sont les cabinets comptables partenaires qui financent la plateforme en payant pour accéder aux demandes qualifiées.",
  },
  {
    q: "Combien de temps avant de recevoir une réponse ?",
    a: "Vous recevrez vos premières soumissions dans les 48 heures suivant votre demande. En moyenne, nos utilisateurs reçoivent 3 à 5 réponses en moins de 24h.",
  },
  {
    q: "Les cabinets sont-ils vérifiés et agréés ?",
    a: "Oui. Tous nos cabinets partenaires sont des cabinets d'expertise comptable agréés et inscrits à l'Ordre des Experts-Comptables de Côte d'Ivoire (OECCA-CI).",
  },
  {
    q: "Je suis en France, puis-je créer une entreprise en CI via votre plateforme ?",
    a: "Absolument. De nombreux Ivoiriens de la diaspora utilisent notre plateforme pour trouver un cabinet qui les aide à créer leur entreprise en Côte d'Ivoire à distance, sans avoir besoin de se déplacer.",
  },
  {
    q: "Suis-je obligé de choisir un des cabinets proposés ?",
    a: "Non. Vous êtes libre de comparer toutes les soumissions reçues et de choisir ou non. Il n'y a aucun engagement de votre part.",
  },
];

function Index() {
  return (
    <>
      {/* ====== HERO ====== */}
      <section
        aria-labelledby="hero-title"
        className="text-white"
        style={{ background: "linear-gradient(135deg,#1B3A6B,#1a2f5a)" }}
      >
        <div className="container-app section grid gap-10 lg:grid-cols-5 lg:items-center">
          <div className="lg:col-span-3">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              🇨🇮 Côte d'Ivoire · Abidjan · Diaspora
            </span>
            <h1
              id="hero-title"
              className="mt-4 font-heading font-bold leading-tight text-3xl md:text-5xl"
            >
              Trouvez le Meilleur Cabinet Comptable en Côte d'Ivoire
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80">
              Remplissez un formulaire en 2 minutes. Recevez jusqu'à 5 soumissions gratuites
              de cabinets agréés en 48h. Comparez et choisissez.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              {[
                "100% Gratuit pour vous",
                "Cabinets vérifiés",
                "Réponse en 48h",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <LeadFormCard />
            <p className="mt-3 text-center text-sm text-white/80">
              ⭐ 4.8/5 · 127 soumissions envoyées ce mois
            </p>
          </div>
        </div>
      </section>

      {/* ====== COMMENT ÇA MARCHE ====== */}
      <section aria-labelledby="how-title" className="bg-white">
        <div className="container-app section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Comment Obtenir vos Soumissions en 3 Étapes
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Simple, rapide et 100% gratuit pour vous
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, n, title, desc }) => (
              <article
                key={n}
                className="relative rounded-xl border border-border bg-white p-8 text-center shadow-sm"
              >
                <span className="absolute -top-4 right-6 flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-heading font-bold">
                  {n}
                </span>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mt-5 font-heading text-xl font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/demande-soumissions"
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary-dark"
            >
              Commencer maintenant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== NOS SERVICES ====== */}
      <section aria-labelledby="services-title" className="bg-[#F8FAFC]">
        <div className="container-app section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="services-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Tous les Services Couverts
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Création d'entreprise, comptabilité, fiscalité — on couvre tout.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, desc, href }) => (
              <article
                key={title}
                className="group rounded-xl border border-border bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{desc}</p>
                {/* TODO: some target routes (audit, conseil) not yet created */}
                <a
                  href={href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline"
                >
                  En savoir plus <ArrowRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====== POUR QUI ====== */}
      <section aria-labelledby="audience-title" className="bg-white">
        <div className="container-app section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="audience-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              Que vous soyez en CI ou à l'étranger
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCES.map(({ emoji, title, desc }) => (
              <article key={title} className="text-center">
                <div className="mx-auto text-4xl" aria-hidden>
                  {emoji}
                </div>
                <h3 className="mt-3 font-heading text-lg font-semibold text-primary">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section
        aria-label="Statistiques"
        className="text-white"
        style={{ background: "linear-gradient(135deg,#1B3A6B,#1a2f5a)" }}
      >
        <div className="container-app section">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading text-4xl md:text-5xl font-bold text-secondary">
                  {value}
                </div>
                <p className="mt-2 text-sm md:text-base text-white/80">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FAQ ====== */}
      <section aria-labelledby="faq-title" className="bg-[#F8FAFC]">
        <div className="container-app section">
          <div className="mx-auto max-w-3xl">
            <h2
              id="faq-title"
              className="font-heading text-3xl md:text-4xl font-bold text-primary text-center"
            >
              Questions Fréquentes
            </h2>
            <Accordion type="single" collapsible className="mt-8">
              {FAQS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-base font-semibold text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 text-center">
              <Link
                to="/faq"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Voir toutes les questions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section aria-labelledby="cta-title" className="bg-secondary text-secondary-foreground">
        <div className="container-app section text-center">
          <h2 id="cta-title" className="font-heading text-3xl md:text-4xl font-bold">
            Prêt à trouver votre cabinet comptable ?
          </h2>
          <p className="mt-3 text-lg text-white/90">
            Remplissez le formulaire en 2 minutes. C'est gratuit.
          </p>
          <Link
            to="/demande-soumissions"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-base font-semibold text-secondary hover:bg-white/90"
          >
            Obtenir mes soumissions maintenant <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
