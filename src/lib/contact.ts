// Numéro WhatsApp officiel du support LGM (Soumission Comptable)
export const WHATSAPP_SUPPORT_NUMBER = "2250798172339";

export function whatsappSupportUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappReactivationUrl(cabinetName?: string | null): string {
  const msg =
    `Bonjour LGM, je souhaite réactiver mon compte partenaire` +
    (cabinetName ? ` (${cabinetName})` : "") +
    `. Merci.`;
  return whatsappSupportUrl(msg);
}