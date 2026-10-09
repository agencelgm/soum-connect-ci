import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { pickNextCommercial } from "./assignment-rotation";

async function activeCommercialIds(): Promise<string[]> {
  const { data } = await supabaseAdmin.from("user_roles").select("user_id").eq("role", "commercial");
  const ids = Array.from(new Set((data ?? []).map((r) => r.user_id)));
  const active: string[] = [];
  await Promise.all(
    ids.map(async (id) => {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(id);
      const banned = (u?.user as { banned_until?: string | null } | undefined)?.banned_until;
      if (u?.user && !(banned && new Date(banned).getTime() > Date.now())) active.push(id);
    }),
  );
  return active.sort();
}

async function lastAssignedMap(ids: string[]) {
  const map = new Map<string, string | null>();
  if (ids.length === 0) return map;
  const { data } = await supabaseAdmin
    .from("prospect_assignments")
    .select("commercial_id, assigned_at")
    .in("commercial_id", ids)
    .order("assigned_at", { ascending: false })
    .limit(2000);
  for (const r of data ?? []) if (!map.has(r.commercial_id)) map.set(r.commercial_id, r.assigned_at);
  return map;
}

async function nameOf(userId: string) {
  const { data } = await supabaseAdmin.from("profiles").select("full_name, email").eq("id", userId).maybeSingle();
  return data?.full_name || data?.email || null;
}

/** Attribue automatiquement un prospect (rotation). Ne lève jamais. */
export async function autoAssignProspect(prospectId: string): Promise<string | null> {
  try {
    const { data: existing } = await supabaseAdmin
      .from("prospect_assignments")
      .select("id")
      .eq("prospect_id", prospectId)
      .maybeSingle();
    if (existing) return null;
    const ids = await activeCommercialIds();
    const pick = pickNextCommercial(ids, await lastAssignedMap(ids));
    if (!pick) return null;
    const now = new Date().toISOString();
    const { error } = await supabaseAdmin.from("prospect_assignments").insert({
      prospect_id: prospectId,
      commercial_id: pick,
      commercial_name: await nameOf(pick),
      assigned_at: now,
      unlocked_at: now,
      assigned_by: null,
    });
    if (error) {
      console.error("[autoAssign] insert", error.message);
      return null;
    }
    return pick;
  } catch (e) {
    console.error("[autoAssign] threw", e);
    return null;
  }
}

export async function assignProspectTo(prospectId: string, commercialId: string, by: string) {
  const now = new Date().toISOString();
  const name = await nameOf(commercialId);
  const { data: existing } = await supabaseAdmin
    .from("prospect_assignments")
    .select("id")
    .eq("prospect_id", prospectId)
    .maybeSingle();
  if (existing) {
    const { error } = await supabaseAdmin
      .from("prospect_assignments")
      .update({ commercial_id: commercialId, commercial_name: name, assigned_by: by, assigned_at: now, unlocked_at: now })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin.from("prospect_assignments").insert({
      prospect_id: prospectId, commercial_id: commercialId, commercial_name: name, assigned_by: by, assigned_at: now, unlocked_at: now,
    });
    if (error) throw new Error(error.message);
  }
}

export async function listActiveCommercials() {
  const ids = await activeCommercialIds();
  if (ids.length === 0) return [];
  const { data } = await supabaseAdmin.from("profiles").select("id, full_name, email").in("id", ids);
  return (data ?? []).map((p) => ({ id: p.id, name: p.full_name || p.email }));
}
