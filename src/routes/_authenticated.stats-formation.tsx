import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getFormationFunnelStats } from "@/lib/funnel-stats.functions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FunnelStats } from "@/lib/funnel-stats.functions";

export const Route = createFileRoute("/_authenticated/stats-formation")({
  head: () => ({
    meta: [
      { title: "Statistiques formation | SoumissionComptable.com" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StatsFormationPage,
});

function pct(a: number, b: number) {
  if (!b) return "0 %";
  return `${((a / b) * 100).toFixed(1)} %`;
}

function exportCsv(rows: FunnelStats["people"], variant: string) {
  const header = ["Nom", "Email", "Téléphone", "Variante", "Choix", "Achat", "Date"];
  const body = rows.map((p) => [
    p.name ?? "",
    p.email ?? "",
    p.phone ?? "",
    p.variant,
    p.choice ?? "",
    p.purchased ? "oui" : "non",
    new Date(p.created_at).toLocaleString("fr-FR"),
  ]);
  const csv = [header, ...body]
    .map((line) => line.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `formation-variante-${variant}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function PeopleTable({ rows }: { rows: FunnelStats["people"] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50 text-left">
          <tr>
            <th className="p-2">Nom</th>
            <th className="p-2">Email</th>
            <th className="p-2">Téléphone</th>
            <th className="p-2">Choix</th>
            <th className="p-2">Achat</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={`${p.created_at}-${i}`} className="border-t">
              <td className="p-2">{p.name ?? "—"}</td>
              <td className="p-2">{p.email ?? "—"}</td>
              <td className="p-2">{p.phone ?? "—"}</td>
              <td className="p-2">{p.choice === "oui" ? "Oui" : p.choice === "non" ? "Non" : "—"}</td>
              <td className="p-2 font-semibold">{p.purchased ? "Acheté" : "—"}</td>
              <td className="p-2 whitespace-nowrap">{new Date(p.created_at).toLocaleString("fr-FR")}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-center text-muted-foreground">
                Aucun prospect pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatsFormationPage() {
  const fn = useServerFn(getFormationFunnelStats);
  const { data, isLoading, error } = useQuery({
    queryKey: ["formation-funnel-stats"],
    queryFn: () => fn(),
    retry: false,
  });

  if (isLoading) return <p className="p-6 text-muted-foreground">Chargement…</p>;
  if (error) return <p className="p-6 text-destructive">Accès refusé ou erreur de chargement.</p>;
  if (!data) return null;

  const t = data.totals;
  const views = t["page_view"] ?? 0;
  const plays = t["video_play"] ?? 0;
  const completes = t["video_complete"] ?? 0;
  const yes = t["choice_yes"] ?? 0;
  const no = t["choice_no"] ?? 0;
  const purchases = t["purchase"] ?? 0;
  const failed = t["purchase_failed"] ?? 0;
  const abandoned = t["purchase_abandoned"] ?? 0;
  const refunded = t["purchase_refunded"] ?? 0;

  const cards = [
    { label: "Arrivées sur la page", value: views, sub: `${data.uniqueSessions} sessions uniques` },
    { label: "Ont lancé la vidéo", value: plays, sub: `${pct(plays, views)} des arrivées` },
    { label: "Vidéo terminée", value: completes, sub: `${pct(completes, plays)} des lectures` },
    { label: "« Oui, je veux la formation »", value: yes, sub: `${pct(yes, views)} des arrivées` },
    { label: "« Non merci »", value: no, sub: `${pct(no, views)} des arrivées` },
    { label: "Achats confirmés", value: purchases, sub: `${pct(purchases, yes)} des clics « Oui »` },
    { label: "Achats abandonnés", value: abandoned, sub: "Chariow" },
    { label: "Achats échoués", value: failed, sub: "Chariow" },
    { label: "Remboursements", value: refunded, sub: "Chariow" },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      <header>
        <h1 className="font-heading text-2xl md:text-3xl font-bold">Statistiques — page Formation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Taux de conversion global : <strong>{pct(purchases, views)}</strong> (achats / arrivées)
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-3xl font-extrabold">{c.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{c.sub}</p>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-lg font-bold">Test A/B — destination du bouton « Oui »</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.variants.map((v) => (
            <Card key={v.variant} className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {v.label}
              </p>
              <p className="mt-2 text-3xl font-extrabold">{v.yes}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                clics « Oui » sur {v.sessions} prospects — {pct(v.yes, v.sessions)} · {v.purchases} achat(s)
                confirmé(s)
              </p>
            </Card>
          ))}
        </div>
        {data.variants.map((v) => {
          const rows = data.people.filter((p) => p.variant === v.variant);
          return (
            <div key={v.variant} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">Envoyés en version {v.variant}</h3>
                <Button size="sm" variant="outline" onClick={() => exportCsv(rows, v.variant)}>
                  Export CSV
                </Button>
              </div>
              <PeopleTable rows={rows} />
            </div>
          );
        })}
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-bold">30 derniers jours</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2">Jour</th>
                <th className="p-2">Arrivées</th>
                <th className="p-2">Vidéo lancée</th>
                <th className="p-2">Oui</th>
                <th className="p-2">Non</th>
                <th className="p-2">Achats</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((d) => (
                <tr key={d.day} className="border-t">
                  <td className="p-2">{d.day}</td>
                  <td className="p-2">{d.page_view}</td>
                  <td className="p-2">{d.video_play}</td>
                  <td className="p-2">{d.choice_yes}</td>
                  <td className="p-2">{d.choice_no}</td>
                  <td className="p-2 font-semibold">{d.purchase}</td>
                </tr>
              ))}
              {data.daily.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Aucune donnée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-heading text-lg font-bold">Derniers événements</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Événement</th>
                <th className="p-2">Email</th>
                <th className="p-2">Montant</th>
              </tr>
            </thead>
            <tbody>
              {data.recent.map((r, i) => (
                <tr key={`${r.created_at}-${i}`} className="border-t">
                  <td className="p-2 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-2">{r.event}</td>
                  <td className="p-2">{r.email ?? "—"}</td>
                  <td className="p-2">{r.amount_label ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
