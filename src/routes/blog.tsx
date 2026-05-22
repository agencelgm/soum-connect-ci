import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buildPageHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";
import { ARTICLES_SORTED } from "@/lib/guides-data";

const META_TITLE =
  "Blog | Entrepreneuriat, comptabilité et fiscalité en Côte d'Ivoire";
const META_DESC =
  "Le blog SoumissionsComptables.ci : actualités, analyses et conseils pratiques pour les entrepreneurs et dirigeants en Côte d'Ivoire.";

export const Route = createFileRoute("/blog")({
  head: () =>
    buildPageHead({
      path: "/blog",
      title: META_TITLE,
      description: META_DESC,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Blog", path: "/blog" },
      ],
    }),
  component: BlogPage,
});

function BlogPage() {
  const rel = getPageRelations("/blog");
  const posts = ARTICLES_SORTED;
  return (
    <main>
      {rel && <Breadcrumbs items={rel.breadcrumb} />}
      {/* Hero */}
      <section className="bg-[#F8FAFC] border-b border-border">
        <div className="container-app py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold mb-4">
            <BookOpen className="h-3.5 w-3.5" />
            Blog
          </div>
          <h1 className="font-heading font-bold text-primary text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            Actualités & analyses pour les entrepreneurs ivoiriens
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Conseils, retours d'expérience et décryptages sur la création
            d'entreprise, la comptabilité, la fiscalité et la vie des affaires
            en Côte d'Ivoire.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="container-app py-14 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/guides/$slug"
              params={{ slug: post.slug }}
              className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-32 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center" aria-hidden="true">
                  <span className="text-white/30 font-heading font-bold text-5xl">
                    {post.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.map((c) => (
                    <Badge key={c} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                      {c}
                    </Badge>
                  ))}
                </div>
                <h3 className="font-heading font-bold text-primary group-hover:text-secondary transition-colors text-lg">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-border">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime} de lecture
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary group-hover:text-secondary-dark">
                    Lire la suite
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {rel && <RelatedLinks items={rel.related} />}
    </main>
  );
}