import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { getCounterpart, getLangFromPath } from "./route-map";
import { getTranslations, type TranslationDict } from "./translations";

export type Language = "fr" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDict;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const language: Language = getLangFromPath(pathname);

  const setLanguage = useCallback(
    (lang: Language) => {
      if (lang === language) return;
      const target = getCounterpart(pathname, lang);
      try {
        localStorage.setItem("lang", lang);
      } catch {
        // Invalid stored values fall back to the route-derived language.
      }
      router.navigate({ to: target });
    },
    [language, pathname, router],
  );

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "fr" ? "en" : "fr");
  }, [language, setLanguage]);

  const t = useMemo(() => getTranslations(language), [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
