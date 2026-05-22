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
        Respecter le <strong>calendrier fiscal 2026</strong> est essentiel pour
        toute entreprise en Côte d'Ivoire. Que vous soyez entrepreneur
        individuel, dirigeant de SARL, prestataire de services, commerçant,
        consultant, agence digitale ou PME, vos obligations fiscales ne
        doivent pas être prises à la légère.
      </p>
      <p>
        Chaque année, les entreprises doivent déclarer et payer certains
        impôts à des dates précises : TVA, impôt sur les bénéfices, retenues
        à la source, impôts sur les salaires, patente ou autres taxes selon
        l'activité. À Abidjan, Bouaké, Yamoussoukro, San Pedro ou Korhogo,
        beaucoup d'entrepreneurs se concentrent sur les ventes et les
        charges du quotidien — mais un oubli d'échéance fiscale peut
        entraîner pénalités, stress et difficultés avec l'administration.
      </p>
      <p>
        Bonne nouvelle : avec une bonne organisation, il est possible
        d'anticiper. Ce guide présente les principales dates fiscales 2026
        à connaître pour les entreprises en Côte d'Ivoire, les obligations
        à suivre et la manière dont Soumissions Comptable peut vous aider
        à mieux organiser votre suivi comptable et fiscal.
      </p>

      <ArticleSection title="Qu'est-ce qu'un calendrier fiscal ?">
        <p>
          Un <strong>calendrier fiscal</strong> est un document de suivi qui
          regroupe les dates importantes de déclaration et de paiement des
          impôts. Il permet à une entreprise de savoir à quel moment elle
          doit déclarer ses revenus, payer ses taxes, déposer ses états
          financiers, déclarer les salaires ou régulariser certaines
          obligations.
        </p>
        <p>En Côte d'Ivoire, les échéances peuvent varier selon :</p>
        <ArticleList
          items={[
            "le régime fiscal de l'entreprise ;",
            "la taille de l'entreprise ;",
            "le centre des impôts de rattachement ;",
            "le type d'activité ;",
            "la nature de l'impôt concerné ;",
            "l'appartenance ou non à la DGE ou à la DME ;",
            "le fait que l'entreprise soit industrielle, commerciale ou prestataire de services.",
          ]}
        />
        <p>
          Une entreprise commerciale et une entreprise de prestations de
          services peuvent avoir des échéances différentes. Il ne faut donc
          pas se contenter d'une seule date générale.
        </p>
      </ArticleSection>

      <ArticleSection title="Pourquoi le calendrier fiscal est-il important ?">
        <p>
          Le calendrier fiscal permet d'éviter les retards, les pénalités,
          les oublis de déclaration et les mauvaises surprises. Une
          entreprise peut avoir une bonne activité commerciale mais se
          retrouver en difficulté si elle ne suit pas correctement ses
          obligations.
        </p>
        <p>
          Une agence de communication à Cocody peut encaisser régulièrement
          des paiements clients mais oublier de déclarer la TVA. Un
          commerçant à Treichville peut suivre ses ventes sans anticiper la
          patente. Une SARL à Marcory peut avoir tous ses documents de
          création mais négliger le dépôt des états financiers.
        </p>
        <p>
          Dans tous les cas, le problème n'est pas seulement fiscal : c'est
          aussi un problème d'organisation. Un bon calendrier indique quoi
          faire, quand le faire et quels documents préparer.
        </p>
      </ArticleSection>

      <ArticleSection title="Les principales obligations fiscales des entreprises en 2026">
        <p>
          Les obligations fiscales en Côte d'Ivoire concernent principalement
          la <strong>TVA</strong>, l'<strong>impôt sur les bénéfices</strong>,
          les <strong>retenues à la source</strong>, les{" "}
          <strong>impôts sur les salaires</strong>, la{" "}
          <strong>contribution des patentes</strong>, les{" "}
          <strong>états financiers</strong> et certaines taxes spécifiques
          selon l'activité.
        </p>
        <p>
          Toutes les entreprises ne sont pas concernées par les mêmes
          obligations. Une petite entreprise individuelle n'a pas forcément
          les mêmes déclarations qu'une SARL au régime du réel. Il est donc
          important de connaître son régime fiscal et de se faire
          accompagner en cas de doute.
        </p>
      </ArticleSection>

      <ArticleSection title="Les déclarations mensuelles à suivre en 2026">
        <p>
          Certaines obligations reviennent chaque mois : TVA, impôts sur les
          salaires, retenues à la source, acomptes. Ce sont souvent les plus
          importantes à suivre. Sans système de classement clair, une
          entreprise peut vite perdre le fil.
        </p>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          TVA : quelles dates retenir en 2026 ?
        </h3>
        <p>
          Pour les contribuables au régime réel normal ou simplifié, la
          déclaration et le paiement de la TVA sont généralement attendus
          le 15 de chaque mois. Pour les entreprises relevant de la DGE ou
          de la DME, les échéances varient selon l'activité.
        </p>
        <ArticleTable
          headers={["Type d'entreprise (DGE / DME)", "Échéance TVA"]}
          rows={[
            ["Industrielles, pétrolières et minières", "10 du mois suivant"],
            ["Commerciales", "15 du mois suivant"],
            ["Prestations de services", "20 du mois suivant"],
          ]}
          caption="Source : Direction générale des impôts (DGI) — Calendrier des obligations fiscales."
        />
        <ArticleCallout variant="tip" title="Conseil pratique">
          N'attendez pas le dernier jour pour classer les factures. Factures
          clients, factures fournisseurs, avoirs et justificatifs doivent
          être rangés au fur et à mesure.
        </ArticleCallout>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Impôts sur les salaires : quelles échéances suivre ?
        </h3>
        <p>
          Une entreprise qui emploie des salariés doit suivre les
          obligations liées aux salaires (ITS et contributions
          employeur). Pour les entreprises relevant des centres des
          impôts, l'échéance est généralement le 15 du mois suivant. Pour
          les contribuables relevant de la taxe d'État de l'entreprenant
          et du régime des microentreprises, l'échéance peut être le 10 du
          mois suivant.
        </p>
        <p>Pour les entreprises de la DGE ou de la DME :</p>
        <ArticleList
          items={[
            "10 du mois suivant — entreprises industrielles, pétrolières et minières ;",
            "15 du mois suivant — entreprises commerciales ;",
            "20 du mois suivant — entreprises de prestations de services.",
          ]}
        />
        <ArticleCallout variant="tip" title="Conseil pratique">
          Créez un dossier mensuel « paie » avec bulletins, contrats,
          justificatifs de paiement et déclarations.
        </ArticleCallout>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Retenues à la source : pourquoi les suivre chaque mois ?
        </h3>
        <p>
          Les retenues à la source peuvent concerner certaines prestations,
          rémunérations, commissions, loyers ou paiements. L'entreprise
          retient une partie du montant payé et la reverse à
          l'administration fiscale.
        </p>
        <p>Pour les entreprises de la DGE ou de la DME :</p>
        <ArticleList
          items={[
            "10 du mois suivant — industrielles, pétrolières et minières ;",
            "15 du mois suivant — commerciales ;",
            "20 du mois suivant — prestataires de services.",
          ]}
        />
        <p>
          Pour les autres entreprises au régime réel, l'échéance est
          généralement le 15 du mois suivant.
        </p>
        <ArticleCallout variant="tip" title="Conseil pratique">
          À chaque facture payée, vérifiez si une retenue doit être
          appliquée. Cela évite de régulariser dans l'urgence.
        </ArticleCallout>

        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Les acomptes d'impôt : quelles dates retenir ?
        </h3>
        <p>
          Certaines entreprises doivent payer des acomptes pendant l'année.
        </p>
        <ArticleList
          items={[
            "Entreprises commerciales : autour du 15 avril, 15 juin et 15 septembre ;",
            "Entreprises de prestations de services : autour du 20 avril, 20 juin et 20 septembre ;",
            "Entreprises industrielles, pétrolières et minières (DGE/DME) : autour du 10 avril, 10 juin et 10 septembre.",
          ]}
        />
        <ArticleCallout variant="tip" title="Conseil pratique">
          Prévoyez ces échéances dans votre trésorerie : beaucoup
          d'entreprises pensent aux charges mensuelles mais oublient les
          impôts périodiques.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Les états financiers : une échéance majeure">
        <p>
          Le dépôt des états financiers est une obligation incontournable.
          Pour la plupart des entreprises, ils doivent être déposés au plus
          tard le <strong>30 mai</strong> suivant la clôture de l'exercice.
          Pour les entreprises soumises à l'obligation de certification des
          comptes par un commissaire aux comptes, la date peut aller jusqu'au{" "}
          <strong>30 juin</strong>.
        </p>
        <ArticleCallout variant="warning" title="À éviter">
          N'attendez pas mai pour chercher factures, relevés bancaires,
          contrats et justificatifs. Classez vos pièces comptables chaque
          mois pour simplifier la clôture annuelle.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Contribution des patentes : quelles dates retenir ?">
        <p>
          La contribution des patentes concerne les personnes physiques ou
          morales exerçant une activité commerciale, industrielle ou
          libérale, sauf exemption. Pour les entreprises relevant des
          centres des impôts, la déclaration est attendue au plus tard le{" "}
          <strong>15 mars</strong>. Pour la DGE ou la DME :
        </p>
        <ArticleList
          items={[
            "10 mars — entreprises industrielles, pétrolières et minières ;",
            "15 mars — entreprises commerciales ;",
            "20 mars — entreprises de prestations de services.",
          ]}
        />
        <p>
          Le paiement est réparti en deux parties : une première moitié au
          plus tard en mars, une seconde au plus tard en juillet.
        </p>
      </ArticleSection>

      <ArticleSection title="Taxe d'État de l'entreprenant : quelle date retenir ?">
        <p>
          Certaines petites activités relèvent de la taxe d'État de
          l'entreprenant. La déclaration est attendue au plus tard le{" "}
          <strong>15 janvier</strong> de chaque année, le paiement pouvant
          ensuite intervenir le 10 du mois suivant. Si vous êtes
          entrepreneur individuel ou petite structure, vérifiez votre
          régime fiscal dès le début de l'année.
        </p>
      </ArticleSection>

      <ArticleSection title="Calendrier fiscal 2026 : les grandes dates à retenir">
        <p>
          Ce calendrier simplifié sert de repère général. Il ne remplace
          pas l'analyse de votre situation réelle auprès d'un cabinet
          comptable agréé.
        </p>
        <ArticleTable
          headers={["Période", "Obligations à surveiller"]}
          rows={[
            ["Janvier 2026", "Taxes annuelles, taxe d'État de l'entreprenant, obligations sur certains revenus mobiliers, préparation des dossiers fiscaux de l'année"],
            ["Chaque mois", "TVA, impôts sur les salaires, retenues à la source, taxes mensuelles selon le régime"],
            ["Février 2026", "Régularisation des obligations sur les salaires, taxe spéciale sur certains transports privés de marchandises"],
            ["Mars 2026", "Contribution des patentes, première partie du paiement de certaines obligations annuelles"],
            ["Avril 2026", "Déclarations liées aux bénéfices, premier acompte pour certaines entreprises"],
            ["Mai 2026", "Dépôt des états financiers pour la plupart des entreprises"],
            ["Juin 2026", "Deuxième acompte, dépôt des états financiers pour les entreprises soumises à certification"],
            ["Juillet 2026", "Deuxième partie du paiement de la patente"],
            ["Septembre 2026", "Troisième acompte"],
            ["Décembre 2026", "Clôture comptable, classement des pièces, vérification des déclarations de l'année"],
          ]}
          caption="Repère général — vérifiez vos échéances exactes selon votre régime et votre centre des impôts."
        />
      </ArticleSection>

      <ArticleSection title="Comment préparer son calendrier fiscal en pratique ?">
        <p>
          Commencez par identifier vos obligations réelles. Vous devez savoir :
        </p>
        <ArticleList
          items={[
            "quel est votre régime fiscal ;",
            "quel est votre centre des impôts ;",
            "si vous êtes soumis à la TVA ;",
            "si vous avez des salariés ;",
            "si vous devez déposer des états financiers ;",
            "si vous êtes concerné par la patente ;",
            "si vous devez appliquer des retenues à la source ;",
            "si vous relevez d'une direction spécifique (DGE, DME).",
          ]}
        />
        <p>
          Ensuite, créez un tableau de suivi avec le nom de l'impôt, la
          période concernée, la date limite, les documents nécessaires, la
          personne responsable, le statut de la déclaration et la preuve de
          paiement. Cette méthode permet d'éviter les oublis.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels documents préparer chaque mois ?">
        <p>
          Chaque mois, l'entreprise doit préparer les documents nécessaires
          à ses déclarations :
        </p>
        <ArticleList
          items={[
            "factures clients ;",
            "factures fournisseurs ;",
            "reçus et avoirs ;",
            "relevés bancaires ;",
            "preuves de paiement ;",
            "bulletins de salaire et contrats ;",
            "déclarations précédentes ;",
            "justificatifs de charges ;",
            "documents liés aux retenues à la source.",
          ]}
        />
        <p>
          Plus les documents sont bien classés, plus les déclarations sont
          simples à préparer. Le vrai problème de beaucoup d'entrepreneurs
          n'est pas la connaissance fiscale, c'est l'organisation
          documentaire.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment Soumissions Comptable peut vous accompagner">
        <p>
          Soumissions Comptable aide les entrepreneurs à trouver un{" "}
          <strong>accompagnement comptable adapté</strong> pour structurer
          leur entreprise, organiser leurs documents, suivre leurs
          obligations et démarrer avec sérénité.
        </p>
        <p>
          Une entreprise individuelle à Abobo peut avoir besoin d'un suivi
          simple. Une SARL à Cocody peut avoir besoin d'un accompagnement
          mensuel pour la TVA, les salaires et les déclarations. Une
          entreprise de prestations de services à Marcory peut avoir besoin
          d'une organisation complète pour ses factures, ses retenues et
          ses états financiers.
        </p>
        <p>
          Vous pouvez{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            comparer plusieurs cabinets agréés OECCA-CI en 48 h
          </Link>{" "}
          ou consulter notre guide{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "impots-entreprise-cote-divoire" }}
            className="text-secondary underline"
          >
            les impôts d'une entreprise en Côte d'Ivoire
          </Link>
          .
        </p>
      </ArticleSection>

      <ArticleSection title="Quelles erreurs éviter en 2026 ?">
        <p>Les erreurs les plus fréquentes restent les mêmes :</p>
        <ArticleList
          items={[
            "attendre le dernier jour pour déclarer ;",
            "ne pas classer les factures ;",
            "perdre les reçus et preuves de paiement ;",
            "oublier les déclarations mensuelles ;",
            "ne pas vérifier si l'entreprise est soumise à la TVA ;",
            "ne pas suivre les salaires correctement ;",
            "ignorer les retenues à la source ;",
            "oublier la patente ;",
            "ne pas préparer les états financiers à temps ;",
            "attendre un contrôle ou une pénalité avant de chercher un comptable.",
          ]}
        />
      </ArticleSection>

      <ArticleCTA
        title="Déléguez votre conformité fiscale 2026"
        description="Obtenez jusqu'à 5 devis gratuits de cabinets comptables agréés OECCA-CI en 48 h."
      />

      <ArticleSection title="Questions fréquentes (FAQ)">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Qu'est-ce que le calendrier fiscal 2026 en Côte d'Ivoire ?
        </h3>
        <p>
          Le calendrier fiscal 2026 regroupe les principales dates de
          déclaration et de paiement des impôts pour les entreprises en
          Côte d'Ivoire. Il permet de suivre les obligations mensuelles,
          trimestrielles et annuelles.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Toutes les entreprises ont-elles les mêmes dates fiscales ?
        </h3>
        <p>
          Non. Les dates varient selon le régime fiscal, l'activité, le
          centre des impôts, la taille de l'entreprise et la direction de
          rattachement (DGE, DME). Une entreprise commerciale, une
          industrielle et une prestataire de services peuvent avoir des
          échéances différentes.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Quelle est la date limite pour la TVA en Côte d'Ivoire ?
        </h3>
        <p>
          Pour les contribuables au régime du réel, la TVA est déclarée et
          payée chaque mois. Selon le type d'entreprise et le rattachement
          fiscal, l'échéance peut être le 10, le 15 ou le 20 du mois
          suivant.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Quand faut-il déposer les états financiers ?
        </h3>
        <p>
          Pour la plupart des entreprises, au plus tard le 30 mai suivant
          la clôture de l'exercice. Pour les entreprises soumises à
          certification des comptes, l'échéance peut aller jusqu'au 30 juin.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Quand faut-il déclarer la patente ?
        </h3>
        <p>
          Pour les entreprises relevant des centres des impôts, la
          déclaration est attendue au plus tard le 15 mars. Pour certaines
          entreprises de la DGE ou de la DME, les dates varient selon
          l'activité (10, 15 ou 20 mars).
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Que risque une entreprise en cas de retard fiscal ?
        </h3>
        <p>
          Un retard entraîne des pénalités, des majorations, des
          difficultés administratives et une perte de temps. Il peut aussi
          compliquer les relations avec l'administration, les partenaires
          ou les banques.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Soumissions Comptable peut-il aider à suivre le calendrier fiscal ?
        </h3>
        <p>
          Oui. Soumissions Comptable aide les entrepreneurs à trouver un
          accompagnement comptable adapté pour suivre les obligations
          fiscales, organiser les documents, préparer les déclarations et
          éviter les oublis.
        </p>
      </ArticleSection>

      <ArticleSection title="Sources officielles">
        <p>Les informations de cet article s'appuient sur les sources officielles suivantes :</p>
        <ArticleList
          items={[
            <>
              <a
                href="https://www.dgi.gouv.ci/assets/documents/CALENDRIER.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                DGI — Calendrier des obligations fiscales (PDF)
              </a>{" "}
              : principales échéances TVA, bénéfices, retenues à la source,
              salaires, patente, acomptes et états financiers.
            </>,
            <>
              <a
                href="https://www.dgi.gouv.ci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                DGI — Site officiel
              </a>{" "}
              : publications officielles, annexe fiscale 2026 et documents
              de référence.
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
              : portail officiel de télédéclaration et télépaiement.
            </>,
            <>
              <a
                href="https://www.225invest.ci/fr/vos_services/show-classe-service.xhtml?id=1000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                225Invest — E-Impôts
              </a>{" "}
              : accès au portail e-Impôts et formalités fiscales en ligne.
            </>,
            <>
              <a
                href="https://www.fne.dgi.gouv.ci/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline"
              >
                DGI — Facture Normalisée Électronique (FNE)
              </a>{" "}
              : facturation normalisée électronique et démarches associées.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Conclusion : anticiper, c'est gagner">
        <p>
          Le calendrier fiscal 2026 en Côte d'Ivoire doit être pris au
          sérieux par toutes les entreprises. Les obligations peuvent
          concerner la TVA, les salaires, les retenues à la source, les
          acomptes, la patente, les états financiers ou d'autres taxes
          selon l'activité.
        </p>
        <p>
          Une entreprise bien suivie classe ses documents chaque mois,
          prépare ses déclarations à temps, garde ses preuves de paiement
          et vérifie régulièrement ses obligations. Avec{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            Soumissions Comptable
          </Link>
          , vous pouvez éviter de gérer cette partie seul et trouver un
          accompagnement adapté pour piloter votre entreprise avec sérénité.
        </p>
      </ArticleSection>
    </>
  );
}