import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";
import { useRouterState } from "@tanstack/react-router";
import logo from "@/assets/brand/logo-soumissions-comptables.jpg";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";


function LangToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => setLanguage("fr")}
        className={language === "fr" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
      >
        FR
      </button>
      <span className="text-muted-foreground">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={language === "en" ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"}
      >
        EN
      </button>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { language, t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const homeHref = language === "en" ? "/en" : "/";
  const quotesHref = getCounterpart(
    language === "en" ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );

  const SERVICES = [
    { to: getCounterpart("/creation-entreprise-cote-divoire", language), label: t.services.creation },
    { to: "/comptabilite-entreprise-abidjan", label: t.services.accounting },
    { to: "/declaration-fiscale-cote-divoire", label: t.services.tax },
    { to: "/domiciliation-entreprise-abidjan", label: t.services.domiciliation },
    { to: getCounterpart("/cabinet-comptable-abidjan", language), label: "Cabinet comptable à Abidjan" },
    { to: "/creation-entreprise-diaspora-ivoirienne", label: "Création — diaspora ivoirienne" },
    { to: "/cabinets-comptables-partenaires", label: "Cabinets partenaires" },
  ];

  const NAV = [
    { to: "/comment-ca-marche", label: t.nav.howItWorks },
    { to: "/guides", label: t.nav.blog },
    { to: "/faq", label: t.nav.faq },
    { to: "/a-propos", label: t.nav.about },
  ];
  // keep pathname referenced for re-render correctness
  void pathname;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-32 flex items-center justify-between gap-4">
        <Link to={homeHref} aria-label="SoumissionComptable.com — Accueil" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="SoumissionComptable.com"
            width={540}
            height={144}
            className="h-30 w-auto"
            style={{ height: "120px" }}
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-sans text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 text-foreground hover:text-primary outline-none">
              {t.nav.services} <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {SERVICES.map((s) => (
                <DropdownMenuItem key={s.to} asChild>
                  <Link to={s.to}>{s.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={getCounterpart("/cabinet-comptable-abidjan", language)} className="text-secondary font-semibold">
                  {t.nav.allServices}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LangToggle />
          <Link
            to={quotesHref}
            className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm font-semibold hover:bg-secondary-dark transition-colors"
          >
            {t.nav.getQuotes}
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-foreground"
          aria-label={t.nav.menu}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
            <Link
              to={homeHref}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
            >
              {t.nav.home}
            </Link>
            <button
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              {t.nav.services}
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {mobileServicesOpen && (
              <div className="ml-3 flex flex-col gap-1 border-l border-border pl-3">
                {SERVICES.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    {s.label}
                  </Link>
                ))}
                <Link
                  to={getCounterpart("/cabinet-comptable-abidjan", language)}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-secondary"
                >
                  {t.nav.allServices}
                </Link>
              </div>
            )}
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between px-3">
              <LangToggle />
            </div>
            <Link
              to={quotesHref}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm font-semibold hover:bg-secondary-dark"
            >
              {t.nav.getQuotes}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
