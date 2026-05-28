import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  listMyChariowPurchases,
  listMyUnlocks,
  listMyActivity,
} from "@/lib/history.functions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Coins, Unlock, Users, Receipt, AlertCircle } from "lucide-react";
import { ReceiptPdfButton } from "@/components/historique/ReceiptPdfButton";

export const Route = createFileRoute("/_authenticated/historique")({
  component: HistoriquePage,
});

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

function HistoriquePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
        <p className="text-muted-foreground mt-1">
          Vos achats de crédits, vos déblocages de leads et l'activité de votre équipe.
        </p>
      </div>

      <Tabs defaultValue="achats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
          <TabsTrigger value="achats" className="gap-2">
            <Receipt className="h-4 w-4" /> Achats
          </TabsTrigger>
          <TabsTrigger value="unlocks" className="gap-2">
            <Unlock className="h-4 w-4" /> Crédits utilisés
          </TabsTrigger>
          <TabsTrigger value="equipe" className="gap-2">
            <Users className="h-4 w-4" /> Activité équipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achats">
          <AchatsTab />
        </TabsContent>
        <TabsContent value="unlocks">
          <UnlocksTab />
        </TabsContent>
        <TabsContent value="equipe">
          <EquipeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// -------------------- Onglet Achats --------------------

function AchatsTab() {
  const fn = useServerFn(listMyChariowPurchases);
  const { data, isLoading, error } = useQuery({
    queryKey: ["history", "purchases"],
    queryFn: () => fn(),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message={(error as Error).message} />;
  const rows = data?.purchases ?? [];
  if (rows.length === 0) {
    return <EmptyBox icon={Receipt} text="Aucun achat de crédits pour le moment." />;
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Pack</TableHead>
            <TableHead className="text-right">Crédits</TableHead>
            <TableHead>Acheteur</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Reçu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap">{formatDateTime(r.processed_at ?? r.received_at)}</TableCell>
              <TableCell className="font-medium">{r.amount_label ?? "—"}</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Coins className="h-3.5 w-3.5 text-primary" /> +{r.credits_granted}
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm">{r.buyer_name}</div>
                {!r.buyer_is_member && (
                  <div className="text-xs text-muted-foreground">{r.email}</div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={r.status === "processed" ? "default" : "secondary"}>
                  {r.status === "processed" ? "Payé" : r.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {r.status === "processed" && (
                  <ReceiptPdfButton paymentId={r.id} licenseCode={r.license_code} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// -------------------- Onglet Crédits utilisés --------------------

function UnlocksTab() {
  const fn = useServerFn(listMyUnlocks);
  const { data, isLoading, error } = useQuery({
    queryKey: ["history", "unlocks"],
    queryFn: () => fn(),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message={(error as Error).message} />;
  const rows = data?.unlocks ?? [];
  if (rows.length === 0) {
    return <EmptyBox icon={Unlock} text="Aucun crédit utilisé pour le moment." />;
  }

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Lead débloqué</TableHead>
            <TableHead>Débloqué par</TableHead>
            <TableHead className="text-right">Crédits</TableHead>
            <TableHead className="text-right">Solde après</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="whitespace-nowrap">{formatDateTime(r.created_at)}</TableCell>
              <TableCell>
                <div className="font-medium">{r.service ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{r.city ?? ""}</div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{r.user_name}</span>
                  {r.user_is_owner && <Badge variant="secondary" className="text-xs">Propriétaire</Badge>}
                </div>
              </TableCell>
              <TableCell className="text-right text-destructive font-semibold">−{r.credits_spent}</TableCell>
              <TableCell className="text-right">{r.balance_after}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// -------------------- Onglet Activité équipe --------------------

function txLabel(tx_type: string): string {
  switch (tx_type) {
    case "purchase":
      return "a rechargé";
    case "unlock_spend":
      return "a débloqué un lead";
    case "signup_bonus":
      return "a reçu le bonus de bienvenue";
    case "admin_adjustment":
      return "ajustement administrateur";
    case "refund":
      return "remboursement";
    default:
      return tx_type;
  }
}

function EquipeTab() {
  const fn = useServerFn(listMyActivity);
  const { data, isLoading, error } = useQuery({
    queryKey: ["history", "activity"],
    queryFn: () => fn(),
  });

  const [memberFilter, setMemberFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const list = data?.activity ?? [];
    return list.filter((a) => {
      if (memberFilter !== "all" && a.user_id !== memberFilter) return false;
      if (typeFilter === "purchase" && a.tx_type !== "purchase") return false;
      if (typeFilter === "unlock_spend" && a.tx_type !== "unlock_spend") return false;
      if (typeFilter === "other" && (a.tx_type === "purchase" || a.tx_type === "unlock_spend")) return false;
      return true;
    });
  }, [data, memberFilter, typeFilter]);

  if (isLoading) return <Loading />;
  if (error) return <ErrorBox message={(error as Error).message} />;

  const members = data?.members ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={memberFilter} onValueChange={setMemberFilter}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Membre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les membres</SelectItem>
            {members.map((m) =>
              m.user_id ? (
                <SelectItem key={m.user_id} value={m.user_id}>
                  {[m.first_name, m.last_name].filter(Boolean).join(" ") || m.email || "—"}
                  {m.is_owner ? " (propriétaire)" : ""}
                </SelectItem>
              ) : null,
            )}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes activités</SelectItem>
            <SelectItem value="purchase">Achats</SelectItem>
            <SelectItem value="unlock_spend">Déblocages</SelectItem>
            <SelectItem value="other">Autres (bonus, ajustements)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyBox icon={Users} text="Aucune activité ne correspond à ces filtres." />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Membre</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Crédits</TableHead>
                <TableHead className="text-right">Solde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="whitespace-nowrap">{formatDateTime(a.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{a.user_name}</span>
                      {a.user_is_owner && <Badge variant="secondary" className="text-xs">Propriétaire</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{txLabel(a.tx_type)}</div>
                    {a.tx_type === "unlock_spend" && (a.service || a.city) && (
                      <div className="text-xs text-muted-foreground">
                        {a.service ?? ""}{a.service && a.city ? " · " : ""}{a.city ?? ""}
                      </div>
                    )}
                    {a.note && a.tx_type !== "unlock_spend" && (
                      <div className="text-xs text-muted-foreground">{a.note}</div>
                    )}
                  </TableCell>
                  <TableCell
                    className={
                      "text-right font-semibold " +
                      (a.amount > 0 ? "text-emerald-600" : a.amount < 0 ? "text-destructive" : "")
                    }
                  >
                    {a.amount > 0 ? "+" : ""}
                    {a.amount}
                  </TableCell>
                  <TableCell className="text-right">{a.balance_after}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

// -------------------- Helpers UI --------------------

function Loading() {
  return <div className="text-center text-muted-foreground py-12">Chargement…</div>;
}

function ErrorBox({ message }: { message: string }) {
  return (
    <Card className="p-6 flex items-start gap-3 border-destructive/40 bg-destructive/5">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <div>
        <div className="font-medium text-destructive">Impossible de charger l'historique</div>
        <div className="text-sm text-muted-foreground mt-1">{message}</div>
      </div>
    </Card>
  );
}

function EmptyBox({ icon: Icon, text }: { icon: typeof Coins; text: string }) {
  return (
    <Card className="py-12 text-center text-muted-foreground">
      <Icon className="h-10 w-10 mx-auto mb-3 opacity-40" />
      <div className="text-sm">{text}</div>
    </Card>
  );
}