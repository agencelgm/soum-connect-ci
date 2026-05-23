import { Link } from "@tanstack/react-router";
import {
  ArticleSection,
  ArticleCallout,
  ArticleList,
  ArticleCTA,
  ArticleTable,
} from "@/components/guides/article-blocks";

export function CabinetComptableCocodyAbidjanContent() {
  return (
    <>
      <ArticleCallout variant="info" title="En bref">
        <p>
          Cocody est l&apos;un des quartiers résidentiels et tertiaires les plus
          dynamiques d&apos;Abidjan. Riviera, Deux-Plateaux, Angré et le Plateau-Dokui
          y concentrent une forte population de PME, ONG, professions libérales,
          cliniques privées et startups. Les cabinets comptables agréés OECCA-CI
          de Cocody offrent un excellent rapport qualité-prix face à ceux du
          Plateau, pour des honoraires généralement inférieurs de 20 à 30 %.
        </p>
      </ArticleCallout>

      <ArticleSection title="Pourquoi choisir un cabinet comptable à Cocody ?">
        <p>
          <strong>Cocody</strong> est la commune la plus peuplée du Grand Abidjan
          (plus de 700 000 habitants) et le second pôle économique de la ville
          après le Plateau. Son tissu économique se caractérise par une forte
          densité de PME de services (conseil, communication, IT), de
          professions libérales (médecins, avocats, architectes), de cliniques
          et d&apos;écoles privées, ainsi que d&apos;ONG internationales installées
          en Riviera Golf et à la Riviera 2 Plateaux.
        </p>
        <p>
          Les sous-quartiers les plus actifs pour l&apos;activité comptable sont
          la <strong>Riviera</strong> (Palmeraie, Bonoumin, Faya), les{" "}
          <strong>Deux-Plateaux</strong> (Vallons, ENA, Aghien), <strong>Angré</strong>{" "}
          (8e, 9e tranche) et le <strong>Plateau-Dokui</strong>. La proximité
          avec le siège du <strong>CEPICI</strong> à la Riviera Golf et le centre
          des impôts <strong>DGE/CME Cocody</strong> en fait un point d&apos;ancrage
          stratégique pour la gestion fiscale.
        </p>
      </ArticleSection>

      <ArticleSection title="Quels types d'entreprises trouvent un cabinet à Cocody ?">
        <ArticleList
          items={[
            "PME de services (agences digitales, cabinets de conseil, sociétés IT) installées en Riviera et Deux-Plateaux",
            "Professions libérales (médecins, dentistes, avocats, notaires, architectes) en SARL ou EI",
            "Cliniques et centres médicaux privés (Polyclinique Internationale Sainte-Anne-Marie, Hôpital Mère-Enfant)",
            "Écoles privées et structures de formation (forte concentration à Angré et 2 Plateaux)",
            "ONG internationales et bureaux pays de bailleurs (USAID, AFD, GIZ)",
            "Commerces de proximité, restaurants et boutiques en Riviera, Palmeraie et Cocody Centre",
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Administrations proches utiles pour votre comptable">
        <ArticleTable
          headers={["Administration", "Localisation", "Utilité"]}
          rows={[
            ["CEPICI (siège)", "Riviera Golf, Cocody", "Création RCCM, IDU, modifications statutaires"],
            ["CME Cocody (DGI)", "Cocody Centre", "Déclarations TVA, IS, ITS pour PME"],
            ["DGE", "Plateau (15 min en heures creuses)", "Grandes entreprises (CA > 3 Mds FCFA)"],
            ["CNPS agence Cocody", "Angré 8e tranche", "Immatriculation employeur, cotisations sociales"],
            ["OECCA-CI (siège)", "Plateau", "Vérification de l'agrément des experts-comptables"],
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Tarifs pratiqués par les cabinets de Cocody">
        <ArticleTable
          headers={["Mission", "Cabinets Cocody", "Cabinets Plateau"]}
          rows={[
            ["Tenue comptable mensuelle PME", "80 000 – 250 000 FCFA", "150 000 – 400 000 FCFA"],
            ["DSF annuelle SARL", "250 000 – 600 000 FCFA", "400 000 – 1 000 000 FCFA"],
            ["Création SARL clé en main", "200 000 – 400 000 FCFA", "300 000 – 600 000 FCFA"],
            ["Audit légal PME", "1 200 000 – 3 000 000 FCFA", "2 000 000 – 5 000 000 FCFA"],
          ]}
        />
        <p className="mt-4">
          Les écarts de prix s&apos;expliquent par la structure de coûts : un
          cabinet du Plateau supporte des loyers de bureau 2 à 3 fois supérieurs
          à un cabinet équivalent installé à Cocody Angré ou Riviera Palmeraie.
        </p>
      </ArticleSection>

      <ArticleSection title="Comment choisir le bon cabinet comptable à Cocody ?">
        <ArticleList
          items={[
            <><strong>Vérifiez l&apos;agrément OECCA-CI</strong> sur oecca-ci.org — sans agrément, aucune DSF signée n&apos;est recevable.</>,
            <><strong>Privilégiez un cabinet implanté dans votre sous-quartier</strong> (Riviera, Angré, 2 Plateaux) pour limiter les déplacements.</>,
            <><strong>Demandez 3 références clients</strong> dans votre secteur d&apos;activité (santé, ONG, services).</>,
            <><strong>Exigez un devis détaillé</strong> distinguant tenue comptable, déclarations fiscales, DSF et conseil.</>,
            <><strong>Comparez au moins 3 propositions</strong> avant de signer une lettre de mission annuelle.</>,
          ]}
        />
      </ArticleSection>

      <ArticleSection title="Questions fréquentes">
        <div className="space-y-6">
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Où se trouve le centre des impôts DGI le plus proche de Cocody ?
            </h3>
            <p className="mt-2">
              Le <strong>Centre Moyennes Entreprises (CME) Cocody</strong> est
              situé à Cocody Centre, à proximité du carrefour Saint-Jean. Les
              grandes entreprises dépendent de la <strong>DGE</strong> au
              Plateau. Votre cabinet comptable connaît votre centre de
              rattachement selon votre chiffre d&apos;affaires.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Y a-t-il beaucoup de cabinets agréés OECCA-CI à Cocody ?
            </h3>
            <p className="mt-2">
              Oui. Cocody est, après le Plateau, la commune qui compte le plus
              grand nombre de cabinets d&apos;expertise comptable agréés. La
              majorité sont implantés en Riviera, aux Deux-Plateaux et à Angré.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Un cabinet de Cocody peut-il gérer une entreprise basée à Yopougon ?
            </h3>
            <p className="mt-2">
              Oui, sans difficulté. La dématérialisation des factures et la
              télédéclaration sur le portail e-impôts de la DGI permettent à un
              cabinet de Cocody de suivre des clients dans tout le Grand
              Abidjan, voire à l&apos;intérieur du pays.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Combien coûte un comptable à Cocody pour une SARL débutante ?
            </h3>
            <p className="mt-2">
              Comptez entre <strong>80 000 et 150 000 FCFA par mois</strong>{" "}
              pour une SARL réalisant moins de 100 millions FCFA de chiffre
              d&apos;affaires, hors DSF annuelle facturée séparément.
            </p>
          </div>
        </div>
      </ArticleSection>

      <ArticleSection title="Voir aussi">
        <ArticleList
          items={[
            <><Link to="/cabinet-comptable-abidjan" className="text-primary underline">Cabinet comptable Abidjan : guide complet</Link> — page hub de référence.</>,
            <><Link to="/guides/$slug" params={{ slug: "cabinet-comptable-plateau-abidjan" }} className="text-primary underline">Cabinet comptable Plateau Abidjan</Link> — alternative pour grands comptes.</>,
            <><Link to="/guides/$slug" params={{ slug: "cabinet-comptable-angre-abidjan" }} className="text-primary underline">Cabinet comptable Angré Abidjan</Link> — sous-quartier voisin.</>,
          ]}
        />
      </ArticleSection>

      <ArticleCTA
        title="Trouvez un cabinet comptable à Cocody en 48 h"
        description="Recevez jusqu'à 5 propositions de cabinets agréés OECCA-CI implantés à Cocody (Riviera, Angré, 2 Plateaux). Comparez tarifs, expérience sectorielle et réactivité."
        ctaLabel="Obtenir 5 devis gratuits"
      />
      <p className="mt-6 text-sm text-muted-foreground">
        Mis à jour en mai 2026. Sources : OECCA-CI, CEPICI, DGI Côte d&apos;Ivoire.
      </p>
    </>
  );
}