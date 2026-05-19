import { Link } from "@tanstack/react-router";
import {
  Search,
  ShieldCheck,
  Clock,
  Eye,
  Award,
  Heart,
  Mail,
  MessageCircle,
  MapPin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";

const PROBLEM_ICONS = [Search, ShieldCheck, Clock];
const VALUE_ICONS = [Eye, Award, Heart];

export function AboutPage() {
  const { language, t } = useLanguage();
  const a = t.about;
  const quotesHref = getCounterpart(
    language === "en" ? "/en/get-quotes" : "/demande-soumissions",
    language,
  );

  const contacts: Array<{
    icon: typeof Mail;
    label: string;
    value: string;
    href?: string;
  }> = [
    {
      icon: Mail,
      label: a.contactEmail,
      value: "contact@soumissionscomptables.ci",
      href: "mailto:contact@soumissionscomptables.ci",
    },
    {
      icon: MessageCircle,
      label: a.contactWhatsapp,
      value: "+225 07 67 00 96 29",
      href: "https://wa.me/2250767009629",
    },
    {
      icon: MapPin,
      label: a.contactAddress,
      value: a.contactAddressValue,
    },
  ];

  return (
    <main>
      <section className="bg-primary text-primary-foreground">
        <div className="container-app py-16 md:py-24 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-5xl max-w-3xl mx-auto leading-tight">
            {a.heroTitle}
          </h1>
          <p className="mt-5 text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">
            {a.heroSub}
          </p>
        </div>
      </section>

      <section className="container-app py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
            {a.whoTitle}
          </h2>
          <div className="mt-5 space-y-4 text-foreground leading-relaxed">
            <p>
              <strong>{a.whoP1Strong}</strong>
              {a.whoP1}
            </p>
            <p>{a.whoP2}</p>
            <p>{a.whoP3}</p>
          </div>
        </div>
      </section>

      <section className="bg-background-alt border-y border-border">
        <div className="container-app py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
              {a.problemsTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">{a.problemsSub}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {a.problems.map((p, i) => {
              const Icon = PROBLEM_ICONS[i];
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-border bg-background p-6 shadow-sm"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-primary text-lg">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-app py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
            {a.valuesTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{a.valuesSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {a.values.map((v, i) => {
            const Icon = VALUE_ICONS[i];
            return (
              <div
                key={v.title}
                className="rounded-xl bg-primary text-primary-foreground p-6 text-center"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/85 leading-relaxed">
                  {v.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-background-alt border-y border-border">
        <div className="container-app py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
              {a.teamTitle}
            </h2>
            <p className="mt-5 text-foreground leading-relaxed">
              {a.teamTextBefore}
              <strong>{a.teamTextStrong}</strong>
              {a.teamTextAfter}
            </p>
            <div className="mt-6">
              <a
                href="https://lgm.ci"
                target="_blank"
                rel="noopener nofollow"
                className="inline-flex items-center gap-2 text-secondary hover:text-secondary-dark font-semibold"
              >
                {a.teamCta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-primary text-2xl md:text-3xl">
            {a.contactTitle}
          </h2>
          <p className="mt-3 text-muted-foreground">{a.contactSub}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contacts.map((c) => {
            const inner = (
              <>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                  <c.icon className="h-6 w-6" />
                </div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  {c.label}
                </p>
                <p className="mt-2 text-foreground font-medium break-words">
                  {c.value}
                </p>
              </>
            );
            return c.href ? (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="block rounded-xl border border-border bg-background p-6 text-center hover:border-secondary/40 hover:shadow-md transition-all"
              >
                {inner}
              </a>
            ) : (
              <div
                key={c.label}
                className="rounded-xl border border-border bg-background p-6 text-center"
              >
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container-app py-12 md:py-16 text-center">
          <h2 className="font-heading font-bold text-white text-2xl md:text-3xl">
            {a.ctaTitle}
          </h2>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">{a.ctaSub}</p>
          <div className="mt-6">
            <Button
              asChild
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 font-semibold"
            >
              <Link to={quotesHref}>
                {a.ctaButton}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}