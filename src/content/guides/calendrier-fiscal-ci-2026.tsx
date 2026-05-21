import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleTable,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function CalendrierFiscal2026Content() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Le <strong>calendrier fiscal 2026 en Côte d'Ivoire</strong> impose une
        succession d'échéances mensuelles, trimestrielles et annuelles. Rater
        une déclaration TVA, IS ou CNPS expose à des pénalités de 10 à 40 %
        du montant dû. Ce guide récapitule toutes les dates clés pour
        sécuriser votre conformité auprès de la DGI et de la CNPS.
      </p>

      <ArticleSection title="Quelles sont les principales échéances mensuelles en 2026 ?">
        <p>
          Chaque mois, une entreprise ivoirienne doit déposer sa{" "}
          <strong>déclaration TVA, ses ITS (impôts sur traitements et
          salaires) et ses cotisations CNPS</strong>. La date limite tombe le
          15 ou le 20 du mois suivant selon votre régime et votre direction
          des impôts de rattachement.
        </p>
        <ArticleTable
          headers={["Échéance", "Régime réel normal", "Régime réel simplifié"]}
          rows={[
            ["TVA mensuelle", "10 du mois suivant", "15 du mois suivant"],
            ["ITS (salaires)", "15 du mois suivant", "15 du mois suivant"],
            ["CNPS (cotisations)", "15 du mois suivant", "15 du mois suivant"],
            ["Retenues à la source", "15 du mois suivant", "15 du mois suivant"],
          ]}
          caption="Source : Direction générale des impôts (DGI) et CNPS Côte d'Ivoire."
        />
      </ArticleSection>

      <ArticleSection title="Quelles déclarations annuelles ne pas oublier ?">
        <p>
          Les <strong>échéances annuelles structurent l'année fiscale</strong> :
          déclaration de l'impôt sur les sociétés, dépôt des états financiers
          (DSF), patente et taxes locales. Manquer la DSF expose à une
          pénalité plancher de 2 000 000 FCFA pour les grandes entreprises.
        </p>
        <ArticleList
          items={[
            <><strong>30 avril 2026</strong> — Dépôt de la DSF (Déclaration Statistique et Fiscale) et déclaration IS au titre de l'exercice 2025.</>,
            <><strong>31 mars 2026</strong> — Déclaration et paiement de la patente annuelle.</>,
            <><strong>30 juin 2026</strong> — Assemblée générale ordinaire d'approbation des comptes (SARL et SA).</>,
            <><strong>31 janvier 2026</strong> — État 301 (récapitulatif annuel des salaires).</>,
            <><strong>15 avril 2026</strong> — Premier acompte d'impôt sur les sociétés (BIC).</>,
          ]}
        />
        <ArticleCallout variant="warning" title="Attention aux pénalités">
          Un retard de déclaration TVA est sanctionné par une majoration de
          10 % minimum, qui peut grimper à 40 % en cas de mauvaise foi. Les
          intérêts de retard s'ajoutent au taux de 1 % par mois.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Comment ne rater aucune date fiscale ?">
        <p>
          La meilleure protection reste un{" "}
          <strong>cabinet comptable agréé OECCA-CI</strong> qui pilote vos
          déclarations via le portail e-impôts de la DGI. Le coût mensuel
          (entre 75 000 et 250 000 FCFA selon la taille de l'entreprise) est
          largement inférieur au prix d'une seule pénalité.
        </p>
        <ArticleList
          items={[
            "Centralisez vos factures dès leur émission pour éviter de courir en fin de mois.",
            "Activez les rappels e-impôts et e-CNPS depuis votre espace en ligne.",
            "Préparez la DSF dès janvier : la clôture comptable demande 2 à 3 mois.",
            "Conservez vos justificatifs 10 ans (obligation OHADA / SYSCOHADA).",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelles nouveautés fiscales en 2026 ?">
        <p>
          La loi de finances 2026 confirme la <strong>digitalisation
          progressive des déclarations</strong> via la plateforme e-impôts.
          Les seuils du régime réel simplifié et les taux de TVA restent
          inchangés pour 2026, mais la facturation électronique se généralise
          aux grandes entreprises.
        </p>
        <p>
          Pour un panorama complet des prélèvements applicables, consultez
          notre guide{" "}
          <Link to="/guides/$slug" params={{ slug: "impots-entreprise-cote-divoire" }} className="text-secondary underline">
            les impôts d'une entreprise en Côte d'Ivoire
          </Link>
          . Si vous gérez les déclarations en interne et souhaitez les
          déléguer, vous pouvez{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            comparer plusieurs cabinets agréés
          </Link>{" "}
          en 48 h.
        </p>
      </ArticleSection>

      <ArticleCTA
        title="Déléguez votre conformité fiscale 2026"
        description="Obtenez jusqu'à 5 devis gratuits de cabinets comptables agréés OECCA-CI."
      />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Que risque-t-on en cas de retard de DSF ?</h3>
        <p>
          La pénalité plancher est de 1 000 000 FCFA pour une PME et peut
          grimper jusqu'à 5 000 000 FCFA pour une grande entreprise. Le
          rattrapage est possible mais long.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">La déclaration TVA est-elle obligatoire si je n'ai rien facturé ?</h3>
        <p>
          Oui. Vous devez déposer une déclaration "néant" chaque mois pour
          éviter une pénalité automatique de 100 000 FCFA.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Peut-on payer ses impôts par mobile money ?</h3>
        <p>
          La DGI accepte Orange Money, MTN MoMo et Wave pour les paiements
          inférieurs à 1 000 000 FCFA via la plateforme e-impôts.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Quand commence l'exercice fiscal en Côte d'Ivoire ?</h3>
        <p>
          L'exercice fiscal standard court du 1ᵉʳ janvier au 31 décembre. Un
          autre exercice (avril-mars) est possible sur demande motivée à la
          DGI.
        </p>
      </ArticleSection>
    </>
  );
}