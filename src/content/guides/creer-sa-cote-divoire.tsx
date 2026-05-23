import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CreerSaCoteDivoireContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          La Société Anonyme (SA) en Côte d&apos;Ivoire exige un capital minimum
          de 10 000 000 FCFA, au moins 3 actionnaires, et un commissaire aux
          comptes obligatoire dès la constitution. Elle offre une structure de
          gouvernance plus formelle que la SARL (conseil d&apos;administration ou
          directoire) et est adaptée aux projets d&apos;envergure, aux levées de
          fonds et aux entreprises qui souhaitent s&apos;introduire en bourse.
        </p>
      </ArticleCallout>

      <ArticleSection title="Qu'est-ce qu'une Société Anonyme (SA) et à qui s'adresse-t-elle ?">
        <p>
          La <strong>SA</strong> est la forme juridique la plus élaborée du
          droit des sociétés OHADA. Elle se distingue de la SARL par un capital
          minimum plus élevé, une gouvernance formalisée et une possibilité
          d&apos;accès aux marchés financiers.
        </p>
        <p>La SA s&apos;adresse principalement aux entrepreneurs qui :</p>
        <ArticleList
          items={[
            "Ont un projet nécessitant des capitaux importants",
            "Souhaitent ouvrir leur capital à des investisseurs tiers",
            "Prévoient une introduction en bourse (BRVM)",
            "Opèrent dans des secteurs réglementés (banque, assurance, télécoms)",
            "Souhaitent une gouvernance robuste avec des actionnaires multiples",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelles sont les conditions pour créer une SA en Côte d'Ivoire ?">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Capital minimum
        </h3>
        <p>
          <strong>10 000 000 FCFA</strong>. Au moins la moitié doit être
          libérée à la constitution (5 000 000 FCFA), le solde dans les{" "}
          <strong>3 ans</strong> suivant l&apos;immatriculation.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Nombre d&apos;actionnaires
        </h3>
        <p>
          Au moins <strong>3 actionnaires</strong>, sans maximum légal. Les
          actions peuvent en principe être librement cédées, sauf clause
          d&apos;agrément.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Commissaire aux comptes obligatoire
        </h3>
        <p>
          Toute SA doit nommer dès sa constitution <strong>au moins un CAC
          titulaire et un suppléant</strong>, inscrits à l&apos;OECCA-CI.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles sont les deux structures de gouvernance possibles ?">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Option 1 : SA avec conseil d&apos;administration (CA)
        </h3>
        <p>
          Structure classique. CA de 3 à 12 administrateurs nommés par l&apos;AG, et
          un <strong>PDG</strong> ou un Président du CA + Directeur Général
          distincts.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Option 2 : SA avec directoire et conseil de surveillance
        </h3>
        <p>
          Plus rare. Sépare gestion (directoire) et contrôle (conseil de
          surveillance). Inspirée du modèle allemand.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels documents faut-il fournir au CEPICI pour créer une SA ?">
        <ArticleList
          items={[
            "Pièce d'identité de chaque actionnaire et administrateur",
            "Actes de naissance ou extraits",
            "Casiers judiciaires (moins de 3 mois) de chaque dirigeant",
            "Statuts notariés (acte notarié obligatoire pour la SA)",
            "Liste des souscripteurs avec nombre d'actions souscrites et libérées",
            "Déclaration notariée de souscription et de versement",
            "État de souscription et de versement certifié par le notaire",
            "Attestation de dépôt du capital (au moins 50 % libéré)",
            "Procès-verbal de l'AG constitutive",
            "Plan de localisation du siège social",
          ]}
        />
        <ArticleCallout variant="warning" title="Notaire obligatoire">
          <p>
            Contrairement à la SARL, la SA requiert obligatoirement
            l&apos;intervention d&apos;un <strong>notaire</strong>. Le coût s&apos;ajoute aux
            frais de création.
          </p>
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quel est le coût de création d'une SA en Côte d'Ivoire ?">
        <ArticleTable
          headers={["Poste de coût", "Montant indicatif"]}
          rows={[
            ["Frais CEPICI et enregistrement", "200 000 – 400 000 FCFA"],
            ["Honoraires de notaire", "500 000 – 1 500 000 FCFA"],
            ["Honoraires du cabinet comptable", "300 000 – 800 000 FCFA"],
            ["Commissaire aux comptes (1ère année)", "1 000 000 – 3 000 000 FCFA"],
            ["Total indicatif", "2 000 000 – 5 700 000 FCFA"],
          ]}
          caption="Hors capital social déposé."
        />
      </ArticleSection>

      <ArticleSection title="SA ou SARL : comment choisir ?">
        <ArticleTable
          headers={["Critère", "SARL", "SA"]}
          rows={[
            ["Capital minimum", "100 000 FCFA", "10 000 000 FCFA"],
            ["Nombre d'associés", "1 à 50", "3 minimum"],
            ["Gouvernance", "Gérant(s)", "CA ou Directoire"],
            ["Commissaire aux comptes", "Selon seuils", "Obligatoire dès la constitution"],
            ["Cession de parts", "Agrément souvent requis", "Actions librement cessibles"],
            ["Levée de fonds", "Difficile", "Facilitée"],
            ["Cotation BRVM", "Non", "Oui"],
            ["Coût de création", "Faible", "Élevé"],
          ]}
        />
        <p>
          <strong>Règle pratique :</strong> commencez en SARL et transformez-
          vous en SA quand votre projet nécessite une levée de fonds importante.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur la SA en Côte d'Ivoire">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on créer une SA avec 3 actionnaires de la même famille ?
            </h3>
            <p className="mt-2">
              Oui. Aucune obligation de diversité. Les SA familiales sont
              courantes, surtout lors de la transformation d&apos;une SARL.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              La SA peut-elle être créée par des étrangers non résidents ?
            </h3>
            <p className="mt-2">
              Oui. Des investisseurs étrangers peuvent créer une SA. Certains
              secteurs réglementés (banque, assurance) imposent des conditions
              supplémentaires.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Combien de temps prend la création d&apos;une SA au CEPICI ?
            </h3>
            <p className="mt-2">
              Généralement <strong>10 à 20 jours ouvrés</strong>, compte tenu de
              la complexité du dossier et de l&apos;intervention du notaire.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Une SA peut-elle se transformer en SARL ?
            </h3>
            <p className="mt-2">
              Oui, mais rare car cela implique une réduction de capital. La
              transformation inverse (SARL → SA) est beaucoup plus fréquente.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Créez votre SA avec un cabinet spécialisé"
        description="La création d'une SA requiert une expertise juridique et comptable spécifique. Nos cabinets partenaires agréés OECCA-CI vous accompagnent de la rédaction des statuts à la remise du RCCM."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA sur les sociétés
        commerciales, CEPICI.
      </p>
    </>
  );
}