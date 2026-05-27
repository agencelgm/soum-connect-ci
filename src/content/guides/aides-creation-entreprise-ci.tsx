import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function AidesCreationEntrepriseCiContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Les créateurs d&apos;entreprise en Côte d&apos;Ivoire peuvent bénéficier de trois types
          d&apos;aides : les incitations fiscales du CEPICI (exonérations IS, TVA, droits de douane
          pour 5 à 15 ans), les financements et formations du FDFP et des organismes publics, et les
          apports en capital ou l&apos;accompagnement des fonds d&apos;investissement privés et
          incubateurs. Ces aides sont cumulables mais chacune a ses critères d&apos;éligibilité.
        </p>
      </ArticleCallout>

      <ArticleSection title="Type 1 — Les incitations fiscales du Code des Investissements (CEPICI)">
        <p>
          Le Code des Investissements ivoirien, géré par le CEPICI, offre des avantages fiscaux
          significatifs aux entreprises qui créent des emplois et investissent dans des secteurs
          prioritaires.
        </p>
        <p>
          <strong>Qui est éligible ?</strong> Les entreprises qui investissent dans des secteurs
          prioritaires (industrie, agriculture, tourisme, services à forte valeur ajoutée, TIC,
          santé, éducation) et dont le projet crée au moins 5 emplois permanents.
        </p>
        <p>
          <strong>Quels avantages ?</strong>
        </p>
        <ArticleList
          items={[
            "Exonération totale d'IS pendant 5 à 15 ans selon la zone",
            "Exonération de TVA sur les équipements et matières premières importés",
            "Réduction des droits de douane sur les intrants",
            "Franchise de patente pendant la période d'exonération",
          ]}
        />
        <ArticleTable
          headers={["Zone", "Localisation", "Durée d'exonération IS"]}
          rows={[
            ["Zone A", "Abidjan et grands centres urbains", "5 ans"],
            ["Zone B", "Villes secondaires", "7 ans"],
            ["Zone C", "Zones rurales", "10 ans"],
            ["Zone D", "Zones très enclavées", "15 ans"],
          ]}
        />
        <p>
          <strong>Comment en bénéficier :</strong> déposer un dossier d&apos;agrément au Code des
          Investissements au CEPICI (plan d&apos;affaires, plan de financement, état prévisionnel
          des emplois). Instruction : 1 à 3 mois.
        </p>
      </ArticleSection>

      <ArticleSection title="Type 2 — Les aides et financements publics">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">Le FDFP</h3>
        <p>
          Le Fonds de Développement de la Formation Professionnelle finance la formation des
          entrepreneurs et dirigeants de PME : gestion, comptabilité, commerce ou métiers
          techniques. Accessible via les centres de formation agréés, certains incubateurs et
          l&apos;AGEFOP.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les programmes de l&apos;État et institutions internationales
        </h3>
        <ArticleList
          items={[
            <>
              <strong>C2D</strong> (Contrat de Désendettement et de Développement) : programme
              franco-ivoirien pour agriculture, éducation et PME
            </>,
            <>
              <strong>Banque Mondiale et BAD</strong> : fonds dédiés aux PME (PPME, entrepreneuriat
              féminin)
            </>,
            <>
              <strong>AGEPME</strong> : garanties partielles de crédit pour faciliter l&apos;accès
              aux prêts bancaires
            </>,
          ]}
        />
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Financements bancaires spécifiques PME
        </h3>
        <ArticleList
          items={[
            "Banque Nationale d'Investissement (BNI) : programmes PME à taux préférentiels",
            "SIB : lignes de crédit pour entreprises exportatrices",
            "Banques islamiques : financements participatifs conformes aux principes islamiques",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Type 3 — Les incubateurs, accélérateurs et fonds d'investissement">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les incubateurs à Abidjan
        </h3>
        <ArticleList
          items={[
            <>
              <strong>CTIC Abidjan</strong> : incubateur tech phare avec programme
              d&apos;accélération
            </>,
            <>
              <strong>Village by CA</strong> (Crédit Agricole) : startups fintech et innovation
            </>,
            <>
              <strong>Orange Fab</strong> : programme d&apos;accélération d&apos;Orange CI
            </>,
            <>
              <strong>Incubateur HEC Abidjan</strong> : programme académique-entreprise
            </>,
          ]}
        />
        <p>
          Ces structures sélectionnent par candidature et offrent 3 à 6 mois d&apos;accompagnement
          intensif.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les fonds d&apos;investissement en amorçage
        </h3>
        <ArticleList
          items={[
            "Partech Africa : startups tech d'Afrique subsaharienne",
            "Orange Ventures : véhicule d'investissement pour startups africaines",
            "Kibo Fund : impact investing dans les PME africaines",
            "Savannah Fund : East/West Africa pour startups tech",
          ]}
        />
        <p>
          Tickets typiques : 50 000 à 500 000 USD en échange d&apos;une participation minoritaire au
          capital.
        </p>
      </ArticleSection>

      <ArticleSection title="Les aides sont-elles cumulables ?">
        <p>
          Oui, dans une certaine mesure. Un entrepreneur peut bénéficier simultanément d&apos;un
          agrément au Code des Investissements, d&apos;un accompagnement par un incubateur, et
          d&apos;un financement bancaire garanti par l&apos;AGEPME. En revanche, certains
          financements publics ne peuvent pas être combinés entre eux pour le même poste de dépense.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment accéder à ces aides concrètement ?">
        <p>
          <strong>Avantages fiscaux CEPICI :</strong> préparez un dossier d&apos;agrément avec un
          plan d&apos;affaires solide, accompagné par un cabinet comptable. Instruction : 1 à 3
          mois.
        </p>
        <p>
          <strong>Financements bancaires :</strong> votre cabinet peut préparer le dossier (bilan
          prévisionnel, plan de financement, business plan).
        </p>
        <p>
          <strong>Incubateurs :</strong> consultez les sites des incubateurs et postulez lors des
          appels à candidatures (1 à 2 fois par an).
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Un entrepreneur individuel peut-il bénéficier du Code des Investissements ?
            </h3>
            <p className="mt-2">
              Oui, sous conditions. L&apos;agrément est accessible aux personnes morales et à
              certains EI dont le projet remplit les critères d&apos;investissement minimum et de
              création d&apos;emplois.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Aides spécifiques pour les femmes entrepreneures en CI ?
            </h3>
            <p className="mt-2">
              Oui. Le PAFE (Programme d&apos;Appui aux Femmes Entrepreneurs), certains fonds de la
              BAD et de la Banque Mondiale, et AFAWA (Affirmative Finance Action for Women in
              Africa).
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Comment savoir si mon projet est éligible aux avantages CEPICI ?
            </h3>
            <p className="mt-2">
              Deux critères : secteur d&apos;activité figurant dans la liste des secteurs
              prioritaires, et création d&apos;au moins 5 emplois permanents.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Accédez aux bonnes aides avec un expert"
        description="Un cabinet comptable agréé OECCA-CI peut évaluer les aides auxquelles votre projet est éligible et préparer votre dossier CEPICI."
        ctaLabel="Recevoir 5 propositions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : CEPICI, FDFP, Banque Mondiale, BAD, incubateurs
        d&apos;Abidjan.
      </p>
    </>
  );
}
