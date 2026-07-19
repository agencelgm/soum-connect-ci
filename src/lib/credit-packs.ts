// Source unique des packs de crédits Chariow.
// Utilisé à la fois par la page /recharger et par le webhook serveur.

export type CreditPack = {
  credits: number;
  price: string;
  popular: boolean;
  productId: string;
  unlimited?: boolean;
  unlimitedDays?: number;
  label?: string;
};

export const CREDIT_PACKS: CreditPack[] = [
  { credits: 50, price: "10 000 FCFA", popular: false, productId: "prd_kui1kil8", label: "Starter" },
  { credits: 125, price: "25 000 FCFA", popular: true, productId: "prd_ak61x0fl", label: "Pro" },
  { credits: 0, price: "50 000 FCFA", popular: false, productId: "prd_mm3xnkwg", unlimited: true, unlimitedDays: 30, label: "Illimité 30 jours" },
];

export function getPackByProductId(productId: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.productId === productId);
}

/**
 * Calcule la nouvelle date d'expiration `unlimited_until` en empilant `days`
 * jours au-dessus de la date existante si elle est encore active, sinon
 * en repartant de `now`.
 *
 * Règle métier : un rachat AVANT expiration ajoute 30 jours à l'expiration
 * actuelle (empilement). Un rachat APRÈS expiration repart de maintenant.
 *
 * Exportée pour être testable indépendamment du webhook.
 */
export function stackUnlimitedUntil(
  currentUnlimitedUntil: Date | string | null,
  days: number,
  now: Date = new Date(),
): { newUntil: Date; stacked: boolean; baseUsed: Date } {
  const current =
    currentUnlimitedUntil instanceof Date
      ? currentUnlimitedUntil
      : currentUnlimitedUntil
        ? new Date(currentUnlimitedUntil)
        : null;
  const stacked = current !== null && current > now;
  const base = stacked ? (current as Date) : now;
  const newUntil = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
  return { newUntil, stacked, baseUsed: base };
}