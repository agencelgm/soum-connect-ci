import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/seo";
import { AboutPage } from "@/components/pages/AboutPage";
import { getTranslations } from "@/lib/translations";

export const Route = createFileRoute("/en/about")({
  head: () => {
    const a = getTranslations("en").about;
    return buildPageHead({
      path: "/en/about",
      title: a.metaTitle,
      description: a.metaDescription,
      lang: "en",
      altPath: "/a-propos",
      breadcrumb: [
        { name: a.breadcrumbHome, path: "/en" },
        { name: a.breadcrumbAbout, path: "/en/about" },
      ],
    });
  },
  component: AboutPage,
});
