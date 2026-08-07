import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type FunnelStats = {
  totals: Record<string, number>;
  uniqueSessions: number;
  daily: { day: string; page_view: number; video_play: number; choice_yes: number; choice_no: number; purchase: number }[];
  recent: { created_at: string; event: string; email: string | null; amount_label: string | null }[];
  variants: {
    variant: "A" | "B";
    label: string;
    sessions: number;
    yes: number;
    no: number;
    purchases: number;
  }[];
  people: {
    variant: "A" | "B" | "?";
    name: string | null;
    email: string | null;
    phone: string | null;
    created_at: string;
    choice: "oui" | "non" | null;
    purchased: boolean;
  }[];
};

type Meta = { variant?: string | null; name?: string | null; phone?: string | null };

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
      .select("event, session_id, email, amount_label, created_at, metadata")
      .eq("page", "formation-clients")
      .order("created_at", { ascending: false })
      .limit(20000);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const totals: Record<string, number> = {};
    const sessions = new Set<string>();
    const dailyMap = new Map<string, FunnelStats["daily"][number]>();

    // Agrégation par session pour les listes nominatives A/B.
    type Person = FunnelStats["people"][number];
    const bySession = new Map<string, Person>();
    const purchasedEmails = new Set<string>();

    for (const r of rows) {
      totals[r.event] = (totals[r.event] ?? 0) + 1;
      if (r.session_id) sessions.add(r.session_id);
      if (r.event === "purchase" && r.email) purchasedEmails.add(r.email.toLowerCase());

      if (r.session_id) {
        const m = (r.metadata ?? {}) as Meta;
        let p = bySession.get(r.session_id);
        if (!p) {
          p = {
            variant: m.variant === "A" || m.variant === "B" ? m.variant : "?",
            name: null,
            email: null,
            phone: null,
            created_at: r.created_at,
            choice: null,
            purchased: false,
          };
          bySession.set(r.session_id, p);
        }
        if (p.variant === "?" && (m.variant === "A" || m.variant === "B")) p.variant = m.variant;
        if (!p.name && m.name) p.name = m.name;
        if (!p.phone && m.phone) p.phone = m.phone;
        if (!p.email && r.email) p.email = r.email;
        if (r.created_at > p.created_at) p.created_at = r.created_at;
        if (r.event === "choice_yes") p.choice = "oui";
        else if (r.event === "choice_no" && p.choice === null) p.choice = "non";
      }

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

    const people = [...bySession.values()]
      .map((p) => ({
        ...p,
        purchased: p.email ? purchasedEmails.has(p.email.toLowerCase()) : false,
      }))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));

    const variantMeta: { variant: "A" | "B"; label: string }[] = [
      { variant: "A", label: "Version A — Chariow (academielgm.com)" },
      { variant: "B", label: "Version B — clientsurdemande.com" },
    ];
    const variants = variantMeta.map(({ variant, label }) => {
      const list = people.filter((p) => p.variant === variant);
      return {
        variant,
        label,
        sessions: list.length,
        yes: list.filter((p) => p.choice === "oui").length,
        no: list.filter((p) => p.choice === "non").length,
        purchases: list.filter((p) => p.purchased).length,
      };
    });

    return {
      totals,
      uniqueSessions: sessions.size,
      daily: [...dailyMap.values()].sort((a, b) => (a.day < b.day ? 1 : -1)).slice(0, 30),
      variants,
      people,
      recent: rows.slice(0, 40).map((r) => ({
        created_at: r.created_at,
        event: r.event,
        email: r.email,
        amount_label: r.amount_label,
      })),
    };
  });
