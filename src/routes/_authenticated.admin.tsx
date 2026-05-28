import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

function AdminPage() {
  const meFn = useServerFn(getMyPartner);
  const { data: me } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return meFn();
    },
    retry: false,
  });
  const roles = me?.roles ?? [];
  const isStaff = roles.includes("admin") || roles.includes("agent");

  if (!isStaff) {
    return <p className="text-muted-foreground">Accès réservé à l'équipe.</p>;
  }

  return <AdminPageInner roles={roles} />;
}

function AdminPageInner({ roles }: { roles: string[] }) {
  const listPartnersFn = useServerFn(listPartners);
  const listProspectsFn = useServerFn(listProspects);
  const { data: partnersData } = useQuery({ queryKey: ["partners"], queryFn: () => listPartnersFn() });
  const { data: prospectsData } = useQuery({ queryKey: ["prospects"], queryFn: () => listProspectsFn() });
  const pendingPartners = (partnersData?.partners ?? []).filter((p: any) => p.status === "pending_review").length;
  const pendingProspects = (prospectsData?.prospects ?? []).filter((p: any) => p.status === "pending_qualification").length;

  return (
    <div className="min-w-0">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      <Tabs defaultValue="partners">
        <div className="-mx-4 sm:mx-0 overflow-x-auto px-4 sm:px-0">
          <TabsList className="w-max flex-nowrap">
            <TabsTrigger value="partners">Partenaires <PendingBadge count={pendingPartners} /></TabsTrigger>
            <TabsTrigger value="prospects">Prospects <PendingBadge count={pendingProspects} /></TabsTrigger>
            <TabsTrigger value="create">+ Créer un partenaire</TabsTrigger>
            {roles.includes("admin") && <TabsTrigger value="team">Équipe</TabsTrigger>}
          </TabsList>
        </div>
        <TabsContent value="partners" className="mt-6 min-w-0"><PartnersPanel isAdmin={roles.includes("admin")} /></TabsContent>
        <TabsContent value="prospects" className="mt-6 min-w-0"><ProspectsPanel isAdmin={roles.includes("admin")} /></TabsContent>
        <TabsContent value="create" className="mt-6 min-w-0"><CreatePartnerPanel /></TabsContent>
        {roles.includes("admin") && (
          <TabsContent value="team" className="mt-6 min-w-0"><TeamPanel /></TabsContent>
        )}
      </Tabs>
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
          <h3 className="font-semibold">{partner.cabinet_name}</h3>
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
          {partner.status === "pending_review" && (
            <>
              <Button size="sm" disabled={busy} onClick={() => run(() => approveFn({ data: { partner_id: partner.id } }))}>
                Approuver (+10 crédits)
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

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try { await fn(); qc.invalidateQueries({ queryKey: ["prospects"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusyId(null); }
  }

  async function onPublish(prospect_id: string) {
    await run(prospect_id, async () => {
      await publishFn({ data: { prospect_id, max_unlocks: 6 } });
      toast.success("Lead publié dans la marketplace.");
    });
  }
  if (isLoading) return <p>Chargement…</p>;
  const all = data?.prospects ?? [];
  const prospects = filter === "all" ? all : all.filter((p: any) => p.status === filter);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">{prospects.length} prospect(s) affichés (sur {all.length})</p>
        <div className="flex gap-1 text-xs">
          {(["all", "pending_qualification", "qualified", "rejected"] as const).map((k) => (
            <Button key={k} size="sm" variant={filter === k ? "default" : "outline"} onClick={() => setFilter(k)}>
              {k === "all" ? "Tous" : k === "pending_qualification" ? "En attente" : k === "qualified" ? "Qualifiés" : "Rejetés"}
            </Button>
          ))}
        </div>
      </div>
      {prospects.map((p: any) => (
        <div key={p.id} className={`rounded border p-3 bg-card text-sm ${p.status === "rejected" ? "opacity-60" : ""}`}>
          <div className="flex justify-between flex-wrap gap-2">
            <div>
              <strong>{p.full_name || "—"}</strong> · {p.email || "—"} · {p.phone || "—"}
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
      toast.success("Partenaire créé (10 crédits attribués)");
      setForm({ cabinet_name: "", contact_first_name: "", contact_last_name: "", email: "", phone: "", city: "", password: "", website: "", facebook_url: "", services: "", zones: "" });
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl">
      <p className="text-sm text-muted-foreground">
        Création manuelle : le cabinet est immédiatement actif avec 10 crédits. Aucune validation requise.
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