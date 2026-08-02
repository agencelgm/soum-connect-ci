import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type FunnelStats = {
  totals: Record<string, number>;
  uniqueSessions: number;
  daily: { day: string; page_view: number; video_play: number; choice_yes: number; choice_no: number; purchase: number }[];
  recent: { created_at: string; event: string; email: string | null; amount_label: string | null }[];
};

export const getFormationFunnelStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FunnelStats> => {
    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (rolesError) throw new Error(rolesError.message);
    const list = (roles ?? []).map((r) => r.role);
    if (!list.includes("admin") && !list.includes("agent")) throw new Error("Forbidden");

    const { data, error } = await supabaseAdmin
      .from("funnel_events")
      .select("event, session_id, email, amount_label, created_at")
      .eq("page", "formation-clients")
      .order("created_at", { ascending: false })
      .limit(20000);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const totals: Record<string, number> = {};
    const sessions = new Set<string>();
    const dailyMap = new Map<string, FunnelStats["daily"][number]>();

    for (const r of rows) {
      totals[r.event] = (totals[r.event] ?? 0) + 1;
      if (r.session_id) sessions.add(r.session_id);
      const day = String(r.created_at).slice(0, 10);
      let d = dailyMap.get(day);
      if (!d) {
        d = { day, page_view: 0, video_play: 0, choice_yes: 0, choice_no: 0, purchase: 0 };
        dailyMap.set(day, d);
      }
      if (r.event === "page_view") d.page_view++;
      else if (r.event === "video_play") d.video_play++;
      else if (r.event === "choice_yes") d.choice_yes++;
      else if (r.event === "choice_no") d.choice_no++;
      else if (r.event === "purchase") d.purchase++;
    }

    return {
      totals,
      uniqueSessions: sessions.size,
      daily: [...dailyMap.values()].sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, 30),
      recent: rows.slice(0, 40).map((r) => ({
        created_at: r.created_at,
        event: r.event,
        email: r.email,
        amount_label: r.amount_label,
      })),
    };
  });
