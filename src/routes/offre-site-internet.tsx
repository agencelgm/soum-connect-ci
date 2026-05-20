import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { OfferPage } from "@/components/upsell/OfferPage";

export const Route = createFileRoute("/offre-site-internet")({
  head: () => {
    const head = buildPageHead({
      path: "/offre-site-internet",
      title: "Offre exclusive — Conception de site internet | SoumissionsComptables.ci",
      description:
        "Offre exclusive : conception de site internet professionnel à partir de 165 000 FCFA.",
      altPath: "/en/website-offer",
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: SiteOfferPage,
});

function SiteOfferPage() {
  return (
    <OfferPage
      language="fr"
      offer="site"
      nextPath="/merci"
      badge="Offre exclusive !!"
      title="Conception de SITE INTERNET professionnel"
      price="à partir de 165 000 FCFA"
      description="Donnez à votre entreprise une présence en ligne crédible : site vitrine moderne, responsive, optimisé SEO. Mise en ligne rapide et accompagnement inclus."
      yesLabel="Oui, je suis intéressé(e)"
      noLabel="Non, merci, je ne suis pas intéressé(e)"
      progressLabel="Étape 2 sur 2 — Offres complémentaires"
      progressPercent={100}
    />
  );
}