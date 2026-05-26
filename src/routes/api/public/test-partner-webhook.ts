import { createFileRoute } from "@tanstack/react-router";
import { notifyPartnerEvent } from "@/lib/ghl-partners.server";

export const Route = createFileRoute("/api/public/test-partner-webhook")({
  server: {
    handlers: {
      GET: async () => {
        await notifyPartnerEvent({
          event_type: "signup",
          partner_id: "00000000-0000-0000-0000-000000000000",
          status: "pending_review",
          credits_balance: 0,
          cabinet_name: "Cabinet Test LGM",
          contact_first_name: "Koffi",
          contact_last_name: "Test",
          email: "test+webhook@soumissioncomptable.com",
          phone: "+225 00 00 00 00",
          city: "Abidjan",
          website: "https://soumissioncomptable.com",
          facebook_url: null,
          services: ["comptabilité", "fiscalité"],
          zones: ["Abidjan"],
          page_url: "/test-webhook",
          user_agent: "lovable-test",
        });
        return Response.json({ ok: true, sent_at: new Date().toISOString() });
      },
    },
  },
});