import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPartnerActivityStats } from "@/lib/partner-activity.functions";
import { PartnerUnlocksDialog } from "./PartnerUnlocksDialog";
import { cn } from "@/lib/utils";

type Preset = "today" | "yesterday" | "7d" | "30d" | "custom";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

function rangeFor(preset: Preset, customFrom: string, customTo: string) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case "today":
      return { from: startOfToday.toISOString(), to: now.toISOString() };
    case "yesterday": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 1);
      return { from: start.toISOString(), to: startOfToday.toISOString() };
    }
    case "7d": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 6);
      return { from: start.toISOString(), to: now.toISOString() };
    }
    case "30d": {
      const start = new Date(startOfToday);
      start.setDate(start.getDate() - 29);
      return { from: start.toISOString(), to: now.toISOString() };
    }
    case "custom":
    default: {
      const from = customFrom ? new Date(`${customFrom}T00:00:00`) : startOfToday;
      const to = customTo ? new Date(`${customTo}T23:59:59`) : now;
      return { from: from.toISOString(), to: to.toISOString() };
    }
  }
}

type SortKey = "unlocks" | "credits_spent" | "last_unlock_at" | "cabinet_name";

export function PartnerActivityPanel() {
  const [preset, setPreset] = useState<Preset>("7d");
  const [customFrom, setCustomFrom] = useState(isoDay(new Date()));
  const [customTo, setCustomTo] = useState(isoDay(new Date()));
  const [sortKey, setSortKey] = useState<SortKey>("unlocks");
  const [openPartner, setOpenPartner] = useState<{ id: string; name: string } | null>(null);

  const range = useMemo(
    () => rangeFor(preset, customFrom, customTo),
    [preset, customFrom, customTo],
  );

  const fn = useServerFn(getPartnerActivityStats);
  const { data, isLoading } = useQuery({
    queryKey: ["partner-activity", range.from, range.to],
    queryFn: () => fn({ data: range }),
  });

  const rows = useMemo(() => {
    const list = [...(data?.rows ?? [])];
    list.sort((a: any, b: any) => {
      if (sortKey === "cabinet_name") return a.cabinet_name.localeCompare(b.cabinet_name);
      if (sortKey === "last_unlock_at")
        return String(b.last_unlock_at ?? "").localeCompare(String(a.last_unlock_at ?? ""));
      return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
    });
    return list;
  }, [data, sortKey]);

  const totals = data?.totals;

  function exportCsv() {
    const header = [
      "Cabinet",
      "Ville",
      "Statut",
      "Niveau",
      "Deblocages",
      "Credits consommes",
      "Jours actifs",
      "Moy/jour actif",
      "1ers a debloquer",
      "Dernier deblocage",
      "Solde credits",
    ];
    const lines = rows.map((r: any) =>
      [
        r.cabinet_name,
        r.city ?? "",
        r.status,
        tierLabel(r),
        r.unlocks,
        r.credits_spent,
        r.active_days,
        r.active_days ? (r.unlocks / r.active_days).toFixed(2) : "0",
        r.first_positions,
        r.last_unlock_at ? new Date(r.last_unlock_at).toLocaleString("fr-FR") : "",
        r.credits_balance,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\ufeff" + [header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activite-partenaires-${range.from.slice(0, 10)}_${range.to.slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      {/* Période */}
      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
        {(
          [
            ["today", "Aujourd'hui"],
            ["yesterday", "Hier"],
            ["7d", "7 derniers jours"],
            ["30d", "30 derniers jours"],
            ["custom", "Personnalisé"],
          ] as [Preset, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPreset(key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              preset === key ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {label}
          </button>
        ))}
        {preset === "custom" && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2"
            />
            <span className="text-muted-foreground">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2"
            />
          </div>
        )}
        <div className="ml-auto">
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Déblocages" value={totals?.unlocks ?? 0} />
        <Kpi label="Agences actives" value={totals?.active_partners ?? 0} />
        <Kpi label="Crédits consommés" value={totals?.credits ?? 0} />
        <Kpi label="Prospects publiés" value={totals?.published ?? 0} />
        <Kpi label="Moy. agences / prospect" value={totals?.avg_per_prospect ?? 0} />
      </div>

      {/* Classement */}
      <div className="rounded-lg border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
          <h3 className="text-sm font-semibold">Classement des agences</h3>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="unlocks">Trier par déblocages</option>
            <option value="credits_spent">Trier par crédits consommés</option>
            <option value="last_unlock_at">Trier par dernier déblocage</option>
            <option value="cabinet_name">Trier par nom</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Chargement…</p>
          ) : rows.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">
              Aucun déblocage sur cette période.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-2 text-left">Cabinet</th>
                  <th className="p-2 text-right">Déblocages</th>
                  <th className="p-2 text-right">Crédits</th>
                  <th className="p-2 text-right">Fréquence</th>
                  <th className="p-2 text-right">1ers</th>
                  <th className="p-2 text-left">Dernier déblocage</th>
                  <th className="p-2 text-right">Solde</th>
                  <th className="p-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((r: any) => (
                  <tr key={r.partner_id} className="border-t">
                    <td className="p-2">
                      <div className="font-medium">
                        {r.cabinet_name}
                        {r.tier === "premium" && (
                          <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            ★ Premium
                          </span>
                        )}
                        {r.unlimited_until && new Date(r.unlimited_until) > new Date() && (
                          <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-600 bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-950">
                            <Crown className="h-3 w-3" /> Illimité
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {[r.city, r.email].filter(Boolean).join(" · ")}
                      </div>
                    </td>
                    <td className="p-2 text-right font-semibold">{r.unlocks}</td>
                    <td className="p-2 text-right">{r.credits_spent}</td>
                    <td className="p-2 text-right text-xs">
                      {r.active_days
                        ? `${(r.unlocks / r.active_days).toFixed(1)}/jour · ${r.active_days} j actifs`
                        : "—"}
                    </td>
                    <td className="p-2 text-right text-xs">{r.first_positions}</td>
                    <td className="p-2 whitespace-nowrap text-xs">
                      {r.last_unlock_at
                        ? new Date(r.last_unlock_at).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="p-2 text-right">{r.credits_balance}</td>
                    <td className="p-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setOpenPartner({ id: r.partner_id, name: r.cabinet_name })
                        }
                      >
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inactifs */}
      <div className="rounded-lg border bg-card p-3">
        <h3 className="text-sm font-semibold">
          Agences approuvées sans déblocage sur la période ({data?.inactive?.length ?? 0})
        </h3>
        {(data?.inactive ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Toutes les agences approuvées ont été actives.
          </p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {(data?.inactive ?? []).map((r: any) => (
              <button
                key={r.partner_id}
                type="button"
                onClick={() => setOpenPartner({ id: r.partner_id, name: r.cabinet_name })}
                className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
                title={[r.email, r.phone].filter(Boolean).join(" · ")}
              >
                {r.cabinet_name} · {r.credits_balance} cr.
              </button>
            ))}
          </div>
        )}
      </div>

      {openPartner && (
        <PartnerUnlocksDialog
          partnerId={openPartner.id}
          cabinetName={openPartner.name}
          open
          onClose={() => setOpenPartner(null)}
        />
      )}
    </div>
  );
}

function tierLabel(r: any) {
  if (r.unlimited_until && new Date(r.unlimited_until) > new Date()) return "Illimité";
  return r.tier === "premium" ? "Premium" : "Régulier";
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
