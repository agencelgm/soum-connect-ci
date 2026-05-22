import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/lib/guides-data.tsx";

const BASE_URL = "https://www.soumissioncomptable.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", lastmod: today },
          // Page de conversion principale
          { path: "/demande-soumissions", changefreq: "monthly", priority: "0.9", lastmod: today },
          // Landing alternative — focus mot-clé "créer son entreprise"
          { path: "/creer-son-entreprise-cote-divoire", changefreq: "weekly", priority: "0.9", lastmod: today },
          // Pages services (priorité 0.8)
          { path: "/creation-entreprise-cote-divoire", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/comptabilite-entreprise-abidjan", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/declaration-fiscale-cote-divoire", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/domiciliation-entreprise-abidjan", changefreq: "monthly", priority: "0.8", lastmod: today },
          // Pages géographiques + diaspora + partenaires + FAQ (priorité 0.7)
          { path: "/cabinet-comptable-abidjan", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/creation-entreprise-diaspora-ivoirienne", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/cabinets-comptables-partenaires", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/faq", changefreq: "monthly", priority: "0.7", lastmod: today },
          // Blog + pages secondaires (priorité 0.6)
          { path: "/guides", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/comment-ca-marche", changefreq: "monthly", priority: "0.6", lastmod: today },
          // À propos
          { path: "/a-propos", changefreq: "monthly", priority: "0.5", lastmod: today },
          // Guides dynamiques
          ...ARTICLES.map((a) => ({
            path: `/guides/${a.slug}`,
            changefreq: "monthly" as const,
            priority: "0.5",
            lastmod: today,
          })),
          // English mirrors
          { path: "/en", changefreq: "weekly", priority: "0.8", lastmod: today },
          { path: "/en/get-quotes", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/en/about", changefreq: "monthly", priority: "0.5", lastmod: today },
          { path: "/en/company-registration-ivory-coast", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/en/accounting-firm-abidjan", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/en/start-a-business-ivory-coast", changefreq: "weekly", priority: "0.8", lastmod: today },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});