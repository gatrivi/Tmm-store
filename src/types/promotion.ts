export type PromoDiscountType = 'percent' | 'fixed';

export interface Promotion {
  id: string;
  code: string;
  label: string;
  discountType: PromoDiscountType;
  discountValue: number;
  minOrderTotal: number;
  active: boolean;
  expiresAt?: string;
}

export function calculateDiscount(
  promo: Promotion,
  subtotal: number,
): number {
  if (!promo.active || subtotal < promo.minOrderTotal) return 0;
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) return 0;

  if (promo.discountType === 'percent') {
    return Math.round(subtotal * (promo.discountValue / 100));
  }
  return Math.min(promo.discountValue, subtotal);
}
