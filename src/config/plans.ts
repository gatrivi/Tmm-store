/**
 * Subscription plan definitions and feature gates for Trufi product tiers.
 */

export type Plan = 'menu' | 'pedidos' | 'premium';

export const PLAN_LABELS: Record<Plan, string> = {
  menu: 'Menu',
  pedidos: 'Pedidos',
  premium: 'Premium',
};

export const PLAN_PRICES_ARS: Record<Plan, number> = {
  menu: 10000,
  pedidos: 20000,
  premium: 45000,
};

export interface PlanFeatures {
  canOrder: boolean;
  canUseMercadoPago: boolean;
  canUseAI: boolean;
  canManageOrders: boolean;
  canUsePromotions: boolean;
  canUseBulkPricing: boolean;
  canUseReports: boolean;
  showFullDashboard: boolean;
  showWhatsAppContact: boolean;
}

const FEATURE_MATRIX: Record<Plan, PlanFeatures> = {
  menu: {
    canOrder: false,
    canUseMercadoPago: false,
    canUseAI: false,
    canManageOrders: false,
    canUsePromotions: false,
    canUseBulkPricing: false,
    canUseReports: false,
    showFullDashboard: false,
    showWhatsAppContact: true,
  },
  pedidos: {
    canOrder: true,
    canUseMercadoPago: true,
    canUseAI: false,
    canManageOrders: true,
    canUsePromotions: true,
    canUseBulkPricing: true,
    canUseReports: true,
    showFullDashboard: true,
    showWhatsAppContact: true,
  },
  premium: {
    canOrder: true,
    canUseMercadoPago: true,
    canUseAI: true,
    canManageOrders: true,
    canUsePromotions: true,
    canUseBulkPricing: true,
    canUseReports: true,
    showFullDashboard: true,
    showWhatsAppContact: true,
  },
};

export function parsePlan(value: string | undefined): Plan {
  const normalized = (value || 'pedidos').toLowerCase().trim();
  if (normalized === 'menu' || normalized === 'pedidos' || normalized === 'premium') {
    return normalized;
  }
  return 'pedidos';
}

export function getPlanFeatures(plan: Plan): PlanFeatures {
  return FEATURE_MATRIX[plan];
}

export function canOrder(plan: Plan): boolean {
  return FEATURE_MATRIX[plan].canOrder;
}

export function canUseMercadoPago(plan: Plan): boolean {
  return FEATURE_MATRIX[plan].canUseMercadoPago;
}

export function canUseAI(plan: Plan): boolean {
  return FEATURE_MATRIX[plan].canUseAI;
}

export function canManageOrders(plan: Plan): boolean {
  return FEATURE_MATRIX[plan].canManageOrders;
}

export function isPlanAtLeast(current: Plan, required: Plan): boolean {
  const order: Plan[] = ['menu', 'pedidos', 'premium'];
  return order.indexOf(current) >= order.indexOf(required);
}
