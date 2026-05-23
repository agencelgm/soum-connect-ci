import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function ObligationsComptablesSarlCiContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Toute SARL en Côte d&apos;Ivoire est obligée de tenir une comptabilité
          conforme au référentiel SYSCOHADA, de produire des états financiers
          annuels (bilan, compte de résultat, TAFIRE), et de déposer une
          Déclaration Statistique et Fiscale (DSF) avant le 30 juin de chaque
          année auprès de la DGI. Ces obligations s&apos;appliquent dès le premier
          exercice, même en l&apos;absence de chiffre d&apos;affaires.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi les obligations comptables d'une SARL sont-elles si importantes ?">
        <p>
          En Côte d&apos;Ivoire, une SARL n&apos;a pas le choix : la comptabilité n&apos;est
          pas optionnelle. L&apos;Acte Uniforme OHADA sur le droit comptable et le
          Code Général des Impôts imposent des règles précises. Le non-respect
          de ces règles expose le dirigeant à des pénalités fiscales, à un
          redressement, et dans les cas graves, à une mise en cause de sa
          responsabilité personnelle.
        </p>
      </ArticleSection>

      <ArticleSection title="La tenue comptable SYSCOHADA : qu'est-ce que c'est ?">
        <p>
          Le <strong>SYSCOHADA</strong> (Système Comptable OHADA) est le
          référentiel comptable applicable à toutes les entreprises des États
          membres de l&apos;OHADA, dont la Côte d&apos;Ivoire. Il définit le plan de
          comptes, les règles de saisie des opérations, et le format des états
          financiers.
        </p>
        <p>Concrètement, la tenue comptable SYSCOHADA implique :</p>
        <ArticleList
          items={[
            "Saisie chronologique de toutes les opérations dans les journaux (ventes, achats, banque, caisse, OD)",
            "Report dans le grand livre et production de la balance",
            "Conservation des pièces justificatives pendant 10 ans",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quels états financiers une SARL doit-elle produire chaque année ?">
        <p>
          À la clôture de chaque exercice (généralement le 31 décembre), une
          SARL doit produire trois états financiers annuels obligatoires :
        </p>
        <ArticleList
          items={[
            <><strong>Le bilan</strong> — photographie de la situation financière à la clôture</>,
            <><strong>Le compte de résultat</strong> — récapitulatif des produits, charges et résultat</>,
            <><strong>Le TAFIRE</strong> — Tableau de Financement des Ressources et des Emplois (spécifique SYSCOHADA)</>,
          ]}
        />
        <p>
          Ces trois états doivent être signés par l&apos;expert-comptable agréé
          OECCA-CI qui assure la mission de révision comptable.
        </p>
      </ArticleSection>

      <ArticleSection title="Qu'est-ce que la DSF et quand la déposer ?">
        <p>
          La <strong>DSF</strong> — Déclaration Statistique et Fiscale — est un
          document annuel qui regroupe les états financiers et les éléments
          fiscaux nécessaires pour calculer l&apos;IS et la patente.
        </p>
        <p>
          <strong>Date limite :</strong> avant le <strong>30 juin</strong> de
          l&apos;année suivant la clôture. Seul un expert-comptable agréé OECCA-CI
          peut signer la DSF.
        </p>
        <ArticleCallout variant="warning" title="Pénalités">
          <p>
            Une DSF déposée en retard entraîne une majoration de 25 % des
            droits dus. En cas d&apos;absence de dépôt, la DGI peut procéder à une
            taxation d&apos;office avec des pénalités pouvant atteindre 100 %.
          </p>
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quelles déclarations fiscales mensuelles une SARL doit-elle faire ?">
        <ArticleTable
          headers={["Déclaration", "Contenu", "Échéance"]}
          rows={[
            ["TVA", "TVA collectée − TVA déductible", "15 du mois suivant"],
            ["ITS", "Impôt sur les Traitements et Salaires", "15 du mois suivant"],
            ["CNPS", "Cotisations sociales employeur + salarié", "15 du mois suivant"],
            ["Acomptes IS", "Acomptes trimestriels d'IS", "15 avril, juin, sept., déc."],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="L'audit légal est-il obligatoire pour une SARL ?">
        <p>
          L&apos;audit légal n&apos;est pas obligatoire pour toutes les SARL. Il devient
          obligatoire dans deux situations :
        </p>
        <ArticleList
          items={[
            <>Quand la SARL dépasse <strong>deux des trois seuils</strong> : CA &gt; 500 M FCFA, total bilan &gt; 250 M FCFA, effectif &gt; 50 salariés</>,
            <>Si les statuts prévoient expressément la nomination d&apos;un commissaire aux comptes</>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Peut-on externaliser la comptabilité d'une SARL ?">
        <p>
          Oui, et c&apos;est la pratique la plus courante. Un cabinet comptable
          agréé OECCA-CI prend en charge :
        </p>
        <ArticleList
          items={[
            "Tenue mensuelle des livres comptables",
            "Déclarations fiscales mensuelles (TVA, ITS, CNPS, acomptes IS)",
            "Production des états financiers annuels",
            "Signature et dépôt de la DSF",
            "Conseil fiscal tout au long de l'année",
          ]}
        />
        <p>
          Le coût d&apos;un forfait comptable mensuel pour une SARL à Abidjan se
          situe entre <strong>50 000 et 300 000 FCFA/mois</strong> selon le
          volume d&apos;activité.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur les obligations comptables">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Une SARL sans activité doit-elle quand même faire sa comptabilité ?
            </h3>
            <p className="mt-2">
              Oui. Même une SARL sans CA doit tenir une comptabilité minimale
              et déposer sa DSF annuelle (DSF « néant » possible).
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Qui peut signer la DSF d&apos;une SARL en Côte d&apos;Ivoire ?
            </h3>
            <p className="mt-2">
              Uniquement un expert-comptable ou comptable agréé inscrit au
              tableau de l&apos;OECCA-CI. Le gérant ne peut pas signer lui-même.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Combien de temps faut-il conserver les documents comptables ?
            </h3>
            <p className="mt-2">
              <strong>10 ans</strong> à compter de la clôture de l&apos;exercice
              auquel ils se rapportent (Acte Uniforme OHADA).
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quelles sont les pénalités pour absence de comptabilité ?
            </h3>
            <p className="mt-2">
              Taxation d&apos;office avec majorations de 100 % des droits estimés.
              Le dirigeant peut être mis en cause personnellement pour faute de
              gestion.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Externalisez votre comptabilité à un cabinet agréé OECCA-CI"
        description="DSF, déclarations mensuelles, états financiers — un cabinet prend tout en charge pour que vous vous concentriez sur votre activité."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA sur le droit
        comptable, Code Général des Impôts CI 2026, OECCA-CI.
      </p>
    </>
  );
}