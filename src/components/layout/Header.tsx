import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/comment-ca-marche", label: "Comment ça marche" },
  { to: "/guides", label: "Guides" },
  { to: "/cabinets-comptables-partenaires", label: "Cabinets partenaires" },
  { to: "/a-propos", label: "À propos" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="font-heading text-lg font-bold text-primary">
          SoumissionsComptables
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:text-primary"
            aria-label="Changer de langue"
          >
            <Globe className="h-3.5 w-3.5" />
            {language.toUpperCase()}
          </button>
          <Link
            to="/demande-soumissions"
            className="hidden md:inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary-dark transition-colors"
          >
            Demander des soumissions
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-app flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                activeProps={{ className: "bg-muted text-primary" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/demande-soumissions"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-secondary-dark"
            >
              Demander des soumissions
            </Link>
            <button
              onClick={toggleLanguage}
              className="mt-2 inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground"
            >
              <Globe className="h-4 w-4" />
              Langue : {language.toUpperCase()}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}