import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function CreerEntrepriseDepuisFranceContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Créer une entreprise en Côte d'Ivoire <strong>depuis la France</strong> est aujourd'hui
        possible sans déplacement obligatoire. Procuration notariée, mandataire local, dossier
        CEPICI numérisé : la diaspora ivoirienne dispose d'un parcours balisé. Ce guide décrit
        chaque étape, les pièges à éviter et le coût total à prévoir.
      </p>

      <ArticleSection title="Peut-on vraiment créer sa société ivoirienne sans aller à Abidjan ?">
        <p>
          Oui. Depuis la dématérialisation du CEPICI, vous pouvez{" "}
          <strong>déposer un dossier de création de SARL à distance</strong> via un mandataire local
          muni d'une procuration notariée. Le compte bancaire de la société peut être ouvert par
          votre mandataire ou lors d'un court séjour à Abidjan.
        </p>
        <ArticleCallout variant="info" title="Le saviez-vous ?">
          Plus de 30 % des SARL créées au CEPICI en 2024 l'ont été par des Ivoiriens résidant à
          l'étranger, principalement depuis la France, le Canada et les États-Unis.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quelles sont les étapes pour créer depuis Paris ou Lyon ?">
        <p>
          Le parcours diaspora se déroule en <strong>six étapes principales</strong>, dont quatre se
          font intégralement depuis la France. Comptez 3 à 6 semaines entre la décision et la remise
          du RCCM.
        </p>
        <ArticleList
          ordered
          items={[
            <>
              <strong>Choisir la forme juridique</strong> (SARL ou SARLU pour 95 % des projets
              diaspora). Voir notre comparatif{" "}
              <Link
                to="/guides/$slug"
                params={{ slug: "sarl-sa-ei-cote-divoire" }}
                className="text-secondary underline"
              >
                SARL vs SA vs EI
              </Link>
              .
            </>,
            <>
              <strong>Désigner un mandataire</strong> en Côte d'Ivoire (proche, cabinet comptable ou
              avocat).
            </>,
            <>
              <strong>Signer une procuration notariée</strong> au consulat ou chez un notaire
              français, avec apostille de La Haye.
            </>,
            <>
              <strong>Préparer les statuts</strong> avec un cabinet comptable agréé OECCA-CI, qui
              pilote tout le dossier.
            </>,
            <>
              <strong>Déposer le capital</strong> sur un compte bloqué (votre mandataire signe pour
              vous).
            </>,
            <>
              <strong>Récupérer les documents</strong> CEPICI (RCCM, DFE, CNPS) par votre
              mandataire, scans envoyés sous 48 h.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Qui choisir comme mandataire en Côte d'Ivoire ?">
        <p>
          Trois options s'offrent à vous : un{" "}
          <strong>
            proche de confiance, un avocat inscrit au barreau d'Abidjan, ou un cabinet comptable
            agréé OECCA-CI
          </strong>
          . Le cabinet comptable est l'option la plus sûre car il combine mandataire, conseil
          juridique et premier comptable de la société.
        </p>
        <ArticleList
          items={[
            "Proche / famille — Gratuit mais peu sécurisé si la relation se dégrade ou si la personne est peu disponible.",
            "Avocat — Sécurité juridique maximale, coût 300 000 à 800 000 FCFA pour la mission de création.",
            "Cabinet comptable — Solution intégrée : création + tenue comptable mensuelle. Coût 200 000 à 500 000 FCFA pour la création seule.",
          ]}
        />
        <ArticleCallout variant="warning" title="Vigilance procuration">
          Une procuration trop large peut être détournée. Limitez-la précisément à la création de la
          société, au dépôt du capital et au dépôt du dossier CEPICI. Excluez explicitement la vente
          d'actifs futurs.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Combien coûte la création depuis la France ?">
        <p>
          Comptez <strong>entre 600 000 et 1 200 000 FCFA</strong> (environ 900 à 1 800 €) tout
          compris, hors capital. Le surcoût par rapport à une création locale vient de la
          procuration notariée, des frais consulaires et des honoraires du mandataire.
        </p>
        <ArticleList
          items={[
            "Procuration notariée + apostille en France : 150 à 350 €.",
            "Frais CEPICI et formalités RCCM : environ 100 000 à 150 000 FCFA.",
            "Honoraires du mandataire / cabinet : 200 000 à 800 000 FCFA.",
            "Ouverture du compte bancaire (dépôt minimum variable selon la banque).",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quels pièges éviter en tant qu'entrepreneur diaspora ?">
        <p>
          Les <strong>trois erreurs les plus fréquentes</strong> chez les créateurs diaspora sont la
          sous-estimation des délais bancaires, la domiciliation chez un proche, et l'absence de
          suivi comptable mensuel. Anticipez chacun de ces points dès le départ.
        </p>
        <ArticleList
          items={[
            "Ouverture de compte bancaire : prévoir 2 à 4 semaines après la création (les banques exigent souvent une visite physique).",
            "Domiciliation : préférez une société de domiciliation agréée plutôt que l'adresse d'un cousin, qui complique les notifications fiscales.",
            "Comptabilité : signez le forfait mensuel dès la création, sinon la première DSF sera douloureuse à reconstituer.",
          ]}
        />
        <p>
          Vous pouvez{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            comparer plusieurs cabinets agréés OECCA-CI
          </Link>{" "}
          spécialisés dans l'accompagnement diaspora, ou consulter notre{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "creer-sarl-cepici" }}
            className="text-secondary underline"
          >
            guide complet de création SARL au CEPICI
          </Link>
          .
        </p>
      </ArticleSection>

      <ArticleCTA
        title="Diaspora : créez votre société en CI sans vous déplacer"
        description="Comparez gratuitement les cabinets comptables qui accompagnent les Ivoiriens de l'étranger."
      />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Faut-il avoir la nationalité ivoirienne pour créer une SARL en CI ?
        </h3>
        <p>
          Non. Tout étranger peut créer une société en Côte d'Ivoire. Les documents demandés sont
          identiques (passeport en cours de validité, justificatif de domicile).
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Peut-on tout faire 100 % en ligne ?
        </h3>
        <p>
          Le dépôt CEPICI est numérisé, mais la procuration notariée et l'ouverture du compte
          bancaire restent des actes physiques qui passent par votre mandataire local.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Combien de temps prend la création depuis la France ?
        </h3>
        <p>
          Comptez 3 à 6 semaines au total : 1 à 2 semaines pour la procuration, 5 à 10 jours ouvrés
          pour le CEPICI, 2 à 4 semaines pour la banque.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Faut-il payer des impôts en France sur ma SARL ivoirienne ?
        </h3>
        <p>
          Si vous êtes résident fiscal français, les dividendes versés par votre SARL ivoirienne
          sont imposables en France, sous réserve de la convention fiscale franco-ivoirienne (évite
          la double imposition).
        </p>
      </ArticleSection>
    </>
  );
}
