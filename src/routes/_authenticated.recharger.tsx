import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyPartner } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/recharger")({
  head: () => ({
    meta: [{ title: "Recharger mes crédits" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: RechargerPage,
});

function RechargerPage() {
  const meFn = useServerFn(getMyPartner);
  const { data } = useQuery({ queryKey: ["my-partner"], queryFn: () => meFn() });
  const partner = data?.partner;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Recharger mes crédits</h1>
          <p className="text-sm text-muted-foreground">
            Les crédits sont ajoutés par l'équipe admin après validation interne.
          </p>
        </div>
        {partner && (
          <div className="rounded-lg border bg-card px-4 py-3">
            <div className="text-xs uppercase text-muted-foreground">Solde actuel</div>
            <div className="text-2xl font-bold">{partner.credits_balance} crédits</div>
          </div>
        )}
      </div>

      <div className="rounded-lg border bg-card p-5 text-sm space-y-3">
        <p className="font-semibold">Recharge gérée par l'administrateur</p>
        <p>
          Cette plateforme n'accepte pas de recharge partenaire en self-service. Demandez à un
          administrateur d'ajouter des crédits à votre compte depuis le tableau de bord admin.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="outline">
            <Link to="/marketplace">Retour à la marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
