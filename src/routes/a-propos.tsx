import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos de SoumissionsComptables — SoumissionsComptables" },
      { name: "description", content: "Notre mission : simplifier l'accès à la comptabilité professionnelle en Côte d'Ivoire." },
      { property: "og:title", content: "À propos de SoumissionsComptables — SoumissionsComptables" },
      { property: "og:description", content: "Notre mission : simplifier l'accès à la comptabilité professionnelle en Côte d'Ivoire." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">À propos de SoumissionsComptables</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Notre mission : simplifier l'accès à la comptabilité professionnelle en Côte d'Ivoire.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
