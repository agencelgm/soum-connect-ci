import type { ReactNode } from "react";
import { CreerSarlCepiciContent } from "@/content/guides/creer-sarl-cepici";
import { SarlSaEiContent } from "@/content/guides/sarl-sa-ei-cote-divoire";
import { CalendrierFiscal2026Content } from "@/content/guides/calendrier-fiscal-ci-2026";
import { CoutCabinetAbidjanContent } from "@/content/guides/cout-cabinet-comptable-abidjan";
import { CreerEntrepriseDepuisFranceContent } from "@/content/guides/creer-entreprise-ci-depuis-france";
import { ImpotsEntrepriseContent } from "@/content/guides/impots-entreprise-cote-divoire";
import { ChoisirCabinetAbidjanContent } from "@/content/guides/choisir-cabinet-comptable-abidjan";
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
};

export const ARTICLES: Article[] = [
  {
    slug: "creer-sarl-cepici",
    title: "Comment créer une SARL au CEPICI en 2026 — Guide Complet",
    excerpt:
      "Toutes les étapes pour créer votre SARL via le guichet unique CEPICI : documents, capital, délais et coûts.",
    categories: ["Création d'entreprise"],
    readTime: "9 min",
    priority: 1,
    image: creerSarlCepiciImg,
    content: () => <CreerSarlCepiciContent />,
  },
  {
    slug: "sarl-sa-ei-cote-divoire",
    title: "SARL vs SA vs Entreprise Individuelle en CI : quel statut choisir ?",
    excerpt:
      "Comparatif détaillé des trois formes juridiques les plus courantes en Côte d'Ivoire pour bien choisir.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
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
  },
  {
    slug: "obligations-comptables-sarl-ci",
    title: "Les obligations comptables d'une SARL en Côte d'Ivoire",
    excerpt:
      "Tenue de comptes SYSCOHADA, états financiers, DSF, audit : vos obligations annuelles expliquées simplement.",
    categories: ["Comptabilité"],
    readTime: "7 min",
    priority: 2,
  },
  {
    slug: "cepici-cote-divoire",
    title: "Qu'est-ce que le CEPICI ? Rôle et procédures en 2026",
    excerpt:
      "Mission, services, guichet unique, procédures en ligne : tout ce qu'il faut savoir sur le CEPICI.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 2,
  },
  {
    slug: "creer-sa-cote-divoire",
    title: "Créer une SA en Côte d'Ivoire : conditions et procédures",
    excerpt:
      "Capital, gouvernance, formalités OHADA : comment constituer une Société Anonyme en CI.",
    categories: ["Création d'entreprise"],
    readTime: "8 min",
    priority: 2,
  },
  {
    slug: "tva-cote-divoire-pme",
    title: "La TVA en Côte d'Ivoire : tout ce que doit savoir une PME",
    excerpt:
      "Taux, seuils, déclarations mensuelles, déductions : maîtrisez la TVA ivoirienne en tant que PME.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 2,
  },
  {
    slug: "creer-entreprise-ci-canada",
    title: "Créer son entreprise en CI depuis le Canada",
    excerpt:
      "Spécificités diaspora canadienne : décalage horaire, transferts, mandataire et formalités CEPICI à distance.",
    categories: ["Diaspora"],
    readTime: "8 min",
    priority: 2,
  },
  {
    slug: "cabinet-comptable-plateau-abidjan",
    title: "Cabinet comptable Plateau Abidjan : comment trouver le bon ?",
    excerpt:
      "Spécificités du Plateau (CBD), profils des cabinets, tarifs : guide pour bien choisir dans le quartier d'affaires.",
    categories: ["Géo", "Comptabilité"],
    readTime: "6 min",
    priority: 2,
  },
  {
    slug: "capital-minimum-sarl-ohada",
    title: "Quel est le capital minimum d'une SARL en CI en 2026 ?",
    excerpt:
      "Règles OHADA, montant minimum, modalités de libération et bonnes pratiques pour fixer son capital.",
    categories: ["Création d'entreprise"],
    readTime: "5 min",
    priority: 2,
  },
  {
    slug: "cnps-cote-divoire-employeurs",
    title: "CNPS Côte d'Ivoire : obligations des employeurs",
    excerpt:
      "Immatriculation, taux de cotisation, déclarations : ce que tout employeur ivoirien doit savoir sur la CNPS.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 3,
  },
  {
    slug: "compte-bancaire-entreprise-abidjan",
    title: "Comment ouvrir un compte bancaire pour son entreprise à Abidjan",
    excerpt:
      "Banques recommandées, documents requis, délais : ouvrir un compte pro à Abidjan sans mauvaise surprise.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
  },
  {
    slug: "entreprise-individuelle-vs-sarl",
    title: "Entreprise individuelle vs SARL en CI : quand passer ?",
    excerpt:
      "Seuils, fiscalité, responsabilité : à quel moment transformer son EI en SARL en Côte d'Ivoire.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
  },
  {
    slug: "audit-comptable-obligatoire-ci",
    title: "L'audit comptable en CI : quand est-il obligatoire ?",
    excerpt:
      "Seuils légaux, types d'audit, commissariat aux comptes : tout savoir sur l'audit obligatoire en Côte d'Ivoire.",
    categories: ["Audit"],
    readTime: "6 min",
    priority: 3,
  },
  {
    slug: "erreurs-creation-entreprise-ci",
    title: "10 erreurs à éviter lors de la création d'entreprise en CI",
    excerpt:
      "Les pièges les plus fréquents observés au CEPICI et comment les contourner pour démarrer du bon pied.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 3,
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