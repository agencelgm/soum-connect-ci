import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const COOLDOWN_MS = 5 * 60 * 1000;

async function getRoles(userId: string): Promise<string[]> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => r.role as string);
}

async function assertCommercial(userId: string) {
  const roles = await getRoles(userId);
  if (!roles.includes("commercial")) throw new Error("Forbidden");
}

async function assertStaff(userId: string) {
  const roles = await getRoles(userId);
  if (!roles.includes("admin") && !roles.includes("agent")) throw new Error("Forbidden");
}

function rawPayload(p: { raw_payload: unknown }) {
  return p.raw_payload && typeof p.raw_payload === "object" && !Array.isArray(p.raw_payload)
    ? (p.raw_payload as Record<string, unknown>)
    : {};
}

// ---------- Commercial dashboard ----------
export const getCommercialDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertCommercial(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: assigned } = await supabaseAdmin
      .from("prospect_assignments")
      .select("prospect_id");
    const taken = new Set((assigned ?? []).map((a) => a.prospect_id));

    const { data: pending, error } = await supabaseAdmin
      .from("prospects")
      .select("id, full_name, service, audience, created_at")
      .eq("status", "pending_qualification")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    // Masqué : seulement le nom et la demande
    const queue = (pending ?? [])
      .filter((p) => !taken.has(p.id))
      .map((p) => ({
        id: p.id,
        full_name: p.full_name,
        service: p.service,
        audience: p.audience,
        created_at: p.created_at,
      }));

    const { data: mine, error: mErr } = await supabaseAdmin
      .from("prospect_assignments")
      .select("*")
      .eq("commercial_id", context.userId)
      .order("unlocked_at", { ascending: false })
      .limit(200);
    if (mErr) throw new Error(mErr.message);

    const ids = (mine ?? []).map((m) => m.prospect_id);
    const { data: prospects } = ids.length
      ? await supabaseAdmin.from("prospects").select("*").in("id", ids)
      : { data: [] as never[] };
    const byId = new Map((prospects ?? []).map((p) => [p.id, p]));

    const myItems = (mine ?? []).map((a) => {
      const p = byId.get(a.prospect_id);
      const rp = p ? rawPayload(p) : {};
      const answers: Record<string, string> = {};
      for (const [k, v] of Object.entries(rp)) {
        if (["leadId", "tag", "user_agent", "received_at", "page_url", "referrer", "consent", "submitted_at", "source"].includes(k)) continue;
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") answers[k] = String(v);
      }
      return {
        ...a,
        prospect: p
          ? {
              full_name: p.full_name,
              email: p.email,
              phone: p.phone,
              company_name: p.company_name,
              service: p.service,
              city: p.city,
              budget: p.budget,
              message: p.message,
              legal_form: p.legal_form,
              created_at: p.created_at,
              answers,
            }
          : null,
      };
    });

    const open = myItems.find((m) => !m.decided_at) ?? null;
    const last = myItems[0]?.unlocked_at ?? null;
    const nextUnlockAt = last ? new Date(new Date(last).getTime() + COOLDOWN_MS).toISOString() : null;

    return { queue, mine: myItems, openProspectId: open?.prospect_id ?? null, nextUnlockAt };
  });

export const commercialUnlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ prospect_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.rpc("commercial_unlock_prospect", {
      _prospect_id: data.prospect_id,
    });
    if (error) {
      const map: Record<string, string> = {
        forbidden: "Accès réservé aux commerciaux.",
        open_assignment: "Clôturez d'abord votre prospect en cours (note de 10 mots + décision).",
        cooldown: "Patientez 5 minutes entre deux déblocages.",
        already_taken: "Ce prospect vient d'être pris par un autre commercial.",
        prospect_not_found: "Prospect introuvable.",
      };
      throw new Error(map[error.message] ?? error.message);
    }
    return { ok: true };
  });

export const commercialClose = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z
      .object({
        prospect_id: z.string().uuid(),
        note: z.string().trim().min(1).max(5000),
        decision: z.enum(["approved", "rejected"]),
      })
      .parse(i),
  )
  .handler(async ({ data, context }) => {
    const words = data.note.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) throw new Error("La note doit contenir au moins 10 mots.");
    const { error } = await context.supabase.rpc("commercial_close_prospect", {
      _prospect_id: data.prospect_id,
      _note: data.note,
      _decision: data.decision,
    });
    if (error) {
      const map: Record<string, string> = {
        note_too_short: "La note doit contenir au moins 10 mots.",
        not_found: "Prospect déjà clôturé ou non assigné.",
      };
      throw new Error(map[error.message] ?? error.message);
    }
    return { ok: true };
  });

// ---------- Admin : vue commerciale d'un prospect ----------
export const getProspectAssignment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ prospect_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: a } = await supabaseAdmin
      .from("prospect_assignments")
      .select("*")
      .eq("prospect_id", data.prospect_id)
      .maybeSingle();
    return { assignment: a ?? null };
  });

// ---------- Reboost ----------
export async function reboostAndNotify(publicationId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.rpc("reboost_publication", { _publication_id: publicationId });
  if (error) throw new Error(error.message);
  const { data: pub } = await supabaseAdmin
    .from("lead_publications")
    .select("prospect_id")
    .eq("id", publicationId)
    .maybeSingle();
  if (pub) {
    try {
      const { notifyPartnersNewProspect } = await import("./notify-partners.server");
      await notifyPartnersNewProspect(pub.prospect_id, publicationId);
    } catch (e) {
      console.error("[reboost] notify failed", e);
    }
  }
}

export const listLowContactPublications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("lead_publications")
      .select("id, prospect_id, service, city, unlock_count, max_unlocks, published_at, boost_count, last_boosted_at, is_active")
      .eq("is_active", true)
      .lt("unlock_count", 2)
      .order("published_at", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    const ids = (data ?? []).map((d) => d.prospect_id);
    const { data: ps } = ids.length
      ? await supabaseAdmin.from("prospects").select("id, full_name").in("id", ids)
      : { data: [] as { id: string; full_name: string | null }[] };
    const names = new Map((ps ?? []).map((p) => [p.id, p.full_name]));
    return {
      items: (data ?? []).map((d) => ({ ...d, full_name: names.get(d.prospect_id) ?? null })),
    };
  });

export const reboostPublication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ publication_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    await reboostAndNotify(data.publication_id);
    return { ok: true };
  });
