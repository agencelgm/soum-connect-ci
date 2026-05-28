import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getMyPartner } from "@/lib/partners.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Coins, ShieldCheck, Zap } from "lucide-react";

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
    <div className="min-h-full flex flex-col justify-center -my-6 lg:-my-8 py-10 lg:py-14 bg-gradient-to-b from-background via-background to-muted/40">
      <div className="w-full max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/marketplace"><ArrowLeft className="h-4 w-4 mr-1" /> Retour à la marketplace</Link>
          </Button>
          {partner && (
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm shadow-sm">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-semibold">{partner.credits_balance}</span>
              <span className="text-muted-foreground">crédits disponibles</span>
            </div>
          )}
        </div>

        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
            <ShieldCheck className="h-3.5 w-3.5" /> Paiement sécurisé
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Rechargez vos crédits
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground">
            Choisissez un pack et débloquez instantanément des leads qualifiés de cabinets comptables en Côte d'Ivoire.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {CREDIT_PACKS.map((pack) => {
            const pricePerCredit = Math.round(parseInt(pack.price.replace(/\D/g, ""), 10) / pack.credits);
            return (
              <div
                key={pack.credits}
                className={cn(
                  "relative rounded-2xl border bg-card p-7 flex flex-col transition-all",
                  pack.popular
                    ? "border-primary/60 shadow-xl shadow-primary/10 md:scale-[1.04] md:-translate-y-1 bg-gradient-to-b from-primary/5 to-card"
                    : "border-border/60 shadow-sm hover:shadow-md hover:border-border",
                )}
              >
                {pack.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Le plus choisi
                  </span>
                )}

                <div className="flex items-baseline gap-2">
                  <Zap className={cn("h-5 w-5", pack.popular ? "text-primary" : "text-muted-foreground")} />
                  <div className="text-6xl font-bold leading-none tracking-tight">{pack.credits}</div>
                  <div className="text-sm text-muted-foreground">crédits</div>
                </div>

                <div className="mt-5 pb-5 border-b">
                  <div className="text-3xl font-bold">{pack.price}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    soit {pricePerCredit.toLocaleString("fr-FR")} FCFA / crédit
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5 text-sm flex-1">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>1 crédit = 1 lead débloqué (coordonnées complètes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Crédits livrés instantanément après paiement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Sans abonnement, sans engagement</span>
                  </li>
                </ul>

                <div className="mt-6">
                  <ChariowButton
                    productId={pack.productId}
                    ctaText={`Recharger ${pack.credits} crédits`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Paiement traité par Chariow — aucune donnée bancaire stockée sur nos serveurs
        </p>
      </div>
    </div>
  );
}