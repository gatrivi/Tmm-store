/* eslint-disable react-refresh/only-export-components */
/**
 * @file MenuContext.tsx
 * @description Context global reactivo para los datos del menú.
 * Convierte la constante estática `menuData` en un estado mutable
 * para que el panel de administración pueda modificar precios y textos
 * y que los cambios se reflejen inmediatamente en los componentes del menú.
 *
 * Persistencia: Los datos editados se guardan en localStorage para que
 * sobrevivan a recargas de página. Se expone una función `resetToDefaults`
 * para restaurar los datos originales de `menuData`.
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { menuData, type MenuItemType } from '../data/menu';
import { getUsdRate, getUsdRateSync } from '../utils/dollarRate';
import type { Promotion } from '../types/promotion';
import { isFirebaseConfigured } from '../lib/firebase';
import { loadTenantData, saveTenantSnapshot } from '../services/tenantService';
import { parsePlan } from '../config/plans';
import type { MenuCategory } from '../types/menuCategory';
import { getInitialMenuCategories } from '../utils/menuImport';
import type { MenuLayoutId } from '../utils/menuLayouts';
import { DEFAULT_MENU_LAYOUT, parseMenuLayout } from '../utils/menuLayouts';
import { buildProspectLogoDataUrl, parseProspectDemo } from '../utils/prospectDemo';
import { getDemoPreset } from '../data/demoPresets';
import { getDemoByTenantId, isDemoTenant, resolveTenantIdFromPath } from '../utils/demoRegistry';

/** Keys de localStorage */
const STORAGE_KEY_MENU = 'elpuestito_admin_menu';
const STORAGE_KEY_CATEGORIES = 'elpuestito_admin_categories';
const STORAGE_KEY_EXTRAS = 'elpuestito_admin_extras';
const STORAGE_KEY_LAST_EDIT = 'elpuestito_admin_last_edit';
const STORAGE_KEY_SETTINGS = 'elpuestito_admin_settings';
const STORAGE_KEY_PROMOTIONS = 'elpuestito_admin_promotions';

/**
 * Interfaz para los extras hardcodeados que aparecen en SimplifiedMenu.
 */
export interface ExtraItem {
  label: string;
  labelEn: string;
  labelPt: string;
  labelRu: string;
  labelDe: string;
  price: number;
  suffix?: string;
  suffixEn?: string;
  suffixPt?: string;
  suffixRu?: string;
  suffixDe?: string;
}

/** Datos iniciales de los extras (antes estaban hardcodeados en SimplifiedMenu.tsx) */
const initialExtras: ExtraItem[] = [
  { label: 'Jamón', labelEn: 'Ham', labelPt: 'Presunto', labelRu: 'Ветчина', labelDe: 'Schinken', price: 2000 },
  { label: 'Queso', labelEn: 'Cheese', labelPt: 'Queijo', labelRu: 'Сыр', labelDe: 'Käse', price: 2000 },
  { label: 'Huevo', labelEn: 'Fried Egg', labelPt: 'Ovo Frito', labelRu: 'Жареное яйцо', labelDe: 'Ei', price: 2000 },
  { label: 'Jamón, Queso y Huevo', labelEn: 'Ham, Cheese & Egg', labelPt: 'Presunto, Queijo e Ovo Frito', labelRu: 'Ветчина, сыр и яйцо', labelDe: 'Schinken, Käse & Ei', price: 5000, suffix: 'Completo', suffixEn: 'Full', suffixPt: 'Completo', suffixRu: 'Полный', suffixDe: 'Komplett' }
];

/** Lee datos de localStorage con fallback seguro */
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // localStorage corrupto — usar fallback
  }
  return JSON.parse(JSON.stringify(fallback));
}

