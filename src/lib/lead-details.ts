const CONTACT_DETAIL_KEYS = new Set([
  "email",
  "full_name",
  "mobile",
  "nom",
  "phone",
  "telephone",
  "téléphone",
]);

const DETAIL_LABELS: Record<string, string> = {
  bureau: "Bureau",
  company_name: "Entreprise",
  date_probleme: "Date du problème",
  delai: "Délai",
  form_type: "Type de demande",
  language: "Langue",
  logo: "Logo",
  nb_associes: "Associés",
  page_url: "Page source",
  publicite: "Publicité",
  site_web: "Site web",
  source: "Source",
  statut: "Statut",
  sujet: "Sujet",
};

export type LeadDetail = {
  key: string;
  label: string;
  value: string;
};

export function isContactDetailKey(key: string) {
  return CONTACT_DETAIL_KEYS.has(key.trim().toLowerCase());
}

export function sanitizeLeadDetails(details: unknown): LeadDetail[] {
  if (!details || typeof details !== "object" || Array.isArray(details)) return [];

  return Object.entries(details as Record<string, unknown>)
    .filter(([key, value]) => !isContactDetailKey(key) && value != null && value !== "")
    .map(([key, value]) => ({
      key,
      label: DETAIL_LABELS[key] ?? humanizeKey(key),
      value: stringifyDetailValue(value),
    }))
    .filter((detail) => detail.value.length > 0);
}

function stringifyDetailValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(stringifyDetailValue).filter(Boolean).join(", ");
  return "";
}

function humanizeKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
