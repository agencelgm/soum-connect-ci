import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SoumissionsComptables — Comparez les cabinets comptables en Côte d'Ivoire" },
      { name: "description", content: "Recevez gratuitement plusieurs soumissions de cabinets comptables qualifiés à Abidjan et partout en Côte d'Ivoire." },
      { property: "og:title", content: "SoumissionsComptables — Comparez les cabinets comptables en Côte d'Ivoire" },
      { property: "og:description", content: "Recevez gratuitement plusieurs soumissions de cabinets comptables qualifiés." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <section className="section container-app">
      <div className="max-w-3xl">
        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
          Côte d'Ivoire
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
          Comparez les cabinets comptables et recevez des soumissions gratuites
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          SoumissionsComptables met en relation les entreprises ivoiriennes avec des cabinets
          comptables qualifiés. Décrivez votre besoin, recevez plusieurs offres, choisissez le bon partenaire.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/demande-soumissions"
            className="inline-flex items-center justify-center rounded-md bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary-dark"
          >
            Demander des soumissions
          </Link>
          <Link
            to="/comment-ca-marche"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted"
          >
            Comment ça marche
          </Link>
        </div>
      </div>
    </section>
  );
}
