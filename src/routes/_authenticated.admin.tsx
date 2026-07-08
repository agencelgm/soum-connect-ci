import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { computeDuplicates, normalizeText, type DuplicateInfo } from "@/lib/duplicates";

// Filters for upsell interest (logo / website) and age of the record.
type BoolFilter = "all" | "yes" | "no" | "unknown";
type AgeFilter = "all" | "new" | "recent" | "old";

function matchBoolFilter(value: unknown, filter: BoolFilter): boolean {
  if (filter === "all") return true;
  const norm =
    value === true || value === "oui" || value === "yes" || value === 1 || value === "1"
      ? "yes"
      : value === false || value === "non" || value === "no" || value === 0 || value === "0"
        ? "no"
        : "unknown";
  return norm === filter;
}

function matchAgeFilter(createdAt: unknown, filter: AgeFilter): boolean {
  if (filter === "all") return true;
  if (typeof createdAt !== "string") return false;
  const t = Date.parse(createdAt);
  if (!Number.isFinite(t)) return false;
  const days = (Date.now() - t) / 86_400_000;
  if (filter === "new") return days <= 7;
  if (filter === "recent") return days <= 30;
  return days > 30; // old
}

function UpsellSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BoolFilter;
  onChange: (v: BoolFilter) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as BoolFilter)}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      title={label}
    >
      <option value="all">{label} : tous</option>
      <option value="yes">{label} : oui</option>
      <option value="no">{label} : non</option>
      <option value="unknown">{label} : sans réponse</option>
    </select>
  );
}

function AgeSelect({
  value,
  onChange,
}: {
  value: AgeFilter;
  onChange: (v: AgeFilter) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as AgeFilter)}
      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
      title="Ancienneté"
    >
      <option value="all">Toute ancienneté</option>
      <option value="new">Nouveaux (≤ 7 j)</option>
      <option value="recent">Récents (≤ 30 j)</option>
      <option value="old">Anciens (&gt; 30 j)</option>
    </select>
  );
}

