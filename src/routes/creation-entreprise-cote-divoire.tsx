import { createFileRoute } from "@tanstack/react-router";
import { Building2, Calculator, Receipt, MapPin } from "lucide-react";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";
import { buildPageHead, faqSchema, howToSchema } from "@/lib/seo";

const META_TITLE = "Création d'Entreprise Côte d'Ivoire — Cabinets Agréés CEPICI";
const META_DESC =
  "Créez votre SARL, SA, EI ou GIE en Côte d'Ivoire via le CEPICI. Démarches, documents, coûts. 5 soumissions gratuites de cabinets agréés OECCA-CI.";

const STEPS: { name: string; text: string }[] = [
  {
    name: "Choisir la forme juridique",
    text: "Décidez entre SARL, SA ou Entreprise Individuelle selon votre projet, votre capital et le nombre d'associés.",
  },
  {
    name: "Préparer les documents requis",
    text: "Rassemblez : CNI, acte de naissance, extrait de casier judiciaire, projet de statuts, justificatif de domicile et justificatif de dépôt du capital.",
  },
  {
    name: "Déposer le dossier au CEPICI",
    text: "Soumettez votre dossier en ligne sur e-cepici.ci ou en présentiel au guichet unique.",
  },
  {
    name: "Obtenir le NCC à la DGI",
    text: "Enregistrez-vous à la Direction Générale des Impôts pour votre Numéro de Compte Contribuable.",
  },
  {
    name: "S'immatriculer au RCCM",
    text: "Finalisez votre immatriculation au Registre du Commerce et du Crédit Mobilier.",
  },
];

const FAQS: Faq[] = [
  {
    question: "Peut-on créer une entreprise en CI depuis l'étranger ?",
    answer:
      "Oui. Le CEPICI propose une procédure de création en ligne qui permet aux membres de la diaspora de créer leur entreprise à distance. Un cabinet comptable peut agir comme mandataire en Côte d'Ivoire.",
  },
  {
    question: "Combien de temps prend la création d'une SARL au CEPICI ?",
    answer:
      "Le CEPICI s'engage à créer votre entreprise en 24h pour les procédures en ligne. En pratique, avec un cabinet comptable, l'ensemble de la procédure (y compris immatriculation RCCM) prend 3 à 7 jours ouvrables.",
  },
  {
    question: "Quel est le capital minimum pour créer une SARL en Côte d'Ivoire ?",
    answer:
      "Selon le droit OHADA applicable en Côte d'Ivoire, le capital minimum d'une SARL est de 100 000 FCFA (environ 150 EUR). Il n'est pas nécessaire de le bloquer intégralement au départ.",
  },
  {
    question: "Dois-je me déplacer au CEPICI pour créer mon entreprise ?",
    answer:
      "Non. Le CEPICI dispose d'un guichet unique électronique (e-CEPICI) qui permet de soumettre votre dossier entièrement en ligne.",
  },
  {
    question: "Puis-je créer une SARL seul en Côte d'Ivoire ?",
    answer:
      "Oui. L'Acte Uniforme OHADA révisé permet de créer une SARL avec un seul associé (SARLU — SARL Unipersonnelle). C'est la forme juridique idéale pour les entrepreneurs qui démarrent seuls.",
  },
];

const RELATED: RelatedService[] = [
  { title: "Comptabilité générale", link: "/comptabilite-entreprise-abidjan", icon: Calculator },
  { title: "Déclaration fiscale", link: "/declaration-fiscale-cote-divoire", icon: Receipt },
  { title: "Domiciliation Abidjan", link: "/domiciliation-entreprise-abidjan", icon: MapPin },
];

