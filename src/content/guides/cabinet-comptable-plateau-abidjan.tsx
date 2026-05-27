import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";
import { Link } from "@tanstack/react-router";

export function CabinetComptablePlateauAbidjanContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Le Plateau est le quartier central des affaires d&apos;Abidjan et concentre la majorité
          des grandes entreprises, multinationales et institutions financières. Les cabinets
          comptables du Plateau sont généralement plus grands, plus chers et plus spécialisés dans
          les grands comptes. Pour une PME, un cabinet de Cocody ou Marcory offre souvent un
          meilleur rapport qualité-prix à compétences équivalentes.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi le Plateau concentre-t-il autant de cabinets comptables ?">
        <p>
          Le <strong>Plateau</strong> est le Central Business District (CBD) d&apos;Abidjan. Il
          abrite les sièges sociaux des grandes banques (SGCI, Ecobank, BOA, NSIA), des
          multinationales, des institutions internationales (BCEAO, BOAD, BRVM), des administrations
          fiscales (DGI, Trésor Public) et le siège de l&apos;OECCA-CI.
        </p>
        <p>
          Cette concentration crée une demande forte pour des services comptables de haut niveau. On
          y trouve une gamme de cabinets très variée : des Big Four (Deloitte, PwC, KPMG, EY) aux
          cabinets locaux de taille moyenne, en passant par des cabinets spécialisés (BTP, ONG,
          finance).
        </p>
      </ArticleSection>

      <ArticleSection title="Quel type d'entreprise a vraiment besoin d'un cabinet au Plateau ?">
        <p>Un cabinet au Plateau est pertinent si :</p>
        <ArticleList
          items={[
            "Votre siège social est au Plateau et vous avez des réunions régulières avec votre cabinet",
            "Votre activité implique des relations avec des bailleurs internationaux qui valorisent un cabinet de renom",
            "Votre chiffre d'affaires dépasse 500 millions FCFA et vous êtes soumis à l'audit légal",
            "Vous avez des enjeux de financement importants (levée de fonds, crédit bancaire significatif)",
          ]}
        />
        <p>
          Pour une PME standard avec un CA entre 20 et 200 millions FCFA, un cabinet de Cocody,
          Marcory ou Treichville offre une qualité équivalente à 20-30 % moins cher.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les profils de cabinets présents au Plateau ?">
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les Big Four et cabinets internationaux
        </h3>
        <p>
          PwC, Deloitte, KPMG et EY s&apos;adressent principalement aux grandes entreprises,
          multinationales et groupes qui ont besoin d&apos;une certification internationale des
          comptes. Leurs honoraires démarrent en général à plusieurs millions de FCFA par an.
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les cabinets de taille moyenne
        </h3>
        <p>
          Cabinets locaux bien établis avec plusieurs associés experts-comptables. Ils accompagnent
          des PME de taille significative (CA entre 200 millions et 5 milliards FCFA).
        </p>
        <h3 className="font-heading font-semibold text-lg text-foreground mt-4">
          Les petits cabinets et praticiens indépendants
        </h3>
        <p>
          Experts-comptables agréés exerçant en solo ou en petite structure. Ils offrent un
          accompagnement personnalisé à des tarifs plus abordables.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels sont les tarifs pratiqués par les cabinets du Plateau ?">
        <ArticleTable
          headers={["Type de mission", "Cabinets Plateau", "Autres communes"]}
          rows={[
            ["Tenue comptable mensuelle PME", "150 000 – 400 000 FCFA", "80 000 – 250 000 FCFA"],
            ["DSF annuelle", "400 000 – 1 000 000 FCFA", "200 000 – 500 000 FCFA"],
            ["Création SARL", "300 000 – 600 000 FCFA", "150 000 – 350 000 FCFA"],
            ["Audit légal PME", "2 000 000 – 5 000 000 FCFA", "1 000 000 – 3 000 000 FCFA"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Comment choisir le bon cabinet comptable au Plateau ?">
        <p>Quatre critères sont décisifs, indépendamment du quartier :</p>
        <ArticleList
          items={[
            <>
              <strong>L&apos;agrément OECCA-CI</strong> : sans agrément, pas de signature DSF
              possible.
            </>,
            <>
              <strong>L&apos;expérience sectorielle</strong> : un cabinet qui suit 20 entreprises de
              BTP comprend votre secteur mieux qu&apos;un généraliste.
            </>,
            <>
              <strong>La réactivité</strong> : demandez le délai moyen de réponse aux emails.
            </>,
            <>
              <strong>La transparence tarifaire</strong> : exigez un devis détaillé.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Faut-il absolument être au Plateau pour avoir un bon cabinet ?">
        <p>
          Non. La dématérialisation des documents comptables et les déclarations fiscales en ligne
          ont transformé la relation entre entreprises et cabinets. Un cabinet à Cocody-Riviera,
          Marcory ou Treichville peut suivre une entreprise dont le siège est au Plateau sans aucune
          difficulté opérationnelle.
        </p>
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Les cabinets du Plateau sont-ils meilleurs que les autres ?
            </h3>
            <p className="mt-2">
              Pas nécessairement. La qualité d&apos;un cabinet dépend de son agrément OECCA-CI, de
              l&apos;expérience de ses experts-comptables et de sa réactivité — pas de son adresse.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Un cabinet du Plateau peut-il suivre mon entreprise si je suis à Yopougon ?
            </h3>
            <p className="mt-2">
              Oui, sans aucun problème. La gestion comptable se fait principalement à distance.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Comment vérifier qu&apos;un cabinet est agréé OECCA-CI ?
            </h3>
            <p className="mt-2">
              Demandez le numéro d&apos;inscription et vérifiez-le sur le site de l&apos;OECCA-CI
              (oecca-ci.org).
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title="Voir aussi">
        <ArticleList
          items={[
            <>
              <Link to="/cabinet-comptable-abidjan" className="text-primary underline">
                Cabinet comptable Abidjan : guide complet
              </Link>{" "}
              — page hub de référence.
            </>,
            <>
              <Link
                to="/guides/$slug"
                params={{ slug: "cabinet-comptable-cocody-abidjan" }}
                className="text-primary underline"
              >
                Cabinet comptable Cocody Abidjan
              </Link>{" "}
              — alternative pour PME.
            </>,
            <>
              <Link
                to="/guides/$slug"
                params={{ slug: "cabinet-comptable-angre-abidjan" }}
                className="text-primary underline"
              >
                Cabinet comptable Angré Abidjan
              </Link>{" "}
              — quartier voisin.
            </>,
          ]}
        />
      </ArticleSection>

      <ArticleCTA
        title="Comparez des cabinets comptables à Abidjan — Plateau et autres communes"
        description="Recevez jusqu'à 5 propositions de cabinets agréés OECCA-CI à Abidjan. Précisez votre localisation et votre type d'activité pour des propositions adaptées."
        ctaLabel="Obtenir 5 devis gratuits"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : OECCA-CI, pratiques des cabinets abidjanais.
      </p>
    </>
  );
}
