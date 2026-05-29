// Meta Pixel + Conversions API helper.
// Le Pixel ID est public (visible dans le bundle navigateur de toute façon).
export const META_PIXEL_ID = "695405827723663";

type FbqParams = Record<string, string | number | boolean | undefined>;

export type MetaUserData = {
  em?: string; // email
  ph?: string; // phone
  fn?: string; // first name
  ln?: string; // last name
  ct?: string; // city
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Déclenche un événement Meta côté navigateur (Pixel) + côté serveur (CAPI)
 * avec le même event_id pour déduplication automatique par Meta (fenêtre 48h).
 */
export function trackMetaConversion(
  eventName: "Lead" | "CompleteRegistration",
  params: FbqParams = {},
  userData: MetaUserData = {},
): void {
  if (typeof window === "undefined") return;

  const eventId = genId();
  const cleanParams: FbqParams = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") cleanParams[k] = v;
  }

  // 1) Pixel navigateur
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, cleanParams, { eventID: eventId });
    }
  } catch (err) {
    console.warn("fbq track failed", err);
  }

  // 2) Conversions API (fire-and-forget)
  try {
    const payload = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: cleanParams,
      user_data: userData,
    };
    void fetch("/api/public/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}