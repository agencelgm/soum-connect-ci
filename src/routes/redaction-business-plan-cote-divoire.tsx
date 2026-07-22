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
} from "lucide-react";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";
import { BusinessPlanLeadForm } from "@/components/business-plan/BusinessPlanLeadForm";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Business plan Côte d'Ivoire | Comparez 5 offres";
const DESCRIPTION =
  "Besoin d'un business plan professionnel ? Recevez jusqu'à 5 propositions de cabinets en Côte d'Ivoire. Gratuit, sans engagement, réponse sous 48h.";

export const Route = createFileRoute("/redaction-business-plan-cote-divoire")({
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
        trackEvent("cta_click", { label });
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
            trackEvent("cta_click", { label: "header" });
            scrollToForm();
          }}
          className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm md:text-base font-semibold hover:bg-secondary-dark transition"
        >
          Recevoir mes soumissions
        </button>
      </div>
    </header>
  );
}

function LocalFooter() {
  return (
    <footer className="bg-primary text-white/90 text-sm">
      <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} SoumissionComptable.com — Plateforme de mise en relation.</p>
        <p className="text-white/70">Gratuit · Sans engagement · Confidentiel</p>
      </div>
    </footer>
  );
}

function MobileStickyCta() {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.15)] p-3">
      <button
        onClick={() => {
          trackEvent("cta_click", { label: "mobile-sticky" });
          scrollToForm();
        }}
        className="w-full min-h-12 rounded-lg bg-secondary text-white font-semibold hover:bg-secondary-dark transition"
      >
        Recevoir mes propositions
      </button>
    </div>
  );
}

const FAQ_ITEMS: Array<{ q: string; a: string }> = [
  {
    q: "Soumission Comptable rédige-t-il directement mon business plan ?",
    a: "Non. Soumission Comptable est une plateforme de mise en relation. Votre demande est transmise à des professionnels susceptibles de vous accompagner dans la rédaction de votre business plan.",
  },
  {
    q: "La demande de propositions est-elle gratuite ?",
    a: "Oui, la demande de soumissions est gratuite et sans engagement. Vous restez libre de comparer les propositions et de choisir ou non un prestataire.",
  },
  {
    q: "Combien de propositions puis-je recevoir ?",
    a: "Selon votre besoin et la disponibilité des professionnels, vous pouvez recevoir jusqu'à 5 propositions.",
  },
  {
    q: "En combien de temps vais-je recevoir une réponse ?",
    a: "Les premières réponses peuvent généralement être transmises sous 48 heures. Le délai peut varier selon la complexité du projet et la disponibilité des professionnels.",
  },
  {
    q: "Combien coûte la rédaction d'un business plan ?",
    a: "Le prix dépend du niveau de complexité du projet, du contenu demandé, de la profondeur de l'étude de marché, des prévisions financières et du délai de réalisation. Comparer plusieurs propositions vous permet de mieux évaluer les offres disponibles.",
  },
  {
    q: "Puis-je demander un business plan pour une banque ?",
    a: "Oui. Précisez dans votre demande que le document est destiné à une banque afin que les professionnels puissent adapter leur proposition à cet objectif. Aucun financement ne peut toutefois être garanti.",
  },
  {
    q: "Puis-je faire une demande depuis l'étranger ?",
    a: "Oui. Les membres de la diaspora qui souhaitent créer une entreprise ou investir en Côte d'Ivoire peuvent également effectuer une demande en ligne.",
  },
  {
    q: "Quelles informations dois-je fournir ?",
    a: "Il est utile de fournir une description du projet, le secteur d'activité, les produits ou services proposés, le public visé, les ressources disponibles, les investissements prévus et l'objectif du business plan.",
  },
  {
    q: "Suis-je obligé de choisir l'une des propositions ?",
    a: "Non. La comparaison est sans engagement. Vous restez entièrement libre de donner suite ou non aux propositions reçues.",
  },
];

