import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Crown, Users } from "lucide-react";
import { getProspectUnlockers } from "@/lib/partner-activity.functions";

function fmt(dt: string) {
  return new Date(dt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function delay(from: string | null, to: string) {
  if (!from) return null;
  const ms = new Date(to).getTime() - new Date(from).getTime();
  if (ms < 0) return null;
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min après publication`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} h ${min % 60} min après publication`;
  return `${Math.floor(h / 24)} j après publication`;
}

export function ProspectUnlockersPanel({ prospectId }: { prospectId: string }) {
  const fn = useServerFn(getProspectUnlockers);
  const { data, isLoading } = useQuery({
    queryKey: ["prospect-unlockers", prospectId],
    queryFn: () => fn({ data: { prospect_id: prospectId } }),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Chargement des déblocages…</p>;
  }
  if (!data?.publication) {
    return (
      <p className="text-sm text-muted-foreground">
        Ce prospect n'a pas encore été publié dans la marketplace.
      </p>
    );
  }

  const pub = data.publication as any;
  const max = pub.max_unlocks ?? 5;
  const list = data.unlockers ?? [];
  const premiumActive = pub.premium_until && new Date(pub.premium_until) > new Date();

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4" />
          Agences ayant débloqué ce prospect
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
            {list.length} / {max}
          </span>
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Publié le {fmt(pub.published_at)}</span>
          <span>· {Math.max(0, max - list.length)} place(s) restante(s)</span>
          {premiumActive && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
              Fenêtre premium active
            </span>
          )}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Aucune agence n'a encore débloqué les coordonnées.
        </p>
      ) : (
        <ol className="mt-3 space-y-2">
          {list.map((u: any) => (
            <li
              key={`${u.position}-${u.unlocked_at}`}
              className="flex flex-wrap items-start justify-between gap-2 rounded-md border bg-muted/30 p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold">
                  <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {u.position}
                  </span>
                  {u.partner?.cabinet_name ?? "Cabinet supprimé"}
                  {u.partner?.tier === "premium" && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      ★ Premium
                    </span>
                  )}
                  {u.partner?.unlimited_until &&
                    new Date(u.partner.unlimited_until) > new Date() && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-amber-600 bg-gradient-to-r from-amber-400 to-yellow-500 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-950">
                        <Crown className="h-3 w-3" /> Illimité
                      </span>
                    )}
                </p>
                {u.partner && (
                  <p className="text-xs text-muted-foreground">
                    {u.partner.contact_first_name} {u.partner.contact_last_name} ·{" "}
                    {u.partner.email} · {u.partner.phone}
                    {u.partner.city ? ` · ${u.partner.city}` : ""}
                  </p>
                )}
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{fmt(u.unlocked_at)}</div>
                <div>{delay(pub.published_at, u.unlocked_at)}</div>
                <div>
                  {u.credits_spent > 0 ? `${u.credits_spent} crédit(s)` : "Accès illimité"}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
