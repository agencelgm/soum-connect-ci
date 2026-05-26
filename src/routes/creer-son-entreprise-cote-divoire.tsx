import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  FileText,
  ClipboardList,
  Building2,
  ShieldCheck,
  Clock,
  Award,
  Quote,
  Briefcase,
  Users,
  Globe2,
  Sparkles,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LeadFormCard } from "@/components/home/LeadFormCard";
import { buildPageHead, faqSchema, howToSchema } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import svcCreation from "@/assets/services/creation-entreprise.jpg";
import svcDiaspora from "@/assets/services/diaspora.jpg";
import seoEntrepreneurs from "@/assets/home/seo-entrepreneurs.jpg";
import seoOffice from "@/assets/home/seo-office-abidjan.jpg";

const META_TITLE_FR =
  "Créer son Entreprise en Côte d'Ivoire en moins de 30 jours | SoumissionComptable.com";
const META_DESC_FR =
  "Créez votre entreprise en Côte d'Ivoire en moins de 30 jours : RCCM, DFE, IDU, statuts, CNPS. Comparez 5 devis gratuits de cabinets agréés CEPICI sous 48h.";
const META_TITLE_EN =
  "Start a Business in Côte d'Ivoire in less than 30 days | SoumissionComptable.com";
const META_DESC_EN =
  "Register your company in Côte d'Ivoire in less than 30 days: RCCM, DFE, IDU, articles, CNPS. Compare 5 free quotes from CEPICI-approved firms within 48h.";

// Steps for HowTo schema (FR is the canonical content)
const HOWTO_STEPS = [
  {
    name: "Décrivez votre projet en 2 minutes",
    text: "Remplissez le formulaire en ligne : forme juridique souhaitée (SARL, SARLU, SA, EI, GIE), activité, ville. Aucun engagement.",
  },
  {
    name: "Recevez 5 devis de cabinets agréés CEPICI",
    text: "Sous 24 à 48 heures, jusqu'à 5 cabinets comptables agréés OECCA-CI vous transmettent leur devis détaillé : tarif, délai, documents inclus.",
  },
  {
    name: "Choisissez et obtenez vos documents en 7–15 jours",
    text: "Sélectionnez le cabinet qui vous convient. Il s'occupe de tout : RCCM, DFE, IDU, statuts, PV et déclaration CNPS.",
  },
];

const FAQS_FR = [
  {
    question: "Combien de temps pour créer son entreprise en Côte d'Ivoire ?",
    answer:
      "En passant par un cabinet agréé CEPICI, comptez 7 à 15 jours ouvrés entre le dépôt du dossier complet et la remise du RCCM, de la DFE et de l'IDU. La procédure officielle e-CEPICI peut aller jusqu'à 24h pour les cas simples, mais en pratique l'obtention de tous les documents prend 1 à 2 semaines.",
  },
  {
    question: "Quels documents reçoit-on à la création d'entreprise ?",
    answer:
      "Vous repartez avec : le RCCM (Registre du Commerce et du Crédit Mobilier), la DFE (Déclaration Fiscale d'Existence), l'IDU (Identifiant Unique), les statuts de la société, le procès-verbal de constitution, l'annexe fiscale et l'attestation CNPS.",
  },
  {
    question: "Quelle forme juridique choisir : SARL, SARLU, SA, EI ou GIE ?",
    answer:
      "La SARL (capital min. 100 000 FCFA) convient à la majorité des PME. La SARLU est la SARL à associé unique, idéale pour démarrer seul. La SA (10 millions FCFA) s'adresse aux grandes structures avec plusieurs actionnaires. L'EI (Entreprise Individuelle) n'a pas de capital minimum mais expose votre patrimoine personnel. Le GIE est réservé aux groupements de personnes ou d'entreprises.",
  },
  {
    question: "Peut-on créer son entreprise depuis l'étranger ?",
    answer:
      "Oui. La diaspora ivoirienne ou tout étranger peut créer une société en Côte d'Ivoire à distance via un cabinet mandaté localement. Une procuration et vos pièces d'identité légalisées suffisent. Le cabinet effectue toutes les démarches CEPICI pour vous.",
  },
  {
    question: "Combien coûte la création d'entreprise en Côte d'Ivoire ?",
    answer:
      "Les honoraires d'un cabinet pour une création clé en main vont en général de 75 000 FCFA (EI simple) à 200 000 FCFA (SARL avec statuts complets), auxquels s'ajoutent les frais officiels CEPICI/DGI. Les devis exacts vous sont transmis par les cabinets après comparaison.",
  },
  {
    question: "Quelle différence entre RCCM, DFE et IDU ?",
    answer:
      "Le RCCM est votre numéro au Registre du Commerce. La DFE est votre déclaration fiscale d'existence, qui vous identifie auprès de la DGI. L'IDU (Identifiant Unique) est le numéro qui regroupe vos identifications administratives. Les trois sont obligatoires pour exercer légalement et facturer.",
  },
];

