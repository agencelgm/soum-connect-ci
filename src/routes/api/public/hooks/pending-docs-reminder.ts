import { createFileRoute } from "@tanstack/react-router";

/**
 * Daily cron: reminds partners in `pending_review` to send their documents.
 * Sends the first reminder 3 days after signup, then every 3 days after the
 * last reminder — up to 5 reminders total.
 */
export const Route = createFileRoute("/api/public/hooks/pending-docs-reminder")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");
        const { whatsappSupportUrl } = await import("@/lib/contact");

        const cutoff = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();

        const { data: partners, error } = await supabaseAdmin
          .from("partners")
          .select(
            "id, email, contact_first_name, cabinet_name, created_at, docs_reminder_last_sent_at",
          )
          .eq("status", "pending_review")
          .is("deleted_at", null);

        if (error) {
          console.error("[pending-docs-reminder] fetch failed", error);
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        let notified = 0;
        let skipped = 0;
        for (const p of partners ?? []) {
          if (!p.email) {
            skipped++;
            continue;
          }
          const lastSent = p.docs_reminder_last_sent_at as string | null;
          const anchor = lastSent ?? (p.created_at as string);
          if (!anchor || anchor > cutoff) {
            skipped++;
            continue;
          }
          const waUrl = whatsappSupportUrl(
            `Bonjour LGM, voici mes documents pour finaliser mon inscription${
              p.cabinet_name ? ` (${p.cabinet_name})` : ""
            }.`,
          );
          const res = await sendTransactionalServer({
            templateName: "pending-docs-reminder",
            recipientEmail: p.email,
            idempotencyKey: `pending-docs-reminder:${p.id}:${new Date().toISOString().slice(0, 10)}`,
            templateData: {
              partnerFirstName: p.contact_first_name || "Partenaire",
              cabinetName: p.cabinet_name || null,
              whatsappUrl: waUrl,
            },
          });
          if (res.success) {
            notified++;
            await supabaseAdmin
              .from("partners")
              .update({ docs_reminder_last_sent_at: new Date().toISOString() })
              .eq("id", p.id);
          } else {
            skipped++;
          }
        }
        console.log("[pending-docs-reminder]", { notified, skipped });
        return Response.json({ ok: true, notified, skipped });
      },
    },
  },
});