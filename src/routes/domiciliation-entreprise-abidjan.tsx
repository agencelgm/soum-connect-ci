import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Building2, Calculator, Receipt, Mail, Briefcase, Globe2 } from "lucide-react";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";
import { buildPageHead, faqSchema, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo";

const META_TITLE = "Domiciliation Entreprise Abidjan — Adresse Pro Plateau/Cocody";
const META_DESC =
  "Domiciliez votre entreprise à Abidjan (Plateau, Cocody, Marcory). Adresse pro idéale diaspora et startups. 5 offres gratuites comparées.";

const FAQS: Faq[] = [
  {
    question: "Qu'est-ce que la domiciliation d'entreprise ?",
    answer:
      "C'est l'attribution, par un prestataire agréé, d'une adresse postale et juridique servant de siège social à votre entreprise. Cette adresse figure sur vos statuts, factures et documents officiels.",
  },
  {
    question: "Puis-je domicilier mon entreprise depuis l'étranger ?",
    answer:
      "Oui. C'est même la solution la plus utilisée par la diaspora ivoirienne : vous obtenez un siège social légal à Abidjan sans avoir à louer ou acheter un local sur place.",
  },
  {
    question: "Combien coûte une domiciliation à Abidjan ?",
    answer:
      "Comptez entre 30 000 et 100 000 FCFA / mois selon le quartier et les services inclus (réception courrier, scan, accès bureaux ponctuel, salles de réunion).",
  },
  {
    question: "La domiciliation est-elle reconnue par le CEPICI ?",
    answer:
      "Oui. Le contrat de domiciliation établi avec un prestataire agréé fait office de justificatif de siège social lors de la création d'entreprise auprès du CEPICI.",
  },
];

const RELATED: RelatedService[] = [
  { title: "Création d'entreprise", link: "/creation-entreprise-cote-divoire", icon: Building2 },
  { title: "Comptabilité générale", link: "/comptabilite-entreprise-abidjan", icon: Calculator },
  { title: "Déclaration fiscale", link: "/declaration-fiscale-cote-divoire", icon: Receipt },
];

export const Route = createFileRoute("/domiciliation-entreprise-abidjan")({
  head: () =>
    buildPageHead({
      path: "/domiciliation-entreprise-abidjan",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Services", path: "/cabinet-comptable-abidjan" },
        { name: "Domiciliation Abidjan", path: "/domiciliation-entreprise-abidjan" },
      ],
      extraSchemas: [LOCAL_BUSINESS_SCHEMA, faqSchema(FAQS)],
    }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Domiciliation d'Entreprise à Abidjan — Adresse Professionnelle"
      heroSubtitle="Obtenez un siège social légal à Abidjan (Plateau, Cocody, Marcory) sans louer de bureau. Idéal pour la diaspora, les expatriés et les startups."
      serviceIcon={MapPin}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Services", to: "/cabinet-comptable-abidjan" },
        { label: "Domiciliation Abidjan" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="def">
            <h2 id="def" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Qu'est-ce que la domiciliation d'entreprise ?
            </h2>
            <p className="text-foreground leading-relaxed">
              La domiciliation consiste à attribuer à votre entreprise une adresse
              légale fournie par un prestataire agréé. Cette adresse devient le siège
              social officiel inscrit au RCCM et figure sur tous vos documents
              juridiques, commerciaux et fiscaux, sans nécessiter la location d'un local.
            </p>
          </section>

          <section aria-labelledby="why">
            <h2 id="why" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Pourquoi domicilier son entreprise à Abidjan ?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: Globe2, title: "Diaspora & expatriés", desc: "Créer une entreprise en CI sans y résider physiquement." },
                { icon: Briefcase, title: "Startups & freelances", desc: "Image professionnelle sans charges de bureau fixe." },
                { icon: Building2, title: "Adresse stratégique", desc: "Quartier d'affaires reconnu (Plateau, Cocody)." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-white p-5">
                  <c.icon className="h-6 w-6 text-secondary" />
                  <p className="mt-3 font-heading font-semibold text-primary">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="includes">
            <h2 id="includes" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Ce que vous obtenez
            </h2>
            <ul className="space-y-2 text-foreground">
              <li className="flex gap-3"><MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" /> Adresse légale utilisable pour vos statuts et le RCCM</li>
              <li className="flex gap-3"><Mail className="h-5 w-5 text-secondary shrink-0 mt-0.5" /> Réception, tri et scan du courrier postal</li>
              <li className="flex gap-3"><Briefcase className="h-5 w-5 text-secondary shrink-0 mt-0.5" /> Accès ponctuel à des bureaux et salles de réunion</li>
              <li className="flex gap-3"><Building2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" /> Justificatif de domiciliation accepté par le CEPICI</li>
            </ul>
          </section>

          <section aria-labelledby="price">
            <h2 id="price" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Fourchette de prix à Abidjan
            </h2>
            <p className="text-foreground leading-relaxed">
              Le tarif moyen d'une domiciliation à Abidjan se situe entre{" "}
              <strong>30 000 et 100 000 FCFA / mois</strong> selon le quartier et les
              services inclus.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] text-primary">
                  <tr>
                    <th className="text-left p-3 font-semibold">Quartier</th>
                    <th className="text-left p-3 font-semibold">Positionnement</th>
                    <th className="text-left p-3 font-semibold">Tarif indicatif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 font-semibold">Plateau</td><td className="p-3">Premium / CBD</td><td className="p-3">70 000 – 100 000 FCFA</td></tr>
                  <tr><td className="p-3 font-semibold">Cocody</td><td className="p-3">Intermédiaire / standing</td><td className="p-3">50 000 – 80 000 FCFA</td></tr>
                  <tr><td className="p-3 font-semibold">Marcory / Yopougon</td><td className="p-3">Économique</td><td className="p-3">30 000 – 50 000 FCFA</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      }
    />
  );
}