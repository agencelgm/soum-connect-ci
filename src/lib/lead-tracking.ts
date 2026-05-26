// Helpers de tra\u00e7abilit\u00e9 pour les soumissions de formulaire.
// Toutes les valeurs sont s\u00fbres c\u00f4t\u00e9 SSR (retournent "" si window absent).

export function getPageUrl(): string {
  if (typeof window === "undefined") return "";
  return window.location.pathname + window.location.search;
}

export function getReferrer(): string {
  if (typeof document === "undefined") return "";
  return document.referrer || "";
}

export function getSubmittedAt(): string {
  return new Date().toISOString();
}

/** Champs communs ajout\u00e9s \u00e0 chaque soumission. */
export function getTrackingFields() {
  return {
    page_url: getPageUrl(),
    referrer: getReferrer(),
    submitted_at: getSubmittedAt(),
  };
}