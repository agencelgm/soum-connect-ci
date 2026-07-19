import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import {
  Ban,
  AlertTriangle,
  UserMinus,
  Search,
  Trash2,
  Plus,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  addSuppression,
  checkSuppression,
  listSuppressions,
  removeSuppression,
} from "@/lib/email-suppression.functions";

type ReasonFilter = "all" | "bounce" | "complaint" | "unsubscribe";

const REASON_LABEL: Record<string, string> = {
  bounce: "Rebond",
  complaint: "Plainte spam",
  unsubscribe: "Désabonnement",
};

const REASON_STYLE: Record<string, string> = {
  bounce: "bg-orange-100 text-orange-800",
  complaint: "bg-red-100 text-red-800",
  unsubscribe: "bg-slate-100 text-slate-700",
};

export function SuppressionPanel({ isAdmin }: { isAdmin: boolean }) {
  const listFn = useServerFn(listSuppressions);
  const addFn = useServerFn(addSuppression);
  const removeFn = useServerFn(removeSuppression);
  const checkFn = useServerFn(checkSuppression);
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [reason, setReason] = useState<ReasonFilter>("all");

  const [newEmail, setNewEmail] = useState("");
  const [newReason, setNewReason] = useState<"bounce" | "complaint" | "unsubscribe">("bounce");
  const [newNote, setNewNote] = useState("");

  const [checkEmail, setCheckEmail] = useState("");
  const [checkResult, setCheckResult] = useState<
    { suppressed: boolean; email: string; reason?: string } | null
  >(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["suppressions", search, reason],
    queryFn: () => listFn({ data: { search: search || undefined, reason } }),
    retry: false,
  });

  const addMut = useMutation({
    mutationFn: () =>
      addFn({
        data: {
          email: newEmail.trim(),
          reason: newReason,
          note: newNote.trim() || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Adresse ajoutée à la liste d'exclusion.");
      setNewEmail("");
      setNewNote("");
      qc.invalidateQueries({ queryKey: ["suppressions"] });
    },
    onError: (e) => toast.error((e as Error).message || "Erreur"),
  });

  const removeMut = useMutation({
    mutationFn: (email: string) => removeFn({ data: { email } }),
    onSuccess: () => {
      toast.success("Adresse retirée. Les envois reprendront normalement.");
      qc.invalidateQueries({ queryKey: ["suppressions"] });
    },
    onError: (e) => toast.error((e as Error).message || "Erreur"),
  });

  const checkMut = useMutation({
    mutationFn: () => checkFn({ data: { email: checkEmail.trim() } }),
    onSuccess: (res) => {
      setCheckResult({
        suppressed: res.suppressed,
        email: checkEmail.trim(),
        reason: res.row?.reason,
      });
    },
    onError: (e) => toast.error((e as Error).message || "Erreur"),
  });

  const counts = data?.counts;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Kpi icon={Ban} label="Total exclus" value={counts?.total ?? "—"} tone="text-slate-800" />
        <Kpi icon={AlertTriangle} label="Rebonds" value={counts?.bounce ?? "—"} tone="text-orange-700" />
        <Kpi icon={AlertTriangle} label="Plaintes spam" value={counts?.complaint ?? "—"} tone="text-red-700" />
        <Kpi icon={UserMinus} label="Désabonnements" value={counts?.unsubscribe ?? "—"} tone="text-slate-700" />
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
        Toute adresse figurant ici est <strong>bloquée</strong> : plus aucun email transactionnel
        ne lui sera envoyé. Les rebonds définitifs et plaintes sont ajoutés automatiquement par
        Mailgun. Vous pouvez aussi exclure ou réintégrer une adresse manuellement.
      </div>

      {/* Quick check */}
      <section className="rounded-lg border p-4 bg-card">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Search className="h-4 w-4" /> Vérifier une adresse
        </h3>
        <div className="flex gap-2 flex-wrap">
          <input
            type="email"
            value={checkEmail}
            onChange={(e) => setCheckEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="rounded-md border px-3 py-2 text-sm flex-1 min-w-[220px]"
          />
          <button
            onClick={() => checkMut.mutate()}
            disabled={!checkEmail.includes("@") || checkMut.isPending}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Vérifier
          </button>
        </div>
        {checkResult && (
          <div
            className={cn(
              "mt-3 rounded-md p-3 text-sm flex items-start gap-2",
              checkResult.suppressed
                ? "bg-red-50 text-red-800 border border-red-200"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200",
            )}
          >
            {checkResult.suppressed ? (
              <ShieldAlert className="h-4 w-4 mt-0.5" />
            ) : (
              <ShieldCheck className="h-4 w-4 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">{checkResult.email}</div>
              <div>
                {checkResult.suppressed
                  ? `Bloqué (${REASON_LABEL[checkResult.reason ?? ""] ?? checkResult.reason}). Aucun email ne partira.`
                  : "Non bloqué. Les envois fonctionnent normalement."}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Manual add */}
      <section className="rounded-lg border p-4 bg-card">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Exclure une adresse manuellement
        </h3>
        <div className="grid gap-2 md:grid-cols-[1fr_180px_1fr_auto]">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <select
            value={newReason}
            onChange={(e) => setNewReason(e.target.value as any)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="bounce">Rebond</option>
            <option value="complaint">Plainte spam</option>
            <option value="unsubscribe">Désabonnement</option>
          </select>
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Note (optionnel)"
            className="rounded-md border px-3 py-2 text-sm"
          />
          <button
            onClick={() => addMut.mutate()}
            disabled={!newEmail.includes("@") || addMut.isPending}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </section>

      {/* Filters + list */}
      <section>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-semibold">
            Adresses exclues {data ? `(${data.rows.length})` : ""}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un email…"
              className="rounded-md border px-3 py-1 text-sm"
            />
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReasonFilter)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="all">Toutes les raisons</option>
              <option value="bounce">Rebonds</option>
              <option value="complaint">Plaintes spam</option>
              <option value="unsubscribe">Désabonnements</option>
            </select>
          </div>
        </div>

        {isLoading && <p className="text-muted-foreground">Chargement…</p>}
        {error && <p className="text-red-600">Erreur : {(error as Error).message}</p>}

        {data && (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Raison</th>
                  <th className="px-3 py-2">Source / note</th>
                  <th className="px-3 py-2">Ajouté le</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                      Aucune adresse exclue.
                    </td>
                  </tr>
                )}
                {data.rows.map((r) => {
                  const meta = (r.metadata ?? {}) as Record<string, any>;
                  const source = meta.source ?? "webhook";
                  const note = meta.note as string | undefined;
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2 truncate max-w-[260px]">{r.email}</td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            REASON_STYLE[r.reason],
                          )}
                        >
                          {REASON_LABEL[r.reason] ?? r.reason}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">
                        <div className="font-mono">{String(source)}</div>
                        {note && <div className="text-slate-600">{note}</div>}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {isAdmin ? (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Retirer ${r.email} de la liste d'exclusion ? Les envois reprendront.`,
                                )
                              ) {
                                removeMut.mutate(r.email);
                              }
                            }}
                            disabled={removeMut.isPending}
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 text-red-700 px-2 py-1 text-xs hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" /> Retirer
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Admin uniquement</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string | number;
  tone: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-semibold">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={cn("mt-1 font-mono text-2xl font-bold tabular-nums", tone)}>{value}</div>
    </div>
  );
}