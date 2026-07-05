import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMyPartner, markTutorialProgress } from "@/lib/partners.functions";
import { Button } from "@/components/ui/button";
import { whatsappSupportUrl, WHATSAPP_SUPPORT_NUMBER } from "@/lib/contact";
import { AlertTriangle, CheckCircle2, Clock, MessageCircle, Phone } from "lucide-react";
import tutoVideo from "@/assets/tutoriel-partenaire.mp4.asset.json";

export const Route = createFileRoute("/_authenticated/tutoriel-partenaire")({
  head: () => ({
    meta: [
      { title: "Tutoriel obligatoire" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: TutorielPage,
});

function TutorielPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const meFn = useServerFn(getMyPartner);
  const markFn = useServerFn(markTutorialProgress);
  const { data: me } = useQuery({
    queryKey: ["my-partner"],
    queryFn: () => meFn(),
    retry: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedRef = useRef(0);
  const lastReportedRef = useRef(0);
  const [watchedRatio, setWatchedRatio] = useState(0);
  const [completed, setCompleted] = useState<boolean>(
    !!me?.partner?.tutorial_watched_at,
  );

  // Sync from server after fetch
  useEffect(() => {
    if (me?.partner?.tutorial_watched_at) setCompleted(true);
    if (me?.partner?.tutorial_max_progress) {
      const p = Number(me.partner.tutorial_max_progress) || 0;
      setWatchedRatio((r) => Math.max(r, p));
    }
  }, [me?.partner?.tutorial_watched_at, me?.partner?.tutorial_max_progress]);

  async function sendProgress(progress: number, completedFlag: boolean) {
    try {
      const res = await markFn({
        data: { progress: Math.min(1, Math.max(0, progress)), completed: completedFlag },
      });
      if (res.watched_at) setCompleted(true);
      qc.invalidateQueries({ queryKey: ["my-partner"] });
    } catch {
      // silencieux : on ré-essaiera au prochain tick
    }
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    if (v.currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = v.currentTime;
      const ratio = maxWatchedRef.current / v.duration;
      setWatchedRatio(ratio);
      // Envoi throttlé toutes les ~15 s
      if (v.currentTime - lastReportedRef.current >= 15) {
        lastReportedRef.current = v.currentTime;
        sendProgress(ratio, false);
      }
    }
  }

  function handleSeeking() {
    const v = videoRef.current;
    if (!v) return;
    // Autorise de revenir en arrière, empêche d'avancer au-delà de ce qui a été vu
    const allowed = maxWatchedRef.current + 2;
    if (v.currentTime > allowed) v.currentTime = maxWatchedRef.current;
  }

  function handleEnded() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    maxWatchedRef.current = v.duration;
    setWatchedRatio(1);
    setCompleted(true);
    sendProgress(1, true);
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Avant de commencer — regardez ce tutoriel</h1>
        <p className="mt-1 text-muted-foreground">
          Étape 1 sur 3 · Découverte de la plateforme
        </p>
      </div>

      {!completed && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="text-sm text-red-900">
            <p className="font-semibold">Cette vidéo est obligatoire.</p>
            <p className="mt-0.5">
              Sans visionnage complet, votre compte ne sera pas approuvé par notre équipe.
            </p>
          </div>
        </div>
      )}

      {completed && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-300 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="flex-1 text-sm text-emerald-900">
            <p className="font-semibold">Merci — vidéo terminée.</p>
            <p className="mt-0.5">
              Vous pouvez maintenant accéder à votre espace partenaire. Notre équipe validera votre
              compte sous 24 h ouvrées.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: "/espace-partenaire", replace: true })}
            className="shrink-0"
          >
            Accéder à mon espace
          </Button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border bg-card p-3">
          <video
            ref={videoRef}
            src={tutoVideo.url}
            className="w-full rounded-lg bg-black"
            controls
            playsInline
            controlsList="nodownload noplaybackrate"
            onContextMenu={(e) => e.preventDefault()}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onEnded={handleEnded}
          />
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progression</span>
              <span className="font-semibold">{Math.round(watchedRatio * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full transition-all ${completed ? "bg-emerald-500" : "bg-primary"}`}
                style={{ width: `${Math.round(watchedRatio * 100)}%` }}
              />
            </div>
          </div>

          <ol className="mt-5 grid gap-3 sm:grid-cols-3 text-sm">
            <li className="rounded-lg border p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Étape 1
              </p>
              <p className="mt-1 font-medium">Regardez la vidéo</p>
              <p className="mt-0.5 text-muted-foreground">
                Découvrez comment fonctionne la plateforme.
              </p>
            </li>
            <li className="rounded-lg border p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Étape 2
              </p>
              <p className="mt-1 font-medium">Validation sous 24 h</p>
              <p className="mt-0.5 text-muted-foreground">
                Notre équipe vérifie votre cabinet en jours ouvrés.
              </p>
            </li>
            <li className="rounded-lg border p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                Étape 3
              </p>
              <p className="mt-1 font-medium">Débloquez vos leads</p>
              <p className="mt-0.5 text-muted-foreground">
                Contactez vos premiers prospects qualifiés.
              </p>
            </li>
          </ol>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Clock className="h-4 w-4" />
              Compte en attente d'approbation
            </div>
            <p className="mt-2 text-sm text-foreground/80">
              Une fois la vidéo terminée, notre équipe valide votre cabinet — généralement{" "}
              <strong>sous 24 h ouvrées</strong>.
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm font-semibold">Horaires du service client</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Lundi au Vendredi
              <br />
              9 h – 17 h (heure d'Abidjan)
            </p>
          </div>

          <div className="rounded-xl border bg-card p-4 space-y-3">
            <p className="text-sm font-semibold">Besoin d'aide&nbsp;?</p>
            <p className="text-sm text-muted-foreground">
              Notre équipe est joignable pendant les horaires d'ouverture.
            </p>
            <Button
              asChild
              className="w-full bg-[#25D366] text-white hover:bg-[#1ebe57] border border-[#1ebe57]"
            >
              <a
                href={whatsappSupportUrl(
                  "Bonjour LGM, j'ai besoin d'aide concernant mon inscription partenaire.",
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <a href={`tel:+${WHATSAPP_SUPPORT_NUMBER}`}>
                <Phone className="h-4 w-4" />
                +225 07 98 17 23 39
              </a>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}