const FAQS_EN = [
  {
    question: "How long does it take to register a company in Côte d'Ivoire?",
    answer:
      "Working with a CEPICI-approved firm, count 7 to 15 business days from a complete file to receiving your RCCM, DFE and IDU. The official e-CEPICI procedure can be as fast as 24h for simple cases, but in practice obtaining all documents takes 1 to 2 weeks.",
  },
  {
    question: "What documents do I receive when starting a business?",
    answer:
      "You walk away with: RCCM (trade register), DFE (tax existence declaration), IDU (unique identifier), articles of association, incorporation minutes, fiscal annex and CNPS certificate.",
  },
  {
    question: "Which legal form should I choose: SARL, SARLU, SA, EI or GIE?",
    answer:
      "SARL (min. capital XOF 100,000) suits most SMEs. SARLU is a single-shareholder SARL, ideal to start alone. SA (XOF 10M) is for larger structures with multiple shareholders. EI (sole proprietorship) requires no capital but exposes your personal assets. GIE is reserved for groupings of people or companies.",
  },
  {
    question: "Can I register a company from abroad?",
    answer:
      "Yes. The Ivorian diaspora or any foreigner can register a company in Côte d'Ivoire remotely through a local mandated firm. A power of attorney and your legalised IDs are enough. The firm handles all CEPICI procedures for you.",
  },
  {
    question: "How much does it cost to register a company in Côte d'Ivoire?",
    answer:
      "Firm fees for turnkey registration usually range from XOF 75,000 (simple EI) to XOF 200,000 (SARL with full articles), plus official CEPICI/DGI fees. Exact quotes are sent by the firms once you submit your request.",
  },
  {
    question: "What's the difference between RCCM, DFE and IDU?",
    answer:
      "RCCM is your trade register number. DFE is your tax existence declaration, identifying you to the tax office (DGI). IDU is the unique identifier consolidating your administrative IDs. All three are mandatory to operate legally and invoice clients.",
  },
];

export const Route = createFileRoute("/creer-son-entreprise-cote-divoire")({
  head: () =>
    buildPageHead({
      path: "/creer-son-entreprise-cote-divoire",
      title: META_TITLE_FR,
      description: META_DESC_FR,
      lang: "fr",
      altPath: "/en/start-a-business-ivory-coast",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Créer son entreprise", path: "/creer-son-entreprise-cote-divoire" },
      ],
      extraSchemas: [
        howToSchema(
          "Comment créer son entreprise en Côte d'Ivoire en moins de 30 jours",
          HOWTO_STEPS,
          {
            description:
              "Procédure clé en main pour créer une SARL, SARLU, SA, EI ou GIE en Côte d'Ivoire via un cabinet agréé CEPICI.",
            totalTime: "P30D",
            estimatedCost: { currency: "XOF", minValue: 75000, maxValue: 200000 },
          },
        ),
        faqSchema(FAQS_FR),
        {
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Création d'entreprise clé en main en Côte d'Ivoire",
          serviceType: "Company registration",
          areaServed: { "@type": "Country", name: "Côte d'Ivoire" },
          provider: {
            "@type": "Organization",
            name: "SoumissionComptable.com",
          },
          description:
            "Mise en relation avec un cabinet agréé CEPICI pour la création de votre entreprise (RCCM, DFE, IDU, statuts, CNPS) en 7 à 15 jours.",
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "XOF",
            lowPrice: "75000",
            highPrice: "200000",
          },
        },
      ],
    }),
  component: CreerEntreprisePage,
});

