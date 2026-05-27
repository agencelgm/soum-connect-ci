// Maillage interne : pour chaque catégorie de guide, liste des pages
// services / ressources les plus pertinentes vers lesquelles renvoyer.
import type { Category } from "./guides-data";
import type { RelatedLink } from "./page-relations";

const L: Record<string, RelatedLink> = {
  creation: {
    to: "/creation-entreprise-cote-divoire",
    label: "Création d'entreprise en Côte d'Ivoire",
    description: "SARL, SARLU, SA, EI, GIE : démarches CEPICI accompagnées.",
  },
  compta: {
    to: "/comptabilite-entreprise-abidjan",
    label: "Comptabilité d'entreprise à Abidjan",
    description: "Tenue comptable, bilans et états financiers SYSCOHADA.",
  },
  fiscal: {
    to: "/declaration-fiscale-cote-divoire",
    label: "Déclaration fiscale en Côte d'Ivoire",
    description: "TVA, IS, IRPP, BIC : calendrier et obligations DGI.",
  },
  domiciliation: {
    to: "/domiciliation-entreprise-abidjan",
    label: "Domiciliation d'entreprise à Abidjan",
    description: "Adresse professionnelle au Plateau, Cocody, Marcory.",
  },
  cabinet: {
    to: "/cabinet-comptable-abidjan",
    label: "Cabinet comptable à Abidjan",
    description: "Cabinets agréés OECCA-CI dans toutes les communes d'Abidjan.",
  },
  diaspora: {
    to: "/creation-entreprise-diaspora-ivoirienne",
    label: "Création d'entreprise pour la diaspora",
    description: "Créer votre société ivoirienne depuis l'étranger.",
  },
  quotes: {
    to: "/demande-soumissions",
    label: "Obtenir 5 soumissions gratuites",
    description: "Comparez 5 cabinets agréés en 48h, sans engagement.",
  },
};

const MAP: Record<Category, RelatedLink[]> = {
  "Création d'entreprise": [L.creation, L.cabinet, L.domiciliation, L.quotes],
  Comptabilité: [L.compta, L.cabinet, L.fiscal, L.quotes],
  Fiscalité: [L.fiscal, L.compta, L.cabinet, L.quotes],
  Diaspora: [L.diaspora, L.creation, L.domiciliation, L.quotes],
  Domiciliation: [L.domiciliation, L.creation, L.cabinet, L.quotes],
  Géo: [L.cabinet, L.compta, L.creation, L.quotes],
  Audit: [L.compta, L.fiscal, L.cabinet, L.quotes],
};

/**
 * Retourne jusqu'à `limit` liens services pertinents pour un ensemble de
 * catégories d'article (déduplication par URL, ordre stable).
 */
export function getServiceLinksForCategories(categories: Category[], limit = 4): RelatedLink[] {
  const seen = new Set<string>();
  const out: RelatedLink[] = [];
  for (const cat of categories) {
    const links = MAP[cat] ?? [];
    for (const link of links) {
      if (seen.has(link.to)) continue;
      seen.add(link.to);
      out.push(link);
      if (out.length >= limit) return out;
    }
  }
  return out;
}
