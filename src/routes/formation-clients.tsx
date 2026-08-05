import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PlayCircle, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrackingFields } from "@/lib/lead-tracking";
import { trackMetaConversion, type MetaUserData } from "@/lib/meta-pixel";
import videoAsset from "@/assets/formation-clients.mp4.asset.json";

const TRAINING_CHECKOUT_URL = "https://academielgm.com/prd_p987fb31";
const TITLE = "Ne quittez pas cette page — Formation clients | SoumissionComptable.com";
const DESCRIPTION =
  "Regardez cette courte vidéo pour savoir comment obtenir des clients pour votre entreprise.";

export const Route = createFileRoute("/formation-clients")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FormationPage,
});

function getNextOfferPath(): string {
  try {
    return sessionStorage.getItem("leadLanguage") === "en"
      ? "/en/website-offer"
      : "/offre-site-internet";
  } catch {
    return "/offre-site-internet";
  }
}

function getSessionId(): string {
  try {
    let sid = sessionStorage.getItem("funnelSessionId");
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem("funnelSessionId", sid);
    }
    return sid;
  } catch {
    return "anonymous";
  }
}

function trackFunnel(event: string) {
  let email: string | undefined;
  let leadId: string | undefined;
  try {
    leadId = sessionStorage.getItem("leadId") ?? undefined;
    const raw = sessionStorage.getItem("leadUser");
    if (raw) email = (JSON.parse(raw) as { email?: string }).email;
  } catch {}
  void fetch("/api/public/funnel-track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      page: "formation-clients",
      event,
      sessionId: getSessionId(),
      leadId,
      email,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    }),
  }).catch(() => {});
}

function FormationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<null | "yes" | "no">(null);
  const [started, setStarted] = useState(false);
  const [watchedRatio, setWatchedRatio] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const unlockedRef = useRef(false);
  // Couverture par tranches de 1 s : une tranche ne compte qu'une seule fois,
  // les sauts sur la barre de progression ne remplissent aucune tranche, et la
  // progression survit à une pause ou à un rechargement de page.
  const bucketsRef = useRef<Set<number>>(new Set());
  const lastTimeRef = useRef(0);
  const durationRef = useRef(0);

  useEffect(() => {
    trackFunnel("page_view");
    // Restauration après rechargement de page.
    try {
      const raw = sessionStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { buckets?: number[]; duration?: number };
        if (Array.isArray(saved.buckets)) bucketsRef.current = new Set(saved.buckets);
        if (typeof saved.duration === "number") durationRef.current = saved.duration;
        applyProgress();
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistProgress() {
    try {
      sessionStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({
          buckets: Array.from(bucketsRef.current),
          duration: durationRef.current,
        }),
      );
    } catch {}
  }

  function applyProgress() {
    const duration = durationRef.current;
    if (!duration || !Number.isFinite(duration) || duration <= 0) return;
    const needed = Math.max(1, Math.floor(duration * THRESHOLD));
    const seen = bucketsRef.current.size;
    const ratio = Math.min(1, seen / needed);
    setWatchedRatio(ratio);
    if (seen >= needed && !unlockedRef.current) {
      unlockedRef.current = true;
      setUnlocked(true);
      trackFunnel("video_75");
    }
  }

  function handleLoadedMetadata() {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    durationRef.current = video.duration;
    lastTimeRef.current = video.currentTime;
    applyProgress();
    persistProgress();
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.seeking) return;
    if (Number.isFinite(video.duration)) durationRef.current = video.duration;

    const current = video.currentTime;
    const previous = lastTimeRef.current;
    const delta = current - previous;
    lastTimeRef.current = current;

    // Saut (avant ou arrière) : on n'accorde aucune tranche.
    // La marge tient compte de l'intervalle naturel entre deux timeupdate,
    // même à vitesse de lecture accélérée (bornée à 2x plus bas).
    if (delta <= 0 || delta > 2.5) return;

    for (let t = Math.floor(previous); t <= Math.floor(current); t += 1) {
      bucketsRef.current.add(t);
    }
    applyProgress();
    persistProgress();
  }

  function startVideo() {
    setStarted(true);
    trackFunnel("video_play");
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {});
    });
  }

  async function handleClick(interested: boolean) {
    setLoading(interested ? "yes" : "no");
    trackFunnel(interested ? "choice_yes" : "choice_no");

    let leadId: string | undefined;
    try {
      leadId = sessionStorage.getItem("leadId") ?? undefined;
    } catch {}
    let leadUser: MetaUserData = {};
    try {
      const raw = sessionStorage.getItem("leadUser");
      if (raw) leadUser = JSON.parse(raw) as MetaUserData;
    } catch {}

    try {
      await fetch("/api/public/lead-upsell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          offer: "formation",
          interested,
          language: "fr",
          source: "upsell-formation-clients",
          ...getTrackingFields(),
        }),
      });
    } catch (err) {
      console.error("[upsell formation] submit failed", err);
    }

    try {
      sessionStorage.setItem("formationChoice", interested ? "oui" : "non");
    } catch {}

    if (interested) {
      trackMetaConversion(
        "AddToCart",
        {
          content_name: "Formation Clients",
          content_category: "upsell_formation",
          currency: "XOF",
        },
        leadUser,
      );
      window.location.href = TRAINING_CHECKOUT_URL;
      return;
    }

    await navigate({ to: getNextOfferPath() as never });
  }

  return (
    <main className="flex min-h-[100svh] flex-col bg-primary text-primary-foreground">
      <section className="mx-auto flex w-full max-w-[900px] flex-1 flex-col justify-center gap-7 px-5 py-8 sm:gap-8 md:py-12">
        <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Étape 1 sur 3 — important
        </p>

        <div className="space-y-3">
          <h1 className="text-center font-heading text-3xl md:text-5xl font-extrabold leading-tight">
            Ne quittez pas cette page
          </h1>
          <p className="text-center text-base md:text-2xl font-semibold text-primary-foreground/90">
            Regardez cette vidéo pour savoir quoi faire maintenant et quelle est la suite des choses.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={videoAsset.url}
            className="aspect-video w-full"
            controls={started}
            playsInline
            preload="metadata"
            controlsList="nodownload"
            onSeeked={() => {
              if (videoRef.current) lastTimeRef.current = videoRef.current.currentTime;
            }}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => trackFunnel("video_complete")}
          />
          {!started && (
            <button
              type="button"
              onClick={startVideo}
              aria-label="Cliquez ici pour regarder la vidéo"
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklab,var(--color-primary)_90%,transparent),black)] px-5 text-center"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-accent-foreground shadow-xl md:h-20 md:w-20">
                <Play className="h-7 w-7 md:h-9 md:w-9 fill-current" />
              </span>
              <span className="font-heading text-lg md:text-3xl font-extrabold leading-tight text-primary-foreground">
                Cliquez ici pour regarder la vidéo
              </span>
              <span className="text-xs md:text-base font-semibold uppercase tracking-[0.15em] text-accent">
                Quoi faire maintenant — la suite des choses
              </span>
            </button>
          )}
        </div>

        {!unlocked ? (
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-3">
            <p className="flex items-center justify-center gap-2 text-center text-xs md:text-sm text-primary-foreground/70">
              <Lock className="h-4 w-4 shrink-0" />
              Vos options apparaîtront pendant la vidéo. Continuez à regarder.
            </p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((watchedRatio / 0.75) * 100))}%` }}
              />
            </div>
          </div>
        ) : (
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-3">
          <p className="flex items-center justify-center gap-2 text-center text-xs md:text-sm text-primary-foreground/70">
            <PlayCircle className="h-4 w-4 shrink-0" />
            Choisissez ci-dessous pour continuer.
          </p>
          <Button
            type="button"
            onClick={() => handleClick(true)}
            disabled={loading !== null}
            className="h-auto whitespace-normal bg-accent px-6 py-4 text-base md:text-lg font-bold text-accent-foreground hover:bg-accent/90"
          >
            {loading === "yes"
              ? "…"
              : "Oui, je veux la formation — je veux savoir comment avoir des clients"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => handleClick(false)}
            disabled={loading !== null}
            className="h-auto whitespace-normal px-6 py-3 text-sm text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
          >
            {loading === "no"
              ? "…"
              : "Non merci, je n'ai pas besoin de savoir comment avoir des clients"}
          </Button>
        </div>
        )}
      </section>
    </main>
  );
}