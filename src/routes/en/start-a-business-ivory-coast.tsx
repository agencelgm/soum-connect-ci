import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead, faqSchema, howToSchema } from "@/lib/seo";
import { CreerEntreprisePage } from "../creer-son-entreprise-cote-divoire";

const TITLE =
  "Start a Business in Côte d'Ivoire in less than 30 days | SoumissionComptable.com";
const DESCRIPTION =
  "Register your company in Côte d'Ivoire in less than 30 days: RCCM, DFE, IDU, articles, CNPS. Compare 5 free quotes from CEPICI-approved firms within 48h.";

const HOWTO_STEPS = [
  { name: "Describe your project in 2 minutes", text: "Fill out the form: legal form, activity, city. No commitment." },
  { name: "Receive 5 quotes from CEPICI-approved firms", text: "Within 24–48h, up to 5 OECCA-CI approved firms send a detailed quote." },
  { name: "Pick and get your documents in 7–15 days", text: "Pick the firm that suits you. They handle RCCM, DFE, IDU, articles and CNPS." },
];

const FAQS = [
  { question: "How long does it take to register a company in Côte d'Ivoire?", answer: "With a CEPICI-approved firm, count 7 to 15 business days from a complete file to RCCM, DFE and IDU. The e-CEPICI procedure can be 24h for simple cases, but in practice all documents take 1 to 2 weeks." },
  { question: "What documents do I receive?", answer: "RCCM (trade register), DFE (tax existence declaration), IDU (unique identifier), articles of association, incorporation minutes, fiscal annex and CNPS certificate." },
  { question: "Which legal form should I choose?", answer: "SARL (min. capital XOF 100,000) suits most SMEs. SARLU is single-shareholder. SA (XOF 10M) is for larger structures. EI is a sole proprietorship with no capital but unlimited liability. GIE is for groupings." },
  { question: "Can I register a company from abroad?", answer: "Yes. Diaspora or any foreigner can register remotely through a local mandated firm. A power of attorney and legalised IDs are enough." },
  { question: "How much does it cost?", answer: "Firm fees usually range from XOF 75,000 (simple EI) to XOF 200,000 (SARL with full articles), plus official CEPICI/DGI fees." },
  { question: "What's the difference between RCCM, DFE and IDU?", answer: "RCCM is your trade register number. DFE is your tax existence declaration. IDU is the unique identifier consolidating administrative IDs. All three are mandatory." },
];

export const Route = createFileRoute("/en/start-a-business-ivory-coast")({
  head: () =>
    buildPageHead({
      path: "/en/start-a-business-ivory-coast",
      title: TITLE,
      description: DESCRIPTION,
      lang: "en",
      altPath: "/creer-son-entreprise-cote-divoire",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Start a business", path: "/en/start-a-business-ivory-coast" },
      ],
      extraSchemas: [
        howToSchema("How to register a company in Côte d'Ivoire in less than 30 days", HOWTO_STEPS, {
          description: "Turnkey procedure to register a SARL, SARLU, SA, EI or GIE in Côte d'Ivoire via a CEPICI-approved firm.",
          totalTime: "P30D",
          estimatedCost: { currency: "XOF", minValue: 75000, maxValue: 200000 },
        }),
        faqSchema(FAQS),
      ],
    }),
  component: CreerEntreprisePage,
});