import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CapitalMinimumSarlOhadaContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Depuis la révision de l&apos;Acte Uniforme OHADA sur les sociétés
          commerciales, le capital minimum d&apos;une SARL en Côte d&apos;Ivoire est de
          {" "}<strong>100 000 FCFA</strong> (environ 150 €). Ce montant
          s&apos;applique aussi bien à la SARL classique qu&apos;à la SARLU. Le capital
          peut être libéré en numéraire ou en nature.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi la révision OHADA a-t-elle réduit le capital minimum des SARL ?">
        <p>
          Avant la révision entrée en vigueur en 2014, le capital minimum d&apos;une
          SARL était de 1 000 000 FCFA. Cette barrière freinait la
          formalisation des petites entreprises.
        </p>
        <p>
          La révision a ramené ce seuil à <strong>100 000 FCFA</strong>, pour
          faciliter l&apos;accès à la formalité aux micro-entrepreneurs et
          rapprocher l&apos;Afrique francophone des standards internationaux.
        </p>
      </ArticleSection>

      <ArticleSection title="Quel est le capital minimum légal en CI en 2026 ?">
        <ArticleTable
          headers={["Forme juridique", "Capital minimum"]}
          rows={[
            ["SARL (2 à 50 associés)", "100 000 FCFA"],
            ["SARLU (associé unique)", "100 000 FCFA"],
            ["SA (Société Anonyme)", "10 000 000 FCFA"],
            ["Entreprise Individuelle", "Aucun"],
            ["GIE", "Aucun"],
          ]}
        />
        <p>
          Le capital minimum de 100 000 FCFA est un plancher légal, pas une
          recommandation. La pratique recommande souvent un capital plus élevé.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment libérer le capital d'une SARL au CEPICI ?">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Libération en numéraire
        </h3>
        <p>
          Les associés déposent le montant sur un compte bancaire bloqué au nom
          de la société en formation. Pour une SARL &lt; 10 M FCFA,{" "}
          <strong>25 % minimum</strong> doit être libéré à la création, le
          solde dans les <strong>2 ans</strong>. Pour une SARL &gt; 10 M FCFA,{" "}
          <strong>la moitié</strong> doit être libérée à la création.
        </p>
        <p>
          Exemple : pour une SARL avec capital de 1 000 000 FCFA, déposer au
          minimum 250 000 FCFA à la création.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Libération en nature (apport d&apos;actifs)
        </h3>
        <p>
          Les associés peuvent apporter équipements, véhicules, fonds de
          commerce, brevets, évalués par un <strong>commissaire aux apports</strong>
          {" "}(expert-comptable agréé OECCA-CI). La surévaluation engage la
          responsabilité des associés.
        </p>
      </ArticleSection>

      <ArticleSection title="Quel capital fixer en pratique au-delà du minimum légal ?">
        <p>100 000 FCFA est légalement suffisant mais souvent insuffisant en pratique :</p>
        <ArticleList
          items={[
            <><strong>Crédibilité bancaire</strong> — capital recommandé &gt;= 500 000 à 1 M FCFA pour solliciter du crédit.</>,
            <><strong>Crédibilité commerciale</strong> — un capital modeste peut être perçu comme un signe de fragilité dans les appels d&apos;offres.</>,
            <><strong>Couverture des premiers investissements</strong> — le capital doit couvrir équipements, stocks, loyer en avance.</>,
          ]}
        />
        <p><strong>Règle pratique recommandée :</strong></p>
        <ArticleList
          items={[
            "Activité de services sans stocks : 100 000 à 500 000 FCFA",
            "Activité commerciale avec stocks : 500 000 à 2 000 000 FCFA",
            "Activité industrielle ou BTP : 2 000 000 à 10 000 000 FCFA et plus",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Le capital social peut-il être augmenté après la création ?">
        <p>Oui. L&apos;augmentation peut se faire par :</p>
        <ArticleList
          items={[
            "Apport de nouveaux fonds par les associés existants",
            "Incorporation des bénéfices au capital (capitalisation des réserves)",
            "Entrée de nouveaux associés qui apportent des fonds",
          ]}
        />
        <p>
          L&apos;augmentation nécessite une modification des statuts et une nouvelle
          immatriculation modificative au CEPICI.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur le capital social d'une SARL en CI">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une SARL avec 100 000 FCFA en Côte d&apos;Ivoire ?
            </h3>
            <p className="mt-2">
              Oui. Capital minimum légal. Il faut déposer au moins 25 %, soit
              25 000 FCFA, sur un compte bancaire bloqué.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le capital est-il accessible pour payer les charges de la société ?
            </h3>
            <p className="mt-2">
              Non immédiatement. Le capital est bloqué jusqu&apos;à
              l&apos;immatriculation. Après remise du RCCM et de l&apos;IDU, les fonds
              deviennent disponibles.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Un associé peut-il apporter des équipements au lieu d&apos;argent ?
            </h3>
            <p className="mt-2">
              Oui, c&apos;est un apport en nature évalué par un commissaire aux
              apports. La surévaluation engage la responsabilité solidaire des
              associés pendant 5 ans.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le capital social protège-t-il les créanciers ?
            </h3>
            <p className="mt-2">
              Il garantit un engagement minimal. En cas de dettes, les
              créanciers ne peuvent pas réclamer au-delà des actifs de la
              société, sauf cautions personnelles.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Créez votre SARL avec le bon capital dès le départ"
        description="Un cabinet comptable agréé OECCA-CI vous conseille sur le montant adapté et prend en charge tout le processus de création au CEPICI."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA sur les sociétés
        commerciales (révisé 2014), CEPICI.
      </p>
    </>
  );
}