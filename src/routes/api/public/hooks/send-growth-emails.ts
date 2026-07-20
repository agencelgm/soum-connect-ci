import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron quotidien 09h Abidjan : envoie les brouillons growth dont
 * `scheduled_for <= now()` et `sent_at IS NULL` aux partenaires éligibles.
 * Idempotence par `growth_email_sends (batch_id, partner_id)`.
 *
 * Cette séquence est indépendante de la règle 1/24h des notifications prospects
 * (comm produit, pas transactionnel prospect).
 */
export const Route = createFileRoute("/api/public/hooks/send-growth-emails")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");

        const nowIso = new Date().toISOString();
        const { data: batches, error: bErr } = await supabaseAdmin
          .from("growth_email_batches")
          .select("id, subject, preview, body_markdown, cta_label, cta_url")
          .is("sent_at", null)
          .lte("scheduled_for", nowIso);
        if (bErr) {
          console.error("[send-growth-emails] batches fetch failed", bErr);
          return Response.json({ ok: false, error: bErr.message }, { status: 500 });
        }
        if (!batches || batches.length === 0) {
          return Response.json({ ok: true, processed: 0, sent: 0 });
        }

        let totalSent = 0;
        let totalSkipped = 0;

        for (const batch of batches) {
          const { data: partners, error: pErr } = await supabaseAdmin
            .from("partners")
            .select("id, email, contact_first_name")
            .in("status", ["approved", "paused"])
            .is("deleted_at", null)
            .is("email_bounced_at", null);
          if (pErr) {
            console.error("[send-growth-emails] partners fetch failed", pErr);
            continue;
          }

          const { data: already } = await supabaseAdmin
            .from("growth_email_sends")
            .select("partner_id")
            .eq("batch_id", batch.id);
          const sentSet = new Set((already ?? []).map((r) => r.partner_id as string));

          for (const p of partners ?? []) {
            if (!p.email || sentSet.has(p.id as string)) {
              totalSkipped++;
              continue;
            }
            const res = await sendTransactionalServer({
              templateName: "growth-sales-email",
              recipientEmail: p.email as string,
              idempotencyKey: `growth:${batch.id}:${p.id}`,
              templateData: {
                partnerFirstName: (p.contact_first_name as string) || "Partenaire",
                subject: batch.subject,
                preview: batch.preview,
                bodyMarkdown: batch.body_markdown,
                ctaLabel: batch.cta_label,
                ctaUrl: batch.cta_url,
              },
            });
            if (res.success) {
              totalSent++;
              await supabaseAdmin
                .from("growth_email_sends")
                .upsert(
                  { batch_id: batch.id, partner_id: p.id as string },
                  { onConflict: "batch_id,partner_id", ignoreDuplicates: true },
                );
            } else {
              totalSkipped++;
            }
          }

          await supabaseAdmin
            .from("growth_email_batches")
            .update({ sent_at: new Date().toISOString() })
            .eq("id", batch.id);
        }

        console.log("[send-growth-emails]", { batches: batches.length, totalSent, totalSkipped });
        return Response.json({ ok: true, batches: batches.length, sent: totalSent, skipped: totalSkipped });
      },
    },
  },
});