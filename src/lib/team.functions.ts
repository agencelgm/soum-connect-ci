import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pwd = "";
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < bytes.length; i++) pwd += chars[bytes[i] % chars.length];
  return pwd + "!2";
}

async function countAdmins(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("user_id", { count: "exact", head: true })
    .eq("role", "admin");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);

    const { data: rolesRows, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .in("role", ["admin", "agent"]);
    if (rolesErr) throw new Error(rolesErr.message);

    const userIds = Array.from(new Set((rolesRows ?? []).map((r) => r.user_id)));
    if (userIds.length === 0) return { members: [], me: context.userId };

    const { data: profiles, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, must_change_password, created_at")
      .in("id", userIds);
    if (profErr) throw new Error(profErr.message);

    // Fetch suspension info from auth.users via Admin API (one call per user — small N).
    const suspensionMap = new Map<string, boolean>();
    await Promise.all(
      userIds.map(async (uid) => {
        const { data } = await supabaseAdmin.auth.admin.getUserById(uid);
        const banned = (data?.user as { banned_until?: string | null } | undefined)?.banned_until;
        const isSuspended = !!banned && new Date(banned).getTime() > Date.now();
        suspensionMap.set(uid, isSuspended);
      }),
    );

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const rolesByUser = new Map<string, string[]>();
    for (const r of rolesRows ?? []) {
      if (!rolesByUser.has(r.user_id)) rolesByUser.set(r.user_id, []);
      rolesByUser.get(r.user_id)!.push(r.role);
    }

    const members = userIds.map((uid) => {
      const p = profileMap.get(uid);
      const userRoles = rolesByUser.get(uid) ?? [];
      return {
        user_id: uid,
        email: p?.email ?? "",
        full_name: p?.full_name ?? "",
        role: userRoles.includes("admin") ? "admin" : "agent",
        must_change_password: !!p?.must_change_password,
        suspended: suspensionMap.get(uid) ?? false,
        created_at: p?.created_at ?? null,
      };
    });

    members.sort((a, b) => a.email.localeCompare(b.email));
    return { members, me: context.userId };
  });

const AddMemberSchema = z.object({
  email: z.string().trim().email().max(255),
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  role: z.enum(["admin", "agent"]),
});

export const addTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => AddMemberSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const tempPassword = generateTempPassword();
    const fullName = `${data.first_name} ${data.last_name}`;

    const { data: created, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (authErr || !created.user) throw new Error(authErr?.message ?? "Création échouée");
    const newUserId = created.user.id;

    await supabaseAdmin.from("profiles").upsert({
      id: newUserId,
      email: data.email,
      full_name: fullName,
      must_change_password: true,
    });

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUserId, role: data.role });
    if (roleErr) throw new Error(roleErr.message);

    return { user_id: newUserId, temp_password: tempPassword };
  });

export const updateTeamRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["admin", "agent"]),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId && data.role !== "admin") {
      throw new Error("Vous ne pouvez pas vous rétrograder vous-même.");
    }
    if (data.role === "agent") {
      const adminCount = await countAdmins();
      const { data: isAdmin } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("user_id", data.user_id)
        .eq("role", "admin")
        .maybeSingle();
      if (isAdmin && adminCount <= 1) {
        throw new Error("Impossible : c'est le dernier administrateur.");
      }
    }
    // Remove existing staff roles and insert the new one
    const { error: delErr } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.user_id)
      .in("role", ["admin", "agent"]);
    if (delErr) throw new Error(delErr.message);
    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.user_id, role: data.role });
    if (insErr) throw new Error(insErr.message);
    return { ok: true };
  });

export const resetTeamPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const tempPassword = generateTempPassword();
    const { error: authErr } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      password: tempPassword,
    });
    if (authErr) throw new Error(authErr.message);
    await supabaseAdmin
      .from("profiles")
      .update({ must_change_password: true, updated_at: new Date().toISOString() })
      .eq("id", data.user_id);
    return { temp_password: tempPassword };
  });

export const suspendTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId) {
      throw new Error("Vous ne pouvez pas vous suspendre vous-même.");
    }
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration: "876000h", // ~100 ans
    } as { ban_duration: string });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const unsuspendTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration: "none",
    } as { ban_duration: string });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ user_id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    if (data.user_id === context.userId) {
      throw new Error("Vous ne pouvez pas vous supprimer vous-même.");
    }
    const { data: target } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user_id)
      .eq("role", "admin")
      .maybeSingle();
    if (target) {
      const adminCount = await countAdmins();
      if (adminCount <= 1) throw new Error("Impossible : c'est le dernier administrateur.");
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
