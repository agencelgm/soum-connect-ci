import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const InputSchema = z.object({
  days: z.number().int().min(1).max(90).default(30),
});

export type EmailStatsRow = {
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
};

export type EmailStatsResult = {
  totals: {
    total: number;
    sent: number;
    failed: number;
    dlq: number;
    suppressed: number;
    bounced: number;
    complained: number;
    unsubscribed: number;
  };
  byTemplate: Array<{ template: string; sent: number; failed: number; bounced: number }>;
  recent: EmailStatsRow[];
  bounces: Array<{ email: string; reason: string; created_at: string }>;
  unsubscribes: Array<{ email: string; created_at: string }>;
  note: string;
};

export const getEmailStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data, context }): Promise<EmailStatsResult> => {
    // Staff-only
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const { data: isAgent } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "agent",
    });
    if (!isAdmin && !isAgent) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.days * 24 * 3600 * 1000).toISOString();

    // Latest status per message_id (deduped)
    const { data: rows, error } = await supabaseAdmin
      .from("email_send_log")
      .select("message_id, template_name, recipient_email, status, error_message, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);

    const latestByMsg = new Map<string, EmailStatsRow>();
    const noMsgRows: EmailStatsRow[] = [];
    for (const r of rows ?? []) {
      const row = r as EmailStatsRow;
      if (!row.message_id) {
        noMsgRows.push(row);
        continue;
      }
      if (!latestByMsg.has(row.message_id)) latestByMsg.set(row.message_id, row);
    }
    const dedup = [...latestByMsg.values(), ...noMsgRows];

    const totals = {
      total: dedup.length,
      sent: 0,
      failed: 0,
      dlq: 0,
      suppressed: 0,
      bounced: 0,
      complained: 0,
      unsubscribed: 0,
    };
    const tplMap = new Map<string, { sent: number; failed: number; bounced: number }>();
    for (const r of dedup) {
      switch (r.status) {
        case "sent": totals.sent++; break;
        case "failed": totals.failed++; break;
        case "dlq": totals.dlq++; break;
        case "suppressed": totals.suppressed++; break;
        case "bounced": totals.bounced++; break;
        case "complained": totals.complained++; break;
      }
      const cur = tplMap.get(r.template_name) ?? { sent: 0, failed: 0, bounced: 0 };
      if (r.status === "sent") cur.sent++;
      else if (r.status === "failed" || r.status === "dlq") cur.failed++;
      else if (r.status === "bounced") cur.bounced++;
      tplMap.set(r.template_name, cur);
    }

    // Suppression details (bounces + unsubscribes)
    const { data: sups } = await supabaseAdmin
      .from("suppressed_emails")
      .select("email, reason, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(500);
    const bounces = (sups ?? [])
      .filter((s) => s.reason === "bounce" || s.reason === "complaint")
      .map((s) => ({ email: s.email, reason: s.reason, created_at: s.created_at }));
    const unsubscribes = (sups ?? [])
      .filter((s) => s.reason === "unsubscribe")
      .map((s) => ({ email: s.email, created_at: s.created_at }));
    totals.unsubscribed = unsubscribes.length;

    const byTemplate = [...tplMap.entries()]
      .map(([template, v]) => ({ template, ...v }))
      .sort((a, b) => b.sent + b.failed - (a.sent + a.failed));

    return {
      totals,
      byTemplate,
      recent: dedup.slice(0, 100),
      bounces: bounces.slice(0, 100),
      unsubscribes: unsubscribes.slice(0, 100),
      note:
        "Les taux d'ouverture et de clics ne sont pas encore captés (nécessite les webhooks Mailgun opened/clicked). Les rebonds, plaintes et désabonnements sont suivis en temps réel.",
    };
  });