import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/creation-entreprise-diaspora-ivoirienne")({
  head: () => ({
    meta: [
      { title: "Création d'entreprise — Diaspora ivoirienne — SoumissionsComptables" },
      { name: "description", content: "Lancez votre entreprise en Côte d'Ivoire depuis l'étranger grâce à nos cabinets partenaires." },
      { property: "og:title", content: "Création d'entreprise — Diaspora ivoirienne — SoumissionsComptables" },
      { property: "og:description", content: "Lancez votre entreprise en Côte d'Ivoire depuis l'étranger grâce à nos cabinets partenaires." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Création d'entreprise — Diaspora ivoirienne</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Lancez votre entreprise en Côte d'Ivoire depuis l'étranger grâce à nos cabinets partenaires.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
