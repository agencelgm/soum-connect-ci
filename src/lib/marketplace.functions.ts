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
      .select("id, service, city, audience, legal_form, budget, summary, unlock_count, max_unlocks, is_active, published_at")
      .eq("is_active", true)
      .order("published_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);

    const { data: unlocks } = await supabaseAdmin
      .from("lead_unlocks")
      .select("publication_id")
      .eq("partner_id", partner.id);
    const unlocked_ids = (unlocks ?? []).map((u) => u.publication_id);

    return {
      partner: { id: partner.id, status: partner.status, credits_balance: partner.credits_balance, cabinet_name: partner.cabinet_name },
      leads: pubs ?? [],
      unlocked_ids,
    };
  });

// ----- Unlock : appelle RPC, retourne coordonnées -----
export const unlockLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ publication_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: result, error } = await context.supabase.rpc("unlock_lead", { _publication_id: data.publication_id });
    if (error) {
      const map: Record<string, string> = {
        partner_not_found: "Aucun compte partenaire trouvé.",
        partner_not_approved: "Votre compte n'est pas encore approuvé.",
        insufficient_credits: "Crédits insuffisants. Rechargez pour continuer.",
        publication_not_found: "Lead introuvable.",
        publication_inactive: "Ce lead n'est plus disponible.",
        publication_full: "Ce lead a atteint le nombre maximum de déblocages.",
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
    const r = result as { already_unlocked: boolean; credits_balance: number; prospect: Record<string, string | number | boolean | null> };
    return r;
  });

// ----- Mes leads débloqués -----
export const myUnlockedLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partner = await getCallerPartner(context.userId);
    if (!partner) return { items: [] };
    const { data, error } = await supabaseAdmin
      .from("lead_unlocks")
      .select("id, unlocked_at, credits_spent, publication_id, lead_publications!inner(prospect_id, service, city)")
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
    const byId = new Map((prospects ?? []).map((p) => [p.id, p]));
    return {
      items: items.map((i) => {
        const pub = i.lead_publications as { prospect_id: string; service: string | null; city: string | null };
        return {
          id: i.id,
          unlocked_at: i.unlocked_at,
          publication_id: i.publication_id,
          service: pub.service,
          city: pub.city,
          prospect: byId.get(pub.prospect_id) ?? null,
        };
      }),
    };
  });

// ----- Staff : publier un prospect comme lead -----
export const publishProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      prospect_id: z.string().uuid(),
      summary: z.string().trim().min(10).max(2000).optional(),
      max_unlocks: z.number().int().min(1).max(20).default(6),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { data: pubId, error } = await context.supabase.rpc("publish_prospect_as_lead", {
      _prospect_id: data.prospect_id,
      _summary: data.summary ?? null,
      _max_unlocks: data.max_unlocks,
    });
    if (error) throw new Error(error.message);
    return { publication_id: pubId as string };
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