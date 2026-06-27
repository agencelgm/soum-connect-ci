import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Target,
  CheckCircle,
  Users,
  BarChart3,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Clock,
  Award,
  XCircle,
  FileText,
  Settings2,
  BadgeCheck,
  ChevronRight,
  Phone,
  Gift,
  Lock,
  Eye,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildPageHead, faqSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

// ─── Data ────────────────────────────────────────────────────────────────────

const PARTNER_FAQS = [
  {
    q: "L'inscription est-elle gratuite ?",
    a: "Oui — et vous recevez 30 crédits offerts dès la validation de votre compte, soit 30 prospects à débloquer sans dépenser un franc. Aucune carte bancaire requise à l'inscription.",
  },
  {
    q: "Combien de prospects puis-je débloquer ?",
    a: "Autant que vous le souhaitez. Chaque prospect est disponible jusqu'à ce que ses 5 places soient prises. Vous choisissez librement lesquels débloquer, à votre rythme, sans cap mensuel.",
  },
  {
    q: "Comment les prospects sont-ils qualifiés ?",
    a: "Chaque demande provient d'un entrepreneur qui a rempli un formulaire structuré sur Soumission Comptable : type de service, secteur, forme juridique et budget indicatif. Notre équipe vérifie chaque dossier avant publication dans la marketplace.",
  },
  {
    q: "Puis-je choisir les types de missions ?",
    a: "Oui. Lors de votre inscription, vous indiquez les services que vous proposez et vos zones géographiques. Vous ne verrez que les prospects compatibles avec votre profil.",
  },
  {
    q: "Que se passe-t-il si un prospect ne répond pas ?",
    a: "Si un prospect s'avère injoignable ou si les informations sont inexactes, contactez notre support sous 72h. Nous examinons chaque signalement et remboursons en crédits si le problème est avéré.",
  },
  {
    q: "Combien de temps dure l'inscription ?",
    a: "Moins de 2 minutes : nom, email, téléphone, ville et domaines d'activité. Aucun justificatif requis à l'inscription. Vos 30 crédits offerts sont attribués dès la validation de votre compte par notre équipe.",
  },
  {
    q: "Comment recharger mes crédits après les 30 offerts ?",
    a: "Directement depuis votre espace partenaire via Mobile Money (Orange Money, MTN MoMo, Wave) ou carte bancaire, à partir de 10 000 FCFA. Les crédits sont crédités instantanément et n'ont pas de date d'expiration.",
  },
  {
    q: "Puis-je suspendre ou fermer mon compte ?",
    a: "Oui, à tout moment depuis votre tableau de bord. En cas de fermeture définitive, vos crédits non utilisés vous sont remboursés sous 30 jours.",
  },
];

const STATS = [
  { icon: FileText, value: "500+", label: "Prospects générés" },
  { icon: Users, value: "120+", label: "Cabinets actifs" },
  { icon: Clock, value: "48h", label: "Délai de validation" },
  { icon: Star, value: "4.8/5", label: "Satisfaction partenaire" },
];

