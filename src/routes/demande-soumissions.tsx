import { createFileRoute } from "@tanstack/react-router";
import { Shield, Star, BadgeCheck } from "lucide-react";
import { buildPageHead } from "@/lib/seo";
import { useLanguage } from "@/lib/language-context";
import { MultiStepLeadForm } from "@/components/lead/MultiStepLeadForm";

const META_TITLE = "Demande de Soumissions — Cabinets Comptables CI Agréés";
const META_DESC =
  "Recevez 5 soumissions gratuites de cabinets comptables agréés OECCA-CI en 48 h. Création, comptabilité, fiscalité, domiciliation.";

export const Route = createFileRoute("/demande-soumissions")({
  head: () =>
    buildPageHead({
      path: "/demande-soumissions",
      title: META_TITLE,
      description: META_DESC,
      altPath: "/en/get-quotes",
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Demande de soumissions", path: "/demande-soumissions" },
      ],
    }),
  component: Page,
});

const ASIDE_COPY = {
  fr: {
    h1: "Recevez jusqu'à 5 Soumissions de Cabinets Comptables Agréés",
    sub: "Gratuit · Sans engagement · Réponse en 48h",
    asideTitle: "Pourquoi nous faire confiance",
    asideSat: "4.8/5 satisfaction",
    asideData: "Données sécurisées",
    asideAccred: "Cabinets agréés OECCA-CI",
    quote:
      "« J'ai reçu 4 soumissions en 24h. J'ai économisé 40 % par rapport à mon ancien cabinet. »",
    quoteAuthor: "— Aya K., Abidjan",
  },
  en: {
    h1: "Get up to 5 Quotes from Certified Accounting Firms",
    sub: "Free · No commitment · Reply within 48h",
    asideTitle: "Why trust us",
    asideSat: "4.8/5 satisfaction",
    asideData: "Secure data",
    asideAccred: "OECCA-CI certified firms",
    quote: '"I received 4 quotes within 24h. I saved 40% compared to my previous firm."',
    quoteAuthor: "— Aya K., Abidjan",
  },
} as const;

function Page() {
  const { language } = useLanguage();
  const c = ASIDE_COPY[language];
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <section className="container-app pt-10 md:pt-14 pb-4 text-center">
        <h1 className="font-heading font-bold text-primary text-3xl md:text-4xl leading-tight">
          {c.h1}
        </h1>
        <p className="mt-3 text-muted-foreground text-base md:text-lg">{c.sub}</p>
      </section>

      <section className="container-app pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="mx-auto w-full max-w-[640px]">
            <MultiStepLeadForm variant="page" source="page-demande-soumissions" />
          </div>

          <aside className="hidden lg:flex flex-col gap-5 sticky top-24">
            <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
              <p className="font-heading font-semibold text-primary mb-3">{c.asideTitle}</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" /> {c.asideSat}
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> {c.asideData}
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-accent" /> {c.asideAccred}
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-primary text-white p-5 shadow-sm">
              <p className="italic text-sm leading-relaxed">{c.quote}</p>
              <p className="mt-3 text-xs text-white/80">{c.quoteAuthor}</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
