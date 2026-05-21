import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildPageHead, faqSchema } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

type FaqItem = { question: string; answer: string };
type FaqCategory = { id: string; title: string; items: FaqItem[] };

const categories: FaqCategory[] = [
  {
    id: "plateforme",
    title: "À Propos de SoumissionsComptables.ci",
    items: [
      {
        question: "Est-ce vraiment gratuit pour moi ?",
        answer:
          "Oui, totalement. SoumissionsComptables.ci est 100% gratuit pour les entrepreneurs et particuliers qui cherchent un cabinet. Les cabinets comptables partenaires financent la plateforme en accédant aux demandes qualifiées.",
      },
      {
        question: "Comment SoumissionsComptables.ci vérifie-t-il les cabinets ?",
        answer:
          "Tous nos cabinets partenaires doivent être inscrits à l'Ordre des Experts-Comptables de Côte d'Ivoire (OECCA-CI). Nous vérifions leur agrément avant tout partenariat, ainsi que leur expérience et leurs références clients.",
      },
      {
        question: "Combien de soumissions vais-je recevoir ?",
        answer:
          "Vous pouvez recevoir jusqu'à 5 soumissions de cabinets différents. La quantité exacte dépend du type de service demandé et de votre localisation en Côte d'Ivoire.",
      },
      {
        question: "Combien de temps prend le processus ?",
        answer:
          "Le formulaire prend environ 2 minutes à remplir. Vous recevez ensuite vos premières soumissions de cabinets sous 48h ouvrées, généralement dans les 24 premières heures.",
      },
    ],
  },
  {
    id: "cabinets",
    title: "Cabinets Comptables en Côte d'Ivoire",
    items: [
      {
        question: "Quelle est la différence entre un expert-comptable et un comptable ?",
        answer:
          "Un expert-comptable est un professionnel agréé par l'OECCA-CI, autorisé à certifier les comptes, établir les bilans et représenter l'entreprise devant la DGI. Un comptable, lui, tient les écritures au quotidien mais ne peut pas certifier les états financiers. Pour une SARL ou une SA, le recours à un expert-comptable est fortement recommandé.",
      },
      {
        question: "Combien coûte un cabinet comptable à Abidjan ?",
        answer:
          "Les tarifs varient de 50 000 FCFA/mois pour la tenue comptable d'une TPE à plus de 500 000 FCFA/mois pour une PME avec audit, fiscalité et conseil. Comptez 150 000 à 300 000 FCFA/mois en moyenne pour une SARL active.",
      },
      {
        question: "Est-il obligatoire d'avoir un comptable pour sa SARL en CI ?",
        answer:
          "Toute SARL doit tenir une comptabilité conforme au SYSCOHADA et déposer une DSF annuelle. L'intervention d'un expert-comptable inscrit à l'OECCA-CI devient obligatoire dès que l'entreprise dépasse certains seuils de chiffre d'affaires ou d'effectif, et pour la certification des comptes.",
      },
      {
        question: "Comment choisir un bon cabinet comptable en CI ?",
        answer:
          "Cinq critères clés : (1) agrément OECCA-CI vérifiable, (2) spécialisation sectorielle adaptée à votre activité, (3) grille tarifaire claire et écrite, (4) localisation proche de votre siège (Plateau, Cocody, Marcory…), (5) références clients vérifiables.",
      },
      {
        question: "Puis-je changer de cabinet comptable en cours d'année ?",
        answer:
          "Oui. Il suffit de notifier votre cabinet actuel par écrit, de récupérer l'intégralité de vos pièces comptables et le grand livre, puis de transmettre le dossier au nouveau cabinet. Le mieux est de planifier le transfert en fin de trimestre pour éviter les ruptures.",
      },
    ],
  },
  {
    id: "creation",
    title: "Création d'Entreprise et CEPICI",
    items: [
      {
        question: "Comment créer une entreprise en Côte d'Ivoire ?",
        answer:
          "Cinq étapes : (1) choisir la forme juridique (SARL, SARLU, SA, EI), (2) rédiger les statuts, (3) déposer le capital en banque, (4) déposer le dossier au CEPICI (en ligne ou guichet unique), (5) récupérer le RCCM, le DFE et l'immatriculation CNPS.",
      },
      {
        question: "Quelle est la différence entre SARL et SA en CI ?",
        answer:
          "La SARL convient aux PME : capital minimum 100 000 FCFA, 1 à 50 associés, gérance simple. La SA s'adresse aux grandes structures : capital minimum 10 000 000 FCFA, conseil d'administration obligatoire, commissaire aux comptes obligatoire, et possibilité d'appel public à l'épargne.",
      },
      {
        question: "Quel est le capital minimum pour une SARL au CEPICI ?",
        answer:
          "100 000 FCFA selon l'Acte Uniforme OHADA révisé. Ce capital peut être libéré intégralement à la constitution ou pour moitié seulement, le solde devant être libéré dans les deux ans.",
      },
      {
        question: "Peut-on créer une entreprise en CI depuis l'étranger (diaspora) ?",
        answer:
          "Oui. La diaspora peut créer une société en CI sans se déplacer, en passant par un mandataire (avocat, expert-comptable, cabinet partenaire) muni d'une procuration légalisée. Le CEPICI accepte les dossiers déposés par mandataire.",
      },
      {
        question: "Combien de temps prend la création via CEPICI ?",
        answer:
          "Officiellement 24 à 48h pour le guichet unique CEPICI. En pratique, comptez 3 à 7 jours ouvrés pour disposer de l'ensemble des documents (RCCM, DFE, immatriculation CNPS) prêts à l'usage.",
      },
      {
        question: "Quels documents faut-il pour créer une SARL au CEPICI ?",
        answer:
          "Pièces standards : copie CNI ou passeport des associés, extrait d'acte de naissance, extrait de casier judiciaire (moins de 3 mois), justificatif de domicile, statuts signés, attestation de dépôt de capital, contrat de bail ou attestation de domiciliation du siège social.",
      },
    ],
  },
  {
    id: "fiscalite",
    title: "Comptabilité et Fiscalité",
    items: [
      {
        question: "Quand doit-on déposer la DSF (Déclaration de Situation Fiscale) en CI ?",
        answer:
          "La DSF doit être déposée au plus tard le 30 mai de chaque année auprès de la DGI, pour l'exercice clos au 31 décembre précédent. Le dépôt tardif entraîne une pénalité de 200 000 FCFA, majorée en cas de récidive.",
      },
      {
        question: "Quels sont les principaux impôts d'une entreprise en CI ?",
        answer:
          "Les principaux : Impôt sur les Sociétés (IS) à 25%, TVA à 18%, Impôt sur les Traitements et Salaires (ITS), cotisations CNPS (employeur + salarié), patente (TPS), contribution des patentes pour les BIC.",
      },
      {
        question: "La TVA est-elle obligatoire pour toutes les entreprises en CI ?",
        answer:
          "Non. La TVA s'applique aux entreprises dont le chiffre d'affaires annuel dépasse 200 millions FCFA pour les ventes de biens et 100 millions FCFA pour les prestations de services. En dessous, l'entreprise relève d'un régime simplifié.",
      },
      {
        question: "Que se passe-t-il si je ne fais pas ma déclaration fiscale en CI ?",
        answer:
          "La DGI applique des pénalités : 10% à 100% de majoration sur les droits dus, intérêts de retard à 1% par mois, taxation d'office sur bases reconstituées, et risque de redressement avec sanctions pénales en cas de fraude caractérisée.",
      },
    ],
  },
  {
    id: "diaspora",
    title: "Diaspora et Expatriés",
    items: [
      {
        question: "Je suis en France, puis-je créer une entreprise en CI à distance ?",
        answer:
          "Oui. Vous pouvez déposer votre dossier en ligne via le portail CEPICI ou mandater un cabinet partenaire en Côte d'Ivoire pour gérer l'intégralité des démarches (statuts, dépôt de capital, RCCM, DFE) en votre nom.",
      },
      {
        question: "Ai-je besoin d'être physiquement en CI pour créer ma société ?",
        answer:
          "Non. Avec une procuration légalisée auprès d'un consulat ivoirien (ou apostillée), un mandataire local peut signer les statuts, déposer le capital et accomplir toutes les formalités CEPICI sans votre présence physique.",
      },
      {
        question: "Un expatrié peut-il créer une entreprise en CI ?",
        answer:
          "Oui. La législation ivoirienne autorise les ressortissants étrangers à créer une société (SARL, SA…) avec 100% de capital étranger, sous réserve de respecter les règles d'investissement et, pour certains secteurs réglementés, d'obtenir une autorisation préalable.",
      },
    ],
  },
];

