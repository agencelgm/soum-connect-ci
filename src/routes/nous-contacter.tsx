import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/nous-contacter")({
  head: () =>
    buildPageHead({
      path: "/nous-contacter",
      title: "Nous contacter | SoumissionComptable.com",
      description:
        "Une question, un problème avec votre soumission ou un cabinet partenaire ? Contactez notre équipe à Abidjan, réponse sous 24h ouvrables.",
      altPath: "/en/contact-us",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Nous contacter", path: "/nous-contacter" },
      ],
    }),
  component: () => <ContactForm language="fr" />,
});
