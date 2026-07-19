import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getEmailStats } from "@/lib/email-stats.functions";
import { cn } from "@/lib/utils";
import { Mail, AlertTriangle, Ban, UserMinus, Send, CheckCircle2, XCircle, Info } from "lucide-react";

const RANGES: Array<{ label: string; days: number }> = [
  { label: "7 j", days: 7 },
  { label: "30 j", days: 30 },
  { label: "90 j", days: 90 },
];

export function EmailsPanel() {
  const fetchStats = useServerFn(getEmailStats);
  const [days, setDays] = useState(30);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["email-stats", days],
    queryFn: () => fetchStats({ data: { days } }),
    retry: false,
  });

  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;
  if (error) return <p className="text-red-600">Erreur : {(error as Error).message}</p>;
  if (!data) return null;

  const t = data.totals;
  const deliveryRate = t.sent + t.failed + t.dlq + t.bounced > 0
    ? (t.sent / (t.sent + t.failed + t.dlq + t.bounced)) * 100
    : 0;
  const bounceRate = t.sent + t.bounced > 0 ? (t.bounced / (t.sent + t.bounced)) * 100 : 0;

  const templates = ["all", ...data.byTemplate.map((r) => r.template)];
  const filtered = data.recent.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (templateFilter !== "all" && r.template_name !== templateFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Range */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Période :</span>
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setDays(r.days)}
            className={cn(
              "rounded-full border px-3 py-1 text-sm",
              days === r.days
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:border-primary/50",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Kpi icon={Send} label="Envoyés" value={t.sent} tone="text-emerald-700" />
        <Kpi icon={CheckCircle2} label="Taux de livraison" value={`${deliveryRate.toFixed(1)}%`} tone="text-emerald-700" />
        <Kpi icon={XCircle} label="Échecs" value={t.failed + t.dlq} tone="text-red-600" />
        <Kpi icon={AlertTriangle} label="Rebonds" value={t.bounced} tone="text-orange-600" hint={`${bounceRate.toFixed(1)}%`} />
        <Kpi icon={Ban} label="Plaintes spam" value={t.complained} tone="text-red-600" />
        <Kpi icon={UserMinus} label="Désabonnements" value={t.unsubscribed} tone="text-slate-700" />
        <Kpi icon={Mail} label="Emails uniques" value={t.total} tone="text-slate-700" />
        <Kpi icon={AlertTriangle} label="Supprimés (bloqués)" value={t.suppressed} tone="text-amber-700" />
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 flex gap-2">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <span>{data.note}</span>
      </div>

      {/* By template */}
      <section>
        <h3 className="font-semibold mb-2">Par modèle d'email</h3>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2">Modèle</th>
                <th className="px-3 py-2 text-right">Envoyés</th>
                <th className="px-3 py-2 text-right">Échecs</th>
                <th className="px-3 py-2 text-right">Rebonds</th>
              </tr>
            </thead>
            <tbody>
              {data.byTemplate.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">Aucun email envoyé sur la période.</td></tr>
              )}
              {data.byTemplate.map((r) => (
                <tr key={r.template} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{r.template}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.sent}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-red-600">{r.failed || ""}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-orange-600">{r.bounced || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bounces & unsubscribes */}
      <div className="grid gap-4 md:grid-cols-2">
        <section>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            Rebonds & plaintes ({data.bounces.length})
          </h3>
          <div className="rounded-lg border overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <tbody>
                {data.bounces.length === 0 && (
                  <tr><td className="px-3 py-4 text-center text-muted-foreground">Aucun.</td></tr>
                )}
                {data.bounces.map((b) => (
                  <tr key={b.email + b.created_at} className="border-t">
                    <td className="px-3 py-2 truncate">{b.email}</td>
                    <td className="px-3 py-2 text-xs text-orange-700 whitespace-nowrap">{b.reason}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(b.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <UserMinus className="h-4 w-4" />
            Désabonnements ({data.unsubscribes.length})
          </h3>
          <div className="rounded-lg border overflow-hidden max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <tbody>
                {data.unsubscribes.length === 0 && (
                  <tr><td className="px-3 py-4 text-center text-muted-foreground">Aucun.</td></tr>
                )}
                {data.unsubscribes.map((u) => (
                  <tr key={u.email + u.created_at} className="border-t">
                    <td className="px-3 py-2 truncate">{u.email}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Recent log */}
      <section>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-semibold">Journal récent ({filtered.length})</h3>
          <div className="flex gap-2 flex-wrap">
            <select
              value={templateFilter}
              onChange={(e) => setTemplateFilter(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {templates.map((t) => (
                <option key={t} value={t}>{t === "all" ? "Tous les modèles" : t}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="sent">Envoyés</option>
              <option value="failed">Échec</option>
              <option value="dlq">DLQ</option>
              <option value="bounced">Rebond</option>
              <option value="complained">Plainte</option>
              <option value="suppressed">Supprimé</option>
            </select>
          </div>
        </div>
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2">Modèle</th>
                <th className="px-3 py-2">Destinataire</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">Aucune entrée.</td></tr>
              )}
              {filtered.map((r, i) => (
                <tr key={(r.message_id ?? "no-msg") + i} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{r.template_name}</td>
                  <td className="px-3 py-2 truncate max-w-[220px]">{r.recipient_email}</td>
                  <td className="px-3 py-2"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, tone, hint }: { icon: any; label: string; value: string | number; tone: string; hint?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-semibold">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={cn("mt-1 font-mono text-2xl font-bold tabular-nums", tone)}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    sent: "bg-emerald-100 text-emerald-800",
    pending: "bg-slate-100 text-slate-700",
    failed: "bg-red-100 text-red-700",
    dlq: "bg-red-100 text-red-700",
    bounced: "bg-orange-100 text-orange-700",
    complained: "bg-red-100 text-red-700",
    suppressed: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", map[status] ?? "bg-slate-100 text-slate-700")}>
      {status}
    </span>
  );
}