const ALL_FAQS = categories.flatMap((c) => c.items);

export const Route = createFileRoute("/faq")({
  head: () =>
    buildPageHead({
      path: "/faq",
      title:
        "FAQ — Questions sur les Cabinets Comptables en CI | SoumissionsComptables.ci",
      description:
        "Toutes vos questions sur les cabinets comptables en Côte d'Ivoire, la création d'entreprise via CEPICI, les impôts et la comptabilité. Réponses claires et détaillées.",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "FAQ", path: "/faq" },
      ],
      extraSchemas: [faqSchema(ALL_FAQS.map((i) => ({ question: i.question, answer: i.answer })))],
    }),
  component: Page,
});

function Page() {
  const rel = getPageRelations("/faq");
  return (
    <>
      {rel && <Breadcrumbs items={rel.breadcrumb} className="container-app pt-6" />}
      {/* Hero */}
      <section className="bg-background-alt border-b border-border">
        <div className="container-app py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground max-w-3xl mx-auto">
            Questions Fréquentes sur les Cabinets Comptables en Côte d'Ivoire
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos services, la création d'entreprise, la fiscalité et la comptabilité en CI.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une question…"
              className="pl-12 h-12 text-base"
              aria-label="Rechercher dans la FAQ"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-app py-12 md:py-16">
        <div className="grid lg:grid-cols-[260px_1fr] gap-10">
          {/* Sidebar nav */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-2" aria-label="Catégories FAQ">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Catégories
              </p>
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="block px-3 py-2 rounded-md text-sm text-foreground hover:bg-background-alt hover:text-primary transition-colors"
                >
                  {c.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ list */}
          <div className="space-y-12 min-w-0">
            {categories.map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-24">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {cat.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {cat.items.map((it, i) => (
                    <AccordionItem key={i} value={`${cat.id}-${i}`}>
                      <AccordionTrigger className="text-left text-base md:text-lg font-medium">
                        {it.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                        {it.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-primary">
        <div className="container-app py-12 md:py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            Vous n'avez pas trouvé votre réponse ?
          </h2>
          <p className="mt-3 text-primary-foreground/90 max-w-xl mx-auto">
            Notre équipe vous répond directement. Posez-nous votre question, nous revenons vers vous sous 24h.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" variant="secondary">
              <Link to="/nous-contacter">
                Nous contacter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {rel && <RelatedLinks items={rel.related} />}
    </>
  );
}
