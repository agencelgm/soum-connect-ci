import { Button } from "@/components/ui/button";
import { whatsappReactivationUrl } from "@/lib/contact";
import { PauseCircle, MessageCircle } from "lucide-react";

type Props = {
  cabinetName?: string | null;
  pauseReason?: string | null;
};

export function PausedBanner({ cabinetName, pauseReason }: Props) {
  const waUrl = whatsappReactivationUrl(cabinetName);
  return (
    <div className="mb-6 rounded-xl border border-orange-300 bg-orange-50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700">
          <PauseCircle className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-orange-900">
            Compte en pause — réactivation requise
          </p>
          <p className="mt-1 text-sm text-orange-900/90">
            Votre compte est actuellement en pause
            {pauseReason ? ` (motif : ${pauseReason})` : ""}. Vous pouvez toujours parcourir la
            marketplace, mais le déblocage de nouveaux prospects est désactivé. Contactez-nous sur
            WhatsApp pour réactiver votre compte.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-[#25D366] text-white hover:bg-[#1ebe57] border border-[#1ebe57]"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Réactiver mon compte sur WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}