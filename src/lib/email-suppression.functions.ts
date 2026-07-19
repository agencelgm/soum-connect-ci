import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export type SuppressionRow = {
  id: string;
  email: string;
  reason: "bounce" | "complaint" | "unsubscribe";
  metadata: Record<string, unknown> | null;
  created_at: string;
};

async function assertStaff(context: any) {
  const { data: isAdmin } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  const { data: isAgent } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "agent",
  });
  if (!isAdmin && !isAgent) throw new Error("Forbidden");
  return { isAdmin: !!isAdmin };
}

export const listSuppressions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        search: z.string().trim().optional(),
        reason: z.enum(["all", "bounce", "complaint", "unsubscribe"]).default("all"),
        limit: z.number().int().min(1).max(1000).default(500),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("suppressed_emails")
      .select("id, email, reason, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.reason !== "all") q = q.eq("reason", data.reason);
    if (data.search) q = q.ilike("email", `%${data.search}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);

    // Counts by reason (independent of filters)
    const { data: all, error: cErr } = await supabaseAdmin
      .from("suppressed_emails")
      .select("reason");
    if (cErr) throw new Error(cErr.message);
    const counts = { bounce: 0, complaint: 0, unsubscribe: 0, total: 0 };
    for (const r of all ?? []) {
      counts.total++;
      if (r.reason === "bounce") counts.bounce++;
      else if (r.reason === "complaint") counts.complaint++;
      else if (r.reason === "unsubscribe") counts.unsubscribe++;
    }

    return { rows: (rows ?? []) as SuppressionRow[], counts };
  });

export const checkSuppression = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().email() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase().trim();
    const { data: row, error } = await supabaseAdmin
      .from("suppressed_emails")
      .select("id, email, reason, metadata, created_at")
      .eq("email", email)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { suppressed: !!row, row: (row ?? null) as SuppressionRow | null };
  });

export const addSuppression = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        reason: z.enum(["bounce", "complaint", "unsubscribe"]),
        note: z.string().trim().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase().trim();
    const { error } = await supabaseAdmin
      .from("suppressed_emails")
      .upsert(
        {
          email,
          reason: data.reason,
          metadata: {
            source: "admin_manual",
            added_by: context.userId,
            note: data.note ?? null,
            added_at: new Date().toISOString(),
          },
        },
        { onConflict: "email" },
      );
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const removeSuppression = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ email: z.string().email() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { isAdmin } = await assertStaff(context);
    if (!isAdmin) throw new Error("Admin uniquement");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.toLowerCase().trim();
    const { error } = await supabaseAdmin
      .from("suppressed_emails")
      .delete()
      .eq("email", email);
    if (error) throw new Error(error.message);
    return { success: true };
  });