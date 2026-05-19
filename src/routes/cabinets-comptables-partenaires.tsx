import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cabinets-comptables-partenaires")({
  head: () => ({
    meta: [
      { title: "Cabinets comptables partenaires — SoumissionsComptables" },
      { name: "description", content: "Vous êtes cabinet comptable ? Rejoignez notre réseau et recevez des demandes qualifiées." },
      { property: "og:title", content: "Cabinets comptables partenaires — SoumissionsComptables" },
      { property: "og:description", content: "Vous êtes cabinet comptable ? Rejoignez notre réseau et recevez des demandes qualifiées." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Cabinets comptables partenaires</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Vous êtes cabinet comptable ? Rejoignez notre réseau et recevez des demandes qualifiées.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