export interface SiteSettings {
  showUsdToggle: boolean;
  manualRate: number;     // Tasa manual fijada por el admin (0 = no usar)
  useManualRate: boolean; // Si true, usar manualRate en vez de la API
  whatsappNumber: string;
  bankAlias: string;
  // Branding
  brandName: string;
  brandColor: string;
  brandColorDark: string;
  brandColorLight: string;
  brandAccent: string;
  brandTextColor: string;
  brandFont: string;
  brandAddress: string;
  brandInstagram: string;
  brandGoogleMaps: string;
  brandLogo?: string;
  /** Storefront menu card layout */
  menuLayout: MenuLayoutId;
  demoMode: boolean;
  mpEnabled: boolean;
  /** Play sound in admin when a new order arrives */
  orderSoundEnabled: boolean;
  /** Auto-open print dialog for new orders (thermal) */
  autoPrintOnNewOrder: boolean;
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
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
  brandLogo: undefined,
  menuLayout: DEFAULT_MENU_LAYOUT,
  demoMode: false,
  mpEnabled: true,
  orderSoundEnabled: true,
  autoPrintOnNewOrder: false,
};

const DEMO_SITE_SETTINGS: SiteSettings = {
  ...DEFAULT_SITE_SETTINGS,
  whatsappNumber: '5491100000000',
  bankAlias: 'CLUB.OLIVOS',
  brandName: 'Club Social Olivos',
  brandColor: '#171814',
  brandColorDark: '#0f100d',
  brandColorLight: '#f2eee6',
  brandAccent: '#d7ff64',
  brandTextColor: '#171814',
  brandFont: 'Georgia, serif',
  brandAddress: 'Olivos · Vicente López',
  brandLogo: '/demo-logo.svg',
  menuLayout: 'grid',
  demoMode: true,
  mpEnabled: false,
};

function getDemoSiteSettings(): SiteSettings {
  const prospect = parseProspectDemo(window.location.search);
  const preset = prospect.preset;
  return {
    ...DEMO_SITE_SETTINGS,
    brandName: prospect.businessName,
    brandAddress: `${prospect.categoryLabel} · ${prospect.area}`,
    brandColor: prospect.colorValue,
    brandLogo: prospect.customized || preset
      ? buildProspectLogoDataUrl(prospect)
      : DEMO_SITE_SETTINGS.brandLogo,
    menuLayout: preset?.menuLayout ?? DEMO_SITE_SETTINGS.menuLayout,
  };
}

function getStorageKeys(tenantId: string) {
  const suffix = tenantId === 'default' ? '' : `:${tenantId}`;
  return {
    menu: `${STORAGE_KEY_MENU}${suffix}`,
    categories: `${STORAGE_KEY_CATEGORIES}${suffix}`,
    extras: `${STORAGE_KEY_EXTRAS}${suffix}`,
    lastEdit: `${STORAGE_KEY_LAST_EDIT}${suffix}`,
    settings: `${STORAGE_KEY_SETTINGS}${suffix}`,
    promotions: `${STORAGE_KEY_PROMOTIONS}${suffix}`,
  };
}

