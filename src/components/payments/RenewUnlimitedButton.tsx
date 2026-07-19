import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { createChariowIntent } from "@/lib/chariow.functions";
import { CREDIT_PACKS } from "@/lib/credit-packs";

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

  useEffect(() => {
    ensureChariowLoaded();
  }, [partnerId]);

  if (!UNLIMITED_PACK) return null;

  const primaryColor =
    variant === "red" ? "#dc2626" : variant === "orange" ? "#ea580c" : variant === "slate" ? "#334155" : "#f59e0b";

  return (
    <div
      onClickCapture={() => {
        intentFn({ data: { productId: UNLIMITED_PACK.productId } }).catch((e) => {
          console.warn("[chariow] intent registration failed", e);
        });
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