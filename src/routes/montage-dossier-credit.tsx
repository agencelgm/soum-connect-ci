import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  CheckCircle2,
  Shield,
  Users,
  Scale,
  Clock,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Briefcase,
  TrendingUp,
  Truck,
  Store,
  Factory,
  Package,
  Wallet,
  FileCheck,
  Landmark,
  LineChart,
  Users2,
  RefreshCw,
  HandCoins,
  Home,
} from "lucide-react";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";
import { FinancingLeadForm } from "@/components/financing/FinancingLeadForm";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Montage de dossier de crédit en Côte d'Ivoire | Soumission Comptable";
const DESCRIPTION =
  "Trouvez un professionnel pour préparer votre dossier de crédit ou de financement. Recevez plusieurs propositions gratuitement et sans engagement.";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80";

export const Route = createFileRoute("/montage-dossier-credit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Page,
});

function scrollToForm() {
  if (typeof document === "undefined") return;
  document.getElementById("formulaire")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CtaButton({
  children,
  variant = "primary",
  label,
}: {
  children: React.ReactNode;
  variant?: "primary" | "light";
  label: string;
}) {
  return (
    <button
      onClick={() => {
        trackEvent("cta_click", { label, page: "financing" });
        scrollToForm();
      }}
      className={
        variant === "primary"
          ? "inline-flex items-center justify-center gap-2 rounded-lg bg-secondary text-white px-6 py-3 text-base font-semibold hover:bg-secondary-dark transition shadow-md"
          : "inline-flex items-center justify-center gap-2 rounded-lg bg-white text-primary px-6 py-3 text-base font-semibold hover:bg-white/90 transition shadow-md"
      }
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function Section({
  children,
  bg = "white",
}: {
  children: React.ReactNode;
  bg?: "white" | "muted" | "primary";
}) {
  const cls =
    bg === "muted"
      ? "bg-[#F8FAFC]"
      : bg === "primary"
        ? "bg-primary text-white"
        : "bg-white";
  return (
    <section className={cls}>
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-14 md:py-20">{children}</div>
    </section>
  );
}

function LocalHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        <Link to="/" aria-label="SoumissionComptable.com" className="flex items-center shrink-0">
          <img src={logo} alt="SoumissionComptable.com" className="h-10 md:h-14 w-auto" />
        </Link>
        <button
          onClick={() => {
            trackEvent("cta_click", { label: "header", page: "financing" });
            scrollToForm();
          }}
          className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm md:text-base font-semibold hover:bg-secondary-dark transition"
        >
          Recevoir des propositions
        </button>
      </div>
    </header>
  );
}

function LocalFooter() {
  return (
    <footer className="bg-primary text-white/90 text-sm">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 space-y-6">
        <p className="text-white/85 leading-relaxed max-w-3xl">
          Soumission Comptable est une plateforme de mise en relation. Soumission Comptable n'accorde pas de
          crédit et ne garantit pas l'obtention d'un financement. Toute décision de financement appartient
          exclusivement à la banque, à l'établissement financier ou à l'investisseur concerné.
        </p>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-white/20 pt-6">
          <p>© {new Date().getFullYear()} SoumissionComptable.com</p>
          <p className="text-white/70">Gratuit · Sans engagement · Confidentiel</p>
        </div>
      </div>
    </footer>
  );
}

function MobileStickyCta() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.15)] p-3">
      <button
        onClick={() => {
          trackEvent("cta_click", { label: "mobile-sticky", page: "financing" });
          scrollToForm();
        }}
        className="w-full min-h-12 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition"
      >
        Recevoir des propositions
      </button>
    </div>
  );
}

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Soumission Comptable peut-elle garantir l'obtention de mon crédit ?",
    a: "Non. La décision finale appartient exclusivement à la banque, à l'établissement financier ou à l'investisseur. L'objectif de l'accompagnement est de vous aider à préparer et présenter un dossier plus clair, plus structuré et plus professionnel.",
  },
  {
    q: "La demande de propositions est-elle gratuite ?",
    a: "Oui. Vous pouvez déposer votre demande gratuitement et sans engagement afin de recevoir plusieurs propositions de professionnels.",
  },
  {
    q: "Dois-je déjà avoir une entreprise pour demander un accompagnement ?",
    a: "Non. Vous pouvez rechercher un accompagnement pour une entreprise déjà en activité ou pour un projet en préparation. Le professionnel devra toutefois évaluer les informations et les documents disponibles.",
  },
  {
    q: "Quels documents dois-je fournir ?",
    a: "Les documents dépendent du projet et du financeur. Ils peuvent comprendre des documents administratifs, des informations comptables, des relevés, des factures, des devis, des prévisions financières et une présentation détaillée du projet.",
  },
  {
    q: "Puis-je demander un accompagnement pour présenter mon projet à un investisseur ?",
    a: "Oui. Certains professionnels peuvent vous accompagner dans la structuration des informations financières nécessaires à la présentation de votre projet à un investisseur.",
  },
  {
    q: "Combien coûte le montage d'un dossier de financement ?",
    a: "Le coût dépend de la complexité du projet, des documents déjà disponibles, du montant recherché et du niveau d'accompagnement nécessaire. Soumission Comptable vous permet de recevoir plusieurs propositions afin de comparer avant de choisir.",
  },
  {
    q: "Puis-je demander un financement sans avoir de documents comptables ?",
    a: "Vous pouvez déposer votre demande, mais le professionnel devra analyser votre situation. Selon votre projet, il pourra être nécessaire de préparer, compléter ou régulariser certains documents avant de finaliser le dossier.",
  },
];

