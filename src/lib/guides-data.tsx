import type { ReactNode } from "react";
import { CreerSarlCepiciContent } from "@/content/guides/creer-sarl-cepici";
import { SarlSaEiContent } from "@/content/guides/sarl-sa-ei-cote-divoire";
import { CalendrierFiscal2026Content } from "@/content/guides/calendrier-fiscal-ci-2026";
import { CoutCabinetAbidjanContent } from "@/content/guides/cout-cabinet-comptable-abidjan";
import { CreerEntrepriseDepuisFranceContent } from "@/content/guides/creer-entreprise-ci-depuis-france";
import { ImpotsEntrepriseContent } from "@/content/guides/impots-entreprise-cote-divoire";
import { ChoisirCabinetAbidjanContent } from "@/content/guides/choisir-cabinet-comptable-abidjan";
import { CepiciCoteDivoireContent } from "@/content/guides/cepici-cote-divoire";
import { TvaCoteDivoirePmeContent } from "@/content/guides/tva-cote-divoire-pme";
import { ObligationsComptablesSarlCiContent } from "@/content/guides/obligations-comptables-sarl-ci";
import { EntrepriseIndividuelleVsSarlContent } from "@/content/guides/entreprise-individuelle-vs-sarl";
import { CapitalMinimumSarlOhadaContent } from "@/content/guides/capital-minimum-sarl-ohada";
import { CnpsCoteDivoireEmployeursContent } from "@/content/guides/cnps-cote-divoire-employeurs";
import { AuditComptableObligatoireCiContent } from "@/content/guides/audit-comptable-obligatoire-ci";
import { DomiciliationEntrepriseAbidjanContent } from "@/content/guides/domiciliation-entreprise-abidjan";
import { CreerSaCoteDivoireContent } from "@/content/guides/creer-sa-cote-divoire";
import { CompteBancaireEntrepriseAbidjanContent } from "@/content/guides/compte-bancaire-entreprise-abidjan";
import { ErreursCreationEntrepriseCiContent } from "@/content/guides/erreurs-creation-entreprise-ci";
import { CabinetComptablePlateauAbidjanContent } from "@/content/guides/cabinet-comptable-plateau-abidjan";
import { CreerEntrepriseCiCanadaContent } from "@/content/guides/creer-entreprise-ci-canada";
import { CoutCreationEntrepriseContent } from "@/content/guides/cout-creation-entreprise-cote-divoire";
import { RccmCoteDivoireContent } from "@/content/guides/rccm-cote-divoire";
import { AidesCreationEntrepriseCiContent } from "@/content/guides/aides-creation-entreprise-ci";
import creerSarlCepiciImg from "@/assets/guides/creer-sarl-cepici.jpg";
import sarlSaEiImg from "@/assets/guides/sarl-sa-ei.jpg";
import calendrierFiscalImg from "@/assets/guides/calendrier-fiscal-2026.jpg";
import coutCabinetImg from "@/assets/guides/cout-cabinet-abidjan.jpg";
import diasporaFranceImg from "@/assets/guides/diaspora-france-ci.jpg";
import impotsEntrepriseImg from "@/assets/guides/impots-entreprise-ci.jpg";
import choisirCabinetImg from "@/assets/guides/choisir-cabinet-abidjan.jpg";

