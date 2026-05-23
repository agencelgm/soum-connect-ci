import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function TvaCoteDivoirePmeContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          La TVA en Côte d&apos;Ivoire s&apos;applique au taux standard de 18 % sur la
          majorité des biens et services. Toute entreprise soumise au régime
          réel (CA HT supérieur à 200 millions FCFA) ou au régime réel
          simplifié (entre 50 et 200 millions FCFA) est assujettie à la TVA et
          doit la déclarer mensuellement ou trimestriellement à la DGI.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce que la TVA en Côte d'Ivoire ?">
        <p>
          La <strong>TVA</strong> (Taxe sur la Valeur Ajoutée) est un impôt
          indirect collecté à chaque étape de la chaîne de production et de
          distribution. En Côte d&apos;Ivoire, la TVA est régie par le Code Général
          des Impôts (CGI) et administrée par la Direction Générale des Impôts
          (DGI).
        </p>
        <p>
          Concrètement, votre entreprise collecte la TVA sur ses ventes et la
          reverse à l&apos;État, déduction faite de la TVA qu&apos;elle a elle-même payée
          sur ses achats professionnels. Seule la différence — appelée TVA
          nette — est versée à la DGI.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les taux de TVA applicables en Côte d'Ivoire ?">
        <ArticleTable
          headers={["Taux", "Application"]}
          rows={[
            ["18 % (standard)", "Majorité des biens et services"],
            ["9 % (réduit)", "Certains produits alimentaires de base (lait, pâtes, eau)"],
            ["0 % (exonérations)", "Exportations, produits médicaux, certains intrants agricoles"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelle entreprise est assujettie à la TVA en CI ?">
        <ArticleTable
          headers={["Régime", "CA HT annuel", "TVA"]}
          rows={[
            ["Taxe d'Entreprise Forfaitaire (TEF)", "Moins de 50 millions FCFA", "Non assujettie"],
            ["Régime Réel Simplifié", "50 à 200 millions FCFA", "Assujettie (déclaration trimestrielle possible)"],
            ["Régime Réel Normal", "Plus de 200 millions FCFA", "Assujettie (déclaration mensuelle obligatoire)"],
          ]}
        />
        <ArticleCallout variant="warning" title="Point d'attention">
          <p>
            Une entreprise au régime réel normal ne peut pas déclarer
            trimestriellement. Si votre CA dépasse le seuil en cours d&apos;année,
            vous basculez automatiquement vers le régime supérieur.
          </p>
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Comment fonctionne la déclaration de TVA à la DGI ?">
        <p>
          La déclaration de TVA se dépose sur la plateforme de télédéclaration
          de la DGI (impots.gouv.ci), au plus tard le <strong>15 du mois
          suivant</strong> pour le régime réel normal. Pour le régime réel
          simplifié avec option trimestrielle, l&apos;échéance est le 15 du mois
          suivant la fin du trimestre.
        </p>
        <ArticleList
          ordered
          items={[
            <><strong>Calculer la TVA collectée</strong> — 18 % du HT de chaque facture de vente.</>,
            <><strong>Calculer la TVA déductible</strong> — TVA payée sur achats professionnels du mois.</>,
            <><strong>Calculer la TVA nette</strong> — collectée − déductible.</>,
            <><strong>Télédéclarer et payer</strong> via la plateforme DGI.</>,
          ]}
        />
        <p>
          Si le résultat est négatif (crédit de TVA), ce crédit peut être
          imputé sur la déclaration suivante ou, sous certaines conditions,
          remboursé par l&apos;État.
        </p>
      </ArticleSection>

      <ArticleSection title="Qu'est-ce qui est déductible de la TVA ?">
        <p>La TVA sur les achats professionnels est déductible si :</p>
        <ArticleList
          items={[
            "L'achat est utilisé pour réaliser des opérations soumises à la TVA",
            "La facture mentionne explicitement la TVA et le numéro de contribuable du fournisseur",
            "La facture correspond à une dépense réelle de l'exercice en cours",
          ]}
        />
        <p>
          <strong>Déductible :</strong> marchandises, loyers de bureaux,
          honoraires de prestataires, téléphonie professionnelle, équipements
          de bureau.
        </p>
        <p>
          <strong>Non déductible :</strong> dépenses personnelles mélangées,
          achats auprès de fournisseurs au régime TEF, dépenses de
          représentation au-delà de certains plafonds.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles sont les pénalités en cas de retard de TVA ?">
        <ArticleList
          items={[
            <><strong>Majoration de 25 %</strong> du montant dû dès le premier jour de retard</>,
            <><strong>Intérêts de retard</strong> calculés au taux légal</>,
            <>En cas de taxation d&apos;office, pénalités pouvant atteindre <strong>100 %</strong></>,
          ]}
        />
        <p>
          En cas de contrôle fiscal DGI, les redressements peuvent porter sur
          les trois derniers exercices.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment optimiser légalement sa TVA ?">
        <ArticleList
          items={[
            "Tenir un tableau de suivi mensuel des factures d'achat avec TVA",
            "Vérifier le régime de ses fournisseurs (TEF ou réel)",
            "Demander le remboursement des crédits de TVA dormants",
            "Déléguer à un cabinet comptable agréé OECCA-CI",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur la TVA en Côte d'Ivoire">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quel est le taux de TVA en Côte d&apos;Ivoire en 2026 ?
            </h3>
            <p className="mt-2">
              Le taux standard est de <strong>18 %</strong>. Un taux réduit de
              9 % s&apos;applique à certains produits alimentaires de base. Les
              exportations sont taxées à 0 % (exonération avec droit à
              déduction).
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Une SARL nouvellement créée est-elle immédiatement assujettie à la TVA ?
            </h3>
            <p className="mt-2">
              Oui, dès sa création, une SARL est soumise au régime réel et donc
              assujettie à la TVA, même sans CA. La première déclaration
              mensuelle est obligatoire, même à zéro.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on récupérer la TVA payée avant le début d&apos;activité ?
            </h3>
            <p className="mt-2">
              Oui. La TVA sur les investissements et dépenses de démarrage est
              récupérable via une déclaration de TVA initiale, à condition que
              ces dépenses soient liées à l&apos;activité taxable future.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              La TVA sur les loyers de bureaux est-elle déductible ?
            </h3>
            <p className="mt-2">
              Oui, si le local est utilisé exclusivement à des fins
              professionnelles. Si mixte, seule la partie professionnelle est
              déductible.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Sécurisez vos déclarations TVA avec un cabinet agréé"
        description="La TVA mensuelle est l'une des premières sources de pénalités pour les PME ivoiriennes. Comparez 5 cabinets comptables agréés OECCA-CI gratuitement."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Code Général des Impôts CI 2026, DGI
        Côte d&apos;Ivoire.
      </p>
    </>
  );
}