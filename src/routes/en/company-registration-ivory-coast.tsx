import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { Route as FrRoute } from "../creation-entreprise-cote-divoire";

export const Route = createFileRoute("/en/company-registration-ivory-coast")({
  head: () =>
    buildPageHead({
      path: "/en/company-registration-ivory-coast",
      title: "Company Registration in Côte d'Ivoire | Find Your Accounting Firm | SoumissionsComptables.ci",
      description: "Register your SARL, SA or sole proprietorship in Côte d'Ivoire with a certified accounting firm. CEPICI steps, required documents, costs. Get 5 free quotes.",
      lang: "en",
      altPath: "/creation-entreprise-cote-divoire",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Company registration", path: "/en/company-registration-ivory-coast" },
      ],
    }),
  component: FrRoute.options.component,
});