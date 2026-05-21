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
        <div className="container-app py-10 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-12 items-start">
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-5xl leading-tight max-w-2xl">
                {article.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-white/85 max-w-2xl">
                {article.excerpt}
              </p>
            </div>

            <div className="lg:sticky lg:top-24">
              <LeadFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Fil d'Ariane sur fond blanc */}
      <nav
        aria-label="Fil d'Ariane"
        className="container-app pt-6 text-xs md:text-sm text-muted-foreground"
      >
        <ol className="flex flex-wrap items-center justify-center gap-2">
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
        <div className="container-app pt-8 md:pt-10">
          <img
            src={heroImage}
            alt={article.title}
            width={1280}
            height={768}
            className="w-full max-w-3xl mx-auto rounded-xl object-cover aspect-[16/10]"
          />
        </div>
      )}

      {/* Corps article */}
      <section className="container-app py-10 md:py-14">
        <article className="max-w-2xl mx-auto">{children}</article>
      </section>
    </main>
  );
}
