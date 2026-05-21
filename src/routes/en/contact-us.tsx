import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact/ContactForm";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/contact-us")({
  head: () =>
    buildPageHead({
      path: "/en/contact-us",
      title: "Contact us | SoumissionsComptables.ci",
      description:
        "Have a question or issue with a quote or a partner firm? Contact our team in Abidjan — reply within 24 business hours.",
      altPath: "/nous-contacter",
      lang: "en",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Contact us", path: "/en/contact-us" },
      ],
    }),
  component: () => <ContactForm language="en" />,
});