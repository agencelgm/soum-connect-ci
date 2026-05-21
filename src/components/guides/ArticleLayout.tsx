import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LeadFormCard } from "@/components/home/LeadFormCard";
import type { Article } from "@/lib/guides-data";

export function ArticleLayout({
  article,
  heroImage,
  children,
}: {
  article: Article;
  heroImage?: string;
  children: ReactNode;
}) {
  return (
    <main>
      {/* HERO vert avec formulaire à droite */}
      <section className="bg-primary text-white">
        <div className="container-app py-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-12 items-start">
            <div>
              <nav
                aria-label="Fil d'Ariane"
                className="text-xs md:text-sm text-white/70 mb-5"
              >
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link to="/" className="hover:text-white">
                      Accueil
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link to="/guides" className="hover:text-white">
                      Guides
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="text-white line-clamp-1">{article.title}</li>
                </ol>
              </nav>

              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories.map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="bg-white/15 text-white hover:bg-white/25 border-0"
                  >
                    {c}
                  </Badge>
                ))}
              </div>

              <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight max-w-2xl">
                {article.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl">
                {article.excerpt}
              </p>
              <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-white/75">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime} de lecture
              </p>
            </div>

            <div className="lg:sticky lg:top-24">
              <LeadFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Image hero */}
      {heroImage && (
        <div className="container-app -mt-6 md:-mt-10 relative z-10">
          <img
            src={heroImage}
            alt={article.title}
            width={1280}
            height={768}
            className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl object-cover aspect-[16/10]"
          />
        </div>
      )}

      {/* Corps article */}
      <section className="container-app py-12 md:py-16">
        <article className="max-w-3xl mx-auto">{children}</article>
      </section>
    </main>
  );
}
