import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Globe, Building2, Calculator, MapPin, CheckSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicePage, type Faq, type RelatedService } from "@/components/service/ServicePage";
import { buildPageHead, faqSchema } from "@/lib/seo";

const META_TITLE =
  "Créer une Entreprise en Côte d'Ivoire depuis l'Étranger | Diaspora Ivoirienne";
const META_DESC =
  "Guide complet pour la diaspora ivoirienne (France, Canada, USA) sur comment créer une SARL ou SA en Côte d'Ivoire à distance via le CEPICI. Trouvez votre cabinet mandataire.";

const STEPS = [
  {
    title: "Choisir votre forme juridique",
    text: "La SARL (ou SARLU pour un associé unique) est recommandée pour la diaspora : capital minimum 100 000 FCFA, responsabilité limitée, gestion souple.",
  },
  {
    title: "Trouver un cabinet comptable mandataire en CI",
    text: "Via SoumissionComptable.com, identifiez un cabinet agréé OECCA-CI qui acceptera d'agir comme mandataire pour vos démarches.",
  },
  {
    title: "Préparer et envoyer vos documents scannés",
    text: "CNI/passeport, acte de naissance, casier judiciaire, justificatif de domicile, projet de statuts — transmis par e-mail au cabinet.",
  },
  {
    title: "Le cabinet soumet le dossier au CEPICI en votre nom",
    text: "Avec une procuration légalisée au consulat ivoirien (ou apostillée), le cabinet dépose le dossier au guichet unique CEPICI.",
  },
  {
    title: "Recevoir votre numéro RCCM et attestation de création",
    text: "Sous 3 à 7 jours ouvrés, vous recevez RCCM, DFE (Déclaration Fiscale d'Existence) et immatriculation CNPS.",
  },
  {
    title: "Ouvrir un compte bancaire",
    text: "Plusieurs banques ivoiriennes (NSIA, Ecobank, SGCI, BOA) acceptent l'ouverture de compte à distance pour la diaspora, sur dossier complet.",
  },
];

const DOCS = [
  "Copie CNI ou passeport en cours de validité (associés + gérant)",
  "Extrait d'acte de naissance (moins de 3 mois)",
  "Extrait de casier judiciaire (moins de 3 mois, pays de résidence)",
  "Justificatif de domicile à l'étranger",
  "Projet de statuts de la société (ou modèle fourni par le cabinet)",
  "Procuration légalisée au consulat ivoirien ou apostillée",
  "Justificatif de siège social en CI (bail, domiciliation, attestation)",
  "Attestation de dépôt du capital (peut se faire par virement international)",
];

const FAQS: Faq[] = [
  {
    question: "Faut-il être physiquement présent en Côte d'Ivoire pour créer ma société ?",
    answer:
      "Non. Avec une procuration légalisée par un consulat ivoirien (ou apostillée pour les pays signataires de La Haye), un cabinet mandataire local peut accomplir l'intégralité des démarches CEPICI sans votre présence.",
  },
  {
    question: "Comment payer le capital social depuis la France, le Canada ou les USA ?",
    answer:
      "Le capital se libère par virement international sur le compte de souscription ouvert par votre cabinet ou notaire en CI. Une attestation bancaire est ensuite remise au CEPICI. Le minimum SARL est de 100 000 FCFA (environ 150 EUR / 165 USD / 220 CAD).",
  },
  {
    question: "Combien coûtent les services d'un cabinet mandataire ?",
    answer:
      "Comptez en moyenne 250 000 à 600 000 FCFA pour la création complète à distance (rédaction des statuts, dépôt CEPICI, RCCM, DFE, CNPS). Les tarifs varient selon la forme juridique, l'urgence et les options (domiciliation, ouverture de compte bancaire).",
  },
  {
    question: "Combien de temps prennent les démarches depuis l'étranger ?",
    answer:
      "Entre l'envoi des documents et la réception du RCCM, comptez 2 à 4 semaines en pratique : 1 à 2 semaines pour préparer et légaliser la procuration, puis 3 à 7 jours ouvrés pour les démarches CEPICI elles-mêmes.",
  },
  {
    question: "Quelle banque ivoirienne accepte l'ouverture de compte pour la diaspora ?",
    answer:
      "NSIA, Ecobank, Société Générale CI, BOA et UBA proposent l'ouverture de compte à distance pour la diaspora, sur dossier KYC complet. Votre cabinet mandataire peut vous accompagner dans le choix et la constitution du dossier.",
  },
];

const RELATED: RelatedService[] = [
  { title: "Création d'entreprise en CI", link: "/creation-entreprise-cote-divoire", icon: Building2 },
  { title: "Comptabilité Abidjan", link: "/comptabilite-entreprise-abidjan", icon: Calculator },
  { title: "Domiciliation Abidjan", link: "/domiciliation-entreprise-abidjan", icon: MapPin },
];

