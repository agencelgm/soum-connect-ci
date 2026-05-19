import { Link, useRouterState } from "@tanstack/react-router";
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-secondary-dark/30 bg-secondary px-3 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
      <Link
        to={target}
        className="flex h-12 w-full items-center justify-center rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"
      >
        {t.cta.getQuotes} →
      </Link>
    </div>
  );
}