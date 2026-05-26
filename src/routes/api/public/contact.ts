import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { inferAudience } from "@/lib/audience";
import { recordProspect } from "@/lib/prospects.server";

const ContactSchema = z.object({
  source: z.string().min(1).max(64).default("contact-form"),
  language: z.enum(["fr", "en"]).default("fr"),
  page_url: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  submitted_at: z.string().max(40).optional().default(""),
  nom: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  mobile: z.string().trim().min(6).max(32).regex(/^[+0-9 ]+$/),
  entreprise: z.string().max(120).optional().default(""),
  sujet: z.string().min(1).max(200),
  service: z.string().max(200).optional().default(""),
  dateProbleme: z.string().max(32).optional().default(""),
  description: z.string().trim().min(20).max(1000),
  consent: z.boolean().refine((v) => v === true, "Consent required"),
  audience_hint: z.enum(["creation", "gestion", "both"]).optional(),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { ok: false, error: "Invalid JSON" },
            { status: 400 },
          );
        }

        const parsed = ContactSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              ok: false,
              error: "Validation failed",
              details: parsed.error.flatten(),
            },
            { status: 422 },
          );
        }

        const payload = {
          ...parsed.data,
          audience: inferAudience({
            audience_hint: parsed.data.audience_hint,
            source: parsed.data.source,
            service: parsed.data.service,
          }),
          tag: "soumissioncomptable",
          leadId: crypto.randomUUID(),
          received_at: new Date().toISOString(),
          user_agent: request.headers.get("user-agent") ?? "",
        };

        // Enregistre en base (non bloquant)
        await recordProspect({
          form_type: "contact",
          full_name: parsed.data.nom,
          email: parsed.data.email,
          phone: parsed.data.mobile,
          company_name: parsed.data.entreprise || null,
          service: parsed.data.service || null,
          message: parsed.data.description,
          audience: payload.audience,
          audience_hint: parsed.data.audience_hint ?? null,
          source: parsed.data.source,
          page_url: parsed.data.page_url || null,
          referrer: parsed.data.referrer || null,
          user_agent: payload.user_agent,
          submitted_at: parsed.data.submitted_at || null,
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
              console.error(
                "[contact] GHL webhook non-2xx",
                upstream.status,
                await upstream.text().catch(() => ""),
              );
              console.error(
                "[contact] LOST_LEAD (webhook failed)",
                JSON.stringify(payload),
              );
            }
          } catch (err) {
            console.error("[contact] GHL webhook threw", err);
            console.error(
              "[contact] LOST_LEAD (webhook threw)",
              JSON.stringify(payload),
            );
          }
        } else {
          console.log(
            "[contact] NEW_CONTACT (no GHL_WEBHOOK_URL set)",
            JSON.stringify(payload),
          );
        }

        return Response.json({ ok: true, leadId: payload.leadId });
      },
    },
  },
});