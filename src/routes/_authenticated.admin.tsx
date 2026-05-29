import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listPartners,
  listProspects,
  approvePartner,
  rejectPartner,
  pausePartner,
  reactivatePartner,
  deletePartner,
  createPartnerManually,
  adminGrantCredits,
  getMyPartner,
  getAdminDashboardStats,
} from "@/lib/partners.functions";
import { publishProspect } from "@/lib/marketplace.functions";
import { rejectProspect, reactivateProspect, deleteProspect } from "@/lib/prospects.functions";
import {
  listTeam,
  addTeamMember,
  updateTeamRole,
  resetTeamPassword,
  suspendTeamMember,
  unsuspendTeamMember,
  deleteTeamMember,
} from "@/lib/team.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { isUnauthorizedError } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    tab:
      typeof search.tab === "string" &&
      ["partners", "prospects", "create", "team"].includes(search.tab)
        ? (search.tab as "partners" | "prospects" | "create" | "team")
        : undefined,
  }),
  component: AdminPage,
});

function AdminPage() {
  const { user } = useAuth();
  const meFn = useServerFn(getMyPartner);
  const { data: me, error: meError } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return meFn();
    },
    enabled: !!user,
    retry: false,
  });
  const roles = me?.roles ?? [];
  const isStaff = roles.includes("admin") || roles.includes("agent");

  if (isUnauthorizedError(meError)) return <UnauthorizedScreen />;
  if (!isStaff) {
    if (typeof window !== "undefined") {
      window.location.replace("/marketplace");
    }
    return null;
  }

  return <AdminPageInner roles={roles} />;
}

