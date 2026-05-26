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
import { CabinetComptableCocodyAbidjanContent } from "@/content/guides/cabinet-comptable-cocody-abidjan";
import { CabinetComptableAngreAbidjanContent } from "@/content/guides/cabinet-comptable-angre-abidjan";
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

// Photos réelles (Unsplash) — pas d'IA. Format paysage 16/9 optimisé.
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1280&q=70`;

const IMG = {
  domiciliation: U("1497366216548-37526070297c"),       // bureaux modernes
  obligations: U("1554224155-6726b3ff858f"),            // calculatrice / compta
  cepici: U("1450101499163-c8848c66ca85"),              // documents bureau
  creerSa: U("1556761175-5973dc0f32e7"),                // réunion conseil
  tva: U("1554224154-22dec7ec8818"),                    // factures / chiffres
  canada: U("1436491865332-7a61a109cc05"),              // avion / voyage
  plateau: U("1486406146926-c627a92ad1ab"),             // bureau pro
  cocody: U("1497366811353-6870744d04b2"),              // espace de travail
  angre: U("1497366216548-37526070297c"),               // bureau ouvert
  capital: U("1601597111158-2fceff292cdc"),             // billets de banque
  cnps: U("1573164713714-d95e436ab8d6"),                // équipe RH
  banque: U("1556742049-0cfed4f6a45d"),                 // carte bancaire
  eiVsSarl: U("1454165804606-c3d57bc86b40"),            // graphiques décision
  audit: U("1551836022-d5d88e9218df"),                  // loupe sur dossier
  erreurs: U("1521791136064-7986c2920216"),             // checklist / réunion
  coutCreation: U("1565514020179-026b92b84bb6"),        // billets FCFA
  rccm: U("1450101499163-c8848c66ca85"),                // registre officiel
  aides: U("1559526324-4b87b5e36e44"),                  // poignée de main
};

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
  /**
   * Audience marketing du guide — OBLIGATOIRE.
   * "creation" = lecteur qui veut créer son entreprise.
   * "gestion"  = lecteur qui a déjà une entreprise (compta, fiscal, audit…).
   * "both"     = sujet transverse (laisser inferAudience() trancher avec le formulaire).
   * Envoyé à GoHighLevel comme `audience_hint` pour router le prospect.
   * Ne JAMAIS ajouter un nouveau guide sans renseigner ce champ.
   */
  audience: "creation" | "gestion" | "both";
  /** Image hero de l'article (optionnel). */
  image?: string;
  /** Contenu rédigé de l'article (optionnel). Sans cela : placeholder. */
  content?: () => ReactNode;
  /** Date de publication ISO (YYYY-MM-DD). Utilisée pour le JSON-LD Article. */
  publishedAt?: string;
  /** Date de dernière mise à jour ISO (YYYY-MM-DD). Fallback : publishedAt. */
  updatedAt?: string;
  /** Résumé "En bref" (40-60 mots) affiché en tête d'article. Fallback : excerpt. */
  summary?: string;
  /** Paires Q/R extraites de l'article — émet un FAQPage schema quand fournies. */
  faqs?: Array<{ question: string; answer: string }>;
};

export const ARTICLES: Article[] = [
  {
    slug: "creer-sarl-cepici",
    audience: "creation",
    title: "Comment créer une SARL au CEPICI en 2026 : guide complet",
    excerpt:
      "Découvrez comment créer une SARL au CEPICI en 2026 : étapes, documents, RCCM, IDU, frais, délais et accompagnement comptable.",
    categories: ["Création d'entreprise"],
    readTime: "12 min",
    priority: 1,
    image: creerSarlCepiciImg,
    content: () => <CreerSarlCepiciContent />,
    publishedAt: "2026-01-15",
    updatedAt: "2026-05-01",
    summary:
      "Créer une SARL au CEPICI en 2026 demande 8 étapes clés : définir l'activité, choisir le nom, rédiger les statuts, fixer le siège, réunir les pièces, déposer le dossier au Guichet Unique, payer les frais (≈ 289 200 FCFA), puis obtenir RCCM, DFE et IDU sous 2 à 4 jours.",
    faqs: [
      {
        question: "Peut-on créer une SARL seul en Côte d'Ivoire ?",
        answer:
          "Oui, il est possible de créer une SARL seul. Dans ce cas, on parle généralement de SARL unipersonnelle (SARLU). Cette option peut convenir à un entrepreneur qui veut structurer son activité sans avoir d'associés.",
      },
      {
        question: "Faut-il passer par le CEPICI pour créer une SARL ?",
        answer:
          "Le CEPICI est le point central des formalités de création d'entreprise en Côte d'Ivoire. Le Guichet Unique facilite les démarches liées à la création, à l'immatriculation et à l'obtention des documents officiels.",
      },
      {
        question: "Quels documents faut-il pour créer une SARL au CEPICI ?",
        answer:
          "Il faut notamment les statuts, le formulaire unique Personne Morale, les pièces d'identité, les documents liés au siège social, le plan de localisation, les documents notariés et les informations sur les dirigeants. La liste exacte peut varier selon le dossier.",
      },
      {
        question: "Combien coûte la création d'une SARL au CEPICI ?",
        answer:
          "Le coût dépend du capital, des actes, du bail, des frais notariés et des formalités nécessaires. eRegulations donne un exemple de coût estimé à 289 200 FCFA pour une procédure de création de société, mais ce montant doit être adapté à chaque situation.",
      },
      {
        question: "Combien de temps faut-il pour créer une SARL au CEPICI ?",
        answer:
          "La durée estimée peut être de 2 à 4 jours selon eRegulations, mais le délai réel dépend de la qualité du dossier et des corrections éventuelles.",
      },
      {
        question: "L'IDU est-il obligatoire pour une SARL ?",
        answer:
          "L'IDU permet d'identifier une entreprise légalement constituée en Côte d'Ivoire. Il est attribué dès la création de la structure depuis le portail unique des services à l'investisseur.",
      },
    ],
  },
  {
    slug: "sarl-sa-ei-cote-divoire",
    audience: "creation",
    title: "SARL vs SA vs Entreprise Individuelle en CI : quel statut choisir ?",
    excerpt:
      "SARL, SA ou entreprise individuelle en Côte d'Ivoire : découvrez les différences, avantages, limites, obligations et le meilleur statut selon votre projet.",
    categories: ["Création d'entreprise"],
    readTime: "11 min",
    priority: 1,
    image: sarlSaEiImg,
    content: () => <SarlSaEiContent />,
    publishedAt: "2026-01-20",
    updatedAt: "2026-05-10",
    summary:
      "En Côte d'Ivoire, la SARL convient à la plupart des PME (capital libre, responsabilité limitée), la SA s'impose pour lever des fonds (capital minimum 10 M FCFA, 7 actionnaires), et l'entreprise individuelle reste adaptée aux activités modestes sans associés ni patrimoine séparé. Le choix dépend du capital disponible, du nombre d'associés et du niveau de risque accepté.",
  },
  {
    slug: "calendrier-fiscal-ci-2026",
    audience: "gestion",
    title:
      "Calendrier fiscal 2026 en Côte d'Ivoire : dates clés pour les entreprises",
    excerpt:
      "Découvrez le calendrier fiscal 2026 en Côte d'Ivoire : TVA, ITS, BIC, BNC, patentes, déclarations fiscales et dates clés à respecter pour les entreprises.",
    categories: ["Fiscalité"],
    readTime: "12 min",
    priority: 1,
    image: calendrierFiscalImg,
    content: () => <CalendrierFiscal2026Content />,
    publishedAt: "2026-01-05",
    updatedAt: "2026-05-10",
    summary:
      "Le calendrier fiscal 2026 ivoirien s'articule autour de quatre échéances mensuelles (TVA, ITS, prélèvements le 15) et de rendez-vous annuels : DSF avant le 30 avril, patente au 1er trimestre, IS soldé au 20 avril. Toute entreprise doit également respecter les acomptes BIC/BNC trimestriels et la déclaration CNPS mensuelle.",
  },
  {
    slug: "cout-cabinet-comptable-abidjan",
    audience: "gestion",
    title: "Combien coûte un cabinet comptable à Abidjan ?",
    excerpt:
      "Découvrez combien coûte un cabinet comptable à Abidjan : tarifs mensuels, bilan, déclarations fiscales, paie, facteurs de prix et conseils pour choisir.",
    categories: ["Comptabilité"],
    readTime: "10 min",
    priority: 1,
    image: coutCabinetImg,
    content: () => <CoutCabinetAbidjanContent />,
    publishedAt: "2026-01-25",
    updatedAt: "2026-05-10",
    summary:
      "À Abidjan, un cabinet comptable agréé OECCA-CI facture entre 80 000 et 400 000 FCFA par mois pour une PME, selon le volume d'écritures, le secteur d'activité et le quartier (Plateau plus cher que Cocody ou Marcory). La DSF annuelle s'ajoute en sus (200 000 à 1 M FCFA). Tarifs réels et grille détaillée dans le guide.",
  },
  {
    slug: "creer-entreprise-ci-depuis-france",
    audience: "creation",
    title: "Créer son entreprise en CI depuis la France : guide diaspora",
    excerpt:
      "Procuration, mandataire, CEPICI en ligne : comment monter votre société ivoirienne sans quitter la France.",
    categories: ["Diaspora", "Création d'entreprise"],
    readTime: "9 min",
    priority: 1,
    image: diasporaFranceImg,
    content: () => <CreerEntrepriseDepuisFranceContent />,
    publishedAt: "2026-02-01",
    updatedAt: "2026-05-12",
    summary:
      "Depuis la France, créer une SARL ou SA en Côte d'Ivoire est possible à 100 % à distance via un mandataire local muni d'une procuration légalisée. Le cabinet ivoirien dépose le dossier au CEPICI, paie les frais, récupère RCCM, DFE et IDU sous 4 jours, puis ouvre le compte bancaire au nom de la société.",
  },
  {
    slug: "impots-entreprise-cote-divoire",
    audience: "gestion",
    title: "Quels impôts paye une entreprise en Côte d'Ivoire ?",
    excerpt:
      "IS, TVA, ITS, patente, CNPS : tour d'horizon complet de la fiscalité applicable aux sociétés en CI.",
    categories: ["Fiscalité"],
    readTime: "8 min",
    priority: 1,
    image: impotsEntrepriseImg,
    content: () => <ImpotsEntrepriseContent />,
    publishedAt: "2026-02-05",
    updatedAt: "2026-05-12",
    summary:
      "Une entreprise ivoirienne paie cinq grandes catégories d'impôts : l'IS (25 % du bénéfice net), la TVA (18 % collectée et reversée mensuellement), l'ITS (retenue à la source sur salaires), la patente annuelle assise sur le CA et le loyer, et les cotisations CNPS employeur (≈ 18 % du brut). S'ajoutent BIC, BNC et taxes sectorielles.",
  },
  {
    slug: "choisir-cabinet-comptable-abidjan",
    audience: "gestion",
    title: "Comment choisir son cabinet comptable à Abidjan ?",
    excerpt:
      "Les 5 critères essentiels pour sélectionner un cabinet comptable fiable et adapté à votre activité.",
    categories: ["Comptabilité"],
    readTime: "6 min",
    priority: 1,
    image: choisirCabinetImg,
    content: () => <ChoisirCabinetAbidjanContent />,
    publishedAt: "2026-02-12",
    updatedAt: "2026-05-12",
    summary:
      "Pour choisir un cabinet comptable à Abidjan, vérifiez cinq critères : l'agrément OECCA-CI (obligatoire pour signer la DSF), l'expérience dans votre secteur, la transparence des honoraires, la réactivité aux échéances DGI et la proximité géographique. Comparez systématiquement au moins trois propositions avant de signer une lettre de mission annuelle.",
  },
  {
    slug: "domiciliation-entreprise-abidjan",
    audience: "gestion",
    title: "Domiciliation d'entreprise à Abidjan : tout savoir",
    excerpt:
      "Quartiers, tarifs, prestations incluses : guide complet pour domicilier votre société à Abidjan.",
    categories: ["Domiciliation"],
    readTime: "6 min",
    priority: 2,
    image: IMG.domiciliation,
    content: () => <DomiciliationEntrepriseAbidjanContent />,
    publishedAt: "2026-02-18",
    updatedAt: "2026-05-12",
    summary:
      "La domiciliation d'entreprise à Abidjan permet de disposer d'une adresse de siège social professionnelle sans louer de bureau. Tarifs : 25 000 à 80 000 FCFA par mois selon le quartier (Plateau plus cher que Cocody ou Marcory). Inclut généralement réception du courrier, scan, mise à disposition de salles de réunion ponctuelles.",
  },
  {
    slug: "obligations-comptables-sarl-ci",
    audience: "gestion",
    title: "Les obligations comptables d'une SARL en Côte d'Ivoire",
    excerpt:
      "Tenue de comptes SYSCOHADA, états financiers, DSF, audit : vos obligations annuelles expliquées simplement.",
    categories: ["Comptabilité"],
    readTime: "7 min",
    priority: 2,
    image: IMG.obligations,
    content: () => <ObligationsComptablesSarlCiContent />,
    publishedAt: "2026-02-22",
    updatedAt: "2026-05-12",
    summary:
      "Toute SARL ivoirienne doit tenir une comptabilité SYSCOHADA complète (journal, grand livre, balance), produire des états financiers annuels (bilan, compte de résultat, TAFIRE, annexes), déposer une DSF avant le 30 avril et conserver les pièces 10 ans. Un commissaire aux comptes devient obligatoire au-delà de 250 M FCFA de CA.",
  },
  {
    slug: "cepici-cote-divoire",
    audience: "creation",
    title: "Qu'est-ce que le CEPICI ? Rôle et procédures en 2026",
    excerpt:
      "Mission, services, guichet unique, procédures en ligne : tout ce qu'il faut savoir sur le CEPICI.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 2,
    image: IMG.cepici,
    content: () => <CepiciCoteDivoireContent />,
    publishedAt: "2026-02-28",
    updatedAt: "2026-05-12",
    summary:
      "Le CEPICI (Centre de Promotion des Investissements en Côte d'Ivoire) est le Guichet Unique de création d'entreprise, situé à Riviera Golf, Abidjan. Il centralise les démarches RCCM, DFE, IDU, CNPS et publication au JORCI en un seul dépôt. Délai moyen : 24 à 72 heures. Frais fixes ≈ 289 200 FCFA pour une SARL.",
  },
  {
    slug: "creer-sa-cote-divoire",
    audience: "creation",
    title: "Créer une SA en Côte d'Ivoire : conditions et procédures",
    excerpt:
      "Capital, gouvernance, formalités OHADA : comment constituer une Société Anonyme en CI.",
    categories: ["Création d'entreprise"],
    readTime: "8 min",
    priority: 2,
    image: IMG.creerSa,
    content: () => <CreerSaCoteDivoireContent />,
    publishedAt: "2026-03-05",
    updatedAt: "2026-05-15",
    summary:
      "Créer une SA en Côte d'Ivoire exige un capital minimum de 10 M FCFA (100 M si appel public à l'épargne), au moins 7 actionnaires (ou 1 pour une SA unipersonnelle), un commissaire aux comptes dès la création et la nomination d'un conseil d'administration. Statuts notariés obligatoires, dépôt au CEPICI sous 8 jours après libération du capital.",
  },
  {
    slug: "tva-cote-divoire-pme",
    audience: "gestion",
    title: "La TVA en Côte d'Ivoire : tout ce que doit savoir une PME",
    excerpt:
      "Taux, seuils, déclarations mensuelles, déductions : maîtrisez la TVA ivoirienne en tant que PME.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 2,
    image: IMG.tva,
    content: () => <TvaCoteDivoirePmeContent />,
    publishedAt: "2026-03-10",
    updatedAt: "2026-05-15",
    summary:
      "La TVA en Côte d'Ivoire s'applique au taux normal de 18 % (9 % pour certains produits réglementés). Toute entreprise dépassant 50 M FCFA de CA annuel est assujettie de plein droit. Déclaration et paiement mensuels avant le 15. La TVA déductible se récupère sur les achats professionnels justifiés par factures conformes.",
  },
  {
    slug: "creer-entreprise-ci-canada",
    audience: "creation",
    title: "Créer son entreprise en CI depuis le Canada",
    excerpt:
      "Spécificités diaspora canadienne : décalage horaire, transferts, mandataire et formalités CEPICI à distance.",
    categories: ["Diaspora"],
    readTime: "8 min",
    priority: 2,
    image: IMG.canada,
    content: () => <CreerEntrepriseCiCanadaContent />,
    publishedAt: "2026-03-15",
    updatedAt: "2026-05-15",
    summary:
      "Depuis le Canada, créer une entreprise en Côte d'Ivoire passe par un cabinet ivoirien mandataire et une procuration légalisée à l'ambassade. Comptez 5 à 7 jours ouvrés malgré le décalage horaire. Les transferts de capital se font via virement SWIFT vers le compte bloqué CEPICI. Frais totaux : 350 000 à 600 000 FCFA tout compris.",
  },
  {
    slug: "cabinet-comptable-plateau-abidjan",
    audience: "gestion",
    title: "Cabinet comptable Plateau Abidjan : comment trouver le bon ?",
    excerpt:
      "Spécificités du Plateau (CBD), profils des cabinets, tarifs : guide pour bien choisir dans le quartier d'affaires.",
    categories: ["Géo", "Comptabilité"],
    readTime: "6 min",
    priority: 2,
    image: IMG.plateau,
    content: () => <CabinetComptablePlateauAbidjanContent />,
    publishedAt: "2026-02-10",
    updatedAt: "2026-05-15",
    summary:
      "Le Plateau, CBD d'Abidjan, concentre Big Four et cabinets spécialisés grands comptes. Honoraires 20 à 30 % plus élevés qu'à Cocody ou Marcory. Pertinent pour groupes, multinationales, ONG et entreprises soumises à audit légal. Pour une PME standard, un cabinet de Cocody offre un meilleur rapport qualité-prix à compétences équivalentes.",
    faqs: [
      {
        question: "Les cabinets du Plateau sont-ils meilleurs que les autres ?",
        answer: "Pas nécessairement. La qualité d'un cabinet dépend de son agrément OECCA-CI, de l'expérience de ses experts-comptables et de sa réactivité — pas de son adresse.",
      },
      {
        question: "Un cabinet du Plateau peut-il suivre mon entreprise si je suis à Yopougon ?",
        answer: "Oui, sans aucun problème. La gestion comptable se fait principalement à distance grâce à la dématérialisation et à la télédéclaration sur le portail e-impôts de la DGI.",
      },
      {
        question: "Comment vérifier qu'un cabinet est agréé OECCA-CI ?",
        answer: "Demandez le numéro d'inscription à l'Ordre et vérifiez-le sur le site officiel oecca-ci.org. Sans agrément, aucune DSF signée n'est recevable.",
      },
      {
        question: "Quel est le tarif moyen d'une tenue comptable mensuelle au Plateau ?",
        answer: "Entre 150 000 et 400 000 FCFA par mois pour une PME, contre 80 000 à 250 000 FCFA dans des quartiers comme Cocody ou Marcory.",
      },
    ],
  },
  {
    slug: "cabinet-comptable-cocody-abidjan",
    audience: "gestion",
    title: "Cabinet comptable Cocody Abidjan : guide complet 2026",
    excerpt:
      "Tarifs, sous-quartiers (Riviera, Angré, 2 Plateaux), administrations proches : comment choisir un cabinet comptable agréé OECCA-CI à Cocody.",
    categories: ["Géo", "Comptabilité"],
    readTime: "7 min",
    priority: 1,
    image: IMG.cocody,
    content: () => <CabinetComptableCocodyAbidjanContent />,
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    summary:
      "Cocody est le second pôle économique d'Abidjan après le Plateau. Ses cabinets comptables agréés OECCA-CI couvrent Riviera, Deux-Plateaux et Angré, avec des tarifs inférieurs de 20 à 30 % à ceux du Plateau pour une qualité équivalente. Idéal pour PME de services, professions libérales, cliniques, écoles privées et ONG.",
    faqs: [
      {
        question: "Où se trouve le centre des impôts DGI le plus proche de Cocody ?",
        answer: "Le Centre Moyennes Entreprises (CME) Cocody se trouve à Cocody Centre, près du carrefour Saint-Jean. Les grandes entreprises (CA > 3 milliards FCFA) dépendent de la DGE au Plateau.",
      },
      {
        question: "Y a-t-il beaucoup de cabinets agréés OECCA-CI à Cocody ?",
        answer: "Oui. Cocody est, après le Plateau, la commune qui concentre le plus grand nombre de cabinets d'expertise comptable agréés, principalement en Riviera, Deux-Plateaux et Angré.",
      },
      {
        question: "Un cabinet de Cocody peut-il gérer une entreprise basée à Yopougon ?",
        answer: "Oui, sans difficulté. La dématérialisation des factures et la télédéclaration sur le portail e-impôts permettent à un cabinet de Cocody de suivre des clients partout dans le Grand Abidjan.",
      },
      {
        question: "Combien coûte un comptable à Cocody pour une SARL débutante ?",
        answer: "Entre 80 000 et 150 000 FCFA par mois pour une SARL réalisant moins de 100 millions FCFA de chiffre d'affaires, hors DSF annuelle facturée séparément (250 000 à 600 000 FCFA).",
      },
    ],
  },
  {
    slug: "cabinet-comptable-angre-abidjan",
    audience: "gestion",
    title: "Cabinet comptable Angré Abidjan : tarifs et conseils 2026",
    excerpt:
      "Comment choisir un cabinet comptable agréé OECCA-CI à Angré (Cocody) : tarifs TPE/PME, administrations proches, cabinets recommandés.",
    categories: ["Géo", "Comptabilité"],
    readTime: "6 min",
    priority: 1,
    image: IMG.angre,
    content: () => <CabinetComptableAngreAbidjanContent />,
    publishedAt: "2026-05-20",
    updatedAt: "2026-05-20",
    summary:
      "Angré, sous-quartier en pleine expansion de Cocody, abrite restaurants, écoles privées, cliniques et PME de services. Ses cabinets comptables agréés OECCA-CI, majoritairement de taille humaine, proposent un service de proximité 25 à 35 % moins cher qu'au Plateau, avec l'agence CNPS Cocody à la 8e tranche et le CME Cocody à 15 minutes.",
    faqs: [
      {
        question: "Où se trouve le centre des impôts DGI le plus proche d'Angré ?",
        answer: "Le CME Cocody (Centre Moyennes Entreprises) à Cocody Centre est le centre de rattachement par défaut des PME d'Angré, à 10-15 minutes en voiture hors heures de pointe.",
      },
      {
        question: "Y a-t-il des cabinets agréés OECCA-CI à Angré ?",
        answer: "Oui, une vingtaine de cabinets agréés sont installés à Angré, principalement de la 7e à la 9e tranche. Vérifiez l'agrément sur oecca-ci.org avant toute signature.",
      },
      {
        question: "Un cabinet d'Angré peut-il créer ma SARL au CEPICI ?",
        answer: "Oui. Le CEPICI est à Riviera Golf, à 15 minutes d'Angré. La plupart des cabinets locaux proposent une création SARL clé en main (statuts, dépôt, RCCM, IDU) entre 180 000 et 350 000 FCFA.",
      },
      {
        question: "Quelle différence avec un cabinet de Cocody-Riviera ?",
        answer: "Riviera cible une clientèle plus haut de gamme (ONG, expatriés, cliniques) avec des honoraires supérieurs. Angré est plus orienté TPE/PME locales. La qualité technique est identique dès lors que les deux sont agréés OECCA-CI.",
      },
    ],
  },
  {
    slug: "capital-minimum-sarl-ohada",
    audience: "creation",
    title: "Quel est le capital minimum d'une SARL en CI en 2026 ?",
    excerpt:
      "Règles OHADA, montant minimum, modalités de libération et bonnes pratiques pour fixer son capital.",
    categories: ["Création d'entreprise"],
    readTime: "5 min",
    priority: 2,
    image: IMG.capital,
    content: () => <CapitalMinimumSarlOhadaContent />,
    publishedAt: "2026-03-20",
    updatedAt: "2026-05-15",
    summary:
      "Depuis la réforme OHADA, le capital minimum d'une SARL en Côte d'Ivoire est librement fixé par les associés — pratiquement, 100 000 FCFA suffisent juridiquement. En pratique, viser 1 à 5 M FCFA reste recommandé pour crédibiliser la société face aux banques et fournisseurs. Libération minimale : 50 % à la constitution, solde sous 2 ans.",
  },
  {
    slug: "cnps-cote-divoire-employeurs",
    audience: "gestion",
    title: "CNPS Côte d'Ivoire : obligations des employeurs",
    excerpt:
      "Immatriculation, taux de cotisation, déclarations : ce que tout employeur ivoirien doit savoir sur la CNPS.",
    categories: ["Fiscalité"],
    readTime: "7 min",
    priority: 3,
    image: IMG.cnps,
    content: () => <CnpsCoteDivoireEmployeursContent />,
    publishedAt: "2026-03-25",
    updatedAt: "2026-05-15",
    summary:
      "Tout employeur ivoirien doit s'immatriculer à la CNPS dans les 8 jours suivant la première embauche, déclarer mensuellement ses salariés et verser les cotisations avant le 15 du mois suivant. Taux : ≈ 18,45 % à la charge de l'employeur (retraite, prestations familiales, accident du travail) et 6,30 % retenus sur le brut du salarié.",
  },
  {
    slug: "compte-bancaire-entreprise-abidjan",
    audience: "creation",
    title: "Comment ouvrir un compte bancaire pour son entreprise à Abidjan",
    excerpt:
      "Banques recommandées, documents requis, délais : ouvrir un compte pro à Abidjan sans mauvaise surprise.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
    image: IMG.banque,
    content: () => <CompteBancaireEntrepriseAbidjanContent />,
    publishedAt: "2026-04-01",
    updatedAt: "2026-05-15",
    summary:
      "Ouvrir un compte bancaire entreprise à Abidjan demande RCCM, DFE, IDU, statuts, pièce d'identité du gérant et justificatif d'adresse du siège. Délai moyen : 5 à 15 jours selon la banque (SGCI, Ecobank, NSIA, BOA, Orabank). Pour la création SARL, un compte bloqué CEPICI est exigé avant immatriculation.",
  },
  {
    slug: "entreprise-individuelle-vs-sarl",
    audience: "creation",
    title: "Entreprise individuelle vs SARL en CI : quand passer ?",
    excerpt:
      "Seuils, fiscalité, responsabilité : à quel moment transformer son EI en SARL en Côte d'Ivoire.",
    categories: ["Création d'entreprise"],
    readTime: "6 min",
    priority: 3,
    image: IMG.eiVsSarl,
    content: () => <EntrepriseIndividuelleVsSarlContent />,
    publishedAt: "2026-04-05",
    updatedAt: "2026-05-15",
    summary:
      "Passer d'une entreprise individuelle à une SARL en Côte d'Ivoire devient pertinent dès 30 à 50 M FCFA de CA annuel, ou plus tôt si l'activité présente un risque patrimonial (prestation, BTP, importation). La SARL protège le patrimoine personnel, ouvre l'accès au crédit et facilite l'entrée d'associés ou d'investisseurs.",
  },
  {
    slug: "audit-comptable-obligatoire-ci",
    audience: "gestion",
    title: "L'audit comptable en CI : quand est-il obligatoire ?",
    excerpt:
      "Seuils légaux, types d'audit, commissariat aux comptes : tout savoir sur l'audit obligatoire en Côte d'Ivoire.",
    categories: ["Audit"],
    readTime: "6 min",
    priority: 3,
    image: IMG.audit,
    content: () => <AuditComptableObligatoireCiContent />,
    publishedAt: "2026-04-10",
    updatedAt: "2026-05-15",
    summary:
      "En Côte d'Ivoire, le commissariat aux comptes devient obligatoire pour une SARL dès qu'elle dépasse 250 M FCFA de chiffre d'affaires, 125 M FCFA de total bilan ou 50 salariés. Toute SA est soumise à audit dès la création. Le commissaire aux comptes doit être inscrit à l'OECCA-CI et son mandat est de 3 ans renouvelable.",
  },
  {
    slug: "erreurs-creation-entreprise-ci",
    audience: "creation",
    title: "10 erreurs à éviter lors de la création d'entreprise en CI",
    excerpt:
      "Les pièges les plus fréquents observés au CEPICI et comment les contourner pour démarrer du bon pied.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 3,
    image: IMG.erreurs,
    content: () => <ErreursCreationEntrepriseCiContent />,
    publishedAt: "2026-04-15",
    updatedAt: "2026-05-15",
    summary:
      "Les 10 erreurs les plus coûteuses lors de la création d'entreprise en CI : statuts mal rédigés, capital sous-évalué, mauvais code APE, oubli de l'IDU, retard d'affiliation CNPS, négligence de la patente, choix du mauvais centre des impôts, gérance non déclarée, absence de comptable et confusion entre siège social et domiciliation.",
  },
  {
    slug: "cout-creation-entreprise-cote-divoire",
    audience: "creation",
    title:
      "Combien coûte la création d'une entreprise en Côte d'Ivoire en 2026 ?",
    excerpt:
      "Frais CEPICI, honoraires de cabinet, capital, notaire : tous les prix réels pour créer sa société en CI.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    image: IMG.coutCreation,
    content: () => <CoutCreationEntrepriseContent />,
    publishedAt: "2026-04-20",
    updatedAt: "2026-05-15",
    summary:
      "Créer une SARL en Côte d'Ivoire en 2026 coûte environ 289 200 FCFA de frais CEPICI obligatoires (RCCM, DFE, IDU, JORCI), auxquels s'ajoutent 150 000 à 400 000 FCFA d'honoraires si vous passez par un cabinet, plus le capital social libéré. Pour une SA, prévoir 600 000 à 1,2 M FCFA tout compris (statuts notariés inclus).",
  },
  {
    slug: "rccm-cote-divoire",
    audience: "creation",
    title: "RCCM Côte d'Ivoire : qu'est-ce que c'est et comment l'obtenir ?",
    excerpt:
      "Registre du Commerce, inscription, renouvellement, coûts et délais : tout savoir sur le RCCM en CI.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    image: IMG.rccm,
    content: () => <RccmCoteDivoireContent />,
    publishedAt: "2026-04-25",
    updatedAt: "2026-05-15",
    summary:
      "Le RCCM (Registre du Commerce et du Crédit Mobilier) est le numéro d'immatriculation officiel de toute entreprise en Côte d'Ivoire, attribué par le Tribunal de Commerce via le CEPICI. Il est obligatoire pour facturer, ouvrir un compte bancaire pro et contracter. Coût : 15 000 FCFA, délivré sous 24 à 72 heures, à mentionner sur toutes les factures.",
  },
  {
    slug: "aides-creation-entreprise-ci",
    audience: "creation",
    title: "Aides et financements pour créer une entreprise en CI en 2026",
    excerpt:
      "CEPICI, FDFP, BEI, fonds d'investissement, incubateurs : les 3 types d'aides disponibles aux créateurs.",
    categories: ["Création d'entreprise"],
    readTime: "7 min",
    priority: 2,
    image: IMG.aides,
    content: () => <AidesCreationEntrepriseCiContent />,
    publishedAt: "2026-05-01",
    updatedAt: "2026-05-15",
    summary:
      "Trois grandes catégories d'aides existent pour créer une entreprise en Côte d'Ivoire : les dispositifs publics (CEPICI, FDFP, Agence Emploi Jeunes, FAFCI), les fonds privés et bailleurs (BEI, Proparco, Africinvest, business angels) et les incubateurs/accélérateurs (Orange Fab, Seedstars, La Fabrique). Conditions et plafonds détaillés dans le guide.",
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