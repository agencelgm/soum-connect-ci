// Source unique des packs de crédits Chariow.
// Utilisé à la fois par la page /recharger et par le webhook serveur.

export type CreditPack = {
  credits: number;
  price: string;
  popular: boolean;
  productId: string;
};

export const CREDIT_PACKS: CreditPack[] = [
  { credits: 10, price: "10 000 FCFA", popular: false, productId: "prd_kui1kil8" },
  { credits: 25, price: "25 000 FCFA", popular: true, productId: "prd_ak61x0fl" },
  { credits: 60, price: "60 000 FCFA", popular: false, productId: "prd_mm3xnkwg" },
];

export function getPackByProductId(productId: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.productId === productId);
}