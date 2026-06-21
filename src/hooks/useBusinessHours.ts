import { useEffect, useState } from 'react';
import {
  loadBusinessHours,
  isBusinessOpen,
  getNextOpeningText,
  formatBusinessHoursSummary,
  BUSINESS_HOURS_UPDATED_EVENT,
  BUSINESS_HOURS_STORAGE_KEY,
  type BusinessHoursSchedule,
} from '../utils/businessHours';

export function useBusinessHours(lang: string = 'es') {
  const [hours, setHours] = useState<BusinessHoursSchedule>(() => loadBusinessHours());

  useEffect(() => {
    const onUpdated = (event: Event) => {
      const detail = (event as CustomEvent<BusinessHoursSchedule>).detail;
      if (detail) setHours(detail);
      else setHours(loadBusinessHours());
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === BUSINESS_HOURS_STORAGE_KEY) {
        setHours(loadBusinessHours());
      }
    };

    window.addEventListener(BUSINESS_HOURS_UPDATED_EVENT, onUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(BUSINESS_HOURS_UPDATED_EVENT, onUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return {
    hours,
    isOpen: hours.enabled ? isBusinessOpen(hours) : true,
    nextOpening: hours.enabled ? getNextOpeningText(hours, lang) : '',
    summary: formatBusinessHoursSummary(hours),
  };
}
