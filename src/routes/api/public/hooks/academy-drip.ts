import { createFileRoute } from "@tanstack/react-router";

/**
 * Daily cron: sends one Academy video per day to newly approved partners.
 * Progression is tracked on `partners.academy_drip_index`
 * (0 = none sent yet; increments after each successful send until all
 * Academy videos have been delivered — one per day).
 */
export const Route = createFileRoute("/api/public/hooks/academy-drip")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");
        const { allVideosOrdered } = await import("@/lib/academie-data");

        const flat = allVideosOrdered();
        const total = flat.length;
        const dayCutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

        const { data: partners, error } = await supabaseAdmin
          .from("partners")
          .select(
            "id, email, contact_first_name, approved_at, academy_drip_index, academy_drip_last_sent_at",
          )
          .eq("status", "approved")
          .is("deleted_at", null)
          .not("approved_at", "is", null)
          .lt("academy_drip_index", total);

        if (error) {
          console.error("[academy-drip] fetch failed", error);
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        let notified = 0;
        let skipped = 0;
        for (const p of partners ?? []) {
          if (!p.email) {
            skipped++;
            continue;
          }
          const lastSent = p.academy_drip_last_sent_at as string | null;
          const anchor = lastSent ?? (p.approved_at as string);
          if (!anchor || anchor > dayCutoff) {
            skipped++;
            continue;
          }
          const idx = Number(p.academy_drip_index ?? 0);
          if (idx >= total) {
            skipped++;
            continue;
          }
          const entry = flat[idx];
          const videoUrl = `https://soumissioncomptable.com/academie/${entry.module.slug}/${entry.video.slug}`;
          const res = await sendTransactionalServer({
            templateName: "academy-drip",
            recipientEmail: p.email,
            idempotencyKey: `academy-drip:${p.id}:${idx}`,
            templateData: {
              partnerFirstName: p.contact_first_name || "Partenaire",
              videoTitle: entry.video.title,
              videoDescription: entry.video.description,
              videoDuration: entry.video.duration,
              videoUrl,
              dayIndex: idx + 1,
              totalVideos: total,
            },
          });
          if (res.success) {
            notified++;
            await supabaseAdmin
              .from("partners")
              .update({
                academy_drip_index: idx + 1,
                academy_drip_last_sent_at: new Date().toISOString(),
              })
              .eq("id", p.id);
          } else {
            skipped++;
          }
        }
        console.log("[academy-drip]", { notified, skipped });
        return Response.json({ ok: true, notified, skipped, total });
      },
    },
  },
});