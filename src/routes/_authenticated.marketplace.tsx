import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMarketplace, unlockLead, myUnlockedLeads } from "@/lib/marketplace.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace de leads" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const fetchList = useServerFn(listMarketplace);
  const fetchMine = useServerFn(myUnlockedLeads);
  const { data, isLoading } = useQuery({ queryKey: ["marketplace"], queryFn: () => fetchList() });
  const { data: mine } = useQuery({ queryKey: ["my-unlocks"], queryFn: () => fetchMine() });
  const [tab, setTab] = useState<"available" | "mine">("available");

  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;

  if (!data?.partner) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p>Aucun compte partenaire approuvé.</p>
        <Button asChild className="mt-3"><Link to="/espace-partenaire">Retour</Link></Button>
      </div>
    );
  }
  if (data.partner.status !== "approved") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p>Votre compte n'est pas encore activé. Vous ne pouvez pas accéder à la marketplace.</p>
        <Button asChild variant="outline" className="mt-3"><Link to="/espace-partenaire">Retour</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Marketplace de leads</h1>
          <p className="text-sm text-muted-foreground">{data.partner.cabinet_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card px-4 py-3">
            <div className="text-xs uppercase text-muted-foreground">Crédits</div>
            <div className="text-2xl font-bold">{data.partner.credits_balance}</div>
          </div>
          <Button asChild variant={data.partner.credits_balance < 3 ? "default" : "outline"}>
            <Link to="/recharger">Recharger</Link>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "available" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setTab("available")}
        >Leads disponibles ({data.leads.length})</button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "mine" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setTab("mine")}
        >Mes leads débloqués ({mine?.items.length ?? 0})</button>
      </div>

      {tab === "available" && (
        <div className="grid gap-4 md:grid-cols-2">
          {data.leads.length === 0 && (
            <p className="text-muted-foreground col-span-2">Aucun lead disponible pour le moment.</p>
          )}
          {data.leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              alreadyUnlocked={data.unlocked_ids.includes(lead.id)}
              credits={data.partner!.credits_balance}
            />
          ))}
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-3">
          {(mine?.items ?? []).length === 0 && (
            <p className="text-muted-foreground">Vous n'avez encore débloqué aucun lead.</p>
          )}
          {(mine?.items ?? []).map((item) => (
            <UnlockedRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

type Lead = {
  id: string;
  service: string | null;
  city: string | null;
  audience: string;
  legal_form: string | null;
  budget: string | null;
  summary: string | null;
  unlock_count: number;
  max_unlocks: number;
  published_at: string;
};

function LeadCard({ lead, alreadyUnlocked, credits }: { lead: Lead; alreadyUnlocked: boolean; credits: number }) {
  const qc = useQueryClient();
  const unlock = useServerFn(unlockLead);
  const [revealed, setRevealed] = useState<Record<string, string | number | boolean | null> | null>(null);
  const mut = useMutation({
    mutationFn: () => unlock({ data: { publication_id: lead.id } }),
    onSuccess: (res) => {
      setRevealed(res.prospect);
      toast.success(res.already_unlocked ? "Lead déjà débloqué" : "Lead débloqué — 1 crédit utilisé");
      qc.invalidateQueries({ queryKey: ["marketplace"] });
      qc.invalidateQueries({ queryKey: ["my-unlocks"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"),
  });

  const remaining = lead.max_unlocks - lead.unlock_count;

  return (
    <div className="rounded-lg border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{lead.service || "Prestation à définir"}</h3>
          <p className="text-sm text-muted-foreground">
            {lead.city || "Ville non précisée"} · {lead.audience} · {lead.legal_form || "Forme non précisée"}
          </p>
        </div>
        <span className="text-xs rounded-full bg-muted px-2 py-1 whitespace-nowrap">{remaining} place{remaining > 1 ? "s" : ""}</span>
      </div>
      {lead.budget && <p className="text-sm"><strong>Budget :</strong> {lead.budget}</p>}
      {lead.summary && <p className="text-sm text-muted-foreground line-clamp-3">{lead.summary}</p>}

      {revealed ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm space-y-1">
          {revealed.full_name && <p><strong>Nom :</strong> {String(revealed.full_name)}</p>}
          {revealed.company_name && <p><strong>Entreprise :</strong> {String(revealed.company_name)}</p>}
          {revealed.email && <p><strong>Email :</strong> <a className="text-primary underline" href={`mailto:${revealed.email}`}>{String(revealed.email)}</a></p>}
          {revealed.phone && <p><strong>Téléphone :</strong> <a className="text-primary underline" href={`tel:${revealed.phone}`}>{String(revealed.phone)}</a></p>}
          {revealed.message && <p className="pt-2 italic">"{String(revealed.message)}"</p>}
        </div>
      ) : alreadyUnlocked ? (
        <Button variant="outline" onClick={() => mut.mutate()} disabled={mut.isPending}>
          {mut.isPending ? "…" : "Afficher les coordonnées"}
        </Button>
      ) : credits < 1 ? (
        <Button variant="outline" disabled>Recharger pour débloquer</Button>
      ) : (
        <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
          {mut.isPending ? "Déblocage…" : "Débloquer (1 crédit)"}
        </Button>
      )}
    </div>
  );
}

type UnlockedItem = {
  id: string;
  unlocked_at: string;
  publication_id: string;
  service: string | null;
  city: string | null;
  prospect: {
    full_name?: string | null;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
  } | null;
};

function UnlockedRow({ item }: { item: UnlockedItem }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold">{item.service || "Lead"} — {item.city || "—"}</p>
          <p className="text-xs text-muted-foreground">Débloqué le {new Date(item.unlocked_at).toLocaleString("fr-FR")}</p>
        </div>
        <div className="text-right">
          {item.prospect?.email && <a href={`mailto:${item.prospect.email}`} className="text-primary underline block">{item.prospect.email}</a>}
          {item.prospect?.phone && <a href={`tel:${item.prospect.phone}`} className="text-primary underline block">{item.prospect.phone}</a>}
        </div>
      </div>
      {item.prospect?.full_name && <p className="mt-2"><strong>{item.prospect.full_name}</strong>{item.prospect.company_name ? ` · ${item.prospect.company_name}` : ""}</p>}
      {item.prospect?.message && <p className="mt-1 italic text-muted-foreground">"{item.prospect.message}"</p>}
    </div>
  );
}