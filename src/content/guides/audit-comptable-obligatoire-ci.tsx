import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function AuditComptableObligatoireCiContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          En Côte d&apos;Ivoire, l&apos;audit légal (commissariat aux comptes) devient obligatoire
          pour une SARL qui dépasse deux des trois seuils suivants : CA &gt; 500 millions FCFA,
          total du bilan &gt; 250 millions FCFA, ou plus de 50 salariés. Pour les SA, l&apos;audit
          légal est obligatoire dès la constitution. Un audit peut aussi être exigé par contrat ou
          par les statuts.
        </p>
      </ArticleCallout>

      <ArticleSection title="Quelle est la différence entre audit comptable et révision comptable ?">
        <p>
          <strong>La révision comptable</strong> est le travail quotidien du cabinet comptable :
          saisie, contrôle des pièces, production des états financiers et signature de la DSF.
          Mission obligatoire pour toute société.
        </p>
        <p>
          <strong>L&apos;audit comptable</strong> est une mission de vérification indépendante,
          réalisée par un expert-comptable habilité. L&apos;auditeur n&apos;est pas celui qui a tenu
          les comptes — son rôle est de certifier que les états financiers sont sincères et
          réguliers.
        </p>
      </ArticleSection>

      <ArticleSection title="Pour quelles entreprises l'audit légal est-il obligatoire en CI ?">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les SARL — seuils OHADA
        </h3>
        <p>
          Audit obligatoire si <strong>deux des trois seuils</strong> sont dépassés à la clôture :
        </p>
        <ArticleTable
          headers={["Seuil", "Montant"]}
          rows={[
            ["Chiffre d'affaires HT", "> 500 000 000 FCFA"],
            ["Total du bilan", "> 250 000 000 FCFA"],
            ["Effectif moyen", "> 50 salariés"],
          ]}
        />
        <p>
          Si la SARL dépasse deux seuils pendant deux exercices consécutifs, nomination d&apos;un
          commissaire aux comptes lors de la prochaine AGO.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les SA — dès la constitution
        </h3>
        <p>
          Pour une SA, le commissariat aux comptes est obligatoire dès la constitution. La SA doit
          nommer au moins un titulaire et un suppléant.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">Autres cas</h3>
        <ArticleList
          items={[
            "Clause statutaire prévoyant un audit",
            "Audit contractuel exigé par un financeur (banque, bailleur, investisseur)",
            "Audit lors d'une opération spécifique (fusion, acquisition, levée de fonds)",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quel est le rôle exact du commissaire aux comptes ?">
        <p>
          Le CAC est inscrit à l&apos;OECCA-CI avec une habilitation spéciale. Son rôle dépasse la
          simple certification :
        </p>
        <ArticleList
          items={[
            <>
              <strong>Mission principale</strong> — certifier que les comptes donnent une image
              fidèle.
            </>,
            <>
              <strong>Missions permanentes</strong> — contrôle tout au long de l&apos;exercice.
            </>,
            <>
              <strong>Mission d&apos;alerte</strong> — alerter le dirigeant en cas de risque sur la
              continuité d&apos;exploitation.
            </>,
            <>
              <strong>Rapport annuel</strong> — certification sans réserve, avec réserves, ou refus
              de certification.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Combien coûte un audit comptable en Côte d'Ivoire ?">
        <ArticleTable
          headers={["Taille de la société", "Honoraires annuels indicatifs"]}
          rows={[
            ["PME (CA < 1 milliard FCFA)", "1 000 000 à 3 000 000 FCFA"],
            ["Entreprise moyenne (CA 1 à 5 milliards)", "3 000 000 à 8 000 000 FCFA"],
            ["Grande entreprise (CA > 5 milliards)", "8 000 000 FCFA et plus"],
          ]}
        />
        <p>
          Les Big Four (Deloitte, PwC, KPMG, EY) à Abidjan pratiquent des honoraires plus élevés que
          les cabinets locaux.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelle est la différence entre audit légal et audit contractuel ?">
        <p>
          <strong>Audit légal</strong> — imposé par la loi (seuils OHADA ou forme SA). Mandat de 6
          ans renouvelable.
        </p>
        <p>
          <strong>Audit contractuel</strong> — décidé volontairement ou exigé par un tiers. Peut
          être ponctuel ou récurrent. Utile pour les PME qui renforcent leur crédibilité bancaire ou
          préparent une levée de fonds.
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles sanctions en cas d'absence de commissaire aux comptes obligatoire ?">
        <ArticleList
          items={[
            "Nullité des délibérations de l'AG approuvant les comptes",
            "Sanctions pénales pour les dirigeants (amende)",
            "Mise en cause de la responsabilité du dirigeant envers les tiers",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Questions fréquentes sur l'audit comptable en CI">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Une SARL de moins de 50 salariés a-t-elle besoin d&apos;un CAC ?
            </h3>
            <p className="mt-2">
              Pas obligatoirement. L&apos;obligation ne s&apos;applique que si{" "}
              <strong>deux seuils sur trois</strong> sont dépassés simultanément.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Le CAC peut-il tenir la comptabilité de la société ?
            </h3>
            <p className="mt-2">
              Non. C&apos;est une incompatibilité fondamentale. L&apos;indépendance du CAC est un
              principe absolu.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Comment choisir un commissaire aux comptes en CI ?
            </h3>
            <p className="mt-2">
              Le CAC doit être inscrit à l&apos;OECCA-CI avec la mention « commissaire aux comptes
              ». Privilégiez une expérience dans votre secteur d&apos;activité.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Une startup peut-elle bénéficier d&apos;un audit même si elle n&apos;y est pas obligée
              ?
            </h3>
            <p className="mt-2">
              Oui, et c&apos;est souvent conseillé. Un audit volontaire renforce la crédibilité
              auprès des investisseurs. Certains fonds l&apos;exigent avant tout décaissement.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleCTA
        title="Besoin d'un audit comptable pour votre société ?"
        description="Nos cabinets partenaires incluent des commissaires aux comptes agréés OECCA-CI à Abidjan et dans les principales villes de Côte d'Ivoire."
        ctaLabel="Obtenir mes soumissions"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : Acte Uniforme OHADA sur les sociétés commerciales,
        OECCA-CI.
      </p>
    </>
  );
}
