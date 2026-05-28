import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMarketplace, unlockLead, myUnlockedLeads } from "@/lib/marketplace.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { isUnauthorizedError } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";
import { MapPin, Building2, Wallet, Users, Lock, Sparkles, Clock, Unlock, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({ meta: [{ title: "Marketplace de leads" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const { user } = useAuth();
  const fetchList = useServerFn(listMarketplace);
  const fetchMine = useServerFn(myUnlockedLeads);
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) return null;
      return fetchList();
    },
    enabled: !!user,
    retry: false,
  });
  const { data: mine, error: mineError } = useQuery({
    queryKey: ["my-unlocks"],
    queryFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) return { items: [] };
      return fetchMine();
    },
    enabled: !!user,
    retry: false,
  });
  const [tab, setTab] = useState<"available" | "mine">("available");

  if (isUnauthorizedError(error) || isUnauthorizedError(mineError)) {
    return <UnauthorizedScreen />;
  }
  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;

  if (!data?.partner) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p>Aucun compte partenaire approuvé.</p>
        <Button asChild className="mt-3"><Link to="/marketplace">Retour</Link></Button>
      </div>
    );
  }
  if (data.partner.status !== "approved") {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p>Votre compte n'est pas encore activé. Vous ne pouvez pas accéder à la marketplace.</p>
        <Button asChild variant="outline" className="mt-3"><Link to="/marketplace">Retour</Link></Button>
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
  delai: string | null;
};

function LeadCard({ lead, alreadyUnlocked, credits }: { lead: Lead; alreadyUnlocked: boolean; credits: number }) {
  const qc = useQueryClient();
  const unlock = useServerFn(unlockLead);
  const [revealed, setRevealed] = useState<{
    full_name?: string | null;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
  } | null>(null);
  const mut = useMutation({
    mutationFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) throw new Error("Veuillez vous reconnecter.");
      return unlock({ data: { publication_id: lead.id } });
    },
    onSuccess: (res) => {
      setRevealed(res.prospect);
      toast.success(res.already_unlocked ? "Lead déjà débloqué" : "Lead débloqué — 1 crédit utilisé");
      qc.invalidateQueries({ queryKey: ["marketplace"] });
      qc.invalidateQueries({ queryKey: ["my-unlocks"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"),
  });

  const remaining = lead.max_unlocks - lead.unlock_count;
  const ageHours = Math.max(0, Math.floor((Date.now() - new Date(lead.published_at).getTime()) / 36e5));
  const isFresh = ageHours < 48;
  const timeAgo = ageHours < 1
    ? "à l'instant"
    : ageHours < 24
      ? `il y a ${ageHours} h`
      : `il y a ${Math.floor(ageHours / 24)} j`;
  const fillRatio = lead.unlock_count / lead.max_unlocks;
  const urgencyColor = remaining <= 1 ? "bg-red-500" : remaining <= 3 ? "bg-orange-500" : "bg-emerald-500";
  const urgencyText = remaining <= 1 ? "text-red-600" : remaining <= 3 ? "text-orange-600" : "text-emerald-700";
  const audienceLabel = lead.audience === "particulier" ? "Particulier" : lead.audience === "entreprise" ? "Entreprise" : "À qualifier";

  return (
    <div className="group rounded-xl border bg-card p-5 space-y-4 transition-all hover:shadow-lg hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {isFresh && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-primary/10 text-primary px-2 py-0.5">
                <Sparkles className="h-3 w-3" /> Nouveau
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> Publié {timeAgo}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-tight">{lead.service || "Prestation à définir"}</h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-xs font-semibold rounded-full bg-muted px-2.5 py-1 whitespace-nowrap ${urgencyText}`}>
            {remaining} place{remaining > 1 ? "s" : ""} sur {lead.max_unlocks}
          </span>
          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
            <div className={`h-full ${urgencyColor} transition-all`} style={{ width: `${Math.min(100, fillRatio * 100)}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-foreground/80">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{lead.city || "Ville non précisée"}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{audienceLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{lead.legal_form || "Forme non précisée"}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate font-medium">{lead.budget || "Budget non précisé"}</span>
        </div>
        {lead.delai && (
          <div className="flex items-center gap-2 text-foreground/80 col-span-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate"><span className="text-muted-foreground">Démarrage :</span> {lead.delai}</span>
          </div>
        )}
      </div>

      {lead.summary && (
        <blockquote className="border-l-4 border-primary/60 bg-muted/40 px-3 py-2 text-sm italic text-foreground/80 rounded-r">
          « {lead.summary} »
        </blockquote>
      )}

      {revealed ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm space-y-1">
          {revealed.full_name && <p><strong>Nom :</strong> {String(revealed.full_name)}</p>}
          {revealed.company_name && <p><strong>Entreprise :</strong> {String(revealed.company_name)}</p>}
          {revealed.email && <p><strong>Email :</strong> <a className="text-primary underline" href={`mailto:${revealed.email}`}>{String(revealed.email)}</a></p>}
          {revealed.phone && <p><strong>Téléphone :</strong> <a className="text-primary underline" href={`tel:${revealed.phone}`}>{String(revealed.phone)}</a></p>}
          {revealed.message && <p className="pt-2 italic">"{String(revealed.message)}"</p>}
        </div>
      ) : alreadyUnlocked ? (
        <Button variant="outline" size="lg" className="w-full" onClick={() => mut.mutate()} disabled={mut.isPending}>
          <Unlock className="h-4 w-4 mr-2" />
          {mut.isPending ? "…" : "Afficher les coordonnées"}
        </Button>
      ) : credits < 1 ? (
        <div className="space-y-1">
          <Button asChild variant="default" size="lg" className="w-full">
            <Link to="/recharger">Recharger pour débloquer</Link>
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">Crédits insuffisants</p>
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          <Button onClick={() => mut.mutate()} disabled={mut.isPending} size="lg" className="w-full font-semibold shadow-sm">
            <Lock className="h-4 w-4 mr-2" />
            {mut.isPending ? "Déblocage…" : "Débloquer ce lead (1 crédit)"}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            Vous obtiendrez : nom, email, téléphone et message complet
          </p>
        </div>
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