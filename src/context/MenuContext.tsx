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
import { menuData, type MenuItemType } from '../data/menu';
import { getUsdRate, getUsdRateSync } from '../utils/dollarRate';

/** Keys de localStorage */
const STORAGE_KEY_MENU = 'elpuestito_admin_menu';
const STORAGE_KEY_EXTRAS = 'elpuestito_admin_extras';
const STORAGE_KEY_LAST_EDIT = 'elpuestito_admin_last_edit';
const STORAGE_KEY_SETTINGS = 'elpuestito_admin_settings';

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
}

interface MenuContextProps {
  menuItems: MenuItemType[];
  updateMenuItem: (index: number, updated: MenuItemType) => void;
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
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>(() =>
    loadFromStorage(STORAGE_KEY_MENU, menuData)
  );
  const [extrasData, setExtrasData] = useState<ExtraItem[]>(() =>
    loadFromStorage(STORAGE_KEY_EXTRAS, initialExtras)
  );
  const [lastEditTimestamp, setLastEditTimestamp] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY_LAST_EDIT)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadFromStorage(STORAGE_KEY_SETTINGS, {
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
    })
  );
  const [usdRate, setUsdRate] = useState<number>(() => getUsdRateSync());

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
    const freshMenu = JSON.parse(JSON.stringify(menuData));
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
    localStorage.setItem(STORAGE_KEY_LAST_EDIT, ts);
    setLastEditTimestamp(ts);
  }, []);

  // Tasa efectiva: manual (si activada y > 0) o de la API
  const effectiveRate = siteSettings.useManualRate && siteSettings.manualRate > 0
    ? siteSettings.manualRate
    : usdRate;

  return (
    <MenuContext.Provider value={{ menuItems, updateMenuItem, setMenuItems, extrasData, updateExtraItem, setExtrasData, resetToDefaults, resetTextsOnly, lastEditTimestamp, siteSettings, setSiteSettings, usdRate: effectiveRate, setUsdRate }}>
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
