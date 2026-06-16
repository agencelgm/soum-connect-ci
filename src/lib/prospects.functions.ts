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

const nullableText = z
  .string()
  .trim()
  .max(1000)
  .optional()
  .nullable()
  .transform((value) => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

const UpdateProspectSchema = z.object({
  prospect_id: z.string().uuid(),
  full_name: nullableText,
  email: z
    .string()
    .trim()
    .email()
    .max(255)
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((value) => (value && value.trim() ? value.trim() : null)),
  phone: nullableText,
  company_name: nullableText,
  statut: nullableText,
  service: nullableText,
  city: nullableText,
  budget: nullableText,
  legal_form: nullableText,
  message: nullableText,
  audience: z.enum(["creation", "gestion", "unknown"]),
  status: z.enum(["pending_qualification", "qualified", "rejected", "published"]),
  external_notes: nullableText,
  internal_notes: nullableText,
});

function updateRawPayload(
  rawPayload: unknown,
  data: z.infer<typeof UpdateProspectSchema>,
): Record<string, unknown> {
  const raw =
    rawPayload && typeof rawPayload === "object" && !Array.isArray(rawPayload)
      ? { ...(rawPayload as Record<string, unknown>) }
      : {};

  raw.nom = data.full_name ?? "";
  raw.email = data.email ?? "";
  raw.mobile = data.phone ?? "";
  raw.entreprise = data.company_name ?? "";
  raw.statut = data.statut ?? "";
  raw.service = data.service ?? "";
  raw.localisation = data.city ?? "";
  raw.budget = data.budget ?? "";
  raw.legal_form = data.legal_form ?? "";
  raw.formeJuridique = data.legal_form ?? "";
  raw.description = data.message ?? "";
  raw.audience = data.audience;

  return raw;
}

export const updateProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => UpdateProspectSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);

    const { data: current, error: currentError } = await supabaseAdmin
      .from("prospects")
      .select("raw_payload")
      .eq("id", data.prospect_id)
      .maybeSingle();
    if (currentError) throw new Error(currentError.message);
    if (!current) throw new Error("Prospect introuvable");

    const { error } = await supabaseAdmin
      .from("prospects")
      .update({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        statut: data.statut,
        service: data.service,
        city: data.city,
        budget: data.budget,
        legal_form: data.legal_form,
        message: data.message,
        audience: data.audience,
        status: data.status,
        external_notes: data.external_notes,
        internal_notes: data.internal_notes,
        raw_payload: updateRawPayload(current.raw_payload, data) as never,
        edited_by: context.userId,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.prospect_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const rejectProspect = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        prospect_id: z.string().uuid(),
        reason: z.string().trim().min(2).max(500),
      })
      .parse(input),
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
    const { error } = await supabaseAdmin.from("prospects").delete().eq("id", data.prospect_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
