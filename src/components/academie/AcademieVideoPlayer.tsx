import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  /** Progression déjà atteinte (0–1) — persistée serveur. */
  initialMaxProgress?: number;
  /** Vidéo déjà complétée ? */
  initiallyCompleted?: boolean;
  /** Empêcher d'avancer au-delà de la position max déjà visionnée. */
  preventSkipAhead?: boolean;
  /** Callback throttlé (par défaut ~15 s) pendant la lecture. */
  onProgress?: (ratio: number) => void;
  /** Callback quand la vidéo se termine. */
  onCompleted?: () => void;
};

export function AcademieVideoPlayer({
  src,
  initialMaxProgress = 0,
  initiallyCompleted = false,
  preventSkipAhead = false,
  onProgress,
  onCompleted,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const maxWatchedRef = useRef(0);
  const lastReportedRef = useRef(0);
  const [ratio, setRatio] = useState(initialMaxProgress);
  const [completed, setCompleted] = useState(initiallyCompleted);

  useEffect(() => {
    if (initiallyCompleted) setCompleted(true);
  }, [initiallyCompleted]);

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    if (v.currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = v.currentTime;
      const r = maxWatchedRef.current / v.duration;
      setRatio(r);
      if (v.currentTime - lastReportedRef.current >= 15) {
        lastReportedRef.current = v.currentTime;
        onProgress?.(Math.min(1, Math.max(0, r)));
      }
    }
  }

  function handleSeeking() {
    if (!preventSkipAhead) return;
    const v = videoRef.current;
    if (!v) return;
    const allowed = maxWatchedRef.current + 2;
    if (v.currentTime > allowed) v.currentTime = maxWatchedRef.current;
  }

  function handleEnded() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    maxWatchedRef.current = v.duration;
    setRatio(1);
    setCompleted(true);
    onCompleted?.();
  }

  return (
    <div>
      <video
        ref={videoRef}
        src={src}
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
          <span className="font-semibold">{Math.round(ratio * 100)}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all ${completed ? "bg-emerald-500" : "bg-primary"}`}
            style={{ width: `${Math.round(ratio * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}