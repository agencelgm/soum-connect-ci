import { createFileRoute } from "@tanstack/react-router";

/**
 * Hourly cron: computes bounce/complaint rates over the last 24h,
 * globally and per template (deduplicated by message_id). Emails admins
 * when either metric exceeds THRESHOLD_PCT (with min volume MIN_VOLUME).
 * Deduped for 12h per (scope, metric) via public.email_alert_state.
 */
export const Route = createFileRoute("/api/public/hooks/email-health-alert")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");

        const THRESHOLD_PCT = 3;
        const MIN_VOLUME = 20;
        const WINDOW_HOURS = 24;
        const DEDUP_HOURS = 12;
        const DASHBOARD_URL = "https://www.soumissioncomptable.com/admin?tab=emails";

        const since = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000).toISOString();

        // Pull recent log rows (latest status per message_id).
        const { data: rows, error } = await supabaseAdmin
          .from("email_send_log")
          .select("message_id, template_name, status, created_at")
          .gte("created_at", since)
          .not("message_id", "is", null)
          .order("created_at", { ascending: false })
          .limit(5000);

        if (error) {
          console.error("[email-health-alert] fetch failed", error);
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        // Deduplicate by message_id (keep latest by created_at desc, already sorted).
        const seen = new Map<string, { template: string; status: string }>();
        for (const r of rows ?? []) {
          if (!r.message_id || seen.has(r.message_id)) continue;
          seen.set(r.message_id, {
            template: r.template_name ?? "unknown",
            status: r.status ?? "unknown",
          });
        }

        type Agg = { volume: number; bounced: number; complained: number };
        const perTemplate = new Map<string, Agg>();
        const global: Agg = { volume: 0, bounced: 0, complained: 0 };
        for (const { template, status } of seen.values()) {
          const finalized = status === "sent" || status === "bounced" || status === "complained";
          if (!finalized) continue;
          const agg = perTemplate.get(template) ?? { volume: 0, bounced: 0, complained: 0 };
          agg.volume++;
          global.volume++;
          if (status === "bounced") {
            agg.bounced++;
            global.bounced++;
          } else if (status === "complained") {
            agg.complained++;
            global.complained++;
          }
          perTemplate.set(template, agg);
        }

        type Breach = {
          scope: string;
          metric: "bounce" | "complaint";
          rate: number;
          volume: number;
          failed: number;
        };
        const candidates: Breach[] = [];
        const consider = (scope: string, a: Agg) => {
          if (a.volume < MIN_VOLUME) return;
          const br = (a.bounced / a.volume) * 100;
          const cr = (a.complained / a.volume) * 100;
          if (br > THRESHOLD_PCT)
            candidates.push({ scope, metric: "bounce", rate: br, volume: a.volume, failed: a.bounced });
          if (cr > THRESHOLD_PCT)
            candidates.push({ scope, metric: "complaint", rate: cr, volume: a.volume, failed: a.complained });
        };
        consider("GLOBAL", global);
        for (const [tpl, a] of perTemplate) consider(tpl, a);

        if (candidates.length === 0) {
          return Response.json({ ok: true, breaches: 0, checked: seen.size });
        }

        // Dedup against email_alert_state (12h window).
        const dedupSince = new Date(Date.now() - DEDUP_HOURS * 3600 * 1000).toISOString();
        const { data: recentAlerts } = await supabaseAdmin
          .from("email_alert_state")
          .select("scope, metric, last_alert_at")
          .gte("last_alert_at", dedupSince);
        const suppressed = new Set(
          (recentAlerts ?? []).map((r: any) => `${r.scope}::${r.metric}`),
        );
        const breaches = candidates.filter(
          (b) => !suppressed.has(`${b.scope}::${b.metric}`),
        );

        if (breaches.length === 0) {
          return Response.json({ ok: true, breaches: 0, suppressed: candidates.length });
        }

        // Resolve admin recipients (auth.users where user_roles.role='admin').
        const { data: adminRoles } = await supabaseAdmin
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");
        const adminIds = (adminRoles ?? []).map((r: any) => r.user_id as string);
        const recipients: string[] = [];
        for (const uid of adminIds) {
          const { data } = await supabaseAdmin.auth.admin.getUserById(uid);
          const em = data?.user?.email;
          if (em) recipients.push(em);
        }
        if (recipients.length === 0) {
          console.warn("[email-health-alert] no admin recipients");
          return Response.json({ ok: true, breaches: breaches.length, notified: 0 });
        }

        // Send one email per admin. Idempotency key rotates per hour to allow
        // legitimate re-alerts once dedup window is over.
        const hourStamp = new Date().toISOString().slice(0, 13);
        let notified = 0;
        for (const to of recipients) {
          const key = `email-health-alert:${hourStamp}:${to}`;
          const res = await sendTransactionalServer({
            templateName: "email-health-alert",
            recipientEmail: to,
            idempotencyKey: key,
            templateData: {
              breaches,
              windowHours: WINDOW_HOURS,
              threshold: THRESHOLD_PCT,
              dashboardUrl: DASHBOARD_URL,
            },
          });
          if (res.success) notified++;
        }

        // Record alert state (upsert one row per breach).
        const nowIso = new Date().toISOString();
        await supabaseAdmin.from("email_alert_state").upsert(
          breaches.map((b) => ({
            scope: b.scope,
            metric: b.metric,
            last_alert_at: nowIso,
            last_rate: Number(b.rate.toFixed(2)),
            last_volume: b.volume,
          })),
          { onConflict: "scope,metric" },
        );

        return Response.json({ ok: true, breaches: breaches.length, notified, recipients: recipients.length });
      },
    },
  },
});