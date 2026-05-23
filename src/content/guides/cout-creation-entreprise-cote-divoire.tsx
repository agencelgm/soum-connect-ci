import {
  ArticleSection,
  ArticleCallout,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CoutCreationEntrepriseContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Le coût total de création d&apos;une entreprise en Côte d&apos;Ivoire varie de{" "}
          <strong>250 000 à 800 000 FCFA</strong> pour une SARL standard, hors
          capital social. Ce montant comprend les frais officiels CEPICI (50
          000 à 150 000 FCFA), les honoraires du cabinet comptable (100 000 à
          400 000 FCFA) et les frais annexes. Pour une SA, le budget monte à 2
          000 000 à 5 000 000 FCFA en raison des honoraires de notaire.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi le coût de création varie-t-il autant ?">
        <p>Trois facteurs expliquent la variabilité :</p>
        <p>
          <strong>La forme juridique :</strong> une EI coûte moins cher qu&apos;une
          SARL, qui coûte beaucoup moins cher qu&apos;une SA. La SA requiert
          l&apos;intervention obligatoire d&apos;un notaire.
        </p>
        <p>
          <strong>Le prestataire choisi :</strong> les honoraires varient du
          simple au triple selon la taille, la réputation et la localisation du
          cabinet. Les prix très bas pratiqués par des prestataires non agréés
          sont risqués.
        </p>
        <p>
          <strong>Les options incluses :</strong> certains cabinets proposent un
          tarif « de base », d&apos;autres un pack complet (domiciliation,
          accompagnement bancaire).
        </p>
      </ArticleSection>

      <ArticleSection title="Coût détaillé pour une SARL">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Frais officiels CEPICI
        </h3>
        <ArticleTable
          headers={["Capital social", "Frais officiels CEPICI estimés"]}
          rows={[
            ["100 000 FCFA", "50 000 – 70 000 FCFA"],
            ["500 000 FCFA", "60 000 – 90 000 FCFA"],
            ["1 000 000 FCFA", "70 000 – 120 000 FCFA"],
            ["5 000 000 FCFA", "100 000 – 150 000 FCFA"],
          ]}
        />
        <h3 className="font-heading font-semibold text-lg text-foreground mt-6">
          Honoraires du cabinet comptable
        </h3>
        <ArticleTable
          headers={["Type de cabinet", "Honoraires de création SARL"]}
          rows={[
            ["Cabinet informel (non agréé)", "50 000 – 100 000 FCFA (risqué)"],
            ["Petit cabinet agréé OECCA-CI", "100 000 – 200 000 FCFA"],
            ["Cabinet de taille moyenne", "150 000 – 300 000 FCFA"],
            ["Grand cabinet / Plateau", "250 000 – 500 000 FCFA"],
          ]}
        />
        <p>
          <strong>Notre recommandation :</strong> ne choisissez pas uniquement
          sur le prix. Un cabinet non agréé ne peut pas signer la DSF.
        </p>
      </ArticleSection>

      <ArticleSection title="Coûts annexes à prévoir">
        <p>
          <strong>Domiciliation :</strong> 30 000 à 100 000 FCFA/mois selon le
          quartier. Prévoir 3 mois minimum (90 000 à 300 000 FCFA).
        </p>
        <p>
          <strong>Ouverture de compte bancaire :</strong> 0 à 50 000 FCFA selon
          les banques.
        </p>
        <p>
          <strong>Tampons :</strong> 15 000 à 35 000 FCFA.
        </p>
      </ArticleSection>

      <ArticleSection title="Budget total pour une SARL">
        <ArticleTable
          headers={["Poste", "Fourchette"]}
          rows={[
            ["Frais CEPICI officiels", "50 000 – 150 000 FCFA"],
            ["Honoraires cabinet comptable", "100 000 – 400 000 FCFA"],
            ["Domiciliation (3 mois min.)", "90 000 – 300 000 FCFA"],
            ["Compte bancaire", "0 – 50 000 FCFA"],
            ["Tampons et divers", "15 000 – 35 000 FCFA"],
            ["Total hors capital social", "255 000 – 935 000 FCFA"],
          ]}
        />
        <p>
          Pour une SARL classique avec accompagnement de qualité et
          domiciliation, prévoyez un budget d&apos;environ{" "}
          <strong>400 000 à 600 000 FCFA</strong> hors capital.
        </p>
      </ArticleSection>

      <ArticleSection title="Coût pour une entreprise individuelle (EI)">
        <p>
          L&apos;EI est la forme la moins coûteuse. Frais CEPICI : 30 000 à 60 000
          FCFA. Honoraires de cabinet : 60 000 à 150 000 FCFA.
        </p>
        <p>
          Budget total EI (hors domiciliation) : <strong>90 000 – 250 000 FCFA</strong>.
        </p>
      </ArticleSection>

      <ArticleSection title="Coût pour une SA (Société Anonyme)">
        <p>
          La SA est beaucoup plus coûteuse en raison de :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Intervention obligatoire d&apos;un notaire (500 000 à 1 500 000 FCFA)</li>
          <li>Capital minimum de 10 millions FCFA</li>
          <li>Commissaire aux comptes obligatoire dès la constitution</li>
        </ul>
        <p>
          Budget total SA :{" "}
          <strong>2 000 000 – 5 700 000 FCFA hors capital social</strong>.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une entreprise gratuitement en CI ?
            </h3>
            <p className="mt-2">
              Non. Les frais officiels CEPICI sont incompressibles. Certains
              dispositifs d&apos;appui (FDFP, incubateurs) peuvent couvrir tout ou
              partie des frais pour les projets éligibles.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le capital social fait-il partie du coût de création ?
            </h3>
            <p className="mt-2">
              Non. Le capital reste dans la société et finance l&apos;exploitation.
              Seuls les frais de création (CEPICI, cabinet, notaire) sont des
              coûts définitifs.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on payer les frais CEPICI en plusieurs fois ?
            </h3>
            <p className="mt-2">
              Non. Les frais officiels CEPICI sont réglés en une fois au dépôt
              du dossier. Les honoraires du cabinet peuvent parfois être
              négociés en deux versements.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Comparez les tarifs de création — 5 devis gratuits en 48h"
        description="Plutôt que de choisir le premier cabinet venu, comparez gratuitement jusqu'à 5 devis de cabinets agréés OECCA-CI."
        ctaLabel="Comparer les tarifs"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : CEPICI, OECCA-CI, grilles tarifaires
        des cabinets partenaires.
      </p>
    </>
  );
}