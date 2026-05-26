import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertStaff(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role);
  if (!roles.includes("admin") && !roles.includes("agent")) {
    throw new Error("Forbidden");
  }
  return roles;
}

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const rejectProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      prospect_id: z.string().uuid(),
      reason: z.string().trim().min(2).max(500),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("prospects")
      .update({
        status: "rejected",
        qualification_notes: data.reason,
        qualified_by: context.userId,
        qualified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.prospect_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reactivateProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ prospect_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("prospects")
      .update({
        status: "pending_qualification",
        qualification_notes: null,
        qualified_by: null,
        qualified_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.prospect_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ prospect_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin
      .from("prospects")
      .delete()
      .eq("id", data.prospect_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });