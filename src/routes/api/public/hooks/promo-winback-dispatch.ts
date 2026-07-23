import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron : envoie l'offre "winback exclusive à 200 FCFA le prospect" aux
 * partenaires sans crédit et sans historique d'achat Chariow.
 *
 * Trois créneaux par jour (matin/après-midi/soir) jusqu'à dimanche minuit
 * UTC. Une seule promotion active à la fois par partenaire (unique index
 * partner_promotions_one_active). Idempotent grâce à promo_email_sends
 * (unique promotion_id + slot + day).
 */

type Slot = "morning" | "afternoon" | "evening";

function pickSlot(now: Date): Slot | null {
  const hour = now.getUTCHours();
  if (hour >= 7 && hour < 11) return "morning";
  if (hour >= 13 && hour < 17) return "afternoon";
  if (hour >= 19 && hour < 22) return "evening";
  return null;
}

function nextSundayMidnightUtc(now: Date): Date {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 0));
  const day = d.getUTCDay(); // 0 = dimanche
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  d.setUTCDate(d.getUTCDate() + daysUntilSunday);
  return d;
}

function templateForSlot(slot: Slot): string {
  return slot === "morning"
    ? "promo-winback-morning"
    : slot === "afternoon"
      ? "promo-winback-afternoon"
      : "promo-winback-evening";
}

export const Route = createFileRoute("/api/public/hooks/promo-winback-dispatch")({
  server: {
    handlers: {
      POST: async () => {
        const now = new Date();
        const slot = pickSlot(now);
        if (!slot) {
          return Response.json({ ok: true, skipped: "no_slot", hour_utc: now.getUTCHours() });
        }

        // Cette promotion ne tourne que jusqu'à dimanche minuit UTC.
        const deadline = nextSundayMidnightUtc(now);
        if (now.getTime() >= deadline.getTime()) {
          return Response.json({ ok: true, skipped: "past_deadline" });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");

        // Cibles : partenaires approved OU paused, 0 crédit, pas d'illimité actif,
        // jamais bouncés, jamais désinscrits (send.server gère la suppression), et
        // aucun paiement Chariow historique (n'ont jamais rechargé).
        const nowIso = now.toISOString();
        const { data: candidates, error } = await supabaseAdmin
          .from("partners")
          .select("id, email, contact_first_name, credits_balance, unlimited_until, status")
          .in("status", ["approved", "paused"])
          .is("deleted_at", null)
          .is("email_bounced_at", null)
          .eq("credits_balance", 0)
          .or(`unlimited_until.is.null,unlimited_until.lt.${nowIso}`)
          .limit(500);
        if (error) {
          console.error("[promo-winback-dispatch] fetch failed", error);
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }

        const eligible: typeof candidates = [];
        for (const p of candidates ?? []) {
          // Filtre : exclure ceux qui ont déjà acheté au moins un pack Chariow.
          const { count } = await supabaseAdmin
            .from("chariow_payments")
            .select("id", { count: "exact", head: true })
            .eq("partner_id", p.id)
            .eq("status", "credited");
          if ((count ?? 0) === 0) eligible.push(p);
        }

        const day = now.toISOString().slice(0, 10);
        const template = templateForSlot(slot);
        const hoursLeft = Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (60 * 60 * 1000)));
        const daysLeft = Math.max(1, Math.ceil(hoursLeft / 24));

        let sent = 0;
        let skipped = 0;
        for (const partner of eligible) {
          // Récupère ou crée la promotion winback active du partenaire.
          const { data: existing } = await supabaseAdmin
            .from("partner_promotions")
            .select("id, expires_at, kind")
            .eq("partner_id", partner.id)
            .is("used_at", null)
            .gt("expires_at", nowIso)
            .maybeSingle();

          let promotionId = existing?.id ?? null;
          if (!promotionId) {
            const { data: created, error: pErr } = await supabaseAdmin
              .from("partner_promotions")
              .insert({
                partner_id: partner.id,
                kind: "zero_credit_winback",
                credit_multiplier: 5,
                unlimited_days: 60,
                ab_variant: "B_price_per_lead",
                expires_at: deadline.toISOString(),
              })
              .select("id")
              .single();
            if (pErr || !created) {
              skipped += 1;
              continue;
            }
            promotionId = created.id;
          }

          // Idempotence : un seul envoi par (promotion, slot, jour).
          const { error: seErr } = await supabaseAdmin
            .from("promo_email_sends")
            .insert({ promotion_id: promotionId, slot_key: `${day}:${slot}`, template_name: template });
          if (seErr) {
            // Doublon (unique) -> déjà envoyé aujourd'hui pour ce slot.
            skipped += 1;
            continue;
          }

          const res = await sendTransactionalServer({
            templateName: template,
            recipientEmail: partner.email,
            idempotencyKey: `promo-winback-${promotionId}-${slot}-${day}`,
            templateData: {
              partnerFirstName: partner.contact_first_name ?? "Partenaire",
              hoursLeft,
              daysLeft,
              rechargeUrl: "https://www.soumissioncomptable.com/recharger",
            },
          });
          if (res.success) sent += 1;
          else skipped += 1;
        }

        return Response.json({
          ok: true,
          slot,
          eligible: eligible.length,
          sent,
          skipped,
          deadline: deadline.toISOString(),
        });
      },
    },
  },
});