interface MenuContextProps {
  menuItems: MenuItemType[];
  updateMenuItem: (index: number, updated: MenuItemType) => void;
  deleteMenuItem: (index: number) => void;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItemType[]>>;
  menuCategories: MenuCategory[];
  setMenuCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  extrasData: ExtraItem[];
  updateExtraItem: (index: number, updated: ExtraItem) => void;
  setExtrasData: React.Dispatch<React.SetStateAction<ExtraItem[]>>;
  /** Restaura todo a los datos originales del código fuente y limpia localStorage */
  resetToDefaults: () => void;
  /** Restaura solo los textos de un idioma específico (o todos). No toca precios ni imágenes. */
  resetTextsOnly: (targetLang?: string) => void;
  /** Timestamp ISO de la última edición guardada (o null si no hay) */
  lastEditTimestamp: string | null;
  /** Configuraciones del sitio (toggle USD, etc.) */
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  /** Cotización actual del dólar blue */
  usdRate: number;
  setUsdRate: React.Dispatch<React.SetStateAction<number>>;
  /** Promociones / cupones */
  promotions: Promotion[];
  setPromotions: React.Dispatch<React.SetStateAction<Promotion[]>>;
  /** Sync remoto activo */
  cloudSyncEnabled: boolean;
  /** loading | synced | offline | error */
  cloudSyncStatus: 'loading' | 'synced' | 'offline' | 'error';
  tenantId: string;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

function getExpressPreset() {
  if (typeof window === 'undefined') return null;
  return parseProspectDemo(window.location.search).preset ?? getDemoPreset(
    new URLSearchParams(window.location.search).get('rubro'),
  );
}

/** Demo menu for the public showcase and local development. */
function getDefaultMenuSeed(tenantId: string): MenuItemType[] {
  const vertical = getDemoByTenantId(tenantId);
  if (vertical) return JSON.parse(JSON.stringify(vertical.menuItems));
  if (tenantId === 'demo') {
    const preset = getExpressPreset();
    if (preset) return JSON.parse(JSON.stringify(preset.menuItems));
  }
  const isLocalDemo = import.meta.env.DEV
    && tenantId === 'default'
    && !import.meta.env.VITE_TENANT_ID?.trim();
  return tenantId === 'demo' || isLocalDemo
    ? JSON.parse(JSON.stringify(menuData))
    : [];
}

function getDefaultCategories(tenantId: string): MenuCategory[] {
  const vertical = getDemoByTenantId(tenantId);
  if (vertical) return JSON.parse(JSON.stringify(vertical.menuCategories));
  if (tenantId === 'demo') {
    const preset = getExpressPreset();
    if (preset) return JSON.parse(JSON.stringify(preset.menuCategories));
  }
  return getInitialMenuCategories();
}

function getDemoFallbackSettings(tenantId: string): SiteSettings {
  const vertical = getDemoByTenantId(tenantId);
  if (vertical) {
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...vertical.siteSettings,
      menuLayout: parseMenuLayout(vertical.siteSettings.menuLayout),
      demoMode: true,
      mpEnabled: false,
    };
  }
  return getDemoSiteSettings();
}

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tenantId = resolveTenantIdFromPath(window.location.pathname);
  const demoTenant = isDemoTenant(tenantId);
  const storageKeys = useMemo(() => getStorageKeys(tenantId), [tenantId]);
  const cloudSyncEnabled = isFirebaseConfigured() && !demoTenant;
  const hydratedFromCloud = useRef(false);

  const [menuItems, setMenuItems] = useState<MenuItemType[]>(() => {
    const seed = getDefaultMenuSeed(tenantId);
    return demoTenant ? seed : loadFromStorage(storageKeys.menu, seed);
  });
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>(() => {
    if (demoTenant) return getDefaultCategories(tenantId);
    const stored = loadFromStorage<MenuCategory[] | null>(storageKeys.categories, null);
    if (stored && stored.length > 0) return stored;
    return getDefaultMenuSeed(tenantId).length > 0 ? getInitialMenuCategories() : [];
  });
  const [extrasData, setExtrasData] = useState<ExtraItem[]>(() => (
    demoTenant
      ? JSON.parse(JSON.stringify(initialExtras))
      : loadFromStorage(storageKeys.extras, initialExtras)
  ));
  const [lastEditTimestamp, setLastEditTimestamp] = useState<string | null>(() => (
    demoTenant ? null : localStorage.getItem(storageKeys.lastEdit)
  ));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const fallback = demoTenant ? getDemoFallbackSettings(tenantId) : DEFAULT_SITE_SETTINGS;
    const saved = demoTenant
      ? {}
      : loadFromStorage<Partial<SiteSettings>>(storageKeys.settings, {});
    return {
      ...fallback,
      ...saved,
      menuLayout: parseMenuLayout(saved.menuLayout ?? fallback.menuLayout),
    };
  });
  const [usdRate, setUsdRate] = useState<number>(() => getUsdRateSync());
  const [promotions, setPromotions] = useState<Promotion[]>(() => (
    demoTenant ? [] : loadFromStorage<Promotion[]>(storageKeys.promotions, [])
  ));
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'loading' | 'synced' | 'offline' | 'error'>(() =>
    cloudSyncEnabled ? 'loading' : 'offline',
  );

  // Cargar cotización actual al montar (async)
  useEffect(() => {
    getUsdRate().then(rate => setUsdRate(rate));
  }, []);

  // Hidratar desde Firestore si está configurado
  useEffect(() => {
    if (!cloudSyncEnabled) {
      setCloudSyncStatus('offline');
      return;
    }
    if (hydratedFromCloud.current) return;

    loadTenantData(tenantId)
      .then(async data => {
        if (data?.menuItems?.length) {
          setMenuItems(data.menuItems);
        }
        if (data?.menuCategories?.length) {
          setMenuCategories(data.menuCategories);
        }
        if (data?.extras?.length) setExtrasData(data.extras);
        if (data?.settings) {
          setSiteSettings(prev => ({
            ...prev,
            ...data.settings,
            menuLayout: parseMenuLayout(data.settings!.menuLayout ?? prev.menuLayout),
            orderSoundEnabled: data.settings!.orderSoundEnabled ?? true,
            autoPrintOnNewOrder: data.settings!.autoPrintOnNewOrder ?? false,
          }));
        }
        if (data?.promotions) setPromotions(data.promotions);

        if (!data?.menuItems?.length) {
          await saveTenantSnapshot(tenantId, {
            settings: siteSettings,
            menuItems,
            menuCategories,
            extras: extrasData,
            promotions,
            plan: parsePlan(import.meta.env.VITE_PLAN as string | undefined),
          });
        }
        setCloudSyncStatus('synced');
      })
      .catch(err => {
        console.error('Cloud sync hydrate failed:', err);
        setCloudSyncStatus('error');
      })
      .finally(() => {
        hydratedFromCloud.current = true;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- initial seed only once on mount
  }, [cloudSyncEnabled, tenantId]);

  // Persistir snapshot en Firestore (debounced)
  useEffect(() => {
    if (!cloudSyncEnabled || !hydratedFromCloud.current) return;
    const timer = window.setTimeout(() => {
      saveTenantSnapshot(tenantId, {
        settings: siteSettings,
        menuItems,
        menuCategories,
        extras: extrasData,
        promotions,
        plan: parsePlan(import.meta.env.VITE_PLAN as string | undefined),
      }).catch(console.error);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [cloudSyncEnabled, tenantId, siteSettings, menuItems, menuCategories, extrasData, promotions]);

  // Persistir menuItems en localStorage cada vez que cambie
  useEffect(() => {
    if (demoTenant) return;
    localStorage.setItem(storageKeys.menu, JSON.stringify(menuItems));
  }, [demoTenant, menuItems, storageKeys.menu]);

  useEffect(() => {
    if (demoTenant) return;
    localStorage.setItem(storageKeys.categories, JSON.stringify(menuCategories));
  }, [demoTenant, menuCategories, storageKeys.categories]);

  // Persistir extrasData en localStorage cada vez que cambie
  useEffect(() => {
    if (demoTenant) return;
    localStorage.setItem(storageKeys.extras, JSON.stringify(extrasData));
  }, [extrasData, demoTenant, storageKeys.extras]);

  // Persistir siteSettings
  useEffect(() => {
    if (demoTenant) return;
    localStorage.setItem(storageKeys.settings, JSON.stringify(siteSettings));
  }, [demoTenant, siteSettings, storageKeys.settings]);

  useEffect(() => {
    if (demoTenant) return;
    localStorage.setItem(storageKeys.promotions, JSON.stringify(promotions));
  }, [demoTenant, promotions, storageKeys.promotions]);

  const updateMenuItem = useCallback((index: number, updated: MenuItemType) => {
    setMenuItems(prev => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    const ts = new Date().toISOString();
    localStorage.setItem(storageKeys.lastEdit, ts);
    setLastEditTimestamp(ts);
  }, [storageKeys.lastEdit]);

  const deleteMenuItem = useCallback((index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
    const ts = new Date().toISOString();
    localStorage.setItem(storageKeys.lastEdit, ts);
    setLastEditTimestamp(ts);
  }, [storageKeys.lastEdit]);

  const updateExtraItem = useCallback((index: number, updated: ExtraItem) => {
    setExtrasData(prev => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    const ts = new Date().toISOString();
    localStorage.setItem(storageKeys.lastEdit, ts);
    setLastEditTimestamp(ts);
  }, [storageKeys.lastEdit]);

  const resetToDefaults = useCallback(() => {
    const freshMenu = JSON.parse(JSON.stringify(menuData));
    const freshExtras = JSON.parse(JSON.stringify(initialExtras));
    setMenuItems(freshMenu);
    setMenuCategories(getInitialMenuCategories());
    setExtrasData(freshExtras);
    localStorage.removeItem(storageKeys.menu);
    localStorage.removeItem(storageKeys.categories);
    localStorage.removeItem(storageKeys.extras);
    localStorage.removeItem(storageKeys.lastEdit);
    setLastEditTimestamp(null);
  }, [storageKeys]);

  const resetTextsOnly = useCallback((targetLang?: string) => {
    setMenuItems(prev => prev.map((item, i) => {
      const original = menuData[i];
      if (!original) return item;

      const updated = { ...item };

      // Restaurar textos por idioma
      if (!targetLang || targetLang === 'es') {
        updated.name = original.name;
        updated.description = original.description;
      }
      if (!targetLang || targetLang === 'en') {
        updated.nameEn = original.nameEn;
        updated.descriptionEn = original.descriptionEn;
      }
      if (!targetLang || targetLang === 'pt') {
        updated.namePt = original.namePt;
        updated.descriptionPt = original.descriptionPt;
      }
      if (!targetLang || targetLang === 'ru') {
        updated.nameRu = original.nameRu;
        updated.descriptionRu = original.descriptionRu;
      }
      if (!targetLang || targetLang === 'de') {
        updated.nameDe = original.nameDe;
        updated.descriptionDe = original.descriptionDe;
      }

      // Restaurar labels y suffixes de opciones
      updated.options = item.options.map((opt, j) => {
        const origOpt = original.options[j];
        if (!origOpt) return opt;
        return {
          ...opt, // Mantener price
          label: !targetLang || targetLang === 'es' ? origOpt.label : opt.label,
          labelEn: !targetLang || targetLang === 'en' ? origOpt.labelEn : opt.labelEn,
          labelPt: !targetLang || targetLang === 'pt' ? origOpt.labelPt : opt.labelPt,
          labelRu: !targetLang || targetLang === 'ru' ? origOpt.labelRu : opt.labelRu,
          labelDe: !targetLang || targetLang === 'de' ? origOpt.labelDe : opt.labelDe,
          suffix: !targetLang || targetLang === 'es' ? origOpt.suffix : opt.suffix,
          suffixEn: !targetLang || targetLang === 'en' ? origOpt.suffixEn : opt.suffixEn,
          suffixPt: !targetLang || targetLang === 'pt' ? origOpt.suffixPt : opt.suffixPt,
          suffixRu: !targetLang || targetLang === 'ru' ? origOpt.suffixRu : opt.suffixRu,
          suffixDe: !targetLang || targetLang === 'de' ? origOpt.suffixDe : opt.suffixDe,
          features: !targetLang || targetLang === 'es' ? origOpt.features : opt.features,
          featuresEn: !targetLang || targetLang === 'en' ? origOpt.featuresEn : opt.featuresEn,
          featuresPt: !targetLang || targetLang === 'pt' ? origOpt.featuresPt : opt.featuresPt,
          featuresRu: !targetLang || targetLang === 'ru' ? origOpt.featuresRu : opt.featuresRu,
          featuresDe: !targetLang || targetLang === 'de' ? origOpt.featuresDe : opt.featuresDe,
        };
      });

      return updated;
    }));

    const ts = new Date().toISOString();
    localStorage.setItem(storageKeys.lastEdit, ts);
    setLastEditTimestamp(ts);
  }, [storageKeys.lastEdit]);

  // Tasa efectiva: manual (si activada y > 0) o de la API
  const effectiveRate = siteSettings.useManualRate && siteSettings.manualRate > 0
    ? siteSettings.manualRate
    : usdRate;

  return (
    <MenuContext.Provider value={{ menuItems, updateMenuItem, deleteMenuItem, setMenuItems, menuCategories, setMenuCategories, extrasData, updateExtraItem, setExtrasData, resetToDefaults, resetTextsOnly, lastEditTimestamp, siteSettings, setSiteSettings, usdRate: effectiveRate, setUsdRate, promotions, setPromotions, cloudSyncEnabled, cloudSyncStatus, tenantId }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
