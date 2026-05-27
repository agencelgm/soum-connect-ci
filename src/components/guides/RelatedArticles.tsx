import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/lib/guides-data";

/**
 * Section « Articles similaires » affichée en bas d'un article de guide.
 */
export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section aria-labelledby="related-articles-title" className="bg-white border-t border-border">
      <div className="container-app py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2
            id="related-articles-title"
            className="font-heading font-bold text-primary text-2xl md:text-3xl"
          >
            Articles similaires
          </h2>
          <p className="mt-2 text-muted-foreground">
            Continuez votre lecture avec d'autres guides en lien avec ce sujet.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <li key={a.slug} className="h-full">
              <Link
                to="/guides/$slug"
                params={{ slug: a.slug }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-lg transition-all"
              >
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-40 w-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center"
                  >
                    <span className="text-white/30 font-heading font-bold text-4xl">
                      {a.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {a.categories.slice(0, 2).map((c) => (
                      <Badge
                        key={c}
                        variant="secondary"
                        className="bg-secondary/10 text-secondary hover:bg-secondary/20"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="font-heading font-semibold text-primary group-hover:text-secondary transition-colors text-base leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {a.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {a.readTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-secondary">
                      Lire
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
