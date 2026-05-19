import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Building2, Receipt, MapPin, TrendingDown, GraduationCap, Target } from "lucide-react";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";

const META_TITLE = "Comptabilité Entreprise Abidjan | Tenue de Comptes | SoumissionsComptables.ci";
const META_DESC =
  "Externalisez la comptabilité de votre entreprise à Abidjan. Tenue de comptes, états financiers SYSCOHADA, déclarations mensuelles. Comparez 5 cabinets gratuitement.";

const FAQS: Faq[] = [
  {
    question: "Est-ce obligatoire d'avoir un comptable pour une SARL en Côte d'Ivoire ?",
    answer:
      "Toute SARL est tenue de produire une comptabilité conforme au SYSCOHADA et de déposer une DSF annuelle. Il n'est pas légalement obligatoire d'avoir un comptable salarié, mais l'accompagnement par un cabinet comptable agréé OECCA-CI est en pratique indispensable pour rester conforme.",
  },
  {
    question: "Combien coûte la comptabilité d'une PME à Abidjan ?",
    answer:
      "Les cabinets comptables à Abidjan facturent généralement entre 50 000 et 300 000 FCFA / mois selon la taille de l'entreprise, le volume de transactions et l'étendue de la mission (tenue, déclarations, conseil).",
  },
  {
    question: "Quelle est la différence entre un comptable interne et un cabinet externalisé ?",
    answer:
      "Un comptable interne est salarié à temps plein : coût élevé (souvent > 400 000 FCFA / mois charges incluses) mais disponibilité immédiate. Un cabinet externalisé mutualise plusieurs experts pour un coût mensuel inférieur et une expertise multi-domaines (fiscal, social, juridique).",
  },
  {
    question: "Mon cabinet gère-t-il aussi mes déclarations fiscales et sociales ?",
    answer:
      "Oui, la majorité des cabinets proposent un forfait incluant la tenue comptable, les déclarations TVA mensuelles, la CNPS et la DSF annuelle. Précisez le périmètre attendu dans votre demande de soumission.",
  },
  {
    question: "Puis-je changer de cabinet en cours d'exercice ?",
    answer:
      "Oui. Vous pouvez changer de cabinet à tout moment. Le nouveau cabinet récupère votre dossier (grand livre, balance, pièces justificatives) auprès de l'ancien pour assurer la continuité.",
  },
];

const RELATED: RelatedService[] = [
  { title: "Création d'entreprise", link: "/creation-entreprise-cote-divoire", icon: Building2 },
  { title: "Déclaration fiscale", link: "/declaration-fiscale-cote-divoire", icon: Receipt },
  { title: "Domiciliation Abidjan", link: "/domiciliation-entreprise-abidjan", icon: MapPin },
];

export const Route = createFileRoute("/comptabilite-entreprise-abidjan")({
  head: () => ({
    meta: [
      { title: META_TITLE },
      { name: "description", content: META_DESC },
      { property: "og:title", content: META_TITLE },
      { property: "og:description", content: META_DESC },
      { property: "og:url", content: "/comptabilite-entreprise-abidjan" },
    ],
    links: [{ rel: "canonical", href: "/comptabilite-entreprise-abidjan" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Comptabilité Générale pour Entreprises à Abidjan"
      heroSubtitle="Tenue de comptes, états financiers SYSCOHADA, déclarations mensuelles — comparez 5 cabinets comptables agréés OECCA-CI."
      serviceIcon={Calculator}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Services", to: "/cabinet-comptable-abidjan" },
        { label: "Comptabilité générale" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="why">
            <h2 id="why" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Pourquoi externaliser sa comptabilité ?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: TrendingDown, title: "Coût maîtrisé", desc: "Un forfait mensuel prévisible, sans charges sociales ni recrutement." },
                { icon: GraduationCap, title: "Expertise OHADA & SYSCOHADA", desc: "Des experts à jour des évolutions fiscales et comptables ivoiriennes." },
                { icon: Target, title: "Focus sur votre métier", desc: "Vous libérez du temps pour développer votre activité, pas pour saisir des écritures." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-white p-5">
                  <c.icon className="h-6 w-6 text-secondary" />
                  <p className="mt-3 font-heading font-semibold text-primary">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="services">
            <h2 id="services" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Services inclus dans une mission de comptabilité
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-foreground">
              <li>Tenue des livres comptables (journaux, grand livre, balance)</li>
              <li>Production des états financiers annuels (bilan, compte de résultat, TAFIRE)</li>
              <li>Préparation et dépôt de la DSF (Déclaration Statistique et Fiscale)</li>
              <li>Déclarations mensuelles : TVA, ITS, CNPS, acomptes IS</li>
              <li>Reporting de gestion et conseil financier</li>
            </ul>
          </section>

          <section aria-labelledby="compare">
            <h2 id="compare" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Comptable interne vs cabinet externalisé
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] text-primary">
                  <tr>
                    <th className="text-left p-3 font-semibold">Critère</th>
                    <th className="text-left p-3 font-semibold">Comptable interne</th>
                    <th className="text-left p-3 font-semibold">Cabinet externalisé</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 font-semibold">Coût mensuel</td><td className="p-3">400 000 FCFA et + (charges incluses)</td><td className="p-3">50 000 – 300 000 FCFA</td></tr>
                  <tr><td className="p-3 font-semibold">Compétence</td><td className="p-3">Une seule personne</td><td className="p-3">Équipe pluridisciplinaire</td></tr>
                  <tr><td className="p-3 font-semibold">Flexibilité</td><td className="p-3">Faible (CDI)</td><td className="p-3">Élevée (contrat ajustable)</td></tr>
                  <tr><td className="p-3 font-semibold">Risque</td><td className="p-3">Absence, rotation</td><td className="p-3">Continuité de service</td></tr>
                  <tr><td className="p-3 font-semibold">Idéal pour</td><td className="p-3">Grandes entreprises</td><td className="p-3">TPE, PME, startups</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="price">
            <h2 id="price" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Fourchette de prix à Abidjan
            </h2>
            <p className="text-foreground leading-relaxed">
              Les cabinets comptables à Abidjan facturent généralement entre{" "}
              <strong>50 000 et 300 000 FCFA / mois</strong> selon la taille de l'entreprise
              et le volume de transactions. Une TPE en démarrage avec peu de mouvements
              démarre souvent autour de 50 000 FCFA, tandis qu'une PME avec salariés et
              TVA mensuelle se situe plutôt entre 150 000 et 300 000 FCFA.
            </p>
          </section>
        </div>
      }
    />
  );
}