export type Category =
  | "Création d'entreprise"
  | "Comptabilité"
  | "Fiscalité"
  | "Diaspora"
  | "Domiciliation"
  | "Géo"
  | "Audit";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  categories: Category[];
  readTime: string;
  /** 1 = 🔴 priorité haute, 2 = 🟡 moyenne, 3 = 🟢 basse. Champ interne, non rendu. */
  priority: 1 | 2 | 3;
  /** Image hero de l'article (optionnel). */
  image?: string;
  /** Contenu rédigé de l'article (optionnel). Sans cela : placeholder. */
  content?: () => ReactNode;
  /** Date de publication ISO (YYYY-MM-DD). Utilisée pour le JSON-LD Article. */
  publishedAt?: string;
  /** Date de dernière mise à jour ISO (YYYY-MM-DD). Fallback : publishedAt. */
  updatedAt?: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "creer-sarl-cepici",
    title: "Comment créer une SARL au CEPICI en 2026 : guide complet",
    excerpt:
      "Découvrez comment créer une SARL au CEPICI en 2026 : étapes, documents, RCCM, IDU, frais, délais et accompagnement comptable.",
    categories: ["Création d'entreprise"],
    readTime: "12 min",
    priority: 1,
    image: creerSarlCepiciImg,
    content: () => <CreerSarlCepiciContent />,
  },
  {
    slug: "sarl-sa-ei-cote-divoire",
    title: "SARL vs SA vs Entreprise Individuelle en CI : quel statut choisir ?",
    excerpt:
      "SARL, SA ou entreprise individuelle en Côte d'Ivoire : découvrez les différences, avantages, limites, obligations et le meilleur statut selon votre projet.",
    categories: ["Création d'entreprise"],
    readTime: "11 min",
    priority: 1,
    image: sarlSaEiImg,
    content: () => <SarlSaEiContent />,
  },
  {
    slug: "calendrier-fiscal-ci-2026",
    title:
      "Calendrier fiscal 2026 en Côte d'Ivoire : dates clés pour les entreprises",
    excerpt:
      "Découvrez le calendrier fiscal 2026 en Côte d'Ivoire : TVA, ITS, BIC, BNC, patentes, déclarations fiscales et dates clés à respecter pour les entreprises.",
    categories: ["Fiscalité"],
    readTime: "12 min",
    priority: 1,
    image: calendrierFiscalImg,
    content: () => <CalendrierFiscal2026Content />,
  },
  {
    slug: "cout-cabinet-comptable-abidjan",
    title: "Combien coûte un cabinet comptable à Abidjan ?",
    excerpt:
      "Découvrez combien coûte un cabinet comptable à Abidjan : tarifs mensuels, bilan, déclarations fiscales, paie, facteurs de prix et conseils pour choisir.",
    categories: ["Comptabilité"],
    readTime: "10 min",
    priority: 1,
    image: coutCabinetImg,
    content: () => <CoutCabinetAbidjanContent />,
  },
  {
    slug: "creer-entreprise-ci-depuis-france",
    title: "Créer son entreprise en CI depuis la France : guide diaspora",
    excerpt:
      "Procuration, mandataire, CEPICI en ligne : comment monter votre société ivoirienne sans quitter la France.",
    categories: ["Diaspora", "Création d'entreprise"],
    readTime: "9 min",
    priority: 1,
    image: diasporaFranceImg,
    content: () => <CreerEntrepriseDepuisFranceContent />,
  },
  {
    slug: "impots-entreprise-cote-divoire",
    title: "Quels impôts paye une entreprise en Côte d'Ivoire ?",
    excerpt:
      "IS, TVA, ITS, patente, CNPS : tour d'horizon complet de la fiscalité applicable aux sociétés en CI.",
    categories: ["Fiscalité"],
    readTime: "8 min",
    priority: 1,
    image: impotsEntrepriseImg,
    content: () => <ImpotsEntrepriseContent />,
  },
  {
    slug: "choisir-cabinet-comptable-abidjan",
    title: "Comment choisir son cabinet comptable à Abidjan ?",
    excerpt:
      "Les 5 critères essentiels pour sélectionner un cabinet comptable fiable et adapté à votre activité.",
    categories: ["Comptabilité"],
    readTime: "6 min",
    priority: 1,
    image: choisirCabinetImg,
    content: () => <ChoisirCabinetAbidjanContent />,
  },
  {
    slug: "domiciliation-entreprise-abidjan",
    title: "Domiciliation d'entreprise à Abidjan : tout savoir",
    excerpt:
      "Quartiers, tarifs, prestations incluses : guide complet pour domicilier votre société à Abidjan.",
    categories: ["Domiciliation"],
    readTime: "6 min",
    priority: 2,
    content: () => <DomiciliationEntrepriseAbidjanContent />,
  },
  {
    slug: "obligations-comptables-sarl-ci",
    title: "Les obligations comptables d'une SARL en Côte d'Ivoire",
    excerpt:
      "Tenue de comptes SYSCOHADA, états financiers, DSF, audit : vos obligations annuelles expliquées simplement.",
    categories: ["Comptabilité"],
    readTime: "7 min",
    priority: 2,
    content: () => <ObligationsComptablesSarlCiContent />,
  },
  {
    slug: "cepici-cote-divoire",
    title: "Qu'est-ce que le CEPICI ? Rôle et procédures en 2026",
    excerpt:
      "Mission, services, guichet unique, procédures en ligne : tout ce qu'il faut savoir sur le CEPICI.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 2,
    content: () => <CepiciCoteDivoireContent />,
  },
  {
    slug: "creer-sa-cote-divoire",
    title: "Créer une SA en Côte d'Ivoire : conditions et procédures",
    excerpt:
      "Capital, gouvernance, formalités OHADA : comment constituer une Société Anonyme en CI.",
    categories: ["Création d'entreprise"],
    readTime: "8 min",
    priority: 2,
    content: () => <CreerSaCoteDivoireContent />,
  },
  {
    slug: "tva-cote-divoire-pme",
    title: "La TVA en Côte d'Ivoire : tout ce que doit savoir une PME",
    excerpt:
      "Taux, seuils, déclarations mensuelles, déductions : maîtrisez la TVA ivoirienne en tant que PME.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 2,
    content: () => <TvaCoteDivoirePmeContent />,
  },
  {
    slug: "creer-entreprise-ci-canada",
    title: "Créer son entreprise en CI depuis le Canada",
    excerpt:
      "Spécificités diaspora canadienne : décalage horaire, transferts, mandataire et formalités CEPICI à distance.",
    categories: ["Diaspora"],
    readTime: "8 min",
    priority: 2,
    content: () => <CreerEntrepriseCiCanadaContent />,
  },
  {
    slug: "cabinet-comptable-plateau-abidjan",
    title: "Cabinet comptable Plateau Abidjan : comment trouver le bon ?",
    excerpt:
      "Spécificités du Plateau (CBD), profils des cabinets, tarifs : guide pour bien choisir dans le quartier d'affaires.",
    categories: ["Géo", "Comptabilité"],
    readTime: "6 min",
    priority: 2,
    content: () => <CabinetComptablePlateauAbidjanContent />,
  },
  {
    slug: "capital-minimum-sarl-ohada",
    title: "Quel est le capital minimum d'une SARL en CI en 2026 ?",
    excerpt:
      "Règles OHADA, montant minimum, modalités de libération et bonnes pratiques pour fixer son capital.",
    categories: ["Création d'entreprise"],
    readTime: "5 min",
    priority: 2,
    content: () => <CapitalMinimumSarlOhadaContent />,
  },
  {
    slug: "cnps-cote-divoire-employeurs",
    title: "CNPS Côte d'Ivoire : obligations des employeurs",
    excerpt:
      "Immatriculation, taux de cotisation, déclarations : ce que tout employeur ivoirien doit savoir sur la CNPS.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 3,
    content: () => <CnpsCoteDivoireEmployeursContent />,
  },
  {
    slug: "compte-bancaire-entreprise-abidjan",
    title: "Comment ouvrir un compte bancaire pour son entreprise à Abidjan",
    excerpt:
      "Banques recommandées, documents requis, délais : ouvrir un compte pro à Abidjan sans mauvaise surprise.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
    content: () => <CompteBancaireEntrepriseAbidjanContent />,
  },
  {
    slug: "entreprise-individuelle-vs-sarl",
    title: "Entreprise individuelle vs SARL en CI : quand passer ?",
    excerpt:
      "Seuils, fiscalité, responsabilité : à quel moment transformer son EI en SARL en Côte d'Ivoire.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
    content: () => <EntrepriseIndividuelleVsSarlContent />,
  },
  {
    slug: "audit-comptable-obligatoire-ci",
    title: "L'audit comptable en CI : quand est-il obligatoire ?",
    excerpt:
      "Seuils légaux, types d'audit, commissariat aux comptes : tout savoir sur l'audit obligatoire en Côte d'Ivoire.",
    categories: ["Audit"],
    readTime: "6 min",
    priority: 3,
    content: () => <AuditComptableObligatoireCiContent />,
  },
  {
    slug: "erreurs-creation-entreprise-ci",
    title: "10 erreurs à éviter lors de la création d'entreprise en CI",
    excerpt:
      "Les pièges les plus fréquents observés au CEPICI et comment les contourner pour démarrer du bon pied.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 3,
    content: () => <ErreursCreationEntrepriseCiContent />,
  },
  {
    slug: "cout-creation-entreprise-cote-divoire",
    title:
      "Combien coûte la création d'une entreprise en Côte d'Ivoire en 2026 ?",
    excerpt:
      "Frais CEPICI, honoraires de cabinet, capital, notaire : tous les prix réels pour créer sa société en CI.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    content: () => <CoutCreationEntrepriseContent />,
  },
  {
    slug: "rccm-cote-divoire",
    title: "RCCM Côte d'Ivoire : qu'est-ce que c'est et comment l'obtenir ?",
    excerpt:
      "Registre du Commerce, inscription, renouvellement, coûts et délais : tout savoir sur le RCCM en CI.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    content: () => <RccmCoteDivoireContent />,
  },
  {
    slug: "aides-creation-entreprise-ci",
    title: "Aides et financements pour créer une entreprise en CI en 2026",
    excerpt:
      "CEPICI, FDFP, BEI, fonds d'investissement, incubateurs : les 3 types d'aides disponibles aux créateurs.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    content: () => <AidesCreationEntrepriseCiContent />,
  },
];

