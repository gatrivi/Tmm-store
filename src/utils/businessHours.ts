import { translations } from '../i18n/translations';

export interface BusinessHoursSchedule {
  enabled: boolean;
  openTime: string; // "HH:mm"
  closeTime: string; // "HH:mm"
  daysOpen: number[]; // 0=Dom, 1=Lun, ... 6=Sab
}

const STORAGE_KEY = 'elpuestito_business_hours';

export const defaultBusinessHours: BusinessHoursSchedule = {
  enabled: false,
  openTime: '19:00',
  closeTime: '00:00',
  daysOpen: [3, 4, 5, 6, 0], // Mié-Dom (común en gastronomía argentina)
};

export function loadBusinessHours(): BusinessHoursSchedule {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BusinessHoursSchedule;
  } catch {
    // ignore
  }
  return { ...defaultBusinessHours };
}

export function saveBusinessHours(hours: BusinessHoursSchedule): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hours));
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
  const currentDay = now.getDay(); // 0=Dom, 1=Lun...

  if (!hours.daysOpen.includes(currentDay)) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = hours.openTime.split(':').map(Number);
  const [closeH, closeM] = hours.closeTime.split(':').map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (closeMinutes < openMinutes) {
    // Cruza medianoche (ej: 19:00 -> 02:00)
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

  // Buscar el próximo día abierto
  for (let i = 1; i <= 7; i++) {
    const checkDay = (today + i) % 7;
    if (hours.daysOpen.includes(checkDay)) {
      const dayLabel = i === 1 ? t.tomorrow : t.days[checkDay];
      return `${t.nextOpening} ${dayLabel} ${t.at} ${hours.openTime}hs`;
    }
  }

  return '';
}