function DuplicateBadge<T extends { id: string }>({
  info,
  items,
  renderItem,
}: {
  info: DuplicateInfo;
  items: T[];
  renderItem: (item: T) => string;
}) {
  const [open, setOpen] = useState(false);
  const matchIds = new Set([...info.emailMatches, ...info.phoneMatches]);
  const matches = items.filter((i) => matchIds.has(i.id));
  const label =
    info.email && info.phone
      ? "⚠ Doublon email+tél"
      : info.email
        ? "⚠ Doublon email"
        : "⚠ Doublon téléphone";
  return (
    <span className="relative inline-block ml-2 align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-red-100 text-red-800 border border-red-300 text-[10px] font-semibold px-2 py-0.5 hover:bg-red-200"
      >
        {label}
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-80 rounded-md border bg-popover p-3 text-xs shadow-lg text-popover-foreground">
          <div className="flex justify-between items-center mb-2">
            <strong>Autres entrées correspondantes</strong>
            <button className="text-muted-foreground" onClick={() => setOpen(false)}>×</button>
          </div>
          {matches.length === 0 ? (
            <p className="text-muted-foreground">Aucune autre entrée trouvée.</p>
          ) : (
            <ul className="space-y-1">
              {matches.map((m) => (
                <li key={m.id} className="border-l-2 border-red-400 pl-2">{renderItem(m)}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </span>
  );
}

const FORM_VERSION = "v4-2026-07-01";
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
  listChariowPayments,
  setPartnerTier,
} from "@/lib/partners.functions";
import { publishProspect } from "@/lib/marketplace.functions";
import {
  deleteProspect,
  reactivateProspect,
  rejectProspect,
  updateProspect,
} from "@/lib/prospects.functions";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { isUnauthorizedError } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    tab:
      typeof search.tab === "string" &&
      ["partners", "prospects", "create", "team", "paiements"].includes(search.tab)
        ? (search.tab as "partners" | "prospects" | "create" | "team" | "paiements")
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
  const pendingPartners = (partnersData?.partners ?? []).filter(
    (p: any) => p.status === "pending_review",
  ).length;
  const pendingProspects = (prospectsData?.prospects ?? []).filter(
    (p: any) => p.status === "pending_qualification",
  ).length;

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
        <SectionHeader
          tab={activeTab}
          pendingPartners={pendingPartners}
          pendingProspects={pendingProspects}
        />
        <div className="mt-4">
          {activeTab === "partners" && <PartnersPanel isAdmin={roles.includes("admin")} />}
          {activeTab === "prospects" && (
            <ProspectQualificationPanel isAdmin={roles.includes("admin")} />
          )}
          {activeTab === "create" && <CreatePartnerPanel key={FORM_VERSION} />}
          {activeTab === "paiements" && <PaymentsPanel />}
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
  tab: "partners" | "prospects" | "create" | "team" | "paiements";
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
      title: "Nouveau partenaire",
      subtitle: "Ajouter manuellement un cabinet avec tous les champs obligatoires visibles.",
    },
    paiements: {
      title: "Paiements crédits",
      subtitle: "Historique des achats Chariow — qui, quand, combien.",
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
    {
      label: "Cabinets actifs",
      value: data?.approvedPartners,
      hint: data?.pendingPartners ? `${data.pendingPartners} en attente` : undefined,
      accent: "text-primary",
    },
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
          {it.hint && <div className="text-[11px] text-muted-foreground mt-0.5">{it.hint}</div>}
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

function byLastLoginAsc(a: any, b: any): number {
  const ax = a.last_login_at ? new Date(a.last_login_at).getTime() : 0;
  const bx = b.last_login_at ? new Date(b.last_login_at).getTime() : 0;
  return ax - bx;
}

function TutorialBadge({
  watchedAt,
  maxProgress,
}: {
  watchedAt: string | null;
  maxProgress: number | null;
}) {
  if (watchedAt) {
    const d = new Date(watchedAt).toLocaleDateString("fr-FR");
    return (
      <span
        className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 align-middle"
        title={`Vidéo vue le ${d}`}
      >
        ✅ Vidéo vue
      </span>
    );
  }
  const p = Math.round((maxProgress ?? 0) * 100);
  if (p > 0) {
    return (
      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 align-middle">
        ⏳ Vidéo commencée ({p} %)
      </span>
    );
  }
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 text-[10px] font-semibold px-2 py-0.5 align-middle">
      ⛔ Vidéo non vue
    </span>
  );
}

function LastLoginBadge({
  lastLoginAt,
  status,
}: {
  lastLoginAt: string | null;
  status: string;
}) {
  // On n'affiche cette info que pour les cabinets ayant atteint l'étape approbation
  if (status === "pending_review" || status === "rejected") return null;
  if (!lastLoginAt) {
    return (
      <p className="text-xs mt-1 text-muted-foreground">
        Dernière connexion : <span className="font-medium text-gray-500">jamais connecté</span>
      </p>
    );
  }
  const ts = new Date(lastLoginAt).getTime();
  const days = Math.floor((Date.now() - ts) / 86_400_000);
  const label =
    days === 0
      ? "aujourd'hui"
      : days === 1
        ? "hier"
        : `il y a ${days} jours`;
  const color =
    days >= 14
      ? "text-red-600"
      : days >= 7
        ? "text-orange-600"
        : "text-emerald-700";
  const dateFr = new Date(lastLoginAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <p className="text-xs mt-1 text-muted-foreground">
      Dernière connexion :{" "}
      <span className={`font-semibold ${color}`} title={dateFr}>
        {label}
      </span>
    </p>
  );
}

function PartnersPanel({ isAdmin }: { isAdmin: boolean }) {
  const listFn = useServerFn(listPartners);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["partners"], queryFn: () => listFn() });
  const partners = data?.partners ?? [];
  const [tutorialFilter, setTutorialFilter] = useState<"all" | "watched" | "not_watched">("all");
  const [searchQ, setSearchQ] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<"all" | "premium" | "regular">("all");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [siteFilter, setSiteFilter] = useState<"all" | "yes" | "no" | "unknown">("all");
  const [logoFilter, setLogoFilter] = useState<"all" | "yes" | "no" | "unknown">("all");
  const [ageFilter, setAgeFilter] = useState<"all" | "new" | "recent" | "old">("all");

  const duplicates = useMemo(
    () => computeDuplicates(partners, (p: any) => p.email, (p: any) => p.phone),
    [partners],
  );

  const cities = useMemo(() => {
    const s = new Set<string>();
    partners.forEach((p: any) => { if (p.city) s.add(p.city); });
    return Array.from(s).sort((a, b) => a.localeCompare(b, "fr"));
  }, [partners]);

  const services = useMemo(() => {
    const s = new Set<string>();
    partners.forEach((p: any) => (p.services ?? []).forEach((sv: string) => sv && s.add(sv)));
    return Array.from(s).sort((a, b) => a.localeCompare(b, "fr"));
  }, [partners]);

  function matchesFilters(p: any): boolean {
    if (duplicatesOnly && !duplicates.has(p.id)) return false;
    if (cityFilter !== "all" && p.city !== cityFilter) return false;
    if (serviceFilter !== "all" && !(p.services ?? []).includes(serviceFilter)) return false;
    if (tierFilter !== "all") {
      const t = p.tier === "premium" ? "premium" : "regular";
      if (t !== tierFilter) return false;
    }
    if (!matchBoolFilter(p.wants_website, siteFilter)) return false;
    if (!matchBoolFilter(p.wants_logo, logoFilter)) return false;
    if (!matchAgeFilter(p.created_at, ageFilter)) return false;
    if (searchQ.trim()) {
      const q = normalizeText(searchQ);
      const hay = normalizeText(
        [p.cabinet_name, p.contact_first_name, p.contact_last_name, p.email, p.phone, p.city]
          .filter(Boolean).join(" "),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  const filteredAll = partners.filter(matchesFilters);
  const buckets = {
    pending_review: filteredAll
      .filter((p) => p.status === "pending_review")
      .filter((p) => {
        if (tutorialFilter === "watched") return !!p.tutorial_watched_at;
        if (tutorialFilter === "not_watched") return !p.tutorial_watched_at;
        return true;
      }),
    approved: filteredAll
      .filter((p) => p.status === "approved")
      .slice()
      .sort(byLastLoginAsc),
    paused: filteredAll
      .filter((p) => p.status === "paused")
      .slice()
      .sort(byLastLoginAsc),
    rejected: filteredAll.filter((p) => p.status === "rejected"),
  };

  const duplicatesCount = duplicates.size;

  if (isLoading) return <p>Chargement…</p>;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Rechercher (cabinet, contact, email, téléphone, ville)…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Toutes villes</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Tous services</option>
            {services.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <UpsellSelect label="Site" value={siteFilter} onChange={setSiteFilter} />
          <UpsellSelect label="Logo" value={logoFilter} onChange={setLogoFilter} />
          <AgeSelect value={ageFilter} onChange={setAgeFilter} />
          <div className="flex gap-1">
            {(["all", "premium", "regular"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setTierFilter(k)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  tierFilter === k
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50",
                )}
              >
                {k === "all" ? "Tous tiers" : k === "premium" ? "★ Premium" : "Regular"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDuplicatesOnly((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              duplicatesOnly
                ? "bg-red-600 text-white border-red-600"
                : "bg-background text-muted-foreground border-border hover:border-red-400",
            )}
            title="Afficher uniquement les cabinets flagués comme doublons"
          >
            ⚠ Doublons ({duplicatesCount})
          </button>
          {(searchQ || cityFilter !== "all" || serviceFilter !== "all" || tierFilter !== "all" || duplicatesOnly || siteFilter !== "all" || logoFilter !== "all" || ageFilter !== "all") && (
            <button
              type="button"
              onClick={() => { setSearchQ(""); setCityFilter("all"); setServiceFilter("all"); setTierFilter("all"); setDuplicatesOnly(false); setSiteFilter("all"); setLogoFilter("all"); setAgeFilter("all"); }}
              className="text-xs text-muted-foreground underline"
            >
              Réinitialiser
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground">
            {filteredAll.length} cabinet(s) affiché(s) sur {partners.length}
          </span>
        </div>
      </div>

      <Tabs defaultValue="pending_review">
      <TabsList>
        <TabsTrigger value="pending_review">
          En attente ({buckets.pending_review.length}){" "}
          <PendingBadge count={buckets.pending_review.length} />
        </TabsTrigger>
        <TabsTrigger value="approved">Actifs ({buckets.approved.length})</TabsTrigger>
        <TabsTrigger value="paused">En pause ({buckets.paused.length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejetés ({buckets.rejected.length})</TabsTrigger>
      </TabsList>
      {(["pending_review", "approved", "paused", "rejected"] as const).map((k) => (
        <TabsContent key={k} value={k} className="mt-4 space-y-3">
          {k === "pending_review" && (
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "Tous"],
                  ["watched", "Vidéo vue"],
                  ["not_watched", "Vidéo non vue"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTutorialFilter(key)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    tutorialFilter === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          {buckets[k].length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun cabinet.</p>
          )}
          {buckets[k].map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              isAdmin={isAdmin}
              duplicateInfo={duplicates.get(p.id)}
              allPartners={partners}
              onChange={() => qc.invalidateQueries({ queryKey: ["partners"] })}
            />
          ))}
        </TabsContent>
      ))}
      </Tabs>
    </div>
  );
}

function PartnerCard({
  partner,
  isAdmin,
  duplicateInfo,
  allPartners,
  onChange,
}: {
  partner: any;
  isAdmin: boolean;
  duplicateInfo?: DuplicateInfo;
  allPartners?: any[];
  onChange: () => void;
}) {
  const approveFn = useServerFn(approvePartner);
  const rejectFn = useServerFn(rejectPartner);
  const pauseFn = useServerFn(pausePartner);
  const reactivateFn = useServerFn(reactivatePartner);
  const deleteFn = useServerFn(deletePartner);
  const grantFn = useServerFn(adminGrantCredits);
  const tierFn = useServerFn(setPartnerTier);
  const [busy, setBusy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      toast.success("Action effectuée");
      onChange();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border p-4 bg-card">
      <div className="flex justify-between flex-wrap gap-2">
        <div>
          <button
            type="button"
            onClick={() => setShowDetails(true)}
            className="font-semibold text-left hover:underline"
          >
            {partner.cabinet_name}
          </button>
          {partner.tier === "premium" && (
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 align-middle">
              ★ Premium
            </span>
          )}
          {partner.status === "pending_review" && (
            <TutorialBadge
              watchedAt={partner.tutorial_watched_at}
              maxProgress={partner.tutorial_max_progress}
            />
          )}
          {duplicateInfo && (
            <DuplicateBadge
              info={duplicateInfo}
              items={allPartners ?? []}
              renderItem={(o: any) => `${o.cabinet_name} — ${o.email || "?"} · ${o.phone || "?"} · ${o.status}`}
            />
          )}
          <p className="text-sm text-muted-foreground">
            {partner.contact_first_name} {partner.contact_last_name} · {partner.email} ·{" "}
            {partner.phone}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {partner.city} · Crédits : <strong>{partner.credits_balance}</strong>
          </p>
          <LastLoginBadge lastLoginAt={partner.last_login_at} status={partner.status} />
          {partner.services?.length > 0 && (
            <p className="text-xs mt-1">Services : {partner.services.join(", ")}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          <Button size="sm" variant="ghost" onClick={() => setShowDetails(true)}>
            Voir détails
          </Button>
          {partner.status === "pending_review" && (
            <>
              <Button
                size="sm"
                disabled={busy}
                onClick={() => {
                  if (!partner.tutorial_watched_at) {
                    const pct = Math.round((partner.tutorial_max_progress ?? 0) * 100);
                    const ok = window.confirm(
                      `Ce cabinet n'a pas terminé la vidéo tutorielle (progression : ${pct} %).\n\n` +
                        `Voulez-vous vraiment l'approuver quand même ?`,
                    );
                    if (!ok) return;
                  }
                  run(() => approveFn({ data: { partner_id: partner.id } }));
                }}
              >
                Approuver (+30 crédits)
              </Button>
              <RejectButton
                disabled={busy}
                onConfirm={(reason) =>
                  run(() => rejectFn({ data: { partner_id: partner.id, reason } }))
                }
              />
            </>
          )}
          {partner.status === "approved" && (
            <RejectButton
              label="Mettre en pause"
              disabled={busy}
              onConfirm={(reason) =>
                run(() => pauseFn({ data: { partner_id: partner.id, reason } }))
              }
            />
          )}
          {partner.status === "paused" && (
            <Button
              size="sm"
              disabled={busy}
              onClick={() => run(() => reactivateFn({ data: { partner_id: partner.id } }))}
            >
              Réactiver
            </Button>
          )}
          {isAdmin && partner.status === "approved" && (
            <GrantButton
              disabled={busy}
              onConfirm={(amount, note) =>
                run(() => grantFn({ data: { partner_id: partner.id, amount, note } }))
              }
            />
          )}
          {isAdmin && (partner.status === "approved" || partner.status === "paused") && (
            <Button
              size="sm"
              variant={partner.tier === "premium" ? "secondary" : "outline"}
              disabled={busy}
              onClick={() =>
                run(() =>
                  tierFn({
                    data: {
                      partner_id: partner.id,
                      tier: partner.tier === "premium" ? "regular" : "premium",
                    },
                  }),
                )
              }
            >
              {partner.tier === "premium" ? "Retirer Premium" : "Passer Premium"}
            </Button>
          )}
          {isAdmin && (
            <Button
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={() => {
                if (confirm("Supprimer ce partenaire ?"))
                  run(() => deleteFn({ data: { partner_id: partner.id } }));
              }}
            >
              Supprimer
            </Button>
          )}
        </div>
      </div>
      <PartnerDetailsDialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        partner={partner}
      />
    </div>
  );
}

function RejectButton({
  label = "Rejeter",
  disabled,
  onConfirm,
}: {
  label?: string;
  disabled?: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  if (!open)
    return (
      <Button size="sm" variant="outline" disabled={disabled} onClick={() => setOpen(true)}>
        {label}
      </Button>
    );
  return (
    <div className="flex gap-1 items-center">
      <Input
        className="h-8 w-44"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motif"
      />
      <Button
        size="sm"
        disabled={disabled || reason.length < 2}
        onClick={() => {
          onConfirm(reason);
          setOpen(false);
          setReason("");
        }}
      >
        OK
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        ×
      </Button>
    </div>
  );
}

function GrantButton({
  disabled,
  onConfirm,
}: {
  disabled?: boolean;
  onConfirm: (amount: number, note?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(10);
  const [note, setNote] = useState("");
  if (!open)
    return (
      <Button size="sm" variant="secondary" disabled={disabled} onClick={() => setOpen(true)}>
        + Crédits
      </Button>
    );
  return (
    <div className="flex gap-1 items-center">
      <Input
        className="h-8 w-20"
        type="number"
        min={1}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <Input
        className="h-8 w-32"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
      />
      <Button
        size="sm"
        disabled={disabled || amount < 1}
        onClick={() => {
          onConfirm(amount, note || undefined);
          setOpen(false);
        }}
      >
        OK
      </Button>
      <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
        ×
      </Button>
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
  const [filter, setFilter] = useState<"all" | "pending_qualification" | "qualified" | "rejected">(
    "all",
  );
  const [detailsProspect, setDetailsProspect] = useState<any>(null);
  const [searchQ, setSearchQ] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [periodFilter, setPeriodFilter] = useState<"all" | "7" | "30">("all");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [siteFilter, setSiteFilter] = useState<BoolFilter>("all");
  const [logoFilter, setLogoFilter] = useState<BoolFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeFilter>("all");

  const allProspects = data?.prospects ?? [];
  const duplicates = useMemo(
    () => computeDuplicates(allProspects, (p: any) => p.email, (p: any) => p.phone),
    [allProspects],
  );

  const pCities = useMemo(() => {
    const s = new Set<string>();
    allProspects.forEach((p: any) => { if (p.city) s.add(p.city); });
    return Array.from(s).sort((a, b) => a.localeCompare(b, "fr"));
  }, [allProspects]);
  const pServices = useMemo(() => {
    const s = new Set<string>();
    allProspects.forEach((p: any) => { if (p.service) s.add(p.service); });
    return Array.from(s).sort((a, b) => a.localeCompare(b, "fr"));
  }, [allProspects]);

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await fn();
      qc.invalidateQueries({ queryKey: ["prospects"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  }

  async function onPublish(prospect_id: string) {
    await run(prospect_id, async () => {
      await publishFn({ data: { prospect_id, max_unlocks: 5 } });
      toast.success("Lead publié dans la marketplace.");
    });
  }
  if (isLoading) return <p>Chargement…</p>;
  const all = allProspects;
  const pendingCount = all.filter((p: any) => p.status === "pending_qualification").length;
  const nowMs = Date.now();
  const prospects = all.filter((p: any) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (duplicatesOnly && !duplicates.has(p.id)) return false;
    if (cityFilter !== "all" && p.city !== cityFilter) return false;
    if (serviceFilter !== "all" && p.service !== serviceFilter) return false;
    const rp = (p.raw_payload && typeof p.raw_payload === "object") ? p.raw_payload as Record<string, unknown> : {};
    if (!matchBoolFilter(rp.upsell_site, siteFilter)) return false;
    if (!matchBoolFilter(rp.upsell_logo, logoFilter)) return false;
    if (!matchAgeFilter(p.created_at, ageFilter)) return false;
    if (periodFilter !== "all") {
      const days = Number(periodFilter);
      const created = new Date(p.created_at).getTime();
      if (Number.isFinite(created) && nowMs - created > days * 86_400_000) return false;
    }
    if (searchQ.trim()) {
      const q = normalizeText(searchQ);
      const hay = normalizeText(
        [p.full_name, p.email, p.phone, p.city, p.service, p.message].filter(Boolean).join(" "),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return (
    <div className="space-y-2">
      <div className="rounded-lg border bg-card p-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Rechercher (nom, email, téléphone, ville, service, message)…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Toutes villes</option>
            {pCities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="all">Tous services</option>
            {pServices.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex gap-1">
            {(["all", "7", "30"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPeriodFilter(k)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  periodFilter === k
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50",
                )}
              >
                {k === "all" ? "Toute période" : k === "7" ? "7 derniers jours" : "30 derniers jours"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setDuplicatesOnly((v) => !v)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              duplicatesOnly
                ? "bg-red-600 text-white border-red-600"
                : "bg-background text-muted-foreground border-border hover:border-red-400",
            )}
          >
            ⚠ Doublons ({duplicates.size})
          </button>
          {(searchQ || cityFilter !== "all" || serviceFilter !== "all" || periodFilter !== "all" || duplicatesOnly) && (
            <button
              type="button"
              onClick={() => { setSearchQ(""); setCityFilter("all"); setServiceFilter("all"); setPeriodFilter("all"); setDuplicatesOnly(false); }}
              className="text-xs text-muted-foreground underline"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-sm text-muted-foreground">
          {prospects.length} prospect(s) affichés (sur {all.length})
        </p>
        <div className="flex gap-1 text-xs">
          {(["all", "pending_qualification", "qualified", "rejected"] as const).map((k) => (
            <Button
              key={k}
              size="sm"
              variant={filter === k ? "default" : "outline"}
              onClick={() => setFilter(k)}
            >
              {k === "all"
                ? "Tous"
                : k === "pending_qualification"
                  ? "En attente"
                  : k === "qualified"
                    ? "Qualifiés"
                    : "Rejetés"}
              {k === "pending_qualification" && <PendingBadge count={pendingCount} />}
            </Button>
          ))}
        </div>
      </div>
      {prospects.map((p: any) => (
        <div
          key={p.id}
          className={`rounded border p-3 bg-card text-sm ${p.status === "rejected" ? "opacity-60" : ""}`}
        >
          <div className="flex justify-between flex-wrap gap-2">
            <div>
              <button
                type="button"
                onClick={() => setDetailsProspect(p)}
                className="text-left hover:underline"
              >
                <strong>{p.full_name || "—"}</strong> · {p.email || "—"} · {p.phone || "—"}
              </button>
              <span className="ml-2 inline-block rounded bg-muted px-2 py-0.5 text-xs">
                {p.audience}
              </span>
              <span className="ml-1 inline-block rounded bg-muted px-2 py-0.5 text-xs">
                {p.status}
              </span>
              {duplicates.has(p.id) && (
                <DuplicateBadge
                  info={duplicates.get(p.id)!}
                  items={all}
                  renderItem={(o: any) => `${o.full_name || "—"} — ${o.email || "?"} · ${o.phone || "?"} · ${o.status}`}
                />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(p.created_at).toLocaleString("fr-FR")}
            </span>
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
            <Button size="sm" variant="ghost" onClick={() => setDetailsProspect(p)}>
              Voir détails
            </Button>
            {p.status !== "rejected" && p.status !== "qualified" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busyId === p.id}
                  onClick={() => onPublish(p.id)}
                >
                  {busyId === p.id ? "…" : "Publier comme lead (6 places)"}
                </Button>
                <RejectButton
                  label="Rejeter"
                  disabled={busyId === p.id}
                  onConfirm={(reason) =>
                    run(p.id, async () => {
                      await rejectFn({ data: { prospect_id: p.id, reason } });
                      toast.success("Prospect rejeté");
                    })
                  }
                />
              </>
            )}
            {p.status === "rejected" && (
              <Button
                size="sm"
                variant="outline"
                disabled={busyId === p.id}
                onClick={() =>
                  run(p.id, async () => {
                    await reactivateFn({ data: { prospect_id: p.id } });
                    toast.success("Prospect réactivé");
                  })
                }
              >
                Réactiver
              </Button>
            )}
            {isAdmin && (
              <Button
                size="sm"
                variant="destructive"
                disabled={busyId === p.id}
                onClick={() => {
                  if (confirm("Supprimer définitivement ce prospect ?")) {
                    run(p.id, async () => {
                      await deleteFn({ data: { prospect_id: p.id } });
                      toast.success("Prospect supprimé");
                    });
                  }
                }}
              >
                Supprimer
              </Button>
            )}
          </div>
        </div>
      ))}
      <ProspectDetailsDialog prospect={detailsProspect} onClose={() => setDetailsProspect(null)} />
    </div>
  );
}

type ProspectFilter = "pending_qualification" | "published" | "rejected";

type ProspectFormState = {
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  statut: string;
  audience: "creation" | "gestion" | "unknown";
  status: "pending_qualification" | "qualified" | "rejected" | "published";
  service: string;
  city: string;
  budget: string;
  legal_form: string;
  message: string;
  external_notes: string;
  internal_notes: string;
};

const emptyProspectForm: ProspectFormState = {
  full_name: "",
  email: "",
  phone: "",
  company_name: "",
  statut: "",
  audience: "unknown",
  status: "pending_qualification",
  service: "",
  city: "",
  budget: "",
  legal_form: "",
  message: "",
  external_notes: "",
  internal_notes: "",
};

function isPublishedProspect(status?: string | null) {
  return status === "qualified" || status === "published";
}

function getProspectForm(prospect: any): ProspectFormState {
  return {
    full_name: prospect?.full_name ?? "",
    email: prospect?.email ?? "",
    phone: prospect?.phone ?? "",
    company_name: prospect?.company_name ?? "",
    statut: prospect?.statut ?? "",
    audience: prospect?.audience ?? "unknown",
    status: prospect?.status ?? "pending_qualification",
    service: prospect?.service ?? "",
    city: prospect?.city ?? "",
    budget: prospect?.budget ?? "",
    legal_form: prospect?.legal_form ?? "",
    message: prospect?.message ?? "",
    external_notes: prospect?.external_notes ?? "",
    internal_notes: prospect?.internal_notes ?? "",
  };
}

function nullableFormValue(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeProspectForm(form: ProspectFormState) {
  return {
    full_name: nullableFormValue(form.full_name),
    email: nullableFormValue(form.email),
    phone: nullableFormValue(form.phone),
    company_name: nullableFormValue(form.company_name),
    statut: nullableFormValue(form.statut),
    audience: form.audience,
    status: form.status,
    service: nullableFormValue(form.service),
    city: nullableFormValue(form.city),
    budget: nullableFormValue(form.budget),
    legal_form: nullableFormValue(form.legal_form),
    message: nullableFormValue(form.message),
    external_notes: nullableFormValue(form.external_notes),
    internal_notes: nullableFormValue(form.internal_notes),
  };
}

function ProspectFilterButton({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-left transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted"
      }`}
    >
      <span className="block text-sm font-semibold">{label}</span>
      <span
        className={`text-xs ${active ? "text-primary-foreground/75" : "text-muted-foreground"}`}
      >
        {count} prospect{count > 1 ? "s" : ""}
      </span>
    </button>
  );
}

function ProspectStatusBadge({ status }: { status?: string | null }) {
  const label =
    status === "pending_qualification"
      ? "A qualifier"
      : isPublishedProspect(status)
        ? "Publie"
        : status === "rejected"
          ? "Rejete"
          : status || "Nouveau";
  const tone =
    status === "rejected"
      ? "bg-destructive/10 text-destructive"
      : isPublishedProspect(status)
        ? "bg-emerald-100 text-emerald-700"
        : "bg-amber-100 text-amber-800";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{label}</span>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ProspectInputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ProspectTextareaField({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  className = "",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <label className={`space-y-1.5 text-sm ${className}`}>
      <span className="font-medium">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      <Textarea value={value} onChange={(event) => onChange(event.target.value)} rows={rows} />
    </label>
  );
}

function ProspectQualificationPanel({ isAdmin }: { isAdmin: boolean }) {
  const listFn = useServerFn(listProspects);
  const updateFn = useServerFn(updateProspect);
  const publishFn = useServerFn(publishProspect);
  const rejectFn = useServerFn(rejectProspect);
  const reactivateFn = useServerFn(reactivateProspect);
  const deleteFn = useServerFn(deleteProspect);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["prospects"], queryFn: () => listFn() });
  const [filter, setFilter] = useState<ProspectFilter>("pending_qualification");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ProspectFormState>(emptyProspectForm);
  const [busy, setBusy] = useState<string | null>(null);
  const [detailsProspect, setDetailsProspect] = useState<any>(null);

  const all = data?.prospects ?? [];
  const prospects = all.filter((prospect: any) => {
    if (filter === "published") return isPublishedProspect(prospect.status);
    return prospect.status === filter;
  });
  const selected =
    prospects.find((prospect: any) => prospect.id === selectedId) ?? prospects[0] ?? null;

  useEffect(() => {
    if (!prospects.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !prospects.some((prospect: any) => prospect.id === selectedId)) {
      setSelectedId(prospects[0].id);
    }
  }, [prospects, selectedId]);

  useEffect(() => {
    setForm(selected ? getProspectForm(selected) : emptyProspectForm);
  }, [selected]);

  function updateField<K extends keyof ProspectFormState>(key: K, value: ProspectFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function refreshProspects() {
    await qc.invalidateQueries({ queryKey: ["prospects"] });
  }

  async function run(action: string, fn: () => Promise<unknown>) {
    setBusy(action);
    try {
      await fn();
      await refreshProspects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setBusy(null);
    }
  }

  async function saveSelected() {
    if (!selected) return;
    await run(`save:${selected.id}`, async () => {
      await updateFn({ data: { prospect_id: selected.id, ...normalizeProspectForm(form) } });
      toast.success("Prospect enregistre.");
    });
  }

  async function publishSelected() {
    if (!selected) return;
    await run(`publish:${selected.id}`, async () => {
      await updateFn({ data: { prospect_id: selected.id, ...normalizeProspectForm(form) } });
      await publishFn({ data: { prospect_id: selected.id, max_unlocks: 5 } });
      toast.success("Lead publie dans la marketplace.");
    });
  }

  const counts = {
    pending_qualification: all.filter(
      (prospect: any) => prospect.status === "pending_qualification",
    ).length,
    published: all.filter((prospect: any) => isPublishedProspect(prospect.status)).length,
    rejected: all.filter((prospect: any) => prospect.status === "rejected").length,
  };
  const isSelectedBusy = selected ? busy?.endsWith(selected.id) : false;

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <aside className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <div className="grid grid-cols-3 gap-2">
            <ProspectFilterButton
              active={filter === "pending_qualification"}
              count={counts.pending_qualification}
              label="A qualifier"
              onClick={() => setFilter("pending_qualification")}
            />
            <ProspectFilterButton
              active={filter === "published"}
              count={counts.published}
              label="Publies"
              onClick={() => setFilter("published")}
            />
            <ProspectFilterButton
              active={filter === "rejected"}
              count={counts.rejected}
              label="Rejetes"
              onClick={() => setFilter("rejected")}
            />
          </div>
        </div>
        <div className="max-h-[720px] overflow-y-auto p-2">
          {prospects.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Aucun prospect dans cette file.</p>
          ) : (
            prospects.map((prospect: any) => (
              <button
                key={prospect.id}
                type="button"
                onClick={() => setSelectedId(prospect.id)}
                className={`w-full rounded-md border p-3 text-left transition-colors ${
                  selected?.id === prospect.id
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:bg-muted"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">
                      {prospect.full_name || prospect.email || "Prospect sans nom"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {prospect.service || "Service a definir"}
                    </p>
                  </div>
                  <ProspectStatusBadge status={prospect.status} />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {prospect.city && (
                    <span className="rounded bg-muted px-2 py-0.5">{prospect.city}</span>
                  )}
                  {prospect.budget && (
                    <span className="rounded bg-muted px-2 py-0.5">{prospect.budget}</span>
                  )}
                  <span className="rounded bg-muted px-2 py-0.5">
                    {new Date(prospect.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="rounded-lg border bg-card">
        {!selected ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Selectionnez un prospect pour le qualifier.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3 border-b p-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{form.full_name || "Prospect sans nom"}</h2>
                  <ProspectStatusBadge status={selected.status} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recu le {new Date(selected.created_at).toLocaleString("fr-FR")}
                  {selected.edited_at
                    ? `, modifie le ${new Date(selected.edited_at).toLocaleString("fr-FR")}`
                    : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setDetailsProspect(selected)}>
                  Voir details
                </Button>
                <Button variant="secondary" disabled={isSelectedBusy} onClick={saveSelected}>
                  {busy?.startsWith("save:") ? "Enregistrement..." : "Enregistrer"}
                </Button>
                <Button
                  disabled={isSelectedBusy || isPublishedProspect(selected.status)}
                  onClick={publishSelected}
                >
                  {busy?.startsWith("publish:") ? "Publication..." : "Publier dans la marketplace"}
                </Button>
              </div>
            </div>

            <div className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]">
              <div className="space-y-6">
                <FormSection title="Contact">
                  <ProspectInputField
                    label="Nom"
                    value={form.full_name}
                    onChange={(value) => updateField("full_name", value)}
                  />
                  <ProspectInputField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                  />
                  <ProspectInputField
                    label="Telephone"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                  />
                  <ProspectInputField
                    label="Entreprise"
                    value={form.company_name}
                    onChange={(value) => updateField("company_name", value)}
                  />
                  <ProspectInputField
                    label="Situation"
                    value={form.statut}
                    onChange={(value) => updateField("statut", value)}
                  />
                  <label className="space-y-1.5 text-sm">
                    <span className="font-medium">Audience</span>
                    <select
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={form.audience}
                      onChange={(event) =>
                        updateField("audience", event.target.value as ProspectFormState["audience"])
                      }
                    >
                      <option value="unknown">A qualifier</option>
                      <option value="creation">Creation d'entreprise</option>
                      <option value="gestion">Gestion comptable</option>
                    </select>
                  </label>
                  <label className="space-y-1.5 text-sm">
                    <span className="font-medium">Statut</span>
                    <select
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={form.status}
                      onChange={(event) =>
                        updateField("status", event.target.value as ProspectFormState["status"])
                      }
                    >
                      <option value="pending_qualification">A qualifier</option>
                      <option value="qualified">Qualifie</option>
                      <option value="published">Publie</option>
                      <option value="rejected">Rejete</option>
                    </select>
                  </label>
                </FormSection>

                <FormSection title="Demande">
                  <ProspectInputField
                    label="Service"
                    value={form.service}
                    onChange={(value) => updateField("service", value)}
                  />
                  <ProspectInputField
                    label="Ville"
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                  />
                  <ProspectInputField
                    label="Budget"
                    value={form.budget}
                    onChange={(value) => updateField("budget", value)}
                  />
                  <ProspectInputField
                    label="Forme juridique"
                    value={form.legal_form}
                    onChange={(value) => updateField("legal_form", value)}
                  />
                  <ProspectTextareaField
                    className="sm:col-span-2"
                    label="Message du prospect"
                    value={form.message}
                    onChange={(value) => updateField("message", value)}
                    rows={5}
                  />
                </FormSection>

                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Notes
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <ProspectTextareaField
                      label="Note LGM"
                      hint="Visible par les partenaires"
                      value={form.external_notes}
                      onChange={(value) => updateField("external_notes", value)}
                      rows={6}
                    />
                    <ProspectTextareaField
                      label="Note interne"
                      hint="Visible uniquement par l'equipe LGM"
                      value={form.internal_notes}
                      onChange={(value) => updateField("internal_notes", value)}
                      rows={6}
                    />
                  </div>
                </section>
              </div>

              <aside className="space-y-4">
                <div className="rounded-md border bg-muted/30 p-4">
                  <h3 className="font-semibold">Publication</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    La note LGM sera reprise comme resume public du lead. La marketplace ouvre 5
                    places.
                  </p>
                  <Button
                    className="mt-3 w-full"
                    disabled={isSelectedBusy || isPublishedProspect(selected.status)}
                    onClick={publishSelected}
                  >
                    Publier dans la marketplace
                  </Button>
                </div>
                <div className="rounded-md border bg-background p-4">
                  <h3 className="font-semibold">Decision</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.status === "rejected" ? (
                      <Button
                        variant="outline"
                        disabled={isSelectedBusy}
                        onClick={() =>
                          run(`reactivate:${selected.id}`, async () => {
                            await reactivateFn({ data: { prospect_id: selected.id } });
                            toast.success("Prospect reactive.");
                          })
                        }
                      >
                        Reactiver
                      </Button>
                    ) : (
                      <RejectButton
                        disabled={isSelectedBusy}
                        onConfirm={(reason) =>
                          run(`reject:${selected.id}`, async () => {
                            await rejectFn({ data: { prospect_id: selected.id, reason } });
                            toast.success("Prospect rejete.");
                          })
                        }
                      />
                    )}
                    {isAdmin && (
                      <Button
                        variant="destructive"
                        disabled={isSelectedBusy}
                        onClick={() => {
                          if (confirm("Supprimer definitivement ce prospect ?")) {
                            run(`delete:${selected.id}`, async () => {
                              await deleteFn({ data: { prospect_id: selected.id } });
                              toast.success("Prospect supprime.");
                            });
                          }
                        }}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </section>

      <ProspectDetailsDialog prospect={detailsProspect} onClose={() => setDetailsProspect(null)} />
    </div>
  );
}

function CreatePartnerPanel() {
  const createFn = useServerFn(createPartnerManually);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    cabinet_name: "",
    contact_first_name: "",
    contact_last_name: "",
    contact_role: "",
    email: "",
    phone: "",
    city: "",
    password: "",
    website: "",
    facebook_url: "",
    services: "",
    zones: "",
  });
  const [wantsWebsite, setWantsWebsite] = useState(false);
  const [wantsLogo, setWantsLogo] = useState(false);
  function up<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const servicesList = form.services.split(",").map((s) => s.trim()).filter(Boolean);
    const zonesList = form.zones.split(",").map((s) => s.trim()).filter(Boolean);
    if (servicesList.length === 0) return toast.error("Indiquez au moins un service.");
    if (zonesList.length === 0) return toast.error("Indiquez au moins une zone.");
    if (!form.contact_role.trim()) return toast.error("Indiquez le rôle du contact.");
    setBusy(true);
    try {
      await createFn({
        data: {
          cabinet_name: form.cabinet_name,
          contact_first_name: form.contact_first_name,
          contact_last_name: form.contact_last_name,
          contact_role: form.contact_role,
          email: form.email,
          phone: form.phone,
          city: form.city,
          password: form.password,
          website: form.website,
          facebook_url: form.facebook_url,
          services: servicesList,
          zones: zonesList,
          wants_website: wantsWebsite,
          wants_logo: wantsLogo,
        },
      });
      toast.success("Partenaire créé (30 crédits attribués)");
      setForm({
        cabinet_name: "",
        contact_first_name: "",
        contact_last_name: "",
        contact_role: "",
        email: "",
        phone: "",
        city: "",
        password: "",
        website: "",
        facebook_url: "",
        services: "",
        zones: "",
      });
      setWantsWebsite(false);
      setWantsLogo(false);
      qc.invalidateQueries({ queryKey: ["partners"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between rounded-md border border-dashed border-primary/40 bg-background/50 px-3 py-2 text-xs">
        <span className="font-mono text-muted-foreground">
          Formulaire <span className="font-bold text-primary">{FORM_VERSION}</span>
        </span>
        <button
          type="button"
          onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set("v", String(Date.now()));
            window.location.replace(url.toString());
          }}
          className="rounded border border-primary/40 bg-primary/10 px-2 py-1 font-medium text-primary hover:bg-primary/20"
        >
          🔄 Recharger le formulaire
        </button>
      </div>

      <div className="rounded-md border-2 border-primary bg-primary/10 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">
          Formulaire manuel visible
        </p>
        <h3 className="mt-1 text-2xl font-bold">Nouveau partenaire — ajout manuel</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Le cabinet est immédiatement actif avec 30 crédits. Remplissez d’abord le bloc obligatoire
          ci-dessous avant les informations classiques du cabinet.
        </p>
      </div>

      <div className="rounded-md border-2 border-primary bg-primary/5 p-5 space-y-5 shadow-sm transition-colors">
        <div className="flex flex-col gap-1 border-b border-primary/20 pb-4">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">
            Champs obligatoires avant création
          </p>
          <p className="text-sm text-muted-foreground">
            Ces informations sont obligatoires : rôle, site internet, logo, services et zones
            d’intervention. Site internet et logo sont sur Non par défaut.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Rôle au sein de l’entreprise *</Label>
            <Input
              required
              placeholder="ex: Gérant, Associé, Expert-comptable…"
              value={form.contact_role}
              onChange={(e) => up("contact_role", e.target.value)}
            />
          </div>

          <div className="rounded-md border border-primary/30 bg-background p-4">
            <YesNoRow
              label="Site internet souhaité ? * À partir de 165 000 FCFA"
              value={wantsWebsite}
              onChange={setWantsWebsite}
            />
          </div>

          <div className="rounded-md border border-primary/30 bg-background p-4">
            <YesNoRow
              label="Logo professionnel souhaité ? * À partir de 50 000 FCFA"
              value={wantsLogo}
              onChange={setWantsLogo}
            />
          </div>

          <div>
            <Label>Services obligatoires * (séparés par des virgules)</Label>
            <Textarea
              required
              placeholder="ex: comptabilité, fiscalité, création d’entreprise"
              value={form.services}
              onChange={(e) => up("services", e.target.value)}
            />
          </div>

          <div>
            <Label>Zones d’intervention obligatoires * (séparées par des virgules)</Label>
            <Textarea
              required
              placeholder="ex: Abidjan, San-Pédro, Yamoussoukro"
              value={form.zones}
              onChange={(e) => up("zones", e.target.value)}
            />
          </div>
        </div>
      </div>
      <div>
        <Label>Nom du cabinet *</Label>
        <Input
          required
          value={form.cabinet_name}
          onChange={(e) => up("cabinet_name", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prénom *</Label>
          <Input
            required
            value={form.contact_first_name}
            onChange={(e) => up("contact_first_name", e.target.value)}
          />
        </div>
        <div>
          <Label>Nom *</Label>
          <Input
            required
            value={form.contact_last_name}
            onChange={(e) => up("contact_last_name", e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Email *</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => up("email", e.target.value)}
          />
        </div>
        <div>
          <Label>Téléphone *</Label>
          <Input required value={form.phone} onChange={(e) => up("phone", e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Mot de passe initial *</Label>
        <Input
          type="password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => up("password", e.target.value)}
        />
      </div>
      <div>
        <Label>Ville *</Label>
        <Input required value={form.city} onChange={(e) => up("city", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Site web existant</Label>
          <Input value={form.website} onChange={(e) => up("website", e.target.value)} />
        </div>
        <div>
          <Label>Facebook</Label>
          <Input value={form.facebook_url} onChange={(e) => up("facebook_url", e.target.value)} />
        </div>
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "…" : "Créer le partenaire"}
      </Button>
    </form>
  );
}

function YesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={
            "px-3 py-1.5 rounded-md border text-sm " +
            (value === true
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-muted border-border")
          }
        >
          Oui
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={
            "px-3 py-1.5 rounded-md border text-sm " +
            (value === false
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background hover:bg-muted border-border")
          }
        >
          Non
        </button>
      </div>
    </div>
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
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "agent" as "admin" | "agent",
  });

  function up<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v as any }));
  }

  async function run(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await fn();
      qc.invalidateQueries({ queryKey: ["team"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBusyId(null);
    }
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
    } finally {
      setBusyId(null);
    }
  }

  if (isLoading) return <p>Chargement…</p>;
  const members = data?.members ?? [];
  const me = data?.me;

  return (
    <div className="space-y-4">
      {tempPwdDialog && (
        <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 space-y-2">
          <p className="font-semibold">Mot de passe temporaire pour {tempPwdDialog.email}</p>
          <p className="text-sm text-muted-foreground">
            Communique-le au membre. Il devra le changer à sa première connexion. Ce mot de passe ne
            sera plus affiché.
          </p>
          <div className="flex gap-2 items-center">
            <code className="flex-1 rounded bg-background border px-3 py-2 font-mono text-sm">
              {tempPwdDialog.pwd}
            </code>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(tempPwdDialog.pwd);
                toast.success("Copié");
              }}
            >
              Copier
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setTempPwdDialog(null)}>
              Fermer
            </Button>
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
            <div>
              <Label>Prénom *</Label>
              <Input
                required
                value={form.first_name}
                onChange={(e) => up("first_name", e.target.value)}
              />
            </div>
            <div>
              <Label>Nom *</Label>
              <Input
                required
                value={form.last_name}
                onChange={(e) => up("last_name", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => up("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Rôle *</Label>
            <div className="flex gap-2 mt-1">
              <Button
                type="button"
                size="sm"
                variant={form.role === "agent" ? "default" : "outline"}
                onClick={() => up("role", "agent")}
              >
                Agent
              </Button>
              <Button
                type="button"
                size="sm"
                variant={form.role === "admin" ? "default" : "outline"}
                onClick={() => up("role", "admin")}
              >
                Administrateur
              </Button>
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
            <div
              key={m.user_id}
              className={`rounded-lg border p-4 bg-card ${m.suspended ? "opacity-60" : ""}`}
            >
              <div className="flex justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{m.full_name || m.email}</strong>
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs ${m.role === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      {m.role === "admin" ? "Administrateur" : "Agent"}
                    </span>
                    {m.suspended && (
                      <span className="inline-block rounded bg-destructive text-destructive-foreground px-2 py-0.5 text-xs">
                        Suspendu
                      </span>
                    )}
                    {m.must_change_password && (
                      <span className="inline-block rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-xs">
                        Doit changer mdp
                      </span>
                    )}
                    {isMe && (
                      <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs">
                        Vous
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{m.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-start">
                  {!isMe && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === m.user_id}
                      onClick={() =>
                        run(m.user_id, async () => {
                          const newRole = m.role === "admin" ? "agent" : "admin";
                          await updRoleFn({ data: { user_id: m.user_id, role: newRole } });
                          toast.success("Rôle modifié");
                        })
                      }
                    >
                      → {m.role === "admin" ? "Agent" : "Admin"}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === m.user_id}
                    onClick={() => {
                      if (!confirm(`Réinitialiser le mot de passe de ${m.email} ?`)) return;
                      setBusyId(m.user_id);
                      resetPwdFn({ data: { user_id: m.user_id } })
                        .then((res) => {
                          setTempPwdDialog({ email: m.email, pwd: res.temp_password });
                        })
                        .catch((e) => toast.error(e instanceof Error ? e.message : "Erreur"))
                        .finally(() => setBusyId(null));
                    }}
                  >
                    Reset mdp
                  </Button>
                  {!isMe &&
                    (m.suspended ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === m.user_id}
                        onClick={() =>
                          run(m.user_id, async () => {
                            await unsuspendFn({ data: { user_id: m.user_id } });
                            toast.success("Réactivé");
                          })
                        }
                      >
                        Réactiver
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === m.user_id}
                        onClick={() =>
                          run(m.user_id, async () => {
                            await suspendFn({ data: { user_id: m.user_id } });
                            toast.success("Suspendu");
                          })
                        }
                      >
                        Suspendre
                      </Button>
                    ))}
                  {!isMe && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={busyId === m.user_id}
                      onClick={() => {
                        if (
                          !confirm(
                            `Supprimer définitivement ${m.email} ? Cette action est irréversible.`,
                          )
                        )
                          return;
                        run(m.user_id, async () => {
                          await deleteFn({ data: { user_id: m.user_id } });
                          toast.success("Membre supprimé");
                        });
                      }}
                    >
                      Supprimer
                    </Button>
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
  legal_form: "Forme juridique",
  formeJuridique: "Forme juridique",
  audience: "Audience",
  source: "Source",
  consent: "Consentement RGPD",
  upsell_logo: "Offre logo — intéressé ?",
  upsell_logo_at: "Offre logo — répondu le",
  upsell_site: "Offre site internet — intéressé ?",
  upsell_site_at: "Offre site internet — répondu le",
};

const PROSPECT_TECHNICAL_KEYS = new Set([
  "leadId",
  "tag",
  "received_at",
  "submitted_at",
  "user_agent",
  "language",
  "page_url",
  "referrer",
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
    <Dialog
      open={!!prospect}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
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
          <DetailRow label="Note LGM partenaires" value={prospect.external_notes} />
          <DetailRow label="Note interne LGM" value={prospect.internal_notes} />
          <DetailRow label="Type de formulaire" value={prospect.form_type} />
          <DetailRow
            label="Reçu le"
            value={new Date(prospect.created_at).toLocaleString("fr-FR")}
          />
          {prospect.edited_at && (
            <DetailRow
              label="Modifie le"
              value={new Date(prospect.edited_at).toLocaleString("fr-FR")}
            />
          )}
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
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------- Payments panel ----------------------

function PaymentsPanel() {
  const listFn = useServerFn(listChariowPayments);
  const { data, isLoading } = useQuery({
    queryKey: ["chariow-payments"],
    queryFn: () => listFn(),
    retry: false,
  });
  const [filter, setFilter] = useState<"all" | "credited" | "error" | "pending">("all");

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement…</p>;

  const rows = data?.rows ?? [];
  const kpis = data?.kpis;
  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  function exportCsv() {
    const header = ["Date", "Email", "Cabinet", "Produit", "Crédits", "Montant", "Statut"];
    const lines = filtered.map((r) => {
      const date = new Date(r.processed_at ?? r.received_at).toISOString();
      const cells = [
        date,
        r.email,
        r.cabinet_name ?? "",
        r.product_id,
        String(r.credits_granted),
        r.amount_label ?? "",
        r.status,
      ];
      return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
    });
    const blob = new Blob([[header.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paiements-credits-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statusBadge: Record<string, string> = {
    credited: "bg-emerald-100 text-emerald-800 border-emerald-200",
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    error: "bg-red-100 text-red-800 border-red-200",
    unmatched: "bg-orange-100 text-orange-800 border-orange-200",
  };
  const statusLabel: Record<string, string> = {
    credited: "Crédité",
    pending: "En attente",
    error: "Erreur",
    unmatched: "Non rattaché",
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiTile
          label="Crédits accordés (mois)"
          value={kpis?.creditsThisMonth ?? 0}
          accent="text-emerald-600"
        />
        <KpiTile
          label="Transactions (mois)"
          value={kpis?.transactionsThisMonth ?? 0}
          accent="text-primary"
        />
        <KpiTile
          label="Crédits accordés (total)"
          value={kpis?.totalCreditsAllTime ?? 0}
          accent="text-foreground"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "credited", "pending", "error"] as const).map((k) => (
          <Button
            key={k}
            size="sm"
            variant={filter === k ? "default" : "outline"}
            onClick={() => setFilter(k)}
          >
            {k === "all" ? "Tous" : (statusLabel[k] ?? k)}
          </Button>
        ))}
        <div className="ml-auto">
          <Button size="sm" variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2 font-semibold">Date</th>
              <th className="text-left px-3 py-2 font-semibold">Email</th>
              <th className="text-left px-3 py-2 font-semibold">Cabinet</th>
              <th className="text-left px-3 py-2 font-semibold">Produit</th>
              <th className="text-right px-3 py-2 font-semibold">Crédits</th>
              <th className="text-left px-3 py-2 font-semibold">Montant</th>
              <th className="text-left px-3 py-2 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                  Aucun paiement à afficher.
                </td>
              </tr>
            )}
            {filtered.map((r) => {
              const date = new Date(r.processed_at ?? r.received_at);
              return (
                <tr key={r.id} className="border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">
                    {date.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.cabinet_name ?? "—"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {r.product_id}
                  </td>
                  <td className="px-3 py-2 text-right font-mono tabular-nums font-semibold">
                    {r.credits_granted}
                  </td>
                  <td className="px-3 py-2">{r.amount_label ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                        statusBadge[r.status] ?? "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {statusLabel[r.status] ?? r.status}
                    </span>
                    {r.status === "error" && r.error_message && (
                      <div className="mt-1 text-xs text-red-600">{r.error_message}</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiTile({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-md border bg-card px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </div>
      <div className={`mt-1 font-mono text-2xl font-bold tabular-nums ${accent}`}>{value}</div>
    </div>
  );
}

function PartnerDetailsDialog({
  open,
  onClose,
  partner,
}: {
  open: boolean;
  onClose: () => void;
  partner: any;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{partner.cabinet_name}</DialogTitle>
        </DialogHeader>

        <section className="space-y-1">
          <h4 className="font-semibold text-sm mb-2">Cabinet</h4>
          <DetailRow label="Nom du cabinet" value={partner.cabinet_name} />
          <DetailRow label="Statut" value={partner.status} />
          <DetailRow label="Tier" value={partner.tier === "premium" ? "★ Premium" : "Régulier"} />
          <DetailRow label="Crédits" value={partner.credits_balance} />
          <DetailRow label="Ville" value={partner.city} />
          <DetailRow label="Site web" value={partner.website} />
          <DetailRow label="Facebook" value={partner.facebook_url} />
          <DetailRow label="Services" value={partner.services?.join(", ")} />
          <DetailRow label="Zones d'intervention" value={partner.zones?.join(", ")} />
          <DetailRow
            label="Intéressé par un site internet"
            value={
              partner.wants_website === true
                ? "Oui"
                : partner.wants_website === false
                ? "Non"
                : "—"
            }
          />
          <DetailRow
            label="Intéressé par un logo"
            value={
              partner.wants_logo === true
                ? "Oui"
                : partner.wants_logo === false
                ? "Non"
                : "—"
            }
          />
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
          <DetailRow
            label="Inscrit le"
            value={new Date(partner.created_at).toLocaleString("fr-FR")}
          />
          {partner.approved_at && (
            <DetailRow
              label="Approuvé le"
              value={new Date(partner.approved_at).toLocaleString("fr-FR")}
            />
          )}
          {partner.paused_at && (
            <DetailRow
              label="Mis en pause le"
              value={new Date(partner.paused_at).toLocaleString("fr-FR")}
            />
          )}
          {partner.pause_reason && <DetailRow label="Motif pause" value={partner.pause_reason} />}
          {partner.rejected_at && (
            <DetailRow
              label="Rejeté le"
              value={new Date(partner.rejected_at).toLocaleString("fr-FR")}
            />
          )}
          {partner.rejection_reason && (
            <DetailRow label="Motif rejet" value={partner.rejection_reason} />
          )}
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
