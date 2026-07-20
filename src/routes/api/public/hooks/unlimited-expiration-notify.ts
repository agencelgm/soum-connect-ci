import { createFileRoute } from "@tanstack/react-router";

/**
 * Daily cron endpoint (pg_cron -> pg_net) that emails partners whose
 * `unlimited_until` is 7 days or 1 day away. Idempotent per (partner, bucket).
 */
export const Route = createFileRoute("/api/public/hooks/unlimited-expiration-notify")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");

        const RENEW_URL = "https://www.soumissioncomptable.com/recharger";
        // Reminders at J-7, J-5, J-3, J-1, and le jour même (J-0).
        const buckets: Array<{ days: number }> = [
          { days: 7 },
          { days: 5 },
          { days: 3 },
          { days: 1 },
          { days: 0 },
        ];
        const results: Array<{ days: number; notified: number; skipped: number }> = [];

        for (const b of buckets) {
          // Match partners whose unlimited_until falls within the target UTC day.
          const target = new Date();
          target.setUTCHours(0, 0, 0, 0);
          target.setUTCDate(target.getUTCDate() + b.days);
          const dayStart = target.toISOString();
          const dayEnd = new Date(target.getTime() + 24 * 3600 * 1000).toISOString();

          const { data: partners, error } = await supabaseAdmin
            .from("partners")
            .select("id, email, contact_first_name, unlimited_until")
            .eq("status", "approved")
            .is("deleted_at", null)
            .is("email_bounced_at", null)
            .gte("unlimited_until", dayStart)
            .lt("unlimited_until", dayEnd);

          if (error) {
            console.error("[unlimited-expiration-notify] fetch failed", error);
            results.push({ days: b.days, notified: 0, skipped: 0 });
            continue;
          }

          let notified = 0;
          let skipped = 0;
          for (const p of partners ?? []) {
            if (!p.email || !p.unlimited_until) {
              skipped++;
              continue;
            }
            // Idempotency: one email per partner per (bucket, expiration date).
            const key = `unlimited-expiring:${p.id}:${b.days}:${p.unlimited_until}`;
            const res = await sendTransactionalServer({
              templateName: "unlimited-expiring",
              recipientEmail: p.email,
              idempotencyKey: key,
              templateData: {
                partnerFirstName: p.contact_first_name || "Partenaire",
                daysLeft: b.days,
                expiresAt: p.unlimited_until,
                renewUrl: RENEW_URL,
              },
            });
            if (res.success) notified++;
            else skipped++;
          }
          results.push({ days: b.days, notified, skipped });
        }

        return Response.json({ ok: true, results });
      },
    },
  },
});