import { AGUACATS_DEMO } from '../data/demos/aguacats';
import { CANAVESI_DEMO } from '../data/demos/canavesi';
import { CARNICERIA_DEMO } from '../data/demos/carniceria';
import { FERRETERIA_DEMO } from '../data/demos/ferreteria';
import { MAMABEL_DEMO } from '../data/demos/mamabel';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { PIZZERIA_DEMO } from '../data/demos/pizzeria';
import { VERDULERIA_DEMO } from '../data/demos/verduleria';
import { VINTAGEDEALERS_DEMO } from '../data/demos/vintagedealers';
import { ZIMBA_PET_DEMO } from '../data/demos/zimbaPet';
import type { DemoDefinition } from '../data/demos/types';

/** Gastronomy showcase — kept for path parity with legacy `/demo`. */
const GASTRONOMY_DEMO: Pick<DemoDefinition, 'id' | 'tenantId' | 'customerPath' | 'ownerPath' | 'orderPath'> = {
  id: 'demo',
  tenantId: 'demo',
  customerPath: '/demo',
  ownerPath: '/demo/owner',
  orderPath: (orderId: string) => `/order/${orderId}`,
};

const DEMOS: DemoDefinition[] = [
  CANAVESI_DEMO,
  CARNICERIA_DEMO,
  VERDULERIA_DEMO,
  PIZZERIA_DEMO,
  PANADERIA_DEMO,
  FERRETERIA_DEMO,
  MAMABEL_DEMO,
  AGUACATS_DEMO,
  ZIMBA_PET_DEMO,
  VINTAGEDEALERS_DEMO,
];

export function listVerticalDemos(): DemoDefinition[] {
  return DEMOS;
}

export function getDemoById(id: string): DemoDefinition | null {
  return DEMOS.find(d => d.id === id) ?? null;
}

export function getDemoByTenantId(tenantId: string): DemoDefinition | null {
  return DEMOS.find(d => d.tenantId === tenantId) ?? null;
}

/** True for any sessionStorage demo vertical (incl. gastronomy). */
export function isDemoTenant(tenantId: string): boolean {
  return tenantId === 'demo' || DEMOS.some(d => d.tenantId === tenantId);
}

/**
 * Central path → tenant. All `/demo…` entrypoints must use this.
 * Longer prefixes win (`/demo/carniceria` before `/demo`).
 */
export function resolveTenantIdFromPath(pathname: string): string {
  const demo = resolveDemoFromPath(pathname);
  if (demo) return demo.tenantId;
  if (pathname === '/demo' || pathname.startsWith('/demo/')) {
    // /demo/owner, /demo/armar, bare /demo — verticals already handled above
    return 'demo';
  }

  const fromEnv = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TENANT_ID) as string | undefined;
  if (fromEnv?.trim()) return fromEnv.trim();

  const slugMatch = pathname.match(/^\/s\/([^/]+)/);
  if (slugMatch?.[1]) return slugMatch[1];
  return 'default';
}

export function resolveDemoFromPath(pathname: string): DemoDefinition | null {
  const sorted = [...DEMOS].sort((a, b) => b.customerPath.length - a.customerPath.length);
  for (const demo of sorted) {
    if (
      pathname === demo.customerPath
      || pathname === demo.ownerPath
      || pathname.startsWith(`${demo.customerPath}/`)
    ) {
      return demo;
    }
  }
  return null;
}

export function resolveDemoStorageKey(demoId: string): string {
  if (demoId === 'demo' || demoId === GASTRONOMY_DEMO.id) return 'trufi_demo_orders_v2';
  return `trufi_demo_orders_v2:${demoId}`;
}

export function resolveDemoIdFromPath(pathname: string): string {
  return resolveDemoFromPath(pathname)?.id ?? 'demo';
}

export function resolveDemoPaths(pathname: string): {
  customerPath: string;
  ownerPath: string;
  orderPath: (orderId: string) => string;
} {
  const demo = resolveDemoFromPath(pathname);
  if (demo) {
    return {
      customerPath: demo.customerPath,
      ownerPath: demo.ownerPath,
      orderPath: demo.orderPath,
    };
  }
  return {
    customerPath: GASTRONOMY_DEMO.customerPath,
    ownerPath: GASTRONOMY_DEMO.ownerPath,
    orderPath: GASTRONOMY_DEMO.orderPath,
  };
}
