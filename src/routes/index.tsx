import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  ArrowRight,
  Truck,
  ClipboardList,
  MapPin,
  Quote,
  ShieldCheck,
  Building2,
  Calculator,
  FileCheck,
  Search,
  Scale,
  Users,
  Briefcase,
  Wallet,
  BarChart3,
  Landmark,
  AlertTriangle,
  ShieldAlert,
  Globe2,
  FileText,
  Zap,
  Award,
  Smartphone,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadFormCard } from "@/components/home/LeadFormCard";
import { buildPageHead, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";
import heroAccountant from "@/assets/home/hero-accountant-cutout.png";
import processCouple from "@/assets/home/process-couple.png";
import seoTeamMeeting from "@/assets/home/seo-team-meeting.jpg";
import seoAccountantDesk from "@/assets/home/seo-accountant-desk.jpg";
import seoHandshake from "@/assets/home/seo-handshake-client.jpg";
import seoOfficeAbidjan from "@/assets/home/seo-office-abidjan.jpg";
import seoEntrepreneurs from "@/assets/home/seo-entrepreneurs.jpg";
import svcComptaGenerale from "@/assets/services/comptabilite-generale.jpg";
import svcCreationEntreprise from "@/assets/services/creation-entreprise.jpg";
import svcFiscalite from "@/assets/services/fiscalite.jpg";
import svcAudit from "@/assets/services/audit.jpg";
import svcPaieCnps from "@/assets/services/paie-cnps.jpg";
import svcConseilJuridique from "@/assets/services/conseil-juridique.jpg";
import svcDomiciliation from "@/assets/services/domiciliation.jpg";
import svcDiaspora from "@/assets/services/diaspora.jpg";
import svcReporting from "@/assets/services/reporting.jpg";
import svcBancaire from "@/assets/services/bancaire.jpg";
import svcConformiteFiscale from "@/assets/services/conformite-fiscale.jpg";
import svcAuditInterne from "@/assets/services/audit-interne.jpg";

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
      extraSchemas: [LOCAL_BUSINESS_SCHEMA],
    }),
  component: Index,
});