export const Route = createFileRoute("/creation-entreprise-cote-divoire")({
  head: () =>
    buildPageHead({
      path: "/creation-entreprise-cote-divoire",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Création d'entreprise", path: "/creation-entreprise-cote-divoire" },
      ],
      altPath: "/en/company-registration-ivory-coast",
      extraSchemas: [
        howToSchema("Comment créer une entreprise en Côte d'Ivoire via le CEPICI", STEPS, {
          description:
            "Guide étape par étape pour créer votre SARL, SA ou Entreprise Individuelle en Côte d'Ivoire via le CEPICI.",
          totalTime: "P7D",
          estimatedCost: { currency: "XOF", minValue: 150000, maxValue: 500000 },
        }),
        faqSchema(FAQS),
      ],
    }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Création d'Entreprise en Côte d'Ivoire"
      heroSubtitle="Trouvez un cabinet comptable agréé pour vous accompagner dans toutes vos démarches CEPICI — SARL, SA, Entreprise Individuelle."
      serviceIcon={Building2}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Services", to: "/cabinet-comptable-abidjan" },
        { label: "Création d'entreprise" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="why-cabinet">
            <h2
              id="why-cabinet"
              className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3"
            >
              Pourquoi faire appel à un cabinet comptable pour créer son entreprise ?
            </h2>
            <p className="text-foreground leading-relaxed">
              Créer une entreprise en Côte d'Ivoire implique des démarches précises auprès du
              CEPICI, de la DGI et du RCCM, dans le cadre juridique OHADA. Un cabinet comptable
              agréé OECCA-CI sécurise le choix de la forme juridique, la rédaction des statuts et le
              dépôt du dossier — vous évitant erreurs, allers-retours et retards. C'est aussi la
              garantie de démarrer avec une comptabilité conforme dès le premier mois d'activité.
            </p>
          </section>

          <section aria-labelledby="howto">
            <h2
              id="howto"
              className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4"
            >
              Comment créer une entreprise en CI en 5 étapes
            </h2>
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={i} className="flex gap-4 rounded-xl border border-border bg-white p-4">
                  <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <p className="font-semibold text-primary leading-snug">{s.name}</p>
                    <p className="text-foreground leading-relaxed mt-1">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="compare">
            <h2
              id="compare"
              className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4"
            >
              SARL vs SA vs Entreprise Individuelle en Côte d'Ivoire
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC] text-primary">
                  <tr>
                    <th className="text-left p-3 font-semibold">Forme</th>
                    <th className="text-left p-3 font-semibold">Capital min.</th>
                    <th className="text-left p-3 font-semibold">Associés</th>
                    <th className="text-left p-3 font-semibold">Responsabilité</th>
                    <th className="text-left p-3 font-semibold">Idéal pour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3 font-semibold">SARL</td>
                    <td className="p-3">100 000 FCFA</td>
                    <td className="p-3">1 à 50</td>
                    <td className="p-3">Limitée</td>
                    <td className="p-3">PME, startups</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">SA</td>
                    <td className="p-3">10 000 000 FCFA</td>
                    <td className="p-3">3 +</td>
                    <td className="p-3">Limitée</td>
                    <td className="p-3">Grandes entreprises</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">EI</td>
                    <td className="p-3">Aucun</td>
                    <td className="p-3">1 seul</td>
                    <td className="p-3">Illimitée</td>
                    <td className="p-3">Auto-entrepreneurs, artisans</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="docs">
            <h2 id="docs" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Documents requis pour créer une entreprise via le CEPICI
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-foreground">
              <li>Pièce d'identité en cours de validité (CNI ou passeport) des associés</li>
              <li>Acte de naissance ou extrait</li>
              <li>Extrait de casier judiciaire (moins de 3 mois)</li>
              <li>Statuts signés de la société</li>
              <li>Justificatif de domicile / siège social</li>
              <li>Justificatif de dépôt du capital social (le cas échéant)</li>
              <li>Déclaration sur l'honneur de non-condamnation du gérant</li>
            </ul>
          </section>

          <section aria-labelledby="cost">
            <h2 id="cost" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Coût de création d'entreprise au CEPICI
            </h2>
            <p className="text-foreground leading-relaxed">
              Les frais officiels du CEPICI sont à vérifier sur{" "}
              <a
                href="https://cepici.ci"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >
                cepici.ci
              </a>
              . Les honoraires d'un cabinet comptable pour vous accompagner dans la création varient
              en général entre <strong>150 000 et 500 000 FCFA</strong> selon la forme juridique
              choisie, la complexité du dossier et les options (rédaction des statuts, dépôt RCCM,
              immatriculation DGI, domiciliation).
            </p>
          </section>
        </div>
      }
    />
  );
}
