import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { Route as FrRoute } from "../demande-soumissions";

export const Route = createFileRoute("/en/get-quotes")({
  head: () =>
    buildPageHead({
      path: "/en/get-quotes",
      title: "Get Free Quotes from Accounting Firms in Côte d'Ivoire | SoumissionComptable.com",
      description: "Receive up to 5 free quotes from certified accounting firms in Côte d'Ivoire. Simple form, reply within 48h. Company registration, accounting, tax filing.",
      lang: "en",
      altPath: "/demande-soumissions",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Get quotes", path: "/en/get-quotes" },
      ],
    }),
  component: FrRoute.options.component,
});