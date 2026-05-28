import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Briefcase,
  CreditCard,
  UserCircle2,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Coins,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";

type NavItem = {
  to: "/marketplace" | "/recharger" | "/historique" | "/espace-partenaire" | "/admin";
  label: string;
  icon: typeof Briefcase;
  staffOnly?: boolean;
};

const NAV: NavItem[] = [
  { to: "/marketplace", label: "Marketplace", icon: Briefcase },
  { to: "/recharger", label: "Recharger crédits", icon: CreditCard },
  { to: "/historique", label: "Historique", icon: History },
  { to: "/espace-partenaire", label: "Mon compte", icon: UserCircle2 },
  { to: "/admin", label: "Administration", icon: ShieldCheck, staffOnly: true },
];

type Props = {
  email: string;
  creditsBalance: number | null;
  isStaff: boolean;
  onSignOut: () => void;
  children: React.ReactNode;
};

export function AppShell({ email, creditsBalance, isStaff, onSignOut, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const items = NAV.filter((n) => !n.staffOnly || isStaff);

  const initials = (email || "?")
    .split("@")[0]
    .split(/[._-]+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-card">
        <div className="px-5 py-5 border-b">
          <Link to="/marketplace" className="flex items-center gap-2">
            <img src={logo} alt="SoumissionComptable.com" className="h-20 w-auto" />
          </Link>
        </div>

        {creditsBalance !== null && (
          <div className="mx-4 mt-4 rounded-lg border bg-gradient-to-br from-primary/10 to-primary/5 p-4">
            <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-semibold">
              <Coins className="h-3.5 w-3.5" /> Solde
            </div>
            <div className="text-2xl font-bold mt-1">{creditsBalance} <span className="text-sm font-normal text-muted-foreground">crédits</span></div>
            <Button asChild size="sm" className="w-full mt-2">
              <Link to="/recharger">Recharger</Link>
            </Button>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3 space-y-2">
          <Button asChild variant="outline" className="w-full justify-start gap-2 font-medium">
            <a href="/">
              <ExternalLink className="h-4 w-4" />
              Retour au site
            </a>
          </Button>

          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {initials || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">Connecté en tant que</div>
              <div className="text-sm font-medium text-foreground truncate" title={email}>
                {email}
              </div>
            </div>
          </div>

          <Button
            onClick={onSignOut}
            variant="ghost"
            className="w-full justify-start gap-2 font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 h-14">
          <Link to="/marketplace" className="flex items-center gap-2">
            <img src={logo} alt="" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            {creditsBalance !== null && (
              <Link to="/recharger" className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold">
                <Coins className="h-3.5 w-3.5" /> {creditsBalance}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div className="lg:hidden border-b bg-card px-4 py-3 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 mt-2 border-t space-y-2">
              <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {initials || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">Connecté en tant que</div>
                  <div className="text-sm font-medium text-foreground truncate" title={email}>
                    {email}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <a href="/" onClick={() => setMobileOpen(false)}>
                  <ExternalLink className="h-4 w-4" />
                  Retour au site
                </a>
              </Button>
              <Button
                onClick={() => {
                  setMobileOpen(false);
                  onSignOut();
                }}
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" /> Déconnexion
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}