import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Questions fréquentes — SoumissionsComptables" },
      { name: "description", content: "Toutes les réponses sur le fonctionnement, les tarifs et la sélection des cabinets partenaires." },
      { property: "og:title", content: "Questions fréquentes — SoumissionsComptables" },
      { property: "og:description", content: "Toutes les réponses sur le fonctionnement, les tarifs et la sélection des cabinets partenaires." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Questions fréquentes</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Toutes les réponses sur le fonctionnement, les tarifs et la sélection des cabinets partenaires.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
