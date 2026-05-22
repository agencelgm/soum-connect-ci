// Centralised internal-linking map for SEO / GEO / AEO.
// Each route declares its visible breadcrumb and a list of semantically
// related pages, used by <Breadcrumbs /> and <RelatedLinks />.

export type RelatedLink = {
  to: string;
  label: string;
  description?: string;
};

export type Crumb = { label: string; to?: string };

export type PageRelations = {
  breadcrumb: Crumb[];
  related: RelatedLink[];
};

const HOME: Crumb = { label: "Accueil", to: "/" };

// Pré-déclaration des liens fréquemment utilisés pour rester DRY.
const L = {
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
    description: "Créer votre société en Côte d'Ivoire depuis l'étranger.",
  },
  partenaires: {
    to: "/cabinets-comptables-partenaires",
    label: "Cabinets comptables partenaires",
    description: "Vous êtes cabinet ? Recevez des leads qualifiés.",
  },
  faq: {
    to: "/faq",
    label: "Questions fréquentes",
    description: "Réponses sur la création, la comptabilité et la fiscalité.",
  },
  comment: {
    to: "/comment-ca-marche",
    label: "Comment ça marche",
    description: "Notre processus en 3 étapes pour recevoir 5 soumissions.",
  },
  guides: {
    to: "/guides",
    label: "Guides & ressources",
    description: "Guides pratiques pour entrepreneurs ivoiriens.",
  },
  blog: {
    to: "/blog",
    label: "Blog",
    description: "Analyses et actualités pour les dirigeants en CI.",
  },
  about: {
    to: "/a-propos",
    label: "À propos",
    description: "La mission et l'équipe SoumissionsComptables.ci.",
  },
  quotes: {
    to: "/demande-soumissions",
    label: "Obtenir 5 soumissions gratuites",
    description: "Formulaire en 2 minutes, réponses sous 48h.",
  },
} as const;

const SERVICES_CRUMB: Crumb = { label: "Services" };

export const PAGE_RELATIONS: Record<string, PageRelations> = {
  "/creation-entreprise-cote-divoire": {
    breadcrumb: [HOME, SERVICES_CRUMB, { label: "Création d'entreprise" }],
    related: [L.compta, L.fiscal, L.domiciliation, L.diaspora, L.cabinet, L.guides],
  },
  "/creer-son-entreprise-cote-divoire": {
    breadcrumb: [HOME, { label: "Créer son entreprise" }],
    related: [L.creation, L.diaspora, L.domiciliation, L.compta, L.cabinet, L.guides],
  },
  "/comptabilite-entreprise-abidjan": {
    breadcrumb: [HOME, SERVICES_CRUMB, { label: "Comptabilité d'entreprise" }],
    related: [L.fiscal, L.creation, L.domiciliation, L.cabinet, L.guides, L.faq],
  },
  "/declaration-fiscale-cote-divoire": {
    breadcrumb: [HOME, SERVICES_CRUMB, { label: "Déclaration fiscale" }],
    related: [L.compta, L.creation, L.cabinet, L.guides, L.faq, L.diaspora],
  },
  "/domiciliation-entreprise-abidjan": {
    breadcrumb: [HOME, SERVICES_CRUMB, { label: "Domiciliation à Abidjan" }],
    related: [L.creation, L.compta, L.cabinet, L.fiscal, L.diaspora, L.faq],
  },
  "/cabinet-comptable-abidjan": {
    breadcrumb: [HOME, { label: "Villes" }, { label: "Abidjan" }],
    related: [L.creation, L.compta, L.fiscal, L.domiciliation, L.diaspora, L.partenaires],
  },
  "/creation-entreprise-diaspora-ivoirienne": {
    breadcrumb: [HOME, SERVICES_CRUMB, { label: "Diaspora ivoirienne" }],
    related: [L.creation, L.domiciliation, L.compta, L.fiscal, L.cabinet, L.faq],
  },
  "/cabinets-comptables-partenaires": {
    breadcrumb: [HOME, { label: "Cabinets partenaires" }],
    related: [L.about, L.comment, L.cabinet, L.guides, L.faq, L.quotes],
  },
  "/faq": {
    breadcrumb: [HOME, { label: "FAQ" }],
    related: [L.creation, L.compta, L.fiscal, L.cabinet, L.comment, L.guides],
  },
  "/comment-ca-marche": {
    breadcrumb: [HOME, { label: "Comment ça marche" }],
    related: [L.creation, L.compta, L.fiscal, L.cabinet, L.faq, L.about],
  },
  "/a-propos": {
    breadcrumb: [HOME, { label: "À propos" }],
    related: [L.comment, L.partenaires, L.cabinet, L.faq, L.guides, L.creation],
  },
  "/blog": {
    breadcrumb: [HOME, { label: "Blog" }],
    related: [L.guides, L.faq, L.creation, L.compta, L.fiscal, L.cabinet],
  },
  "/guides": {
    breadcrumb: [HOME, { label: "Guides" }],
    related: [L.creation, L.compta, L.fiscal, L.cabinet, L.faq, L.blog],
  },
  "/demande-soumissions": {
    breadcrumb: [HOME, { label: "Demande de soumissions" }],
    related: [L.comment, L.cabinet, L.creation, L.faq, L.guides, L.about],
  },
};

export function getPageRelations(path: string): PageRelations | undefined {
  return PAGE_RELATIONS[path];
}
