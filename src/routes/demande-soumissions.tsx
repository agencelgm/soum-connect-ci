import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demande-soumissions")({
  head: () => ({
    meta: [
      { title: "Demander des soumissions — SoumissionsComptables" },
      { name: "description", content: "Remplissez votre besoin et recevez gratuitement plusieurs offres de cabinets comptables qualifiés." },
      { property: "og:title", content: "Demander des soumissions — SoumissionsComptables" },
      { property: "og:description", content: "Remplissez votre besoin et recevez gratuitement plusieurs offres de cabinets comptables qualifiés." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Demander des soumissions</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Remplissez votre besoin et recevez gratuitement plusieurs offres de cabinets comptables qualifiés.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
