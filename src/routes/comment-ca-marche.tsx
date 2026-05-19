import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — SoumissionsComptables" },
      { name: "description", content: "Découvrez en 3 étapes comment recevoir et comparer vos soumissions de cabinets comptables." },
      { property: "og:title", content: "Comment ça marche — SoumissionsComptables" },
      { property: "og:description", content: "Découvrez en 3 étapes comment recevoir et comparer vos soumissions de cabinets comptables." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Comment ça marche</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Découvrez en 3 étapes comment recevoir et comparer vos soumissions de cabinets comptables.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
