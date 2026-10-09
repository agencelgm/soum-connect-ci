import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Rocket, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProspectComments } from "@/components/prospects/ProspectComments";
import {
  assignUnassignedProspects,
  reassignProspect,
  getProspectAssignment,
  listLowContactPublications,
  reboostPublication,
} from "@/lib/commercial.functions";

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function ReboostPanel() {
  const fn = useServerFn(listLowContactPublications);
  const boostFn = useServerFn(reboostPublication);
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["low-contact"], queryFn: () => fn() });

  async function boost(id: string) {
    setBusy(id);
    try {
      await boostFn({ data: { publication_id: id } });
      toast.success("Prospect remis en tête de la Marketplace");
      qc.invalidateQueries({ queryKey: ["low-contact"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Prospects peu contactés</h2>
        <p className="text-sm text-muted-foreground">
          Débloqués par moins de 2 cabinets. Ils sont remis en tête automatiquement tous les 2 jours ; vous pouvez aussi le faire tout de suite.
        </p>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Chargement…</p>}
      {data && data.items.length === 0 && <p className="text-sm text-muted-foreground">Aucun prospect à rebooster.</p>}
      <div className="space-y-2">
        {data?.items.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <strong>{p.full_name || "Prospect"}</strong>
                <span className={`rounded px-2 py-0.5 text-xs ${p.unlock_count === 0 ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-700"}`}>
                  {p.unlock_count === 0 ? "Jamais contacté" : `Peu contacté (${p.unlock_count})`}
                </span>
                {p.boost_count > 0 && (
                  <span className="rounded bg-muted px-2 py-0.5 text-xs">{p.boost_count} reboost(s) · dernier {fmt(p.last_boosted_at)}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {p.service ?? "—"} · {p.city ?? "—"} · publié le {fmt(p.published_at)}
              </p>
            </div>
            <Button size="sm" disabled={busy === p.id} onClick={() => boost(p.id)}>
              <Rocket className="h-4 w-4" /> Rebooster
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProspectCommercialPanel({ prospectId }: { prospectId: string }) {
  const fn = useServerFn(getProspectAssignment);
  const reassignFn = useServerFn(reassignProspect);
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["prospect-assignment", prospectId],
    queryFn: () => fn({ data: { prospect_id: prospectId } }),
  });
  const a = data?.assignment;

  async function reassign(commercialId: string) {
    try {
      await reassignFn({ data: { prospect_id: prospectId, commercial_id: commercialId } });
      toast.success("Prospect attribué");
      qc.invalidateQueries({ queryKey: ["prospect-assignment", prospectId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-3 mb-3">
      <div className="flex flex-wrap items-center gap-2">
        <UserCheck className="h-4 w-4" />
        <span className="font-semibold">Commercial : {a?.commercial_name ?? "Non attribué"}</span>
        {a && <span className="text-muted-foreground">({a.assigned_by ? "manuel" : "auto"}, {fmt(a.assigned_at)})</span>}
        {(data?.commercials.length ?? 0) > 0 && (
          <select
            className="ml-auto rounded border bg-background px-2 py-1"
            value=""
            onChange={(e) => e.target.value && reassign(e.target.value)}
          >
            <option value="">{a ? "Réattribuer à…" : "Attribuer à…"}</option>
            {data?.commercials.filter((c) => c.id !== a?.commercial_id).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>
      {a?.decided_at && (
        <div>
          <p>Décision : <strong>{a.decision === "approved" ? "Approuvé" : "Refusé"}</strong> ({fmt(a.decided_at)})</p>
          <p className="whitespace-pre-wrap">{a.note}</p>
        </div>
      )}
      <ProspectComments prospectId={prospectId} />
    </div>
  );
}

export function AssignBacklogButton() {
  const fn = useServerFn(assignUnassignedProspects);
  const [busy, setBusy] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const r = await fn();
          toast.success(`${r.assigned} prospect(s) attribué(s)`);
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Erreur");
        } finally {
          setBusy(false);
        }
      }}
    >
      Attribuer les prospects non attribués
    </Button>
  );
}
