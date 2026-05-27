import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { inferAudience } from "@/lib/audience";
import { recordProspect } from "@/lib/prospects.server";

const LeadSchema = z.object({
  source: z.string().min(1).max(64),
  language: z.enum(["fr", "en"]).default("fr"),
  page_url: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  submitted_at: z.string().max(40).optional().default(""),
  service: z.string().min(1).max(200),
  statut: z.string().max(200).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  localisation: z.string().max(200).optional().default(""),
  delai: z.string().max(200).optional().default(""),
  budget: z.string().max(200).optional().default(""),
  nom: z.string().trim().min(2).max(100),
  mobile: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9 ]+$/),
  email: z.string().trim().email().max(255),
  entreprise: z.string().max(120).optional().default(""),
  consent: z.boolean().refine((v) => v === true, "Consent required"),
  nbAssocies: z.coerce.number().int().min(1).max(50).optional(),
  bureau: z.enum(["oui", "non"]).optional(),
  logo: z.enum(["oui", "non"]).optional(),
  siteWeb: z.enum(["oui", "non"]).optional(),
  publicite: z.enum(["oui", "non"]).optional(),
  audience_hint: z.enum(["creation", "gestion", "both"]).optional(),
});

export const Route = createFileRoute("/api/public/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = LeadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", details: parsed.error.flatten() },
            { status: 422 },
          );
        }

        const prospectId = crypto.randomUUID();
        const payload = {
          ...parsed.data,
          audience: inferAudience({
            audience_hint: parsed.data.audience_hint,
            statut: parsed.data.statut,
            source: parsed.data.source,
            service: parsed.data.service,
          }),
          tag: "soumissioncomptable",
          leadId: prospectId,
          prospectId,
          received_at: new Date().toISOString(),
          user_agent: request.headers.get("user-agent") ?? "",
        };

        try {
          await recordProspect({
            id: prospectId,
            form_type: "lead",
            full_name: parsed.data.nom,
            email: parsed.data.email,
            phone: parsed.data.mobile,
            company_name: parsed.data.entreprise || null,
            statut: parsed.data.statut || null,
            service: parsed.data.service,
            city: parsed.data.localisation || null,
            budget: parsed.data.budget || null,
            message: parsed.data.description || null,
            legal_form: null,
            audience: payload.audience,
            audience_hint: parsed.data.audience_hint ?? null,
            source: parsed.data.source,
            page_url: parsed.data.page_url || null,
            referrer: parsed.data.referrer || null,
            user_agent: payload.user_agent,
            submitted_at: parsed.data.submitted_at || null,
            raw_payload: payload as unknown as Record<string, unknown>,
          });
        } catch {
          return Response.json({ ok: false, error: "Database insert failed" }, { status: 500 });
        }

        const webhookUrl = process.env.GHL_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            const upstream = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!upstream.ok) {
              console.error(
                "[lead] GHL webhook non-2xx",
                upstream.status,
                await upstream.text().catch(() => ""),
              );
              // We still acknowledge to the client to avoid losing the lead UX,
              // but log so it can be replayed from the server logs.
              console.error("[lead] LOST_LEAD (webhook failed)", JSON.stringify(payload));
            }
          } catch (err) {
            console.error("[lead] GHL webhook threw", err);
            console.error("[lead] LOST_LEAD (webhook threw)", JSON.stringify(payload));
          }
        } else {
          // No webhook configured yet — log the lead so nothing is lost.
          console.log("[lead] NEW_LEAD (no GHL_WEBHOOK_URL set)", JSON.stringify(payload));
        }

        return Response.json({ ok: true, leadId: payload.leadId, prospectId });
      },
    },
  },
});
