import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cabinet-comptable-abidjan")({
  head: () => ({
    meta: [
      { title: "Cabinet comptable à Abidjan — SoumissionsComptables" },
      { name: "description", content: "Sélection de cabinets comptables partenaires basés à Abidjan, prêts à répondre à votre demande." },
      { property: "og:title", content: "Cabinet comptable à Abidjan — SoumissionsComptables" },
      { property: "og:description", content: "Sélection de cabinets comptables partenaires basés à Abidjan, prêts à répondre à votre demande." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Cabinet comptable à Abidjan</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Sélection de cabinets comptables partenaires basés à Abidjan, prêts à répondre à votre demande.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
