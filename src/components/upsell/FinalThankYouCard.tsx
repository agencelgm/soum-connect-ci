import { useEffect, useState } from "react";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029Va5QvIu6BIEdk2Gbcq0U";

type Props = {
  title?: string;
  intro?: string;
};

export function FinalThankYouCard({
  title = "D'accord, nous avons bien reçu votre demande",
  intro = "Notre équipe vous appellera pour valider votre demande avant que les cabinets comptables ne vous contactent.",
}: Props) {
  const [refusedFormation, setRefusedFormation] = useState(false);

  useEffect(() => {
    try {
      setRefusedFormation(sessionStorage.getItem("formationChoice") === "non");
    } catch {}
  }, []);

  return (
    <div className="mx-auto w-full max-w-[640px] rounded-2xl border border-border bg-white p-7 md:p-10 text-center shadow-lg">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
        <CheckCircle2 className="h-8 w-8 text-secondary" />
      </div>

      <h1 className="mt-5 font-heading text-2xl md:text-3xl font-bold text-primary">
        {title}
      </h1>

      <p className="mt-4 leading-relaxed text-foreground">{intro}</p>

      <div className="mt-5 flex items-start justify-center gap-2 rounded-xl border border-border bg-muted/40 p-4 text-left">
        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-muted-foreground">
          Notre bureau est ouvert du <strong>lundi au vendredi, de 9h00 à 17h00</strong>.
          C'est durant ces heures que nous vous appellerons pour valider votre demande.
        </p>
      </div>

      <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-semibold text-emerald-900">
          En attendant, rejoignez notre canal WhatsApp gratuit
        </p>
        <p className="mt-1 text-sm text-emerald-800">
          Vidéos, conseils et astuces pour développer votre entreprise — 100 % gratuit.
        </p>
        <a
          href={WHATSAPP_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          <MessageCircle className="h-4 w-4" />
          Rejoindre le canal WhatsApp gratuit
        </a>
      </div>

      {refusedFormation && (
        <p className="mt-6 text-sm text-muted-foreground">
          Vous avez changé d'avis ?{" "}
          <Link to="/formation-clients" className="font-semibold text-secondary underline">
            Découvrir la formation
          </Link>
        </p>
      )}
    </div>
  );
}