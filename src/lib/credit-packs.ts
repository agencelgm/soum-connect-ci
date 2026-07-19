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