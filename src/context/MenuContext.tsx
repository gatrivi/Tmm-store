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
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { type MenuItemType } from '../data/menu';
import { magdalenaData } from '../data/magdalena';
import { getUsdRate, getUsdRateSync } from '../utils/dollarRate';
import { supabase } from '../utils/supabaseClient';

/** Store Identification for isolation (Branch Magdalena) */
const STORE_ID = 'magdalena';

/** Keys de localStorage */
const STORAGE_KEY_MENU = `${STORE_ID}_admin_menu`;
const STORAGE_KEY_EXTRAS = `${STORE_ID}_admin_extras`;
const STORAGE_KEY_LAST_EDIT = `${STORE_ID}_admin_last_edit`;
const STORAGE_KEY_SETTINGS = `${STORE_ID}_admin_settings`;

/** Supabase Table name */
const SUPABASE_TABLE = 'store_data';

/** Helper to prefix keys for Supabase */
const getGlobalKey = (key: string) => `${STORE_ID}_${key}`;

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
  demoMode: boolean;
  mpEnabled: boolean;
}

interface MenuContextProps {
  menuItems: MenuItemType[];
  addMenuItem: (item: MenuItemType) => void;
  updateMenuItem: (index: number, updated: MenuItemType) => void;
  deleteMenuItem: (index: number) => void;
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItemType[]>>;
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
  /** Persiste los cambios actuales a Supabase */
  saveToGlobal: () => Promise<void>;
  /** Indica si está cargando desde Supabase */
  isLoading: boolean;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(() =>
    loadFromStorage(STORAGE_KEY_MENU, magdalenaData)
  );
  const [extrasData, setExtrasData] = useState<ExtraItem[]>(() =>
    loadFromStorage(STORAGE_KEY_EXTRAS, initialExtras)
  );
  const [lastEditTimestamp, setLastEditTimestamp] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_LAST_EDIT)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const fallback: SiteSettings = {
      showUsdToggle: false,
      manualRate: 0,
      useManualRate: false,
      whatsappNumber: '1165631860',
      bankAlias: 'LA.MAGDALENA.MP',
      brandName: 'La Magdalena',
      brandColor: '#8b4513', // SaddleBrown (Artesanal)
      brandColorDark: '#5d2e0a',
      brandColorLight: '#fff9f0',
      brandAccent: '#d2691e', // Chocolate
      brandTextColor: '#3d2b1f',
      brandFont: 'Georgia, serif',
      brandAddress: 'Tu Barrio',
      brandInstagram: '',
      brandGoogleMaps: '',
      brandLogo: undefined,
      demoMode: false,
      mpEnabled: true,
    };
    const saved = loadFromStorage<Partial<SiteSettings>>(STORAGE_KEY_SETTINGS, {});
    return { ...fallback, ...saved };
  });
  const [usdRate, setUsdRate] = useState<number>(() => getUsdRateSync());
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de Supabase al montar
  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const { data, error } = await supabase
          .from(SUPABASE_TABLE)
          .select('key, value')
          .in('key', [getGlobalKey('menu_items'), getGlobalKey('extras_data'), getGlobalKey('site_settings')]);

        if (error) throw error;

        if (data && data.length > 0) {
          const globalMenu = data.find(d => d.key === getGlobalKey('menu_items'))?.value;
          const globalExtras = data.find(d => d.key === getGlobalKey('extras_data'))?.value;
          const globalSettings = data.find(d => d.key === getGlobalKey('site_settings'))?.value;

          if (globalMenu) setMenuItems(globalMenu);
          if (globalExtras) setExtrasData(globalExtras);
          if (globalSettings) setSiteSettings(prev => ({ ...prev, ...globalSettings }));
        }
      } catch (err) {
        console.error('Error fetching from Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  // Cargar cotización actual al montar (async)
  useEffect(() => {
    getUsdRate().then(rate => setUsdRate(rate));
  }, []);

  // Persistir menuItems en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  // Persistir extrasData en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXTRAS, JSON.stringify(extrasData));
  }, [extrasData]);

  // Persistir siteSettings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(siteSettings));
  }, [siteSettings]);

  const saveToGlobal = async () => {
    try {
      const updates = [
        { key: getGlobalKey('menu_items'), value: menuItems },
        { key: getGlobalKey('extras_data'), value: extrasData },
        { key: getGlobalKey('site_settings'), value: siteSettings }
      ];

      const { error } = await supabase
        .from(SUPABASE_TABLE)
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving to Supabase:', err);
      throw err;
    }
  };

  const addMenuItem = useCallback((newItem: MenuItemType) => {
    setMenuItems(prev => [...prev, newItem]);
    const ts = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  const updateMenuItem = useCallback((index: number, updated: MenuItemType) => {
    setMenuItems(prev => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    const ts = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  const deleteMenuItem = useCallback((index: number) => {
    setMenuItems(prev => prev.filter((_, i) => i !== index));
    const ts = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  const updateExtraItem = useCallback((index: number, updated: ExtraItem) => {
    setExtrasData(prev => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
    const ts = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  const resetToDefaults = useCallback(() => {
    const freshMenu = JSON.parse(JSON.stringify(magdalenaData));
    const freshExtras = JSON.parse(JSON.stringify(initialExtras));
    setMenuItems(freshMenu);
    setExtrasData(freshExtras);
    localStorage.removeItem(STORAGE_KEY_MENU);
    localStorage.removeItem(STORAGE_KEY_EXTRAS);
    localStorage.removeItem(STORAGE_KEY_LAST_EDIT);
    setLastEditTimestamp(null);
  }, []);

  const resetTextsOnly = useCallback((targetLang?: string) => {
    setMenuItems(prev => prev.map((item, i) => {
      const original = magdalenaData[i];
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
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  // Tasa efectiva: manual (si activada y > 0) o de la API
  const effectiveRate = siteSettings.useManualRate && siteSettings.manualRate > 0
    ? siteSettings.manualRate
    : usdRate;

  return (
    <MenuContext.Provider value={{ menuItems, addMenuItem, updateMenuItem, deleteMenuItem, setMenuItems, extrasData, updateExtraItem, setExtrasData, resetToDefaults, resetTextsOnly, lastEditTimestamp, siteSettings, setSiteSettings, usdRate: effectiveRate, setUsdRate, saveToGlobal, isLoading }}>
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
