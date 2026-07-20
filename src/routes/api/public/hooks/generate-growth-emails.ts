import { createFileRoute } from "@tanstack/react-router";

/**
 * Génère 3 emails de vente (lundi / mercredi / vendredi) pour la semaine courante
 * via Lovable AI Gateway. Supprime les brouillons non envoyés des semaines
 * précédentes pour ne pas accumuler.
 *
 * Cron : lundi 06h UTC (= 06h Africa/Abidjan).
 */
export const Route = createFileRoute("/api/public/hooks/generate-growth-emails")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json({ ok: false, error: "missing_lovable_api_key" }, { status: 500 });
        }

        // Semaine courante (lundi Africa/Abidjan = UTC+0)
        const now = new Date();
        const dow = now.getUTCDay(); // 0=dim, 1=lun, ...
        const daysSinceMonday = (dow + 6) % 7;
        const monday = new Date(now);
        monday.setUTCDate(now.getUTCDate() - daysSinceMonday);
        monday.setUTCHours(0, 0, 0, 0);
        const weekStart = monday.toISOString().slice(0, 10);

        // Nettoyage : supprimer brouillons non envoyés des semaines antérieures.
        await supabaseAdmin
          .from("growth_email_batches")
          .delete()
          .lt("week_start", weekStart)
          .is("sent_at", null);

        // Contexte dynamique : nb prospects publiés sur les 7 derniers jours.
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();
        const { count: prospectsThisWeek } = await supabaseAdmin
          .from("lead_publications")
          .select("id", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo);

        const nbProspects = prospectsThisWeek ?? 0;

        const systemPrompt = `Tu es un copywriter B2B expert pour Soumission Comptable, une marketplace de prospects qualifiés pour cabinets comptables en Côte d'Ivoire. Tu écris en français Côte d'Ivoire (professionnel, chaleureux, direct, sans argot).

RÈGLES ABSOLUES :
- N'utilise JAMAIS le mot "crédit" ni "crédits". Parle toujours en "prospects qualifiés".
- Ne mentionne JAMAIS "SAS", "SASU", "auto-entrepreneur", "micro-entrepreneur" (n'existent pas en droit OHADA).
- Chaque email DOIT contenir au moins une comparaison chiffrée avec la pub Facebook/Instagram.
- Longueur : 120-180 mots par email (hors salutation et CTA).
- 1 seul CTA par email.
- Ne promets JAMAIS de résultats garantis. Pas de superlatifs creux ("révolutionnaire", "incroyable").
- Formate en markdown simple : paragraphes séparés par \\n\\n, **gras** pour les chiffres clés.

GRILLE TARIFAIRE (à répéter selon les angles) :
- 10 000 FCFA = 50 prospects qualifiés (200 FCFA / prospect)
- 25 000 FCFA = 125 prospects qualifiés (200 FCFA / prospect)
- 50 000 FCFA = prospects illimités pendant 30 jours + accès prioritaire 3h sur chaque nouveau prospect

CHIFFRES FACEBOOK/INSTAGRAM (référence CI, services comptables B2B) :
- Pub Facebook lead ad : 1 500 à 3 000 FCFA par formulaire rempli, qualité variable (curieux, doublons, faux numéros, hors zone).
- Sur Soumission Comptable : 200 FCFA par prospect qualifié, filtré (service précisé, budget déclaré, ville confirmée), plafonné à 5 cabinets.
- Traduction : 1 prospect Soumission Comptable = 7 à 15 leads Facebook au même prix.

CONTEXTE DYNAMIQUE :
- ${nbProspects} prospects qualifiés publiés sur la marketplace ces 7 derniers jours.

FORMAT DE SORTIE : JSON strict, sans commentaire, sans backticks.
{
  "monday":    { "subject": "...", "preview": "...", "body_markdown": "...", "cta_label": "...", "cta_url": "..." },
  "wednesday": { "subject": "...", "preview": "...", "body_markdown": "...", "cta_label": "...", "cta_url": "..." },
  "friday":    { "subject": "...", "preview": "...", "body_markdown": "...", "cta_label": "...", "cta_url": "..." }
}

ANGLES IMPOSÉS :
- monday : comparaison frontale FB Ads vs Soumission Comptable (coût par lead).
- wednesday : math du ROI (un seul dossier signé rembourse 125 prospects).
- friday : urgence / volume (${nbProspects} prospects publiés cette semaine, plafonné 5 cabinets).

CTA URLs valides :
- "https://www.soumissioncomptable.com/connexion?next=%2Frecharger" (par défaut)
- "https://www.soumissioncomptable.com/connexion?next=%2Fmarketplace" (pour angle urgence/volume)

preview : max 90 caractères, accrocheur.
subject : max 60 caractères, sans emoji.
cta_label : max 32 caractères, verbe d'action.`;

        const userPrompt = `Génère les 3 emails de vente hebdomadaires pour cette semaine (démarrage ${weekStart}). Nombre de prospects publiés ces 7 derniers jours : ${nbProspects}.`;

        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": apiKey,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!aiRes.ok) {
          const errText = await aiRes.text();
          console.error("[generate-growth-emails] AI gateway failed", aiRes.status, errText);
          return Response.json(
            { ok: false, error: `ai_gateway_${aiRes.status}`, detail: errText.slice(0, 500) },
            { status: 500 },
          );
        }

        const aiJson = (await aiRes.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const rawContent = aiJson.choices?.[0]?.message?.content ?? "";

        let parsed: Record<string, { subject: string; preview: string; body_markdown: string; cta_label: string; cta_url: string }>;
        try {
          parsed = JSON.parse(rawContent);
        } catch (e) {
          console.error("[generate-growth-emails] JSON parse failed", rawContent.slice(0, 500));
          return Response.json({ ok: false, error: "invalid_ai_json" }, { status: 500 });
        }

        // Planification : lundi 09h / mercredi 09h / vendredi 09h Abidjan (= UTC)
        const slotsPlan: Array<{ slot: "monday" | "wednesday" | "friday"; offsetDays: number }> = [
          { slot: "monday", offsetDays: 0 },
          { slot: "wednesday", offsetDays: 2 },
          { slot: "friday", offsetDays: 4 },
        ];

        const inserts = slotsPlan
          .map(({ slot, offsetDays }) => {
            const p = parsed[slot];
            if (!p) return null;
            const scheduled = new Date(monday);
            scheduled.setUTCDate(monday.getUTCDate() + offsetDays);
            scheduled.setUTCHours(9, 0, 0, 0);
            return {
              week_start: weekStart,
              slot,
              subject: String(p.subject || "").slice(0, 200),
              preview: String(p.preview || "").slice(0, 200),
              body_markdown: String(p.body_markdown || ""),
              cta_label: String(p.cta_label || "Recharger mon compte").slice(0, 60),
              cta_url:
                String(p.cta_url || "").startsWith("https://www.soumissioncomptable.com/")
                  ? p.cta_url
                  : "https://www.soumissioncomptable.com/connexion?next=%2Frecharger",
              scheduled_for: scheduled.toISOString(),
              generated_by: "gemini-2.5-flash",
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null);

        if (inserts.length === 0) {
          return Response.json({ ok: false, error: "no_slots_generated" }, { status: 500 });
        }

        const { error: insErr } = await supabaseAdmin
          .from("growth_email_batches")
          .upsert(inserts, { onConflict: "week_start,slot" });
        if (insErr) {
          console.error("[generate-growth-emails] insert failed", insErr);
          return Response.json({ ok: false, error: insErr.message }, { status: 500 });
        }

        console.log("[generate-growth-emails]", { weekStart, generated: inserts.length, nbProspects });
        return Response.json({ ok: true, week_start: weekStart, generated: inserts.length });
      },
    },
  },
});