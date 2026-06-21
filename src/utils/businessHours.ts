import { translations } from '../i18n/translations';

export interface BusinessHoursSchedule {
  enabled: boolean;
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
  daysOpen: number[]; // 0=Dom, 1=Lun, ... 6=Sab
}

export const BUSINESS_HOURS_STORAGE_KEY = 'elpuestito_business_hours';
export const BUSINESS_HOURS_UPDATED_EVENT = 'trufi:business-hours-updated';

export const BUSINESS_HOURS_DAYS = [
  { idx: 1, label: 'Lun', full: 'Lunes' },
  { idx: 2, label: 'Mar', full: 'Martes' },
  { idx: 3, label: 'Mié', full: 'Miércoles' },
  { idx: 4, label: 'Jue', full: 'Jueves' },
  { idx: 5, label: 'Vie', full: 'Viernes' },
  { idx: 6, label: 'Sáb', full: 'Sábado' },
  { idx: 0, label: 'Dom', full: 'Domingo' },
] as const;

export const defaultBusinessHours: BusinessHoursSchedule = {
  enabled: false,
  openTime: '19:00',
  closeTime: '00:00',
  daysOpen: [3, 4, 5, 6, 0], // Mié-Dom (común en gastronomía argentina)
};

export function loadBusinessHours(): BusinessHoursSchedule {
  try {
    const raw = localStorage.getItem(BUSINESS_HOURS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BusinessHoursSchedule;
  } catch {
    // ignore
  }
  return { ...defaultBusinessHours };
}

export function saveBusinessHours(hours: BusinessHoursSchedule): void {
  try {
    localStorage.setItem(BUSINESS_HOURS_STORAGE_KEY, JSON.stringify(hours));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(BUSINESS_HOURS_UPDATED_EVENT, { detail: hours }));
    }
  } catch {
    // ignore
  }
}

/**
 * Determina si el negocio está abierto ahora según la configuración.
 * Soporta horarios que cruzan medianoche (ej: 19:00 a 00:00, o 19:00 a 02:00).
 */
export function isBusinessOpen(hours: BusinessHoursSchedule): boolean {
  if (!hours.enabled) return true;

  const now = new Date();
  const currentDay = now.getDay();

  if (!hours.daysOpen.includes(currentDay)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = hours.openTime.split(':').map(Number);
  const [closeH, closeM] = hours.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes;
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Devuelve un texto descriptivo del próximo horario de apertura.
 */
export function getNextOpeningText(hours: BusinessHoursSchedule, lang: string = 'es'): string {
  if (!hours.enabled || hours.daysOpen.length === 0) return '';

  const t = translations[lang as keyof typeof translations].businessHours;
  const now = new Date();
  const today = now.getDay();

  for (let i = 1; i <= 7; i++) {
    const checkDay = (today + i) % 7;
    if (hours.daysOpen.includes(checkDay)) {
      const dayLabel = i === 1 ? t.tomorrow : t.days[checkDay];
      return `${t.nextOpening} ${dayLabel} ${t.at} ${hours.openTime}hs`;
    }
  }

  return '';
}

/** Texto corto para footer / ficha del local (ej: "Mié, Jue, Vie, Sáb, Dom · 19:00 a 00:00hs") */
export function formatBusinessHoursSummary(hours: BusinessHoursSchedule): string {
  if (!hours.enabled || hours.daysOpen.length === 0) return '';

  const openLabels = BUSINESS_HOURS_DAYS.filter(d => hours.daysOpen.includes(d.idx)).map(d => d.label);
  const daysPart =
    openLabels.length === 7 ? 'Todos los días' : openLabels.join(', ');

  return `${daysPart} · ${hours.openTime} a ${hours.closeTime}hs`;
}
