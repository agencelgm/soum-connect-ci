import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildPageHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";
import { ARTICLES_SORTED, FILTERS, type Article, type Category } from "@/lib/guides-data";

const META_TITLE = "Guides & Ressources | Création d'Entreprise & Comptabilité en CI";
const META_DESC =
  "Tous nos guides sur la création d'entreprise, la comptabilité et la fiscalité en Côte d'Ivoire. Des ressources gratuites pour les entrepreneurs ivoiriens.";

export const Route = createFileRoute("/guides")({
  head: () =>
    buildPageHead({
      path: "/guides",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Guides", path: "/guides" },
      ],
    }),
  component: Page,
});

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  return (
    <Link
      to="/guides/$slug"
      params={{ slug: article.slug }}
      aria-label={article.title}
      className={`group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer ${
        featured ? "md:flex-row" : ""
      }`}
    >
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className={`object-cover ${featured ? "md:w-2/5 w-full h-56 md:h-auto" : "h-44 w-full"}`}
        />
      ) : (
        <div
          className={`bg-gradient-to-br from-primary to-primary-dark ${
            featured ? "md:w-2/5 min-h-[200px]" : "h-32"
          } flex items-center justify-center`}
          aria-hidden="true"
        >
          <span className="text-white/30 font-heading font-bold text-5xl">
            {article.title.charAt(0)}
          </span>
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.categories.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="bg-secondary/10 text-secondary hover:bg-secondary/20"
            >
              {c}
            </Badge>
          ))}
        </div>
        <h3
          className={`font-heading font-bold text-primary group-hover:text-secondary transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-lg"
          }`}
        >
          {article.title}
        </h3>
        <p
          className={`mt-2 text-muted-foreground leading-relaxed ${featured ? "text-base" : "text-sm"}`}
        >
          {article.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} de lecture
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:text-secondary-dark">
            Lire la suite
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Page() {
  const [filter, setFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const rel = getPageRelations("/guides");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Si on est sur /guides/<slug>, on rend la page article enfant.
  if (pathname !== "/guides" && pathname !== "/guides/") {
    return <Outlet />;
  }

  const filtered =
    filter === "all"
      ? ARTICLES_SORTED
      : ARTICLES_SORTED.filter((a) => a.categories.includes(filter as Category));

  const [featured, ...rest] = filtered;

  // Derniers guides rédigés, classés par publishedAt desc (fallback : priorité).
  // Inclut uniquement les articles avec contenu publié.
  const latest = [...ARTICLES_SORTED]
    .filter((a) => !!a.content)
    .sort((a, b) => {
      const da = a.publishedAt ?? "";
      const db = b.publishedAt ?? "";
      if (da === db) return a.priority - b.priority;
      return db.localeCompare(da);
    });
  const visibleLatest = latest.slice(0, visibleCount);
  const hasMore = visibleCount < latest.length;

  return (
    <main>
      {rel && <Breadcrumbs items={rel.breadcrumb} />}
      {/* Hero */}
      <section className="bg-primary">
        <div className="container-app py-14 md:py-20 text-center">
          <h1 className="font-heading font-bold text-white text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Guides & Ressources pour Entrepreneurs en Côte d'Ivoire
          </h1>
          <p className="mt-4 text-lg text-white/85 max-w-2xl mx-auto">
            Tous nos guides pratiques sur la création d'entreprise, la comptabilité et la fiscalité
            en CI.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container-app pt-10">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex flex-wrap h-auto justify-start gap-2 bg-transparent p-0">
            {FILTERS.map((f) => (
              <TabsTrigger
                key={f.key}
                value={f.key}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary"
              >
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </section>

      {/* Articles */}
      <section className="container-app py-10 md:py-14">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">
            Aucun article dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="space-y-8">
            {featured && <ArticleCard article={featured} featured />}
            {rest.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {rest.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Derniers guides — chargement progressif */}
      {latest.length > 0 && (
        <section
          aria-labelledby="latest-guides-title"
          className="bg-background-alt border-t border-border"
        >
          <div className="container-app py-12 md:py-16">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                Nouveautés
              </div>
              <h2
                id="latest-guides-title"
                className="font-heading font-bold text-primary text-2xl md:text-3xl"
              >
                Derniers guides publiés
              </h2>
              <p className="mt-2 text-muted-foreground">
                Les articles les plus récents pour rester à jour sur la création d'entreprise, la
                comptabilité et la fiscalité en CI.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleLatest.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Charger plus de guides
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {rel && <RelatedLinks items={rel.related} />}
    </main>
  );
}
