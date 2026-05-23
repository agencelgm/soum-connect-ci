import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CnpsCoteDivoireEmployeursContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          La CNPS (Caisse Nationale de Prévoyance Sociale) est l&apos;organisme de
          sécurité sociale des travailleurs du secteur privé en Côte d&apos;Ivoire.
          Tout employeur doit s&apos;y immatriculer dès le premier salarié, déclarer
          et payer les cotisations mensuellement avant le 15 du mois suivant.
          Le taux de cotisation patronale tourne autour de 18,45 % de la masse
          salariale brute.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce que la CNPS et pourquoi est-elle obligatoire ?">
        <p>
          La <strong>CNPS</strong> gère la protection sociale des travailleurs
          du secteur privé en Côte d&apos;Ivoire. Elle couvre trois branches :
        </p>
        <ArticleList
          items={[
            "Prestations familiales (allocations familiales, indemnités de maternité)",
            "Accidents du travail et maladies professionnelles (AT/MP)",
            "Retraite (pensions de vieillesse, d'invalidité et de survivants)",
          ]}
        />
        <p>
          L&apos;affiliation est obligatoire dès le recrutement du premier salarié.
          Aucun seuil d&apos;effectif ne dispense l&apos;employeur.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment s'immatriculer à la CNPS en tant qu'employeur ?">
        <p>
          L&apos;immatriculation se fait dans les <strong>8 jours</strong> suivant
          le recrutement du premier salarié. En pratique, elle est souvent
          intégrée au processus du guichet unique du CEPICI.
        </p>
        <p><strong>Documents nécessaires :</strong></p>
        <ArticleList
          items={[
            "Formulaire d'immatriculation employeur",
            "Copie du RCCM et de la DFE",
            "Pièce d'identité du dirigeant",
            "Justificatif de domiciliation du siège social",
          ]}
        />
        <p>
          L&apos;immatriculation donne un <strong>numéro d&apos;employeur CNPS</strong>.
          Chaque salarié reçoit également un numéro d&apos;immatriculation
          individuel.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les taux de cotisation CNPS en 2026 ?">
        <ArticleTable
          headers={["Branche", "Part patronale", "Part salariale", "Total"]}
          rows={[
            ["Prestations familiales", "5,75 %", "0 %", "5,75 %"],
            ["Accidents du travail*", "Variable (2 à 5 %)", "0 %", "Variable"],
            ["Retraite", "7,70 %", "6,30 %", "14,00 %"],
            ["Total indicatif", "~18,45 %", "6,30 %", "~24,75 %"],
          ]}
          caption="*Le taux AT/MP varie selon le secteur d'activité et le niveau de risque."
        />
        <p>
          <strong>Plafond :</strong> les cotisations s&apos;appliquent dans la
          limite d&apos;un plafond mensuel de <strong>1 647 315 FCFA</strong> par
          salarié en 2026.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment calculer les cotisations CNPS d'un salarié ?">
        <p>Exemple pour un salarié avec un salaire brut mensuel de 500 000 FCFA :</p>
        <p><strong>Part patronale :</strong></p>
        <ArticleList
          items={[
            "Prestations familiales : 500 000 × 5,75 % = 28 750 FCFA",
            "AT/MP (taux 2,5 %) : 500 000 × 2,5 % = 12 500 FCFA",
            "Retraite : 500 000 × 7,70 % = 38 500 FCFA",
            "Total part patronale : 79 750 FCFA",
          ]}
        />
        <p><strong>Part salariale :</strong></p>
        <ArticleList
          items={[
            "Retraite : 500 000 × 6,30 % = 31 500 FCFA (déduite du salaire net)",
          ]}
        />
        <p>
          <strong>Total CNPS versé par l&apos;employeur :</strong> 111 250 FCFA.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment déclarer et payer les cotisations CNPS ?">
        <p>
          Déclarations et paiements mensuels, avant le <strong>15 du mois suivant</strong>.
        </p>
        <ArticleList
          ordered
          items={[
            "Établir le tableau de paie du mois",
            "Calculer les parts patronale et salariale",
            "Remplir le bordereau de déclaration CNPS",
            "Payer avant le 15 du mois suivant (virement ou agence CNPS)",
            "Conserver une copie du bordereau et du justificatif",
          ]}
        />
        <p>
          En fin d&apos;année, un <strong>état récapitulatif annuel (état 301)</strong>
          {" "}doit être déposé avant le <strong>31 janvier</strong>.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles sont les pénalités en cas de retard ou de non-déclaration ?">
        <ArticleList
          items={[
            <><strong>Majoration de 10 %</strong> dès le premier mois de retard</>,
            <><strong>+ 3 % par mois</strong> de retard supplémentaire</>,
            <>En cas de fraude, pénalités pouvant atteindre <strong>le double</strong> des sommes éludées</>,
          ]}
        />
        <p>
          Les contrôles CNPS portent généralement sur les <strong>trois dernières années</strong>.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles obligations l'employeur a-t-il envers ses salariés ?">
        <ArticleList
          items={[
            "Immatriculer chaque salarié dans les 8 jours suivant son embauche",
            "Remettre la carte CNPS au salarié",
            "Déclarer tout accident du travail dans les 48 heures",
            "Ne pas déduire la part patronale du salaire — seule la part salariale (6,3 %) peut être déduite",
          ]}
        />
        <ArticleCallout variant="warning">
          <p>
            Un salarié non déclaré ne bénéficie d&apos;aucune protection. En cas
            d&apos;accident grave, l&apos;employeur est personnellement responsable des
            réparations.
          </p>
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur la CNPS">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              À partir de combien de salariés doit-on s&apos;affilier ?
            </h3>
            <p className="mt-2">
              Dès le <strong>premier salarié</strong>. Aucun seuil d&apos;effectif ne
              dispense l&apos;employeur, même à temps partiel.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Les gérants de SARL sont-ils affiliés à la CNPS ?
            </h3>
            <p className="mt-2">
              Un gérant majoritaire (&gt; 50 % du capital) est non salarié et ne
              cotise pas. Un gérant minoritaire ou égalitaire peut être affilié
              s&apos;il est rémunéré avec un lien de subordination.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Les stagiaires doivent-ils être déclarés ?
            </h3>
            <p className="mt-2">
              Les stagiaires rémunérés au-delà d&apos;un certain seuil doivent être
              affiliés. Les stagiaires non rémunérés ne sont généralement pas
              soumis aux cotisations.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on rectifier une déclaration CNPS erronée ?
            </h3>
            <p className="mt-2">
              Oui, via une déclaration rectificative. Si la rectification
              entraîne un complément, les pénalités s&apos;appliquent à partir de la
              date initiale.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Déléguez la gestion CNPS à un cabinet comptable agréé"
        description="Déclarations mensuelles, bordereaux, état 301 annuel, accidents du travail — un cabinet comptable agréé OECCA-CI prend tout en charge."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Code du Travail ivoirien, CNPS Côte
        d&apos;Ivoire, taux de cotisation 2026.
      </p>
    </>
  );
}