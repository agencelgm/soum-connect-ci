import { useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createChariowIntent } from "@/lib/chariow.functions";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Chariow?: { initializeWidget?: () => void };
  }
}

const UNLIMITED_PACK = CREDIT_PACKS.find((p) => p.unlimited);

function ensureChariowLoaded() {
  if (typeof document === "undefined") return;
  if (!document.querySelector('link[href="https://js.chariowcdn.com/v1/widget.min.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://js.chariowcdn.com/v1/widget.min.css";
    document.head.appendChild(link);
  }
  const existing = document.querySelector<HTMLScriptElement>(
    'script[src="https://js.chariowcdn.com/v1/widget.min.js"]',
  );
  const init = () => {
    try {
      window.Chariow?.initializeWidget?.();
    } catch (e) {
      console.error("Chariow init failed", e);
    }
  };
  if (existing && window.Chariow?.initializeWidget) {
    init();
    return;
  }
  if (existing) existing.remove();
  const script = document.createElement("script");
  script.src = "https://js.chariowcdn.com/v1/widget.min.js";
  script.async = true;
  script.onload = init;
  document.head.appendChild(script);
}

/**
 * Bouton d'achat inline "Renouveler l'illimité" utilisant le widget Chariow.
 * Permet de renouveler en 1 clic depuis un bandeau d'alerte sans passer par /recharger.
 */
export function RenewUnlimitedButton({
  partnerId,
  ctaText = "Renouveler en 1 clic",
  variant = "amber",
}: {
  partnerId?: string;
  ctaText?: string;
  variant?: "amber" | "orange" | "red" | "slate";
}) {
  const intentFn = useServerFn(createChariowIntent);
  const queryClient = useQueryClient();
  const pollRef = useRef<{ timer: number | null; stop: () => void } | null>(null);

  useEffect(() => {
    ensureChariowLoaded();
  }, [partnerId]);

  // Cleanup polling on unmount
  useEffect(() => () => pollRef.current?.stop(), []);

  /**
   * Après clic sur le widget Chariow, on démarre un polling léger de la
   * table `partners` (via my-partner). Dès que `unlimited_until` avance
   * (webhook Chariow traité), on invalide les queries et on notifie.
   */
  function startRenewalPolling() {
    if (!partnerId || pollRef.current) return;
    let baseline: string | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // ~5 min à 5s

    const fetchUnlimited = async (): Promise<string | null> => {
      const { data } = await supabase
        .from("partners")
        .select("unlimited_until")
        .eq("id", partnerId)
        .maybeSingle();
      return (data?.unlimited_until as string | null) ?? null;
    };

    const tick = async () => {
      attempts += 1;
      try {
        const current = await fetchUnlimited();
        if (baseline === null) baseline = current;
        const baselineTs = baseline ? new Date(baseline).getTime() : 0;
        const currentTs = current ? new Date(current).getTime() : 0;
        if (currentTs > baselineTs) {
          // Renouvellement détecté : rafraîchir toute l'UI
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["my-partner"] }),
            queryClient.invalidateQueries({ queryKey: ["marketplace"] }),
            queryClient.invalidateQueries({ queryKey: ["credit-history"] }),
            queryClient.invalidateQueries({ queryKey: ["chariow-history"] }),
          ]);
          toast.success("Accès illimité renouvelé — profitez de 30 jours supplémentaires.");
          pollRef.current?.stop();
          return;
        }
      } catch (e) {
        console.warn("[renewal-poll] fetch failed", e);
      }
      if (attempts >= MAX_ATTEMPTS) {
        pollRef.current?.stop();
      }
    };

    const timer = window.setInterval(tick, 5000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void tick();
    };
    document.addEventListener("visibilitychange", onVisibility);
    const stop = () => {
      if (pollRef.current?.timer) window.clearInterval(pollRef.current.timer);
      document.removeEventListener("visibilitychange", onVisibility);
      pollRef.current = null;
    };
    pollRef.current = { timer, stop };
    // Kick off first tick immediately for the baseline
    void tick();
  }

  if (!UNLIMITED_PACK) return null;

  const primaryColor =
    variant === "red" ? "#dc2626" : variant === "orange" ? "#ea580c" : variant === "slate" ? "#334155" : "#f59e0b";

  return (
    <div
      onClickCapture={() => {
        intentFn({ data: { productId: UNLIMITED_PACK.productId } }).catch((e) => {
          console.warn("[chariow] intent registration failed", e);
        });
        startRenewalPolling();
      }}
    >
      <div
        id="chariow-widget"
        data-product-id={UNLIMITED_PACK.productId}
        data-store-domain="academielgm.com"
        data-style="tap"
        data-border-style="rounded"
        data-cta-width="xs"
        data-cta-animation="pulse_glow"
        data-locale="fr"
        data-primary-color={primaryColor}
        data-background-color="#FFFFFF"
        data-custom-cta-text={ctaText}
        data-metadata-partner-id={partnerId ?? ""}
        data-customer-reference={partnerId ?? ""}
      />
    </div>
  );
}