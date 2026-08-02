import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getPartnerUnlockHistory } from "@/lib/partner-activity.functions";

function fmt(dt: string) {
  return new Date(dt).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PartnerUnlocksDialog({
  partnerId,
  cabinetName,
  open,
  onClose,
}: {
  partnerId: string;
  cabinetName: string;
  open: boolean;
  onClose: () => void;
}) {
  const fn = useServerFn(getPartnerUnlockHistory);
  const { data, isLoading } = useQuery({
    queryKey: ["partner-unlocks", partnerId],
    queryFn: () => fn({ data: { partner_id: partnerId } }),
    enabled: open,
  });

  const items = data?.items ?? [];
  const credits = items.reduce((s: number, i: any) => s + (i.credits_spent ?? 0), 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Prospects débloqués — {cabinetName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ce cabinet n'a débloqué aucun prospect pour l'instant.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {items.length} prospect(s) débloqué(s) · {credits} crédit(s) consommé(s)
            </p>
            <div className="max-h-[60vh] overflow-y-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left">Débloqué le</th>
                    <th className="p-2 text-left">Prospect</th>
                    <th className="p-2 text-left">Service</th>
                    <th className="p-2 text-left">Ville</th>
                    <th className="p-2 text-right">Crédits</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i: any) => (
                    <tr key={i.id} className="border-t">
                      <td className="p-2 whitespace-nowrap">{fmt(i.unlocked_at)}</td>
                      <td className="p-2">
                        <div className="font-medium">{i.prospect_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {[i.prospect_email, i.prospect_phone].filter(Boolean).join(" · ")}
                        </div>
                      </td>
                      <td className="p-2">{i.service ?? "—"}</td>
                      <td className="p-2">{i.city ?? "—"}</td>
                      <td className="p-2 text-right">
                        {i.credits_spent > 0 ? i.credits_spent : "Illimité"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
