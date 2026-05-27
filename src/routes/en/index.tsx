import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo";
import { Index } from "../index";

const TITLE =
  "Best Accounting Firm in Côte d'Ivoire | Compare 5 Free Quotes | SoumissionComptable.com";
const DESCRIPTION =
  "Find the best accounting firm in Côte d'Ivoire. Fill out a form, receive up to 5 free quotes from certified firms within 48h. Company registration, accounting, tax filing.";

export const Route = createFileRoute("/en/")({
  head: () =>
    buildPageHead({
      path: "/en",
      title: TITLE,
      description: DESCRIPTION,
      includeWebSite: true,
      lang: "en",
      altPath: "/",
      extraSchemas: [LOCAL_BUSINESS_SCHEMA],
    }),
  component: Index,
});
