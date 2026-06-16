// Server-only: notifie GHL quand un prospect est approuvé (publié comme lead).
// Ne bloque jamais l'appelant — log et continue si échec.

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const WEBHOOK_URL =
  process.env.GHL_PROSPECT_APPROVED_WEBHOOK_URL ||
  "https://services.leadconnectorhq.com/hooks/bYBrfkNK5nfKneUURhX9/webhook-trigger/fb2df7c2-3d5d-4959-96ea-51defdb3132f";

export async function notifyProspectApproved(prospectId: string, publicationId: string): Promise<void> {
  try {
    const { data: prospect, error } = await supabaseAdmin
      .from("prospects")
      .select("*")
      .eq("id", prospectId)
      .maybeSingle();
    if (error || !prospect) {
      console.error("[ghl-prospect-approved] prospect introuvable", prospectId, error?.message);
      return;
    }

    const rp = (prospect.raw_payload && typeof prospect.raw_payload === "object" && !Array.isArray(prospect.raw_payload))
      ? (prospect.raw_payload as Record<string, unknown>)
      : {};

    const body = {
      event_type: "prospect_approved",
      tags: ["soumissioncomptable", "prospect", "approuve"],
      submitted_at: new Date().toISOString(),
      // IDs
      prospect_id: prospect.id,
      publication_id: publicationId,
      // Contact
      full_name: prospect.full_name,
      email: prospect.email,
      phone: prospect.phone,
      company_name: prospect.company_name,
      // Demande
      form_type: prospect.form_type,
      service: prospect.service,
      statut: prospect.statut,
      city: prospect.city,
      legal_form: prospect.legal_form,
      budget: prospect.budget,
      message: prospect.message,
      audience: prospect.audience,
      audience_hint: prospect.audience_hint,
      delai: typeof rp.delai === "string" ? rp.delai : null,
      // Tracking
      source: prospect.source,
      page_url: prospect.page_url,
      referrer: prospect.referrer,
      user_agent: prospect.user_agent,
      submitted_at_original: prospect.submitted_at,
      created_at: prospect.created_at,
      // Brut pour ne rien perdre
      raw_payload: prospect.raw_payload,
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("[ghl-prospect-approved] webhook non-2xx", res.status, prospectId);
    }
  } catch (err) {
    console.error("[ghl-prospect-approved] threw", err, prospectId);
  }
}