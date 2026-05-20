import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/merci")({
  head: () =>
    buildPageHead({
      path: "/merci",
      title: "Merci | SoumissionsComptables.ci",
      description:
        "Merci d'avoir rempli notre formulaire. Un membre de notre équipe vous contactera dans les 24 heures ouvrables.",
      altPath: "/en/thank-you",
      noindex: true,
      breadcrumb: [
        { name: "Accueil", path: "/" },
        { name: "Merci", path: "/merci" },
      ],
    }),
  component: MerciPage,
});

function MerciPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen flex items-center">
      <section className="container-app py-16 md:py-24 w-full">
        <div className="mx-auto max-w-[640px] rounded-2xl bg-white shadow-lg border border-border p-8 md:p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h1 className="mt-6 font-heading text-3xl md:text-4xl font-bold text-primary">
            Merci !
          </h1>
          <p className="mt-4 text-base md:text-lg text-foreground leading-relaxed">
            Merci d'avoir rempli notre formulaire. Un membre de notre équipe
            vous contactera dans les <strong>24 heures ouvrables</strong> afin
            de vous référer au meilleur cabinet comptable.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link to="/">← Retour à l'accueil</Link>
            </Button>
            <Button
              asChild
              className="bg-secondary hover:bg-secondary-dark text-white"
            >
              <Link to="/cabinet-comptable-abidjan">
                Découvrir nos services →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}