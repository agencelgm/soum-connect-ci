import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPageHead } from "@/lib/seo";
import { getTrackingFields } from "@/lib/lead-tracking";

const WHATSAPP_URL =
  "https://wa.me/2250798172339?text=" +
  encodeURIComponent(
    "Bonjour. Je viens de votre site web, et j'aimerais prendre un rendez-vous marketing avec un membre de votre équipe.",
  );

export const Route = createFileRoute("/offre-gestion-marketing")({
  head: () => {
    const head = buildPageHead({
      path: "/offre-gestion-marketing",
      title: "Offre exclusive — Consultation en gestion marketing | SoumissionComptable.com",
      description:
        "Premier rendez-vous gratuit avec un spécialiste marketing pour développer votre entreprise.",
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: MarketingOfferPage,
});

function getFinalPath(): string {
  try {
    return sessionStorage.getItem("finalThankYouPath") || "/merci-demande-business-plan";
  } catch {
    return "/merci-demande-business-plan";
  }
}

function MarketingOfferPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<null | "yes" | "no">(null);

  async function handleClick(interested: boolean) {
    setLoading(interested ? "yes" : "no");
    let leadId: string | undefined;
    try {
      leadId = sessionStorage.getItem("leadId") ?? undefined;
    } catch {}
    try {
      await fetch("/api/public/lead-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          offer: "marketing",
          interested,
          language: "fr",
          source: "upsell-gestion-marketing",
          ...getTrackingFields(),
        }),
      });
    } catch (err) {
      console.error("[upsell marketing] submit failed", err);
    }

    const finalPath = getFinalPath();
    if (interested) {
      try {
        window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
      } catch {}
    }
    await navigate({ to: finalPath as never });
  }

  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center">
      <section className="container-app py-12 md:py-20 w-full">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
              <span>Étape 3 sur 3 — Offres complémentaires</span>
              <span>100%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-secondary transition-all duration-500" style={{ width: "100%" }} />
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg border border-border p-6 md:p-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              OFFRE EXCLUSIVE !!
            </span>

            <h1 className="mt-5 font-heading text-2xl md:text-3xl font-bold text-primary leading-tight">
              Besoin d'aide pour développer votre entreprise ?
            </h1>

            <p className="mt-3 text-lg md:text-xl font-semibold text-foreground">
              Consultation en GESTION MARKETING
            </p>

            <p className="mt-4 text-3xl md:text-4xl font-extrabold text-secondary">
              Premier rendez-vous gratuit
            </p>

            <p className="mt-4 text-base text-foreground leading-relaxed">
              Échangez gratuitement avec un spécialiste pour analyser votre visibilité, votre acquisition
              de clients et les actions marketing adaptées à votre entreprise.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => handleClick(true)}
                disabled={loading !== null}
                className="h-12 text-base bg-secondary hover:bg-secondary-dark text-white"
              >
                {loading === "yes" ? "…" : "Prendre mon rendez-vous gratuit"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClick(false)}
                disabled={loading !== null}
                className="h-12 text-base"
              >
                {loading === "no" ? "…" : "Non merci, terminer ma demande"}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}