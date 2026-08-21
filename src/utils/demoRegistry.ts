import { AGUACATS_DEMO } from '../data/demos/aguacats';
import { CANAVESI_DEMO } from '../data/demos/canavesi';
import { FERRETERIA_DEMO } from '../data/demos/ferreteria';
import { MAMABEL_DEMO } from '../data/demos/mamabel';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { PIZZERIA_DEMO } from '../data/demos/pizzeria';
import { VERDULERIA_DEMO } from '../data/demos/verduleria';
import { ZIMBA_PET_DEMO } from '../data/demos/zimbaPet';
import type { DemoDefinition } from '../data/demos/types';
import { getDemoShortPath } from '../config/demoShortLinks';

const GASTRONOMY_DEMO: Pick<DemoDefinition, 'id' | 'tenantId' | 'customerPath' | 'ownerPath' | 'orderPath'> = {
  id: 'demo',
  tenantId: 'demo',
  customerPath: '/demo',
  ownerPath: '/demo/owner',
  orderPath: (orderId: string) => `/order/${orderId}`,
};

const DEMOS: DemoDefinition[] = [
  CANAVESI_DEMO,
  VERDULERIA_DEMO,
  PIZZERIA_DEMO,
  PANADERIA_DEMO,
  FERRETERIA_DEMO,
  MAMABEL_DEMO,
  AGUACATS_DEMO,
  ZIMBA_PET_DEMO,
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

export function isDemoTenant(tenantId: string): boolean {
  return tenantId === 'demo' || DEMOS.some(d => d.tenantId === tenantId);
}

function matchesDemoPath(demo: DemoDefinition, pathname: string): boolean {
  const shortPath = getDemoShortPath(demo.id);
  const bases = [demo.customerPath, shortPath].filter(Boolean) as string[];
  return bases.some(base => pathname === base || pathname.startsWith(`${base}/`));
}

export function resolveTenantIdFromPath(pathname: string): string {
  const demo = resolveDemoFromPath(pathname);
  if (demo) return demo.tenantId;
  if (pathname === '/demo' || pathname.startsWith('/demo/')) return 'demo';

  const fromEnv = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TENANT_ID) as string | undefined;
  if (fromEnv?.trim()) return fromEnv.trim();

  const slugMatch = pathname.match(/^\/s\/([^/]+)/);
  if (slugMatch?.[1]) return slugMatch[1];
  return 'default';
}

export function resolveDemoFromPath(pathname: string): DemoDefinition | null {
  const sorted = [...DEMOS].sort((a, b) => {
    const aLen = Math.max(a.customerPath.length, getDemoShortPath(a.id)?.length ?? 0);
    const bLen = Math.max(b.customerPath.length, getDemoShortPath(b.id)?.length ?? 0);
    return bLen - aLen;
  });
  return sorted.find(demo => matchesDemoPath(demo, pathname)) ?? null;
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
    const shortPath = getDemoShortPath(demo.id);
    const isShort = Boolean(shortPath && (pathname === shortPath || pathname.startsWith(`${shortPath}/`)));
    return {
      customerPath: isShort && shortPath ? shortPath : demo.customerPath,
      ownerPath: isShort && shortPath ? `${shortPath}/owner` : demo.ownerPath,
      orderPath: isShort && shortPath ? (orderId: string) => `${shortPath}/order/${orderId}` : demo.orderPath,
    };
  }
  return {
    customerPath: GASTRONOMY_DEMO.customerPath,
    ownerPath: GASTRONOMY_DEMO.ownerPath,
    orderPath: GASTRONOMY_DEMO.orderPath,
  };
}
