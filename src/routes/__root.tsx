import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/lib/auth-context";

import appCss from "../styles.css?url";
import { LanguageProvider } from "@/lib/language-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { getLangFromPath } from "@/lib/route-map";
import { MobileCtaBar } from "@/components/layout/MobileCtaBar";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { META_PIXEL_ID } from "@/lib/meta-pixel";

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const ga4Id = import.meta.env.VITE_GA4_ID as string | undefined;
    const gscToken = import.meta.env.VITE_GSC_VERIFICATION as string | undefined;

    const meta: Array<Record<string, string>> = [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index,follow" },
      { property: "og:site_name", content: "SoumissionsComptables.ci" },
      { property: "og:locale", content: "fr_CI" },
      { property: "og:type", content: "website" },
    ];
    if (gscToken) {
      meta.push({ name: "google-site-verification", content: gscToken });
    }

    const scripts: Array<Record<string, string>> = [];
    if (ga4Id) {
      scripts.push({
        src: `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`,
        async: "true",
      });
      scripts.push({
        children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`,
      });
    }

    // Meta Pixel (PageView initial uniquement, le SPA gère les suivants via useEffect)
    scripts.push({
      children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
    });

    return {
      meta,
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
      ],
      scripts,
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = getLangFromPath(pathname);
  return (
    <html lang={lang === "en" ? "en" : "fr"}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Meta Pixel : PageView à chaque navigation SPA (le 1er PageView est déjà
  // déclenché par le snippet inline dans <head>).
  const isFirstPv = useRef(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstPv.current) {
      isFirstPv.current = false;
      return;
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  // Routes immersives : pas de header/footer public, le shell auth prend tout.
  const immersiveAuth =
    pathname === "/marketplace" ||
    pathname.startsWith("/marketplace/") ||
    pathname === "/recharger" ||
    pathname.startsWith("/recharger/") ||
    pathname === "/historique" ||
    pathname.startsWith("/historique/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/espace-partenaire" ||
    pathname.startsWith("/espace-partenaire/") ||
    pathname === "/changer-mot-de-passe";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthSync />
        <LanguageProvider>
        <div className={`flex min-h-screen flex-col bg-background ${immersiveAuth ? "" : "pb-16 lg:pb-0"}`}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
          >
            Aller au contenu principal
          </a>
          {!immersiveAuth && <Header />}
          <main id="main" tabIndex={-1} className="flex-1 outline-none overflow-x-hidden">
            <Outlet />
          </main>
          {!immersiveAuth && <Footer />}
          {!immersiveAuth && <MobileCtaBar />}
          <Toaster />
        </div>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthSync() {
  const router = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      qc.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, qc]);
  return null;
}
