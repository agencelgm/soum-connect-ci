import { useEffect, useState } from "react";

/** Prochain vendredi 17:00 (heure d'Abidjan = UTC). */
export function nextFridayDeadline(from: Date = new Date()): Date {
  const d = new Date(
    Date.UTC(
      from.getUTCFullYear(),
      from.getUTCMonth(),
      from.getUTCDate(),
      17,
      0,
      0,
      0,
    ),
  );
  const day = d.getUTCDay(); // 0 dim … 5 ven
  let diff = (5 - day + 7) % 7;
  if (diff === 0 && from.getTime() >= d.getTime()) diff = 7;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

type Props = { language?: "fr" | "en" };

export function PromoCountdown({ language = "fr" }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const deadline = nextFridayDeadline(now ?? new Date());
  const dateLabel = deadline.toLocaleDateString(
    language === "en" ? "en-GB" : "fr-FR",
    { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" },
  );

  const ms = now ? Math.max(0, deadline.getTime() - now.getTime()) : 0;
  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const units = [
    { v: days, l: language === "en" ? "days" : "jours" },
    { v: hours, l: language === "en" ? "hours" : "heures" },
    { v: minutes, l: "min" },
    { v: seconds, l: "sec" },
  ];

  return (
    <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-secondary">
        {language === "en" ? "Offer ends" : "L'offre se termine"}{" "}
        {dateLabel} {language === "en" ? "at 5:00 PM" : "à 17h00"}
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        {units.map((u) => (
          <div
            key={u.l}
            className="min-w-[62px] rounded-lg bg-primary px-2 py-2 text-center text-primary-foreground"
          >
            <div className="font-heading text-xl font-extrabold tabular-nums">
              {now ? pad(u.v) : "--"}
            </div>
            <div className="text-[10px] uppercase tracking-wide opacity-80">
              {u.l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}