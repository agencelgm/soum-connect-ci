import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  getMyPartner,
  bootstrapAdmin,
  updateMyPartnerInfo,
  listPartnerMembers,
  addPartnerMember,
  removePartnerMember,
} from "@/lib/partners.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { isUnauthorizedError } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";
import { Trash2, UserPlus, ShieldCheck, KeyRound, LayoutDashboard, Crown, History, Coins } from "lucide-react";

export const Route = createFileRoute("/_authenticated/espace-partenaire")({
  head: () => ({ meta: [{ title: "Espace partenaire" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: EspacePartenaire,
});

function EspacePartenaire() {
  const { user } = useAuth();
  const fetchMe = useServerFn(getMyPartner);
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ["my-partner"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return null;
      return fetchMe();
    },
    enabled: !!user,
    retry: false,
  });

  if (isUnauthorizedError(error)) return <UnauthorizedScreen />;
  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;

  const partner = data?.partner;
  const roles = data?.roles ?? [];
  const isStaff = roles.includes("admin") || roles.includes("agent");
  const isAdmin = roles.includes("admin");
  const isOwner = !!data?.isOwner;
  const userEmail = user?.email ?? data?.profile?.email ?? "";
  const fullName = data?.profile?.full_name ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold">Mon compte</h1>
      </div>

      {isStaff && !partner && (
        <StaffAccountCard fullName={fullName} email={userEmail} isAdmin={isAdmin} />
      )}

      {!partner && !isStaff && (
        <BootstrapOrInscriptionCard onDone={refetch} />
      )}

      {partner && partner.status === "pending_review" && (
        <StatusCard title="Compte en cours d'analyse" tone="warning">
          Merci pour votre inscription. Notre équipe analyse votre dossier et vous contacte
          dans les <strong>24 à 48 heures ouvrables</strong>. Vous recevrez un email dès
          l'activation de votre compte.
        </StatusCard>
      )}
      {partner && partner.status === "rejected" && (
        <StatusCard title="Compte non validé" tone="danger">
          Votre demande n'a pas été retenue.
          {partner.rejection_reason ? <span className="block mt-2 text-sm">Motif : {partner.rejection_reason}</span> : null}
        </StatusCard>
      )}
      {partner && partner.status === "paused" && (
        <StatusCard title="Compte en pause" tone="warning">
          Votre compte est temporairement suspendu.
          {partner.pause_reason ? <span className="block mt-2 text-sm">Motif : {partner.pause_reason}</span> : null}
        </StatusCard>
      )}
      {partner && partner.status === "approved" && (
        <>
          <WelcomeCard partner={partner} />

          <PartnerInfoForm partner={partner} onSaved={refetch} />
          <TeamMembersSection isOwner={isOwner} />
        </>
      )}
    </div>
  );
}

function WelcomeCard({ partner }: { partner: any }) {
  const unlimitedUntilRaw = partner?.unlimited_until as string | null | undefined;
  const unlimitedUntil = unlimitedUntilRaw ? new Date(unlimitedUntilRaw) : null;
  const isUnlimitedActive = !!(unlimitedUntil && unlimitedUntil.getTime() > Date.now());
  const daysLeft = isUnlimitedActive && unlimitedUntil
    ? Math.max(0, Math.ceil((unlimitedUntil.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;
  const formattedDate = unlimitedUntil?.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 space-y-4">
      <h2 className="text-xl font-semibold">Bienvenue, {partner.cabinet_name}</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
          <Coins className="h-6 w-6 text-primary shrink-0" />
          <div>
            <div className="text-xs uppercase text-muted-foreground">Crédits disponibles</div>
            <div className="text-2xl font-bold">{partner.credits_balance}</div>
          </div>
        </div>

        {isUnlimitedActive ? (
          <div className="rounded-lg border border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <div className="text-xs uppercase text-amber-800 font-semibold">Accès illimité</div>
              <div className="text-sm font-semibold text-amber-900">
                Actif jusqu'au {formattedDate}
              </div>
              <div className="text-xs text-amber-800">{daysLeft} jour{daysLeft > 1 ? "s" : ""} restant{daysLeft > 1 ? "s" : ""}</div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
            <Crown className="h-6 w-6 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xs uppercase text-muted-foreground">Accès illimité</div>
              <div className="text-sm text-muted-foreground">
                {unlimitedUntil ? `Expiré le ${formattedDate}` : "Non actif"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/marketplace">Accéder à la marketplace</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/recharger">Recharger mes crédits</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/historique">
            <History className="h-4 w-4 mr-2" />
            Historique des achats
          </Link>
        </Button>
      </div>
    </div>
  );
}

function StaffAccountCard({ fullName, email, isAdmin }: { fullName: string; email: string; isAdmin: boolean }) {
  const initials = (fullName || email || "?")
    .split(/[\s._@-]+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-6 py-5 flex items-center gap-4 border-b">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-lg leading-tight truncate">{fullName || email}</div>
          <div className="text-sm text-muted-foreground truncate">{email}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3 w-3" />
            {isAdmin ? "Administrateur LGM" : "Agent LGM"}
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-base font-semibold">Sécurité du compte</h2>
          <p className="text-sm text-muted-foreground">
            Changez régulièrement votre mot de passe pour protéger l'accès à la console opérateur.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/changer-mot-de-passe">
              <KeyRound className="h-4 w-4 mr-2" />
              Changer mon mot de passe
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Aller au tableau de bord
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PartnerInfoForm({ partner, onSaved }: { partner: any; onSaved: () => void }) {
  const update = useServerFn(updateMyPartnerInfo);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    cabinet_name: partner.cabinet_name ?? "",
    contact_first_name: partner.contact_first_name ?? "",
    contact_last_name: partner.contact_last_name ?? "",
    phone: partner.phone ?? "",
    city: partner.city ?? "",
    website: partner.website ?? "",
    facebook_url: partner.facebook_url ?? "",
  });

  useEffect(() => {
    setForm({
      cabinet_name: partner.cabinet_name ?? "",
      contact_first_name: partner.contact_first_name ?? "",
      contact_last_name: partner.contact_last_name ?? "",
      phone: partner.phone ?? "",
      city: partner.city ?? "",
      website: partner.website ?? "",
      facebook_url: partner.facebook_url ?? "",
    });
  }, [partner.id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await update({ data: form });
      toast.success("Informations mises à jour.");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border bg-card p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Informations du cabinet</h2>
        <p className="text-sm text-muted-foreground">
          Vous et les membres de votre équipe pouvez modifier ces informations.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom du cabinet" value={form.cabinet_name} onChange={(v) => setForm({ ...form, cabinet_name: v })} />
        <Field label="Ville" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field label="Prénom du contact" value={form.contact_first_name} onChange={(v) => setForm({ ...form, contact_first_name: v })} />
        <Field label="Nom du contact" value={form.contact_last_name} onChange={(v) => setForm({ ...form, contact_last_name: v })} />
        <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Site web (optionnel)" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
        <Field label="Page Facebook (optionnel)" value={form.facebook_url} onChange={(v) => setForm({ ...form, facebook_url: v })} />
      </div>
      <div className="text-xs text-muted-foreground">
        Email du compte : <strong>{partner.email}</strong> (non modifiable ici)
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Enregistrement…" : "Enregistrer les modifications"}
      </Button>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TeamMembersSection({ isOwner }: { isOwner: boolean }) {
  const fetchMembers = useServerFn(listPartnerMembers);
  const addMember = useServerFn(addPartnerMember);
  const removeMember = useServerFn(removePartnerMember);
  const { data, refetch } = useQuery({
    queryKey: ["partner-members"],
    queryFn: () => fetchMembers(),
  });
  const members = data?.members ?? [];

  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await addMember({ data: form });
      toast.success(`${form.first_name} a été ajouté à votre équipe.`);
      setForm({ first_name: "", last_name: "", email: "", password: "" });
      setOpen(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Retirer ${name} de l'équipe ?`)) return;
    try {
      await removeMember({ data: { member_id: id } });
      toast.success("Membre retiré.");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Membres de l'équipe</h2>
          <p className="text-sm text-muted-foreground">
            Ajoutez vos collègues pour qu'ils puissent gérer le compte, débloquer des leads et recharger les crédits.
          </p>
        </div>
        {isOwner && (
          <Button onClick={() => setOpen((v) => !v)} variant={open ? "outline" : "default"}>
            <UserPlus className="h-4 w-4 mr-2" />
            {open ? "Annuler" : "Ajouter un membre"}
          </Button>
        )}
      </div>

      {isOwner && open && (
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 rounded-md border bg-muted/30 p-4">
          <Field label="Prénom" value={form.first_name} onChange={(v) => setForm({ ...form, first_name: v })} />
          <Field label="Nom" value={form.last_name} onChange={(v) => setForm({ ...form, last_name: v })} />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <div className="space-y-1.5">
            <Label>Mot de passe (min 8 caractères)</Label>
            <Input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="À communiquer au membre"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Ajout…" : "Créer le compte du membre"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Communiquez l'email et le mot de passe au membre. Il pourra se connecter immédiatement.
            </p>
          </div>
        </form>
      )}

      {members.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun membre ajouté.</p>
      ) : (
        <div className="divide-y border rounded-md">
          {members.map((m: any) => (
            <div key={m.id} className="flex items-center justify-between gap-3 p-3">
              <div>
                <div className="font-medium">{m.first_name} {m.last_name}</div>
                <div className="text-xs text-muted-foreground">{m.email}</div>
              </div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(m.id, `${m.first_name} ${m.last_name}`)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BootstrapOrInscriptionCard({ onDone }: { onDone: () => void }) {
  const bootstrap = useServerFn(bootstrapAdmin);
  const [busy, setBusy] = useState(false);
  async function doBootstrap() {
    setBusy(true);
    try {
      await bootstrap();
      toast.success("Vous êtes maintenant administrateur.");
      onDone();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Aucun cabinet associé</h2>
      <p className="text-muted-foreground text-sm">
        Votre compte n'a pas de profil cabinet. Soit vous souhaitez vous inscrire comme
        partenaire, soit vous êtes le premier administrateur de la plateforme.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/inscription-partenaire">Créer un profil cabinet</Link>
        </Button>
        <Button variant="outline" onClick={doBootstrap} disabled={busy}>
          {busy ? "…" : "Je suis l'administrateur"}
        </Button>
      </div>
    </div>
  );
}

function StatusCard({ title, children, tone }: { title: string; children: React.ReactNode; tone: "success" | "warning" | "danger" }) {
  const toneCls = tone === "success"
    ? "border-emerald-200 bg-emerald-50"
    : tone === "warning"
    ? "border-amber-200 bg-amber-50"
    : "border-red-200 bg-red-50";
  return (
    <div className={`rounded-lg border p-6 ${toneCls}`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="text-sm">{children}</div>
    </div>
  );
}