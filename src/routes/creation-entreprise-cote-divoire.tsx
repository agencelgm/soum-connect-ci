import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/creation-entreprise-cote-divoire")({
  head: () => ({
    meta: [
      { title: "Création d'entreprise en Côte d'Ivoire — SoumissionsComptables" },
      { name: "description", content: "Soumissions pour l'immatriculation, les statuts et le démarrage de votre entreprise en Côte d'Ivoire." },
      { property: "og:title", content: "Création d'entreprise en Côte d'Ivoire — SoumissionsComptables" },
      { property: "og:description", content: "Soumissions pour l'immatriculation, les statuts et le démarrage de votre entreprise en Côte d'Ivoire." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Création d'entreprise en Côte d'Ivoire</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Soumissions pour l'immatriculation, les statuts et le démarrage de votre entreprise en Côte d'Ivoire.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
