import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PlayCircle, Play } from "lucide-react";
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

function getFinalPath(): string {
  try {
    return sessionStorage.getItem("finalThankYouPath") || "/merci";
  } catch {
    return "/merci";
  }
}

function FormationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<null | "yes" | "no">(null);
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function startVideo() {
    setStarted(true);
    requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {});
    });
  }

  async function handleClick(interested: boolean) {
    setLoading(interested ? "yes" : "no");

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

    await navigate({ to: getFinalPath() as never });
  }

  return (
    <main className="flex min-h-[100svh] flex-col bg-primary text-primary-foreground">
      <section className="mx-auto flex w-full max-w-[900px] flex-1 flex-col justify-center gap-7 px-5 py-8 sm:gap-8 md:py-12">
        <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Étape finale — important
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

        <p className="flex items-center justify-center gap-2 text-center text-xs md:text-sm text-primary-foreground/70">
          <PlayCircle className="h-4 w-4 shrink-0" />
          Regardez la vidéo en entier avant de choisir ci-dessous.
        </p>

        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-3">
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
      </section>
    </main>
  );
}