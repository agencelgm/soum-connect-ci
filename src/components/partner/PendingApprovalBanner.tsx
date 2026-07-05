import { useState } from "react";
import { Button } from "@/components/ui/button";
import { whatsappSupportUrl } from "@/lib/contact";
import { Clock, MessageCircle, ChevronDown, ChevronUp, FileCheck2 } from "lucide-react";

type Props = {
  cabinetName?: string | null;
};

export function PendingApprovalBanner({ cabinetName }: Props) {
  const [openDocs, setOpenDocs] = useState(false);
  const message =
    `Bonjour LGM, je viens de créer mon compte partenaire${cabinetName ? ` (${cabinetName})` : ""}. ` +
    `Voici mes documents (RCCM, etc.) pour accélérer la validation de mon cabinet.`;
  const waUrl = whatsappSupportUrl(message);

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Clock className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900">Compte en cours de validation</p>
          <p className="mt-1 text-sm text-amber-900/90">
            Notre équipe vérifie actuellement votre cabinet. Vous pouvez explorer la marketplace,
            mais le déblocage de prospects sera activé dès l'approbation de votre compte.
          </p>
          <p className="mt-2 text-sm text-amber-900/90">
            Pour accélérer la validation, envoyez-nous vos documents (RCCM et justificatifs
            d'activité) directement sur WhatsApp.
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-[#25D366] text-white hover:bg-[#1ebe57] border border-[#1ebe57]"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Envoyer mes documents sur WhatsApp
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
              onClick={() => setOpenDocs((v) => !v)}
            >
              <FileCheck2 className="h-4 w-4" />
              Documents demandés
              {openDocs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {openDocs && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-900/90">
              <li>
                <strong>RCCM</strong> (Registre du Commerce et du Crédit Mobilier) du cabinet
              </li>
              <li>
                <strong>DFE</strong> (Déclaration Fiscale d'Existence) ou attestation fiscale
              </li>
              <li>Pièce d'identité du gérant / dirigeant</li>
              <li>
                Si vous êtes expert-comptable : agrément ou attestation d'inscription à l'Ordre
              </li>
              <li>Tout autre justificatif d'activité (site web, portfolio clients, etc.)</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}