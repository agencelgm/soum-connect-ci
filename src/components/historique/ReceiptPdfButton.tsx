import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getChariowReceipt } from "@/lib/history.functions";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ReceiptPdfButton({ paymentId, licenseCode }: { paymentId: string; licenseCode: string }) {
  const [loading, setLoading] = useState(false);
  const fetchReceipt = useServerFn(getChariowReceipt);

  async function download() {
    setLoading(true);
    try {
      const { payment, partner } = await fetchReceipt({ data: { paymentId } });
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 60;

      // En-tête
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("Reçu d'achat de crédits", 40, y);
      y += 12;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120);
      doc.text("SoumissionComptable.com — Les Gens du Marketing (LGM)", 40, y + 12);
      y += 40;

      // Bloc référence
      doc.setDrawColor(220);
      doc.line(40, y, pageWidth - 40, y);
      y += 20;
      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(`N° de transaction : ${payment.license_code}`, 40, y);
      doc.text(`Date : ${formatDate(payment.date)}`, pageWidth - 40, y, { align: "right" });
      y += 30;

      // Client
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Client", 40, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      if (partner) {
        doc.text(partner.cabinet_name ?? "—", 40, y);
        y += 14;
        const contact = [partner.contact_first_name, partner.contact_last_name].filter(Boolean).join(" ");
        if (contact) {
          doc.text(contact, 40, y);
          y += 14;
        }
        if (partner.email) {
          doc.text(partner.email, 40, y);
          y += 14;
        }
        if (partner.city) {
          doc.text(partner.city, 40, y);
          y += 14;
        }
      } else {
        doc.text(payment.email, 40, y);
        y += 14;
      }
      y += 20;

      // Détails
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Détail de l'achat", 40, y);
      y += 16;
      doc.setDrawColor(220);
      doc.line(40, y, pageWidth - 40, y);
      y += 18;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Description", 40, y);
      doc.text("Quantité", pageWidth - 200, y, { align: "left" });
      doc.text("Pack", pageWidth - 40, y, { align: "right" });
      y += 12;
      doc.line(40, y, pageWidth - 40, y);
      y += 18;

      doc.setFont("helvetica", "normal");
      doc.text("Crédits LGM (déblocage de leads)", 40, y);
      doc.text(String(payment.credits_granted), pageWidth - 200, y, { align: "left" });
      doc.text(payment.amount_label ?? "—", pageWidth - 40, y, { align: "right" });
      y += 30;

      doc.line(40, y, pageWidth - 40, y);
      y += 24;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`Crédits ajoutés : ${payment.credits_granted}`, pageWidth - 40, y, { align: "right" });

      // Pied
      y = doc.internal.pageSize.getHeight() - 80;
      doc.setDrawColor(220);
      doc.line(40, y, pageWidth - 40, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Paiement traité par Chariow — aucune donnée bancaire stockée sur nos serveurs.", 40, y);
      y += 12;
      doc.text(
        "SoumissionComptable.com est une plateforme de Les Gens du Marketing (LGM), Abidjan, Côte d'Ivoire.",
        40,
        y,
      );

      doc.save(`recu-lgm-${licenseCode}.pdf`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors du téléchargement du reçu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={download} variant="outline" size="sm" disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      <span className="ml-2">Reçu PDF</span>
    </Button>
  );
}