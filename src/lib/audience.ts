/**
 * Détermine l'audience marketing d'un lead pour router vers la bonne séquence GHL.
 *
 * - "creation" : prospect qui veut CRÉER son entreprise
 * - "gestion"  : prospect qui a DÉJÀ une entreprise (compta, déclarations, audit…)
 * - "unknown"  : non déterminable → qualification manuelle côté GHL
 *
 * Priorité décroissante :
 *   1. audience_hint (métadonnée déclarée sur la page d'origine, ex. guide)
 *   2. statut explicite déclaré par l'utilisateur dans le formulaire
 *   3. source (préfixes connus des pages/guides non-taggés)
 *   4. service choisi
 *   5. fallback "unknown"
 */

export type Audience = "creation" | "gestion" | "unknown";
export type AudienceHint = "creation" | "gestion" | "both";

export interface InferAudienceInput {
  audience_hint?: AudienceHint | null;
  statut?: string | null;
  source?: string | null;
  service?: string | null;
}

const norm = (s: string | null | undefined): string =>
  (s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Préfixes de `source` connus pour les pages non-guide. */
const SOURCE_CREATION_PREFIXES = [
  "page-creer-son-entreprise",
  "guide-creer-",
  "guide-sarl-sa-ei",
  "guide-cepici",
  "guide-rccm",
  "guide-capital-",
  "guide-cout-creation-",
  "guide-entreprise-individuelle-",
  "guide-erreurs-creation-",
  "guide-aides-creation-",
  "guide-compte-bancaire-",
];

const SOURCE_GESTION_PREFIXES = [
  "guide-comptabilite-",
  "guide-cabinet-comptable-",
  "guide-choisir-cabinet-",
  "guide-cout-cabinet-",
  "guide-audit-",
  "guide-calendrier-fiscal-",
  "guide-impots-",
  "guide-tva-",
  "guide-cnps-",
  "guide-obligations-comptables-",
  "guide-domiciliation-",
];

function fromSource(source: string): Audience | null {
  const s = norm(source);
  if (SOURCE_CREATION_PREFIXES.some((p) => s.startsWith(p))) return "creation";
  if (SOURCE_GESTION_PREFIXES.some((p) => s.startsWith(p))) return "gestion";
  return null;
}

function fromStatut(statut: string): Audience | null {
  const s = norm(statut);
  if (!s) return null;
  if (/(creer|creation|pas encore|projet)/.test(s)) return "creation";
  if (/(deja|existante|existant|en activite|active)/.test(s)) return "gestion";
  return null;
}

function fromService(service: string): Audience | null {
  const s = norm(service);
  if (!s) return null;
  if (/(creation|immatricul|rccm|cepici|constitut)/.test(s)) return "creation";
  if (
    /(comptabilit|declaration|fiscal|audit|paie|cnps|tva|domiciliation|dsf|bilan)/.test(
      s,
    )
  )
    return "gestion";
  return null;
}

export function inferAudience(input: InferAudienceInput): Audience {
  // 1. audience_hint
  if (input.audience_hint === "creation" || input.audience_hint === "gestion") {
    return input.audience_hint;
  }
  // 2. statut explicite (toujours prioritaire sur source/service)
  const fromStatutResult = fromStatut(input.statut ?? "");
  if (fromStatutResult) return fromStatutResult;

  // 3. source
  const fromSourceResult = fromSource(input.source ?? "");
  if (fromSourceResult) return fromSourceResult;

  // 4. service
  const fromServiceResult = fromService(input.service ?? "");
  if (fromServiceResult) return fromServiceResult;

  // 5. fallback
  return "unknown";
}