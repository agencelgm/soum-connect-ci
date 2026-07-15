import tutoVideo from "@/assets/tutoriel-partenaire.mp4.asset.json";
import prospectVsClient from "@/assets/academie/prospect-vs-client.mp4.asset.json";
import inboundVsOutbound from "@/assets/academie/inbound-vs-outbound.mp4.asset.json";

/**
 * Slug spécial : la vidéo n°1 de l'Académie EST la vidéo obligatoire du
 * tutoriel partenaire. Sa progression est stockée dans les colonnes
 * `partners.tutorial_watched_at` / `partners.tutorial_max_progress`
 * (voir markTutorialProgress). Toutes les autres vidéos utilisent la
 * table `partner_video_progress`.
 */
export const TUTORIAL_VIDEO_SLUG = "comprendre-soumission-comptable";

export type AcademieVideo = {
  /** URL: /academie/$module/$slug */
  slug: string;
  /** Ordre d'affichage à l'intérieur du module (croissant). */
  order: number;
  title: string;
  /** Court résumé — utilisé en meta description et carte listing. */
  description: string;
  /** Bloc "En bref" HTML statique (40–60 mots) pour AEO/SEO. */
  brief: string;
  /** Points clés visibles sur la page (bullets). */
  keyPoints: string[];
  /** URL CDN de la vidéo. */
  videoUrl: string;
  /** Durée approximative (affichée). Ex : "8 min". */
  duration: string;
};

export type AcademieModule = {
  /** URL: /academie/$module */
  slug: string;
  order: number;
  title: string;
  description: string;
  videos: AcademieVideo[];
};

export const ACADEMIE_MODULES: AcademieModule[] = [
  {
    slug: "vente",
    order: 1,
    title: "Vente & prospection",
    description:
      "Les fondamentaux pour transformer un prospect en client fidèle.",
    videos: [
      {
        slug: TUTORIAL_VIDEO_SLUG,
        order: 1,
        title: "Comprendre SoumissionComptable.com",
        description:
          "Comment fonctionne la plateforme et comment tirer le meilleur parti de vos leads partenaires.",
        brief:
          "Vidéo d'introduction obligatoire pour tous les nouveaux cabinets partenaires. Vous découvrez le fonctionnement de la marketplace, la logique des crédits, le déblocage des leads et les bonnes pratiques pour maximiser vos conversions.",
        keyPoints: [
          "Le fonctionnement de la marketplace de leads",
          "Comment débloquer un prospect avec des crédits",
          "Les règles à respecter pour rester actif",
        ],
        videoUrl: tutoVideo.url,
        duration: "8 min",
      },
      {
        slug: "prospect-vs-client",
        order: 2,
        title: "Prospect vs client : les 3 étapes avant la vente",
        description:
          "La différence fondamentale entre un prospect et un client, et les 3 phases par lesquelles chaque personne passe avant de devenir client.",
        brief:
          "Un prospect n'est pas encore un client — il découvre à peine votre cabinet. Cette vidéo explique la différence, puis détaille les 3 étapes (prise de conscience, considération, décision) par lesquelles chaque personne passe avant d'acheter, et comment adapter votre discours à chacune.",
        keyPoints: [
          "La différence concrète entre un prospect et un client",
          "Les 3 étapes du parcours d'achat",
          "Le bon message au bon moment pour ne rien brûler",
        ],
        videoUrl: prospectVsClient.url,
        duration: "10 min",
      },
      {
        slug: "inbound-vs-outbound",
        order: 3,
        title: "Inbound vs Outbound : deux façons d'aller chercher des clients",
        description:
          "La différence entre l'inbound (le client vient à vous) et l'outbound (vous allez vers le client), et comment les combiner dans un cabinet comptable.",
        brief:
          "En vente, il existe deux grandes approches : l'inbound, où le client vous trouve grâce à votre visibilité (site, SEO, bouche-à-oreille, SoumissionComptable.com), et l'outbound, où vous allez chercher activement le client (appels, emails, visites, réseautage). Cette vidéo explique les deux et comment les combiner.",
        keyPoints: [
          "Ce qu'est l'inbound et pourquoi il coûte moins cher à long terme",
          "Ce qu'est l'outbound et quand il reste indispensable",
          "Comment combiner les deux dans un cabinet comptable",
        ],
        videoUrl: inboundVsOutbound.url,
        duration: "9 min",
      },
    ],
  },
];

export type AcademieVideoLocation = {
  module: AcademieModule;
  video: AcademieVideo;
  index: number; // position globale (ordre de visionnage)
  prev: { moduleSlug: string; video: AcademieVideo } | null;
  next: { moduleSlug: string; video: AcademieVideo } | null;
};

/** Toutes les vidéos, ordonnées par module.order puis video.order. */
export function allVideosOrdered(): Array<{ module: AcademieModule; video: AcademieVideo }> {
  const out: Array<{ module: AcademieModule; video: AcademieVideo }> = [];
  const modules = [...ACADEMIE_MODULES].sort((a, b) => a.order - b.order);
  for (const m of modules) {
    const vids = [...m.videos].sort((a, b) => a.order - b.order);
    for (const v of vids) out.push({ module: m, video: v });
  }
  return out;
}

export function findVideo(moduleSlug: string, videoSlug: string): AcademieVideoLocation | null {
  const flat = allVideosOrdered();
  const idx = flat.findIndex(
    (x) => x.module.slug === moduleSlug && x.video.slug === videoSlug,
  );
  if (idx === -1) return null;
  const cur = flat[idx];
  const prev = idx > 0 ? { moduleSlug: flat[idx - 1].module.slug, video: flat[idx - 1].video } : null;
  const next =
    idx < flat.length - 1
      ? { moduleSlug: flat[idx + 1].module.slug, video: flat[idx + 1].video }
      : null;
  return { module: cur.module, video: cur.video, index: idx, prev, next };
}

export function nextVideoAfterTutorial(): { moduleSlug: string; video: AcademieVideo } | null {
  const flat = allVideosOrdered();
  const idx = flat.findIndex((x) => x.video.slug === TUTORIAL_VIDEO_SLUG);
  if (idx === -1 || idx >= flat.length - 1) return null;
  return { moduleSlug: flat[idx + 1].module.slug, video: flat[idx + 1].video };
}