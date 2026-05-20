import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { RelatedLink } from "@/lib/page-relations";

type Props = {
  items: RelatedLink[];
  title?: string;
  subtitle?: string;
  className?: string;
};

/**
 * Bloc « Voir aussi » — maillage interne contextuel placé en bas de page.
 * Renforce le SEO (PageRank interne), aide les LLM (GEO/AEO) à découvrir
 * les pages connexes et offre une porte de sortie utile au visiteur.
 */
export function RelatedLinks({
  items,
  title = "Pages liées",
  subtitle = "Continuez votre exploration sur des sujets connexes.",
  className,
}: Props) {
  if (!items || items.length === 0) return null;
  return (
    <section
      aria-labelledby="related-links-title"
      className={className ?? "bg-[#F8FAFC] border-t border-border"}
    >
      <div className="container-app py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2
            id="related-links-title"
            className="font-heading font-bold text-primary text-2xl md:text-3xl"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className="group block h-full rounded-2xl border border-border bg-white p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-heading font-semibold text-primary group-hover:text-secondary transition-colors">
                    {item.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary shrink-0 mt-0.5" />
                </div>
                {item.description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