export function Index() {
  const { language, t } = useLanguage();
  const h = t.home2;
  const quotesHref = getCounterpart(
    language === "en" ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );

  const FEATURE_ICONS = [MapPin, ShieldCheck, Briefcase];
  const STAT_ICONS = [Truck, ClipboardList, MapPin];
  const SERVICE_ICONS = [
    Calculator, Building2, FileCheck, Search, Users, Scale,
    MapPin, Globe2, BarChart3, Landmark, AlertTriangle, ShieldAlert,
  ];
  const SERVICE_IMAGES = [
    svcComptaGenerale, svcCreationEntreprise, svcFiscalite, svcAudit,
    svcPaieCnps, svcConseilJuridique, svcDomiciliation, svcDiaspora,
    svcReporting, svcBancaire, svcConformiteFiscale, svcAuditInterne,
  ];
  const STEP_ICONS = [FileText, ClipboardList, CheckCircle];
  const TRUST_ICONS = [ClipboardList, Users, Award, Smartphone];

  return (
    <>
      {/* ====== 1. HERO SPLIT ====== */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden"
      >
        {/* Fond photo flouté (vraie photo, pas d'IA) */}
        <img
          src={seoOfficeAbidjan}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-md scale-110"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#F5F1EA]/75" />

        <div className="relative container-app pt-10 md:pt-16 pb-0 grid gap-8 lg:gap-4 lg:grid-cols-12 lg:items-stretch">
          {/* Left: character (desktop only) — visible crop ends at the torso */}
          <div className="hidden lg:flex lg:col-span-5 items-stretch justify-center lg:-mr-2 xl:-mr-4">
            <div className="relative h-full min-h-[520px] xl:min-h-[620px] w-full overflow-hidden">
              <img
                src={heroAccountant}
                alt=""
                aria-hidden="true"
                className="absolute left-1/2 top-0 h-[1100px] xl:h-[1280px] w-auto max-w-none -translate-x-1/2 object-contain pointer-events-none"
              />
            </div>
          </div>

          {/* Badge + H1 mobile uniquement */}
          <div className="lg:hidden">
            <div className="text-center">
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {t.hero.badge}
              </span>
              <h1 id="hero-title" className="mt-3 font-heading text-3xl font-bold text-primary">
                {t.hero.h1}
              </h1>
            </div>
          </div>

          {/* Right: orange form card */}
          <div className="lg:col-span-7 relative pb-10 md:pb-16">
            <div className="hidden lg:block mb-4">
              <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {t.hero.badge}
              </span>
              <h1 id="hero-title" className="mt-3 font-heading text-3xl xl:text-4xl font-bold text-primary leading-tight">
                {t.hero.h1}
              </h1>
              <p className="mt-2 text-base text-muted-foreground max-w-xl">
                {t.hero.sub}
              </p>
            </div>
            <div className="relative rounded-2xl bg-secondary p-5 md:p-7 shadow-2xl text-white">
              {/* ribbon badge */}
              <div
                aria-hidden
                className="absolute -top-3 -right-3 hidden sm:flex h-20 w-20 items-center justify-center rounded-full bg-white text-primary shadow-lg border-4 border-white text-[10px] font-bold text-center leading-tight px-1 rotate-12"
              >
                <span>CABINETS<br/>AGRÉÉS<br/>OECCA-CI</span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl font-bold uppercase">
                {language === "fr" ? "Obtenez 5 soumissions gratuites de cabinets comptables" : "Get 5 free quotes from accounting firms"}
              </h2>
              <p className="mt-1 text-white/90 font-semibold">
                {language === "fr" ? "Comparez prix et services et choisissez le meilleur" : "Compare prices and services and choose the best"}
              </p>
              <p className="mt-2 text-sm text-white/85">
                {language === "fr"
                  ? "Complétez simplement le formulaire ci-dessous pour obtenir vos soumissions dans les prochaines 24 à 48 heures."
                  : "Simply fill out the form below to receive your quotes within 24 to 48 hours."}
              </p>
              <div className="mt-5">
                <LeadFormCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 2. STATS BAR ====== */}
      <section aria-label="Stats" className="bg-white border-y border-border">
        <div className="container-app py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {h.statsBar.map((s, i) => {
            const Icon = STAT_ICONS[i];
            return (
              <div key={i} className="flex items-center gap-4 justify-center sm:justify-start">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-secondary-foreground shrink-0">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold text-primary leading-none">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====== 3. FEATURES ROW ====== */}
      <section aria-label="Features" className="bg-[#F8FAFC]">
        <div className="container-app section grid gap-8 md:grid-cols-3">
          {h.featuresRow.map((text, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground max-w-xs">{text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ====== 4. TESTIMONIALS ====== */}
      <section aria-label="Témoignages" className="bg-white">
        <div className="container-app section grid gap-8 md:grid-cols-3">
          {h.testimonials.map((tt, i) => (
            <figure key={i} className="text-center px-4">
              <Quote className="mx-auto h-8 w-8 text-secondary" aria-hidden="true" />
              <blockquote className="mt-4 text-sm md:text-base text-muted-foreground italic leading-relaxed">
                "{tt.quote}"
              </blockquote>
              <figcaption className="mt-3 font-bold text-primary">{tt.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ====== 5. HIGHLIGHT CARDS ====== */}
      <section aria-label="Couverture" className="bg-[#F8FAFC]">
        <div className="container-app section grid gap-6 md:grid-cols-3">
          {h.highlights.map((card, i) => {
            const Icon = [Globe2, Award, Building2][i];
            return (
              <article key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-border">
                <div className="relative h-44 bg-gradient-to-br from-primary to-[#1a2f5a] flex items-center justify-center">
                  <Icon className="h-20 w-20 text-white/20" aria-hidden="true" />
                  <div className="absolute -bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg ring-4 ring-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="p-6 pt-9">
                  <h3 className="font-heading text-base font-bold text-primary uppercase leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ====== 6. SERVICES GRID (12 cards) ====== */}
      <section aria-labelledby="services-title" className="bg-white">
        <div className="container-app section">
          <div className="text-center max-w-3xl mx-auto">
            <h2 id="services-title" className="font-heading text-3xl md:text-4xl font-bold text-primary uppercase">
              {language === "fr" ? "Services" : "Services"}
            </h2>
            <p className="mt-3 text-muted-foreground">{h.servicesIntroSub}</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {h.services12.map((s, i) => {
              const Icon = SERVICE_ICONS[i];
              const img = SERVICE_IMAGES[i];
              return (
                <article key={i} className="rounded-xl bg-white overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={img}
                      alt={s.title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute top-3 left-3 h-10 w-10 rounded-lg bg-white/95 backdrop-blur flex items-center justify-center shadow-sm">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-base font-bold text-primary uppercase">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="steps-title" className="bg-white">
        <div className="container-app section">
          <div className="text-center max-w-3xl mx-auto">
            <h2 id="steps-title" className="font-heading text-2xl md:text-3xl font-bold text-primary uppercase">
              {h.stepsKicker}
            </h2>
            <p className="mt-2 font-semibold text-muted-foreground uppercase tracking-wide">{h.stepsSub}</p>
            <p className="mt-4 font-heading text-4xl md:text-5xl font-extrabold text-secondary">{h.stepsTitle}</p>
          </div>

          <div className="mt-10 flex justify-center">
            <img
              src={processCouple}
              alt=""
              width={768}
              height={768}
              loading="lazy"
              className="w-full max-w-sm"
            />
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {h.steps3.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <article key={i} className="text-center">
                  <div className="relative mx-auto h-36 w-36 rounded-full bg-gradient-to-br from-primary to-[#1a2f5a] flex items-center justify-center">
                    <span className="font-heading text-5xl font-bold text-white/15">{i + 1}</span>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground ring-4 ring-white shadow">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="mt-6 font-heading font-extrabold text-secondary text-xl">{s.tag}</p>
                  <p className="mt-1 font-heading font-bold text-primary text-base">{s.title}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed px-2">{s.text}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground/80 italic">{s.footer}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== 9. PROMO BANNER ====== */}
      <section aria-label="Promo" className="bg-primary text-white">
        <div className="container-app py-10 grid gap-6 md:grid-cols-2 items-center">
          <div className="flex items-center gap-4">
            <Zap className="h-12 w-12 text-secondary shrink-0" aria-hidden="true" />
            <div>
              <p className="font-heading text-2xl font-bold">
                {language === "fr" ? "Réponse rapide en 24 à 48h" : "Quick reply within 24 to 48h"}
              </p>
              <p className="text-white/80 text-sm mt-1">
                {language === "fr"
                  ? "Nos cabinets agréés vous contactent en moins de 2 jours ouvrés."
                  : "Our certified firms reach out in under 2 working days."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-12 w-12 text-secondary shrink-0" aria-hidden="true" />
            <div>
              <p className="font-heading text-2xl font-bold">
                {language === "fr" ? "100 % gratuit, sans engagement" : "100% free, no commitment"}
              </p>
              <p className="text-white/80 text-sm mt-1">
                {language === "fr"
                  ? "Comparez sans risque. Choisissez le cabinet qui vous convient."
                  : "Compare risk-free. Pick the firm that suits you."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 10. SEO ARTICLE ====== */}
      <section aria-labelledby="seo-title" className="bg-white">
        <div className="container-app section max-w-5xl">
          <h2 id="seo-title" className="font-heading text-2xl md:text-3xl font-bold text-primary">
            {h.seoTitle}
          </h2>
          <p className="mt-2 text-muted-foreground italic">{h.seoSubtitle}</p>

          {/* Bloc 1 — intro + image team meeting */}
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed order-2 md:order-1">
              {h.seoP1}
            </p>
            <div className="order-1 md:order-2">
              <img
                src={seoTeamMeeting}
                alt="Équipe de cabinet comptable en réunion à Abidjan"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[4/3]"
              />
            </div>
          </div>

          {/* Bloc 2 — image portrait + 3 types */}
          <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] md:items-center">
            <div>
              <img
                src={seoAccountantDesk}
                alt="Comptable au travail dans un cabinet à Abidjan"
                width={896}
                height={1280}
                loading="lazy"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[3/4]"
              />
            </div>
            <div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {h.seoP2}
              </p>
              <h3 className="mt-6 font-heading text-base font-bold text-primary">{h.seoTypesTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {h.seoTypes.map((tt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{tt}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <strong className="text-primary">{h.seoP3Strong}</strong>{h.seoP3}
              </p>
            </div>
          </div>

          {/* Bloc 3 — besoins + image bureau */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-start">
            <div>
              <h3 className="font-heading text-base font-bold text-primary">{h.seoNeedsTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {h.seoNeeds.map((nn, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{nn}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm md:text-base text-muted-foreground leading-relaxed font-semibold text-primary">
                {h.seoLocation}
              </p>
            </div>
            <div>
              <img
                src={seoOfficeAbidjan}
                alt="Intérieur d'un cabinet d'expertise comptable à Abidjan"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[4/3]"
              />
            </div>
          </div>

          {/* Bloc 4 — image entrepreneurs + avantages */}
          <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,_2fr)_minmax(0,_3fr)] md:items-center">
            <div>
              <img
                src={seoEntrepreneurs}
                alt="Entrepreneurs ivoiriens accompagnés par un cabinet comptable"
                width={896}
                height={1280}
                loading="lazy"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[3/4]"
              />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-primary">{h.seoAdvantagesTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {h.seoAdvantages.map((aa, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{aa}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mission + handshake image */}
          <div className="mt-12 grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <img
                src={seoHandshake}
                alt="Mise en relation réussie entre un cabinet comptable et son client"
                width={1280}
                height={896}
                loading="lazy"
                className="w-full h-auto rounded-xl shadow-md object-cover aspect-[4/3]"
              />
            </div>
            <blockquote className="border-l-4 border-secondary bg-[#F8FAFC] p-6 rounded-r-lg italic text-muted-foreground leading-relaxed">
              {h.mission}
            </blockquote>
          </div>

          <p className="mt-10 text-center font-heading text-lg font-bold text-primary">
            {h.seoFinalCta}
          </p>
        </div>

        {/* Bandeau orange — trust badges fusionnés */}
        <div className="bg-secondary text-secondary-foreground">
          <div className="container-app py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {h.trustBadges.map((b, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/80 text-white">
                    <Icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-semibold max-w-[220px] leading-snug">{b}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== 12. FAQ ====== */}
      <section aria-labelledby="faq-title" className="bg-white">
        <div className="container-app section max-w-3xl">
          <h2 id="faq-title" className="font-heading text-3xl md:text-4xl font-bold text-primary text-center">
            {t.homeFaq.title}
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {t.homeFaq.items.map((item, i) => (
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
          <div className="mt-6 text-center">
            <Link to="/faq" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              {t.cta.viewAllFaq} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ====== 13. FINAL CTA REPEAT ====== */}
      <section aria-labelledby="final-title" className="bg-[#F5F1EA]">
        <div className="container-app section">
          <h2 id="final-title" className="text-center font-heading text-2xl md:text-3xl font-bold text-primary max-w-3xl mx-auto">
            {h.finalRepeatTitle}
          </h2>
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 hidden lg:block">
              <img
                src={heroAccountant}
                alt=""
                width={768}
                height={1024}
                loading="lazy"
                className="w-full max-w-sm mx-auto"
              />
            </div>
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl bg-secondary p-5 md:p-7 shadow-2xl text-white">
                <h3 className="font-heading text-xl md:text-2xl font-bold uppercase">
                  {language === "fr" ? "Obtenez 5 soumissions gratuites" : "Get 5 free quotes"}
                </h3>
                <p className="mt-1 text-white/90 text-sm">
                  {language === "fr" ? "Comparez prix et services et choisissez le meilleur" : "Compare prices and services and choose the best"}
                </p>
                <div className="mt-5">
                  <LeadFormCard />
                </div>
              </div>
              <p className="mt-4 text-center font-bold text-primary">
                {h.finalRepeatTagline}
              </p>
              <div className="mt-6 text-center">
                <Link
                  to={quotesHref}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-dark"
                >
                  {t.finalCta.button} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
