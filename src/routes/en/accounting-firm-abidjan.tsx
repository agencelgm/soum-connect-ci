import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead, LOCAL_BUSINESS_SCHEMA } from "@/lib/seo";
import { Route as FrRoute } from "../cabinet-comptable-abidjan";

const FrComponent = FrRoute.options.component!;

export const Route = createFileRoute("/en/accounting-firm-abidjan")({
  head: () =>
    buildPageHead({
      path: "/en/accounting-firm-abidjan",
      title: "Accounting Firm in Abidjan | Compare 5 Free Offers | SoumissionComptable.com",
      description: "Find the best accounting firm in Abidjan (Plateau, Cocody, Marcory). OECCA-CI certified firms. Get 5 free quotes within 48h.",
      lang: "en",
      altPath: "/cabinet-comptable-abidjan",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Cities", path: "/en/accounting-firm-abidjan" },
        { name: "Abidjan", path: "/en/accounting-firm-abidjan" },
      ],
      extraSchemas: [LOCAL_BUSINESS_SCHEMA],
    }),
  component: EnAccountingFirmAbidjanPage,
});

function EnAccountingFirmAbidjanPage() {
  return <FrComponent />;
}