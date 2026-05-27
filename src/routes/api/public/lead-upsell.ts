import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const UpsellSchema = z.object({
  leadId: z.string().min(1).max(64).optional(),
  offer: z.enum(["logo", "site"]),
  interested: z.boolean(),
  language: z.enum(["fr", "en"]).default("fr"),
  source: z.string().min(1).max(64).optional(),
  page_url: z.string().max(500).optional().default(""),
  referrer: z.string().max(500).optional().default(""),
  submitted_at: z.string().max(40).optional().default(""),
});

export const Route = createFileRoute("/api/public/lead-upsell")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = UpsellSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", details: parsed.error.flatten() },
            { status: 422 },
          );
        }

        const payload = {
          type: "upsell",
          ...parsed.data,
          tag: "soumissioncomptable",
          received_at: new Date().toISOString(),
          user_agent: request.headers.get("user-agent") ?? "",
        };

        const webhookUrl = process.env.GHL_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            const upstream = await fetch(webhookUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!upstream.ok) {
              console.error("[lead-upsell] webhook non-2xx", upstream.status);
              console.error("[lead-upsell] LOST_UPSELL", JSON.stringify(payload));
            }
          } catch (err) {
            console.error("[lead-upsell] webhook threw", err);
            console.error("[lead-upsell] LOST_UPSELL", JSON.stringify(payload));
          }
        } else {
          console.log("[lead-upsell] NEW_UPSELL (no GHL_WEBHOOK_URL set)", JSON.stringify(payload));
        }

        return Response.json({ ok: true });
      },
    },
  },
});
