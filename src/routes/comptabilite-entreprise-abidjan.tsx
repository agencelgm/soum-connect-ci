import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/comptabilite-entreprise-abidjan")({
  head: () => ({
    meta: [
      { title: "Comptabilité d'entreprise à Abidjan — SoumissionsComptables" },
      { name: "description", content: "Trouvez un cabinet comptable à Abidjan pour la tenue de comptes, la paie et le reporting." },
      { property: "og:title", content: "Comptabilité d'entreprise à Abidjan — SoumissionsComptables" },
      { property: "og:description", content: "Trouvez un cabinet comptable à Abidjan pour la tenue de comptes, la paie et le reporting." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <section className="section container-app">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">Comptabilité d'entreprise à Abidjan</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Trouvez un cabinet comptable à Abidjan pour la tenue de comptes, la paie et le reporting.
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border bg-background-alt p-8 text-sm text-muted-foreground">
        Contenu de cette page à venir.
      </div>
    </section>
  );
}
