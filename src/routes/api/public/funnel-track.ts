import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

// Enregistre les événements du tunnel (vue de page, lecture vidéo, choix oui/non).
// Endpoint public appelé depuis le navigateur : aucune donnée sensible retournée.

const ALLOWED_EVENTS = new Set([
  "page_view",
  "video_play",
  "video_complete",
  "choice_yes",
  "choice_no",
  "checkout_redirect",
]);

const ALLOWED_PAGES = new Set(["formation-clients", "offre-site-internet", "offre-gestion-marketing"]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/funnel-track")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let body: Record<string, unknown>;
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          return new Response("Bad request", { status: 400, headers: CORS });
        }

        const page = typeof body.page === "string" ? body.page.slice(0, 80) : "";
        const event = typeof body.event === "string" ? body.event.slice(0, 40) : "";
        if (!ALLOWED_PAGES.has(page) || !ALLOWED_EVENTS.has(event)) {
          return new Response("Unknown event", { status: 400, headers: CORS });
        }

        const sessionId =
          typeof body.sessionId === "string" && body.sessionId.length <= 64 ? body.sessionId : null;
        const email =
          typeof body.email === "string" && body.email.includes("@")
            ? body.email.trim().toLowerCase().slice(0, 200)
            : null;
        const leadId =
          typeof body.leadId === "string" && /^[0-9a-f-]{36}$/i.test(body.leadId) ? body.leadId : null;

        const { error } = await supabaseAdmin.from("funnel_events").insert({
          page,
          event,
          session_id: sessionId,
          lead_id: leadId,
          email,
          metadata: {
            source: typeof body.source === "string" ? body.source.slice(0, 120) : null,
            referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 300) : null,
          },
        });

        // 23505 = doublon (même session + même événement) : on ignore silencieusement.
        if (error && error.code !== "23505") {
          console.error("[funnel-track] insert failed", error.message);
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...CORS },
        });
      },
    },
  },
});