const PAIN_POINTS = [
  {
    icon: Phone,
    title: "Prospection à froid inefficace",
    text: "Moins de 2 % des appels à froid aboutissent à un rendez-vous. Vous dépensez de l'énergie pour des résultats imprévisibles.",
  },
  {
    icon: BarChart3,
    title: "Marketing coûteux et chronophage",
    text: "Réseaux sociaux, référencement, bouche-à-oreille… Des mois avant les premiers résultats, pour un ROI difficile à mesurer.",
  },
  {
    icon: XCircle,
    title: "Clients peu qualifiés",
    text: "Réunions de découverte sans suite, dossiers incomplets, budgets irréalistes. Un temps précieux perdu sur des prospects qui ne signent jamais.",
  },
];

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Prospects pré-qualifiés",
    text: "Chaque prospect a défini son besoin, son budget et sa forme juridique. Zéro prise de contact à froid.",
  },
  {
    icon: Target,
    title: "Filtrage automatique",
    text: "Vous ne voyez que les prospects qui correspondent à vos services et vos zones géographiques. Rien à paramétrer.",
  },
  {
    icon: Lock,
    title: "Places limitées par prospect",
    text: "Chaque prospect est accessible à 5 cabinets maximum. Soyez parmi les premiers à débloquer pour maximiser vos chances.",
  },
  {
    icon: Gift,
    title: "30 prospects offerts à l'inscription",
    text: "Commencez à prospecter immédiatement, sans investissement initial. 30 crédits disponibles dès la validation de votre compte.",
  },
  {
    icon: Zap,
    title: "Tableau de bord simple",
    text: "Visualisez vos prospects disponibles, vos prospects débloqués et votre solde de crédits en un coup d'œil.",
  },
  {
    icon: Award,
    title: "Support dédié",
    text: "Une équipe basée à Abidjan répond à vos questions par WhatsApp ou email sous 4 heures ouvrées.",
  },
];

const TESTIMONIALS = [
  {
    initials: "KD",
    color: "#F4732A",
    name: "Kouassi Diarra",
    cabinet: "Cabinet KD Conseils",
    city: "Abidjan, Plateau",
    stars: 5,
    quote:
      "Depuis notre inscription, nous recevons entre 3 et 5 prospects qualifiés par mois sans effort. Le ROI est largement positif dès le premier trimestre.",
  },
  {
    initials: "AN",
    color: "#10B981",
    name: "Aya N'Goran",
    cabinet: "Expertise & Audit CI",
    city: "Abidjan, Cocody",
    stars: 5,
    quote:
      "La qualité des prospects m'a surpris. Ils arrivent avec un dossier structuré et un besoin clair. Je signe environ 1 sur 3, c'est bien au-dessus de mes anciens canaux.",
  },
  {
    initials: "MB",
    color: "#2952A3",
    name: "Mamadou Bamba",
    cabinet: "Cabinet Bamba & Associés",
    city: "Bouaké",
    stars: 5,
    quote:
      "J'obtiens des prospects qualifiés à Bouaké et dans le centre du pays. J'ai signé mes 3 premiers clients avec les prospects offerts à l'inscription.",
  },
];

const ELIGIBILITY_YES = [
  "Vous exercez en cabinet ou êtes expert-comptable indépendant en Côte d'Ivoire",
  "Vous cherchez un canal d'acquisition prévisible et sans démarchage à froid",
  "Vous voulez choisir vous-même les missions qui vous correspondent",
  "Vous êtes disponible pour répondre rapidement à des prospects qualifiés",
];

const ELIGIBILITY_NO = [
  "Vous n'exercez pas encore en Côte d'Ivoire",
  "Vous exercez uniquement en tant que salarié sans cabinet propre",
  "Vous recherchez des prospects hors de Côte d'Ivoire",
];

// ─── Route ───────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/cabinets-comptables-partenaires")({
  head: () =>
    buildPageHead({
      path: "/cabinets-comptables-partenaires",
      title:
        "Rejoignez notre Réseau | Cabinets Comptables Partenaires | SoumissionsComptables.ci",
      description:
        "Vous êtes cabinet comptable en Côte d'Ivoire ? Rejoignez SoumissionsComptables.ci et recevez 30 prospects qualifiés offerts à l'inscription. Sans carte bancaire, sans engagement.",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        {
          name: "Cabinets partenaires",
          path: "/cabinets-comptables-partenaires",
        },
      ],
      extraSchemas: [
        faqSchema(PARTNER_FAQS.map((f) => ({ question: f.q, answer: f.a }))),
      ],
    }),
  component: Page,
});

// ─── Component ───────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#F4732A] text-[#F4732A]" />
      ))}
    </div>
  );
}

