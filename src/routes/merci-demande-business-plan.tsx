import { useFormationGate } from "@/hooks/useFormationGate";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";
import { trackEvent } from "@/lib/analytics";
import { trackMetaConversion, type MetaUserData } from "@/lib/meta-pixel";
import { FinalThankYouCard } from "@/components/upsell/FinalThankYouCard";

const TITLE = "Demande reçue — Business plan | SoumissionComptable.com";
const DESCRIPTION =
  "Votre demande de rédaction de business plan a bien été reçue. Nous analysons votre projet pour vous mettre en relation avec les professionnels adaptés.";

export const Route = createFileRoute("/merci-demande-business-plan")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Page,
});

function Page() {
  useFormationGate("/merci-demande-business-plan");
  useEffect(() => {
    trackEvent("business_plan_lead_confirmed", { page: "merci-business-plan" });
    try {
      const flagKey = "meta_lead_fired_merci_bp";
      if (!sessionStorage.getItem(flagKey)) {
        let leadUser: MetaUserData = {};
        try {
          const raw = sessionStorage.getItem("leadUser");
          if (raw) leadUser = JSON.parse(raw) as MetaUserData;
        } catch {}
        trackMetaConversion(
          "Lead",
          { content_name: "Business Plan Confirm", content_category: "business_plan_confirm" },
          leadUser,
        );
        sessionStorage.setItem(flagKey, "1");
      }
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="bg-white border-b border-border">
        <div className="max-w-[1100px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center">
          <Link to="/" aria-label="SoumissionComptable.com">
            <img src={logo} alt="SoumissionComptable.com" className="h-10 md:h-14 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-14">
        <FinalThankYouCard intro="Votre demande de business plan a bien été reçue. Notre équipe vous appellera pour valider votre demande avant que les cabinets comptables ne vous contactent." />
      </main>
    </div>
  );
}