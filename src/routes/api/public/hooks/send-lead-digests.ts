import { createFileRoute } from "@tanstack/react-router";

/**
 * Cron toutes les 15 min : envoie le digest quotidien aux partenaires non-premium
 * quand `digest_schedule.scheduled_for <= now()` pour la journée courante.
 * Un unique email par partenaire par jour (règle 1/24h enforced by
 * `daily_notification_state`).
 */
export const Route = createFileRoute("/api/public/hooks/send-lead-digests")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendTransactionalServer } = await import("@/lib/email/send.server");
        const { whatsappReactivationUrl } = await import("@/lib/contact");

        const SITE_ORIGIN = "https://www.soumissioncomptable.com";

        // 1) Digests dus.
        const nowIso = new Date().toISOString();
        const { data: dueSchedules, error: scErr } = await supabaseAdmin
          .from("digest_schedule")
          .select("day, scheduled_for")
          .is("sent_at", null)
          .lte("scheduled_for", nowIso);
        if (scErr) {
          console.error("[send-lead-digests] schedule fetch failed", scErr);
          return Response.json({ ok: false, error: scErr.message }, { status: 500 });
        }
        if (!dueSchedules || dueSchedules.length === 0) {
          return Response.json({ ok: true, processed: 0, sent: 0, skipped: 0 });
        }

        let totalSent = 0;
        let totalSkipped = 0;

        for (const sched of dueSchedules) {
          const day = sched.day as string;

          // 2) Partenaires ayant des pending non envoyés.
          const { data: pendings, error: pErr } = await supabaseAdmin
            .from("pending_lead_notifications")
            .select("id, partner_id, publication_id")
            .is("sent_at", null);
          if (pErr) {
            console.error("[send-lead-digests] pending fetch failed", pErr);
            continue;
          }
          if (!pendings || pendings.length === 0) {
            await supabaseAdmin
              .from("digest_schedule")
              .update({ sent_at: new Date().toISOString() })
              .eq("day", day);
            continue;
          }

          // Groupement par partenaire
          const byPartner = new Map<string, { pendingIds: string[]; pubIds: string[] }>();
          for (const row of pendings) {
            const pid = row.partner_id as string;
            const bucket = byPartner.get(pid) ?? { pendingIds: [], pubIds: [] };
            bucket.pendingIds.push(row.id as string);
            bucket.pubIds.push(row.publication_id as string);
            byPartner.set(pid, bucket);
          }

          // 3) Filtrer partenaires déjà notifiés aujourd'hui (règle 1/24h).
          const { data: alreadyNotified } = await supabaseAdmin
            .from("daily_notification_state")
            .select("partner_id")
            .eq("day", day);
          const notifiedSet = new Set((alreadyNotified ?? []).map((r) => r.partner_id as string));

          // 4) Charger partenaires éligibles (encore actifs, non bounced).
          const partnerIds = [...byPartner.keys()].filter((id) => !notifiedSet.has(id));
          if (partnerIds.length === 0) {
            await supabaseAdmin
              .from("digest_schedule")
              .update({ sent_at: new Date().toISOString() })
              .eq("day", day);
            continue;
          }

          const { data: partners, error: paErr } = await supabaseAdmin
            .from("partners")
            .select("id, email, contact_first_name, cabinet_name, status, credits_balance, unlimited_until, email_bounced_at, deleted_at")
            .in("id", partnerIds);
          if (paErr) {
            console.error("[send-lead-digests] partners fetch failed", paErr);
            continue;
          }

          // 5) Charger les publications à afficher (dédupliquer).
          const allPubIds = [...new Set(pendings.map((r) => r.publication_id as string))];
          const { data: pubs } = await supabaseAdmin
            .from("lead_publications")
            .select("id, prospect_id, service, city, audience, budget, summary")
            .in("id", allPubIds);
          const pubMap = new Map((pubs ?? []).map((p) => [p.id as string, p]));

          // Charger les prénoms prospects pour affichage.
          const prospectIds = [...new Set((pubs ?? []).map((p) => p.prospect_id as string))];
          const { data: prospects } = await supabaseAdmin
            .from("prospects")
            .select("id, full_name, message")
            .in("id", prospectIds);
          const prospectMap = new Map((prospects ?? []).map((p) => [p.id as string, p]));

          for (const p of partners ?? []) {
            if (!p.email || p.email_bounced_at || p.deleted_at) {
              totalSkipped++;
              continue;
            }
            const bucket = byPartner.get(p.id as string);
            if (!bucket) continue;

            const uniquePubIds = [...new Set(bucket.pubIds)];
            const leads = uniquePubIds
              .map((pubId) => {
                const pub = pubMap.get(pubId);
                if (!pub) return null;
                const prospect = prospectMap.get(pub.prospect_id as string);
                const firstName =
                  ((prospect?.full_name as string) || "").trim().split(/\s+/)[0] ||
                  "Un prospect";
                const audienceLabel =
                  pub.audience === "creation"
                    ? "Création d'entreprise"
                    : pub.audience === "gestion"
                      ? "Gestion / comptabilité"
                      : null;
                const message =
                  ((prospect?.message as string) || (pub.summary as string) || "").trim() || null;
                return {
                  prospectFirstName: firstName,
                  service: (pub.service as string) || "Service comptable",
                  city: (pub.city as string) || null,
                  audience: audienceLabel,
                  budget: (pub.budget as string) || null,
                  message,
                  leadUrl: `${SITE_ORIGIN}/connexion?next=${encodeURIComponent(
                    `/marketplace?lead=${pubId}`,
                  )}`,
                };
              })
              .filter(Boolean);

            if (leads.length === 0) {
              totalSkipped++;
              continue;
            }

            const hasUnlimited =
              p.unlimited_until && new Date(p.unlimited_until as string) > new Date();
            const isPaused = p.status === "paused";
            const credits = Number(p.credits_balance ?? 0);

            const res = await sendTransactionalServer({
              templateName: "new-prospects-digest",
              recipientEmail: p.email as string,
              idempotencyKey: `lead-digest:${p.id}:${day}`,
              templateData: {
                partnerFirstName: (p.contact_first_name as string) || "Partenaire",
                isPaused,
                creditsBalance: credits,
                hasUnlimited: Boolean(hasUnlimited),
                unlimitedUntil: hasUnlimited ? (p.unlimited_until as string) : null,
                leads,
                loginUrl: `${SITE_ORIGIN}/connexion?next=${encodeURIComponent("/marketplace")}`,
                rechargeUrl: `${SITE_ORIGIN}/connexion?next=${encodeURIComponent("/recharger")}`,
                whatsappUrl: whatsappReactivationUrl((p.cabinet_name as string) || null),
              },
            });

            if (res.success) {
              totalSent++;
              await supabaseAdmin
                .from("daily_notification_state")
                .upsert(
                  {
                    day,
                    partner_id: p.id as string,
                    first_notified_at: new Date().toISOString(),
                    channel: "digest",
                  },
                  { onConflict: "day,partner_id", ignoreDuplicates: true },
                );
              await supabaseAdmin
                .from("pending_lead_notifications")
                .update({ sent_at: new Date().toISOString() })
                .in("id", bucket.pendingIds);
            } else {
              totalSkipped++;
            }
          }

          await supabaseAdmin
            .from("digest_schedule")
            .update({ sent_at: new Date().toISOString() })
            .eq("day", day);
        }

        console.log("[send-lead-digests]", { totalSent, totalSkipped });
        return Response.json({ ok: true, sent: totalSent, skipped: totalSkipped });
      },
    },
  },
});