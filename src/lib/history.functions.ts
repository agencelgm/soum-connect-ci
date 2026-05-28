import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function resolvePartnerForUser(userId: string): Promise<string | null> {
  const { data: owned } = await supabaseAdmin
    .from("partners")
    .select("id")
    .eq("profile_id", userId)
    .is("deleted_at", null)
    .maybeSingle();
  if (owned) return owned.id;
  const { data: mem } = await supabaseAdmin
    .from("partner_members")
    .select("partner_id")
    .eq("user_id", userId)
    .maybeSingle();
  return mem?.partner_id ?? null;
}

type MemberLite = {
  user_id: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_owner: boolean;
};

async function getTeamLookup(partnerId: string): Promise<Map<string, MemberLite>> {
  const map = new Map<string, MemberLite>();

  const { data: owner } = await supabaseAdmin
    .from("partners")
    .select("profile_id, email, contact_first_name, contact_last_name")
    .eq("id", partnerId)
    .maybeSingle();
  if (owner?.profile_id) {
    map.set(owner.profile_id, {
      user_id: owner.profile_id,
      email: owner.email ?? null,
      first_name: owner.contact_first_name ?? null,
      last_name: owner.contact_last_name ?? null,
      is_owner: true,
    });
  }

  const { data: members } = await supabaseAdmin
    .from("partner_members")
    .select("user_id, email, first_name, last_name")
    .eq("partner_id", partnerId);
  for (const m of members ?? []) {
    if (!m.user_id) continue;
    map.set(m.user_id, {
      user_id: m.user_id,
      email: m.email,
      first_name: m.first_name,
      last_name: m.last_name,
      is_owner: false,
    });
  }
  return map;
}

function displayName(m: MemberLite | undefined, fallbackEmail?: string | null): string {
  if (m) {
    const name = [m.first_name, m.last_name].filter(Boolean).join(" ").trim();
    if (name) return name;
    if (m.email) return m.email;
  }
  return fallbackEmail ?? "Inconnu";
}

// -------------------- Achats Chariow --------------------

export const listMyChariowPurchases = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) return { purchases: [] as Array<Record<string, unknown>> };

    const { data, error } = await supabaseAdmin
      .from("chariow_payments")
      .select("id, received_at, processed_at, status, product_id, amount_label, credits_granted, email, license_code")
      .eq("partner_id", partnerId)
      .order("received_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const team = await getTeamLookup(partnerId);
    // index members by lowercased email for quick lookup
    const byEmail = new Map<string, MemberLite>();
    for (const m of team.values()) {
      if (m.email) byEmail.set(m.email.toLowerCase(), m);
    }

    const purchases = (data ?? []).map((p) => {
      const matched = byEmail.get((p.email ?? "").toLowerCase());
      return {
        id: p.id,
        received_at: p.received_at,
        processed_at: p.processed_at,
        status: p.status,
        amount_label: p.amount_label,
        credits_granted: p.credits_granted,
        email: p.email,
        license_code: p.license_code,
        buyer_name: displayName(matched, p.email),
        buyer_is_member: !!matched,
      };
    });

    return { purchases };
  });

// -------------------- Crédits utilisés (déblocages) --------------------

export const listMyUnlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) return { unlocks: [] as Array<Record<string, unknown>> };

    const { data, error } = await supabaseAdmin
      .from("credit_transactions")
      .select("id, created_at, amount, balance_after, reference_id, note, created_by")
      .eq("partner_id", partnerId)
      .eq("tx_type", "unlock_spend")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    const team = await getTeamLookup(partnerId);
    const pubIds = Array.from(new Set((data ?? []).map((d) => d.reference_id).filter(Boolean) as string[]));

    const pubMap = new Map<string, { service: string | null; city: string | null; prospect_id: string | null }>();
    if (pubIds.length) {
      const { data: pubs } = await supabaseAdmin
        .from("lead_publications")
        .select("id, service, city, prospect_id")
        .in("id", pubIds);
      for (const p of pubs ?? []) pubMap.set(p.id, { service: p.service, city: p.city, prospect_id: p.prospect_id });
    }

    const unlocks = (data ?? []).map((u) => {
      const member = u.created_by ? team.get(u.created_by) : undefined;
      const pub = u.reference_id ? pubMap.get(u.reference_id) : undefined;
      return {
        id: u.id,
        created_at: u.created_at,
        credits_spent: Math.abs(u.amount),
        balance_after: u.balance_after,
        user_id: u.created_by,
        user_name: displayName(member),
        user_is_owner: member?.is_owner ?? false,
        service: pub?.service ?? null,
        city: pub?.city ?? null,
      };
    });

    return { unlocks };
  });

// -------------------- Activité équipe (flux unifié) --------------------

export const listMyActivity = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) return { activity: [] as Array<Record<string, unknown>>, members: [] as MemberLite[] };

    const { data, error } = await supabaseAdmin
      .from("credit_transactions")
      .select("id, created_at, amount, balance_after, tx_type, reference_id, note, created_by")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const team = await getTeamLookup(partnerId);
    const pubIds = Array.from(
      new Set((data ?? []).filter((d) => d.tx_type === "unlock_spend" && d.reference_id).map((d) => d.reference_id as string)),
    );

    const pubMap = new Map<string, { service: string | null; city: string | null }>();
    if (pubIds.length) {
      const { data: pubs } = await supabaseAdmin
        .from("lead_publications")
        .select("id, service, city")
        .in("id", pubIds);
      for (const p of pubs ?? []) pubMap.set(p.id, { service: p.service, city: p.city });
    }

    const activity = (data ?? []).map((t) => {
      const member = t.created_by ? team.get(t.created_by) : undefined;
      const pub = t.reference_id ? pubMap.get(t.reference_id) : undefined;
      return {
        id: t.id,
        created_at: t.created_at,
        tx_type: t.tx_type as string,
        amount: t.amount,
        balance_after: t.balance_after,
        note: t.note,
        user_id: t.created_by,
        user_name: displayName(member),
        user_is_owner: member?.is_owner ?? false,
        service: pub?.service ?? null,
        city: pub?.city ?? null,
      };
    });

    return {
      activity,
      members: Array.from(team.values()),
    };
  });

// -------------------- Reçu d'achat --------------------

export const getChariowReceipt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { paymentId: string }) => input)
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) throw new Error("Aucun cabinet associé.");

    const { data: payment, error } = await supabaseAdmin
      .from("chariow_payments")
      .select("id, received_at, processed_at, status, amount_label, credits_granted, email, license_code, partner_id")
      .eq("id", data.paymentId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!payment) throw new Error("Paiement introuvable");
    if (payment.partner_id !== partnerId) throw new Error("Accès refusé");

    const { data: partner } = await supabaseAdmin
      .from("partners")
      .select("cabinet_name, contact_first_name, contact_last_name, email, city, phone")
      .eq("id", partnerId)
      .maybeSingle();

    return {
      payment: {
        id: payment.id,
        date: payment.processed_at ?? payment.received_at,
        amount_label: payment.amount_label,
        credits_granted: payment.credits_granted,
        email: payment.email,
        license_code: payment.license_code,
      },
      partner: partner ?? null,
    };
  });