import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyPartner, bootstrapAdmin } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/espace-partenaire")({
  head: () => ({
    meta: [{ title: "Espace partenaire" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: EspacePartenaire,
});

function EspacePartenaire() {
  const fetchMe = useServerFn(getMyPartner);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-partner"],
    queryFn: () => fetchMe(),
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;

  const partner = data?.partner;
  const roles = data?.roles ?? [];
  const isStaff = roles.includes("admin") || roles.includes("agent");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Espace partenaire</h1>
        {isStaff && (
          <Button asChild>
            <Link to="/admin">Tableau de bord admin</Link>
          </Button>
        )}
      </div>

      {!partner && !isStaff && <BootstrapOrInscriptionCard onDone={refetch} />}

      {partner && partner.status === "pending_review" && (
        <StatusCard title="Compte en cours d'analyse" tone="warning">
          Merci pour votre inscription. Notre équipe analyse votre dossier et vous contacte dans les{" "}
          <strong>24 à 48 heures ouvrables</strong>. Vous recevrez un email dès l'activation de
          votre compte.
        </StatusCard>
      )}
      {partner && partner.status === "rejected" && (
        <StatusCard title="Compte non validé" tone="danger">
          Votre demande n'a pas été retenue.
          {partner.rejection_reason ? (
            <span className="block mt-2 text-sm">Motif : {partner.rejection_reason}</span>
          ) : null}
        </StatusCard>
      )}
      {partner && partner.status === "paused" && (
        <StatusCard title="Compte en pause" tone="warning">
          Votre compte est temporairement suspendu.
          {partner.pause_reason ? (
            <span className="block mt-2 text-sm">Motif : {partner.pause_reason}</span>
          ) : null}
        </StatusCard>
      )}
      {partner && partner.status === "approved" && (
        <StatusCard title={`Bienvenue, ${partner.cabinet_name}`} tone="success">
          <p>
            Crédits disponibles : <strong>{partner.credits_balance}</strong>
          </p>
          <div className="mt-3">
            <Button asChild>
              <Link to="/marketplace">Accéder à la marketplace</Link>
            </Button>
          </div>
        </StatusCard>
      )}
    </div>
  );
}

function BootstrapOrInscriptionCard({ onDone }: { onDone: () => void }) {
  const bootstrap = useServerFn(bootstrapAdmin);
  const [busy, setBusy] = useState(false);
  async function doBootstrap() {
    setBusy(true);
    try {
      await bootstrap();
      toast.success("Vous êtes maintenant administrateur.");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Aucun cabinet associé</h2>
      <p className="text-muted-foreground text-sm">
        Votre compte n'a pas de profil cabinet. Soit vous souhaitez vous inscrire comme partenaire,
        soit vous êtes le premier administrateur de la plateforme.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/inscription-partenaire">Créer un profil cabinet</Link>
        </Button>
        <Button variant="outline" onClick={doBootstrap} disabled={busy}>
          {busy ? "…" : "Je suis l'administrateur"}
        </Button>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone: "success" | "warning" | "danger";
}) {
  const toneCls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-red-200 bg-red-50";
  return (
    <div className={`rounded-lg border p-6 ${toneCls}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-sm">{children}</div>
    </div>
  );
}
