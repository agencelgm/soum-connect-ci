import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProspectComments } from "@/components/prospects/ProspectComments";
import { toast } from "sonner";
import { Phone, Mail, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commercialClose, getCommercialDashboard } from "@/lib/commercial.functions";

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

function CommercialPage() {
  const fn = useServerFn(getCommercialDashboard);
  const { data, isLoading, error } = useQuery({
    queryKey: ["commercial-dashboard"],
    queryFn: () => fn(),
    refetchInterval: 60000,
  });

  if (isLoading) return <p className="p-8 text-muted-foreground">Chargement…</p>;
  if (error || !data) return <p className="p-8 text-destructive">Accès refusé ou erreur de chargement.</p>;

  const todo = data.mine.filter((m) => !m.decided_at);
  const done = data.mine.filter((m) => m.decided_at);

  return (
    <div className="space-y-8 py-6">
      <div>
        <h1 className="text-3xl font-bold">Espace commercial</h1>
        <p className="text-muted-foreground">
          Vos prospects sont attribués automatiquement. Appelez-les, enregistrez vos commentaires, puis approuvez ou refusez.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">À traiter ({todo.length})</h2>
        {todo.length === 0 && <p className="text-sm text-muted-foreground">Aucun prospect à traiter pour le moment.</p>}
        {todo.map((m) => (
          <AssignedCard key={m.id} item={m} />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Traités ({done.length})</h2>
        {done.map((m) => (
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
              <ProspectComments prospectId={m.prospect_id} />
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}

type Item = Awaited<ReturnType<typeof getCommercialDashboard>>["mine"][number];

function AssignedCard({ item }: { item: Item }) {
  const closeFn = useServerFn(commercialClose);
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const words = countWords(note);

  async function close(decision: "approved" | "rejected") {
    setBusy(true);
    try {
      await closeFn({ data: { prospect_id: item.prospect_id, note, decision } });
      toast.success(decision === "approved" ? "Prospect approuvé" : "Prospect refusé");
      qc.invalidateQueries({ queryKey: ["commercial-dashboard"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">{item.prospect?.full_name ?? "Prospect"}</h3>
        <span className="text-sm text-muted-foreground">Attribué le {fmt(item.assigned_at)}</span>
      </div>
      {item.prospect && <ProspectDetails p={item.prospect} />}
      <ProspectComments prospectId={item.prospect_id} />
      <div className="border-t pt-4">
        <label className="text-sm font-medium">Note de décision (10 mots minimum)</label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
        <p className={`text-xs mt-1 ${words >= 10 ? "text-primary" : "text-muted-foreground"}`}>{words} / 10 mots</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button disabled={words < 10 || busy} onClick={() => close("approved")}>
            <CheckCircle2 className="h-4 w-4" /> Approuver
          </Button>
          <Button variant="destructive" disabled={words < 10 || busy} onClick={() => close("rejected")}>
            <XCircle className="h-4 w-4" /> Refuser
          </Button>
        </div>
      </div>
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