const PROBLEMES = [
  "Besoin de financement mal expliqué",
  "Chiffres incohérents ou difficiles à vérifier",
  "Prévisions financières trop optimistes",
  "Absence de plan de financement",
  "Documents justificatifs incomplets",
  "Capacité de remboursement insuffisamment démontrée",
  "Présentation peu professionnelle",
  "Manque de cohérence entre le projet et le montant demandé",
];

const CONTENU_DOSSIER = [
  "Présentation de l'entreprise",
  "Présentation du promoteur ou des dirigeants",
  "Description du projet",
  "Historique de l'activité",
  "Analyse du marché",
  "Besoin de financement",
  "Détail de l'utilisation des fonds",
  "Plan de financement",
  "Budget prévisionnel",
  "Compte de résultat prévisionnel",
  "Plan de trésorerie",
  "Bilan prévisionnel",
  "Capacité de remboursement",
  "Hypothèses financières",
  "Documents comptables disponibles",
  "Relevés et justificatifs demandés",
  "Documents administratifs et juridiques",
  "Éléments démontrant la rentabilité du projet",
];

const BESOINS: Array<{ icon: React.ComponentType<{ className?: string }>; label: string }> = [
  { icon: Sparkles, label: "Lancement d'une entreprise" },
  { icon: TrendingUp, label: "Développement d'une activité existante" },
  { icon: Package, label: "Achat de matériel ou d'équipements" },
  { icon: Truck, label: "Achat de véhicules professionnels" },
  { icon: Store, label: "Ouverture d'une nouvelle agence" },
  { icon: Building2, label: "Construction ou aménagement de locaux" },
  { icon: Factory, label: "Augmentation de la capacité de production" },
  { icon: Package, label: "Financement de stocks" },
  { icon: Wallet, label: "Besoin de trésorerie" },
  { icon: FileCheck, label: "Exécution d'un marché" },
  { icon: Sparkles, label: "Développement d'un nouveau produit" },
  { icon: Users2, label: "Recherche d'investisseurs" },
  { icon: RefreshCw, label: "Restructuration financière" },
  { icon: Briefcase, label: "Reprise d'une entreprise" },
  { icon: Home, label: "Projet immobilier professionnel" },
];

