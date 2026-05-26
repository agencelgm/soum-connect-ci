import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyPartner } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/recharger")({
  head: () => ({ meta: [{ title: "Recharger mes crédits" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: RechargerPage,
});

const PACKS = [
  { credits: 10, price: "15 000 FCFA", popular: false },
  { credits: 25, price: "35 000 FCFA", popular: true },
  { credits: 60, price: "75 000 FCFA", popular: false },
];

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
            Choisissez un pack et finalisez le paiement sécurisé.
          </p>
        </div>
        {partner && (
          <div className="rounded-lg border bg-card px-4 py-3">
            <div className="text-xs uppercase text-muted-foreground">Solde actuel</div>
            <div className="text-2xl font-bold">{partner.credits_balance} crédits</div>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PACKS.map((pack) => (
          <div
            key={pack.credits}
            className={`rounded-lg border bg-card p-6 space-y-4 relative ${pack.popular ? "border-primary shadow-md" : ""}`}
          >
            {pack.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-3 py-0.5 text-xs font-semibold">
                Le plus choisi
              </span>
            )}
            <div>
              <div className="text-4xl font-bold">{pack.credits}</div>
              <div className="text-sm text-muted-foreground">crédits</div>
            </div>
            <div className="text-2xl font-semibold">{pack.price}</div>
            <p className="text-xs text-muted-foreground">
              1 crédit = 1 lead débloqué (coordonnées complètes).
            </p>
            <Button className="w-full" disabled>
              Bientôt disponible
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm space-y-2">
        <p className="font-semibold">Paiement en cours d'intégration</p>
        <p>
          Le paiement en ligne via Chariow sera disponible très prochainement. En attendant,
          contactez-nous pour recharger manuellement votre compte — vos crédits sont crédités
          sous quelques heures ouvrables.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <a href="mailto:contact@soumissioncomptable.com?subject=Recharge%20cr%C3%A9dits%20partenaire">
              Recharger par email
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link to="/marketplace">Retour à la marketplace</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}