function Page() {
  const rel = getPageRelations("/cabinets-comptables-partenaires");

  return (
    <main>
      {rel ? <Breadcrumbs items={rel.breadcrumb} /> : null}

      {/* ── Section 1: Hero ─────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative overflow-hidden text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Dot grid */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "rgba(244,115,42,0.07)" }}
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-24 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: "rgba(41,82,163,0.25)" }}
        />

        <div className="container-app relative py-24 md:py-32">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-8 backdrop-blur-sm">
              <Gift className="h-4 w-4 text-[#F4732A]" />
              30 prospects offerts à l'inscription — sans carte bancaire
            </div>

            {/* Headline */}
            <h1
              className="font-bold text-white"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1.12,
              }}
            >
              Développez votre cabinet{" "}
              <span className="text-[#F4732A]">sans prospecter</span>
            </h1>

            {/* Sub */}
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
              Parcourez les demandes d'entrepreneurs qualifiées sur Soumission
              Comptable.{" "}
              <strong className="text-white font-semibold">
                Débloquez ceux qui vous intéressent
              </strong>{" "}
              et contactez-les directement.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/inscription-partenaire"
                className="btn-cta-primary btn-cta-pulse text-base"
              >
                Obtenir mes 30 prospects offerts
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#comment-ca-marche"
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                Voir comment ça marche
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap gap-3">
              {["Inscription en 2 min", "30 prospects offerts", "Sans engagement"].map(
                (badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-white/85"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                    {badge}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Floating metric cards */}
          <div
            className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-3"
            aria-hidden
          >
            <div
              className="rounded-2xl border border-white/15 px-6 py-4 backdrop-blur-md"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="text-3xl font-bold text-[#F4732A]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                +340
              </div>
              <div className="text-sm text-white/75 mt-0.5">prospects ce mois-ci</div>
            </div>
            <div
              className="rounded-2xl border border-white/15 px-6 py-4 backdrop-blur-md"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="text-3xl font-bold text-[#10B981]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                120+
              </div>
              <div className="text-sm text-white/75 mt-0.5">cabinets actifs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Stats bar ────────────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className="container-app py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-border">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center px-4"
              >
                <Icon className="h-5 w-5 text-secondary mb-2" />
                <span
                  className="text-2xl md:text-3xl font-bold text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {value}
                </span>
                <span className="text-xs md:text-sm text-muted-foreground mt-0.5">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Empathy / Problem ────────────────────────────────── */}
      <section className="bg-background-alt">
        <div className="container-app section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Vous passez trop de temps à chercher des clients ?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              La prospection traditionnelle coûte cher et donne peu de résultats
              prévisibles. Il existe une meilleure façon.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl bg-white border border-border p-6 shadow-sm"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Solution (split) ─────────────────────────────────── */}
      <section className="bg-white">
        <div className="container-app section">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-block rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-semibold px-3 py-1 mb-5">
                La solution
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-snug">
                Des prospects qui ont{" "}
                <span className="text-secondary">déjà décidé</span> de signer
                avec un cabinet
              </h2>
              <p className="mt-5 text-muted-foreground md:text-lg leading-relaxed">
                Soumission Comptable collecte, qualifie et publie les demandes
                d'entrepreneurs en Côte d'Ivoire. Vous accédez à leurs
                coordonnées complètes d'un simple clic.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Besoin défini et budget identifié",
                  "Dossier vérifié par notre équipe",
                  "Places limitées — 5 cabinets max par prospect",
                  "Contact direct sans intermédiaire",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/inscription-partenaire"
                className="inline-flex items-center gap-2 mt-8 btn-cta-primary text-sm"
              >
                Démarrer avec 30 prospects offerts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: marketplace mockup */}
            <div className="relative">
              <div
                className="rounded-3xl border border-border p-6 bg-background-alt"
                style={{ boxShadow: "var(--shadow-hero-card)" }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-sm font-semibold text-foreground">
                    Prospect disponible
                  </span>
                  <span className="rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-medium px-2.5 py-0.5">
                    Nouveau
                  </span>
                </div>
                {/* Lead card preview */}
                <div className="space-y-3">
                  {[
                    { label: "Service", value: "Comptabilité générale" },
                    { label: "Secteur", value: "Commerce / Distribution" },
                    { label: "Forme juridique", value: "SARL" },
                    { label: "Zone", value: "Abidjan, Cocody" },
                    { label: "Budget", value: "150 000 – 300 000 FCFA/an" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Contact blurred */}
                <div className="mt-5 rounded-xl bg-white border border-border p-4">
                  <div className="text-xs text-muted-foreground mb-2">
                    Coordonnées du prospect
                  </div>
                  <div className="space-y-1.5">
                    {["Nom & prénom", "Téléphone", "Email"].map((f) => (
                      <div
                        key={f}
                        className="h-5 rounded bg-border/60"
                        style={{ width: f === "Email" ? "70%" : "80%" }}
                      />
                    ))}
                  </div>
                </div>
                {/* Places restantes */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full w-2/5 rounded-full bg-[#10B981]" />
                  </div>
                  <span className="text-xs text-muted-foreground">2 places sur 5</span>
                </div>
                {/* CTA */}
                <button className="mt-4 w-full btn-cta-primary justify-center text-sm py-3">
                  Débloquer ce prospect — 1 crédit
                </button>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 rounded-xl bg-white border border-border shadow-md px-4 py-2 text-center hidden md:block">
                <div className="text-lg font-bold text-primary">1 crédit</div>
                <div className="text-xs text-muted-foreground">par prospect</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 5: How it works ─────────────────────────────────────── */}
      <section
        id="comment-ca-marche"
        className="scroll-mt-20"
        style={{ background: "#EEF2F7" }}
      >
        <div className="container-app section">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Comment ça marche ?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              De l'inscription à votre premier contact, en 3 étapes simples.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div
              aria-hidden
              className="hidden md:block absolute top-12 left-[calc(33.33%-1px)] right-[calc(33.33%-1px)] h-px border-t-2 border-dashed border-primary/20"
            />
            {[
              {
                step: "01",
                icon: FileText,
                title: "Inscrivez-vous en 2 minutes",
                text: "Nom, email, téléphone et domaines d'activité. Aucun paiement, aucun justificatif. 30 crédits offerts dès la validation de votre compte.",
              },
              {
                step: "02",
                icon: Eye,
                title: "Parcourez les prospects qualifiés",
                text: "Consultez les demandes d'entrepreneurs filtrées selon votre spécialité et votre zone géographique. Vous voyez le service, le budget et la localisation avant de débloquer.",
              },
              {
                step: "03",
                icon: Zap,
                title: "Débloquez et contactez",
                text: "1 clic = coordonnées complètes du prospect. Nom, téléphone, email, message détaillé. Contactez-le directement.",
              },
            ].map(({ step, icon: Icon, title, text }) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div
                  className="relative inline-flex h-24 w-24 items-center justify-center rounded-2xl mb-6 shadow-md"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Icon className="h-9 w-9 text-white" />
                  <span
                    className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-[#F4732A] text-white text-xs font-bold flex items-center justify-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Features grid ────────────────────────────────────── */}
      <section className="bg-white">
        <div className="container-app section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Ce que vous obtenez en rejoignant le réseau
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Une plateforme pensée pour les cabinets qui veulent croître sans
              sacrifier leur temps.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1"
                style={{
                  boxShadow: "var(--shadow-card)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = "var(--shadow-card-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow = "var(--shadow-card)")
                }
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: 30 leads offerts ─────────────────────────────────── */}
      <section className="bg-background-alt border-y border-border">
        <div className="container-app section">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* Left: big number */}
              <div className="text-center md:text-left">
                <div
                  className="inline-block text-[8rem] md:text-[10rem] font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: "var(--gradient-cta)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  30
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground -mt-2">
                  prospects pour démarrer
                </div>
                <p className="mt-3 text-muted-foreground">
                  Offerts à l'inscription. Zéro FCFA dépensé.
                </p>
              </div>

              {/* Right: what you get */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border shrink-0">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Ce que vous voyez gratuitement</div>
                    <p className="text-muted-foreground text-sm mt-0.5">Service demandé, secteur, forme juridique, budget estimé et zone géographique — avant de dépenser un seul crédit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border shrink-0">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Ce qui se débloque avec 1 crédit</div>
                    <p className="text-muted-foreground text-sm mt-0.5">Nom complet, entreprise, téléphone, email et message détaillé du prospect. Contact direct, sans intermédiaire.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border shrink-0">
                    <Shield className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">Pourquoi c'est limité à 5 cabinets</div>
                    <p className="text-muted-foreground text-sm mt-0.5">Chaque prospect est accessible à 5 cabinets maximum pour garantir une vraie opportunité — pas 50 concurrents sur la même demande.</p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/inscription-partenaire"
                    className="inline-flex items-center gap-2 btn-cta-primary text-sm"
                  >
                    Créer mon compte et obtenir mes 30 prospects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="text-xs text-muted-foreground mt-3">
                    Après vos 30 crédits offerts, rechargez à votre rythme à partir de 10 000 FCFA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 8: Testimonials ─────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container-app section relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              Ils ont rejoint le réseau
            </h2>
            <p className="mt-4 text-white/70 md:text-lg">
              Des cabinets qui développent leur portefeuille client avec
              Soumission Comptable.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-white/15 p-6 flex flex-col gap-5"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
              >
                <StarRating count={t.stars} />
                <blockquote className="text-white/90 text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">
                      {t.name}
                    </div>
                    <div className="text-white/60 text-xs">
                      {t.cabinet} · {t.city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: Eligibility ──────────────────────────────────────── */}
      <section className="bg-white">
        <div className="container-app section">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Pour qui est fait Soumission Comptable ?
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              La plateforme est ouverte à tous les professionnels de la
              comptabilité en Côte d'Ivoire.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Eligible */}
            <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-7">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="h-5 w-5 text-[#10B981]" />
                <h3 className="font-bold text-foreground">Vous êtes éligible si…</h3>
              </div>
              <ul className="space-y-3">
                {ELIGIBILITY_YES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/inscription-partenaire"
                className="inline-flex items-center gap-2 mt-7 text-sm font-semibold text-[#10B981] hover:underline"
              >
                Créer mon compte
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Not eligible */}
            <div className="rounded-2xl border border-border bg-background-alt p-7">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-bold text-foreground">
                  Ce n'est pas fait pour vous si…
                </h3>
              </div>
              <ul className="space-y-3">
                {ELIGIBILITY_NO.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <XCircle className="h-4 w-4 text-border shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 10: FAQ ─────────────────────────────────────────────── */}
      <section className="bg-background-alt border-y border-border">
        <div className="container-app section">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                Questions fréquentes des cabinets
              </h2>
              <p className="mt-4 text-muted-foreground">
                Tout ce que vous devez savoir avant de rejoindre le réseau.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {PARTNER_FAQS.map((f, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border border-border bg-white px-5 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── Section 11: Final CTA ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-cta)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <div className="container-app section relative text-center">
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-2xl md:text-4xl font-bold text-white"
              style={{ lineHeight: 1.15 }}
            >
              Prêt à développer votre cabinet ?
            </h2>
            <p className="mt-5 text-white/85 md:text-lg">
              Rejoignez{" "}
              <strong className="text-white">120+ cabinets</strong>{" "}
              qui ont démarré avec leurs 30 prospects offerts — sans dépenser un franc.
            </p>
            <Link
              to="/inscription-partenaire"
              className="inline-flex items-center gap-2 mt-8 rounded-xl bg-white text-secondary font-bold px-8 py-4 text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Créer mon compte partenaire
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-5 text-white/60 text-sm">
              Gratuit · Sans engagement · 2 minutes
            </p>
          </div>
        </div>
      </section>

      {rel ? <RelatedLinks items={rel.related} /> : null}
    </main>
  );
}
