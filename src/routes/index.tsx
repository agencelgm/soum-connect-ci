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
import { buildPageHead } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";

const TITLE =
  "Cabinet Comptable Côte d'Ivoire | Comparez 5 Soumissions Gratuitement | SoumissionsComptables.ci";
const DESCRIPTION =
  "Trouvez le meilleur cabinet comptable en Côte d'Ivoire. Remplissez un formulaire, recevez jusqu'à 5 soumissions gratuites de cabinets agréés en 48h. Création d'entreprise, comptabilité, fiscalité.";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageHead({
      path: "/",
      title: TITLE,
      description: DESCRIPTION,
      includeWebSite: true,
      altPath: "/en",
    }),
  component: Index,
});

export function Index() {
  const { language, t } = useLanguage();
  const quotesHref = getCounterpart(
    language === "en" ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );
  const STEPS = [
    { icon: FileText, n: "1", title: t.process.s1Title, desc: t.process.s1Desc },
    { icon: Users, n: "2", title: t.process.s2Title, desc: t.process.s2Desc },
    { icon: CheckCircle, n: "3", title: t.process.s3Title, desc: t.process.s3Desc },
  ];
  const SERVICES = [
    { icon: Building2, title: t.services.creation, desc: t.servicesSection.d1, href: getCounterpart("/creation-entreprise-cote-divoire", language) },
    { icon: Calculator, title: t.services.accounting, desc: t.servicesSection.d2, href: "/comptabilite-entreprise-abidjan" },
    { icon: FileCheck, title: t.services.tax, desc: t.servicesSection.d3, href: "/declaration-fiscale-cote-divoire" },
    { icon: MapPin, title: t.services.domiciliation, desc: t.servicesSection.d4, href: "/domiciliation-entreprise-abidjan" },
    { icon: Search, title: t.services.audit, desc: t.servicesSection.d5, href: "/audit-comptable-cote-divoire" },
    { icon: Scale, title: t.services.legal, desc: t.servicesSection.d6, href: "/conseil-juridique-abidjan" },
  ];
  const AUDIENCES = [
    { emoji: "🏢", title: t.audience.a1Title, desc: t.audience.a1Desc },
    { emoji: "✈️", title: t.audience.a2Title, desc: t.audience.a2Desc },
    { emoji: "🌍", title: t.audience.a3Title, desc: t.audience.a3Desc },
    { emoji: "🏭", title: t.audience.a4Title, desc: t.audience.a4Desc },
  ];
  const STATS = [
    { value: "127+", label: t.stats.s1 },
    { value: "48h", label: t.stats.s2 },
    { value: "5", label: t.stats.s3 },
    { value: "100%", label: t.stats.s4 },
  ];
  const FAQS = t.homeFaq.items;
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
              {t.hero.badge}
            </span>
            <h1
              id="hero-title"
              className="mt-4 font-heading font-bold leading-tight text-3xl md:text-5xl"
            >
              {t.hero.h1}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80">
              {t.hero.sub}
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              {[t.hero.bullet1, t.hero.bullet2, t.hero.bullet3].map((label) => (
                <li key={label} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <LeadFormCard />
            <p className="mt-3 text-center text-sm text-white/80">
              {t.hero.rating}
            </p>
          </div>
        </div>
      </section>

      {/* ====== COMMENT ÇA MARCHE ====== */}
      <section aria-labelledby="how-title" className="bg-white">
        <div className="container-app section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="how-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              {t.process.title}
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              {t.process.sub}
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
              to={quotesHref}
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary-dark"
            >
              {t.cta.startNow} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== NOS SERVICES ====== */}
      <section aria-labelledby="services-title" className="bg-[#F8FAFC]">
        <div className="container-app section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="services-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              {t.servicesSection.title}
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              {t.servicesSection.sub}
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
                  {t.cta.learnMore} <ArrowRight className="h-4 w-4" />
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
              {t.audience.title}
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
              {t.homeFaq.title}
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
                {t.cta.viewAllFaq} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA FINAL ====== */}
      <section aria-labelledby="cta-title" className="bg-secondary text-secondary-foreground">
        <div className="container-app section text-center">
          <h2 id="cta-title" className="font-heading text-3xl md:text-4xl font-bold">
            {t.finalCta.title}
          </h2>
          <p className="mt-3 text-lg text-white/90">
            {t.finalCta.sub}
          </p>
          <Link
            to={quotesHref}
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-7 py-3.5 text-base font-semibold text-secondary hover:bg-white/90"
          >
            {t.finalCta.button} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
