import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildPageHead } from "@/lib/seo";
import { getArticleBySlug } from "@/lib/guides-data";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) {
      return buildPageHead({
        path: `/guides/${params.slug}`,
        title: "Guide introuvable | SoumissionsComptables.ci",
        description: "Ce guide n'existe pas ou plus.",
        breadcrumb: [
          { name: "Accueil", path: "/" },
          { name: "Guides", path: "/guides" },
        ],
      });
    }
    const head = buildPageHead({
      path: `/guides/${article.slug}`,
      title: `${article.title} | SoumissionsComptables.ci`,
      description: article.excerpt,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Guides", path: "/guides" },
        { name: article.title, path: `/guides/${article.slug}` },
      ],
    });
    // Article placeholder — pas encore de contenu rédigé : on évite l'indexation.
    return {
      ...head,
      meta: [
        ...head.meta,
        { name: "robots", content: "noindex,nofollow" },
      ],
    };
  },
  component: GuideSlugPage,
});

function GuideSlugPage() {
  const { slug } = Route.useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <main>
      <section className="bg-[#F8FAFC] border-b border-border">
        <div className="container-app py-10 md:py-14">
          <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground mb-4">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary">Accueil</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/guides" className="hover:text-primary">Guides</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground line-clamp-1">{article.title}</li>
            </ol>
          </nav>

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

          <h1 className="font-heading font-bold text-primary text-3xl md:text-5xl max-w-3xl leading-tight">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {article.excerpt}
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime} de lecture (estimé)
          </p>
        </div>
      </section>

      <section className="container-app py-12 md:py-16">
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-white p-8 md:p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <PencilLine className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-heading font-bold text-primary text-2xl">
            Article en cours de rédaction
          </h2>
          <p className="mt-2 text-muted-foreground">
            Ce guide arrive très bientôt. En attendant, vous pouvez obtenir des
            soumissions gratuites de cabinets comptables agréés ou parcourir
            nos autres guides.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/demande-soumissions"
              className="inline-flex items-center justify-center rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 transition-colors"
            >
              Obtenir mes soumissions
            </Link>
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 justify-center rounded-md border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voir tous les guides
            </Link>
          </div>
        </div>
      </section>
      {(() => {
        const rel = getPageRelations("/guides");
        return rel ? <RelatedLinks items={rel.related} title="Pages liées" subtitle="Explorez nos services et autres ressources." /> : null;
      })()}
    </main>
  );
}