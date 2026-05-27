import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Category } from "@/lib/guides-data";
import { getServiceLinksForCategories } from "@/lib/category-services-map";

/**
 * Module de maillage interne contextuel placé en bas d'un guide.
 * Affiche les services SoumissionComptable.com les plus pertinents
 * en fonction des catégories de l'article courant.
 */
export function CategoryServiceLinks({ categories }: { categories: Category[] }) {
  const items = getServiceLinksForCategories(categories, 4);
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="category-services-title"
      className="bg-primary/5 border-t border-border"
    >
      <div className="container-app py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-3 py-1 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Services associés
          </div>
          <h2
            id="category-services-title"
            className="font-heading font-bold text-primary text-2xl md:text-3xl"
          >
            Services recommandés pour ce sujet
          </h2>
          <p className="mt-2 text-muted-foreground">
            Passez de la lecture à l'action avec les prestations directement liées à ce guide.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 gap-4">
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
