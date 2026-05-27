// Server-only: notifie GHL des événements partenaires via webhook dédié.
// Tags : ["soumissioncomptable", "partenaire"]. Ne bloque jamais l'appelant.

export type PartnerEventType =
  | "signup"
  | "approved"
  | "rejected"
  | "paused"
  | "reactivated"
  | "manual_creation"
  | "low_credits"
  | "zero_credits";

export type PartnerEventPayload = {
  event_type: PartnerEventType;
  partner_id: string;
  status: string;
  credits_balance: number;
  cabinet_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  phone: string;
  city: string;
  website?: string | null;
  facebook_url?: string | null;
  services?: string[];
  zones?: string[];
  rejection_reason?: string | null;
  pause_reason?: string | null;
  page_url?: string | null;
  user_agent?: string | null;
};

export async function notifyPartnerEvent(payload: PartnerEventPayload): Promise<void> {
  const url = process.env.GHL_PARTNERS_WEBHOOK_URL;
  if (!url) {
    console.warn("[ghl-partners] GHL_PARTNERS_WEBHOOK_URL not configured", payload.event_type);
    return;
  }
  try {
    const body = {
      ...payload,
      tags: ["soumissioncomptable", "partenaire"],
      submitted_at: new Date().toISOString(),
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error(
        "[ghl-partners] LOST_PARTNER_EVENT",
        res.status,
        payload.event_type,
        payload.partner_id,
      );
    }
  } catch (err) {
    console.error(
      "[ghl-partners] LOST_PARTNER_EVENT threw",
      err,
      payload.event_type,
      payload.partner_id,
    );
  }
}
