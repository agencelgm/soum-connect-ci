import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CabinetComptableAngreAbidjanContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Angré est une zone résidentielle et commerciale en pleine expansion de
          la commune de Cocody. Le quartier accueille de nombreuses PME, écoles
          privées, cliniques, restaurants et commerces. Les cabinets comptables
          agréés OECCA-CI implantés à Angré (de la 7e à la 9e tranche) offrent
          un service de proximité à des tarifs inférieurs de 25 à 35 % à ceux
          pratiqués au Plateau, pour une qualité équivalente.
        </p>
      </ArticleCallout>

      <ArticleSection title="Angré : un quartier en pleine croissance économique">
        <p>
          <strong>Angré</strong> est l&apos;un des sous-quartiers de Cocody les
          plus dynamiques. Découpé en plusieurs tranches (7e, 8e, 9e), il s&apos;est
          structuré ces quinze dernières années autour d&apos;un axe résidentiel
          haut de gamme et d&apos;un tissu commercial dense : restaurants,
          supermarchés (Prosuma, Carrefour Market), pharmacies, écoles privées
          et cliniques.
        </p>
        <p>
          Cette croissance a attiré de nombreuses PME de services, des startups
          et des cabinets professionnels (avocats, architectes,
          experts-comptables). On y trouve aussi le siège de plusieurs
          fédérations professionnelles et organismes paritaires, ainsi qu&apos;une
          <strong> agence CNPS</strong> à la 8e tranche.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels businesses prédominent à Angré ?">
        <ArticleList
          items={[
            "Restaurants, cafés et services de restauration (forte concentration sur le boulevard Latrille)",
            "Écoles privées primaires, secondaires et supérieures (Institut International d'Abidjan, écoles bilingues)",
            "Cliniques, cabinets dentaires et centres médicaux spécialisés",
            "Agences de communication, sociétés de conseil et freelances IT",
            "Commerces de détail, prêt-à-porter, instituts de beauté",
            "Promoteurs immobiliers et agences de courtage actifs sur le marché résidentiel",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Administrations et services utiles à proximité d'Angré">
        <ArticleTable
          headers={["Service", "Localisation", "Distance d'Angré"]}
          rows={[
            ["CME Cocody (centre des impôts)", "Cocody Centre", "10-15 min"],
            ["CNPS agence Cocody", "Angré 8e tranche", "Sur place"],
            ["CEPICI", "Riviera Golf", "15 min"],
            ["DGE (grandes entreprises)", "Plateau", "25-35 min"],
            ["Tribunal de commerce", "Plateau", "25-35 min"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Combien coûte un cabinet comptable à Angré ?">
        <ArticleTable
          headers={["Mission", "Cabinets Angré", "Cabinets Plateau"]}
          rows={[
            ["Tenue comptable mensuelle TPE", "60 000 – 150 000 FCFA", "120 000 – 300 000 FCFA"],
            ["Tenue comptable mensuelle PME", "100 000 – 250 000 FCFA", "150 000 – 400 000 FCFA"],
            ["DSF annuelle SARL", "200 000 – 500 000 FCFA", "400 000 – 1 000 000 FCFA"],
            ["Création SARL clé en main", "180 000 – 350 000 FCFA", "300 000 – 600 000 FCFA"],
          ]}
        />
        <p className="mt-4">
          La majorité des cabinets d&apos;Angré sont des structures à taille
          humaine (1 à 5 collaborateurs) qui privilégient un suivi
          personnalisé. C&apos;est un choix particulièrement pertinent pour les
          créateurs d&apos;entreprise et les PME en phase de croissance.
        </p>
      </ArticleSection>

      <ArticleSection title="Pourquoi privilégier un cabinet local à Angré ?">
        <ArticleList
          items={[
            "Proximité physique : remise de pièces, signatures et réunions sans embouteillages",
            "Connaissance du tissu économique local (commerces, écoles, restaurants)",
            "Tarifs alignés sur la réalité des TPE/PME, sans surcoût de quartier d'affaires",
            "Réactivité accrue : la plupart des cabinets répondent dans la journée",
            "Réseau utile : recommandations vers avocats, notaires et banques du quartier",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Où se trouve le centre des impôts DGI le plus proche d&apos;Angré ?
            </h3>
            <p className="mt-2">
              Le <strong>CME Cocody</strong> (Centre Moyennes Entreprises) à
              Cocody Centre est le centre de rattachement par défaut des PME
              d&apos;Angré. Comptez 10 à 15 minutes en voiture hors heures de
              pointe.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Y a-t-il des cabinets agréés OECCA-CI à Angré ?
            </h3>
            <p className="mt-2">
              Oui, une vingtaine de cabinets agréés sont installés à Angré, en
              majorité de la 7e à la 9e tranche. Vérifiez systématiquement
              l&apos;agrément sur <strong>oecca-ci.org</strong> avant de signer
              une lettre de mission.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Un cabinet d&apos;Angré peut-il créer ma SARL au CEPICI ?
            </h3>
            <p className="mt-2">
              Oui. Le CEPICI est situé à la Riviera Golf, à environ 15 minutes
              d&apos;Angré. La plupart des cabinets locaux proposent des
              prestations de création clé en main (statuts, dépôt, RCCM, IDU)
              entre 180 000 et 350 000 FCFA tout compris.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Quelle est la différence avec un cabinet de Cocody-Riviera ?
            </h3>
            <p className="mt-2">
              Les cabinets de Riviera ont tendance à cibler une clientèle plus
              haut de gamme (ONG, expatriés, cliniques) avec des honoraires un
              peu supérieurs. Angré est plus orienté TPE/PME locales. Le
              service rendu est techniquement identique dès lors que les deux
              sont agréés OECCA-CI.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title="Voir aussi">
        <ArticleList
          items={[
            <><Link to="/cabinet-comptable-abidjan" className="text-primary underline">Cabinet comptable Abidjan : guide complet</Link> — page hub de référence.</>,
            <><Link to="/guides/$slug" params={{ slug: "cabinet-comptable-cocody-abidjan" }} className="text-primary underline">Cabinet comptable Cocody Abidjan</Link> — quartier-mère d&apos;Angré.</>,
            <><Link to="/guides/$slug" params={{ slug: "cabinet-comptable-plateau-abidjan" }} className="text-primary underline">Cabinet comptable Plateau Abidjan</Link> — pour grands comptes.</>,
          ]}
        />
      </ArticleSection>

      <ArticleCTA
        title="Trouvez un cabinet comptable à Angré en 48 h"
        description="Recevez jusqu'à 5 propositions de cabinets agréés OECCA-CI installés à Angré et alentours. Comparez tarifs, expérience et disponibilité."
        ctaLabel="Obtenir 5 devis gratuits"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : OECCA-CI, CEPICI, DGI Côte d&apos;Ivoire.
      </p>
    </>
  );
}