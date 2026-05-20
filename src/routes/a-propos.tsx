import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { AboutPage } from "@/components/pages/AboutPage";
import { getTranslations } from "@/lib/translations";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { RelatedLinks } from "@/components/seo/RelatedLinks";
import { getPageRelations } from "@/lib/page-relations";

export const Route = createFileRoute("/a-propos")({
  head: () => {
    const a = getTranslations("fr").about;
    return buildPageHead({
      path: "/a-propos",
      title: a.metaTitle,
      description: a.metaDescription,
      lang: "fr",
      altPath: "/en/about",
      breadcrumb: [
        { name: a.breadcrumbHome, path: "/" },
        { name: a.breadcrumbAbout, path: "/a-propos" },
      ],
    });
  },
  component: AProposPage,
});

function AProposPage() {
  const rel = getPageRelations("/a-propos");
  return (
    <>
      {rel && <Breadcrumbs items={rel.breadcrumb} />}
      <AboutPage />
      {rel && <RelatedLinks items={rel.related} />}
    </>
  );
}