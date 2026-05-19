import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, BarChart2, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const SERVICES = [
  { to: "/creation-entreprise-cote-divoire", label: "Création d'entreprise" },
  { to: "/comptabilite-entreprise-abidjan", label: "Comptabilité générale" },
  { to: "/declaration-fiscale-cote-divoire", label: "Déclaration fiscale" },
  { to: "/domiciliation-entreprise-abidjan", label: "Domiciliation Abidjan" },
] as const;

const NAV = [
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/faq", label: "FAQ" },
  { to: "/a-propos", label: "À propos" },
] as const;

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <BarChart2 className="h-5 w-5 text-secondary" />
          <span className="font-heading font-bold text-primary text-base sm:text-lg">
            SoumissionsComptables
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-sans text-sm font-medium">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 text-foreground hover:text-primary outline-none">
              Services <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {SERVICES.map((s) => (
                <DropdownMenuItem key={s.to} asChild>
                  <Link to={s.to}>{s.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/cabinet-comptable-abidjan" className="text-secondary font-semibold">
                  Tous les services →
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
          <a
            href="https://wa.me/22500000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] text-white px-3 py-2 text-xs font-semibold hover:opacity-90"
          >
            <WhatsAppIcon className="h-4 w-4" />
            +225 XX XX XX XX
          </a>
          <Link
            to="/demande-soumissions"
            className="inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm font-semibold hover:bg-secondary-dark transition-colors"
          >
            Obtenir mes soumissions
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
            <button
              onClick={() => setMobileServicesOpen((v) => !v)}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Services
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
                  to="/cabinet-comptable-abidjan"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-secondary"
                >
                  Tous les services →
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
            <a
              href="https://wa.me/22500000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white px-4 py-2 text-sm font-semibold"
            >
              <WhatsAppIcon className="h-4 w-4" />
              +225 XX XX XX XX
            </a>
            <Link
              to="/demande-soumissions"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-secondary text-white px-4 py-2 text-sm font-semibold hover:bg-secondary-dark"
            >
              Obtenir mes soumissions
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
