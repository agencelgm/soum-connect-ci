import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrackingFields } from "@/lib/lead-tracking";

type OfferPageProps = {
  language: "fr" | "en";
  offer: "logo" | "site";
  nextPath: string;
  badge: string;
  title: string;
  price: string;
  description: string;
  yesLabel: string;
  noLabel: string;
  progressLabel: string;
  progressPercent: number;
};

export function OfferPage({
  language,
  offer,
  nextPath,
  badge,
  title,
  price,
  description,
  yesLabel,
  noLabel,
  progressLabel,
  progressPercent,
}: OfferPageProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<null | "yes" | "no">(null);

  const handleClick = async (interested: boolean) => {
    setLoading(interested ? "yes" : "no");
    let leadId: string | undefined;
    try {
      leadId = sessionStorage.getItem("leadId") ?? undefined;
    } catch {
      // sessionStorage is optional; upsell tracking can continue without a lead id.
    }
    try {
      const source =
        (offer === "logo" ? "upsell-logo" : "upsell-site-internet") +
        (language === "en" ? "-en" : "");
      await fetch("/api/public/lead-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          offer,
          interested,
          language,
          source,
          ...getTrackingFields(),
        }),
      });
    } catch (err) {
      console.error("[upsell] submit failed", err);
    }
    navigate({ to: nextPath as never });
  };

  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center">
      <section className="container-app py-12 md:py-20 w-full">
        <div className="mx-auto max-w-[640px]">
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground mb-2">
              <span>{progressLabel}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-lg border border-border p-6 md:p-10 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-white px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              {badge}
            </span>

            <h1 className="mt-5 font-heading text-2xl md:text-3xl font-bold text-primary leading-tight">
              {title}
            </h1>

            <p className="mt-4 text-3xl md:text-4xl font-extrabold text-secondary">{price}</p>

            <p className="mt-4 text-base text-foreground leading-relaxed">{description}</p>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                type="button"
                onClick={() => handleClick(true)}
                disabled={loading !== null}
                className="h-12 text-base bg-secondary hover:bg-secondary-dark text-white"
              >
                {loading === "yes" ? "…" : yesLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClick(false)}
                disabled={loading !== null}
                className="h-12 text-base"
              >
                {loading === "no" ? "…" : noLabel}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
