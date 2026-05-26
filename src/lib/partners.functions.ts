import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { emitPartnerEvent, fetchPartner, grantCredits } from "./partners.server";

// ---------------------- Helpers ----------------------

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

const PartnerInfoSchema = z.object({
  cabinet_name: z.string().trim().min(2).max(200),
  contact_first_name: z.string().trim().min(1).max(100),
  contact_last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(40),
  city: z.string().trim().min(2).max(100),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  facebook_url: z.string().trim().max(255).optional().or(z.literal("")),
  services: z.array(z.string().min(1).max(100)).max(20).default([]),
  zones: z.array(z.string().min(1).max(100)).max(40).default([]),
});

// ---------------------- Self-service signup ----------------------

export const signupPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => PartnerInfoSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Check no existing partner for this user
    const { data: existing } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("profile_id", userId)
      .maybeSingle();
    if (existing) {
      throw new Error("Vous avez déjà un compte partenaire.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("partners")
      .insert({
        profile_id: userId,
        cabinet_name: data.cabinet_name,
        contact_first_name: data.contact_first_name,
        contact_last_name: data.contact_last_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        website: data.website || null,
        facebook_url: data.facebook_url || null,
        services: data.services,
        zones: data.zones,
        status: "pending_review",
        credits_balance: 0,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Assign 'partner' role
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "partner" })
      .select();

    const partner = await fetchPartner(inserted.id);
    if (partner) await emitPartnerEvent(partner, "signup");

    return { id: inserted.id };
  });

// ---------------------- Get my partner ----------------------

export const getMyPartner = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("must_change_password, full_name, email")
      .eq("id", userId)
      .maybeSingle();
    return {
      partner: data,
      roles: (roles ?? []).map((r) => r.role) as string[],
      mustChangePassword: !!profile?.must_change_password,
      profile: profile ?? null,
    };
  });

// ---------------------- Mark password as changed ----------------------

export const markPasswordChanged = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ must_change_password: false, updated_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------- Admin: list partners ----------------------

export const listPartners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { partners: data ?? [] };
  });

// ---------------------- Approve ----------------------

export const approvePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ partner_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const partner = await fetchPartner(data.partner_id);
    if (!partner) throw new Error("Partenaire introuvable");
    if (partner.status !== "pending_review") throw new Error("Statut invalide");

    const { error } = await supabaseAdmin
      .from("partners")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: context.userId,
      })
      .eq("id", partner.id);
    if (error) throw new Error(error.message);
    partner.status = "approved";
    await grantCredits(partner, 10, "signup_bonus", context.userId, "Bonus d'approbation");
    await emitPartnerEvent(partner, "approved");
    return { ok: true };
  });

// ---------------------- Reject ----------------------

export const rejectPartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ partner_id: z.string().uuid(), reason: z.string().trim().min(2).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const partner = await fetchPartner(data.partner_id);
    if (!partner) throw new Error("Partenaire introuvable");
    const { error } = await supabaseAdmin
      .from("partners")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejected_by: context.userId,
        rejection_reason: data.reason,
      })
      .eq("id", partner.id);
    if (error) throw new Error(error.message);
    partner.status = "rejected";
    partner.rejection_reason = data.reason;
    await emitPartnerEvent(partner, "rejected");
    return { ok: true };
  });

// ---------------------- Pause ----------------------

export const pausePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ partner_id: z.string().uuid(), reason: z.string().trim().min(2).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const partner = await fetchPartner(data.partner_id);
    if (!partner) throw new Error("Partenaire introuvable");
    if (partner.status !== "approved") throw new Error("Seul un compte actif peut être mis en pause");
    const { error } = await supabaseAdmin
      .from("partners")
      .update({
        status: "paused",
        paused_at: new Date().toISOString(),
        paused_by: context.userId,
        pause_reason: data.reason,
      })
      .eq("id", partner.id);
    if (error) throw new Error(error.message);
    partner.status = "paused";
    partner.pause_reason = data.reason;
    await emitPartnerEvent(partner, "paused");
    return { ok: true };
  });

// ---------------------- Reactivate ----------------------

export const reactivatePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ partner_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const partner = await fetchPartner(data.partner_id);
    if (!partner) throw new Error("Partenaire introuvable");
    if (partner.status !== "paused") throw new Error("Statut invalide");
    const { error } = await supabaseAdmin
      .from("partners")
      .update({ status: "approved", paused_at: null, pause_reason: null, paused_by: null })
      .eq("id", partner.id);
    if (error) throw new Error(error.message);
    partner.status = "approved";
    partner.pause_reason = null;
    await emitPartnerEvent(partner, "reactivated");
    return { ok: true };
  });

// ---------------------- Soft delete ----------------------

export const deletePartner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ partner_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("partners")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", data.partner_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------- Manual creation (admin/agent) ----------------------

const ManualCreateSchema = PartnerInfoSchema.extend({
  password: z.string().min(8).max(72),
});

export const createPartnerManually = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ManualCreateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);

    // Create auth user (auto-confirmed)
    const { data: created, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: `${data.contact_first_name} ${data.contact_last_name}` },
    });
    if (authErr || !created.user) throw new Error(authErr?.message ?? "Création compte échouée");
    const newUserId = created.user.id;

    // Ensure profile exists (trigger usually does it, fallback)
    await supabaseAdmin.from("profiles").upsert({
      id: newUserId,
      email: data.email,
      full_name: `${data.contact_first_name} ${data.contact_last_name}`,
    });

    const { data: inserted, error } = await supabaseAdmin
      .from("partners")
      .insert({
        profile_id: newUserId,
        cabinet_name: data.cabinet_name,
        contact_first_name: data.contact_first_name,
        contact_last_name: data.contact_last_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        website: data.website || null,
        facebook_url: data.facebook_url || null,
        services: data.services,
        zones: data.zones,
        status: "approved",
        credits_balance: 0,
        approved_at: new Date().toISOString(),
        approved_by: context.userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    await supabaseAdmin.from("user_roles").insert({ user_id: newUserId, role: "partner" });

    const partner = await fetchPartner(inserted.id);
    if (partner) {
      await grantCredits(partner, 10, "manual_creation_bonus", context.userId, "Création manuelle");
      await emitPartnerEvent(partner, "manual_creation");
    }
    return { id: inserted.id };
  });

// ---------------------- Admin: grant credits manually ----------------------

export const adminGrantCredits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      partner_id: z.string().uuid(),
      amount: z.number().int().min(1).max(1000),
      note: z.string().trim().max(255).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const partner = await fetchPartner(data.partner_id);
    if (!partner) throw new Error("Partenaire introuvable");
    await grantCredits(partner, data.amount, "admin_grant", context.userId, data.note);
    return { ok: true, balance: partner.credits_balance };
  });

// ---------------------- Bootstrap admin (first user only) ----------------------

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: existing, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin")
      .limit(1);
    if (error) throw new Error(error.message);
    if ((existing ?? []).length > 0) {
      throw new Error("Un administrateur existe déjà.");
    }
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insErr) throw new Error(insErr.message);
    return { ok: true };
  });

// ---------------------- Admin: list prospects ----------------------

export const listProspects = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);
    const { data, error } = await supabaseAdmin
      .from("prospects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { prospects: data ?? [] };
  });