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
  { credits: 10, price: "10 000 FCFA", popular: false, productId: "prd_kui1kil8", label: "Starter" },
  { credits: 25, price: "25 000 FCFA", popular: true, productId: "prd_ak61x0fl", label: "Pro" },
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

/**
 * Statut d'expiration de l'accès illimité.
 * - ok : > 7 jours restants
 * - warning : ≤ 7 jours (J-7)
 * - critical : ≤ 1 jour (J-1 ou dernières heures)
 * - expired : date passée depuis ≤ 3 jours (invite renouvellement)
 * - none : jamais activé ou expiré depuis > 3 jours
 */
export type UnlimitedLevel = "ok" | "warning" | "critical" | "expired" | "none";

export function getUnlimitedStatus(
  unlimitedUntil: Date | string | null | undefined,
  now: Date = new Date(),
): {
  active: boolean;
  level: UnlimitedLevel;
  daysLeft: number;
  hoursLeft: number;
  expiresAt: Date | null;
} {
  if (!unlimitedUntil) {
    return { active: false, level: "none", daysLeft: 0, hoursLeft: 0, expiresAt: null };
  }
  const expiresAt = unlimitedUntil instanceof Date ? unlimitedUntil : new Date(unlimitedUntil);
  const msLeft = expiresAt.getTime() - now.getTime();
  const hoursLeft = Math.ceil(msLeft / (60 * 60 * 1000));
  const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
  if (msLeft <= 0) {
    const daysSinceExpiry = Math.floor(-msLeft / (24 * 60 * 60 * 1000));
    return {
      active: false,
      level: daysSinceExpiry <= 3 ? "expired" : "none",
      daysLeft: 0,
      hoursLeft: 0,
      expiresAt,
    };
  }
  let level: UnlimitedLevel = "ok";
  if (daysLeft <= 1) level = "critical";
  else if (daysLeft <= 7) level = "warning";
  return { active: true, level, daysLeft, hoursLeft, expiresAt };
}