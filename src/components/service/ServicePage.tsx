import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// NOTE: Page metadata (title / description / og / JSON-LD) belongs in the
// route file via createFileRoute(...).head() — this component only renders UI.

export type Faq = { question: string; answer: string };
export type RelatedService = {
  title: string;
  link: string;
  icon: LucideIcon;
};
export type Crumb = { label: string; to?: string };

type Props = {
  title: string;
  heroSubtitle: string;
  serviceIcon: LucideIcon;
  breadcrumb: Crumb[];
  mainContent: ReactNode;
  faqs: Faq[];
  relatedServices: RelatedService[];
};

export function ServicePage({
  title,
  heroSubtitle,
  serviceIcon: ServiceIcon,
  breadcrumb,
  mainContent,
  faqs,
  relatedServices,
}: Props) {
  const { language, t } = useLanguage();
  const quotesHref = getCounterpart(
    language === "en" ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );
  return (
    <main>
      <section className="bg-[#F8FAFC] border-b border-border">
        <div className="container-app py-10 md:py-16">
          <nav aria-label={t.servicePage.breadcrumb} className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              {breadcrumb.map((c, i) => {
                const last = i === breadcrumb.length - 1;
                return (
                  <li key={i} className="flex items-center gap-1">
                    {c.to && !last ? (
                      <Link to={c.to} className="hover:text-primary">
                        {c.label}
                      </Link>
                    ) : (
                      <span className={last ? "text-foreground font-medium" : ""}>
                        {c.label}
                      </span>
                    )}
                    {!last && <ChevronRight className="h-3.5 w-3.5" />}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex items-start gap-4">
            <div className="hidden sm:flex shrink-0 h-14 w-14 rounded-2xl bg-primary text-white items-center justify-center shadow-sm">
              <ServiceIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-primary text-3xl md:text-5xl leading-tight">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
                {heroSubtitle}
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary-dark text-white"
                >
                  <Link to={quotesHref}>
                    {t.servicePage.heroBtn}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app section">
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 items-start">
          <div>
            <article className="service-prose max-w-none">{mainContent}</article>

            <section aria-labelledby="faq-title" className="mt-12">
              <h2
                id="faq-title"
                className="font-heading font-bold text-primary text-2xl md:text-3xl mb-4"
              >
                {t.servicePage.faqHeading}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left font-semibold">
                      {f.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="lg:hidden mt-12">
              <RelatedBlock items={relatedServices} title={t.servicePage.relatedTitle} />
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-5 sticky top-24">
            <RelatedBlock items={relatedServices} title={t.servicePage.relatedTitle} />
            <div className="rounded-2xl bg-secondary text-white p-5 shadow-sm">
              <p className="font-heading font-semibold leading-snug">
                {t.servicePage.asideTitle}
              </p>
              <p className="mt-1 text-sm text-white/90">
                {t.servicePage.asideSub}
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-4 w-full bg-white text-secondary hover:bg-white/90"
              >
                <Link to={quotesHref}>{t.servicePage.asideBtn}</Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-secondary text-white">
        <div className="container-app py-12 md:py-16 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl">
            {t.servicePage.finalTitle}
          </h2>
          <p className="mt-2 text-white/90">
            {t.servicePage.finalSub}
          </p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 font-semibold"
            >
              <Link to={quotesHref}>
                {t.servicePage.finalBtn}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function RelatedBlock({ items, title }: { items: RelatedService[]; title: string }) {
  return (
    <div className="rounded-2xl bg-white border border-border shadow-sm p-5">
      <p className="font-heading font-semibold text-primary mb-3">
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.link}>
              <Link
                to={s.link}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 -mx-3 hover:bg-muted transition-colors"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary">
                  {s.title}
                </span>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-secondary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}