function Page() {
  useEffect(() => {
    trackEvent("landing_page_view", { page: "financing" });
  }, []);

  return (
    <div className="bg-white">
      <LocalHeader />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#F1F5FF] to-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-16 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Landmark className="h-3.5 w-3.5" /> Montage de dossier de crédit et de financement
            </span>
            <h1 className="mt-4 font-heading font-bold text-primary text-3xl md:text-4xl lg:text-5xl leading-tight">
              Préparez un dossier de financement clair, crédible et professionnel
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Vous recherchez un financement auprès d'une banque ou d'un investisseur ? Soumission
              Comptable vous permet de recevoir plusieurs propositions de professionnels capables de vous
              accompagner dans la préparation de votre dossier.
            </p>
            <ul className="mt-5 space-y-2 text-sm md:text-base text-foreground">
              {["Demande gratuite", "Plusieurs propositions à comparer", "Aucun engagement"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <CtaButton label="hero-primary">Recevoir des propositions gratuitement</CtaButton>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Expliquez votre besoin en quelques minutes. Des professionnels pourront ensuite vous proposer
              un accompagnement adapté à votre projet.
            </p>
            <div className="mt-8 hidden lg:block">
              <img
                src={HERO_IMAGE}
                alt="Entrepreneur ivoirien préparant son dossier de financement avec l'aide d'un professionnel comptable"
                loading="eager"
                className="rounded-2xl shadow-md w-full h-56 object-cover"
              />
            </div>
          </div>

          <FinancingLeadForm />
        </div>
      </section>

      {/* BANDEAU RÉASSURANCE */}
      <div className="bg-primary text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm md:text-base">
          {[
            { icon: Users, label: "Plusieurs propositions" },
            { icon: BadgeCheck, label: "Professionnels qualifiés" },
            { icon: Scale, label: "Comparaison gratuite" },
            { icon: Shield, label: "Aucun engagement" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-center gap-2">
              <r.icon className="h-5 w-5" /> <span>{r.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLÈME */}
      <Section bg="white">
        <p className="text-center text-sm font-semibold text-secondary uppercase tracking-wide">
          Votre projet peut être sérieux, mais votre dossier doit aussi le démontrer
        </p>
        <h2 className="mt-3 font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Un bon projet mal présenté peut être difficile à financer
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Lorsque vous sollicitez une banque ou un investisseur, votre idée ne suffit pas toujours. La
          personne qui étudie votre demande doit comprendre votre activité, votre besoin de financement,
          votre modèle économique, vos prévisions et votre capacité à rembourser ou à générer un retour
          sur investissement. Un dossier incomplet ou mal structuré peut rendre l'analyse plus difficile,
          même lorsque le projet possède un véritable potentiel.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {PROBLEMES.map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg bg-white border border-border p-3 text-sm">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-primary font-medium max-w-2xl mx-auto">
          Le problème n'est pas toujours le projet. Il peut aussi venir de la manière dont il est présenté.
        </p>
        <div className="mt-8 flex justify-center">
          <CtaButton label="after-probleme">Recevoir des propositions gratuitement</CtaButton>
        </div>
      </Section>

      {/* IMPORTANCE DU DOSSIER */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Votre dossier doit permettre au financeur de comprendre rapidement votre projet
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Un dossier de financement bien préparé ne se limite pas à rassembler quelques documents
          administratifs. Il doit raconter une histoire cohérente : votre situation actuelle, votre projet,
          le montant dont vous avez besoin, l'utilisation prévue des fonds et la manière dont le
          financement pourra être remboursé ou rentabilisé.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Présenter votre activité", d: "Expliquez clairement votre entreprise, vos produits, vos services, votre marché et votre expérience." },
            { t: "Justifier votre besoin", d: "Montrez pourquoi vous recherchez un financement et comment les fonds seront utilisés." },
            { t: "Présenter des chiffres cohérents", d: "Appuyez votre demande avec des données financières, des hypothèses réalistes et des prévisions compréhensibles." },
            { t: "Rassurer le financeur", d: "Aidez la banque ou l'investisseur à mieux évaluer les risques, la rentabilité et la capacité de remboursement." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="font-heading font-semibold text-primary">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTENU DU DOSSIER */}
      <Section bg="white">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Que peut contenir un dossier de crédit ou de financement ?
        </h2>
        <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
          Le contenu exact dépend de votre activité, de votre projet, du montant recherché et des
          exigences du financeur.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONTENU_DOSSIER.map((c) => (
            <div key={c} className="rounded-lg border border-border bg-white p-3 text-sm flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <span>{c}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          Les documents à préparer peuvent varier selon la banque, l'investisseur, le secteur d'activité et
          le type de financement recherché.
        </p>
      </Section>

      {/* 3 ÉTAPES */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Trouvez le professionnel adapté à votre besoin
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Au lieu de contacter plusieurs cabinets un par un, vous remplissez une seule demande et vous
          pouvez recevoir plusieurs propositions afin de comparer les approches, les services et les
          conditions avant de choisir.
        </p>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { n: "1", t: "Décrivez votre besoin", d: "Indiquez votre projet, le type de financement recherché, le montant approximatif et l'état actuel de votre dossier." },
            { n: "2", t: "Recevez plusieurs propositions", d: "Des professionnels disponibles peuvent analyser votre demande et vous proposer un accompagnement adapté." },
            { n: "3", t: "Comparez et choisissez", d: "Comparez les propositions reçues et sélectionnez librement le professionnel qui correspond le mieux à votre situation." },
          ].map((s) => (
            <div key={s.n} className="rounded-xl bg-white border border-border p-6 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center font-heading font-bold">
                {s.n}
              </div>
              <p className="mt-4 font-heading font-semibold text-primary">{s.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <CtaButton label="after-3-etapes">Déposer ma demande gratuitement</CtaButton>
        </div>
      </Section>

      {/* BESOINS CONCERNÉS */}
      <Section bg="white">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Pour quels projets pouvez-vous préparer un dossier de financement ?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BESOINS.map((b) => (
            <div key={b.label} className="rounded-xl border border-border bg-white p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <b.icon className="h-4 w-4" />
              </div>
              <span className="text-sm text-foreground">{b.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          Chaque situation étant différente, un professionnel pourra vous aider à identifier les éléments
          les plus importants à présenter.
        </p>
      </Section>

      {/* AVANTAGES */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Pourquoi passer par Soumission Comptable ?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: FileCheck, t: "Une seule demande", d: "Vous évitez de contacter plusieurs professionnels séparément." },
            { icon: Scale, t: "Plusieurs propositions", d: "Vous pouvez comparer les approches avant de prendre une décision." },
            { icon: HandCoins, t: "Un accompagnement adapté", d: "Vous échangez avec des professionnels selon la nature et l'avancement de votre projet." },
            { icon: Shield, t: "Une demande gratuite", d: "Vous pouvez présenter votre besoin sans frais et sans engagement." },
            { icon: Clock, t: "Un gain de temps", d: "Vous simplifiez votre recherche de professionnels comptables." },
            { icon: LineChart, t: "Un choix éclairé", d: "Comparez les prix, les délais et le contenu des propositions avant de choisir." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl bg-white border border-border p-5 shadow-sm">
              <c.icon className="h-6 w-6 text-secondary" />
              <p className="mt-3 font-heading font-semibold text-primary">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* RÉASSURANCE */}
      <Section bg="white">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            "Demande gratuite",
            "Processus simple",
            "Plusieurs propositions",
            "Choix libre du professionnel",
            "Aucun engagement",
          ].map((t) => (
            <div key={t} className="rounded-lg border border-border bg-[#F8FAFC] p-3 text-center text-sm font-medium text-foreground">
              {t}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-muted-foreground max-w-2xl mx-auto">
          Soumission Comptable ne vous impose aucun cabinet. Vous restez libre de comparer les propositions
          et de choisir l'accompagnement qui vous convient.
        </p>
        <div className="mt-6 flex justify-center">
          <CtaButton label="before-faq">Recevoir des propositions gratuitement</CtaButton>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Questions fréquentes
        </h2>
        <div className="mt-8 max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-border bg-white p-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-foreground">
                <span>{f.q}</span>
                <span className="text-secondary shrink-0 transition-transform group-open:rotate-45 text-xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA FINAL */}
      <section className="bg-primary text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-16 text-center">
          <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">
            Votre projet mérite une présentation professionnelle
          </p>
          <h2 className="mt-3 font-heading font-bold text-2xl md:text-4xl">
            Préparez votre demande de financement avec le bon accompagnement
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto">
            Décrivez votre besoin et recevez plusieurs propositions de professionnels capables de vous
            accompagner dans le montage de votre dossier.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton variant="light" label="footer-cta">
              Recevoir des propositions gratuitement
            </CtaButton>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Gratuit. Sans engagement. Vous restez libre de comparer et de choisir.
          </p>
          <p className="mt-6 text-xs text-white/70 max-w-2xl mx-auto italic">
            Un dossier bien préparé ne garantit pas l'accord du financeur, mais il permet de présenter
            votre projet de manière plus claire, cohérente et crédible.
          </p>
        </div>
      </section>

      <LocalFooter />
      <MobileStickyCta />
    </div>
  );
}