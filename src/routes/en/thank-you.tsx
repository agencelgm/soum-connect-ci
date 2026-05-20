import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/thank-you")({
  head: () =>
    buildPageHead({
      path: "/en/thank-you",
      title: "Thank You | SoumissionsComptables.ci",
      description:
        "Thank you for filling out our form. A team member will contact you within 24 business hours.",
      lang: "en",
      altPath: "/merci",
      breadcrumb: [
        { name: "Home", path: "/en" },
        { name: "Thank you", path: "/en/thank-you" },
      ],
    }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center">
      <section className="container-app py-16 md:py-24 w-full">
        <div className="mx-auto max-w-[640px] rounded-2xl bg-white shadow-lg border border-border p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="mt-6 font-heading text-3xl md:text-4xl font-bold text-primary">
            Thank you!
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground leading-relaxed">
            Thank you, all your answers have been recorded for this service as
            well as for the additional services. An advisor will contact you
            within the <strong>next 24 business hours</strong>.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/en">← Back to home</Link>
            </Button>
            <Button
              asChild
              className="bg-secondary hover:bg-secondary-dark text-white"
            >
              <Link to="/en/accounting-firm-abidjan">
                Explore our services →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}