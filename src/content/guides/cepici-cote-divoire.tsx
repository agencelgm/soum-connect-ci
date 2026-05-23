import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CepiciCoteDivoireContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Le CEPICI (Centre de Promotion des Investissements en Côte d&apos;Ivoire)
          est l&apos;organisme public qui centralise toutes les formalités de
          création d&apos;entreprise via un guichet unique. Il permet d&apos;obtenir
          le RCCM, la DFE et l&apos;IDU en 24 à 72 heures pour une SARL standard.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce que le CEPICI ?">
        <p>
          Le <strong>CEPICI</strong> — Centre de Promotion des Investissements en
          Côte d&apos;Ivoire — est un établissement public créé pour simplifier et
          accélérer la création d&apos;entreprise dans le pays. Il fonctionne comme
          un guichet unique qui regroupe en un seul endroit les services qui
          relevaient autrefois de plusieurs administrations : le greffe du
          tribunal de commerce, la DGI, la CNPS et le Trésor public.
        </p>
        <p>
          Avant la création du CEPICI, un entrepreneur devait se rendre
          successivement dans plusieurs ministères et administrations, parfois
          pendant plusieurs semaines. Aujourd&apos;hui, le CEPICI centralise ces
          démarches et les compresse en un délai moyen de 24 à 72 heures ouvrées
          pour une SARL ou une SARLU standard.
        </p>
        <p>
          Le CEPICI a aussi une mission d&apos;attraction des investissements
          étrangers : il accompagne les investisseurs nationaux et
          internationaux dans leur implantation en Côte d&apos;Ivoire et gère les
          régimes d&apos;investissement préférentiels (exonérations fiscales, zones
          franches).
        </p>
      </ArticleSection>

      <ArticleSection title="Quel est le rôle exact du CEPICI dans la création d'entreprise ?">
        <p>Le rôle du CEPICI dans la création d&apos;entreprise est triple.</p>
        <p>
          <strong>1. Centralisation des formalités.</strong> Le CEPICI reçoit
          votre dossier et le transmet aux différentes administrations
          partenaires. Vous n&apos;avez qu&apos;un seul interlocuteur et un seul dépôt de
          dossier.
        </p>
        <p>
          <strong>2. Délivrance des documents officiels.</strong> À l&apos;issue de
          la procédure, le CEPICI remet :
        </p>
        <ArticleList
          items={[
            <><strong>RCCM</strong> — Registre du Commerce et du Crédit Mobilier</>,
            <><strong>DFE</strong> — Déclaration Fiscale d&apos;Existence (DGI)</>,
            <><strong>IDU</strong> — Identifiant Unique de l&apos;entreprise</>,
            <>La fiche de notification d&apos;immatriculation employeur (CNPS)</>,
          ]}
        />
        <p>
          <strong>3. Gestion des régimes d&apos;investissement.</strong> Le CEPICI
          instruit les demandes d&apos;agrément au Code des Investissements, qui
          ouvre droit à des exonérations d&apos;IS, de TVA et de droits de douane
          pendant 5 à 15 ans selon la zone géographique et le secteur d&apos;activité.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment fonctionne le guichet unique du CEPICI ?">
        <p>
          Le guichet unique du CEPICI est accessible de deux façons : en
          présentiel à Abidjan (et dans certaines villes de l&apos;intérieur) et en
          ligne via le portail e-CEPICI.
        </p>
        <p>
          <strong>Dépôt en présentiel :</strong> le siège du CEPICI est situé à
          Abidjan au Plateau, rue Gourgas. Vous ou votre mandataire y déposez le
          dossier complet, les pièces sont vérifiées sur place, et un récépissé
          de dépôt vous est remis. Les documents finaux (RCCM, DFE, IDU) sont
          généralement remis dans les 24 à 72 heures ouvrées.
        </p>
        <p>
          <strong>Dépôt en ligne (e-CEPICI) :</strong> depuis 2016, le CEPICI a
          numérisé une grande partie de ses procédures. Il est possible de
          réserver le nom commercial, télécharger les formulaires et suivre
          l&apos;état de traitement du dossier. Pour la diaspora, le dossier peut
          être déposé par un mandataire local muni d&apos;une procuration légalisée.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels types d'entreprises peut-on créer au CEPICI ?">
        <p>
          Le CEPICI traite la création de toutes les formes juridiques reconnues
          par l&apos;Acte Uniforme OHADA :
        </p>
        <ArticleTable
          headers={["Forme juridique", "Capital minimum", "Associés", "Délai CEPICI"]}
          rows={[
            ["SARL", "100 000 FCFA", "1 à 50", "24 à 72 heures"],
            ["SARLU", "100 000 FCFA", "1 seul", "24 à 72 heures"],
            ["SA", "10 000 000 FCFA", "3 minimum", "5 à 10 jours"],
            ["Entreprise Individuelle", "Aucun", "1 seul", "24 heures"],
            ["GIE", "Aucun", "2 minimum", "3 à 5 jours"],
          ]}
        />
        <p>
          La SARL et la SARLU sont les formes les plus utilisées par les
          entrepreneurs ivoiriens en raison de leur capital faible, de leur
          responsabilité limitée et de leur délai de création court.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels documents faut-il fournir au CEPICI ?">
        <p>Pour une SARL ou SARLU, les pièces habituellement demandées sont :</p>
        <ArticleList
          items={[
            "Pièce d'identité en cours de validité de chaque associé et du gérant",
            "Acte de naissance ou extrait (moins de 3 mois)",
            "Extrait de casier judiciaire (moins de 3 mois)",
            "Statuts de la société rédigés et signés",
            "Justificatif de siège social (bail, attestation de domiciliation, titre de propriété)",
            "Plan de localisation du siège social",
            "Formulaire Unique Personne Morale",
            "Pour les SARL > 10 000 000 FCFA : Déclaration Notariée de Souscription et de Versement",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Combien coûtent les démarches au CEPICI ?">
        <p>
          À titre indicatif, pour une SARL avec un capital de 100 000 FCFA, les
          frais officiels au CEPICI se situent autour de{" "}
          <strong>50 000 à 80 000 FCFA</strong> en 2026. S&apos;y ajoutent les
          honoraires du cabinet comptable ou du conseil juridique qui vous
          accompagne, généralement compris entre{" "}
          <strong>100 000 et 400 000 FCFA</strong> selon la complexité du
          dossier.
        </p>
      </ArticleSection>

      <ArticleSection title="Le CEPICI gère-t-il aussi les régimes d'exonération fiscale ?">
        <p>
          Oui. Le CEPICI instruit les dossiers d&apos;agrément au Code des
          Investissements, qui permet aux entreprises éligibles de bénéficier :
        </p>
        <ArticleList
          items={[
            "Exonération d'Impôt sur les Sociétés (IS) pendant 5 à 15 ans selon la zone",
            "Exonération de TVA sur les équipements et matières premières importés",
            "Réduction des droits de douane",
            "Franchise de patente pendant la période d'exonération",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur le CEPICI">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une entreprise au CEPICI en ligne ?
            </h3>
            <p className="mt-2">
              Oui, partiellement. Le portail e-CEPICI permet de réserver le nom
              commercial, télécharger les formulaires et suivre le traitement.
              Le dépôt complet peut être effectué à distance via un mandataire
              local muni d&apos;une procuration légalisée.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Combien de temps prend la création d&apos;une SARL au CEPICI ?
            </h3>
            <p className="mt-2">
              Pour un dossier complet, le CEPICI délivre le RCCM, la DFE et
              l&apos;IDU en 24 à 72 heures ouvrées.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quelle est la différence entre le CEPICI et le RCCM ?
            </h3>
            <p className="mt-2">
              Le CEPICI est l&apos;organisme qui gère la procédure. Le RCCM est l&apos;un
              des documents délivrés à l&apos;issue de cette procédure.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une entreprise au CEPICI depuis la France ou le Canada ?
            </h3>
            <p className="mt-2">
              Oui. Des milliers de membres de la diaspora créent leur entreprise
              chaque année depuis l&apos;étranger, via un mandataire local muni d&apos;une
              procuration légalisée au consulat ivoirien.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le CEPICI est-il obligatoire pour créer une entreprise en CI ?
            </h3>
            <p className="mt-2">
              Oui. Il est impossible de créer une SARL, SA, SARLU ou GIE
              légalement sans passer par le CEPICI.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Créez votre entreprise avec un cabinet agréé CEPICI"
        description="Un cabinet comptable agréé OECCA-CI prépare votre dossier, dépose les pièces et récupère vos documents en votre nom. Comparez gratuitement jusqu'à 5 cabinets."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : CEPICI, Acte Uniforme OHADA, Code
        général des impôts CI 2026.
      </p>
    </>
  );
}