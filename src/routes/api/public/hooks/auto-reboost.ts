import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron horaire : remonte en tête les publications actives débloquées par
 * moins de 2 cabinets 2 jours après leur publication (ou dernier reboost).
 */
export const Route = createFileRoute("/api/public/hooks/auto-reboost")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = request.headers.get("apikey");
        if (!key || key !== process.env.SUPABASE_PUBLISHABLE_KEY && key !== process.env.SUPABASE_ANON_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { reboostAndNotify } = await import("@/lib/commercial.functions");
        const cutoff = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();
        const { data, error } = await supabaseAdmin
          .from("lead_publications")
          .select("id")
          .eq("is_active", true)
          .lt("unlock_count", 2)
          .lt("published_at", cutoff)
          .limit(100);
        if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
        let n = 0;
        for (const p of data ?? []) {
          try {
            await reboostAndNotify(p.id);
            n++;
          } catch (e) {
            console.error("[auto-reboost]", p.id, e);
          }
        }
        return Response.json({ ok: true, reboosted: n });
      },
    },
  },
});
