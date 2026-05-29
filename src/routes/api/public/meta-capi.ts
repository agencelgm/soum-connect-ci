import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createHash } from "crypto";
import { META_PIXEL_ID } from "@/lib/meta-pixel";

const PIXEL_ID = META_PIXEL_ID;

const Schema = z.object({
  event_name: z.enum(["Lead", "CompleteRegistration"]),
  event_id: z.string().min(8).max(80),
  event_source_url: z.string().url().max(2000),
  custom_data: z.record(z.string().max(80), z.union([z.string().max(500), z.number(), z.boolean()])).optional(),
  user_data: z
    .object({
      em: z.string().max(255).optional(),
      ph: z.string().max(40).optional(),
      fn: z.string().max(100).optional(),
      ln: z.string().max(100).optional(),
      ct: z.string().max(100).optional(),
    })
    .optional(),
});

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(v: string) {
  return v.trim().toLowerCase();
}
function normalizeText(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, "");
}
function normalizePhone(v: string) {
  // garde uniquement les chiffres ; Meta attend E.164 sans "+"
  return v.replace(/\D+/g, "");
}

// Rate-limit en mémoire (best-effort par instance Worker)
const rateBucket = new Map<string, { count: number; ts: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const slot = rateBucket.get(ip);
  if (!slot || now - slot.ts > 60_000) {
    rateBucket.set(ip, { count: 1, ts: now });
    return false;
  }
  slot.count += 1;
  return slot.count > 30;
}

export const Route = createFileRoute("/api/public/meta-capi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const token = process.env.META_CAPI_ACCESS_TOKEN;
          if (!token) {
            console.warn("[meta-capi] token manquant");
            return new Response("ok", { status: 200 });
          }

          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";

          if (rateLimited(ip)) {
            return new Response("rate_limited", { status: 200 });
          }

          const raw = await request.json().catch(() => null);
          const parsed = Schema.safeParse(raw);
          if (!parsed.success) {
            console.warn("[meta-capi] payload invalide", parsed.error.issues);
            return new Response("ok", { status: 200 });
          }
          const body = parsed.data;
          const ud = body.user_data ?? {};
          const userAgent = request.headers.get("user-agent") || "";

          const hashed: Record<string, string> = {};
          if (ud.em) hashed.em = sha256(normalizeEmail(ud.em));
          if (ud.ph) hashed.ph = sha256(normalizePhone(ud.ph));
          if (ud.fn) hashed.fn = sha256(normalizeText(ud.fn));
          if (ud.ln) hashed.ln = sha256(normalizeText(ud.ln));
          if (ud.ct) hashed.ct = sha256(normalizeText(ud.ct));
          hashed.country = sha256("ci");

          const event = {
            event_name: body.event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id: body.event_id,
            event_source_url: body.event_source_url,
            action_source: "website",
            user_data: {
              ...hashed,
              client_ip_address: ip !== "unknown" ? ip : undefined,
              client_user_agent: userAgent,
            },
            custom_data: body.custom_data ?? {},
          };

          const url = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;
          const payload: Record<string, unknown> = { data: [event] };
          const testCode = process.env.META_TEST_EVENT_CODE;
          if (testCode) payload.test_event_code = testCode;

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            const txt = await res.text().catch(() => "");
            console.warn("[meta-capi] meta refusa", res.status, txt.slice(0, 500));
          }
        } catch (err) {
          console.warn("[meta-capi] erreur", err);
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});