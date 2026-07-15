import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { AcademieVideoPlayer } from "@/components/academie/AcademieVideoPlayer";
import { ShareButtons } from "@/components/academie/ShareButtons";
import { useAuth } from "@/lib/auth-context";
import {
  findVideo,
  TUTORIAL_VIDEO_SLUG,
  type AcademieModule,
  type AcademieVideo,
  type AcademieVideoLocation,
} from "@/lib/academie-data";
import {
  getMyAcademieProgress,
  markMyAcademieProgress,
} from "@/lib/academie.functions";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  PlayCircle,
} from "lucide-react";

const BASE = "https://www.soumissioncomptable.com";

export const Route = createFileRoute("/academie/$module/$slug")({
  loader: ({ params }): AcademieVideoLocation => {
    const loc = findVideo(params.module, params.slug);
    if (!loc) throw notFound();
    return loc;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Vidéo introuvable — Académie LGM" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { module: mod, video } = loaderData;
    const url = `${BASE}/academie/${params.module}/${params.slug}`;
    const title = `${video.title} — Académie LGM`;
    return {
      meta: [
        { title },
        { name: "description", content: video.description },
        { property: "og:title", content: title },
        { property: "og:description", content: video.description },
        { property: "og:type", content: "video.other" },
        { property: "og:url", content: url },
        { property: "og:video", content: `${BASE}${video.videoUrl}` },
        { property: "og:video:type", content: "video/mp4" },
        { name: "twitter:card", content: "player" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            uploadDate: "2026-07-15",
            contentUrl: `${BASE}${video.videoUrl}`,
            embedUrl: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${BASE}/` },
              { "@type": "ListItem", position: 2, name: "Académie LGM", item: `${BASE}/academie` },
              { "@type": "ListItem", position: 3, name: mod.title },
              { "@type": "ListItem", position: 4, name: video.title },
            ],
          }),
        },
      ],
    };
  },
  component: AcademieVideoPage,
  notFoundComponent: NotFoundVideo,
  errorComponent: ErrorVideo,
});

function NotFoundVideo() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Vidéo introuvable</h1>
        <p className="mt-2 text-muted-foreground">
          Cette vidéo n'existe pas (ou plus) dans l'Académie LGM.
        </p>
        <Button asChild className="mt-6">
          <Link to="/academie">Retour à l'Académie</Link>
        </Button>
    </div>
  );
}

function ErrorVideo() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
        <p className="mt-2 text-muted-foreground">Merci de réessayer dans un instant.</p>
        <Button asChild className="mt-6">
          <Link to="/academie">Retour à l'Académie</Link>
        </Button>
    </div>
  );
}

function AcademieVideoPage() {
  const loaded = Route.useLoaderData() as AcademieVideoLocation;
  const mod: AcademieModule = loaded.module;
  const video: AcademieVideo = loaded.video;
  const { prev, next } = loaded;
  const params = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const progressFn = useServerFn(getMyAcademieProgress);
  const markFn = useServerFn(markMyAcademieProgress);

  const { data: progress } = useQuery({
    queryKey: ["academie-progress"],
    queryFn: () => progressFn(),
    enabled: !!user,
    retry: false,
  });

  const entry = (progress ?? []).find((p) => p.slug === video.slug);
  const initialMax = entry?.max_progress ?? 0;
  const initiallyCompleted = !!entry?.completed_at;
  async function send(ratio: number, completed: boolean) {
    if (!user) return;
    try {
      await markFn({ data: { video_slug: video.slug, progress: ratio, completed } });
      qc.invalidateQueries({ queryKey: ["academie-progress"] });
      if (video.slug === TUTORIAL_VIDEO_SLUG) {
        qc.invalidateQueries({ queryKey: ["my-partner"] });
      }
    } catch {
      // silencieux — on ré-essaiera au prochain tick
    }
  }

  const shareUrl = `${BASE}/academie/${params.module}/${params.slug}`;

  return (
    <div className="bg-muted/20 min-h-screen">
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link to="/academie" className="hover:text-primary">
                  Académie LGM
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li>{mod.title}</li>
              <li>
                <ChevronRight className="h-3.5 w-3.5" />
              </li>
              <li className="text-foreground font-medium">{video.title}</li>
            </ol>
          </nav>
        </div>

        <section className="max-w-5xl mx-auto px-6 py-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
            <GraduationCap className="h-3.5 w-3.5" />
            {mod.title} · Vidéo {video.order}
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {video.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {video.duration}
            </span>
            {initiallyCompleted && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Vidéo terminée
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-xl border bg-card p-3">
                <AcademieVideoPlayer
                  src={video.videoUrl}
                  initialMaxProgress={initialMax}
                  initiallyCompleted={initiallyCompleted}
                  preventSkipAhead={video.slug === TUTORIAL_VIDEO_SLUG}
                  onProgress={(r) => send(r, false)}
                  onCompleted={() => send(1, true)}
                />
              </div>

              <div className="rounded-xl border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  En bref
                </p>
                <p className="mt-2 text-foreground/90 leading-relaxed">{video.brief}</p>
              </div>

              {video.keyPoints.length > 0 && (
                <div className="rounded-xl border bg-card p-5">
                  <h2 className="font-semibold">Ce que vous allez apprendre</h2>
                  <ul className="mt-3 space-y-2 text-sm">
                    {video.keyPoints.map((k) => (
                      <li key={k as string} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                {prev ? (
                  <Button asChild variant="outline">
                    <Link
                      to="/academie/$module/$slug"
                      params={{ module: prev.moduleSlug, slug: prev.video.slug }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Vidéo précédente
                    </Link>
                  </Button>
                ) : (
                  <span />
                )}
                {next ? (
                  <Button asChild>
                    <Link
                      to="/academie/$module/$slug"
                      params={{ module: next.moduleSlug, slug: next.video.slug }}
                    >
                      Vidéo suivante : {next.video.title}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <Link to="/academie">Retour à l'Académie</Link>
                  </Button>
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-xl border bg-card p-5">
                <p className="font-semibold">Partager cette vidéo</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Envoyez-la à un collègue par WhatsApp ou email.
                </p>
                <div className="mt-3">
                  <ShareButtons url={shareUrl} title={video.title} />
                </div>
              </div>

              {!user && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
                  <p className="font-semibold text-primary">Suivez votre progression</p>
                  <p className="mt-1 text-sm text-foreground/80">
                    Connectez-vous à votre espace partenaire pour enregistrer les vidéos
                    déjà vues.
                  </p>
                  <Button asChild className="w-full mt-3">
                    <Link to="/connexion">Se connecter</Link>
                  </Button>
                </div>
              )}

              <div className="rounded-xl border bg-card p-5">
                <p className="font-semibold flex items-center gap-2">
                  <PlayCircle className="h-4 w-4 text-primary" />
                  Toutes les vidéos du module
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {mod.videos
                    .slice()
                    .sort((a: AcademieVideo, b: AcademieVideo) => a.order - b.order)
                    .map((v: AcademieVideo) => {
                      const active = v.slug === video.slug;
                      return (
                        <li key={v.slug}>
                          <Link
                            to="/academie/$module/$slug"
                            params={{ module: mod.slug, slug: v.slug }}
                            className={
                              active
                                ? "font-semibold text-primary"
                                : "text-foreground hover:text-primary"
                            }
                          >
                            {v.order}. {v.title}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </aside>
          </div>
        </section>
    </div>
  );
}