import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_me",
  title: "Récupérer mon profil",
  description:
    "Retourne l'utilisateur connecté (email, rôles LGM, et le cabinet partenaire associé le cas échéant).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Non authentifié" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();

    const [{ data: roles }, { data: partner }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId!),
      supabase
        .from("partners")
        .select("id, cabinet_name, status, city, credits_balance, tier")
        .eq("profile_id", userId!)
        .is("deleted_at", null)
        .maybeSingle(),
    ]);

    const payload = {
      user_id: userId,
      email: ctx.getUserEmail?.() ?? null,
      roles: (roles ?? []).map((r) => r.role),
      partner: partner ?? null,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});