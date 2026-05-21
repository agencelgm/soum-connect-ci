import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleTable,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function CoutCabinetAbidjanContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Combien faut-il prévoir pour un{" "}
        <strong>cabinet comptable à Abidjan</strong> en 2026 ? Les tarifs
        varient de <strong>50 000 FCFA/mois</strong> pour une EI à plus de
        <strong> 1 500 000 FCFA/mois</strong> pour une PME structurée. Ce
        guide décortique les fourchettes réelles, les modèles de facturation
        et les critères qui font bouger les honoraires.
      </p>

      <ArticleSection title="Quel est le prix moyen d'un cabinet comptable à Abidjan ?">
        <p>
          En moyenne, une PME ivoirienne paie entre{" "}
          <strong>150 000 et 400 000 FCFA par mois</strong> pour la tenue
          comptable, les déclarations fiscales et la paie. Le tarif dépend
          essentiellement du volume de pièces, du nombre de salariés et du
          régime fiscal (réel simplifié ou réel normal).
        </p>
        <ArticleTable
          headers={["Profil entreprise", "Volume mensuel", "Fourchette FCFA/mois"]}
          rows={[
            ["EI / SARLU dormante", "< 20 pièces", "50 000 – 100 000"],
            ["TPE active", "20 – 80 pièces", "100 000 – 200 000"],
            ["PME structurée", "80 – 300 pièces", "200 000 – 500 000"],
            ["PME multi-sites", "300+ pièces", "500 000 – 1 500 000"],
            ["Grande entreprise", "Volume important", "Sur devis (1M+)"],
          ]}
          caption="Fourchettes constatées en 2025-2026 auprès de cabinets agréés OECCA-CI à Abidjan."
        />
      </ArticleSection>

      <ArticleSection title="Quels sont les modèles de facturation des cabinets ?">
        <p>
          Trois modèles dominent le marché ivoirien :{" "}
          <strong>forfait mensuel, facturation horaire et mission
          ponctuelle</strong>. Le forfait reste le plus prévisible pour une
          PME ; l'horaire convient aux interventions occasionnelles ou aux
          audits.
        </p>
        <ArticleList
          items={[
            <><strong>Forfait mensuel</strong> — Tout-en-un (tenue, TVA, paie). Idéal pour budgétiser : 150 000 à 500 000 FCFA selon la taille.</>,
            <><strong>Facturation horaire</strong> — 25 000 à 75 000 FCFA/heure pour un expert-comptable. Pertinent pour les missions ponctuelles.</>,
            <><strong>Mission ponctuelle</strong> — DSF annuelle (300 000 à 1 200 000 FCFA), création de société (150 000 à 400 000 FCFA), audit (sur devis).</>,
          ]}
        />
        <ArticleCallout variant="info" title="Le forfait n'est pas toujours le moins cher">
          Un forfait trop large pour une activité naissante peut coûter plus
          qu'une facturation au volume réel. Demandez toujours une grille
          claire avec un plafond mensuel.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quels critères font varier les honoraires ?">
        <p>
          Les écarts s'expliquent par <strong>cinq variables principales</strong> :
          volume de pièces, nombre de salariés, régime fiscal, secteur
          d'activité et quartier du cabinet. Un cabinet du Plateau facturera
          en moyenne 20 à 30 % plus cher qu'un cabinet en périphérie pour la
          même prestation.
        </p>
        <ArticleList
          items={[
            "Volume de factures, achats et notes de frais à saisir chaque mois.",
            "Nombre de bulletins de paie (chaque salarié supplémentaire ajoute 5 000 à 15 000 FCFA/mois).",
            "Régime fiscal : le réel normal (TVA mensuelle) est plus chronophage que le réel simplifié.",
            "Secteur réglementé (BTP, transport, banque, ONG) qui exige des reportings spécifiques.",
            "Localisation : Plateau, Cocody Riviera, Marcory Zone 4 plus chers que Yopougon ou Treichville.",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment obtenir le meilleur rapport qualité-prix ?">
        <p>
          Comparez au moins <strong>3 devis détaillés</strong> avant de
          signer. Le devis doit lister les prestations incluses, le périmètre
          (TVA, paie, DSF, conseil) et les options hors forfait. Méfiez-vous
          des tarifs très bas sans périmètre clair : ils cachent souvent des
          suppléments par bulletin ou par déclaration.
        </p>
        <p>
          Pour comparer rapidement plusieurs cabinets agréés sans démarchage,
          vous pouvez{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            obtenir gratuitement jusqu'à 5 soumissions
          </Link>{" "}
          en 48 h. Notre guide{" "}
          <Link to="/guides/$slug" params={{ slug: "choisir-cabinet-comptable-abidjan" }} className="text-secondary underline">
            comment choisir son cabinet comptable
          </Link>{" "}
          détaille les 5 critères de sélection.
        </p>
      </ArticleSection>

      <ArticleCTA />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Le prix dépend-il du quartier du cabinet ?</h3>
        <p>
          Oui. Un cabinet au Plateau ou à Cocody Angré coûte en moyenne
          20-30 % plus cher qu'à Marcory ou Yopougon, à prestation identique.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">La création de société est-elle incluse dans le forfait ?</h3>
        <p>
          Non, presque jamais. C'est une mission ponctuelle facturée 150 000 à
          400 000 FCFA selon la forme juridique (SARL, SARLU, SA).
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Peut-on payer son cabinet au trimestre ?</h3>
        <p>
          La plupart des cabinets acceptent un paiement trimestriel ou
          semestriel, avec parfois une remise de 5 à 10 %.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Un cabinet agréé OECCA-CI est-il plus cher ?</h3>
        <p>
          Légèrement, mais l'agrément vous protège : seul un expert-comptable
          inscrit à l'OECCA-CI peut signer une DSF et engager sa
          responsabilité civile professionnelle.
        </p>
      </ArticleSection>
    </>
  );
}