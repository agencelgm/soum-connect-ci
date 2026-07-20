import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMarketplace, unlockLead, myUnlockedLeads } from "@/lib/marketplace.functions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { isUnauthorizedError } from "@/lib/auth-actions";
import { UnauthorizedScreen } from "@/components/auth/UnauthorizedScreen";
import { cn } from "@/lib/utils";
import { getUnlimitedStatus } from "@/lib/credit-packs";
import { RenewUnlimitedButton } from "@/components/payments/RenewUnlimitedButton";
import {
  MapPin,
  Building2,
  Wallet,
  Users,
  Lock,
  Sparkles,
  Clock,
  Unlock,
  CalendarClock,
  Crown,
  Star,
  History,
  Info,
  AlertTriangle,
  Search,
  X,
} from "lucide-react";

const WHATSAPP_PREMIUM_URL =
  "https://wa.me/2250798172339?text=" +
  encodeURIComponent(
    "Bonjour, je fais partie de Soumission comptable. Je voudrais savoir comment devenir un client premium avec vous.",
  );

export const Route = createFileRoute("/_authenticated/marketplace")({
  head: () => ({
    meta: [{ title: "Marketplace de leads" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    lead: typeof s.lead === "string" && s.lead.length > 0 && s.lead.length < 100 ? s.lead : undefined,
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const { user } = useAuth();
  const { lead: focusLeadId } = Route.useSearch();
  const fetchList = useServerFn(listMarketplace);
  const fetchMine = useServerFn(myUnlockedLeads);
  const { data, isLoading, error } = useQuery({
    queryKey: ["marketplace"],
    queryFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) return null;
      return fetchList();
    },
    enabled: !!user,
    retry: false,
  });
  const { data: mine, error: mineError } = useQuery({
    queryKey: ["my-unlocks"],
    queryFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) return { items: [] };
      return fetchMine();
    },
    enabled: !!user,
    retry: false,
  });
  const [tab, setTab] = useState<"available" | "mine">("available");
  const [filter, setFilter] = useState<"all" | "available" | "full">(
    focusLeadId ? "all" : "available",
  );
  const [searchQ, setSearchQ] = useState("");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<"all" | "24h" | "7d" | "30d">("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "filling">("recent");

  // Scroll to and highlight the lead from ?lead= (deep-link from email).
  useEffect(() => {
    if (!focusLeadId || !data) return;
    const t = setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-lead-id="${focusLeadId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 4000);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [focusLeadId, data]);

  const isPremium = data?.partner?.tier === "premium";
  const unlimitedUntilRaw = (data?.partner as { unlimited_until?: string | null } | undefined)?.unlimited_until ?? null;
  const unlimitedStatus = getUnlimitedStatus(unlimitedUntilRaw);
  const isUnlimitedActive = unlimitedStatus.active;
  const unlimitedUntil = unlimitedStatus.expiresAt;
  const hasPriorityAccess = isPremium || isUnlimitedActive;

  if (isUnauthorizedError(error) || isUnauthorizedError(mineError)) {
    return <UnauthorizedScreen />;
  }
  if (isLoading) return <p className="text-muted-foreground">Chargement…</p>;

  if (!data?.partner) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p>Aucun compte partenaire approuvé.</p>
        <Button asChild className="mt-3">
          <Link to="/marketplace">Retour</Link>
        </Button>
      </div>
    );
  }
  const partnerApproved = data.partner.status === "approved";
  const partnerPending = data.partner.status === "pending_review";
  const partnerPaused = data.partner.status === "paused";

  const normalize = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const q = normalize(searchQ.trim());
  const ageMs =
    ageFilter === "24h" ? 864e5 : ageFilter === "7d" ? 7 * 864e5 : ageFilter === "30d" ? 30 * 864e5 : 0;
  const nowMs = Date.now();
  const searchedLeads = data.leads.filter((l) => {
    if (cityFilter !== "all" && (l.city ?? "") !== cityFilter) return false;
    if (serviceFilter !== "all" && (l.service ?? "") !== serviceFilter) return false;
    const refTs = new Date(l.submitted_at ?? l.published_at).getTime();
    if (ageMs > 0 && nowMs - refTs > ageMs) return false;
    if (q) {
      const hay = normalize(
        [l.city, l.service, l.legal_form, l.budget, l.summary, l.delai]
          .filter(Boolean)
          .join(" "),
      );
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const tsOf = (l: typeof searchedLeads[number]) =>
    new Date(l.submitted_at ?? l.published_at).getTime();
  const sortedLeads = [...searchedLeads].sort((a, b) => {
    if (sortBy === "oldest") return tsOf(a) - tsOf(b);
    if (sortBy === "filling") return b.unlock_count / b.max_unlocks - a.unlock_count / a.max_unlocks;
    return tsOf(b) - tsOf(a);
  });
  const availableLeads = sortedLeads.filter((l) => l.unlock_count < l.max_unlocks);
  const fullLeads = sortedLeads.filter((l) => l.unlock_count >= l.max_unlocks);
  const visibleLeads =
    filter === "available"
      ? availableLeads
      : filter === "full"
        ? fullLeads
        : [...availableLeads, ...fullLeads];

  const cityOptions = Array.from(
    new Set(data.leads.map((l) => l.city).filter((v): v is string => !!v)),
  ).sort();
  const serviceOptions = Array.from(
    new Set(data.leads.map((l) => l.service).filter((v): v is string => !!v)),
  ).sort();
  const hasActiveFilters =
    searchQ !== "" || cityFilter !== "all" || serviceFilter !== "all" || ageFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Marketplace de leads</h1>
          <p className="text-sm text-muted-foreground">{data.partner.cabinet_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg border bg-card px-4 py-3">
            <div className="text-xs uppercase text-muted-foreground">Crédits</div>
            <div className="text-2xl font-bold">{data.partner.credits_balance}</div>
          </div>
          <Button asChild variant={data.partner.credits_balance < 3 ? "default" : "outline"}>
            <Link to="/recharger">Recharger</Link>
          </Button>
        </div>
      </div>

      {isUnlimitedActive && (() => {
        const critical = unlimitedStatus.level === "critical";
        const warning = unlimitedStatus.level === "warning";
        const tone = critical
          ? "border-red-300 bg-gradient-to-r from-red-50 via-orange-50 to-red-50"
          : warning
            ? "border-orange-300 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50"
            : "border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50";
        const Icon = critical || warning ? AlertTriangle : Crown;
        const iconColor = critical ? "text-red-600" : warning ? "text-orange-600" : "text-amber-600";
        const titleColor = critical ? "text-red-900" : warning ? "text-orange-900" : "text-amber-900";
        const bodyColor = critical ? "text-red-800" : warning ? "text-orange-800" : "text-amber-800";
        const daysTxt =
          unlimitedStatus.daysLeft <= 1
            ? unlimitedStatus.hoursLeft <= 24
              ? `${unlimitedStatus.hoursLeft} h`
              : "1 jour"
            : `${unlimitedStatus.daysLeft} jours`;
        const title = critical
          ? `Votre accès illimité expire dans ${daysTxt}`
          : warning
            ? `Votre accès illimité expire dans ${daysTxt}`
            : "Accès illimité actif";
        return (
          <div className={`rounded-xl border p-4 flex items-center gap-3 ${tone}`}>
            <Icon className={`h-6 w-6 shrink-0 ${iconColor}`} />
            <div className="flex-1">
              <p className={`font-semibold ${titleColor}`}>{title}</p>
              <p className={`text-sm ${bodyColor}`}>
                {critical || warning ? (
                  <>
                    Renouvelez avant le{" "}
                    <strong>{unlimitedUntil?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>{" "}
                    pour continuer à débloquer des leads sans consommer vos crédits.
                  </>
                ) : (
                  <>
                    Déblocages sans consommer vos crédits + <strong>3 h d'avance</strong> sur chaque nouveau prospect, jusqu'au{" "}
                    <strong>{unlimitedUntil?.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</strong>.
                  </>
                )}
              </p>
            </div>
            {(critical || warning) ? (
              <div className="flex flex-col items-end gap-1">
                <RenewUnlimitedButton
                  partnerId={data.partner.id}
                  variant={critical ? "red" : "orange"}
                  ctaText={critical ? "Renouveler maintenant" : "Prolonger 30 jours"}
                />
                <Link to="/recharger" className="text-[11px] text-muted-foreground hover:underline">
                  ou comparer les packs
                </Link>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="border-amber-400 text-amber-900 hover:bg-amber-100">
                <Link to="/historique">
                  <History className="h-4 w-4 mr-1.5" />
                  Historique
                </Link>
              </Button>
            )}
          </div>
        );
      })()}

      {!isUnlimitedActive && unlimitedStatus.level === "expired" && (
        <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 flex items-center gap-3">
          <Clock className="h-6 w-6 text-slate-600 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Votre accès illimité a expiré</p>
            <p className="text-sm text-slate-700">
              Vos crédits {data.partner.credits_balance} sont de nouveau utilisés à chaque déblocage. Renouvelez pour retrouver l'illimité et les 3 h d'avance Premium.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <RenewUnlimitedButton
              partnerId={data.partner.id}
              variant="slate"
              ctaText="Réactiver l'illimité"
            />
            <Link to="/recharger" className="text-[11px] text-muted-foreground hover:underline">
              ou comparer les packs
            </Link>
          </div>
        </div>
      )}

      {!isUnlimitedActive && (
        <div className="rounded-xl border bg-muted/30 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-foreground">Comment fonctionnent les crédits</p>
            <p className="text-muted-foreground mt-0.5">
              <strong>1 crédit</strong> = 1 prospect débloqué (coordonnées complètes).
              Starter (10k) = 50 prospects · Pro (25k) = 125 prospects · Illimité (50k) = prospects illimités pendant 30 jours sans toucher à vos crédits.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link to="/recharger">Comparer les packs</Link>
          </Button>
        </div>
      )}


      {isPremium ? (
        <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4 flex items-center gap-3">
          <Crown className="h-6 w-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">Vous êtes client Premium</p>
            <p className="text-sm text-amber-800">
              Vous bénéficiez d'une avance exclusive de 3 heures sur chaque nouveau prospect avant
              qu'il ne soit ouvert aux autres cabinets.
            </p>
          </div>
        </div>
      ) : isUnlimitedActive ? (
        <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 p-4 flex items-center gap-3">
          <Crown className="h-6 w-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">Avantages Premium inclus avec l'illimité</p>
            <p className="text-sm text-amber-800">
              Tant que votre accès illimité est actif, vous accédez aussi aux nouveaux prospects <strong>3 heures avant</strong> les autres cabinets, comme nos clients Premium.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border bg-muted/40 p-4 flex items-center gap-3">
          <Star className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Devenez client Premium</p>
            <p className="text-sm text-muted-foreground">
              Accédez aux nouveaux prospects 3 heures avant tout le monde — également inclus dans le pack Illimité.
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <a href={WHATSAPP_PREMIUM_URL} target="_blank" rel="noopener noreferrer">
              Nous contacter
            </a>
          </Button>
        </div>
      )}

      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "available" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setTab("available")}
        >
          Leads disponibles ({data.leads.length})
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === "mine" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setTab("mine")}
        >
          Mes leads débloqués ({mine?.items.length ?? 0})
        </button>
      </div>

      {tab === "available" && (
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-3 space-y-2">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Rechercher (ville, service, budget, résumé…)"
                  className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-2 text-sm"
                />
              </div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm max-w-[180px]"
              >
                <option value="all">Toutes les villes</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm max-w-[220px]"
              >
                <option value="all">Tous les services</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value as typeof ageFilter)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="all">Reçus : toutes dates</option>
                <option value="24h">Reçus dernières 24h</option>
                <option value="7d">Reçus 7 derniers jours</option>
                <option value="30d">Reçus 30 derniers jours</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              >
                <option value="recent">Plus récents d'abord</option>
                <option value="oldest">Plus anciens d'abord</option>
                <option value="filling">Bientôt complets</option>
              </select>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQ("");
                    setCityFilter("all");
                    setServiceFilter("all");
                    setAgeFilter("all");
                  }}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <X className="h-3 w-3" /> Réinitialiser
                </button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {searchedLeads.length} lead{searchedLeads.length > 1 ? "s" : ""} affiché{searchedLeads.length > 1 ? "s" : ""} sur {data.leads.length} au total
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {(
              [
                ["all", "Tous", searchedLeads.length],
                ["available", "Disponibles", availableLeads.length],
                ["full", "Complets", fullLeads.length],
              ] as const
            ).map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  filter === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50",
                )}
              >
                {label} <span className="ml-1 opacity-70">{count}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleLeads.length === 0 && (
              <p className="text-muted-foreground col-span-2">
                {filter === "full"
                  ? "Aucun lead complet pour le moment."
                  : "Aucun lead disponible pour le moment."}
              </p>
            )}
            {visibleLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                alreadyUnlocked={data.unlocked_ids.includes(lead.id)}
                credits={data.partner!.credits_balance}
                isPremium={isPremium}
                isUnlimited={isUnlimitedActive}
                hasPriorityAccess={hasPriorityAccess}
                partnerApproved={partnerApproved}
                partnerPending={partnerPending}
                partnerPaused={partnerPaused}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "mine" && (
        <div className="space-y-3">
          {(mine?.items ?? []).length === 0 && (
            <p className="text-muted-foreground">Vous n'avez encore débloqué aucun lead.</p>
          )}
          {(mine?.items ?? []).map((item) => (
            <UnlockedRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

type Lead = {
  id: string;
  service: string | null;
  city: string | null;
  audience: string;
  legal_form: string | null;
  budget: string | null;
  summary: string | null;
  unlock_count: number;
  max_unlocks: number;
  published_at: string;
  delai: string | null;
  premium_until: string | null;
  submitted_at?: string | null;
};

function LeadCard({
  lead,
  alreadyUnlocked,
  credits,
  isPremium,
  isUnlimited,
  hasPriorityAccess,
  partnerApproved,
  partnerPending,
  partnerPaused,
}: {
  lead: Lead;
  alreadyUnlocked: boolean;
  credits: number;
  isPremium: boolean;
  isUnlimited: boolean;
  hasPriorityAccess: boolean;
  partnerApproved: boolean;
  partnerPending: boolean;
  partnerPaused: boolean;
}) {
  const qc = useQueryClient();
  const unlock = useServerFn(unlockLead);
  const [revealed, setRevealed] = useState<{
    full_name?: string | null;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
  } | null>(null);
  const mut = useMutation({
    mutationFn: async () => {
      const { data: authData, error } = await supabase.auth.getUser();
      if (error || !authData.user) throw new Error("Veuillez vous reconnecter.");
      return unlock({ data: { publication_id: lead.id } });
    },
    onSuccess: (res) => {
      setRevealed(res.prospect);
      toast.success(
        res.already_unlocked
          ? "Lead déjà débloqué"
          : isUnlimited
            ? "Lead débloqué (accès illimité)"
            : "Lead débloqué — 1 crédit utilisé",
      );
      qc.invalidateQueries({ queryKey: ["marketplace"] });
      qc.invalidateQueries({ queryKey: ["my-unlocks"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Erreur"),
  });

  const remaining = lead.max_unlocks - lead.unlock_count;
  const isFull = lead.unlock_count >= lead.max_unlocks;
  const premiumUntilMs = lead.premium_until ? new Date(lead.premium_until).getTime() : 0;
  const [now, setNow] = useState(() => Date.now());
  const inPremiumWindow = premiumUntilMs > now;
  useEffect(() => {
    if (!inPremiumWindow) return;
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, [inPremiumWindow]);
  const msLeft = Math.max(0, premiumUntilMs - now);
  const hLeft = Math.floor(msLeft / 3_600_000);
  const mLeft = Math.floor((msLeft % 3_600_000) / 60_000);
  const countdown = hLeft > 0 ? `${hLeft}h ${mLeft.toString().padStart(2, "0")}min` : `${mLeft}min`;

  const ageHours = Math.max(
    0,
    Math.floor((Date.now() - new Date(lead.published_at).getTime()) / 36e5),
  );
  const isFresh = ageHours < 48;
  const timeAgo =
    ageHours < 1
      ? "à l'instant"
      : ageHours < 24
        ? `il y a ${ageHours} h`
        : `il y a ${Math.floor(ageHours / 24)} j`;
  const fillRatio = lead.unlock_count / lead.max_unlocks;
  const urgencyColor =
    remaining <= 1 ? "bg-red-500" : remaining <= 3 ? "bg-orange-500" : "bg-emerald-500";
  const urgencyText =
    remaining <= 1 ? "text-red-600" : remaining <= 3 ? "text-orange-600" : "text-emerald-700";
  const audienceLabel =
    lead.audience === "creation"
      ? "Creation"
      : lead.audience === "gestion"
        ? "Gestion"
        : "A qualifier";

  return (
    <div
      data-lead-id={lead.id}
      className={cn(
        "rounded-xl border p-5 space-y-4",
        isFull && !alreadyUnlocked
          ? "bg-muted/40 opacity-60 grayscale-[30%]"
          : "group bg-card transition-all hover:shadow-lg hover:border-primary/40",
        inPremiumWindow && hasPriorityAccess && "border-amber-300 ring-1 ring-amber-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {inPremiumWindow && hasPriorityAccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                <Crown className="h-3 w-3" /> Avance prioritaire · {countdown}
              </span>
            )}
            {inPremiumWindow && !hasPriorityAccess && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">
                <Crown className="h-3 w-3" /> Réservé Premium/Illimité · {countdown}
              </span>
            )}
            {isFull && (
              <span className="inline-flex items-center gap-1 text-xs font-bold rounded-full bg-red-100 text-red-700 px-2.5 py-1 border border-red-200">
                <Lock className="h-3 w-3" /> Complet · {lead.max_unlocks}/{lead.max_unlocks}
              </span>
            )}
            {isFresh && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold rounded-full bg-primary/10 text-primary px-2 py-0.5">
                <Sparkles className="h-3 w-3" /> Nouveau
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" /> Publié {timeAgo}
            </span>
          </div>
          <h3 className="text-lg font-bold leading-tight">
            {lead.service || "Prestation à définir"}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-xs font-semibold rounded-full bg-muted px-2.5 py-1 whitespace-nowrap ${urgencyText}`}
          >
            {remaining} place{remaining > 1 ? "s" : ""} sur {lead.max_unlocks}
          </span>
          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full ${urgencyColor} transition-all`}
              style={{ width: `${Math.min(100, fillRatio * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-foreground/80">
          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{lead.city || "Ville non précisée"}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{audienceLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{lead.legal_form || "Forme non précisée"}</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/80">
          <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate font-medium">{lead.budget || "Budget non précisé"}</span>
        </div>
        {lead.delai && (
          <div className="flex items-center gap-2 text-foreground/80 col-span-2">
            <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate">
              <span className="text-muted-foreground">Démarrage :</span> {lead.delai}
            </span>
          </div>
        )}
      </div>

      {lead.summary && (
        <div className="rounded-md border border-primary/15 bg-primary/5 px-3 py-2 text-sm">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            Note LGM
          </p>
          <p className="leading-relaxed text-foreground/80">{lead.summary}</p>
        </div>
      )}

      {revealed ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm space-y-1">
          {revealed.full_name && (
            <p>
              <strong>Nom :</strong> {String(revealed.full_name)}
            </p>
          )}
          {revealed.company_name && (
            <p>
              <strong>Entreprise :</strong> {String(revealed.company_name)}
            </p>
          )}
          {revealed.email && (
            <p>
              <strong>Email :</strong>{" "}
              <a className="text-primary underline" href={`mailto:${revealed.email}`}>
                {String(revealed.email)}
              </a>
            </p>
          )}
          {revealed.phone && (
            <p>
              <strong>Téléphone :</strong>{" "}
              <a className="text-primary underline" href={`tel:${revealed.phone}`}>
                {String(revealed.phone)}
              </a>
            </p>
          )}
          {revealed.message && <p className="pt-2 italic">"{String(revealed.message)}"</p>}
        </div>
      ) : alreadyUnlocked ? (
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => mut.mutate()}
          disabled={mut.isPending}
        >
          <Unlock className="h-4 w-4 mr-2" />
          {mut.isPending ? "…" : "Afficher les coordonnées"}
        </Button>
      ) : isFull ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm space-y-2 text-center">
          <p className="font-semibold text-red-800">
            {lead.max_unlocks} cabinets ont déjà contacté ce prospect.
          </p>
          <p className="text-xs text-red-700">
            Pour ne plus rater d'opportunités, connectez-vous plus souvent et soyez parmi les
            premiers à débloquer les nouveaux leads.
          </p>
        </div>
      ) : inPremiumWindow && !hasPriorityAccess ? (
        <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
          <p className="font-semibold text-amber-900 text-center">
            Réservé aux clients Premium et Illimité
          </p>
          <p className="text-xs text-amber-800 text-center">
            Disponible pour tous dans {countdown}. Activez l'accès illimité ou devenez Premium pour accéder aux prospects en avant-première.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild size="sm" className="w-full">
              <Link to="/recharger">Activer l'illimité</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="w-full border-amber-400">
              <a href={WHATSAPP_PREMIUM_URL} target="_blank" rel="noopener noreferrer">
                Devenir Premium
              </a>
            </Button>
          </div>
        </div>
      ) : partnerPaused || partnerPending || !partnerApproved ? (
        <div className="space-y-1.5 pt-1">
          <Button
            type="button"
            disabled
            size="lg"
            variant="outline"
            className="w-full font-semibold"
            title={
              partnerPaused
                ? "Votre compte est en pause. Contactez-nous sur WhatsApp pour le réactiver."
                : "Votre compte est en cours de validation par l'équipe LGM."
            }
          >
            <Lock className="h-4 w-4 mr-2" />
            {partnerPaused ? "Réactivation requise" : "Approbation requise"}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            {partnerPaused
              ? "Contactez l'équipe LGM sur WhatsApp pour réactiver votre compte."
              : "Le déblocage sera activé dès la validation de votre cabinet."}
          </p>
        </div>
      ) : !isUnlimited && credits < 1 ? (
        <div className="space-y-1">
          <Button asChild variant="default" size="lg" className="w-full">
            <Link to="/recharger">Recharger pour débloquer</Link>
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">Crédits insuffisants</p>
        </div>
      ) : (
        <div className="space-y-1.5 pt-1">
          <Button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            size="lg"
            className="w-full font-semibold shadow-sm"
          >
            <Lock className="h-4 w-4 mr-2" />
            {mut.isPending
              ? "Déblocage…"
              : isUnlimited
                ? "Débloquer ce lead (illimité)"
                : "Débloquer ce lead (1 crédit)"}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            Vous obtiendrez : nom, email, téléphone et message complet
          </p>
        </div>
      )}
    </div>
  );
}

type UnlockedItem = {
  id: string;
  unlocked_at: string;
  publication_id: string;
  service: string | null;
  city: string | null;
  summary: string | null;
  prospect: {
    full_name?: string | null;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
  } | null;
};

function UnlockedRow({ item }: { item: UnlockedItem }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-sm">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold">
            {item.service || "Lead"} — {item.city || "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            Débloqué le {new Date(item.unlocked_at).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="text-right">
          {item.prospect?.email && (
            <a href={`mailto:${item.prospect.email}`} className="text-primary underline block">
              {item.prospect.email}
            </a>
          )}
          {item.prospect?.phone && (
            <a href={`tel:${item.prospect.phone}`} className="text-primary underline block">
              {item.prospect.phone}
            </a>
          )}
        </div>
      </div>
      {item.summary && (
        <div className="mt-3 rounded-md border border-primary/15 bg-primary/5 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Note LGM</p>
          <p className="mt-1 text-foreground/80">{item.summary}</p>
        </div>
      )}
      {item.prospect?.full_name && (
        <p className="mt-2">
          <strong>{item.prospect.full_name}</strong>
          {item.prospect.company_name ? ` · ${item.prospect.company_name}` : ""}
        </p>
      )}
      {item.prospect?.message && (
        <p className="mt-1 italic text-muted-foreground">"{item.prospect.message}"</p>
      )}
    </div>
  );
}
