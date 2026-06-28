import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fetchPartner, emitPartnerEvent } from "./partners.server";

async function getCallerPartner(userId: string) {
  const { data } = await supabaseAdmin
    .from("partners")
    .select("*")
    .eq("profile_id", userId)
    .is("deleted_at", null)
    .maybeSingle();
  return data;
}

async function assertStaff(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("admin") && !roles.includes("agent")) {
    throw new Error("Forbidden");
  }
}

// ----- Marketplace : liste anonymisée pour partenaires approuvés -----
export const listMarketplace = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partner = await getCallerPartner(context.userId);
    if (!partner) return { partner: null, leads: [], unlocked_ids: [] };

    const { data: pubs, error } = await supabaseAdmin
      .from("lead_publications")
      .select(
        "id, prospect_id, service, city, audience, legal_form, budget, summary, unlock_count, max_unlocks, is_active, published_at, premium_until",
      )
      .order("published_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const { data: unlocks } = await supabaseAdmin
      .from("lead_unlocks")
      .select("publication_id")
      .eq("partner_id", partner.id);
    const unlocked_ids = (unlocks ?? []).map((u) => u.publication_id);

    // Enrichir avec le délai souhaité (depuis prospects.raw_payload), non-PII.
    const prospectIds = Array.from(new Set((pubs ?? []).map((p) => p.prospect_id)));
    const delaiByProspect = new Map<string, string | null>();
    if (prospectIds.length > 0) {
      const { data: prospects } = await supabaseAdmin
        .from("prospects")
        .select("id, raw_payload")
        .in("id", prospectIds);
      for (const p of prospects ?? []) {
        const rp =
          p.raw_payload && typeof p.raw_payload === "object" && !Array.isArray(p.raw_payload)
            ? (p.raw_payload as Record<string, unknown>)
            : {};
        const d = rp.delai;
        delaiByProspect.set(p.id, typeof d === "string" && d.trim() !== "" ? d : null);
      }
    }

    const leads = (pubs ?? []).map((p) => {
      const { prospect_id, ...rest } = p;
      return { ...rest, delai: delaiByProspect.get(prospect_id) ?? null };
    });

    return {
      partner: {
        id: partner.id,
        status: partner.status,
        credits_balance: partner.credits_balance,
        cabinet_name: partner.cabinet_name,
        tier: (partner as { tier?: string }).tier ?? "regular",
      },
      leads,
      unlocked_ids,
    };
  });

// ----- Unlock : appelle RPC, retourne coordonnées -----
export const unlockLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ publication_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("unlock_lead", {
      _publication_id: data.publication_id,
    });
    if (error) {
      const map: Record<string, string> = {
        partner_not_found: "Aucun compte partenaire trouvé.",
        partner_not_approved: "Votre compte n'est pas encore approuvé.",
        insufficient_credits: "Crédits insuffisants. Rechargez pour continuer.",
        publication_not_found: "Lead introuvable.",
        publication_inactive: "Ce lead n'est plus disponible.",
        publication_full: "Ce lead a atteint le nombre maximum de déblocages.",
        premium_window_active:
          "Ce prospect est actuellement réservé à nos clients Premium. Patientez ou contactez-nous pour devenir Premium.",
      };
      throw new Error(map[error.message] ?? error.message);
    }

    // Déclencheur low/zero credits
    const balance = (result as { credits_balance: number }).credits_balance;
    if (balance <= 3) {
      const partner = await fetchPartner((await getCallerPartner(context.userId))!.id);
      if (partner) {
        await emitPartnerEvent(partner, balance === 0 ? "zero_credits" : "low_credits");
      }
    }
    const r = result as {
      already_unlocked: boolean;
      credits_balance: number;
      prospect: Record<string, unknown>;
    };
    return {
      already_unlocked: r.already_unlocked,
      credits_balance: r.credits_balance,
      prospect: sanitizeProspectForPartner(r.prospect),
    };
  });

