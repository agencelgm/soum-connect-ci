import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleTable,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function SarlSaEiContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Choisir entre <strong>SARL, SA et entreprise individuelle</strong> est
        l'une des premières décisions structurantes d'un projet en Côte
        d'Ivoire. Chacune de ces formes juridiques OHADA répond à un profil de
        risque, un besoin de capital et une ambition de croissance différents.
        Ce guide compare les trois statuts pour vous aider à choisir le bon
        cadre dès le départ.
      </p>

      <ArticleSection title="Quelles sont les différences entre SARL, SA et EI en Côte d'Ivoire ?">
        <p>
          La <strong>SARL</strong> protège votre patrimoine personnel et
          convient aux PME jusqu'à 100 associés. La <strong>SA</strong> est
          taillée pour les grands projets avec un capital minimum de
          10 000 000 FCFA. L'<strong>entreprise individuelle (EI)</strong> est
          la plus rapide à créer mais engage votre patrimoine personnel sans
          limite.
        </p>
        <ArticleTable
          headers={["Critère", "SARL / SARLU", "SA", "Entreprise individuelle"]}
          rows={[
            ["Nombre d'associés", "1 à 100", "Min. 1 (SAU) ou 2 actionnaires", "1 seul (l'entrepreneur)"],
            ["Capital minimum", "Libre (1 000 FCFA en pratique)", "10 000 000 FCFA", "Aucun"],
            ["Responsabilité", "Limitée aux apports", "Limitée aux apports", "Illimitée sur le patrimoine personnel"],
            ["Fiscalité", "IS (25 %)", "IS (25 %)", "IS ou régime simplifié selon CA"],
            ["Gouvernance", "Gérant(s)", "Conseil d'administration + DG", "L'entrepreneur seul"],
            ["Cession", "Parts sociales (agrément requis)", "Actions librement cessibles", "Non cessible (fonds de commerce uniquement)"],
          ]}
          caption="Comparatif synthétique des trois principales formes juridiques en Côte d'Ivoire."
        />
      </ArticleSection>

      <ArticleSection title="Pourquoi la SARL reste-t-elle la forme la plus choisie ?">
        <p>
          La SARL combine <strong>protection du patrimoine personnel</strong>,
          souplesse de fonctionnement et capital libre. C'est la forme idéale
          pour 80 % des projets PME en Côte d'Ivoire, en solo (SARLU) ou avec
          plusieurs associés.
        </p>
        <ArticleList
          items={[
            "Responsabilité limitée aux apports : votre maison et vos biens personnels ne sont pas saisissables en cas de dette.",
            "Capital social libre, ce qui rend la création accessible même avec une trésorerie modeste.",
            "Formalités CEPICI simples, dossier complet en 5 à 10 jours ouvrés.",
            "Possibilité de basculer en SA plus tard sans dissolution si l'activité décolle.",
          ]}
        />
        <ArticleCallout variant="info" title="SARL ou SARLU ?">
          La <strong>SARLU</strong> est simplement une SARL à associé unique.
          Les règles fiscales et comptables sont identiques. Vous pouvez
          ouvrir le capital à de nouveaux associés à tout moment.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quand vaut-il mieux créer une SA ?">
        <p>
          La SA s'impose dès que vous visez la <strong>levée de capitaux,
          l'introduction en bourse, ou la signature de marchés publics
          d'envergure</strong>. Son capital minimum de 10 millions FCFA et sa
          gouvernance plus lourde (CA, commissaire aux comptes) la réservent
          aux projets ambitieux.
        </p>
        <ArticleList
          items={[
            "Vous prévoyez plus de 100 actionnaires ou une ouverture du capital large.",
            "Vous opérez dans la banque, l'assurance ou un secteur réglementé exigeant la forme SA.",
            "Vous postulez à des appels d'offres internationaux qui imposent une SA.",
            "Vous comptez fusionner avec un grand groupe à moyen terme.",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="L'entreprise individuelle est-elle un bon choix de départ ?">
        <p>
          L'EI est <strong>rapide et peu coûteuse à créer</strong>, mais elle
          confond votre patrimoine professionnel et personnel. C'est un choix
          défendable pour tester une activité à faible risque, mais dangereux
          dès que vous signez des dettes, embauchez ou achetez du stock.
        </p>
        <ArticleCallout variant="warning" title="Le piège du patrimoine confondu">
          En EI, un impayé client ou un redressement fiscal peut entraîner la
          saisie de vos biens personnels (véhicule, immobilier, comptes
          bancaires). C'est la raison principale pour laquelle la SARL est
          recommandée dès qu'une activité génère un chiffre d'affaires
          régulier.
        </ArticleCallout>
        <p>
          En Côte d'Ivoire, les formes juridiques disponibles relèvent du
          droit OHADA : seuls la SARL, la SARLU, la SA, l'EI et le GIE
          existent. Les statuts français comme la SAS, la SASU ou l'EIRL
          n'ont pas de traduction juridique locale.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les coûts comparés de création ?">
        <p>
          Comptez en moyenne <strong>150 000 à 400 000 FCFA</strong> pour
          créer une SARL au CEPICI (frais administratifs + accompagnement
          comptable), <strong>800 000 FCFA et plus</strong> pour une SA, et
          moins de <strong>50 000 FCFA</strong> pour une EI. Les écarts
          s'expliquent par les actes notariés, le capital à libérer et les
          obligations de publicité.
        </p>
        <p>
          Pour comparer plusieurs cabinets et obtenir un devis adapté à votre
          situation, vous pouvez{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            demander des soumissions gratuites
          </Link>{" "}
          en quelques minutes. Notre guide{" "}
          <Link to="/guides/$slug" params={{ slug: "creer-sarl-cepici" }} className="text-secondary underline">
            création d'une SARL au CEPICI
          </Link>{" "}
          détaille la procédure étape par étape.
        </p>
      </ArticleSection>

      <ArticleCTA />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Peut-on transformer une EI en SARL plus tard ?</h3>
        <p>
          Oui, mais cela revient à créer une nouvelle société et à apporter le
          fonds de commerce de l'EI. L'opération coûte plus cher qu'une
          création directe en SARL.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Quel statut paie le moins d'impôts en Côte d'Ivoire ?</h3>
        <p>
          À chiffre d'affaires comparable, la SARL et la SA sont soumises à
          l'IS au taux de 25 %. L'EI peut bénéficier de régimes simplifiés
          (TEE, taxe forfaitaire) en dessous de certains seuils, mais sans
          protection patrimoniale.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Faut-il un commissaire aux comptes pour une SARL ?</h3>
        <p>
          Uniquement si la SARL dépasse deux des trois seuils OHADA (capital,
          chiffre d'affaires, effectif). En dessous, ce n'est pas obligatoire.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Une SARL étrangère peut-elle ouvrir une filiale en CI ?</h3>
        <p>
          Oui. Elle crée généralement une SARL ivoirienne dont elle détient
          100 % du capital, ou ouvre une succursale enregistrée au RCCM.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">Le GIE est-il une alternative ?</h3>
        <p>
          Le Groupement d'Intérêt Économique sert à mutualiser des moyens
          entre entreprises existantes. Ce n'est pas une forme adaptée pour
          créer une activité commerciale autonome.
        </p>
      </ArticleSection>
    </>
  );
}