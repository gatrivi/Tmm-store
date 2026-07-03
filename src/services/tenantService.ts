import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import type { Plan } from '../config/plans';
import type { ExtraItem, SiteSettings } from '../context/MenuContext';
import type { MenuItemType } from '../data/menu';
import type { CreateTenantInput, TenantRecord } from '../types/tenant';
import type { MenuCategory } from '../types/menuCategory';
import { DEFAULT_MENU_LAYOUT } from '../utils/menuLayouts';
import { getFirestoreDb, isFirebaseConfigured } from '../lib/firebase';

const defaultSettings: SiteSettings = {
  showUsdToggle: false,
  manualRate: 0,
  useManualRate: false,
  whatsappNumber: '',
  bankAlias: '',
  brandName: '',
  brandColor: '#cc333f',
  brandColorDark: '#6a4a3c',
  brandColorLight: '#fdf6e3',
  brandAccent: '#edc951',
  brandTextColor: '#3d2b1f',
  brandFont: 'system-ui',
  brandAddress: '',
  brandInstagram: '',
  brandGoogleMaps: '',
  menuLayout: DEFAULT_MENU_LAYOUT,
  demoMode: false,
  mpEnabled: true,
  orderSoundEnabled: true,
  autoPrintOnNewOrder: false,
};

export async function loadTenantData(tenantId: string): Promise<Partial<TenantRecord> | null> {
  const db = getFirestoreDb();
  if (!db) return null;

  const snap = await getDoc(doc(db, 'tenants', tenantId));
  if (!snap.exists()) return null;
  return snap.data() as TenantRecord;
}

export async function saveTenantSnapshot(
  tenantId: string,
  data: {
    settings: SiteSettings;
    menuItems: MenuItemType[];
    menuCategories?: MenuCategory[];
    extras: ExtraItem[];
    promotions?: TenantRecord['promotions'];
    plan?: Plan;
  },
): Promise<void> {
  const db = getFirestoreDb();
  if (!db) return;

  const ref = doc(db, 'tenants', tenantId);
  const existing = await getDoc(ref);
  const now = new Date().toISOString();

  await setDoc(ref, {
    id: tenantId,
    slug: tenantId,
    updatedAt: now,
    createdAt: existing.exists() ? (existing.data().createdAt as string) : now,
    businessName: data.settings.brandName || tenantId,
    plan: data.plan ?? existing.data()?.plan ?? 'pedidos',
    settings: data.settings,
    menuItems: data.menuItems,
    menuCategories: data.menuCategories ?? existing.data()?.menuCategories ?? [],
    extras: data.extras,
    promotions: data.promotions ?? existing.data()?.promotions ?? [],
  }, { merge: true });
}

export async function listTenants(): Promise<TenantRecord[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await getDocs(collection(db, 'tenants'));
  return snap.docs.map(d => d.data() as TenantRecord);
}

export async function createTenant(input: CreateTenantInput): Promise<TenantRecord> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firebase no configurado');

  const now = new Date().toISOString();
  const tenant: TenantRecord = {
    id: input.slug,
    slug: input.slug,
    plan: input.plan,
    businessName: input.businessName,
    createdAt: now,
    updatedAt: now,
    settings: { ...defaultSettings, brandName: input.businessName },
    menuCategories: [],
    menuItems: [],
    extras: [],
    promotions: [],
  };

  await setDoc(doc(db, 'tenants', input.slug), tenant);
  return tenant;
}

export async function updateTenantPlan(tenantId: string, plan: Plan): Promise<void> {
  const db = getFirestoreDb();
  if (!db) throw new Error('Firebase no configurado');
  await updateDoc(doc(db, 'tenants', tenantId), {
    plan,
    updatedAt: new Date().toISOString(),
  });
}

export { isFirebaseConfigured };

export async function verifyCloudSync(tenantId: string): Promise<{ ok: boolean; message: string }> {
  const db = getFirestoreDb();
  if (!db) {
    return { ok: false, message: 'Firebase no configurado — revisá VITE_FIREBASE_* en .env' };
  }

  const ref = doc(db, 'tenants', tenantId);
  const ping = new Date().toISOString();

  try {
    await setDoc(ref, { syncPing: ping, syncPingBy: 'admin-verify' }, { merge: true });
    const snap = await getDoc(ref);
    const stored = snap.data()?.syncPing as string | undefined;
    if (stored === ping) {
      return { ok: true, message: `Sync OK · tenant "${tenantId}" · ${ping}` };
    }
    return { ok: false, message: 'Escritura OK pero lectura no coincide — revisá reglas Firestore' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return { ok: false, message: msg };
  }
}
