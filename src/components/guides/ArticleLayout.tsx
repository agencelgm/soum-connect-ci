import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { LeadFormCard } from "@/components/home/LeadFormCard";
import type { Article } from "@/lib/guides-data";
import { ReadingProgressBar } from "@/components/guides/ReadingProgressBar";

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
      <ReadingProgressBar />
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
        className="container-app pt-4 md:pt-6 pb-2 text-xs md:text-sm text-muted-foreground"
      >
        <div className="max-w-3xl mx-auto mb-3">
          <Link
            to="/guides"
            className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-2 rounded-md border border-border bg-white px-4 py-2.5 sm:py-1.5 text-sm font-medium text-primary hover:bg-accent transition-colors min-h-[44px] sm:min-h-0"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            Retour aux articles
          </Link>
        </div>
        <ol className="max-w-3xl mx-auto flex flex-wrap items-center justify-start gap-x-2 gap-y-1 min-w-0">
          <li className="shrink-0">
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true" className="shrink-0">/</li>
          <li className="shrink-0">
            <Link to="/guides" className="hover:text-primary">
              Blog
            </Link>
          </li>
          <li aria-hidden="true" className="shrink-0">/</li>
          <li className="text-foreground truncate min-w-0 basis-full sm:basis-auto sm:flex-1">
            {article.title}
          </li>
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
