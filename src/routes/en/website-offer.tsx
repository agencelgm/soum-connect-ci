import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { OfferPage } from "@/components/upsell/OfferPage";

export const Route = createFileRoute("/en/website-offer")({
  head: () => {
    const head = buildPageHead({
      path: "/en/website-offer",
      title: "Exclusive offer — Website design | SoumissionComptable.com",
      description:
        "Exclusive offer: professional website design at 70,000 FCFA instead of 165,000 FCFA, until Friday 5:00 PM.",
      lang: "en",
      altPath: "/offre-site-internet",
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: SiteOfferEnPage,
});

function SiteOfferEnPage() {
  return (
    <OfferPage
      language="en"
      offer="site"
      nextPath="/offre-gestion-marketing"
      badge="Exclusive offer !!"
      title="Professional WEBSITE design"
      price="70,000 FCFA"
      oldPrice="165,000 FCFA"
      promoLabel="Promotion — this week only"
      showCountdown
      description="Give your business a credible online presence: modern, responsive, SEO-optimised website. Fast launch and full support included."
      yesLabel="Yes, I'm interested"
      noLabel="No thanks, I'm not interested"
      progressLabel="Step 1 of 2 — Additional offers"
      progressPercent={50}
    />
  );
}