import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CreerEntrepriseCiCanadaContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Un Ivoirien résidant au Canada peut créer une SARL en Côte d&apos;Ivoire
          sans se déplacer à Abidjan. Le processus passe par la légalisation
          d&apos;une procuration au consulat ivoirien (Montréal ou Ottawa), la
          désignation d&apos;un cabinet comptable mandataire en CI, et le transfert
          du capital social par virement international. Délai total : 4 à 8
          semaines.
        </p>
      </ArticleCallout>

      <ArticleSection title="Peut-on vraiment créer une société en CI depuis le Canada ?">
        <p>
          Oui. De nombreux Ivoiriens établis à Montréal, Toronto, Ottawa ou
          Vancouver créent chaque année leur société en Côte d&apos;Ivoire à
          distance. Le cadre juridique OHADA autorise expressément la
          représentation par mandataire, et le CEPICI a numérisé une grande
          partie de ses procédures depuis 2016.
        </p>
        <p>
          La spécificité canadienne : le décalage horaire (5 à 6 heures avec le
          Québec) complique les échanges en temps réel. Privilégiez les emails
          plutôt que le téléphone.
        </p>
      </ArticleSection>

      <ArticleSection title="Étape 1 — Choisir la forme juridique et le cabinet mandataire">
        <p>
          La <strong>SARLU</strong> (SARL à associé unique) est la forme la plus
          choisie par les entrepreneurs de la diaspora canadienne. Capital
          minimum de 100 000 FCFA, responsabilité limitée.
        </p>
        <p>
          Choisissez un cabinet agréé OECCA-CI à Abidjan spécialisé dans
          l&apos;accompagnement de la diaspora. Il agira comme mandataire :
          dépôt du dossier au CEPICI, réception et numérisation de vos documents
          officiels.
        </p>
      </ArticleSection>

      <ArticleSection title="Étape 2 — Légaliser la procuration">
        <p>
          <strong>Option A — Légalisation au consulat ivoirien.</strong> Le
          consulat général à Montréal (et l&apos;ambassade à Ottawa) légalise les
          procurations. Délai : 1 à 2 semaines selon la période.
        </p>
        <p>
          <strong>Option B — Notaire canadien + Apostille de la Haye.</strong>{" "}
          Faites authentifier votre procuration par un notaire québécois ou
          canadien, puis apposez l&apos;apostille auprès du ministère des Affaires
          étrangères. Souvent plus rapide que le consulat.
        </p>
      </ArticleSection>

      <ArticleSection title="Étape 3 — Transférer le capital social depuis le Canada">
        <p>
          Le capital social doit être déposé sur un compte bancaire ivoirien
          bloqué au nom de la société en formation.
        </p>
        <ArticleList
          items={[
            <><strong>Virement SWIFT</strong> depuis Desjardins, RBC, BMO, TD, Scotia. Délai : 3 à 7 jours. Frais : 15 à 50 CAD.</>,
            <><strong>Services de transfert</strong> (WorldRemit, Wise, Remitly) : 1 à 3 jours, taux souvent plus avantageux.</>,
          ]}
        />
        <p>
          <strong>Attention :</strong> avec un capital de 100 000 FCFA (~200
          CAD), assurez-vous que les frais de transfert ne dépassent pas le
          montant lui-même.
        </p>
      </ArticleSection>

      <ArticleSection title="Étape 4 — Envoi du dossier au cabinet">
        <p>Scannez et envoyez par email à votre cabinet mandataire :</p>
        <ArticleList
          items={[
            "Copie de votre passeport canadien ou pièce d'identité ivoirienne",
            "Procuration légalisée (scannée + original par DHL/courrier)",
            "Acte de naissance ou extrait",
            "Casier judiciaire ivoirien ou de votre province",
            "Justificatif de domicile au Canada",
            "Projet d'objet social",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Étape 5 — Réception des documents officiels">
        <p>
          Une fois le dossier validé par le CEPICI (5 à 10 jours ouvrés), votre
          mandataire reçoit le RCCM, la DFE et l&apos;IDU. Il vous les numérise et
          envoie les originaux par DHL. Délai de réception au Canada : 5 à 10
          jours supplémentaires.
        </p>
      </ArticleSection>

      <ArticleSection title="Quel est le coût total depuis le Canada ?">
        <ArticleTable
          headers={["Poste", "Montant indicatif"]}
          rows={[
            ["Procuration consulaire", "50 – 150 CAD"],
            ["Transfert du capital", "200 CAD + frais"],
            ["Honoraires cabinet mandataire", "200 000 – 500 000 FCFA"],
            ["Frais CEPICI", "80 000 – 150 000 FCFA"],
            ["Envoi documents par DHL", "30 000 – 60 000 FCFA"],
            ["Total (hors capital)", "~350 000 – 750 000 FCFA"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelles banques ivoiriennes acceptent l'ouverture pour la diaspora canadienne ?">
        <ArticleList
          items={[
            <><strong>Ecobank</strong> : procédure diaspora en ligne avec KYC numérique</>,
            <><strong>NSIA Banque</strong> : accompagnement spécifique non-résidents</>,
            <><strong>BOA</strong> : possible avec mandataire, visite physique parfois requise</>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Implications fiscales au Canada">
        <p>
          Si vous êtes résident fiscal canadien, votre société ivoirienne peut
          avoir des implications fiscales au Canada :
        </p>
        <ArticleList
          items={[
            "Les dividendes versés par votre SARL ivoirienne sont en principe déclarables au Canada",
            "La convention fiscale CI-Canada peut éviter la double imposition",
            "Si vous contrôlez votre SARL depuis le Canada, l'ARC peut considérer qu'elle a un établissement stable au Canada",
          ]}
        />
        <p>
          Consultez un fiscaliste canadien avant de créer votre société
          ivoirienne.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Combien de temps prend le processus complet depuis Montréal ?
            </h3>
            <p className="mt-2">
              Légalisation procuration (1-2 sem.) + CEPICI (5-10 jours) +
              ouverture banque (1-3 sem.) + réception documents (5-10 jours) :
              <strong> 6 à 10 semaines</strong> au total.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Peut-on domicilier son entreprise chez un proche à Abidjan ?
            </h3>
            <p className="mt-2">
              Techniquement oui, mais fortement déconseillé. Optez pour une
              domiciliation professionnelle pour ne rater aucun courrier
              officiel.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Créez votre société ivoirienne depuis le Canada"
        description="Nos cabinets partenaires agréés OECCA-CI ont l'habitude de travailler avec la diaspora canadienne et maîtrisent les spécificités du processus à distance."
        ctaLabel="Recevoir 5 propositions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : CEPICI, consulat ivoirien au Canada.
      </p>
    </>
  );
}