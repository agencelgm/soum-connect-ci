import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { OfferPage } from "@/components/upsell/OfferPage";

export const Route = createFileRoute("/offre-logo")({
  head: () => {
    const head = buildPageHead({
      path: "/offre-logo",
      title: "Offre exclusive — Conception de logo | SoumissionComptable.com",
      description:
        "Offre exclusive : conception de logo professionnel à partir de 50 000 FCFA.",
      altPath: "/en/logo-offer",
    });
    head.meta.push({ name: "robots", content: "noindex, nofollow" });
    return head;
  },
  component: LogoOfferPage,
});

function LogoOfferPage() {
  return (
    <OfferPage
      language="fr"
      offer="logo"
      nextPath="/offre-site-internet"
      badge="Offre exclusive !!"
      title="Conception de LOGO professionnel"
      price="à partir de 50 000 FCFA"
      description="Boostez l'image de votre entreprise avec un logo unique, conçu sur mesure par nos designers partenaires. Livraison rapide, fichiers prêts à l'emploi."
      yesLabel="Oui, je suis intéressé(e)"
      noLabel="Non, merci, je ne suis pas intéressé(e)"
      progressLabel="Étape 1 sur 3 — Offres complémentaires"
      progressPercent={33}
    />
  );
}