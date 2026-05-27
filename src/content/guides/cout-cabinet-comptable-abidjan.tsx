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
        Le coût d'un <strong>cabinet comptable à Abidjan</strong> dépend du type d'entreprise, du
        volume de documents, du régime fiscal, du nombre de salariés, des déclarations à faire et du
        niveau d'accompagnement demandé. Il n'existe pas un prix unique valable pour toutes les
        entreprises.
      </p>
      <p>
        Une petite activité individuelle à Abobo n'aura pas les mêmes besoins qu'une SARL à Cocody,
        une entreprise commerciale à Treichville, une agence de services à Marcory ou une PME au
        Plateau. Certains entrepreneurs cherchent simplement quelqu'un pour classer leurs factures
        et préparer les déclarations. D'autres ont besoin d'un suivi complet avec comptabilité
        mensuelle, déclarations fiscales, paie, états financiers, conseils et accompagnement
        administratif.
      </p>
      <p>
        Dans ce guide, on vous explique combien peut coûter un cabinet comptable à Abidjan, ce qui
        influence les tarifs, les erreurs à éviter et comment Soumissions Comptable peut vous aider
        à trouver un accompagnement adapté à votre budget.
      </p>

      <ArticleSection title="Pourquoi faire appel à un cabinet comptable à Abidjan ?">
        <p>
          Faire appel à un cabinet comptable permet de mieux organiser la gestion financière,
          fiscale et administrative de votre entreprise. Un cabinet comptable peut vous aider à
          classer vos documents, enregistrer les opérations, suivre les charges, préparer les
          déclarations fiscales, gérer la paie, produire les états financiers et vous conseiller
          dans vos décisions.
        </p>
        <p>
          Pour beaucoup d'entrepreneurs, la comptabilité est vue comme une contrainte. Pourtant,
          elle permet de savoir si l'entreprise gagne réellement de l'argent, si les charges sont
          maîtrisées, si les déclarations sont à jour et si les documents sont prêts en cas de
          contrôle ou de demande administrative.
        </p>
        <p>
          Une entreprise qui vend beaucoup peut penser qu'elle est rentable. Mais sans suivi
          comptable, elle peut ignorer ses dettes fiscales, ses charges réelles, ses marges ou ses
          retards de paiement. Un cabinet comptable aide donc l'entrepreneur à mieux piloter son
          activité.
        </p>
      </ArticleSection>

      <ArticleSection title="Combien coûte un cabinet comptable à Abidjan en moyenne ?">
        <p>
          À Abidjan, le coût d'un cabinet comptable peut généralement commencer autour de{" "}
          <strong>50 000 FCFA à 100 000 FCFA par mois</strong> pour une petite structure avec peu de
          mouvements.
        </p>
        <p>
          Pour une SARL, une PME ou une entreprise avec plusieurs déclarations à suivre, le tarif
          peut se situer entre <strong>100 000 FCFA et 300 000 FCFA par mois</strong>, selon le
          volume de travail.
        </p>
        <p>
          Pour une entreprise plus structurée, avec beaucoup de factures, plusieurs salariés, de la
          TVA, des déclarations régulières, des états financiers et un besoin de conseil, le coût
          peut dépasser <strong>300 000 FCFA par mois</strong>.
        </p>
        <ArticleCallout variant="info" title="Bon à savoir">
          Ces montants sont indicatifs. Le prix réel dépend toujours du devis, du cabinet choisi et
          de la complexité du dossier. Il est donc préférable de demander plusieurs propositions
          avant de choisir.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Pourquoi les tarifs varient-ils autant ?">
        <p>
          Les tarifs d'un cabinet comptable varient parce que toutes les entreprises n'ont pas les
          mêmes besoins. Un entrepreneur individuel qui émet quelques factures par mois demande
          moins de travail qu'une SARL avec salariés, TVA, stock, fournisseurs, clients, charges,
          déclarations sociales et suivi bancaire.
        </p>
        <p>Le prix peut varier selon :</p>
        <ArticleList
          items={[
            "le statut juridique de l'entreprise ;",
            "le régime fiscal ;",
            "le nombre de factures par mois ;",
            "le nombre de salariés ;",
            "la fréquence des déclarations ;",
            "le niveau de conseil demandé ;",
            "la qualité des documents fournis ;",
            "l'urgence du dossier ;",
            "la taille de l'entreprise ;",
            "le secteur d'activité ;",
            "le fait de travailler avec un comptable, un cabinet ou un expert-comptable inscrit.",
          ]}
        />
        <p>Plus le dossier est complexe, plus le coût augmente.</p>
      </ArticleSection>

      <ArticleSection title="Quels sont les principaux types de prestations comptables ?">
        <p>
          Un cabinet comptable peut proposer plusieurs types de services. Tous les entrepreneurs
          n'ont pas besoin du même niveau d'accompagnement. Les prestations les plus courantes sont
          :
        </p>
        <ArticleList
          items={[
            "la tenue comptable ;",
            "le classement des pièces ;",
            "la saisie des factures ;",
            "le suivi des ventes et des charges ;",
            "les déclarations fiscales ;",
            "la déclaration de TVA ;",
            "la gestion de la paie ;",
            "les déclarations sociales ;",
            "l'élaboration des états financiers ;",
            "le bilan annuel ;",
            "l'assistance en cas de contrôle ;",
            "le conseil fiscal ;",
            "l'accompagnement administratif ;",
            "la mise en place d'une organisation comptable.",
          ]}
        />
        <p>
          Certaines entreprises choisissent seulement une prestation ponctuelle. D'autres préfèrent
          un forfait mensuel pour éviter les oublis.
        </p>
      </ArticleSection>

      <ArticleSection title="Quel tarif pour une petite entreprise individuelle ?">
        <p>
          Pour une petite entreprise individuelle à Abidjan, le coût peut être relativement
          accessible si l'activité reste simple. Un accompagnement de base peut coûter environ{" "}
          <strong>50 000 FCFA à 100 000 FCFA par mois</strong>, selon le nombre de documents à
          traiter.
        </p>
        <p>
          Ce type de forfait peut convenir à un commerçant, un consultant, un prestataire de
          services ou une petite activité qui veut simplement rester organisée.
        </p>
        <ArticleCallout variant="warning" title="Attention">
          Même une petite activité peut devenir plus coûteuse à suivre si les documents sont mal
          classés, si les déclarations sont en retard ou si les informations sont difficiles à
          reconstituer.
        </ArticleCallout>
        <ArticleCallout variant="tip" title="Conseil pratique">
          Plus vos documents sont bien rangés, plus le travail du comptable est simple.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quel tarif pour une SARL à Abidjan ?">
        <p>
          Pour une SARL à Abidjan, le tarif est souvent plus élevé qu'une simple entreprise
          individuelle. Une SARL demande généralement plus de suivi administratif, fiscal et
          comptable.
        </p>
        <p>
          Selon le volume d'activité, le coût peut se situer entre{" "}
          <strong>100 000 FCFA et 300 000 FCFA par mois</strong>. Ce tarif peut couvrir la tenue
          comptable, les déclarations fiscales, le classement des pièces, le suivi des charges et
          parfois un accompagnement de conseil.
        </p>
        <p>
          Si la SARL a des salariés, beaucoup de factures, plusieurs comptes bancaires ou des
          obligations fiscales régulières, le coût peut augmenter. Par exemple, une SARL de services
          à Cocody avec peu de factures n'aura pas le même tarif qu'une SARL commerciale à
          Treichville avec stock, fournisseurs, ventes quotidiennes et salariés.
        </p>
      </ArticleSection>

      <ArticleSection title="Quel tarif pour une PME plus structurée ?">
        <p>
          Une PME plus structurée peut payer <strong>300 000 FCFA par mois ou plus</strong> selon la
          complexité du dossier. Cela peut concerner les entreprises qui ont :
        </p>
        <ArticleList
          items={[
            "plusieurs salariés ;",
            "un volume important de factures ;",
            "des déclarations fiscales fréquentes ;",
            "des besoins en reporting ;",
            "des comptes bancaires multiples ;",
            "des stocks ;",
            "des fournisseurs réguliers ;",
            "des clients professionnels ;",
            "des obligations sociales ;",
            "des besoins de conseil récurrent.",
          ]}
        />
        <p>
          Dans ce cas, le cabinet comptable ne fait pas seulement de la saisie. Il accompagne aussi
          la direction dans le suivi de l'activité, l'analyse des charges, les obligations fiscales
          et la préparation des décisions.
        </p>
      </ArticleSection>

      <ArticleSection title="Combien coûte un bilan ou des états financiers ?">
        <p>
          Le coût d'un bilan ou des états financiers dépend du volume de travail et de la qualité
          des documents disponibles. Si l'entreprise a bien classé ses factures, ses relevés
          bancaires, ses reçus et ses preuves de paiement pendant l'année, le travail est plus
          simple. Si rien n'est organisé, le cabinet devra d'abord reconstituer la comptabilité et
          le prix peut augmenter.
        </p>
        <p>
          Pour une petite entreprise, une mission ponctuelle de bilan peut coûter quelques centaines
          de milliers de FCFA. Pour une société plus importante, le coût peut être plus élevé. Le
          plus important est de demander un devis clair avant de commencer.
        </p>
        <p>
          Ce devis doit préciser ce qui est inclus : bilan, états financiers, déclarations, dépôt,
          visa, conseil ou régularisation.
        </p>
      </ArticleSection>

      <ArticleSection title="Comptable indépendant ou cabinet comptable : quelle différence de prix ?">
        <p>
          Un comptable indépendant peut parfois proposer des tarifs plus bas qu'un cabinet
          structuré. Mais le prix ne doit pas être le seul critère. Un cabinet comptable peut offrir
          plus de sécurité, plus d'organisation, plusieurs compétences internes et une meilleure
          continuité du service.
        </p>
        <p>
          Un expert-comptable inscrit peut aussi intervenir sur des missions plus encadrées,
          notamment lorsque l'entreprise a besoin d'une signature, d'un visa, d'une certification ou
          d'un accompagnement plus formel.
        </p>
        <p>
          Le choix dépend de votre besoin. Si votre activité est simple, un accompagnement léger
          peut suffire. Si votre entreprise grandit, il peut être préférable de travailler avec une
          structure plus organisée.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels éléments font augmenter le prix ?">
        <p>Plusieurs éléments peuvent faire augmenter le prix d'un cabinet comptable.</p>
        <ArticleList
          items={[
            <>
              <strong>Le volume de documents</strong> : plus il y a de factures, reçus, relevés,
              contrats et paiements à traiter, plus le travail est important.
            </>,
            <>
              <strong>Le nombre de salariés</strong> : la paie demande un suivi régulier, des
              bulletins, des déclarations et une bonne organisation.
            </>,
            <>
              <strong>La TVA</strong> : une entreprise soumise à la TVA doit suivre ses factures de
              vente, ses factures d'achat et ses déclarations avec plus de rigueur.
            </>,
            <>
              <strong>Le retard comptable</strong> : si l'entreprise n'a rien classé depuis
              plusieurs mois, le cabinet devra faire un travail de rattrapage.
            </>,
            <>
              <strong>Le niveau de conseil</strong> : un simple suivi comptable coûte moins cher
              qu'un accompagnement complet avec conseil fiscal, analyse financière et reporting.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment réduire le coût de son cabinet comptable ?">
        <p>
          Pour réduire le coût de votre cabinet comptable, il faut surtout améliorer votre
          organisation. Un dossier propre coûte souvent moins cher à suivre qu'un dossier
          désordonné.
        </p>
        <p>Voici quelques bonnes pratiques :</p>
        <ArticleList
          items={[
            "classer les factures chaque mois ;",
            "séparer les dépenses personnelles et professionnelles ;",
            "garder les reçus et preuves de paiement ;",
            "utiliser un compte bancaire professionnel ;",
            "nommer correctement les fichiers ;",
            "transmettre les documents à temps ;",
            "éviter d'attendre la fin de l'année ;",
            "noter les dépenses importantes ;",
            "conserver les contrats et devis ;",
            "demander une liste claire des pièces à fournir.",
          ]}
        />
        <p>Plus votre entreprise est organisée, plus le cabinet peut travailler efficacement.</p>
      </ArticleSection>

      <ArticleSection title="Exemple de budget selon le type d'entreprise">
        <p>Voici un repère simple pour mieux comprendre les tarifs possibles à Abidjan.</p>
        <ArticleTable
          headers={["Type d'entreprise", "Besoin comptable", "Budget indicatif"]}
          rows={[
            [
              "Entrepreneur individuel avec peu de mouvements",
              "Suivi simple, classement, déclarations de base",
              "50 000 à 100 000 FCFA / mois",
            ],
            [
              "Petite SARL de services",
              "Tenue comptable, déclarations, suivi mensuel",
              "100 000 à 200 000 FCFA / mois",
            ],
            [
              "SARL avec TVA et salariés",
              "Comptabilité, fiscalité, paie, déclarations",
              "150 000 à 300 000 FCFA / mois",
            ],
            [
              "PME structurée",
              "Suivi complet, reporting, états financiers, conseil",
              "300 000 FCFA et plus / mois",
            ],
            ["Mission ponctuelle", "Bilan, régularisation, états financiers", "Sur devis"],
          ]}
          caption="Repères indicatifs. Ces montants ne sont pas des tarifs officiels."
        />
      </ArticleSection>

      <ArticleSection title="Que doit contenir un bon devis comptable ?">
        <p>
          Un bon devis comptable doit être clair. Il doit expliquer ce que le cabinet va faire, à
          quelle fréquence, à quel prix et avec quelles limites. Avant de signer, vérifiez si le
          devis inclut :
        </p>
        <ArticleList
          items={[
            "la tenue comptable ;",
            "les déclarations fiscales ;",
            "la TVA ;",
            "la paie ;",
            "les états financiers ;",
            "le bilan annuel ;",
            "les rendez-vous de conseil ;",
            "le suivi administratif ;",
            "les régularisations ;",
            "les frais supplémentaires ;",
            "les délais de traitement ;",
            "les obligations du client.",
          ]}
        />
        <ArticleCallout variant="warning" title="À éviter">
          Un prix bas peut sembler intéressant au départ. Mais s'il ne couvre pas les prestations
          dont vous avez réellement besoin, vous risquez de payer plus tard des frais
          supplémentaires.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Comment choisir un cabinet comptable à Abidjan ?">
        <p>
          Pour choisir un cabinet comptable à Abidjan, il ne faut pas regarder uniquement le prix.
          Il faut aussi vérifier la compétence, la clarté du devis, la disponibilité, la
          compréhension de votre activité et la capacité du cabinet à vous expliquer simplement vos
          obligations.
        </p>
        <p>Vous pouvez poser quelques questions avant de choisir :</p>
        <ArticleList
          items={[
            "Quelles prestations sont incluses ?",
            "Le tarif est-il mensuel ou ponctuel ?",
            "Le bilan est-il inclus ?",
            "Les déclarations fiscales sont-elles incluses ?",
            "La paie est-elle incluse ?",
            "Le cabinet connaît-il mon secteur d'activité ?",
            "Quels documents dois-je fournir chaque mois ?",
            "Comment les échanges se feront-ils ?",
            "Le cabinet fournit-il un calendrier des obligations ?",
            "Est-ce que je reçois des preuves de déclaration ou de paiement ?",
          ]}
        />
        <p>Un bon cabinet doit vous aider à comprendre, pas seulement à déposer des documents.</p>
      </ArticleSection>

      <ArticleSection title="Comment Soumissions Comptable peut vous aider ?">
        <p>
          Soumissions Comptable aide les entrepreneurs à mieux s'orienter en leur permettant de
          trouver un accompagnement comptable adapté pour structurer leur entreprise, organiser
          leurs documents, suivre leurs obligations et démarrer leur activité avec plus de sérénité.
        </p>
        <p>
          Le coût d'un cabinet comptable à Abidjan peut varier fortement. C'est pour cette raison
          qu'il est important de comparer plusieurs options avant de choisir.
        </p>
        <p>
          Avec{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            Soumissions Comptable
          </Link>
          , l'entrepreneur peut expliquer son besoin, son type d'activité, son budget et son niveau
          d'organisation. L'objectif est de trouver un accompagnement adapté à la réalité de son
          entreprise.
        </p>
        <p>
          Une entreprise individuelle à Yopougon n'aura pas forcément besoin du même service qu'une
          SARL à Marcory ou une PME au Plateau. Soumissions Comptable permet donc d'éviter de
          chercher seul, de comparer les propositions et de choisir une solution plus adaptée à
          travers 5 devis de différentes entreprises.
        </p>
        <ArticleCTA
          title="Comparez 5 devis de cabinets comptables à Abidjan"
          description="Expliquez votre besoin en quelques minutes et recevez des propositions adaptées à votre activité et votre budget."
        />
      </ArticleSection>

      <ArticleSection title="Quelles erreurs éviter avant de choisir un cabinet comptable ?">
        <p>
          Les erreurs les plus fréquentes sont de choisir uniquement le moins cher, de ne pas
          demander ce qui est inclus, de négliger les obligations fiscales ou de transmettre les
          documents en désordre.
        </p>
        <p>Voici les erreurs à éviter :</p>
        <ArticleList
          items={[
            "choisir un cabinet uniquement sur le prix ;",
            "ne pas demander de devis détaillé ;",
            "ne pas vérifier les prestations incluses ;",
            "confondre comptable, cabinet comptable et expert-comptable ;",
            "attendre la fin de l'année pour chercher un accompagnement ;",
            "ne pas classer les factures ;",
            "mélanger les dépenses personnelles et professionnelles ;",
            "ne pas demander les preuves de déclaration ;",
            "ne pas prévoir de budget comptable dès le départ.",
          ]}
        />
        <p>
          Un bon accompagnement comptable doit être vu comme un investissement. Il permet d'éviter
          les erreurs, les pénalités, les retards et les mauvaises décisions.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes (FAQ)">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Combien coûte un cabinet comptable à Abidjan ?
        </h3>
        <p>
          Un cabinet comptable à Abidjan peut coûter à partir de 50 000 FCFA à 100 000 FCFA par mois
          pour une petite structure. Pour une SARL ou une PME, le tarif peut aller de 100 000 FCFA à
          300 000 FCFA par mois, voire plus selon la complexité.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Pourquoi les prix des cabinets comptables varient-ils ?
        </h3>
        <p>
          Les prix varient selon le volume de documents, le statut de l'entreprise, le régime
          fiscal, le nombre de salariés, la TVA, les déclarations à faire, le niveau de conseil et
          l'urgence du dossier.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Un entrepreneur individuel a-t-il besoin d'un cabinet comptable ?
        </h3>
        <p>
          Oui, cela peut être utile même pour une petite activité. Un cabinet comptable peut aider à
          classer les documents, suivre les charges, préparer les déclarations et éviter les erreurs
          fiscales.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Une SARL doit-elle forcément avoir un comptable ?
        </h3>
        <p>
          Une SARL doit tenir une comptabilité organisée et respecter ses obligations fiscales. Elle
          peut gérer certaines tâches en interne, mais un accompagnement comptable est souvent
          recommandé pour éviter les erreurs.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Le bilan annuel est-il inclus dans le tarif mensuel ?
        </h3>
        <p>
          Pas toujours. Certains cabinets incluent le bilan dans leur forfait mensuel. D'autres le
          facturent séparément. Il faut toujours vérifier ce point dans le devis.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Peut-on négocier le tarif d'un cabinet comptable ?
        </h3>
        <p>
          Oui, mais il faut surtout comparer les prestations. Un tarif plus bas peut être
          intéressant seulement si les services essentiels sont inclus.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Comment savoir si un devis comptable est correct ?
        </h3>
        <p>
          Un devis correct doit préciser les prestations incluses, la fréquence du suivi, les
          obligations couvertes, les frais supplémentaires éventuels et les documents à fournir.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Soumissions Comptable peut-il aider à trouver un cabinet comptable ?
        </h3>
        <p>
          Oui. Soumissions Comptable peut aider les entrepreneurs à trouver un accompagnement
          comptable adapté à leur activité, leur budget et leurs obligations.
        </p>
      </ArticleSection>

      <ArticleSection title="Sources officielles">
        <p>Les informations de cet article s'appuient sur les sources officielles suivantes :</p>
        <ArticleList
          items={[
            <>
              <a
                href="https://oec.ci/fr/grand-public/recourir-aux-services-dun-ec/combien-coutent-les-services-dun-expert-comptable"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                Ordre des Experts-Comptables de Côte d'Ivoire — Combien coûtent les services d'un
                Expert-Comptable ?
              </a>{" "}
              : facteurs qui influencent les honoraires (temps, complexité, expérience, expertise,
              responsabilité).
            </>,
            <>
              <a
                href="https://oec.ci/fr/tableau-de-lordre"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                OECCA-CI — Tableau de l'Ordre
              </a>{" "}
              : vérification des experts-comptables inscrits au tableau de l'Ordre en Côte d'Ivoire.
            </>,
            <>
              <a
                href="https://oec.ci/fr/documents-publics/visa-fiscal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                OECCA-CI — Visa des États Financiers
              </a>{" "}
              : documents publics relatifs au visa des états financiers, normes professionnelles et
              diligences liées au GUDEF.
            </>,
            <>
              <a
                href="https://e-impots.gouv.ci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                e-Impôts Côte d'Ivoire
              </a>{" "}
              : portail officiel de télédéclaration et télépaiement, espace entreprises et
              experts-comptables.
            </>,
            <>
              <a
                href="https://www.dgi.gouv.ci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                Direction Générale des Impôts — Site officiel
              </a>{" "}
              : informations fiscales officielles et obligations fiscales des entreprises en Côte
              d'Ivoire.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Conclusion : le prix dépend surtout de votre besoin réel">
        <p>
          Le coût d'un cabinet comptable à Abidjan dépend de votre activité, de votre statut, de
          votre volume de documents, de vos salariés, de vos déclarations et du niveau
          d'accompagnement recherché.
        </p>
        <p>
          Une petite entreprise peut prévoir un budget de départ autour de{" "}
          <strong>50 000 FCFA à 100 000 FCFA par mois</strong>. Une SARL ou une PME peut plutôt
          prévoir entre <strong>100 000 FCFA et 300 000 FCFA par mois</strong>. Une entreprise plus
          structurée peut dépasser ce montant si elle a beaucoup d'opérations, de salariés, de
          déclarations et de besoins de conseil.
        </p>
        <p>
          Le plus important est de ne pas choisir uniquement le prix le plus bas. Il faut choisir un
          accompagnement clair, adapté et capable de vous aider à rester en règle.
        </p>
        <p>
          Avec{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            Soumissions Comptable
          </Link>
          , vous pouvez éviter de chercher seul. La plateforme vous aide à trouver un accompagnement
          comptable adapté pour organiser vos documents, suivre vos obligations et piloter votre
          entreprise avec plus de sérénité.
        </p>
      </ArticleSection>
    </>
  );
}
