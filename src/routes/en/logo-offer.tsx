import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { OfferPage } from "@/components/upsell/OfferPage";

export const Route = createFileRoute("/en/logo-offer")({
  head: () => {
    const head = buildPageHead({
      path: "/en/logo-offer",
      title: "Exclusive offer — Logo design | SoumissionComptable.com",
      description:
        "Exclusive offer: professional logo design starting from 50,000 FCFA.",
      lang: "en",
      altPath: "/offre-logo",
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: LogoOfferEnPage,
});

function LogoOfferEnPage() {
  return (
    <OfferPage
      language="en"
      offer="logo"
      nextPath="/en/website-offer"
      badge="Exclusive offer !!"
      title="Professional LOGO design"
      price="from 50,000 FCFA"
      description="Boost your brand with a unique, custom-made logo crafted by our partner designers. Fast delivery, ready-to-use files."
      yesLabel="Yes, I'm interested"
      noLabel="No thanks, I'm not interested"
      progressLabel="Step 1 of 2 — Additional offers"
      progressPercent={50}
    />
  );
}