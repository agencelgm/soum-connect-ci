import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Unlock, Phone, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commercialClose, commercialUnlock, getCommercialDashboard } from "@/lib/commercial.functions";

export const Route = createFileRoute("/_authenticated/commercial")({
  head: () => ({
    meta: [
      { title: "Espace commercial — SoumissionComptable.com" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CommercialPage,
});

function fmt(dt: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function CommercialPage() {
  const fn = useServerFn(getCommercialDashboard);
  const unlockFn = useServerFn(commercialUnlock);
  const closeFn = useServerFn(commercialClose);
  const qc = useQueryClient();
  const now = useNow();
  const { data, isLoading, error } = useQuery({
    queryKey: ["commercial-dashboard"],
    queryFn: () => fn(),
    refetchInterval: 30000,
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState("");

  if (isLoading) return <p className="p-8 text-muted-foreground">Chargement…</p>;
  if (error || !data) return <p className="p-8 text-destructive">Accès refusé ou erreur de chargement.</p>;

  const open = data.mine.find((m) => m.prospect_id === data.openProspectId) ?? null;
  const cooldownLeft = data.nextUnlockAt ? Math.max(0, new Date(data.nextUnlockAt).getTime() - now) : 0;
  const canUnlock = !open && cooldownLeft === 0;
  const words = countWords(note);

  async function unlock(id: string) {
    setBusy(id);
    try {
      await unlockFn({ data: { prospect_id: id } });
      toast.success("Prospect débloqué : il vous est attribué");
      setNote("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(null);
      qc.invalidateQueries({ queryKey: ["commercial-dashboard"] });
    }
  }

  async function close(decision: "approved" | "rejected") {
    if (!open) return;
    setBusy("close");
    try {
      await closeFn({ data: { prospect_id: open.prospect_id, note, decision } });
      toast.success(decision === "approved" ? "Prospect approuvé" : "Prospect refusé");
      setNote("");
      qc.invalidateQueries({ queryKey: ["commercial-dashboard"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(null);
    }
  }

  const mm = Math.floor(cooldownLeft / 60000);
  const ss = Math.floor((cooldownLeft % 60000) / 1000).toString().padStart(2, "0");

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold">Espace commercial</h1>
        <p className="text-muted-foreground">
          Débloquez un prospect, appelez-le, puis laissez une note d'au moins 10 mots et votre décision avant de passer au suivant.
        </p>
      </div>

      {open?.prospect && (
        <section className="rounded-xl border-2 border-primary bg-card p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Prospect en cours : {open.prospect.full_name}</h2>
            <span className="text-sm text-muted-foreground">Débloqué le {fmt(open.unlocked_at)}</span>
          </div>
          <ProspectDetails p={open.prospect} />
          <div>
            <label className="text-sm font-medium">Note d'appel (10 mots minimum)</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Besoins, situation, prochaine étape…" />
            <p className={`text-xs mt-1 ${words >= 10 ? "text-primary" : "text-muted-foreground"}`}>{words} / 10 mots</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={words < 10 || busy === "close"} onClick={() => close("approved")}>
              <CheckCircle2 className="h-4 w-4" /> Approuver
            </Button>
            <Button variant="destructive" disabled={words < 10 || busy === "close"} onClick={() => close("rejected")}>
              <XCircle className="h-4 w-4" /> Refuser
            </Button>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">Nouveaux prospects à qualifier ({data.queue.length})</h2>
          {!open && cooldownLeft > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-3 py-1 text-sm">
              <Clock className="h-4 w-4" /> Prochain déblocage dans {mm}:{ss}
            </span>
          )}
          {open && <span className="text-sm text-amber-700">Clôturez le prospect en cours pour débloquer le suivant.</span>}
        </div>
        {data.queue.length === 0 && <p className="text-sm text-muted-foreground">Aucun prospect disponible pour le moment.</p>}
        <div className="grid gap-2 sm:grid-cols-2">
          {data.queue.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{p.full_name || "Prospect"}</div>
                <div className="text-sm text-muted-foreground truncate">{p.service || (p.audience === "creation" ? "Création d'entreprise" : "Demande")}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="h-3 w-3" /> Coordonnées masquées · {fmt(p.created_at)}</div>
              </div>
              <Button size="sm" disabled={!canUnlock || busy === p.id} onClick={() => unlock(p.id)}>
                <Unlock className="h-4 w-4" /> Débloquer
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Historique de mes prospects</h2>
        {data.mine.filter((m) => m.decided_at).length === 0 && <p className="text-sm text-muted-foreground">Aucun prospect clôturé.</p>}
        {data.mine
          .filter((m) => m.decided_at)
          .map((m) => (
            <details key={m.id} className="rounded-lg border bg-card p-3">
              <summary className="cursor-pointer flex flex-wrap items-center gap-2">
                <strong>{m.prospect?.full_name ?? "Prospect"}</strong>
                <span className={`rounded px-2 py-0.5 text-xs ${m.decision === "approved" ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive"}`}>
                  {m.decision === "approved" ? "Approuvé" : "Refusé"}
                </span>
                <span className="text-xs text-muted-foreground">{fmt(m.decided_at)}</span>
              </summary>
              <div className="mt-3 space-y-3">
                {m.prospect && <ProspectDetails p={m.prospect} />}
                <p className="text-sm whitespace-pre-wrap rounded bg-muted p-2">{m.note}</p>
              </div>
            </details>
          ))}
      </section>
    </div>
  );
}

type P = {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  service: string | null;
  city: string | null;
  budget: string | null;
  message: string | null;
  legal_form: string | null;
  answers: Record<string, string>;
};

function ProspectDetails({ p }: { p: P }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex flex-wrap gap-4">
        {p.phone && (
          <a href={`tel:${p.phone}`} className="inline-flex items-center gap-1 text-primary font-semibold"><Phone className="h-4 w-4" />{p.phone}</a>
        )}
        {p.email && (
          <a href={`mailto:${p.email}`} className="inline-flex items-center gap-1 text-primary"><Mail className="h-4 w-4" />{p.email}</a>
        )}
      </div>
      <div className="grid gap-1 sm:grid-cols-2">
        {p.service && <div><span className="text-muted-foreground">Service : </span>{p.service}</div>}
        {p.city && <div><span className="text-muted-foreground">Ville : </span>{p.city}</div>}
        {p.company_name && <div><span className="text-muted-foreground">Entreprise : </span>{p.company_name}</div>}
        {p.budget && <div><span className="text-muted-foreground">Budget : </span>{p.budget}</div>}
        {p.legal_form && <div><span className="text-muted-foreground">Forme : </span>{p.legal_form}</div>}
        {Object.entries(p.answers)
          .filter(([k]) => !["nom", "email", "mobile", "service", "ville", "budget", "description"].includes(k))
          .map(([k, v]) => (
            <div key={k}><span className="text-muted-foreground">{k} : </span>{v}</div>
          ))}
      </div>
      {p.message && <p className="whitespace-pre-wrap rounded bg-muted p-2">{p.message}</p>}
    </div>
  );
}
