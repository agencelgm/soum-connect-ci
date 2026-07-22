import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";
import { trackEvent } from "@/lib/analytics";

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
  useEffect(() => {
    trackEvent("business_plan_lead_confirmed", { page: "merci-business-plan" });
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
        <div className="max-w-xl w-full bg-white rounded-2xl border border-border shadow-sm p-8 md:p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="mt-5 font-heading font-bold text-primary text-2xl md:text-3xl">
            Merci, votre demande a bien été reçue
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Votre demande a bien été reçue. Elle sera analysée afin de vous mettre en relation avec les
            professionnels les plus adaptés à votre projet.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Vous pouvez recevoir jusqu'à 5 propositions dans les prochains jours. Restez attentif à vos
            e-mails, appels et messages WhatsApp.
          </p>
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}