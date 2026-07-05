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
  services: z.array(z.string().min(1).max(100)).min(1).max(20),
  zones: z.array(z.string().min(1).max(100)).min(1).max(40),
  wants_website: z.boolean(),
  wants_logo: z.boolean(),
  contact_role: z.string().trim().min(1).max(100),
});

// Helpers: vérifier que le user a accès (owner ou membre) à ce partner
async function resolvePartnerForUser(userId: string): Promise<string | null> {
  const { data: owned } = await supabaseAdmin
    .from("partners")
    .select("id")
    .eq("profile_id", userId)
    .is("deleted_at", null)
    .maybeSingle();
  if (owned) return owned.id;
  const { data: mem } = await supabaseAdmin
    .from("partner_members")
    .select("partner_id")
    .eq("user_id", userId)
    .maybeSingle();
  return mem?.partner_id ?? null;
}

async function assertOwnerOrAdmin(userId: string, partnerId: string) {
  const { data: owner } = await supabaseAdmin
    .from("partners")
    .select("profile_id")
    .eq("id", partnerId)
    .maybeSingle();
  if (owner?.profile_id === userId) return;
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const rs = (roles ?? []).map((r) => r.role);
  if (rs.includes("admin") || rs.includes("agent")) return;
  throw new Error("Seul le propriétaire peut effectuer cette action.");
}

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
        wants_website: data.wants_website ?? null,
        wants_logo: data.wants_logo ?? null,
        contact_role: data.contact_role,
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
    if (partner) {
      // Notifie l'équipe LGM qu'un nouveau cabinet est en attente de validation.
      // Les crédits de bienvenue (+30) seront octroyés à l'approbation manuelle.
      await emitPartnerEvent(partner, "signup");
    }

    return { id: inserted.id };
  });

// ---------------------- Get my partner ----------------------

export const getMyPartner = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    // 1) Cabinet possédé directement
    let { data, error } = await supabaseAdmin
      .from("partners")
      .select("*")
      .eq("profile_id", userId)
      .is("deleted_at", null)
      .maybeSingle();
    if (error) throw new Error(error.message);
    let isOwner = !!data;
    // Bump last_login_at pour le propriétaire (fire-and-forget)
    if (data) {
      void supabaseAdmin
        .from("partners")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", data.id)
        .then(() => {});
    }
    // 2) Sinon, cabinet auquel ce user est rattaché comme membre
    if (!data) {
      const { data: mem } = await supabaseAdmin
        .from("partner_members")
        .select("partner_id")
        .eq("user_id", userId)
        .maybeSingle();
      if (mem?.partner_id) {
        const { data: p } = await supabaseAdmin
          .from("partners")
          .select("*")
          .eq("id", mem.partner_id)
          .is("deleted_at", null)
          .maybeSingle();
        data = p ?? null;
      }
    }
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
      isOwner,
    };
  });

// ---------------------- Tutorial video progress ----------------------

const TutorialProgressSchema = z.object({
  progress: z.number().min(0).max(1),
  completed: z.boolean().optional(),
});

export const markTutorialProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => TutorialProgressSchema.parse(input))
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) throw new Error("Aucun cabinet associé.");

    const { data: current, error: readErr } = await supabaseAdmin
      .from("partners")
      .select("tutorial_watched_at, tutorial_max_progress")
      .eq("id", partnerId)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);

    const currentMax = current?.tutorial_max_progress ?? 0;
    const newMax = Math.max(currentMax, data.progress);
    const shouldComplete =
      !current?.tutorial_watched_at && data.completed === true && data.progress >= 0.95;

    const patch: Record<string, unknown> = { tutorial_max_progress: newMax };
    if (shouldComplete) patch.tutorial_watched_at = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("partners")
      .update(patch)
      .eq("id", partnerId);
    if (error) throw new Error(error.message);

    return {
      ok: true,
      watched_at:
        (shouldComplete ? patch.tutorial_watched_at : current?.tutorial_watched_at) ?? null,
      max_progress: newMax,
    };
  });

// ---------------------- Update partner info (owner or member) ----------------------

const UpdatePartnerInfoSchema = z.object({
  cabinet_name: z.string().trim().min(2).max(200),
  contact_first_name: z.string().trim().min(1).max(100),
  contact_last_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(40),
  city: z.string().trim().min(2).max(100),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  facebook_url: z.string().trim().max(255).optional().or(z.literal("")),
});

export const updateMyPartnerInfo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => UpdatePartnerInfoSchema.parse(input))
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) throw new Error("Aucun cabinet associé.");
    const { error } = await supabaseAdmin
      .from("partners")
      .update({
        cabinet_name: data.cabinet_name,
        contact_first_name: data.contact_first_name,
        contact_last_name: data.contact_last_name,
        phone: data.phone,
        city: data.city,
        website: data.website || null,
        facebook_url: data.facebook_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", partnerId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------------------- Team members ----------------------

export const listPartnerMembers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) return { members: [] as any[], partnerId: null };
    const { data, error } = await supabaseAdmin
      .from("partner_members")
      .select("id, email, first_name, last_name, created_at, user_id")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return { members: data ?? [], partnerId };
  });

const AddMemberSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
});

