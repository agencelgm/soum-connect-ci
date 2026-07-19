import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTransactionalServer } from "@/lib/email/send.server";

const SITE_ORIGIN = "https://soumissioncomptable.com";

function deepLoginUrl(publicationId: string) {
  const next = `/marketplace?lead=${encodeURIComponent(publicationId)}`;
  return `${SITE_ORIGIN}/connexion?next=${encodeURIComponent(next)}`;
}

/**
 * When a prospect is published as a lead, notify every approved partner by email.
 * Uses a deterministic idempotency key per (publication, partner) so retries don't duplicate.
 */
export async function notifyPartnersNewProspect(
  prospectId: string,
  publicationId: string,
): Promise<{ notified: number; skipped: number }> {
  const { data: prospect, error: pErr } = await supabaseAdmin
    .from("prospects")
    .select("full_name, service, city, message")
    .eq("id", prospectId)
    .maybeSingle();
  if (pErr || !prospect) {
    console.error("[notifyPartnersNewProspect] prospect fetch failed", pErr);
    return { notified: 0, skipped: 0 };
  }

  const prospectFirstName = (prospect.full_name || "").trim().split(/\s+/)[0] || "Un prospect";
  const prospectMessage = (prospect.message || "").trim() || null;
  const loginUrl = deepLoginUrl(publicationId);

  const { data: partners, error: paErr } = await supabaseAdmin
    .from("partners")
    .select("id, email, contact_first_name, status, credits_balance, unlimited_until")
    .in("status", ["approved", "paused"])
    .is("deleted_at", null);
  if (paErr) {
    console.error("[notifyPartnersNewProspect] partners fetch failed", paErr);
    return { notified: 0, skipped: 0 };
  }

  let notified = 0;
  let skipped = 0;
  for (const p of partners ?? []) {
    if (!p.email) {
      skipped++;
      continue;
    }
    const hasUnlimited =
      p.unlimited_until && new Date(p.unlimited_until as string) > new Date();
    const credits = Number(p.credits_balance ?? 0);
    const isPaused = p.status === "paused";
    // Note: on notifie AUSSI les partenaires en pause avec 0 crédits —
    // ces emails les encouragent à recharger et à revenir sur le service.
    const templateName = isPaused ? "new-prospect-paused" : "new-prospect";
    const res = await sendTransactionalServer({
      templateName,
      recipientEmail: p.email,
      idempotencyKey: `${templateName}:${publicationId}:${p.id}`,
      templateData: {
        partnerFirstName: p.contact_first_name || "Partenaire",
        prospectFirstName,
        service: prospect.service || "un service comptable",
        city: prospect.city || null,
        message: prospectMessage,
        creditsBalance: credits,
        hasUnlimited: Boolean(hasUnlimited),
        unlimitedUntil: hasUnlimited ? (p.unlimited_until as string) : null,
        loginUrl,
        rechargeUrl: `${SITE_ORIGIN}/connexion?next=${encodeURIComponent("/recharger")}`,
      },
    });
    if (res.success) notified++;
    else skipped++;
  }
  console.log("[notifyPartnersNewProspect]", { publicationId, notified, skipped });
  return { notified, skipped };
}