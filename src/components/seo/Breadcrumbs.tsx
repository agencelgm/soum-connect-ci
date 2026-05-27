import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/page-relations";

type Props = {
  items: Crumb[];
  className?: string;
};

/**
 * Fil d'Ariane visible — complète le BreadcrumbList JSON-LD pour le SEO
 * et offre une navigation contextuelle aux utilisateurs et aux LLM.
 */
export function Breadcrumbs({ items, className }: Props) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Fil d'Ariane" className={className ?? "container-app pt-6"}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.to && !last ? (
                <Link to={c.to} className="hover:text-primary transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? "text-foreground font-medium" : ""}>{c.label}</span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
