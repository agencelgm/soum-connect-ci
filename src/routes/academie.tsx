import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { ACADEMIE_MODULES } from "@/lib/academie-data";
import { getMyAcademieProgress } from "@/lib/academie.functions";
import { CheckCircle2, PlayCircle, GraduationCap, Clock } from "lucide-react";

const CANONICAL = "https://www.soumissioncomptable.com/academie";

export const Route = createFileRoute("/academie")({
  head: () => ({
    meta: [
      { title: "Académie LGM — Formations vente pour cabinets comptables" },
      {
        name: "description",
        content:
          "Formations vidéo gratuites pour les cabinets comptables partenaires : vente, prospection, gestion des leads. Signé LGM (Les Gens du Marketing).",
      },
      { property: "og:title", content: "Académie LGM — Formations vente pour cabinets comptables" },
      {
        property: "og:description",
        content:
          "Formations vidéo pour aider les cabinets comptables à mieux vendre leurs services.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
    ],
    links: [{ rel: "canonical", href: CANONICAL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.soumissioncomptable.com/" },
            { "@type": "ListItem", position: 2, name: "Académie LGM", item: CANONICAL },
          ],
        }),
      },
    ],
  }),
  component: AcademieIndex,
});

function AcademieIndex() {
  const { user } = useAuth();
  const progressFn = useServerFn(getMyAcademieProgress);
  const { data: progress } = useQuery({
    queryKey: ["academie-progress"],
    queryFn: () => progressFn(),
    enabled: !!user,
    retry: false,
  });

  const progressMap = new Map((progress ?? []).map((p) => [p.slug, p]));

  return (
    <div className="bg-muted/20 min-h-screen">
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
          <div className="max-w-5xl mx-auto px-6 py-14 lg:py-20">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
              <GraduationCap className="h-3.5 w-3.5" /> Académie LGM
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Vendez plus, vendez mieux.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Des formations vidéo courtes pour les cabinets comptables partenaires de
              SoumissionComptable.com. Marketing, vente, prospection — les outils que nous
              utilisons chez LGM (Les Gens du Marketing) pour transformer un prospect en client.
            </p>
            {!user && (
              <p className="mt-4 text-sm text-muted-foreground">
                💡{" "}
                <Link to="/connexion" className="text-primary hover:underline font-medium">
                  Connectez-vous
                </Link>{" "}
                pour enregistrer votre progression.
              </p>
            )}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-12 space-y-12">
          {ACADEMIE_MODULES.sort((a, b) => a.order - b.order).map((mod) => (
            <div key={mod.slug}>
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Module {mod.order}
                </p>
                <h2 className="mt-1 text-2xl font-bold">{mod.title}</h2>
                <p className="mt-1 text-muted-foreground">{mod.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {mod.videos
                  .sort((a, b) => a.order - b.order)
                  .map((v) => {
                    const p = progressMap.get(v.slug);
                    const completed = !!p?.completed_at;
                    const ratio = Math.round((p?.max_progress ?? 0) * 100);
                    return (
                      <Link
                        key={v.slug}
                        to="/academie/$module/$slug"
                        params={{ module: mod.slug, slug: v.slug }}
                        className="group rounded-xl border bg-card p-5 hover:shadow-md hover:border-primary/40 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                            {completed ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <PlayCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {v.duration}
                          </div>
                        </div>
                        <h3 className="mt-3 font-semibold leading-tight">
                          {v.order}. {v.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3">
                          {v.description}
                        </p>
                        {user && (
                          <div className="mt-3">
                            {completed ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Vidéo terminée
                              </span>
                            ) : ratio > 0 ? (
                              <div>
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${ratio}%` }}
                                  />
                                </div>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {ratio}% visionné
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Non commencée
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </section>
    </div>
  );
}