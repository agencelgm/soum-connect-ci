// Bidirectional FR ↔ EN route mapping.
// Only the mirrored priority pages are listed here. Pages without a
// counterpart fall back to "/" when the user switches language.

import type { Language } from "./language-context";

export const ROUTE_PAIRS: Array<{ fr: string; en: string }> = [
  { fr: "/", en: "/en" },
  {
    fr: "/creation-entreprise-cote-divoire",
    en: "/en/company-registration-ivory-coast",
  },
  {
    fr: "/creer-son-entreprise-cote-divoire",
    en: "/en/start-a-business-ivory-coast",
  },
  { fr: "/cabinet-comptable-abidjan", en: "/en/accounting-firm-abidjan" },
  { fr: "/demande-soumissions", en: "/en/get-quotes" },
  { fr: "/a-propos", en: "/en/about" },
  { fr: "/merci", en: "/en/thank-you" },
  { fr: "/offre-logo", en: "/en/logo-offer" },
  { fr: "/offre-site-internet", en: "/en/website-offer" },
  { fr: "/nous-contacter", en: "/en/contact-us" },
];

export function getLangFromPath(pathname: string): Language {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "fr";
}

/** Return the counterpart path for `pathname` in `targetLang`, or fallback. */
export function getCounterpart(pathname: string, targetLang: Language): string {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const pair = ROUTE_PAIRS.find((p) => p.fr === normalized || p.en === normalized);
  if (pair) return targetLang === "en" ? pair.en : pair.fr;
  // No mirror — drop user back to the language home.
  return targetLang === "en" ? "/en" : "/";
}

/** Return the {fr, en} pair for an arbitrary pathname (for hreflang). */
export function getPairForPath(pathname: string): { fr: string; en: string } | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return ROUTE_PAIRS.find((p) => p.fr === normalized || p.en === normalized) ?? null;
}
