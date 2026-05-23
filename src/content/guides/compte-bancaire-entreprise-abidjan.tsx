import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CompteBancaireEntrepriseAbidjanContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          L&apos;ouverture d&apos;un compte bancaire professionnel est obligatoire pour
          toute SARL en Côte d&apos;Ivoire — d&apos;abord pour déposer le capital lors
          de la création, puis pour les opérations courantes. Les principales
          banques à Abidjan (Ecobank, SGCI, NSIA, BOA, Coris Bank) ouvrent des
          comptes en 5 à 15 jours ouvrés sur présentation du RCCM, des statuts
          et des pièces d&apos;identité des dirigeants.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi un compte bancaire professionnel est-il obligatoire pour une SARL ?">
        <p>
          <strong>À la création :</strong> le dépôt du capital social se fait
          obligatoirement sur un compte ouvert au nom de la société en
          formation. La banque délivre une attestation qui fait partie du
          dossier CEPICI.
        </p>
        <p>
          <strong>Après la création :</strong> le compte de dépôt est
          transformé en compte courant professionnel. Toutes les opérations
          doivent transiter par ce compte. Mélanger finances personnelles et
          professionnelles est une faute de gestion qui engage la
          responsabilité du dirigeant.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles sont les banques recommandées pour une PME à Abidjan ?">
        <ArticleTable
          headers={["Banque", "Points forts", "Idéal pour"]}
          rows={[
            ["Ecobank", "Réseau panafricain, services digitaux", "PME avec activités régionales"],
            ["SGCI (Société Générale)", "Financement, international", "PME avec partenaires étrangers"],
            ["NSIA Banque", "Relationnel, réactivité", "PME locales, professions libérales"],
            ["BOA (Bank of Africa)", "Tarifs compétitifs", "TPE, démarrage"],
            ["Coris Bank", "Proximité, mobile banking", "PME et commerçants"],
            ["BNI", "Accompagnement investissement", "Projets industriels"],
            ["SIB", "Financement commercial", "Import-export"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quels documents fournir pour ouvrir un compte professionnel ?">
        <p><strong>Documents de la société :</strong></p>
        <ArticleList
          items={[
            "Original ou copie certifiée conforme du RCCM",
            "Statuts signés",
            "DFE ou numéro de contribuable provisoire",
            "Attestation de domiciliation du siège social",
          ]}
        />
        <p><strong>Documents du dirigeant :</strong></p>
        <ArticleList
          items={[
            "Pièce d'identité en cours de validité",
            "Justificatif de domicile",
            "Extrait de casier judiciaire récent (selon banques)",
            "Spécimen de signature",
          ]}
        />
        <p><strong>Documents complémentaires :</strong></p>
        <ArticleList
          items={[
            "Plan d'affaires ou présentation de l'activité",
            "Prévisionnel financier (pour les facilités de crédit)",
            "Références commerciales ou lettres de recommandation",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment se déroule l'ouverture d'un compte étape par étape ?">
        <ArticleList
          ordered
          items={[
            <><strong>Choisir votre banque</strong> et prendre rendez-vous.</>,
            <><strong>Déposer le dossier complet</strong> — vérification KYC possible.</>,
            <><strong>Entretien d&apos;affaires</strong> avec un chargé d&apos;affaires.</>,
            <><strong>Signer la convention de compte</strong> et recevoir RIB, carte et identifiants.</>,
          ]}
        />
        <p>
          <strong>Délai moyen :</strong> 5 à 15 jours ouvrés à partir du dépôt
          d&apos;un dossier complet.
        </p>
      </ArticleSection>

      <ArticleSection title="Peut-on ouvrir un compte bancaire professionnel depuis l'étranger ?">
        <p>Plus complexe mais possible. Plusieurs banques acceptent la diaspora :</p>
        <ArticleList
          items={[
            "Ecobank — procédure spécifique diaspora",
            "SGCI — ouverture sur documents par email",
            "NSIA Banque — accompagnement non-résidents",
          ]}
        />
        <p>
          Votre mandataire local (cabinet comptable) peut déposer le dossier.
          Certaines banques exigent une visite physique pour la signature.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les frais courants d'un compte professionnel à Abidjan ?">
        <ArticleList
          items={[
            "Tenue de compte : 3 000 à 10 000 FCFA par mois",
            "Commission de mouvement : 0,1 % à 0,3 % du débit mensuel",
            "Carte bancaire : 20 000 à 50 000 FCFA par an",
            "Virement national : 500 à 2 000 FCFA par virement",
            "Relevé papier : parfois gratuit en version électronique",
          ]}
        />
        <p>
          Négociez ces frais, surtout si vous prévoyez un volume d&apos;opérations
          significatif.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur le compte bancaire professionnel">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Est-il obligatoire d&apos;avoir un compte séparé pour une SARL ?
            </h3>
            <p className="mt-2">
              Oui. La SARL est une personne morale distincte. Utiliser un
              compte personnel est une faute de gestion qui efface la
              séparation des patrimoines.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quelle banque accepte les comptes pour les associations et GIE ?
            </h3>
            <p className="mt-2">
              La plupart des banques ivoiriennes — Ecobank, BOA et Coris Bank
              sont particulièrement actifs sur ce segment.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on avoir plusieurs comptes pour une même société ?
            </h3>
            <p className="mt-2">
              Oui. Compte courant opérationnel, épargne pour provisions
              fiscales, compte projet. Aucune limite légale. Attention aux
              frais de tenue multiples.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Comment obtenir un découvert ou une facilité de caisse ?
            </h3>
            <p className="mt-2">
              Sur la base de vos relevés des 3 à 6 derniers mois. Plus facile
              avec un historique positif, un CA régulier et une comptabilité à
              jour.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Créez votre compte professionnel avec l'accompagnement d'un cabinet agréé"
        description="Votre cabinet comptable peut vous orienter vers les banques adaptées à votre activité. Certains ont des partenariats directs qui facilitent l'ouverture."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : banques partenaires SGCI, Ecobank,
        NSIA, BOA, Coris Bank CI.
      </p>
    </>
  );
}