export function CreerEntreprisePage() {
  const { language } = useLanguage();
  const fr = language !== "en";

  const tx = fr
    ? {
        badge: "🇨🇮 CEPICI · OHADA · Cabinets agréés",
        h1: "Créez votre entreprise en Côte d'Ivoire en moins de 30 jours",
        sub: "RCCM, DFE, IDU, statuts, CNPS — tous les documents officiels. Comparez 5 devis gratuits de cabinets agréés CEPICI sous 48 h, choisissez le meilleur.",
        bullets: [
          "Démarches CEPICI 100 % prises en charge",
          "5 cabinets agréés OECCA-CI vous répondent",
          "Réponse sous 24–48 h, 100 % gratuit",
        ],
        formTitle: "Recevez 5 devis gratuits pour créer votre entreprise",
        formSub: "Remplissez le formulaire — un cabinet agréé vous contacte sous 48 h.",
        trustTitle: "Pourquoi passer par nous plutôt qu'un seul prestataire",
        trust: [
          {
            t: "Vous comparez 5 cabinets",
            d: "Au lieu d'accepter le premier prix vu sur Facebook, vous comparez jusqu'à 5 devis détaillés.",
          },
          {
            t: "Tous agréés OECCA-CI",
            d: "Nos cabinets partenaires sont enregistrés auprès de l'Ordre et accrédités CEPICI.",
          },
          {
            t: "Service 100 % gratuit",
            d: "Vous ne payez que le cabinet que vous choisissez. Notre mise en relation est gratuite.",
          },
          {
            t: "Réponse sous 48 h",
            d: "Pas d'attente : les cabinets vous appellent ou vous écrivent en moins de 2 jours ouvrés.",
          },
        ],
        whatYouGetTitle: "Ce que vous recevez à la fin de la procédure",
        whatYouGetSub:
          "Tous les documents officiels nécessaires pour exercer légalement et facturer dès le premier jour.",
        docs: [
          { t: "RCCM", d: "Registre du Commerce et du Crédit Mobilier — votre numéro d'entreprise officiel." },
          { t: "DFE", d: "Déclaration Fiscale d'Existence — votre identifiant auprès de la DGI." },
          { t: "IDU", d: "Identifiant Unique — numéro qui regroupe vos identifications administratives." },
          { t: "Statuts", d: "Statuts juridiques de la société, signés et enregistrés." },
          { t: "PV de constitution", d: "Procès-verbal officiel de constitution de votre société." },
          { t: "Annexe fiscale", d: "Annexe fiscale validée par la DGI." },
          { t: "Déclaration CNPS", d: "Inscription à la Caisse Nationale de Prévoyance Sociale." },
        ],
        formsTitle: "Formes juridiques disponibles en Côte d'Ivoire (OHADA)",
        formsSub:
          "Le cabinet vous aide à choisir la forme la plus adaptée à votre projet, votre fiscalité et vos associés.",
        forms: [
          {
            t: "SARL",
            cap: "Capital min. 100 000 FCFA",
            d: "La forme la plus courante pour les PME. Responsabilité limitée au capital. De 1 à 50 associés.",
          },
          {
            t: "SARLU",
            cap: "Capital min. 100 000 FCFA",
            d: "SARL à associé unique. Parfait pour démarrer seul tout en protégeant son patrimoine.",
          },
          {
            t: "SA",
            cap: "Capital min. 10 000 000 FCFA",
            d: "Pour les structures plus importantes, avec actionnaires multiples et conseil d'administration.",
          },
          {
            t: "EI",
            cap: "Aucun capital requis",
            d: "Entreprise Individuelle. Démarrage rapide, mais responsabilité illimitée du dirigeant.",
          },
          {
            t: "GIE",
            cap: "Pas de capital obligatoire",
            d: "Groupement d'Intérêt Économique : association d'entreprises ou de personnes autour d'un projet commun.",
          },
        ],
        costTitle: "Combien ça coûte, combien de temps ça prend ?",
        costRows: [
          { f: "EI (Entreprise Individuelle)", c: "≈ 75 000 – 120 000 FCFA", t: "7 à 10 jours ouvrés" },
          { f: "SARLU", c: "≈ 100 000 – 150 000 FCFA", t: "10 à 15 jours ouvrés" },
          { f: "SARL", c: "≈ 120 000 – 200 000 FCFA", t: "10 à 15 jours ouvrés" },
          { f: "SA", c: "Sur devis (dossier complexe)", t: "15 à 30 jours ouvrés" },
          { f: "GIE", c: "Sur devis", t: "10 à 20 jours ouvrés" },
        ],
        costNote:
          "Fourchettes indicatives, hors frais officiels CEPICI/DGI. Les devis exacts vous sont transmis par les cabinets après réception de votre demande.",
        diasporaTitle: "Vous êtes à l'étranger ? On gère tout à distance",
        diasporaText:
          "Que vous soyez en France, au Canada, aux USA ou ailleurs, vous pouvez créer votre société ivoirienne sans poser un pied à Abidjan. Le cabinet agit comme mandataire local, signe en votre nom et vous transmet vos documents par voie numérique.",
        diasporaCta: "Lire le guide diaspora →",
        stepsKicker: "Comment ça marche",
        stepsTitle: "Votre entreprise en 3 étapes",
        steps: HOWTO_STEPS.map((s) => ({ name: s.name, text: s.text })),
        testimonialsTitle: "Ils ont créé leur entreprise avec nos cabinets partenaires",
        testimonials: [
          {
            name: "Léa Goré",
            quote:
              "J'ai obtenu mon RCCM, ma DFE et mon IDU en 9 jours. Le cabinet a tout géré, je n'ai même pas eu à me déplacer au CEPICI.",
          },
          {
            name: "Maxime Doudou",
            quote:
              "J'ai comparé 4 devis en 48 h, choisi le meilleur rapport qualité-prix et lancé ma SARLU sans stress. Service vraiment gratuit.",
          },
          {
            name: "Vanessa Tehé",
            quote:
              "Depuis Paris, j'ai pu créer ma société à Abidjan à distance. Tous mes documents officiels en moins de 2 semaines.",
          },
        ],
        faqTitle: "Questions fréquentes sur la création d'entreprise",
        faqs: FAQS_FR,
        ctaTitle: "Prêt à créer votre entreprise ?",
        ctaSub: "Recevez 5 devis gratuits sous 48 h. Sans engagement.",
        ctaButton: "Obtenir mes 5 devis gratuits",
        related: "À lire aussi",
      }
    : {
        badge: "🇨🇮 CEPICI · OHADA · Approved firms",
        h1: "Register your business in Côte d'Ivoire in less than 30 days",
        sub: "RCCM, DFE, IDU, articles, CNPS — all official documents. Compare 5 free quotes from CEPICI-approved firms within 48h.",
        bullets: [
          "100% turnkey CEPICI procedures",
          "5 OECCA-CI approved firms reply",
          "Reply within 24–48h, 100% free",
        ],
        formTitle: "Get 5 free quotes to register your company",
        formSub: "Fill out the form — an approved firm contacts you within 48h.",
        trustTitle: "Why go through us rather than a single provider",
        trust: [
          {
            t: "You compare 5 firms",
            d: "Instead of accepting the first price you see on Facebook, you compare up to 5 detailed quotes.",
          },
          {
            t: "All OECCA-CI approved",
            d: "Our partner firms are registered with the Order and CEPICI-accredited.",
          },
          {
            t: "100% free service",
            d: "You only pay the firm you pick. Our matching service is free.",
          },
          {
            t: "Reply within 48h",
            d: "No wait: firms call or email you within 2 business days.",
          },
        ],
        whatYouGetTitle: "What you receive at the end of the process",
        whatYouGetSub:
          "All the official documents needed to operate legally and invoice from day one.",
        docs: [
          { t: "RCCM", d: "Trade Register — your official company number." },
          { t: "DFE", d: "Tax Existence Declaration — your ID with the tax office." },
          { t: "IDU", d: "Unique Identifier — consolidating your administrative IDs." },
          { t: "Articles", d: "Signed and filed articles of association." },
          { t: "Incorporation minutes", d: "Official minutes of your company's incorporation." },
          { t: "Fiscal annex", d: "Fiscal annex validated by the tax office." },
          { t: "CNPS registration", d: "Registration with the national social security fund." },
        ],
        formsTitle: "Legal forms available in Côte d'Ivoire (OHADA)",
        formsSub: "The firm helps you pick the form that best fits your project, taxes and partners.",
        forms: [
          { t: "SARL", cap: "Min. capital XOF 100,000", d: "The most common form for SMEs. Liability limited to capital. 1 to 50 partners." },
          { t: "SARLU", cap: "Min. capital XOF 100,000", d: "Single-shareholder SARL. Perfect to start alone while protecting your assets." },
          { t: "SA", cap: "Min. capital XOF 10,000,000", d: "For larger structures, with multiple shareholders and a board." },
          { t: "EI", cap: "No capital required", d: "Sole proprietorship. Fast to set up, but unlimited owner liability." },
          { t: "GIE", cap: "No mandatory capital", d: "Economic Interest Grouping: companies or people joining around a shared project." },
        ],
        costTitle: "How much, how long?",
        costRows: [
          { f: "EI (sole proprietorship)", c: "≈ XOF 75,000 – 120,000", t: "7 to 10 business days" },
          { f: "SARLU", c: "≈ XOF 100,000 – 150,000", t: "10 to 15 business days" },
          { f: "SARL", c: "≈ XOF 120,000 – 200,000", t: "10 to 15 business days" },
          { f: "SA", c: "On quote (complex file)", t: "15 to 30 business days" },
          { f: "GIE", c: "On quote", t: "10 to 20 business days" },
        ],
        costNote:
          "Indicative ranges, excluding official CEPICI/DGI fees. Exact quotes are sent by the firms after receiving your request.",
        diasporaTitle: "Living abroad? We handle everything remotely",
        diasporaText:
          "Whether you're in France, Canada, the USA or elsewhere, you can register your Ivorian company without setting foot in Abidjan. The firm acts as a local agent, signs on your behalf and sends your documents digitally.",
        diasporaCta: "Read the diaspora guide →",
        stepsKicker: "How it works",
        stepsTitle: "Your company in 3 steps",
        steps: [
          { name: "Describe your project in 2 minutes", text: "Fill out the form: legal form, activity, city. No commitment." },
          { name: "Receive 5 quotes from CEPICI-approved firms", text: "Within 24–48h, up to 5 OECCA-CI approved firms send you a detailed quote: price, lead time, included documents." },
          { name: "Pick and get your documents in 7–15 days", text: "Pick the firm that suits you. They handle everything: RCCM, DFE, IDU, articles, minutes and CNPS." },
        ],
        testimonialsTitle: "They started their company with our partner firms",
        testimonials: [
          { name: "Léa Goré", quote: "I got my RCCM, DFE and IDU in 9 days. The firm handled everything, I didn't even have to go to CEPICI." },
          { name: "Maxime Doudou", quote: "I compared 4 quotes in 48h, picked the best value and launched my SARLU stress-free. Truly free service." },
          { name: "Vanessa Tehé", quote: "From Paris I could register my company in Abidjan remotely. All official documents in less than 2 weeks." },
        ],
        faqTitle: "Frequently asked questions about company registration",
        faqs: FAQS_EN,
        ctaTitle: "Ready to register your business?",
        ctaSub: "Get 5 free quotes within 48h. No commitment.",
        ctaButton: "Get my 5 free quotes",
        related: "Read also",
      };

  const TRUST_ICONS = [Users, ShieldCheck, Award, Clock];
  const DOC_ICONS = [
    FileText, FileText, FileText, ClipboardList, ClipboardList,
    FileText, ShieldCheck,
  ];

  return (
    <>
      {/* ============== HERO ============== */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden">
        <img
          src={seoOffice}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover blur-md scale-110"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-[#F5F1EA]/80" />

        <div className="relative container-app pt-10 md:pt-16 pb-10 md:pb-16 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {tx.badge}
            </span>
            <h1
              id="hero-title"
              className="mt-3 font-heading text-3xl md:text-4xl xl:text-5xl font-bold text-primary leading-tight"
            >
              {tx.h1}
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl">
              {tx.sub}
            </p>

            <ul className="mt-5 space-y-2">
              {tx.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm md:text-base text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {/* Documents pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["RCCM", "DFE", "IDU", "Statuts", "PV", "CNPS"].map((doc) => (
                <span
                  key={doc}
                  className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                  {doc}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-secondary p-5 md:p-6 shadow-2xl text-white">
              <h2 className="font-heading text-lg md:text-xl font-bold uppercase leading-tight">
                {tx.formTitle}
              </h2>
              <p className="mt-1 text-sm text-white/90">{tx.formSub}</p>
              <div className="mt-4">
                <LeadFormCard source="page-creer-son-entreprise" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TRUST ============== */}
      <section aria-labelledby="trust-title" className="bg-white border-y border-border">
        <div className="container-app py-10 md:py-14">
          <h2 id="trust-title" className="text-center font-heading text-2xl md:text-3xl font-bold text-primary">
            {tx.trustTitle}
          </h2>
          <div className="mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tx.trust.map((item, i) => {
              const Icon = TRUST_ICONS[i];
              return (
                <div
                  key={i}
                  className="flex flex-row items-start text-left gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-0 rounded-xl bg-[#F8FAFC] p-5 border border-border"
                >
                  <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0 sm:mb-3">
                    <Icon className="h-5 w-5 sm:h-7 sm:w-7" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary text-base">{item.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{item.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== STEPS ============== */}
      <section aria-labelledby="steps-title" className="bg-[#F8FAFC]">
        <div className="container-app section">
          <div className="text-center max-w-3xl mx-auto">
            <p className="font-semibold text-muted-foreground uppercase tracking-wide text-sm">
              {tx.stepsKicker}
            </p>
            <h2 id="steps-title" className="mt-2 font-heading text-3xl md:text-4xl font-bold text-primary">
              {tx.stepsTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {tx.steps.map((s, i) => (
              <article key={i} className="text-center">
                <div className="relative mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-primary to-[#1a2f5a] flex items-center justify-center">
                  <span className="font-heading text-5xl font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="mt-5 font-heading font-bold text-primary text-lg">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed px-2">{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== WHAT YOU GET ============== */}
      <section aria-labelledby="what-title" className="bg-white">
        <div className="container-app section">
          <div className="text-center max-w-3xl mx-auto">
            <h2 id="what-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              {tx.whatYouGetTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{tx.whatYouGetSub}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tx.docs.map((doc, i) => {
              const Icon = DOC_ICONS[i] ?? FileText;
              return (
                <article
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary shrink-0">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary">{doc.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{doc.d}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== LEGAL FORMS ============== */}
      <section aria-labelledby="forms-title" className="bg-[#F8FAFC]">
        <div className="container-app section">
          <div className="text-center max-w-3xl mx-auto">
            <h2 id="forms-title" className="font-heading text-3xl md:text-4xl font-bold text-primary">
              {tx.formsTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{tx.formsSub}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tx.forms.map((f, i) => (
              <article key={i} className="rounded-xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
                    <Building2 className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading text-xl font-bold text-primary">{f.t}</p>
                    <p className="text-xs text-muted-foreground">{f.cap}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground leading-relaxed">{f.d}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {fr
              ? "Formes conformes à l'Acte Uniforme OHADA applicable en Côte d'Ivoire."
              : "Forms compliant with the OHADA Uniform Act applicable in Côte d'Ivoire."}
          </p>
        </div>
      </section>

      {/* ============== COST / TIME ============== */}
      <section aria-labelledby="cost-title" className="bg-white">
        <div className="container-app section max-w-4xl">
          <h2 id="cost-title" className="font-heading text-3xl md:text-4xl font-bold text-primary text-center">
            {tx.costTitle}
          </h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] text-primary">
                <tr>
                  <th className="text-left p-4 font-semibold">{fr ? "Forme" : "Form"}</th>
                  <th className="text-left p-4 font-semibold">{fr ? "Honoraires cabinet" : "Firm fees"}</th>
                  <th className="text-left p-4 font-semibold">{fr ? "Délai" : "Lead time"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tx.costRows.map((r, i) => (
                  <tr key={i}>
                    <td className="p-4 font-semibold text-primary">{r.f}</td>
                    <td className="p-4 text-foreground">{r.c}</td>
                    <td className="p-4 text-muted-foreground">{r.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground text-center italic">{tx.costNote}</p>
        </div>
      </section>

      {/* ============== DIASPORA ============== */}
      <section aria-labelledby="diaspora-title" className="bg-[#F8FAFC]">
        <div className="container-app section grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
              {fr ? "Diaspora" : "Diaspora"}
            </span>
            <h2 id="diaspora-title" className="mt-3 font-heading text-3xl font-bold text-primary">
              {tx.diasporaTitle}
            </h2>
            <p className="mt-4 text-foreground leading-relaxed">{tx.diasporaText}</p>
            <Link
              to={fr ? "/creation-entreprise-diaspora-ivoirienne" : "/creation-entreprise-diaspora-ivoirienne"}
              className="mt-5 inline-flex items-center gap-1 font-semibold text-secondary hover:underline"
            >
              {tx.diasporaCta}
            </Link>
          </div>
          <div>
            <img
              src={svcDiaspora}
              alt={fr ? "Créer son entreprise depuis l'étranger" : "Register your company from abroad"}
              loading="lazy"
              width={800}
              height={600}
              className="w-full h-auto rounded-xl shadow-md object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section aria-labelledby="testi-title" className="bg-white">
        <div className="container-app section">
          <h2 id="testi-title" className="text-center font-heading text-3xl md:text-4xl font-bold text-primary">
            {tx.testimonialsTitle}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {tx.testimonials.map((tt, i) => (
              <figure key={i} className="text-center px-4">
                <Quote className="mx-auto h-8 w-8 text-secondary" aria-hidden="true" />
                <blockquote className="mt-4 text-sm md:text-base text-muted-foreground italic leading-relaxed">
                  "{tt.quote}"
                </blockquote>
                <figcaption className="mt-3 font-bold text-primary">{tt.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section aria-labelledby="faq-title" className="bg-[#F8FAFC]">
        <div className="container-app section max-w-3xl">
          <h2 id="faq-title" className="text-center font-heading text-3xl md:text-4xl font-bold text-primary">
            {tx.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {tx.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-semibold text-primary">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground leading-relaxed">
                  {f.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section aria-label="CTA" className="bg-primary text-white">
        <div className="container-app py-12 md:py-16 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">{tx.ctaTitle}</h2>
          <p className="mt-3 text-white/85">{tx.ctaSub}</p>
          <a
            href="#hero-title"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-secondary px-6 py-3 font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            <Briefcase className="h-5 w-5" aria-hidden="true" />
            {tx.ctaButton}
          </a>
        </div>
      </section>

      {/* Related links */}
      <section aria-label="Related" className="bg-white border-t border-border">
        <div className="container-app py-10">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {tx.related}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/creation-entreprise-cote-divoire" className="text-secondary hover:underline">
              {fr ? "Guide complet création d'entreprise CI" : "Full company registration guide"}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/creation-entreprise-diaspora-ivoirienne" className="text-secondary hover:underline">
              {fr ? "Création depuis la diaspora" : "Registration from the diaspora"}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/cabinet-comptable-abidjan" className="text-secondary hover:underline">
              {fr ? "Cabinets comptables à Abidjan" : "Accounting firms in Abidjan"}
            </Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/guides" className="text-secondary hover:underline">
              {fr ? "Tous les guides" : "All guides"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}