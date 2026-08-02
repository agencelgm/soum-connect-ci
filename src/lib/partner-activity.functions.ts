import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("admin") && !roles.includes("agent")) throw new Error("Forbidden");
}

export type PartnerActivityRow = {
  partner_id: string;
  cabinet_name: string;
  city: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  tier: string | null;
  unlimited_until: string | null;
  credits_balance: number;
  unlocks: number;
  credits_spent: number;
  active_days: number;
  last_unlock_at: string | null;
  first_positions: number;
};

const RangeInput = z.object({
  from: z.string().min(4),
  to: z.string().min(4),
});

export const getPartnerActivityStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => RangeInput.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);

    const { data: unlocks, error } = await supabaseAdmin
      .from("lead_unlocks")
      .select("id, partner_id, publication_id, credits_spent, unlocked_at")
      .gte("unlocked_at", data.from)
      .lte("unlocked_at", data.to)
      .order("unlocked_at", { ascending: true })
      .limit(20000);
    if (error) throw new Error(error.message);

    const { data: partners, error: pErr } = await supabaseAdmin
      .from("partners")
      .select(
        "id, cabinet_name, city, email, phone, status, tier, unlimited_until, credits_balance",
      )
      .is("deleted_at", null)
      .limit(2000);
    if (pErr) throw new Error(pErr.message);

    // publications count in range (for average unlocks per prospect)
    const { count: publishedCount } = await supabaseAdmin
      .from("lead_publications")
      .select("id", { count: "exact", head: true })
      .gte("published_at", data.from)
      .lte("published_at", data.to);

    type Agg = {
      unlocks: number;
      credits_spent: number;
      days: Set<string>;
      last: string | null;
      first_positions: number;
    };
    const byPartner = new Map<string, Agg>();
    const seenPublication = new Set<string>();

    for (const u of unlocks ?? []) {
      const agg = byPartner.get(u.partner_id) ?? {
        unlocks: 0,
        credits_spent: 0,
        days: new Set<string>(),
        last: null,
        first_positions: 0,
      };
      agg.unlocks += 1;
      agg.credits_spent += u.credits_spent ?? 0;
      agg.days.add(String(u.unlocked_at).slice(0, 10));
      if (!agg.last || u.unlocked_at > agg.last) agg.last = u.unlocked_at;
      if (!seenPublication.has(u.publication_id)) {
        seenPublication.add(u.publication_id);
        agg.first_positions += 1;
      }
      byPartner.set(u.partner_id, agg);
    }

    const rows: PartnerActivityRow[] = [];
    const inactive: PartnerActivityRow[] = [];
    for (const p of partners ?? []) {
      const agg = byPartner.get(p.id);
      const row: PartnerActivityRow = {
        partner_id: p.id,
        cabinet_name: p.cabinet_name,
        city: p.city ?? null,
        email: p.email ?? null,
        phone: p.phone ?? null,
        status: p.status,
        tier: p.tier ?? null,
        unlimited_until: p.unlimited_until ?? null,
        credits_balance: p.credits_balance ?? 0,
        unlocks: agg?.unlocks ?? 0,
        credits_spent: agg?.credits_spent ?? 0,
        active_days: agg ? agg.days.size : 0,
        last_unlock_at: agg?.last ?? null,
        first_positions: agg?.first_positions ?? 0,
      };
      if (row.unlocks > 0) rows.push(row);
      else if (p.status === "approved") inactive.push(row);
    }

    rows.sort((a, b) => b.unlocks - a.unlocks);
    inactive.sort((a, b) => a.cabinet_name.localeCompare(b.cabinet_name));

    const totalUnlocks = (unlocks ?? []).length;
    const totalCredits = (unlocks ?? []).reduce((s, u) => s + (u.credits_spent ?? 0), 0);

    return {
      rows,
      inactive,
      totals: {
        unlocks: totalUnlocks,
        credits: totalCredits,
        active_partners: rows.length,
        published: publishedCount ?? 0,
        avg_per_prospect:
          publishedCount && publishedCount > 0
            ? Math.round((totalUnlocks / publishedCount) * 100) / 100
            : 0,
      },
    };
  });

export const getProspectUnlockers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ prospect_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);

    const { data: pubs, error: pubErr } = await supabaseAdmin
      .from("lead_publications")
      .select("id, published_at, max_unlocks, unlock_count, premium_until, is_active")
      .eq("prospect_id", data.prospect_id)
      .order("published_at", { ascending: false });
    if (pubErr) throw new Error(pubErr.message);
    if (!pubs || pubs.length === 0) return { publication: null, unlockers: [] };

    const pub = pubs[0];
    const { data: unlocks, error } = await supabaseAdmin
      .from("lead_unlocks")
      .select("id, partner_id, credits_spent, unlocked_at")
      .eq("publication_id", pub.id)
      .order("unlocked_at", { ascending: true });
    if (error) throw new Error(error.message);

    const ids = Array.from(new Set((unlocks ?? []).map((u) => u.partner_id)));
    const partnersById = new Map<string, any>();
    if (ids.length > 0) {
      const { data: partners } = await supabaseAdmin
        .from("partners")
        .select(
          "id, cabinet_name, contact_first_name, contact_last_name, email, phone, city, tier, unlimited_until",
        )
        .in("id", ids);
      for (const p of partners ?? []) partnersById.set(p.id, p);
    }

    return {
      publication: pub,
      unlockers: (unlocks ?? []).map((u, i) => ({
        position: i + 1,
        unlocked_at: u.unlocked_at,
        credits_spent: u.credits_spent ?? 0,
        partner: partnersById.get(u.partner_id) ?? null,
      })),
    };
  });

export const getPartnerUnlockHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ partner_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);

    const { data: unlocks, error } = await supabaseAdmin
      .from("lead_unlocks")
      .select("id, publication_id, credits_spent, unlocked_at")
      .eq("partner_id", data.partner_id)
      .order("unlocked_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const pubIds = Array.from(new Set((unlocks ?? []).map((u) => u.publication_id)));
    const pubById = new Map<string, any>();
    const prospectIds: string[] = [];
    if (pubIds.length > 0) {
      const { data: pubs } = await supabaseAdmin
        .from("lead_publications")
        .select("id, prospect_id, service, city, budget, published_at")
        .in("id", pubIds);
      for (const p of pubs ?? []) {
        pubById.set(p.id, p);
        prospectIds.push(p.prospect_id);
      }
    }
    const prospectById = new Map<string, any>();
    if (prospectIds.length > 0) {
      const { data: prospects } = await supabaseAdmin
        .from("prospects")
        .select("id, full_name, company_name, email, phone, service, city")
        .in("id", Array.from(new Set(prospectIds)));
      for (const p of prospects ?? []) prospectById.set(p.id, p);
    }

    return {
      items: (unlocks ?? []).map((u) => {
        const pub = pubById.get(u.publication_id);
        const prospect = pub ? prospectById.get(pub.prospect_id) : null;
        return {
          id: u.id,
          unlocked_at: u.unlocked_at,
          credits_spent: u.credits_spent ?? 0,
          published_at: pub?.published_at ?? null,
          service: prospect?.service ?? pub?.service ?? null,
          city: prospect?.city ?? pub?.city ?? null,
          prospect_name: prospect?.full_name ?? prospect?.company_name ?? null,
          prospect_email: prospect?.email ?? null,
          prospect_phone: prospect?.phone ?? null,
        };
      }),
    };
  });