export const addPartnerMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AddMemberSchema.parse(input))
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) throw new Error("Aucun cabinet associé.");
    await assertOwnerOrAdmin(context.userId, partnerId);

    const email = data.email.toLowerCase().trim();

    // Trouver un user existant avec cet email
    let userId: string | null = null;
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const { data: created, error: authErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: `${data.first_name} ${data.last_name}` },
      });
      if (authErr || !created.user) throw new Error(authErr?.message ?? "Création du compte échouée");
      userId = created.user.id;
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email,
        full_name: `${data.first_name} ${data.last_name}`,
      });
    }

    // Vérifier qu'il n'est pas déjà membre ou owner d'un autre cabinet
    const { data: alreadyMember } = await supabaseAdmin
      .from("partner_members")
      .select("partner_id")
      .eq("user_id", userId!)
      .maybeSingle();
    if (alreadyMember && alreadyMember.partner_id !== partnerId) {
      throw new Error("Cet utilisateur est déjà membre d'un autre cabinet.");
    }
    const { data: ownsOther } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("profile_id", userId!)
      .is("deleted_at", null)
      .maybeSingle();
    if (ownsOther) {
      throw new Error("Cet utilisateur est déjà propriétaire d'un cabinet.");
    }

    const { error: insErr } = await supabaseAdmin
      .from("partner_members")
      .insert({
        partner_id: partnerId,
        user_id: userId!,
        email,
        first_name: data.first_name,
        last_name: data.last_name,
        invited_by: context.userId,
      });
    if (insErr) {
      if (insErr.code === "23505") throw new Error("Ce membre est déjà ajouté.");
      throw new Error(insErr.message);
    }

    // S'assurer que le rôle "partner" est attribué (best effort)
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId!, role: "partner" })
      .select();

    return { ok: true };
  });

export const removePartnerMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ member_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerForUser(context.userId);
    if (!partnerId) throw new Error("Aucun cabinet associé.");
    await assertOwnerOrAdmin(context.userId, partnerId);
    const { error } = await supabaseAdmin
      .from("partner_members")
      .delete()
      .eq("id", data.member_id)
      .eq("partner_id", partnerId);
    if (error) throw new Error(error.message);
    return { ok: true };
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
    await grantCredits(partner, 30, "signup_bonus", context.userId, "Bonus d'approbation");
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

// ---------------------- Set partner tier (premium / regular) ----------------------

export const setPartnerTier = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        partner_id: z.string().uuid(),
        tier: z.enum(["premium", "regular"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertStaff(context.userId);
    const { error } = await supabaseAdmin
      .from("partners")
      .update({ tier: data.tier, updated_at: new Date().toISOString() })
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
        contact_role: data.contact_role,
        email: data.email,
        phone: data.phone,
        city: data.city,
        website: data.website || null,
        facebook_url: data.facebook_url || null,
        services: data.services,
        zones: data.zones,
        wants_website: data.wants_website,
        wants_logo: data.wants_logo,
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
      await grantCredits(partner, 30, "manual_creation_bonus", context.userId, "Création manuelle");
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

// ---------------------- Admin: dashboard stats ----------------------

export const getAdminDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const [pendingProspectsRes, activePubsRes, pendingPartnersRes, approvedPartnersRes, creditsMonthRes] =
      await Promise.all([
        supabaseAdmin
          .from("prospects")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_qualification"),
        supabaseAdmin
          .from("lead_publications")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabaseAdmin
          .from("partners")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_review")
          .is("deleted_at", null),
        supabaseAdmin
          .from("partners")
          .select("id", { count: "exact", head: true })
          .eq("status", "approved")
          .is("deleted_at", null),
        supabaseAdmin
          .from("chariow_payments")
          .select("credits_granted")
          .eq("status", "credited")
          .gte("processed_at", startOfMonth.toISOString()),
      ]);

    const creditsThisMonth = (creditsMonthRes.data ?? []).reduce(
      (sum, r: any) => sum + (r.credits_granted ?? 0),
      0,
    );

    return {
      pendingProspects: pendingProspectsRes.count ?? 0,
      activePublications: activePubsRes.count ?? 0,
      pendingPartners: pendingPartnersRes.count ?? 0,
      approvedPartners: approvedPartnersRes.count ?? 0,
      creditsThisMonth,
    };
  });

// ---------------------- Admin: Chariow payments history ----------------------

export const listChariowPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.userId);

    const { data: payments, error } = await supabaseAdmin
      .from("chariow_payments")
      .select("id, received_at, processed_at, email, partner_id, credits_granted, amount_label, product_id, status, error_message")
      .order("received_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const partnerIds = Array.from(
      new Set((payments ?? []).map((p) => p.partner_id).filter((x): x is string => !!x)),
    );
    let partnerMap: Record<string, string> = {};
    if (partnerIds.length > 0) {
      const { data: parts } = await supabaseAdmin
        .from("partners")
        .select("id, cabinet_name")
        .in("id", partnerIds);
      partnerMap = Object.fromEntries((parts ?? []).map((p) => [p.id, p.cabinet_name]));
    }

    const rows = (payments ?? []).map((p) => ({
      ...p,
      cabinet_name: p.partner_id ? partnerMap[p.partner_id] ?? null : null,
    }));

    const startOfMonth = new Date();
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);
    const monthIso = startOfMonth.toISOString();

    const creditedRows = rows.filter((r) => r.status === "credited");
    const monthRows = creditedRows.filter(
      (r) => (r.processed_at ?? r.received_at) >= monthIso,
    );
    const totalCreditsAllTime = creditedRows.reduce(
      (s, r) => s + (r.credits_granted ?? 0),
      0,
    );
    const creditsThisMonth = monthRows.reduce(
      (s, r) => s + (r.credits_granted ?? 0),
      0,
    );

    return {
      rows,
      kpis: {
        creditsThisMonth,
        transactionsThisMonth: monthRows.length,
        totalCreditsAllTime,
      },
    };
  });