export const Route = createFileRoute("/creation-entreprise-diaspora-ivoirienne")({
  head: () =>
    buildPageHead({
      path: "/creation-entreprise-diaspora-ivoirienne",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Création d'entreprise", path: "/creation-entreprise-cote-divoire" },
        { name: "Diaspora ivoirienne", path: "/creation-entreprise-diaspora-ivoirienne" },
      ],
      extraSchemas: [faqSchema(FAQS)],
    }),
  component: Page,
});

function Page() {
  return (
    <ServicePage
      title="Créer votre Entreprise en Côte d'Ivoire depuis la France, Canada ou les USA"
      heroSubtitle="Vous êtes membre de la diaspora ivoirienne ? Créez votre SARL ou SA à distance via le CEPICI grâce à un cabinet comptable mandataire agréé."
      serviceIcon={Globe}
      breadcrumb={[
        { label: "Accueil", to: "/" },
        { label: "Création d'entreprise", to: "/creation-entreprise-cote-divoire" },
        { label: "Diaspora ivoirienne" },
      ]}
      faqs={FAQS}
      relatedServices={RELATED}
      mainContent={
        <div className="space-y-10">
          <section aria-labelledby="reassure">
            <h2 id="reassure" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Oui, c'est possible depuis l'étranger
            </h2>
            <p className="text-foreground leading-relaxed">
              Que vous soyez à Paris, Montréal, New York ou Bruxelles, vous pouvez créer
              votre entreprise en Côte d'Ivoire sans prendre l'avion. Le CEPICI a digitalisé
              l'essentiel de ses démarches depuis 2016, et l'Acte Uniforme OHADA autorise
              expressément la représentation par mandataire. Des milliers de membres de la
              diaspora ivoirienne ont déjà monté leur SARL ou SARLU à distance, avec
              l'appui d'un cabinet comptable local. Le cadre juridique est clair, les
              délais maîtrisés (2 à 4 semaines) et les coûts prévisibles. La seule
              condition : s'entourer d'un cabinet mandataire sérieux, agréé OECCA-CI, qui
              sécurisera chaque étape en votre nom.
            </p>
          </section>

          <section aria-labelledby="online">
            <h2 id="online" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Ce que le CEPICI permet en ligne
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-foreground">
              <li>Réservation du nom commercial via le portail e-CEPICI</li>
              <li>Dépôt du dossier complet de création (SARL, SARLU, SA, EI)</li>
              <li>Obtention du RCCM (Registre du Commerce) en 24 à 48h</li>
              <li>Délivrance de la DFE (Déclaration Fiscale d'Existence) auprès de la DGI</li>
              <li>Immatriculation à la CNPS pour les futurs salariés</li>
              <li>Paiement en ligne des frais officiels par carte bancaire internationale</li>
            </ul>
          </section>

          <section aria-labelledby="mandataire">
            <h2 id="mandataire" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-3">
              Le rôle du cabinet mandataire
            </h2>
            <p className="text-foreground leading-relaxed">
              Le cabinet mandataire est un cabinet comptable agréé OECCA-CI qui agit en
              votre nom en Côte d'Ivoire sur la base d'une procuration légalisée. Il
              rédige les statuts, ouvre le compte de souscription du capital, dépose le
              dossier au CEPICI, récupère vos documents officiels (RCCM, DFE, CNPS), et
              peut aller jusqu'à domicilier le siège social et ouvrir le compte bancaire
              professionnel. C'est votre relais juridique et administratif local — la
              garantie que rien ne bloque entre l'envoi de vos documents depuis l'étranger
              et la remise des documents officiels de votre société.
            </p>
          </section>

          <section aria-labelledby="steps">
            <h2 id="steps" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Créer votre entreprise en CI depuis l'étranger en 6 étapes
            </h2>
            <ol className="space-y-3">
              {STEPS.map((s, i) => (
                <li key={i} className="flex gap-4 rounded-xl border border-border bg-white p-4">
                  <span className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="docs">
            <h2 id="docs" className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4">
              Documents requis pour la création à distance
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {DOCS.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-border bg-white p-3"
                >
                  <CheckSquare className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="cta-mandataire"
            className="rounded-2xl bg-secondary text-white p-6 md:p-8 text-center"
          >
            <h2 id="cta-mandataire" className="font-heading font-bold text-2xl md:text-3xl">
              Trouvez votre cabinet mandataire en CI
            </h2>
            <p className="mt-2 text-white/90 max-w-xl mx-auto">
              Recevez jusqu'à 5 propositions de cabinets agréés OECCA-CI qui acceptent
              d'agir comme mandataire pour la diaspora. Gratuit, sous 48h.
            </p>
            <div className="mt-5">
              <Button
                asChild
                size="lg"
                className="bg-white text-secondary hover:bg-white/90 font-semibold"
              >
                <Link to="/demande-soumissions">
                  Trouvez votre cabinet mandataire en CI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      }
    />
  );
}