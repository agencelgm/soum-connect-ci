// Server-only helper: enregistre une soumission de formulaire dans la table
// `prospects` (Lovable Cloud). Utilise le client admin car les endpoints
// /api/public/* sont anonymes — l'utilisateur n'a pas de session Supabase.

import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Audience } from "./audience";

export type ProspectFormType = "lead" | "contact";

export type RecordProspectInput = {
  id?: string;
  form_type: ProspectFormType;
  // Contact
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  // Demande
  statut?: string | null;
  service?: string | null;
  city?: string | null;
  budget?: string | null;
  message?: string | null;
  legal_form?: string | null;
  // Routing
  audience: Audience;
  audience_hint?: string | null;
  // Tracking
  source?: string | null;
  page_url?: string | null;
  referrer?: string | null;
  user_agent?: string | null;
  submitted_at?: string | null;
  // Backup brut
  raw_payload: Record<string, unknown>;
};

function toTimestamp(value: string | null | undefined): string | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

/**
 * Enregistre un prospect en base. Lève si l'insert échoue: le workflow dépend
 * du back-office, donc une demande non enregistrée ne doit pas être confirmée.
 */
export async function recordProspect(input: RecordProspectInput): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from("prospects")
      .insert({
        id: input.id,
        form_type: input.form_type,
        full_name: input.full_name ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
        company_name: input.company_name ?? null,
        statut: input.statut ?? null,
        service: input.service ?? null,
        city: input.city ?? null,
        budget: input.budget ?? null,
        message: input.message ?? null,
        legal_form: input.legal_form ?? null,
        audience: input.audience,
        audience_hint: input.audience_hint ?? null,
        source: input.source ?? null,
        page_url: input.page_url ?? null,
        referrer: input.referrer ?? null,
        user_agent: input.user_agent ?? null,
        submitted_at: toTimestamp(input.submitted_at),
        raw_payload: input.raw_payload as never,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[prospects] insert error", error.message, error.details);
      throw new Error("Prospect database insert failed");
    }
    if (!data?.id) {
      throw new Error("Prospect database insert returned no id");
    }
    return data.id;
  } catch (err) {
    console.error("[prospects] insert threw", err);
    throw err;
  }
}
