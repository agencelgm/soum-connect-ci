import { createFileRoute } from "@tanstack/react-router";
import { Receipt, Building2, Calculator, MapPin, AlertTriangle } from "lucide-react";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";
import { buildPageHead, faqSchema } from "@/lib/seo";

const META_TITLE = "Déclaration Fiscale CI — DSF, TVA, IS | SoumissionComptable";
const META_DESC =
  "DSF, TVA mensuelle, IS, CNPS : trouvez un cabinet comptable pour vos déclarations fiscales en Côte d'Ivoire. 5 devis gratuits, zéro pénalité.";

const FAQS: Faq[] = [
  {
    question: "Quand doit-on soumettre la DSF en Côte d'Ivoire ?",
    answer:
      "La Déclaration Statistique et Fiscale (DSF) doit être déposée auprès de la DGI au plus tard le 30 juin de chaque année pour les entreprises clôturant au 31 décembre. Un report partiel est possible sur demande motivée.",
  },
  {
    question: "Quelle est la périodicité des déclarations de TVA ?",
    answer:
      "En Côte d'Ivoire, la TVA est déclarée et payée mensuellement, généralement au plus tard le 15 du mois suivant. Le taux normal est de 18 %.",
  },
  {
    question: "Quels sont les principaux impôts payés par une entreprise en CI ?",
    answer:
      "Une entreprise est généralement redevable de l'Impôt sur les Sociétés (IS, 25 %), de la TVA (18 %), des cotisations CNPS sur salaires, de l'ITS (Impôt sur Traitements et Salaires), de la patente et de la TPS selon le régime.",
  },
  {
    question: "Quelles sont les pénalités en cas de retard de déclaration ?",
    answer:
      "La DGI applique des intérêts de retard, des majorations (10 % à 100 % selon la gravité) et peut déclencher un contrôle fiscal. En cas de non-déclaration répétée, des sanctions plus lourdes (taxation d'office, fermeture) sont possibles.",
  },
  {
    question: "Mon cabinet peut-il télédéclarer pour moi ?",
    answer:
      "Oui. Les cabinets agréés disposent d'un accès au portail e-impôts de la DGI et effectuent l'ensemble des télédéclarations en votre nom (TVA, IS, ITS, CNPS, DSF).",
  },
];

const RELATED: RelatedService[] = [
  { title: "Comptabilité générale", link: "/comptabilite-entreprise-abidjan", icon: Calculator },
  { title: "Création d'entreprise", link: "/creation-entreprise-cote-divoire", icon: Building2 },
  { title: "Cabinet à Abidjan", link: "/cabinet-comptable-abidjan", icon: MapPin },
];

export const Route = createFileRoute("/declaration-fiscale-cote-divoire")({
  head: () =>
    buildPageHead({
      path: "/declaration-fiscale-cote-divoire",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Services", path: "/cabinet-comptable-abidjan" },
        { name: "Déclaration fiscale", path: "/declaration-fiscale-cote-divoire" },
      ],
      extraSchemas: [faqSchema(FAQS)],
    }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Déclaration Fiscale en Côte d'Ivoire — Trouvez votre Cabinet"
      heroSubtitle="DSF, TVA, IS, CNPS — sécurisez vos obligations fiscales avec un cabinet agréé OECCA-CI."
      serviceIcon={Receipt}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Services", to: "/cabinet-comptable-abidjan" },
        { label: "Déclaration fiscale" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="calendar">
            <h2 id="calendar" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Calendrier fiscal en Côte d'Ivoire
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] text-primary">
                  <tr>
                    <th className="text-left p-3 font-semibold">Déclaration</th>
                    <th className="text-left p-3 font-semibold">Périodicité</th>
                    <th className="text-left p-3 font-semibold">Échéance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-3 font-semibold">DSF</td><td className="p-3">Annuelle</td><td className="p-3">Au plus tard le 30 juin</td></tr>
                  <tr><td className="p-3 font-semibold">TVA</td><td className="p-3">Mensuelle</td><td className="p-3">15 du mois suivant</td></tr>
                  <tr><td className="p-3 font-semibold">IS (acomptes)</td><td className="p-3">Trimestrielle</td><td className="p-3">15 avr., 15 juin, 15 sept., 15 déc.</td></tr>
                  <tr><td className="p-3 font-semibold">CNPS</td><td className="p-3">Mensuelle / Trimestrielle</td><td className="p-3">15 du mois suivant</td></tr>
                  <tr><td className="p-3 font-semibold">ITS</td><td className="p-3">Mensuelle</td><td className="p-3">15 du mois suivant</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="taxes">
            <h2 id="taxes" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Principaux impôts d'une entreprise en Côte d'Ivoire
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Impôt sur les Sociétés (IS)", desc: "Taux de 25 % du bénéfice imposable. Acomptes trimestriels et solde lors du dépôt de la DSF." },
                { name: "TVA", desc: "Taux normal 18 %, taux réduit 9 % sur certains produits. Déclaration mensuelle obligatoire." },
                { name: "CNPS", desc: "Cotisations sociales employeur et salarié sur la masse salariale (retraite, prestations familiales, accidents du travail)." },
                { name: "Patente / TPS", desc: "Contribution annuelle des entreprises. La TPS (Taxe sur Prestations de Services) s'applique au secteur des services." },
              ].map((t) => (
                <div key={t.name} className="rounded-xl border border-border bg-white p-5">
                  <p className="font-heading font-semibold text-primary">{t.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="risks">
            <h2 id="risks" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Risques en cas de non-conformité
            </h2>
            <div className="rounded-xl border border-border bg-white p-5 flex gap-4">
              <AlertTriangle className="h-6 w-6 text-secondary shrink-0" />
              <div className="text-foreground leading-relaxed space-y-2">
                <p>
                  Un retard ou une omission de déclaration auprès de la DGI entraîne des
                  <strong> intérêts de retard</strong>, des <strong>majorations de 10 % à 100 %</strong> du
                  montant dû et expose votre entreprise à un <strong>contrôle fiscal</strong>.
                </p>
                <p>
                  En cas de manquements répétés : taxation d'office, redressement,
                  blocage du NCC voire fermeture administrative. Un cabinet comptable
                  réduit drastiquement ce risque en sécurisant chaque échéance.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}