export const FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "Création d'entreprise", label: "Création d'entreprise" },
  { key: "Comptabilité", label: "Comptabilité" },
  { key: "Fiscalité", label: "Fiscalité" },
  { key: "Diaspora", label: "Diaspora" },
  { key: "Domiciliation", label: "Domiciliation" },
  { key: "Géo", label: "Géo" },
  { key: "Audit", label: "Audit" },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Articles triés par priorité (1 → 3), ordre stable au sein d'une même priorité. */
export const ARTICLES_SORTED: Article[] = [...ARTICLES].sort(
  (a, b) => a.priority - b.priority,
);

/**
 * Retourne jusqu'à `limit` articles similaires à celui passé en paramètre.
 * Priorise les articles partageant au moins une catégorie, puis complète
 * avec les plus prioritaires. N'inclut que les articles rédigés.
 */
export function getRelatedArticles(
  currentSlug: string,
  limit = 3,
): Article[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return [];
  const pool = ARTICLES_SORTED.filter(
    (a) => a.slug !== currentSlug && !!a.content,
  );
  const sameCategory = pool.filter((a) =>
    a.categories.some((c) => current.categories.includes(c)),
  );
  const others = pool.filter((a) => !sameCategory.includes(a));
  return [...sameCategory, ...others].slice(0, limit);
}