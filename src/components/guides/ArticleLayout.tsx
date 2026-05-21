import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
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
      {/* HERO vert : titre à gauche + formulaire à droite */}
      <section className="bg-primary text-white">
        <div className="container-app py-12 md:py-20 lg:py-24">
          <div className="grid gap-8 lg:gap-16 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] items-start">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-tight max-w-2xl">
                {article.title}
              </h1>
              <p className="mt-5 text-base md:text-lg lg:text-xl leading-relaxed text-white/85 max-w-2xl">
                {article.excerpt}
              </p>
            </div>

            <div>
              <LeadFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Fil d'Ariane sur fond blanc */}
      <nav
        aria-label="Fil d'Ariane"
        className="container-app pt-5 md:pt-6 pb-2 text-xs md:text-sm text-muted-foreground"
      >
        <ol className="max-w-3xl mx-auto flex flex-wrap items-center justify-start gap-2">
          <li>
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/guides" className="hover:text-primary">
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground line-clamp-1">{article.title}</li>
        </ol>
      </nav>

      {/* Image hero centrée */}
      {heroImage && (
        <div className="container-app pt-6 md:pt-8">
          <img
            src={heroImage}
            alt={article.title}
            width={1280}
            height={768}
            className="w-full max-w-3xl mx-auto rounded-lg md:rounded-xl object-cover aspect-[16/9] md:aspect-[16/10]"
          />
        </div>
      )}

      {/* Corps article */}
      <section className="container-app py-8 md:py-12 lg:py-16">
        <article className="max-w-2xl lg:max-w-3xl mx-auto">{children}</article>
      </section>
    </main>
  );
}
