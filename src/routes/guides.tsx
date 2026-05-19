import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Guides et ressources — SoumissionsComptables" },
      { name: "description", content: "Articles, guides pratiques et conseils pour gérer votre comptabilité en Côte d'Ivoire." },
      { property: "og:title", content: "Guides et ressources — SoumissionsComptables" },
      { property: "og:description", content: "Articles, guides pratiques et conseils pour gérer votre comptabilité en Côte d'Ivoire." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Guides et ressources</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Articles, guides pratiques et conseils pour gérer votre comptabilité en Côte d'Ivoire.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