function AdminPageInner({ roles }: { roles: string[] }) {
  const { user } = useAuth();
  const search = useSearch({ from: "/_authenticated/admin" });
  const activeTab = search.tab ?? "partners";
  const listPartnersFn = useServerFn(listPartners);
  const listProspectsFn = useServerFn(listProspects);
  const { data: partnersData, error: partnersError } = useQuery({
    queryKey: ["partners"],
    queryFn: () => listPartnersFn(),
    enabled: !!user,
    retry: false,
  });
  const { data: prospectsData, error: prospectsError } = useQuery({
    queryKey: ["prospects"],
    queryFn: () => listProspectsFn(),
    enabled: !!user,
    retry: false,
  });
  if (isUnauthorizedError(partnersError) || isUnauthorizedError(prospectsError)) {
    return <UnauthorizedScreen />;
  }
  const pendingPartners = (partnersData?.partners ?? []).filter((p: any) => p.status === "pending_review").length;
  const pendingProspects = (prospectsData?.prospects ?? []).filter((p: any) => p.status === "pending_qualification").length;

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Console opérateur — vue d'ensemble de l'activité plateforme.
        </p>
      </div>

      <DashboardKpis />

      <div className="mt-8 min-w-0">
        <SectionHeader tab={activeTab} pendingPartners={pendingPartners} pendingProspects={pendingProspects} />
        <div className="mt-4">
          {activeTab === "partners" && <PartnersPanel isAdmin={roles.includes("admin")} />}
          {activeTab === "prospects" && <ProspectsPanel isAdmin={roles.includes("admin")} />}
          {activeTab === "create" && <CreatePartnerPanel />}
          {activeTab === "team" && roles.includes("admin") && <TeamPanel />}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  tab,
  pendingPartners,
  pendingProspects,
}: {
  tab: "partners" | "prospects" | "create" | "team";
  pendingPartners: number;
  pendingProspects: number;
}) {
  const map = {
    partners: {
      title: "Partenaires",
      subtitle: pendingPartners
        ? `${pendingPartners} cabinet${pendingPartners > 1 ? "s" : ""} en attente de validation`
        : "Tous les cabinets sont à jour.",
    },
    prospects: {
      title: "Prospects",
      subtitle: pendingProspects
        ? `${pendingProspects} prospect${pendingProspects > 1 ? "s" : ""} à qualifier`
        : "Aucun prospect en attente.",
    },
    create: {
      title: "Créer un partenaire",
      subtitle: "Ajouter manuellement un cabinet à la plateforme.",
    },
    team: {
      title: "Équipe LGM",
      subtitle: "Gérer les administrateurs et agents.",
    },
  } as const;
  const { title, subtitle } = map[tab];
  return (
    <div className="border-l-2 border-primary pl-3">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function DashboardKpis() {
  const statsFn = useServerFn(getAdminDashboardStats);
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsFn(),
    retry: false,
  });

  const items = [
    { label: "Prospects à qualifier", value: data?.pendingProspects, accent: "text-amber-600" },
    { label: "Publications actives", value: data?.activePublications, accent: "text-emerald-600" },
    { label: "Cabinets actifs", value: data?.approvedPartners, hint: data?.pendingPartners ? `${data.pendingPartners} en attente` : undefined, accent: "text-primary" },
    { label: "Crédits vendus ce mois", value: data?.creditsThisMonth, accent: "text-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-md border bg-card px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            {it.label}
          </div>
          <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${it.accent}`}>
            {it.value ?? "—"}
          </div>
          {it.hint && (
            <div className="text-[11px] text-muted-foreground mt-0.5">{it.hint}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function PendingBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold animate-pulse">
      {count}
    </span>
  );
}

function PartnersPanel({ isAdmin }: { isAdmin: boolean }) {
  const listFn = useServerFn(listPartners);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["partners"], queryFn: () => listFn() });
  const partners = data?.partners ?? [];

  const buckets = {
    pending_review: partners.filter((p) => p.status === "pending_review"),
    approved: partners.filter((p) => p.status === "approved"),
    paused: partners.filter((p) => p.status === "paused"),
    rejected: partners.filter((p) => p.status === "rejected"),
  };

  if (isLoading) return <p>Chargement…</p>;

  return (
    <Tabs defaultValue="pending_review">
      <TabsList>
        <TabsTrigger value="pending_review">En attente ({buckets.pending_review.length}) <PendingBadge count={buckets.pending_review.length} /></TabsTrigger>
        <TabsTrigger value="approved">Actifs ({buckets.approved.length})</TabsTrigger>
        <TabsTrigger value="paused">En pause ({buckets.paused.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejetés ({buckets.rejected.length})</TabsTrigger>
      </TabsList>
      {(["pending_review", "approved", "paused", "rejected"] as const).map((k) => (
        <TabsContent key={k} value={k} className="mt-4 space-y-3">
          {buckets[k].length === 0 && <p className="text-sm text-muted-foreground">Aucun cabinet.</p>}
          {buckets[k].map((p) => (
            <PartnerCard key={p.id} partner={p} isAdmin={isAdmin} onChange={() => qc.invalidateQueries({ queryKey: ["partners"] })} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
}

function PartnerCard({ partner, isAdmin, onChange }: { partner: any; isAdmin: boolean; onChange: () => void }) {
  const approveFn = useServerFn(approvePartner);
  const rejectFn = useServerFn(rejectPartner);
  const pauseFn = useServerFn(pausePartner);
  const reactivateFn = useServerFn(reactivatePartner);
  const deleteFn = useServerFn(deletePartner);
  const grantFn = useServerFn(adminGrantCredits);
  const [busy, setBusy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try { await fn(); toast.success("Action effectuée"); onChange(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusy(false); }
  }

  return (
    <div className="rounded-lg border p-4 bg-card">
      <div className="flex justify-between flex-wrap gap-2">
        <div>
          <button type="button" onClick={() => setShowDetails(true)} className="font-semibold text-left hover:underline">
            {partner.cabinet_name}
          </button>
          <p className="text-sm text-muted-foreground">
            {partner.contact_first_name} {partner.contact_last_name} · {partner.email} · {partner.phone}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {partner.city} · Crédits : <strong>{partner.credits_balance}</strong>
          </p>
          {partner.services?.length > 0 && (
            <p className="text-xs mt-1">Services : {partner.services.join(", ")}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <Button size="sm" variant="ghost" onClick={() => setShowDetails(true)}>Voir détails</Button>
          {partner.status === "pending_review" && (
            <>
              <Button size="sm" disabled={busy} onClick={() => run(() => approveFn({ data: { partner_id: partner.id } }))}>
                Approuver (+30 crédits)
              </Button>
              <RejectButton disabled={busy} onConfirm={(reason) => run(() => rejectFn({ data: { partner_id: partner.id, reason } }))} />
            </>
          )}
          {partner.status === "approved" && (
            <RejectButton label="Mettre en pause" disabled={busy} onConfirm={(reason) => run(() => pauseFn({ data: { partner_id: partner.id, reason } }))} />
          )}
          {partner.status === "paused" && (
            <Button size="sm" disabled={busy} onClick={() => run(() => reactivateFn({ data: { partner_id: partner.id } }))}>
              Réactiver
            </Button>
          )}
          {isAdmin && partner.status === "approved" && (
            <GrantButton disabled={busy} onConfirm={(amount, note) => run(() => grantFn({ data: { partner_id: partner.id, amount, note } }))} />
          )}
          {isAdmin && (
            <Button size="sm" variant="destructive" disabled={busy} onClick={() => {
              if (confirm("Supprimer ce partenaire ?")) run(() => deleteFn({ data: { partner_id: partner.id } }));
            }}>
              Supprimer
            </Button>
          )}
        </div>
      </div>
      <PartnerDetailsDialog open={showDetails} onClose={() => setShowDetails(false)} partner={partner} />
    </div>
  );
}

function RejectButton({ label = "Rejeter", disabled, onConfirm }: { label?: string; disabled?: boolean; onConfirm: (reason: string) => void }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  if (!open) return <Button size="sm" variant="outline" disabled={disabled} onClick={() => setOpen(true)}>{label}</Button>;
  return (
    <div className="flex gap-1 items-center">
      <Input className="h-8 w-44" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motif" />
      <Button size="sm" disabled={disabled || reason.length < 2} onClick={() => { onConfirm(reason); setOpen(false); setReason(""); }}>OK</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>×</Button>
    </div>
  );
}

function GrantButton({ disabled, onConfirm }: { disabled?: boolean; onConfirm: (amount: number, note?: string) => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [note, setNote] = useState("");
  if (!open) return <Button size="sm" variant="secondary" disabled={disabled} onClick={() => setOpen(true)}>+ Crédits</Button>;
  return (
    <div className="flex gap-1 items-center">
      <Input className="h-8 w-20" type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      <Input className="h-8 w-32" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note" />
      <Button size="sm" disabled={disabled || amount < 1} onClick={() => { onConfirm(amount, note || undefined); setOpen(false); }}>OK</Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>×</Button>
    </div>
  );
}

function ProspectsPanel({ isAdmin }: { isAdmin: boolean }) {
  const listFn = useServerFn(listProspects);
  const qc = useQueryClient();
  const publishFn = useServerFn(publishProspect);
  const rejectFn = useServerFn(rejectProspect);
  const reactivateFn = useServerFn(reactivateProspect);
  const deleteFn = useServerFn(deleteProspect);
  const { data, isLoading } = useQuery({ queryKey: ["prospects"], queryFn: () => listFn() });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending_qualification" | "qualified" | "rejected">("all");
  const [detailsProspect, setDetailsProspect] = useState<any>(null);

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try { await fn(); qc.invalidateQueries({ queryKey: ["prospects"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusyId(null); }
  }

  async function onPublish(prospect_id: string) {
    await run(prospect_id, async () => {
      await publishFn({ data: { prospect_id, max_unlocks: 5 } });
      toast.success("Lead publié dans la marketplace.");
    });
  }
  if (isLoading) return <p>Chargement…</p>;
  const all = data?.prospects ?? [];
  const pendingCount = all.filter((p: any) => p.status === "pending_qualification").length;
  const prospects = filter === "all" ? all : all.filter((p: any) => p.status === filter);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">{prospects.length} prospect(s) affichés (sur {all.length})</p>
        <div className="flex gap-1 text-xs">
          {(["all", "pending_qualification", "qualified", "rejected"] as const).map((k) => (
            <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>
              {k === "all" ? "Tous" : k === "pending_qualification" ? "En attente" : k === "qualified" ? "Qualifiés" : "Rejetés"}
              {k === "pending_qualification" && <PendingBadge count={pendingCount} />}
            </Button>
          ))}
        </div>
      </div>
      {prospects.map((p: any) => (
        <div key={p.id} className={`rounded border p-3 bg-card text-sm ${p.status === "rejected" ? "opacity-60" : ""}`}>
          <div className="flex justify-between flex-wrap gap-2">
            <div>
              <button type="button" onClick={() => setDetailsProspect(p)} className="text-left hover:underline">
                <strong>{p.full_name || "—"}</strong> · {p.email || "—"} · {p.phone || "—"}
              </button>
              <span className="ml-2 inline-block rounded bg-muted px-2 py-0.5 text-xs">{p.audience}</span>
              <span className="ml-1 inline-block rounded bg-muted px-2 py-0.5 text-xs">{p.status}</span>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString("fr-FR")}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {p.service && <>Service : {p.service} · </>}
            {p.city && <>Ville : {p.city} · </>}
            {p.budget && <>Budget : {p.budget} · </>}
            {p.legal_form && <>Forme : {p.legal_form}</>}
          </div>
          {p.message && <p className="mt-1 text-xs italic">"{p.message}"</p>}
          {p.status === "rejected" && p.qualification_notes && (
            <p className="mt-1 text-xs text-destructive">Motif rejet : {p.qualification_notes}</p>
          )}
          <div className="mt-2 flex justify-end gap-2 flex-wrap">
            <Button size="sm" variant="ghost" onClick={() => setDetailsProspect(p)}>Voir détails</Button>
            {p.status !== "rejected" && p.status !== "qualified" && (
              <>
                <Button size="sm" variant="outline" disabled={busyId === p.id} onClick={() => onPublish(p.id)}>
                  {busyId === p.id ? "…" : "Publier comme lead (6 places)"}
                </Button>
                <RejectButton label="Rejeter" disabled={busyId === p.id} onConfirm={(reason) =>
                  run(p.id, async () => { await rejectFn({ data: { prospect_id: p.id, reason } }); toast.success("Prospect rejeté"); })
                } />
              </>
            )}
            {p.status === "rejected" && (
              <Button size="sm" variant="outline" disabled={busyId === p.id} onClick={() =>
                run(p.id, async () => { await reactivateFn({ data: { prospect_id: p.id } }); toast.success("Prospect réactivé"); })
              }>Réactiver</Button>
            )}
            {isAdmin && (
              <Button size="sm" variant="destructive" disabled={busyId === p.id} onClick={() => {
                if (confirm("Supprimer définitivement ce prospect ?")) {
                  run(p.id, async () => { await deleteFn({ data: { prospect_id: p.id } }); toast.success("Prospect supprimé"); });
                }
              }}>Supprimer</Button>
            )}
          </div>
        </div>
      ))}
      <ProspectDetailsDialog prospect={detailsProspect} onClose={() => setDetailsProspect(null)} />
    </div>
  );
}

function CreatePartnerPanel() {
  const createFn = useServerFn(createPartnerManually);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    cabinet_name: "", contact_first_name: "", contact_last_name: "",
    email: "", phone: "", city: "", password: "",
    website: "", facebook_url: "", services: "", zones: "",
  });
  function up<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createFn({
        data: {
          cabinet_name: form.cabinet_name,
          contact_first_name: form.contact_first_name,
          contact_last_name: form.contact_last_name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          password: form.password,
          website: form.website,
          facebook_url: form.facebook_url,
          services: form.services.split(",").map((s) => s.trim()).filter(Boolean),
          zones: form.zones.split(",").map((s) => s.trim()).filter(Boolean),
        },
      });
      toast.success("Partenaire créé (30 crédits attribués)");
      setForm({ cabinet_name: "", contact_first_name: "", contact_last_name: "", email: "", phone: "", city: "", password: "", website: "", facebook_url: "", services: "", zones: "" });
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Création manuelle : le cabinet est immédiatement actif avec 30 crédits. Aucune validation requise.
      </p>
      <div>
        <Label>Nom du cabinet *</Label>
        <Input required value={form.cabinet_name} onChange={(e) => up("cabinet_name", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Prénom *</Label><Input required value={form.contact_first_name} onChange={(e) => up("contact_first_name", e.target.value)} /></div>
        <div><Label>Nom *</Label><Input required value={form.contact_last_name} onChange={(e) => up("contact_last_name", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={(e) => up("email", e.target.value)} /></div>
        <div><Label>Téléphone *</Label><Input required value={form.phone} onChange={(e) => up("phone", e.target.value)} /></div>
      </div>
      <div><Label>Mot de passe initial *</Label><Input type="password" required minLength={8} value={form.password} onChange={(e) => up("password", e.target.value)} /></div>
      <div><Label>Ville *</Label><Input required value={form.city} onChange={(e) => up("city", e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Site web</Label><Input value={form.website} onChange={(e) => up("website", e.target.value)} /></div>
        <div><Label>Facebook</Label><Input value={form.facebook_url} onChange={(e) => up("facebook_url", e.target.value)} /></div>
      </div>
      <div><Label>Services (virgules)</Label><Textarea value={form.services} onChange={(e) => up("services", e.target.value)} /></div>
      <div><Label>Zones (virgules)</Label><Textarea value={form.zones} onChange={(e) => up("zones", e.target.value)} /></div>
      <Button type="submit" disabled={busy}>{busy ? "…" : "Créer le partenaire"}</Button>
    </form>
  );
}

function TeamPanel() {
  const listFn = useServerFn(listTeam);
  const addFn = useServerFn(addTeamMember);
  const updRoleFn = useServerFn(updateTeamRole);
  const resetPwdFn = useServerFn(resetTeamPassword);
  const suspendFn = useServerFn(suspendTeamMember);
  const unsuspendFn = useServerFn(unsuspendTeamMember);
  const deleteFn = useServerFn(deleteTeamMember);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["team"], queryFn: () => listFn() });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [tempPwdDialog, setTempPwdDialog] = useState<{ email: string; pwd: string } | null>(null);
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", role: "agent" as "admin" | "agent" });

  function up<K extends keyof typeof form>(k: K, v: string) { setForm((f) => ({ ...f, [k]: v as any })); }

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try { await fn(); qc.invalidateQueries({ queryKey: ["team"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusyId(null); }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusyId("new");
    try {
      const res = await addFn({ data: form });
      setTempPwdDialog({ email: form.email, pwd: res.temp_password });
      setForm({ email: "", first_name: "", last_name: "", role: "agent" });
      setShowAdd(false);
      qc.invalidateQueries({ queryKey: ["team"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally { setBusyId(null); }
  }

  if (isLoading) return <p>Chargement…</p>;
  const members = data?.members ?? [];
  const me = data?.me;

  return (
    <div className="space-y-4">
      {tempPwdDialog && (
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 space-y-2">
          <p className="font-semibold">Mot de passe temporaire pour {tempPwdDialog.email}</p>
          <p className="text-sm text-muted-foreground">Communique-le au membre. Il devra le changer à sa première connexion. Ce mot de passe ne sera plus affiché.</p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 rounded bg-background border px-3 py-2 font-mono text-sm">{tempPwdDialog.pwd}</code>
            <Button size="sm" onClick={() => { navigator.clipboard.writeText(tempPwdDialog.pwd); toast.success("Copié"); }}>Copier</Button>
            <Button size="sm" variant="ghost" onClick={() => setTempPwdDialog(null)}>Fermer</Button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{members.length} membre(s) staff</p>
        <Button size="sm" onClick={() => setShowAdd((s) => !s)}>
          {showAdd ? "Annuler" : "+ Ajouter un membre"}
        </Button>
      </div>

      {showAdd && (
        <form onSubmit={onAdd} className="rounded-lg border p-4 bg-card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Prénom *</Label><Input required value={form.first_name} onChange={(e) => up("first_name", e.target.value)} /></div>
            <div><Label>Nom *</Label><Input required value={form.last_name} onChange={(e) => up("last_name", e.target.value)} /></div>
          </div>
          <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={(e) => up("email", e.target.value)} /></div>
          <div>
            <Label>Rôle *</Label>
            <div className="flex gap-2 mt-1">
              <Button type="button" size="sm" variant={form.role === "agent" ? "default" : "outline"} onClick={() => up("role", "agent")}>Agent</Button>
              <Button type="button" size="sm" variant={form.role === "admin" ? "default" : "outline"} onClick={() => up("role", "admin")}>Administrateur</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Un mot de passe temporaire sera généré et affiché une seule fois.
            </p>
          </div>
          <Button type="submit" disabled={busyId === "new"}>
            {busyId === "new" ? "Création…" : "Créer le compte"}
          </Button>
        </form>
      )}

      <div className="space-y-2">
        {members.map((m: any) => {
          const isMe = m.user_id === me;
          return (
            <div key={m.user_id} className={`rounded-lg border p-4 bg-card ${m.suspended ? "opacity-60" : ""}`}>
              <div className="flex justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{m.full_name || m.email}</strong>
                    <span className={`inline-block rounded px-2 py-0.5 text-xs ${m.role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      {m.role === "admin" ? "Administrateur" : "Agent"}
                    </span>
                    {m.suspended && <span className="inline-block rounded bg-destructive text-destructive-foreground px-2 py-0.5 text-xs">Suspendu</span>}
                    {m.must_change_password && <span className="inline-block rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-xs">Doit changer mdp</span>}
                    {isMe && <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs">Vous</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{m.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-start">
                  {!isMe && (
                    <Button size="sm" variant="outline" disabled={busyId === m.user_id} onClick={() =>
                      run(m.user_id, async () => {
                        const newRole = m.role === "admin" ? "agent" : "admin";
                        await updRoleFn({ data: { user_id: m.user_id, role: newRole } });
                        toast.success("Rôle modifié");
                      })
                    }>
                      → {m.role === "admin" ? "Agent" : "Admin"}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={busyId === m.user_id} onClick={() => {
                    if (!confirm(`Réinitialiser le mot de passe de ${m.email} ?`)) return;
                    setBusyId(m.user_id);
                    resetPwdFn({ data: { user_id: m.user_id } })
                      .then((res) => { setTempPwdDialog({ email: m.email, pwd: res.temp_password }); })
                      .catch((e) => toast.error(e instanceof Error ? e.message : "Erreur"))
                      .finally(() => setBusyId(null));
                  }}>
                    Reset mdp
                  </Button>
                  {!isMe && (m.suspended ? (
                    <Button size="sm" variant="outline" disabled={busyId === m.user_id} onClick={() =>
                      run(m.user_id, async () => { await unsuspendFn({ data: { user_id: m.user_id } }); toast.success("Réactivé"); })
                    }>Réactiver</Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled={busyId === m.user_id} onClick={() =>
                      run(m.user_id, async () => { await suspendFn({ data: { user_id: m.user_id } }); toast.success("Suspendu"); })
                    }>Suspendre</Button>
                  ))}
                  {!isMe && (
                    <Button size="sm" variant="destructive" disabled={busyId === m.user_id} onClick={() => {
                      if (!confirm(`Supprimer définitivement ${m.email} ? Cette action est irréversible.`)) return;
                      run(m.user_id, async () => { await deleteFn({ data: { user_id: m.user_id } }); toast.success("Membre supprimé"); });
                    }}>Supprimer</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============= Détails Prospect / Partenaire =============

const PROSPECT_FIELD_LABELS: Record<string, string> = {
  logo: "A déjà un logo ?",
  siteWeb: "A déjà un site internet ?",
  bureau: "A un bureau physique ?",
  publicite: "Fait de la publicité ?",
  delai: "Délai souhaité",
  nbAssocies: "Nombre d'associés",
  entreprise: "Nom envisagé pour l'entreprise",
  description: "Description du projet",
  localisation: "Localisation précise",
  statut: "Situation actuelle",
  nom: "Nom",
  mobile: "Téléphone",
  email: "Email",
  service: "Service demandé",
  budget: "Budget",
  audience: "Audience",
  source: "Source",
  consent: "Consentement RGPD",
  upsell_logo: "Offre logo — intéressé ?",
  upsell_logo_at: "Offre logo — répondu le",
  upsell_site: "Offre site internet — intéressé ?",
  upsell_site_at: "Offre site internet — répondu le",
};

const PROSPECT_TECHNICAL_KEYS = new Set([
  "leadId", "tag", "received_at", "submitted_at", "user_agent", "language",
  "page_url", "referrer",
]);

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Oui" : "Non";
  if (typeof v === "object") return JSON.stringify(v, null, 2);
  return String(v);
}

function DetailRow({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm break-words whitespace-pre-wrap">{formatValue(value)}</span>
    </div>
  );
}

function ProspectDetailsDialog({ prospect, onClose }: { prospect: any; onClose: () => void }) {
  if (!prospect) return null;
  const raw = (prospect.raw_payload ?? {}) as Record<string, unknown>;
  const businessKeys = Object.keys(raw).filter((k) => !PROSPECT_TECHNICAL_KEYS.has(k));
  const techKeys = Object.keys(raw).filter((k) => PROSPECT_TECHNICAL_KEYS.has(k));

  return (
    <Dialog open={!!prospect} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{prospect.full_name || prospect.email || "Prospect"}</DialogTitle>
        </DialogHeader>

        <section className="space-y-1">
          <h4 className="font-semibold text-sm mb-2">Informations principales</h4>
          <DetailRow label="Nom complet" value={prospect.full_name} />
          <DetailRow label="Email" value={prospect.email} />
          <DetailRow label="Téléphone" value={prospect.phone} />
          <DetailRow label="Entreprise" value={prospect.company_name} />
          <DetailRow label="Audience" value={prospect.audience} />
          <DetailRow label="Statut" value={prospect.status} />
          <DetailRow label="Service demandé" value={prospect.service} />
          <DetailRow label="Ville" value={prospect.city} />
          <DetailRow label="Budget" value={prospect.budget} />
          <DetailRow label="Forme juridique" value={prospect.legal_form} />
          <DetailRow label="Situation" value={prospect.statut} />
          <DetailRow label="Message" value={prospect.message} />
          <DetailRow label="Type de formulaire" value={prospect.form_type} />
          <DetailRow label="Reçu le" value={new Date(prospect.created_at).toLocaleString("fr-FR")} />
          {prospect.qualification_notes && (
            <DetailRow label="Notes qualification" value={prospect.qualification_notes} />
          )}
        </section>

        {businessKeys.length > 0 && (
          <section className="space-y-1 mt-4">
            <h4 className="font-semibold text-sm mb-2">Réponses détaillées du formulaire</h4>
            {businessKeys.map((k) => (
              <DetailRow key={k} label={PROSPECT_FIELD_LABELS[k] ?? k} value={raw[k]} />
            ))}
          </section>
        )}

        {techKeys.length > 0 && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Métadonnées techniques ({techKeys.length})
            </summary>
            <div className="mt-2">
              {techKeys.map((k) => (
                <DetailRow key={k} label={k} value={raw[k]} />
              ))}
            </div>
          </details>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PartnerDetailsDialog({ open, onClose, partner }: { open: boolean; onClose: () => void; partner: any }) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner.cabinet_name}</DialogTitle>
        </DialogHeader>

        <section className="space-y-1">
          <h4 className="font-semibold text-sm mb-2">Cabinet</h4>
          <DetailRow label="Nom du cabinet" value={partner.cabinet_name} />
          <DetailRow label="Statut" value={partner.status} />
          <DetailRow label="Crédits" value={partner.credits_balance} />
          <DetailRow label="Ville" value={partner.city} />
          <DetailRow label="Site web" value={partner.website} />
          <DetailRow label="Facebook" value={partner.facebook_url} />
          <DetailRow label="Services" value={partner.services?.join(", ")} />
          <DetailRow label="Zones d'intervention" value={partner.zones?.join(", ")} />
        </section>

        <section className="space-y-1 mt-4">
          <h4 className="font-semibold text-sm mb-2">Contact</h4>
          <DetailRow label="Prénom" value={partner.contact_first_name} />
          <DetailRow label="Nom" value={partner.contact_last_name} />
          <DetailRow label="Email" value={partner.email} />
          <DetailRow label="Téléphone" value={partner.phone} />
        </section>

        <section className="space-y-1 mt-4">
          <h4 className="font-semibold text-sm mb-2">Historique</h4>
          <DetailRow label="Inscrit le" value={new Date(partner.created_at).toLocaleString("fr-FR")} />
          {partner.approved_at && <DetailRow label="Approuvé le" value={new Date(partner.approved_at).toLocaleString("fr-FR")} />}
          {partner.paused_at && <DetailRow label="Mis en pause le" value={new Date(partner.paused_at).toLocaleString("fr-FR")} />}
          {partner.pause_reason && <DetailRow label="Motif pause" value={partner.pause_reason} />}
          {partner.rejected_at && <DetailRow label="Rejeté le" value={new Date(partner.rejected_at).toLocaleString("fr-FR")} />}
          {partner.rejection_reason && <DetailRow label="Motif rejet" value={partner.rejection_reason} />}
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}