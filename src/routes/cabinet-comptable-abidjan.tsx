import { createFileRoute } from "@tanstack/react-router";
import { Building2, Calculator, Receipt, MapPin, BadgeCheck, Sparkles, Wallet, Clock } from "lucide-react";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";
import { buildPageHead, faqSchema, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo";

const META_TITLE = "Cabinet Comptable à Abidjan | Comparez 5 Offres Gratuitement | SoumissionsComptables.ci";
const META_DESC =
  "Trouvez le meilleur cabinet comptable à Abidjan (Plateau, Cocody, Marcory). Cabinets agréés OECCA-CI. Recevez 5 soumissions gratuites en 48h.";

const FAQS: Faq[] = [
  {
    question: "Combien y a-t-il de cabinets comptables à Abidjan ?",
    answer:
      "Abidjan concentre l'écrasante majorité des cabinets comptables de Côte d'Ivoire, avec plusieurs centaines de structures inscrites à l'OECCA-CI, principalement situées au Plateau, à Cocody et à Marcory.",
  },
  {
    question: "Comment vérifier qu'un cabinet est agréé OECCA-CI ?",
    answer:
      "Demandez au cabinet son numéro d'inscription à l'Ordre des Experts-Comptables et Comptables Agréés de Côte d'Ivoire (OECCA-CI). Vous pouvez ensuite vérifier cette information sur le tableau de l'Ordre.",
  },
  {
    question: "Quel quartier d'Abidjan choisir pour mon cabinet ?",
    answer:
      "Le Plateau (CBD) regroupe les cabinets premium et internationaux. Cocody et les Deux Plateaux offrent un bon équilibre standing / accessibilité. Marcory Zone 4 est très orienté PME et import-export. Choisissez en fonction de la proximité avec votre activité.",
  },
  {
    question: "Vaut-il mieux un grand cabinet ou un petit cabinet ?",
    answer:
      "Les grands cabinets sont adaptés aux groupes et aux entreprises soumises à audit légal. Les cabinets de taille moyenne et les petits cabinets offrent un suivi plus personnalisé à un coût plus accessible — souvent idéaux pour les TPE/PME.",
  },
  {
    question: "Combien de soumissions vais-je recevoir ?",
    answer:
      "Jusqu'à 5 soumissions de cabinets différents, sélectionnés selon votre besoin, votre quartier et votre budget. Vous comparez librement et choisissez sans engagement.",
  },
];

const RELATED: RelatedService[] = [
  { title: "Création d'entreprise", link: "/creation-entreprise-cote-divoire", icon: Building2 },
  { title: "Comptabilité générale", link: "/comptabilite-entreprise-abidjan", icon: Calculator },
  { title: "Déclaration fiscale", link: "/declaration-fiscale-cote-divoire", icon: Receipt },
];

export const Route = createFileRoute("/cabinet-comptable-abidjan")({
  head: () =>
    buildPageHead({
      path: "/cabinet-comptable-abidjan",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Villes", path: "/cabinet-comptable-abidjan" },
        { name: "Abidjan", path: "/cabinet-comptable-abidjan" },
      ],
      altPath: "/en/accounting-firm-abidjan",
      extraSchemas: [
        LOCAL_BUSINESS_SCHEMA,
        faqSchema(FAQS),
      ],
    }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Cabinet Comptable à Abidjan — Comparez 5 Offres Gratuitement"
      heroSubtitle="Plateau, Cocody, Marcory… Trouvez un cabinet comptable agréé OECCA-CI adapté à votre quartier, votre secteur et votre budget."
      serviceIcon={MapPin}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Villes" },
        { label: "Abidjan" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="why-abj">
            <h2 id="why-abj" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Pourquoi Abidjan concentre la majorité des cabinets comptables de Côte d'Ivoire
            </h2>
            <p className="text-foreground leading-relaxed">
              Capitale économique du pays, Abidjan accueille les sièges sociaux des
              grandes entreprises, les administrations clés (CEPICI, DGI, Trésor) et
              l'Ordre des Experts-Comptables et Comptables Agréés (OECCA-CI). Cette
              concentration en fait le hub naturel de la profession comptable
              ivoirienne, avec une offre dense de cabinets allant des Big Four aux
              structures spécialisées TPE/PME.
            </p>
          </section>

          <section aria-labelledby="quartiers">
            <h2 id="quartiers" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Les quartiers d'affaires d'Abidjan
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              Trois quartiers concentrent la majorité des cabinets comptables : le
              Plateau (CBD historique), Cocody (résidentiel et tertiaire de standing)
              et Marcory — notamment la Zone 4 — orientée PME et import-export.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] text-primary">
                  <tr>
                    <th className="text-left p-3 font-semibold">Quartier</th>
                    <th className="text-left p-3 font-semibold">Types de cabinets</th>
                    <th className="text-left p-3 font-semibold">Profil clientèle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 font-semibold">Plateau</td><td className="p-3">Big Four, cabinets internationaux, audit</td><td className="p-3">Grandes entreprises, multinationales</td></tr>
                  <tr><td className="p-3 font-semibold">Cocody / Deux Plateaux</td><td className="p-3">Cabinets de taille moyenne, conseil</td><td className="p-3">PME, professions libérales, ONG</td></tr>
                  <tr><td className="p-3 font-semibold">Marcory (Zone 4)</td><td className="p-3">Cabinets spécialisés PME, fiscal</td><td className="p-3">PME, import-export, commerce</td></tr>
                  <tr><td className="p-3 font-semibold">Yopougon / Adjamé</td><td className="p-3">Cabinets de proximité</td><td className="p-3">TPE, commerçants, artisans</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="howto">
            <h2 id="howto" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Comment choisir un cabinet comptable à Abidjan
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: BadgeCheck, title: "Agrément OECCA-CI", desc: "Vérifiez l'inscription au tableau de l'Ordre — gage de compétence et de responsabilité professionnelle." },
                { icon: Sparkles, title: "Spécialisation sectorielle", desc: "Privilégiez un cabinet ayant déjà accompagné des entreprises de votre secteur (BTP, commerce, ONG, tech…)." },
                { icon: Wallet, title: "Tarifs transparents", desc: "Demandez un devis détaillé : forfait mensuel, prestations incluses, options facturées en sus." },
                { icon: Clock, title: "Disponibilité & proximité", desc: "Réactivité aux échéances DGI, accessibilité du cabinet et qualité du suivi au quotidien." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-border bg-white p-5">
                  <c.icon className="h-6 w-6 text-secondary" />
                  <p className="mt-3 font-heading font-semibold text-primary">{c.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      }
    />
  );
}