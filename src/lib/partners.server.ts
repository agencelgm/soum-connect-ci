import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { notifyPartnerEvent, type PartnerEventType } from "./ghl-partners.server";

type PartnerRow = {
  id: string;
  profile_id: string;
  cabinet_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  phone: string;
  city: string;
  website: string | null;
  facebook_url: string | null;
  services: string[];
  zones: string[];
  status: string;
  credits_balance: number;
  rejection_reason: string | null;
  pause_reason: string | null;
  wants_website: boolean | null;
  wants_logo: boolean | null;
};

export async function emitPartnerEvent(partner: PartnerRow, event_type: PartnerEventType, extra?: { page_url?: string | null; user_agent?: string | null }) {
  await notifyPartnerEvent({
    event_type,
    partner_id: partner.id,
    status: partner.status,
    credits_balance: partner.credits_balance,
    cabinet_name: partner.cabinet_name,
    contact_first_name: partner.contact_first_name,
    contact_last_name: partner.contact_last_name,
    email: partner.email,
    phone: partner.phone,
    city: partner.city,
    website: partner.website,
    facebook_url: partner.facebook_url,
    services: partner.services,
    zones: partner.zones,
    rejection_reason: partner.rejection_reason,
    pause_reason: partner.pause_reason,
    wants_website: partner.wants_website,
    wants_logo: partner.wants_logo,
    page_url: extra?.page_url ?? null,
    user_agent: extra?.user_agent ?? null,
  });
}

export async function fetchPartner(id: string): Promise<PartnerRow | null> {
  const { data, error } = await supabaseAdmin
    .from("partners")
    .select("id,profile_id,cabinet_name,contact_first_name,contact_last_name,email,phone,city,website,facebook_url,services,zones,status,credits_balance,rejection_reason,pause_reason,wants_website,wants_logo")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("[partners] fetchPartner", error.message);
    return null;
  }
  return (data as PartnerRow | null) ?? null;
}

export async function grantCredits(partner: PartnerRow, amount: number, tx_type: "signup_bonus" | "manual_creation_bonus" | "admin_grant", created_by: string | null, note?: string) {
  const newBalance = (partner.credits_balance ?? 0) + amount;
  const { error: updErr } = await supabaseAdmin
    .from("partners")
    .update({ credits_balance: newBalance })
    .eq("id", partner.id);
  if (updErr) throw new Error(updErr.message);
  const { error: txErr } = await supabaseAdmin
    .from("credit_transactions")
    .insert({
      partner_id: partner.id,
      tx_type,
      amount,
      balance_after: newBalance,
      created_by,
      note: note ?? null,
    });
  if (txErr) throw new Error(txErr.message);
  partner.credits_balance = newBalance;
}