import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { getCounterpart } from "@/lib/route-map";

export function MobileCtaBar() {
  const { language, t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const target = getCounterpart(
    language === "en" ? "/demande-soumissions" : "/en/get-quotes",
    language,
  );

  // Hide on the quote-request page itself
  if (pathname === target) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-secondary px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(244,115,42,0.3)] lg:hidden relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
      <p className="text-[10px] text-white/85 text-center mb-1.5 font-medium tracking-wide">
        ⭐ {t.hero.rating}
      </p>
      <Link
        to={target}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-[0.9375rem] font-bold text-secondary shadow-sm hover:bg-white/95 active:scale-[0.98] transition-transform"
      >
        {language === "fr" ? "Obtenir mes soumissions gratuites" : "Get my free quotes"}
        <ArrowRight className="h-4 w-4 shrink-0" />
      </Link>
    </div>
  );
}
