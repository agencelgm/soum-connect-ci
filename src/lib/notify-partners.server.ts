import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalServer } from "@/lib/email/send.server";
import { whatsappReactivationUrl } from "@/lib/contact";

const SITE_ORIGIN = "https://www.soumissioncomptable.com";

function deepLoginUrl(publicationId: string) {
  const next = `/marketplace?lead=${encodeURIComponent(publicationId)}`;
  return `${SITE_ORIGIN}/connexion?next=${encodeURIComponent(next)}`;
}

function abidjanToday(): string {
  // Africa/Abidjan is UTC+0 year-round; using UTC date is exact.
  return new Date().toISOString().slice(0, 10);
}

/**
 * When a prospect is published as a lead:
 *  - Premium / Illimité: envoi immédiat, mais UNE seule fois par jour et par partenaire.
 *  - Autres partenaires: on bufferise dans `pending_lead_notifications` et un cron
 *    envoie un unique digest 3h après la première approbation du jour.
 * Résultat: 1 email par partenaire par période de 24h maximum.
 */
export async function notifyPartnersNewProspect(
  prospectId: string,
  publicationId: string,
): Promise<{ notified: number; skipped: number }> {
  const { data: prospect, error: pErr } = await supabaseAdmin
    .from("prospects")
    .select("full_name, service, city, message, budget, audience")
    .eq("id", prospectId)
    .maybeSingle();
  if (pErr || !prospect) {
    console.error("[notifyPartnersNewProspect] prospect fetch failed", pErr);
    return { notified: 0, skipped: 0 };
  }

  const prospectFirstName = (prospect.full_name || "").trim().split(/\s+/)[0] || "Un prospect";
  const prospectMessage = (prospect.message || "").trim() || null;
  const audienceLabel =
    prospect.audience === "creation"
      ? "Création d'entreprise"
      : prospect.audience === "gestion"
        ? "Gestion / comptabilité"
        : null;
  const budgetLabel = (prospect.budget || "").trim() || null;
  const loginUrl = deepLoginUrl(publicationId);

  const { data: partners, error: paErr } = await supabaseAdmin
    .from("partners")
    .select("id, email, contact_first_name, status, tier, credits_balance, unlimited_until")
    .in("status", ["approved", "paused"])
    .is("deleted_at", null)
    .is("email_bounced_at", null);
  if (paErr) {
    console.error("[notifyPartnersNewProspect] partners fetch failed", paErr);
    return { notified: 0, skipped: 0 };
  }

  const day = abidjanToday();
  const now = new Date();

  // 1) Assurer une entrée digest_schedule pour aujourd'hui (T+3h après cette approbation).
  const scheduledFor = new Date(now.getTime() + 3 * 3600 * 1000).toISOString();
  await supabaseAdmin
    .from("digest_schedule")
    .upsert(
      {
        day,
        first_publication_at: now.toISOString(),
        scheduled_for: scheduledFor,
      },
      { onConflict: "day", ignoreDuplicates: true },
    );

  // 2) Charger les partenaires déjà notifiés aujourd'hui pour appliquer la règle 1/24h.
  const { data: alreadyNotified } = await supabaseAdmin
    .from("daily_notification_state")
    .select("partner_id")
    .eq("day", day);
  const notifiedToday = new Set((alreadyNotified ?? []).map((r) => r.partner_id as string));

  let notified = 0;
  let skipped = 0;
  const bufferInserts: Array<{ partner_id: string; publication_id: string }> = [];

  for (const p of partners ?? []) {
    if (!p.email) {
      skipped++;
      continue;
    }
    const hasUnlimited =
      p.unlimited_until && new Date(p.unlimited_until as string) > new Date();
    const isPremium = p.tier === "premium" || Boolean(hasUnlimited);

    if (isPremium) {
      // Premium / Illimité : email immédiat, mais 1x par jour maximum.
      if (notifiedToday.has(p.id)) {
        skipped++;
        continue;
      }
      const res = await sendTransactionalServer({
        templateName: "new-prospect",
        recipientEmail: p.email,
        idempotencyKey: `new-prospect:${publicationId}:${p.id}`,
        templateData: {
          partnerFirstName: p.contact_first_name || "Partenaire",
          prospectFirstName,
          service: prospect.service || "un service comptable",
          city: prospect.city || null,
          message: prospectMessage,
          budget: budgetLabel,
          audience: audienceLabel,
          loginUrl,
        },
      });
      if (res.success) {
        notified++;
        notifiedToday.add(p.id);
        await supabaseAdmin
          .from("daily_notification_state")
          .upsert(
            { day, partner_id: p.id, first_notified_at: new Date().toISOString(), channel: "premium_instant" },
            { onConflict: "day,partner_id", ignoreDuplicates: true },
          );
      } else {
        skipped++;
      }
    } else {
      // Autres partenaires : bufferisation, envoi via cron dans le digest.
      bufferInserts.push({ partner_id: p.id, publication_id: publicationId });
    }
  }

  if (bufferInserts.length > 0) {
    const { error: bufErr } = await supabaseAdmin
      .from("pending_lead_notifications")
      .upsert(bufferInserts, { onConflict: "partner_id,publication_id", ignoreDuplicates: true });
    if (bufErr) {
      console.error("[notifyPartnersNewProspect] buffer insert failed", bufErr);
    }
  }

  console.log("[notifyPartnersNewProspect]", {
    publicationId,
    notifiedPremium: notified,
    bufferedForDigest: bufferInserts.length,
    skipped,
  });
  return { notified, skipped };
}

// Ré-export utilitaire (utilisé par le cron pour l'URL WhatsApp de réactivation)
export { whatsappReactivationUrl };