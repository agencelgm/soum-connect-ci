import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getMyPartner } from "@/lib/partners.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/recharger")({
  head: () => ({ meta: [{ title: "Recharger mes crédits" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: RechargerPage,
});

declare global {
  interface Window {
    Chariow?: { initializeWidget?: () => void };
  }
}

function ChariowButton({ productId, ctaText }: { productId: string; ctaText: string }) {
  return (
    <div
      id="chariow-widget"
      data-product-id={productId}
      data-store-domain="academielgm.com"
      data-style="tap"
      data-border-style="rounded"
      data-cta-width="xs"
      data-cta-animation="pulse_glow"
      data-locale="fr"
      data-primary-color="#ffcc00"
      data-background-color="#FFFFFF"
      data-custom-cta-text={ctaText}
    />
  );
}

function useChariowLoader(deps: unknown[]) {
  useEffect(() => {
    if (!document.querySelector('link[href="https://js.chariowcdn.com/v1/widget.min.css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://js.chariowcdn.com/v1/widget.min.css";
      document.head.appendChild(link);
    }

    const init = () => {
      try {
        window.Chariow?.initializeWidget?.();
      } catch (e) {
        console.error("Chariow init failed", e);
      }
    };

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://js.chariowcdn.com/v1/widget.min.js"]',
    );
    if (existing && window.Chariow?.initializeWidget) {
      // Script already loaded — re-scan the newly mounted widgets
      init();
    } else {
      if (existing) existing.remove();
      const script = document.createElement("script");
      script.src = "https://js.chariowcdn.com/v1/widget.min.js";
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function RechargerPage() {
  const meFn = useServerFn(getMyPartner);
  const { data } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return meFn();
    },
    retry: false,
  });
  const partner = data?.partner;
  useChariowLoader([CREDIT_PACKS.length]);

  return (
    <div className="space-y-8">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/marketplace"><ArrowLeft className="h-4 w-4 mr-1" /> Retour à la marketplace</Link>
      </Button>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Recharger mes crédits</h1>
          <p className="text-sm text-muted-foreground">
            Choisissez un pack et finalisez le paiement sécurisé.
          </p>
        </div>
        {partner && (
          <div className="rounded-lg border bg-card px-4 py-3">
            <div className="text-xs uppercase text-muted-foreground">Solde actuel</div>
            <div className="text-2xl font-bold">{partner.credits_balance} crédits</div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.credits}
            className={`rounded-lg border bg-card p-6 space-y-4 relative ${pack.popular ? "border-primary shadow-md" : ""}`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-xs font-semibold">
                Le plus choisi
              </span>
            )}
            <div>
              <div className="text-4xl font-bold">{pack.credits}</div>
              <div className="text-sm text-muted-foreground">crédits</div>
            </div>
            <div className="text-2xl font-semibold">{pack.price}</div>
            <p className="text-xs text-muted-foreground">
              1 crédit = 1 lead débloqué (coordonnées complètes).
            </p>
            <ChariowButton
              productId={pack.productId}
              ctaText={`Recharger ${pack.credits} crédits`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}