// Liste blanche : seuls ces champs sont exposés au partenaire après déblocage.
// Les réponses internes (logo, siteWeb, publicité, upsell_*) restent côté admin uniquement.
function sanitizeProspectForPartner(p: Record<string, unknown> | null | undefined) {
  if (!p) return null;
  const rp =
    p.raw_payload && typeof p.raw_payload === "object" && !Array.isArray(p.raw_payload)
      ? (p.raw_payload as Record<string, unknown>)
      : {};
  const delai =
    typeof rp.delai === "string" && rp.delai.trim() !== "" ? (rp.delai as string) : null;
  return {
    full_name: (p.full_name as string | null) ?? null,
    email: (p.email as string | null) ?? null,
    phone: (p.phone as string | null) ?? null,
    company_name: (p.company_name as string | null) ?? null,
    message: (p.message as string | null) ?? null,
    service: (p.service as string | null) ?? null,
    city: (p.city as string | null) ?? null,
    legal_form: (p.legal_form as string | null) ?? null,
    budget: (p.budget as string | null) ?? null,
    audience: (p.audience as string | null) ?? null,
    external_notes: (p.external_notes as string | null) ?? null,
    delai,
  };
}

// ----- Mes leads débloqués -----
export const myUnlockedLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partner = await getCallerPartner(context.userId);
    if (!partner) return { items: [] };
    const { data, error } = await supabaseAdmin
      .from("lead_unlocks")
      .select(
        "id, unlocked_at, credits_spent, publication_id, lead_publications!inner(prospect_id, service, city, summary)",
      )
      .eq("partner_id", partner.id)
      .order("unlocked_at", { ascending: false });
    if (error) throw new Error(error.message);
    const items = data ?? [];
    if (items.length === 0) return { items: [] };
    const prospectIds = Array.from(
      new Set(items.map((i) => (i.lead_publications as { prospect_id: string }).prospect_id)),
    );
    const { data: prospects } = await supabaseAdmin
      .from("prospects")
      .select("*")
      .in("id", prospectIds);
    const byId = new Map(
      (prospects ?? []).map((p) => [
        p.id,
        sanitizeProspectForPartner(p as unknown as Record<string, unknown>),
      ]),
    );
    return {
      items: items.map((i) => {
        const pub = i.lead_publications as {
          prospect_id: string;
          service: string | null;
          city: string | null;
          summary: string | null;
        };
        return {
          id: i.id,
          unlocked_at: i.unlocked_at,
          publication_id: i.publication_id,
          service: pub.service,
          city: pub.city,
          summary: pub.summary,
          prospect: byId.get(pub.prospect_id) ?? null,
        };
      }),
    };
  });

// ----- Staff : publier un prospect comme lead -----
export const publishProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        prospect_id: z.string().uuid(),
        summary: z.string().trim().min(10).max(2000).optional(),
        max_unlocks: z.number().int().min(1).max(20).default(6),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    let summary = data.summary;
    if (!summary) {
      const { data: prospect, error: prospectError } = await supabaseAdmin
        .from("prospects")
        .select("external_notes")
        .eq("id", data.prospect_id)
        .maybeSingle();
      if (prospectError) throw new Error(prospectError.message);
      summary = prospect?.external_notes?.trim() || undefined;
    }
    const { data: pubId, error } = await context.supabase.rpc("publish_prospect_as_lead", {
      _prospect_id: data.prospect_id,
      _summary: summary,
      _max_unlocks: data.max_unlocks,
    });
    if (error) throw new Error(error.message);
    const publicationId = pubId as string;
    // Notifie GHL en arrière-plan (n'impacte pas la réponse à l'admin)
    // Import dynamique : le module charge supabaseAdmin (server-only).
    try {
      const { notifyProspectApproved } = await import("./ghl-prospect-approved.server");
      await notifyProspectApproved(data.prospect_id, publicationId);
    } catch (e) {
      console.error("[publishProspect] notifyProspectApproved failed", e);
    }
    return { publication_id: publicationId };
  });

// ----- Staff : liste publications -----
export const listPublications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("lead_publications")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { publications: data ?? [] };
  });

// ----- Staff : désactiver une publication -----
export const deactivatePublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ publication_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("lead_publications")
      .update({ is_active: false })
      .eq("id", data.publication_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
