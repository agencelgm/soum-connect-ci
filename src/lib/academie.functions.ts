import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { TUTORIAL_VIDEO_SLUG } from "./academie-data";

// Résout le partner_id d'un utilisateur (owner ou membre d'équipe).
async function resolvePartnerId(userId: string): Promise<string | null> {
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

export type AcademieProgressEntry = {
  slug: string;
  max_progress: number;
  completed_at: string | null;
};

/**
 * Retourne la progression de l'utilisateur connecté sur toutes les vidéos de
 * l'Académie. Si l'utilisateur n'a pas de cabinet associé (staff LGM par ex.),
 * retourne un tableau vide.
 */
export const getMyAcademieProgress = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AcademieProgressEntry[]> => {
    const partnerId = await resolvePartnerId(context.userId);
    if (!partnerId) return [];

    const out: AcademieProgressEntry[] = [];

    // Vidéo 1 (tutoriel) : la progression vit sur la table partners
    const { data: p } = await supabaseAdmin
      .from("partners")
      .select("tutorial_max_progress, tutorial_watched_at")
      .eq("id", partnerId)
      .maybeSingle();
    if (p) {
      out.push({
        slug: TUTORIAL_VIDEO_SLUG,
        max_progress: Number(p.tutorial_max_progress ?? 0) || 0,
        completed_at: p.tutorial_watched_at ?? null,
      });
    }

    // Autres vidéos : table partner_video_progress
    const { data: rows } = await supabaseAdmin
      .from("partner_video_progress")
      .select("video_slug, max_progress, completed_at")
      .eq("partner_id", partnerId);
    for (const r of rows ?? []) {
      out.push({
        slug: r.video_slug,
        max_progress: Number(r.max_progress ?? 0) || 0,
        completed_at: r.completed_at ?? null,
      });
    }
    return out;
  });

const MarkSchema = z.object({
  video_slug: z.string().trim().min(1).max(120),
  progress: z.number().min(0).max(1),
  completed: z.boolean().optional(),
});

/**
 * Enregistre la progression sur une vidéo de l'Académie. Pour la vidéo n°1
 * (TUTORIAL_VIDEO_SLUG), écrit dans les colonnes tutorial_* de la table
 * partners (compatibilité avec le tutoriel obligatoire existant). Pour toutes
 * les autres vidéos, upsert dans partner_video_progress.
 */
export const markMyAcademieProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => MarkSchema.parse(input))
  .handler(async ({ data, context }) => {
    const partnerId = await resolvePartnerId(context.userId);
    if (!partnerId) return { ok: false, max_progress: 0, completed_at: null };

    if (data.video_slug === TUTORIAL_VIDEO_SLUG) {
      const { data: current } = await supabaseAdmin
        .from("partners")
        .select("tutorial_watched_at, tutorial_max_progress")
        .eq("id", partnerId)
        .maybeSingle();
      const currentMax = Number(current?.tutorial_max_progress ?? 0) || 0;
      const newMax = Math.max(currentMax, data.progress);
      const shouldComplete =
        !current?.tutorial_watched_at && data.completed === true && data.progress >= 0.95;
      const patch: {
        tutorial_max_progress: number;
        tutorial_watched_at?: string;
      } = { tutorial_max_progress: newMax };
      if (shouldComplete) patch.tutorial_watched_at = new Date().toISOString();
      const { error } = await supabaseAdmin
        .from("partners")
        .update(patch)
        .eq("id", partnerId);
      if (error) throw new Error(error.message);
      return {
        ok: true,
        max_progress: newMax,
        completed_at:
          (shouldComplete ? patch.tutorial_watched_at : current?.tutorial_watched_at) ?? null,
      };
    }

    const { data: existing } = await supabaseAdmin
      .from("partner_video_progress")
      .select("id, max_progress, completed_at")
      .eq("partner_id", partnerId)
      .eq("video_slug", data.video_slug)
      .maybeSingle();

    const currentMax = Number(existing?.max_progress ?? 0) || 0;
    const newMax = Math.max(currentMax, data.progress);
    const shouldComplete =
      !existing?.completed_at && data.completed === true && data.progress >= 0.95;
    const completed_at = shouldComplete
      ? new Date().toISOString()
      : (existing?.completed_at ?? null);

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from("partner_video_progress")
        .update({ max_progress: newMax, completed_at })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("partner_video_progress")
        .insert({
          partner_id: partnerId,
          video_slug: data.video_slug,
          max_progress: newMax,
          completed_at,
        });
      if (error) throw new Error(error.message);
    }
    return { ok: true, max_progress: newMax, completed_at };
  });