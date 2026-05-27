import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function EntrepriseIndividuelleVsSarlContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Une entreprise individuelle (EI) est simple et rapide à créer mais expose le dirigeant à
          une responsabilité illimitée sur ses biens personnels. Une SARL protège le patrimoine
          personnel, donne une image plus professionnelle et offre une fiscalité parfois plus
          avantageuse à partir d&apos;un CA annuel de 50 millions FCFA. La transformation se fait
          via le CEPICI avec l&apos;accompagnement d&apos;un cabinet comptable.
        </p>
      </ArticleCallout>

      <ArticleSection title="Quelles sont les différences fondamentales entre EI et SARL en CI ?">
        <p>
          L&apos;EI et la SARL diffèrent sur trois points : la responsabilité, la fiscalité et la
          crédibilité commerciale.
        </p>
        <ArticleTable
          headers={["Critère", "Entreprise Individuelle", "SARL"]}
          rows={[
            ["Capital minimum", "Aucun", "100 000 FCFA"],
            ["Responsabilité", "Illimitée (biens personnels)", "Limitée au capital"],
            ["Fiscalité", "BIC ou TEF", "IS 25 %"],
            ["Associés", "1 seul", "1 à 50"],
            ["Comptabilité", "Simplifiée possible", "SYSCOHADA obligatoire"],
            ["DSF", "Obligatoire", "Obligatoire"],
            ["Délai de création", "24 heures", "24 à 72 heures"],
            ["Image commerciale", "Limitée", "Professionnelle"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quand est-il judicieux de rester en entreprise individuelle ?">
        <p>L&apos;EI est adaptée dans trois situations précises :</p>
        <ArticleList
          items={[
            "Activité de démarrage sans risque financier significatif",
            "Petite activité de service sans salariés (CA < 25-30 M FCFA)",
            "Activité transitoire avant une structure plus solide",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quand faut-il passer de l'EI à la SARL ?">
        <p>Cinq signaux indiquent qu&apos;il est temps de basculer :</p>
        <ArticleList
          ordered
          items={[
            <>
              <strong>Le CA dépasse 50 millions FCFA</strong> — bascule au régime réel simplifié et
              obligations renforcées.
            </>,
            <>
              <strong>Vous travaillez avec de grands comptes ou bailleurs internationaux</strong> —
              un RCCM de société est souvent prérequis.
            </>,
            <>
              <strong>Vous investissez et prenez des crédits</strong> — la SARL protège votre
              patrimoine personnel.
            </>,
            <>
              <strong>Vous voulez associer des partenaires</strong> — l&apos;EI n&apos;admet
              qu&apos;un seul dirigeant.
            </>,
            <>
              <strong>Vous voulez optimiser votre fiscalité</strong> — l&apos;IS à 25 % +
              rémunération de gérant déductible.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment transformer une EI en SARL en Côte d'Ivoire ?">
        <p>
          La transformation est techniquement une dissolution de l&apos;EI et une création de SARL,
          avec apport des actifs de l&apos;EI à la nouvelle société.
        </p>
        <ArticleList
          ordered
          items={[
            "Faire évaluer l'actif de l'EI (stocks, équipements, clientèle)",
            "Constituer le capital de la SARL (au minimum 100 000 FCFA)",
            "Rédiger les statuts avec les actifs apportés",
            "Déposer le dossier au CEPICI",
            "Fermer le compte bancaire EI, ouvrir un compte SARL",
            "Informer clients, fournisseurs et administration",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Combien coûte la transformation d'une EI en SARL ?">
        <p>
          Honoraires cabinet comptable : <strong>150 000 à 400 000 FCFA</strong> selon la
          complexité. Frais CEPICI : <strong>50 000 à 80 000 FCFA</strong>. S&apos;ajoutent les
          coûts indirects : nouveau compte bancaire, mise à jour des tampons, contrats à renouveler.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes EI vs SARL">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une SARL avec un seul associé en Côte d&apos;Ivoire ?
            </h3>
            <p className="mt-2">
              Oui. La SARLU (associé unique) offre les mêmes protections qu&apos;une SARL classique.
              C&apos;est la forme idéale pour passer de l&apos;EI à une société sans trouver
              d&apos;associés.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              L&apos;entreprise individuelle paie-t-elle moins d&apos;impôts que la SARL ?
            </h3>
            <p className="mt-2">
              Pas nécessairement. L&apos;EI est soumise au BIC (barème progressif). La SARL paie
              l&apos;IS à 25 %. Au-delà d&apos;un certain niveau de bénéfices, la SARL est
              généralement plus avantageuse.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on garder sa clientèle en passant de l&apos;EI à la SARL ?
            </h3>
            <p className="mt-2">
              Oui, mais il faut informer chaque client et fournisseur et mettre à jour les contrats
              en cours via une novation ou un avenant.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quel est le minimum de capital pour créer une SARL ?
            </h3>
            <p className="mt-2">
              <strong>100 000 FCFA</strong> depuis la révision de l&apos;Acte Uniforme OHADA.
              Libérable en numéraire ou en nature.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Faites le bon choix de structure avec un expert"
        description="Un cabinet comptable agréé OECCA-CI peut simuler les deux scénarios et vous recommander la structure adaptée."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA, Code Général des Impôts CI 2026.
      </p>
    </>
  );
}
