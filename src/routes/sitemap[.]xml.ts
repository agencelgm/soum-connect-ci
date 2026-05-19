import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://soumissionscomptables.ci";

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
          // Service pages
          { path: "/creation-entreprise-cote-divoire", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/cabinet-comptable-abidjan", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/comptabilite-entreprise-abidjan", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/declaration-fiscale-cote-divoire", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/domiciliation-entreprise-abidjan", changefreq: "monthly", priority: "0.8", lastmod: today },
          { path: "/creation-entreprise-diaspora-ivoirienne", changefreq: "monthly", priority: "0.7", lastmod: today },
          // Conversion + info pages
          { path: "/demande-soumissions", changefreq: "monthly", priority: "0.9", lastmod: today },
          { path: "/comment-ca-marche", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/cabinets-comptables-partenaires", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/a-propos", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/faq", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/guides", changefreq: "monthly", priority: "0.6", lastmod: today },
          // English mirrors
          { path: "/en", changefreq: "weekly", priority: "0.8", lastmod: today },
          { path: "/en/get-quotes", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/en/about", changefreq: "monthly", priority: "0.5", lastmod: today },
          { path: "/en/company-registration-ivory-coast", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/en/accounting-firm-abidjan", changefreq: "monthly", priority: "0.6", lastmod: today },
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