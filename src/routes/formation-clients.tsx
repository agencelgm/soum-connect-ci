import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
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
    <main className="min-h-screen bg-primary text-primary-foreground">
      <section className="mx-auto w-full max-w-[900px] px-5 py-10 md:py-14">
        <p className="text-center text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-accent">
          Étape finale — important
        </p>

        <h1 className="mt-4 text-center font-heading text-3xl md:text-5xl font-extrabold leading-tight">
          Ne quittez pas cette page
        </h1>
        <p className="mt-4 text-center text-lg md:text-2xl font-semibold text-primary-foreground/90">
          Regardez cette vidéo pour savoir quoi faire maintenant et quelle est la suite des choses.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
          <video
            src={videoAsset.url}
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            controlsList="nodownload"
          />
        </div>

        <p className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
          <PlayCircle className="h-4 w-4" />
          Regardez la vidéo en entier avant de choisir ci-dessous.
        </p>

        <div className="mx-auto mt-8 flex max-w-[620px] flex-col gap-3">
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