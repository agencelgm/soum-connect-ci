import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { recordProspect } from "@/lib/prospects.server";

const Schema = z.object({
  source: z.string().min(1).max(64).default("landing-business-plan"),
  page_url: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  submitted_at: z.string().max(40).optional().default(""),
  // Étape 1
  raison: z.string().min(1).max(120),
  avancement: z.string().min(1).max(120),
  // Étape 2
  secteur: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  ville: z.string().trim().min(2).max(120),
  delai: z.string().min(1).max(120),
  budget: z.string().min(1).max(120),
  // Étape 3
  nom: z.string().trim().min(2).max(120),
  mobile: z.string().trim().min(6).max(32).regex(/^[+0-9 ]+$/),
  email: z.string().trim().email().max(255),
  contactPref: z.enum(["telephone", "whatsapp", "email"]),
  consent: z.boolean().refine((v) => v === true, "Consent required"),
});

export const Route = createFileRoute("/api/public/business-plan-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", details: parsed.error.flatten() },
            { status: 422 },
          );
        }

        const d = parsed.data;
        const payload = {
          ...d,
          service: "Rédaction business plan",
          audience: "creation" as const,
          tag: "business-plan",
          leadId: crypto.randomUUID(),
          received_at: new Date().toISOString(),
          user_agent: request.headers.get("user-agent") ?? "",
        };

        await recordProspect({
          form_type: "lead",
          full_name: d.nom,
          email: d.email,
          phone: d.mobile,
          service: "Rédaction business plan",
          city: d.ville,
          budget: d.budget || null,
          message: `Raison: ${d.raison}\nAvancement: ${d.avancement}\nSecteur: ${d.secteur}\nDélai: ${d.delai}\nContact préféré: ${d.contactPref}\n\n${d.description}`,
          audience: "creation",
          audience_hint: "creation",
          source: d.source,
          page_url: d.page_url || null,
          referrer: d.referrer || null,
          user_agent: payload.user_agent,
          submitted_at: d.submitted_at || null,
          raw_payload: payload as unknown as Record<string, unknown>,
        });

        const webhookUrl = process.env.GHL_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            const upstream = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!upstream.ok) {
              console.error("[bp-lead] webhook non-2xx", upstream.status);
              console.error("[bp-lead] LOST_LEAD (webhook failed)", JSON.stringify(payload));
            }
          } catch (err) {
            console.error("[bp-lead] webhook threw", err);
            console.error("[bp-lead] LOST_LEAD (webhook threw)", JSON.stringify(payload));
          }
        } else {
          console.log("[bp-lead] NEW_LEAD (no GHL_WEBHOOK_URL set)", JSON.stringify(payload));
        }

        return Response.json({ ok: true, leadId: payload.leadId });
      },
    },
  },
});