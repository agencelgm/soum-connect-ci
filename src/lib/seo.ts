// Centralised SEO head builder for TanStack Router routes.
// Returns the {meta, links, scripts} object expected by createFileRoute(...).head().

export const SITE_URL = "https://soumissionscomptables.ci";
export const SITE_NAME = "SoumissionsComptables.ci";
export const DEFAULT_OG_IMAGE = "/og-image.png";

type MetaEntry = Record<string, string>;
type LinkEntry = Record<string, string>;
type ScriptEntry = { type?: string; children?: string; src?: string };

type Crumb = { name: string; path: string };
type Schema = Record<string, unknown>;
type Lang = "fr" | "en";

export const ORG_SCHEMA: Schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description:
    "Plateforme de mise en relation entre entrepreneurs et cabinets comptables agréés en Côte d'Ivoire",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["French", "English"],
  },
};

function websiteSchema(lang: Lang): Schema {
  return {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
    inLanguage: lang === "en" ? "en" : "fr-CI",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
  };
}

function absolute(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function breadcrumbSchema(crumbs: Crumb[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  };
}

type BuildPageHeadInput = {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  breadcrumb?: Crumb[];
  extraSchemas?: Schema[];
  includeWebSite?: boolean;
  lang?: Lang;
  /** Counterpart path in the other language; enables hreflang alternates. */
  altPath?: string;
};

export function buildPageHead({
  path,
  title,
  description,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  breadcrumb,
  extraSchemas = [],
  includeWebSite = false,
  lang = "fr",
  altPath,
}: BuildPageHeadInput): {
  meta: MetaEntry[];
  links: LinkEntry[];
  scripts: ScriptEntry[];
} {
  const url = absolute(path);
  const image = absolute(ogImage);
  const ogLocale = lang === "en" ? "en_US" : "fr_CI";

  const meta: MetaEntry[] = [
    { title },
    { name: "description", content: description },

    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:locale", content: ogLocale },
    { property: "og:site_name", content: SITE_NAME },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  const frUrl = lang === "fr" ? url : altPath ? absolute(altPath) : url;
  const enUrl = lang === "en" ? url : altPath ? absolute(altPath) : "";
  const links: LinkEntry[] = [{ rel: "canonical", href: url }];
  links.push({ rel: "alternate", hreflang: "fr-CI", href: frUrl });
  if (enUrl) links.push({ rel: "alternate", hreflang: "en", href: enUrl });
  links.push({ rel: "alternate", hreflang: "x-default", href: frUrl });

  const schemas: Schema[] = [ORG_SCHEMA];
  if (includeWebSite) schemas.push(websiteSchema(lang));
  if (breadcrumb && breadcrumb.length > 0)
    schemas.push(breadcrumbSchema(breadcrumb));
  schemas.push(...extraSchemas);

  const scripts: ScriptEntry[] = schemas.map((s) => ({
    type: "application/ld+json",
    children: JSON.stringify(s),
  }));

  return { meta, links, scripts };
}

// Convenience helpers for the most common JSON-LD payloads.
export function faqSchema(items: { question: string; answer: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export type HowToStepInput = string | { name: string; text?: string };
export type HowToOptions = {
  description?: string;
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    minValue: string | number;
    maxValue?: string | number;
  };
};

export function howToSchema(
  name: string,
  steps: HowToStepInput[],
  options: HowToOptions = {},
): Schema {
  const schema: Schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((s, i) => {
      const base = typeof s === "string" ? { name: s } : s;
      const step: Record<string, unknown> = {
        "@type": "HowToStep",
        position: i + 1,
        name: base.name,
      };
      if (typeof s !== "string" && s.text) step.text = s.text;
      return step;
    }),
  };
  if (options.description) schema.description = options.description;
  if (options.totalTime) schema.totalTime = options.totalTime;
  if (options.estimatedCost) {
    const cost: Record<string, unknown> = {
      "@type": "MonetaryAmount",
      currency: options.estimatedCost.currency,
      minValue: String(options.estimatedCost.minValue),
    };
    if (options.estimatedCost.maxValue !== undefined) {
      cost.maxValue = String(options.estimatedCost.maxValue);
    }
    schema.estimatedCost = cost;
  }
  return schema;
}