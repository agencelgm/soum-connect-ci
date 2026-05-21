import {
  ArticleSection,
  ArticleTable,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function CreerSarlCepiciContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Créer une SARL en Côte d'Ivoire est aujourd'hui l'une des démarches les
        plus simples grâce au <strong>guichet unique du CEPICI</strong>. En
        2026, la procédure peut être bouclée en quelques jours seulement, à
        condition de bien préparer son dossier. Ce guide récapitule les{" "}
        <strong>étapes, documents, coûts et délais</strong> à connaître avant
        de se lancer.
      </p>

      <ArticleSection title="Pourquoi choisir la SARL ?">
        <p>
          La SARL (Société à Responsabilité Limitée) est la forme la plus
          répandue en Côte d'Ivoire pour les PME. Elle limite la responsabilité
          des associés au montant de leurs apports, autorise un capital libre
          (à partir de 1 FCFA en pratique, avec un seuil recommandé) et
          s'adapte aussi bien à un projet solo (SARLU) qu'à plusieurs associés.
        </p>
      </ArticleSection>

      <ArticleSection title="Les 6 étapes de création au CEPICI">
        <ArticleList
          ordered
          items={[
            <><strong>Réserver la dénomination sociale</strong> auprès du CEPICI (vérification de disponibilité du nom).</>,
            <><strong>Rédiger les statuts</strong> de la société (objet, capital, gérance, répartition des parts).</>,
            <><strong>Déposer le capital</strong> sur un compte bancaire bloqué au nom de la société en formation.</>,
            <><strong>Constituer le dossier</strong> (statuts, pièces d'identité, justificatif de siège, etc.).</>,
            <><strong>Déposer le dossier au guichet unique</strong> du CEPICI (Plateau ou en ligne).</>,
            <><strong>Récupérer les documents</strong> : RCCM, DFE (Déclaration Fiscale d'Existence), CNPS, attestation de régularité.</>,
          ]}
        />
        <ArticleCallout variant="info" title="Bon à savoir">
          Le CEPICI centralise toutes les administrations (greffe, DGI, CNPS) en
          un seul lieu. Vous n'avez plus à faire la tournée des services
          publics.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Documents à fournir">
        <ArticleList
          items={[
            "Statuts signés et paraphés par tous les associés",
            "Copie légalisée de la pièce d'identité de chaque associé et gérant",
            "Justificatif du siège social (bail, contrat de domiciliation ou attestation)",
            "Déclaration sur l'honneur de non-condamnation du gérant",
            "Attestation de dépôt de capital délivrée par la banque",
            "Formulaire CEPICI dûment rempli",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Coûts et délais en 2026">
        <p>
          Le coût total dépend du capital social et du recours éventuel à un
          professionnel (avocat, notaire, cabinet). Voici les fourchettes
          observées :
        </p>
        <ArticleTable
          headers={["Poste", "Montant indicatif", "Délai"]}
          rows={[
            ["Frais CEPICI (forfait)", "15 000 – 30 000 FCFA", "24 – 72 h"],
            ["Frais de greffe / RCCM", "10 000 – 15 000 FCFA", "Inclus"],
            ["Honoraires rédaction des statuts", "50 000 – 200 000 FCFA", "1 – 3 jours"],
            ["Dépôt du capital (banque)", "Variable", "1 – 2 jours"],
            ["Total moyen", "80 000 – 250 000 FCFA", "3 – 7 jours"],
          ]}
        />
        <ArticleCallout variant="tip" title="Astuce">
          Passer par un cabinet comptable dès la création vous permet souvent
          de négocier un pack création + premiers mois de comptabilité à un
          tarif avantageux.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Capital social : quel montant choisir ?">
        <p>
          Le droit OHADA autorise un capital libre pour les SARL. En pratique,
          un capital trop faible (moins de 100 000 FCFA) peut nuire à la
          crédibilité de l'entreprise auprès des banques et des fournisseurs.
          Une fourchette de <strong>500 000 à 1 000 000 FCFA</strong> est
          souvent retenue pour les PME démarrant une activité commerciale.
        </p>
      </ArticleSection>

      <ArticleSection title="Erreurs fréquentes à éviter">
        <ArticleList
          items={[
            "Statuts copiés-collés sans adapter l'objet social à votre activité réelle",
            "Oublier la déclaration CNPS dès l'embauche du premier salarié",
            "Sous-estimer le capital social et devoir le rehausser plus tard",
            "Domiciliation fictive sans contrat opposable",
            "Ne pas tenir de comptabilité dès le premier mois d'activité",
          ]}
        />
        <ArticleCallout variant="warning">
          Une SARL doit tenir une comptabilité conforme au référentiel
          SYSCOHADA dès sa création — même sans chiffre d'affaires.
        </ArticleCallout>
      </ArticleSection>

      <ArticleCTA
        title="Vous lancez votre SARL ?"
        description="Comparez gratuitement les offres de cabinets comptables agréés à Abidjan pour vous accompagner dès la création."
      />
    </>
  );
}
