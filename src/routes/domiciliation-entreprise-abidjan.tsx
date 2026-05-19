import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/domiciliation-entreprise-abidjan")({
  head: () => ({
    meta: [
      { title: "Domiciliation d'entreprise à Abidjan — SoumissionsComptables" },
      { name: "description", content: "Comparez les offres de domiciliation commerciale et siège social à Abidjan." },
      { property: "og:title", content: "Domiciliation d'entreprise à Abidjan — SoumissionsComptables" },
      { property: "og:description", content: "Comparez les offres de domiciliation commerciale et siège social à Abidjan." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Domiciliation d'entreprise à Abidjan</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Comparez les offres de domiciliation commerciale et siège social à Abidjan.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
