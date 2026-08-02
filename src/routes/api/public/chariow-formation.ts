import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Webhook Chariow dédié à la formation clients (produit prd_p987fb31).
// Chariow peut envoyer n'importe quel type d'événement (achat, échec, abandon,
// remboursement) : on le convertit en événement de tunnel pour le calcul du
// taux de conversion de la page /formation-clients.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Chariow-Signature, X-Signature",
};

function mapEvent(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("refund") || n.includes("rembours")) return "purchase_refunded";
  if (n.includes("abandon") || n.includes("cart")) return "purchase_abandoned";
  if (n.includes("fail") || n.includes("declin") || n.includes("cancel") || n.includes("echou"))
    return "purchase_failed";
  if (
    n.includes("paid") ||
    n.includes("complete") ||
    n.includes("success") ||
    n.includes("purchase") ||
    n.includes("order") ||
    n.includes("license")
  )
    return "purchase";
  return "purchase_other";
}

function pick(obj: unknown, keys: string[]): string | null {
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim() !== "") return v.trim();
  }
  return null;
}

export const Route = createFileRoute("/api/public/chariow-formation")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const rawBody = await request.text();

        const secret = process.env["CHARIOW_WEBHOOK_SECRET"];
        if (secret) {
          const signature =
            request.headers.get("x-chariow-signature") ??
            request.headers.get("x-signature") ??
            request.headers.get("chariow-signature");
          if (signature) {
            const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
            const a = Buffer.from(signature.replace(/^sha256=/, ""));
            const b = Buffer.from(expected);
            if (a.length !== b.length || !timingSafeEqual(a, b)) {
              return new Response("Invalid signature", { status: 401, headers: CORS });
            }
          }
        }

        let payload: Record<string, unknown>;
        try {
          payload = JSON.parse(rawBody) as Record<string, unknown>;
        } catch {
          return new Response("Invalid JSON", { status: 400, headers: CORS });
        }

        const data = (payload["data"] ?? {}) as Record<string, unknown>;
        const order = (payload["order"] ?? data["order"]) as Record<string, unknown> | undefined;
        const customer = (payload["customer"] ?? data["customer"] ?? order?.["customer"]) as
          | Record<string, unknown>
          | undefined;

        const eventName =
          pick(payload, ["event", "type", "event_type", "status"]) ??
          pick(data, ["event", "type", "event_type", "status"]) ??
          "unknown";

        const email =
          pick(customer, ["email", "customer_email", "buyer_email"]) ??
          pick(order, ["email", "customer_email", "buyer_email"]) ??
          pick(data, ["email", "customer_email", "buyer_email"]) ??
          pick(payload, ["email", "customer_email", "buyer_email"]);

        const amount =
          pick(order, ["amount", "total", "price", "amount_label"]) ??
          pick(data, ["amount", "total", "price"]) ??
          pick(payload, ["amount", "total", "price"]);

        const { error } = await supabaseAdmin.from("funnel_events").insert({
          page: "formation-clients",
          event: mapEvent(eventName),
          email: email ? email.toLowerCase() : null,
          amount_label: amount,
          metadata: { chariow_event: eventName, payload } as unknown as Record<string, never>,
        });
        if (error) console.error("[chariow-formation] insert failed", error.message);

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      },
    },
  },
});
