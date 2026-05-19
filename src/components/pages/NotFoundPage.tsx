import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";

export function NotFoundPage() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const homeHref = isEn ? "/en" : "/";
  const quotesHref = getCounterpart(
    isEn ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );

  const t = isEn
    ? {
        h1: "Oops, this page doesn't exist",
        sub: "The page you're looking for may have been moved or no longer exists.",
        home: "Back to home",
        quotes: "Get my quotes →",
      }
    : {
        h1: "Oops, cette page n'existe pas",
        sub: "La page que vous cherchez a peut-être été déplacée ou n'existe plus.",
        home: "Retour à l'accueil",
        quotes: "Obtenir mes soumissions →",
      };

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <div className="mx-auto max-w-md text-center">
        <svg
          viewBox="0 0 200 160"
          className="mx-auto h-40 w-40 text-foreground"
          aria-hidden="true"
        >
          <circle cx="100" cy="90" r="50" className="fill-muted" />
          <circle cx="84" cy="82" r="4" fill="currentColor" />
          <circle cx="116" cy="82" r="4" fill="currentColor" />
          <path
            d="M82 110 Q100 100 118 110"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <text x="150" y="55" fontSize="40" fontWeight="700" className="fill-secondary">
            ?
          </text>
          <text x="40" y="50" fontSize="28" fontWeight="700" className="fill-primary">
            ?
          </text>
        </svg>
        <p className="mt-6 text-sm font-semibold tracking-widest text-secondary">
          404
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          {t.h1}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{t.sub}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={homeHref}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-white px-5 text-sm font-semibold text-foreground hover:bg-muted"
          >
            {t.home}
          </Link>
          <Link
            to={quotesHref}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-secondary px-5 text-sm font-semibold text-white hover:bg-secondary-dark"
          >
            {t.quotes}
          </Link>
        </div>
      </div>
    </section>
  );
}