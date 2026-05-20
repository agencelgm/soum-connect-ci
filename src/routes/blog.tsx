import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Sparkles } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

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

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
};

const POSTS: BlogPost[] = [];

function BlogPage() {
  const rel = getPageRelations("/blog");
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

      {/* Articles / état vide */}
      <section className="container-app py-14 md:py-20">
        {POSTS.length === 0 ? (
          <div className="max-w-2xl mx-auto rounded-2xl border border-dashed border-border bg-white p-10 md:p-14 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-secondary/10 text-secondary mb-5">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
              Les premiers articles arrivent bientôt
            </h2>
            <p className="mt-3 text-muted-foreground">
              Nous préparons une série d'articles approfondis pour aider les
              entrepreneurs et dirigeants en Côte d'Ivoire à mieux piloter leur
              activité. En attendant, retrouvez nos guides pratiques.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/guides"
                className="inline-flex items-center justify-center rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Voir nos guides
              </a>
              <a
                href="/demande-soumissions"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:border-primary/40 transition-colors"
              >
                Obtenir mes soumissions
              </a>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((post) => (
              <article
                key={post.slug}
                className="rounded-2xl border border-border bg-white p-6 hover:border-primary/40 hover:shadow-lg transition-all"
              >
                <span className="text-xs font-semibold text-secondary uppercase tracking-wide">
                  {post.category}
                </span>
                <h3 className="mt-2 font-heading font-bold text-primary text-lg">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  {post.date} · {post.readTime} de lecture
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {rel && <RelatedLinks items={rel.related} />}
    </main>
  );
}