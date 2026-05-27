import type { ReactNode } from "react";
import { Info, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ArticleSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 id={id} className="font-heading font-bold text-primary text-2xl md:text-3xl scroll-mt-24">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-foreground/90 leading-relaxed">{children}</div>
    </section>
  );
}

export function ArticleTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  caption?: string;
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        {caption && (
          <caption className="caption-top px-4 py-2 text-left text-xs text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead className="bg-primary text-white">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border even:bg-[#F8FAFC]">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type CalloutVariant = "info" | "warning" | "tip";

const calloutStyles: Record<CalloutVariant, { wrap: string; icon: ReactNode; label: string }> = {
  info: {
    wrap: "border-primary/30 bg-primary/5 text-primary",
    icon: <Info className="h-5 w-5 shrink-0" />,
    label: "Bon à savoir",
  },
  warning: {
    wrap: "border-amber-400/40 bg-amber-50 text-amber-900",
    icon: <AlertTriangle className="h-5 w-5 shrink-0" />,
    label: "À éviter",
  },
  tip: {
    wrap: "border-secondary/40 bg-secondary/10 text-secondary",
    icon: <Lightbulb className="h-5 w-5 shrink-0" />,
    label: "Astuce",
  },
};

export function ArticleCallout({
  variant = "info",
  title,
  children,
}: {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}) {
  const s = calloutStyles[variant];
  return (
    <aside className={`my-6 flex gap-3 rounded-xl border-l-4 ${s.wrap} p-4 md:p-5`}>
      <div className="pt-0.5">{s.icon}</div>
      <div className="text-sm md:text-base">
        <p className="font-semibold">{title ?? s.label}</p>
        <div className="mt-1 text-foreground/90">{children}</div>
      </div>
    </aside>
  );
}

export function ArticleList({ items, ordered = false }: { items: ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`my-4 space-y-2 pl-6 ${
        ordered ? "list-decimal" : "list-disc"
      } marker:text-secondary`}
    >
      {items.map((it, i) => (
        <li key={i} className="leading-relaxed">
          {it}
        </li>
      ))}
    </Tag>
  );
}

export function ArticleCTA({
  title = "Prêt à passer à l'action ?",
  description = "Obtenez gratuitement jusqu'à 3 soumissions de cabinets comptables agréés en Côte d'Ivoire.",
  ctaLabel = "Obtenir mes soumissions",
}: {
  title?: string;
  description?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="my-10 rounded-2xl bg-primary text-white p-6 md:p-8">
      <h3 className="font-heading font-bold text-xl md:text-2xl">{title}</h3>
      <p className="mt-2 text-white/85">{description}</p>
      <Link
        to="/demande-soumissions"
        className="mt-5 inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 transition-colors"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
