import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
} from "@/components/guides/article-blocks";

export function ChoisirCabinetAbidjanContent() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">
        Bien <strong>choisir son cabinet comptable à Abidjan</strong> peut faire gagner des années
        de sérénité à une entreprise. Entre l'agrément OECCA-CI, le périmètre des missions et le
        coût mensuel, cinq critères font la différence. Ce guide vous donne la méthode pour ne pas
        vous tromper, que vous soyez une TPE naissante ou une PME structurée.
      </p>

      <ArticleSection title="Pourquoi le choix du cabinet est-il si stratégique ?">
        <p>
          Votre cabinet comptable est{" "}
          <strong>le premier conseil financier de votre entreprise</strong>. Il sécurise vos
          déclarations, optimise votre fiscalité légale et alerte sur les risques de trésorerie. Un
          mauvais cabinet, à l'inverse, peut générer des pénalités lourdes ou rater une opportunité
          d'exonération CEPICI.
        </p>
        <ArticleCallout variant="info" title="Bon à savoir">
          Seul un expert-comptable agréé OECCA-CI (Ordre des Experts Comptables et Comptables Agréés
          de Côte d'Ivoire) peut signer une DSF et engager sa responsabilité civile professionnelle.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Quels sont les 5 critères essentiels à vérifier ?">
        <p>
          Cinq critères suffisent pour <strong>écarter 80 % des mauvais choix</strong> : l'agrément
          OECCA-CI, l'expérience sectorielle, le périmètre exact des missions, la réactivité, et la
          transparence tarifaire.
        </p>
        <ArticleList
          ordered
          items={[
            <>
              <strong>L'agrément OECCA-CI</strong> — Vérifiez le numéro d'inscription sur le site de
              l'Ordre. Pas d'agrément = pas de signature DSF possible.
            </>,
            <>
              <strong>L'expérience de votre secteur</strong> — BTP, ONG, e-commerce, restauration :
              chaque secteur a ses spécificités fiscales et SYSCOHADA.
            </>,
            <>
              <strong>Le périmètre des missions</strong> — Tenue, TVA, paie, DSF, conseil : exigez
              la liste précise de ce qui est inclus dans le forfait.
            </>,
            <>
              <strong>La réactivité</strong> — Délai de réponse moyen, interlocuteur dédié,
              disponibilité avant les échéances : ces points conditionnent votre quotidien.
            </>,
            <>
              <strong>La transparence tarifaire</strong> — Forfait, options hors forfait, missions
              ponctuelles : tout doit figurer sur le devis.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Quelles questions poser lors du premier rendez-vous ?">
        <p>
          Préparez une <strong>liste de questions concrètes</strong> pour comparer les cabinets sur
          des bases comparables. La réponse doit être précise et chiffrée, pas un argumentaire
          commercial.
        </p>
        <ArticleList
          items={[
            "Combien d'entreprises de mon secteur suivez-vous aujourd'hui ?",
            "Qui sera mon interlocuteur principal au quotidien (associé, collaborateur, junior) ?",
            "Quel est votre délai de réponse moyen par email ?",
            "Quels outils utilisez-vous pour la dématérialisation des pièces ?",
            "Comment gérez-vous les contrôles fiscaux DGI ?",
            "Le forfait inclut-il les déclarations CNPS, ITS et la paie ?",
          ]}
        />
        <ArticleCallout variant="tip" title="Astuce comparatif">
          Demandez à chaque cabinet le même devis détaillé avec votre volume réel de pièces. Les
          écarts de prix à périmètre identique sont souvent surprenants.
        </ArticleCallout>
      </ArticleSection>

      <ArticleSection title="Faut-il privilégier un cabinet du Plateau ou de proximité ?">
        <p>
          La localisation joue moins qu'avant grâce à la dématérialisation. Un{" "}
          <strong>
            cabinet de proximité (Yopougon, Treichville, Marcory) est souvent 20 à 30 % moins cher
          </strong>{" "}
          qu'un cabinet du Plateau ou de Cocody Riviera, à qualité équivalente pour une PME
          standard.
        </p>
        <p>
          En revanche, certains projets justifient un cabinet du Plateau : relations avec des
          bailleurs internationaux, accompagnement de levée de fonds, ou activité multi-pays.
          Consultez notre guide dédié{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "cabinet-comptable-plateau-abidjan" }}
            className="text-secondary underline"
          >
            cabinet comptable au Plateau Abidjan
          </Link>
          .
        </p>
      </ArticleSection>

      <ArticleSection title="Comment comparer efficacement plusieurs cabinets ?">
        <p>
          La méthode la plus rapide consiste à{" "}
          <strong>solliciter 3 à 5 cabinets en parallèle</strong> avec un brief identique. Vous
          pouvez le faire vous-même via votre réseau, ou{" "}
          <Link to="/demande-soumissions" className="text-secondary underline">
            obtenir gratuitement jusqu'à 5 soumissions
          </Link>{" "}
          de cabinets agréés OECCA-CI en 48 h.
        </p>
        <p>
          Pour anticiper le budget, lisez notre guide{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "cout-cabinet-comptable-abidjan" }}
            className="text-secondary underline"
          >
            combien coûte un cabinet comptable à Abidjan
          </Link>
          , qui détaille les fourchettes par profil d'entreprise.
        </p>
      </ArticleSection>

      <ArticleCTA />

      <ArticleSection title="Questions fréquentes">
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Comment vérifier qu'un cabinet est bien agréé OECCA-CI ?
        </h3>
        <p>
          Demandez son numéro d'inscription à l'Ordre et vérifiez-le sur le site officiel de
          l'OECCA-CI. Un cabinet sérieux affiche son agrément sans hésitation.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Peut-on changer de cabinet en cours d'exercice ?
        </h3>
        <p>
          Oui, mais l'idéal est de le faire à la clôture (généralement le 31 décembre) pour éviter
          les ruptures dans le suivi comptable.
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Faut-il un cabinet local pour une société diaspora ?
        </h3>
        <p>
          Indispensable. Le cabinet sert aussi de mandataire local et dépose vos déclarations à la
          DGI et à la CNPS. Voir notre guide{" "}
          <Link
            to="/guides/$slug"
            params={{ slug: "creer-entreprise-ci-depuis-france" }}
            className="text-secondary underline"
          >
            créer son entreprise en CI depuis la France
          </Link>
          .
        </p>
        <h3 className="font-heading font-semibold text-primary text-lg mt-6">
          Un cabinet peut-il aussi créer ma société ?
        </h3>
        <p>
          Oui. La plupart des cabinets agréés proposent la création de SARL, SARLU ou SA via le
          CEPICI en mission ponctuelle (150 000 à 400 000 FCFA).
        </p>
      </ArticleSection>
    </>
  );
}