function Page() {
  useEffect(() => {
    trackEvent("landing_page_view", { page: "business_plan" });
  }, []);

  return (
    <div className="bg-white">
      <LocalHeader />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#F1F5FF] to-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-16 grid lg:grid-cols-[1.05fr_1fr] gap-10 items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Rédaction de business plan en Côte d'Ivoire
            </span>
            <h1 className="mt-4 font-heading font-bold text-primary text-3xl md:text-4xl lg:text-5xl leading-tight">
              Vous cherchez une entreprise pour rédiger votre business plan ?
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Décrivez votre projet et recevez jusqu'à 5 propositions de professionnels capables de vous
              accompagner dans la rédaction d'un business plan clair, structuré et adapté à vos objectifs.
            </p>
            <ul className="mt-5 space-y-2 text-sm md:text-base text-foreground">
              {["Demande gratuite", "Sans engagement", "Réponse sous 48 heures"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <CtaButton label="hero-primary">Recevoir mes propositions</CtaButton>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Comparez les offres avant de choisir votre prestataire.
            </p>
          </div>

          <BusinessPlanLeadForm />
        </div>
      </section>

      {/* BANDEAU RÉASSURANCE */}
      <div className="bg-primary text-white">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm md:text-base">
          {[
            { icon: Users, label: "Jusqu'à 5 propositions" },
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
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Une bonne idée ne suffit pas toujours pour convaincre
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
          Vous pouvez avoir une idée prometteuse, connaître votre activité et être motivé à lancer votre
          projet. Mais sans un document clair, il peut être difficile d'expliquer comment votre entreprise
          fonctionnera, comment elle générera des revenus et de combien vous avez réellement besoin pour
          démarrer.
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Structurer le projet", d: "Transformer une idée en un projet compréhensible, logique et professionnel." },
            { t: "Construire les prévisions", d: "Estimer les ventes, les charges, les investissements et les besoins de trésorerie." },
            { t: "Présenter le marché", d: "Identifier les clients, les concurrents, les opportunités et le positionnement de l'entreprise." },
            { t: "Convaincre des partenaires", d: "Présenter un dossier cohérent à une banque, un investisseur ou un partenaire." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <p className="font-heading font-semibold text-primary">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AGITATION */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Un business plan improvisé peut fragiliser votre dossier
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
          Copier un modèle trouvé sur Internet ou préparer des chiffres sans méthode peut donner une image
          incomplète de votre projet.
        </p>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {[
            "Des prévisions financières difficiles à justifier",
            "Un besoin de financement mal évalué",
            "Une étude de marché trop générale",
            "Une présentation qui ne répond pas aux attentes du destinataire",
            "Des dépenses importantes oubliées",
            "Un modèle économique difficile à comprendre",
            "Un document peu adapté au contexte ivoirien",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-lg bg-white border border-border p-3 text-sm">
              <span className="mt-1 h-2 w-2 rounded-full bg-secondary shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-primary font-medium">
          Votre projet mérite un document construit autour de votre réalité, de votre secteur et de vos
          objectifs.
        </p>
      </Section>

      {/* SOLUTION */}
      <Section bg="white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
            Trouvez un professionnel adapté à votre projet
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Avec Soumission Comptable, vous n'avez pas besoin de contacter plusieurs prestataires un par un.
            Vous remplissez une seule demande, votre besoin est transmis à des professionnels pertinents et
            vous pouvez comparer les propositions reçues avant de prendre une décision.
          </p>
          <div className="mt-6 flex justify-center">
            <CtaButton label="solution">Décrire mon projet</CtaButton>
          </div>
        </div>
      </Section>

      {/* 3 ÉTAPES */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Comment recevoir vos propositions ?
        </h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {[
            { n: "1", t: "Décrivez votre projet", d: "Indiquez votre secteur, l'objectif du business plan, l'état d'avancement du projet et le délai souhaité." },
            { n: "2", t: "Recevez des propositions", d: "Des professionnels correspondant à votre besoin peuvent vous transmettre une proposition adaptée." },
            { n: "3", t: "Comparez et choisissez", d: "Comparez les prestations, les prix, les délais et le niveau d'accompagnement avant de sélectionner votre prestataire." },
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
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous restez libre d'accepter ou de refuser les propositions reçues.
        </p>
      </Section>

      {/* CONTENU DU BP */}
      <Section bg="white">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Que peut contenir votre business plan ?
        </h2>
        <p className="mt-3 text-center text-muted-foreground">
          Le contenu exact dépend de votre projet et de l'offre du professionnel choisi.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            "Résumé exécutif",
            "Présentation du porteur de projet",
            "Description de l'entreprise",
            "Analyse du marché",
            "Analyse de la concurrence",
            "Stratégie commerciale et marketing",
            "Modèle économique",
            "Plan opérationnel",
            "Prévisions de chiffre d'affaires",
            "Estimation des charges",
            "Plan de financement",
            "Plan de trésorerie",
            "Seuil de rentabilité",
            "Analyse des risques",
          ].map((c) => (
            <div key={c} className="rounded-lg border border-border bg-white p-3 text-sm flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <span>{c}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          Les éléments inclus peuvent varier selon le professionnel, la formule choisie et les besoins du
          projet. Vérifiez toujours le détail de chaque proposition avant de faire votre choix.
        </p>
      </Section>

      {/* PROFILS */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Cette solution est-elle adaptée à votre situation ?
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "Porteur de projet", d: "Vous avez une idée et souhaitez vérifier sa faisabilité avant de vous lancer." },
            { t: "Entrepreneur en création", d: "Vous préparez le lancement de votre entreprise et avez besoin d'un document structuré." },
            { t: "Dirigeant de PME", d: "Vous souhaitez lancer une nouvelle activité, ouvrir une agence ou développer votre entreprise." },
            { t: "Demandeur de financement", d: "Vous devez présenter votre projet à une banque, une institution ou un programme d'accompagnement." },
            { t: "Startup", d: "Vous recherchez des investisseurs ou souhaitez clarifier votre modèle économique." },
            { t: "Diaspora", d: "Vous préparez un investissement ou une création d'entreprise en Côte d'Ivoire depuis l'étranger." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl bg-white border border-border p-5 shadow-sm">
              <p className="font-heading font-semibold text-primary">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* COMPARER */}
      <Section bg="white">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Pourquoi comparer avant de choisir ?
        </h2>
        <p className="mt-4 text-center text-muted-foreground max-w-3xl mx-auto">
          Tous les prestataires ne proposent pas le même niveau d'accompagnement, les mêmes délais ou la
          même profondeur d'analyse. Comparer plusieurs offres vous aide à mieux comprendre ce que vous
          allez recevoir.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Scale, t: "Comparer les prix", d: "Identifiez une proposition cohérente avec votre budget." },
            { icon: CheckCircle2, t: "Comparer les livrables", d: "Vérifiez les sections, analyses et prévisions incluses." },
            { icon: Clock, t: "Comparer les délais", d: "Choisissez un prestataire capable de respecter votre calendrier." },
            { icon: Users, t: "Comparer l'accompagnement", d: "Vérifiez le nombre d'échanges, de corrections ou de séances de travail prévues." },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-white p-5 shadow-sm">
              <c.icon className="h-6 w-6 text-secondary" />
              <p className="mt-3 font-heading font-semibold text-primary">{c.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* QUESTIONS À POSER */}
      <Section bg="muted">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Avant de choisir un prestataire, posez les bonnes questions
        </h2>
        <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {[
            "Le prestataire connaît-il mon secteur d'activité ?",
            "L'étude de marché est-elle incluse ?",
            "Les prévisions financières sont-elles personnalisées ?",
            "Combien de modifications sont incluses ?",
            "Le document sera-t-il adapté à une banque ou à un investisseur ?",
            "Quel est le délai de réalisation ?",
            "Quels documents dois-je fournir ?",
            "Aurai-je une version modifiable du business plan ?",
            "Une présentation orale ou un pitch deck est-il inclus ?",
            "Le prestataire m'aidera-t-il à comprendre les chiffres ?",
          ].map((q) => (
            <li key={q} className="rounded-lg bg-white border border-border p-3 text-sm flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* CONFIANCE */}
      <Section bg="white">
        <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl text-center">
          Une demande simple, gratuite et sans engagement
        </h2>
        <ul className="mt-8 max-w-2xl mx-auto space-y-3">
          {[
            "Vos informations sont utilisées pour traiter votre demande",
            "Vous comparez librement les propositions",
            "Vous n'êtes pas obligé de choisir un prestataire",
            "Vous gardez le contrôle de votre décision",
            "La demande peut être réalisée depuis Abidjan, l'intérieur du pays ou l'étranger",
          ].map((t) => (
            <li key={t} className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <span className="text-sm md:text-base text-foreground">{t}</span>
            </li>
          ))}
        </ul>
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
          <h2 className="font-heading font-bold text-2xl md:text-4xl">
            Prêt à trouver un professionnel pour rédiger votre business plan ?
          </h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto">
            Décrivez votre projet, recevez plusieurs propositions et choisissez l'offre qui correspond le
            mieux à vos besoins.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaButton variant="light" label="footer-cta">
              Recevoir mes soumissions gratuitement
            </CtaButton>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Gratuit • Sans engagement • Jusqu'à 5 propositions
          </p>
        </div>
      </section>

      <LocalFooter />
      <MobileStickyCta />
    </div>
  );
}