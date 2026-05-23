import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function DomiciliationEntrepriseAbidjanContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          La domiciliation consiste à attribuer à votre entreprise une adresse
          légale professionnelle fournie par un prestataire agréé, sans louer
          de bureau. Cette adresse devient le siège social inscrit au RCCM. À
          Abidjan, les tarifs varient de 30 000 à 100 000 FCFA par mois selon
          le quartier et les services. La domiciliation est reconnue par le
          CEPICI et la DGI.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce que la domiciliation d'entreprise ?">
        <p>
          La domiciliation permet à une société de fixer son siège social à
          l&apos;adresse d&apos;un prestataire spécialisé. L&apos;entreprise utilise légalement
          cette adresse pour ses démarches administratives, ses documents
          commerciaux et ses déclarations fiscales.
        </p>
        <p>
          La domiciliation est différente de la location d&apos;un bureau classique.
          Elle est parfaitement légale en Côte d&apos;Ivoire et reconnue par le
          CEPICI et la DGI, à condition que le prestataire soit agréé.
        </p>
      </ArticleSection>

      <ArticleSection title="Pour qui la domiciliation est-elle pertinente ?">
        <ArticleList
          items={[
            <><strong>La diaspora ivoirienne</strong> — indispensable pour créer une société depuis l&apos;étranger.</>,
            <><strong>Startups et freelances</strong> — adresse au Plateau ou Cocody sans coûts de bureau.</>,
            <><strong>Entrepreneurs en déplacement</strong> — adresse légale sans bureau fixe.</>,
            <><strong>Sociétés cherchant une adresse de prestige</strong> — image renforcée au CBD.</>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quels quartiers d'Abidjan pour domicilier son entreprise ?">
        <ArticleTable
          headers={["Quartier", "Positionnement", "Fourchette mensuelle"]}
          rows={[
            ["Plateau", "Premium — CBD historique d'Abidjan", "70 000 – 100 000 FCFA"],
            ["Cocody / Riviera", "Intermédiaire — résidentiel standing", "50 000 – 80 000 FCFA"],
            ["Marcory / Zone 4", "Standard — PME et commerce", "35 000 – 55 000 FCFA"],
            ["Yopougon / Adjamé", "Économique — artisanat, commerce de proximité", "25 000 – 40 000 FCFA"],
          ]}
        />
        <p>
          Le <strong>Plateau</strong> est le quartier central des affaires,
          avec les sièges des grandes banques et des administrations fiscales.
        </p>
      </ArticleSection>

      <ArticleSection title="Que comprend une offre de domiciliation ?">
        <p><strong>Services de base inclus :</strong></p>
        <ArticleList
          items={[
            "Adresse légale utilisable pour les statuts et le RCCM",
            "Attestation de domiciliation acceptée par le CEPICI",
            "Réception et tri du courrier postal",
            "Notification par email ou SMS à réception de courrier important",
          ]}
        />
        <p><strong>Services en option :</strong></p>
        <ArticleList
          items={[
            "Scan et transfert numérique du courrier",
            "Accès ponctuel à un bureau ou une salle de réunion",
            "Numéro de téléphone dédié avec transfert d'appels",
            "Accueil de clients en votre nom",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelle est la durée minimale d'un contrat de domiciliation ?">
        <p>
          Généralement <strong>1 mois</strong>, avec un préavis de 1 à 3 mois
          pour résilier. Pour la création d&apos;entreprise, le CEPICI accepte un
          contrat de minimum 3 mois. Il est conseillé de signer pour au moins
          12 mois pour éviter une modification du siège social.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment changer de domiciliation ou d'adresse de siège social ?">
        <p>
          Modification du siège social au CEPICI : modification des statuts,
          enregistrement modificatif au RCCM, mise à jour DFE auprès de la DGI.
          Coût : <strong>30 000 à 80 000 FCFA</strong> de frais officiels +
          honoraires cabinet comptable.
        </p>
      </ArticleSection>

      <ArticleSection title="La domiciliation est-elle reconnue par les banques ivoiriennes ?">
        <p>
          En général, oui — à condition que le contrat soit en cours de
          validité, que l&apos;adresse corresponde à celle du RCCM et que le
          prestataire soit agréé. Préparez des justificatifs sur votre activité
          en plus du contrat.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur la domiciliation à Abidjan">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              La domiciliation d&apos;entreprise est-elle légale en Côte d&apos;Ivoire ?
            </h3>
            <p className="mt-2">
              Oui. Pratique légale encadrée par le droit OHADA et reconnue par
              le CEPICI. L&apos;adresse peut être utilisée comme siège social
              officiel.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on domicilier son entreprise depuis l&apos;étranger ?
            </h3>
            <p className="mt-2">
              Oui, c&apos;est l&apos;un des cas les plus fréquents. La diaspora peut
              signer le contrat à distance et fournir l&apos;attestation au cabinet
              mandataire.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on recevoir des clients à une adresse de domiciliation ?
            </h3>
            <p className="mt-2">
              Cela dépend du prestataire. Certains incluent une salle de
              réunion sur réservation, d&apos;autres n&apos;offrent que l&apos;adresse postale.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Que se passe-t-il si le prestataire ferme ou résilie mon contrat ?
            </h3>
            <p className="mt-2">
              Vous devez changer de siège social dans un délai raisonnable
              (généralement 3 mois). Travaillez avec des prestataires établis.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Trouvez une domiciliation à Abidjan via nos cabinets partenaires"
        description="Nos cabinets partenaires agréés OECCA-CI proposent des services de domiciliation à Abidjan, combinés ou non avec une mission comptable."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA, CEPICI, pratiques
        des prestataires abidjanais.
      </p>
    </>
  );
}