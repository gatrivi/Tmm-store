import { Clock } from 'lucide-react';
import {
  BUSINESS_HOURS_DAYS,
  saveBusinessHours,
  type BusinessHoursSchedule,
} from '../../utils/businessHours';

interface BusinessHoursFieldsProps {
  value: BusinessHoursSchedule;
  onChange: (hours: BusinessHoursSchedule) => void;
  compact?: boolean;
}

export function BusinessHoursFields({ value, onChange, compact = false }: BusinessHoursFieldsProps) {
  const update = (patch: Partial<BusinessHoursSchedule>) => {
    const next = { ...value, ...patch };
    onChange(next);
    saveBusinessHours(next);
  };

  return (
    <div className={`space-y-4 ${compact ? '' : 'border-t border-white/5 pt-4'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Clock size={16} className="text-purple-400 shrink-0" />
          <span className="text-sm font-bold text-white">Horarios de atención</span>
        </div>
        <button
          type="button"
          onClick={() => update({ enabled: !value.enabled })}
          aria-label="Activar horarios"
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            value.enabled ? 'bg-brand-green' : 'bg-white/20'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
              value.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {!compact && (
        <p className="text-xs text-gray-500">
          Los clientes ven Abierto/Cerrado y no pueden pedir fuera de horario.
        </p>
      )}

      {value.enabled && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                Apertura
              </span>
              <input
                type="time"
                value={value.openTime}
                onChange={e => update({ openTime: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                Cierre
              </span>
              <input
                type="time"
                value={value.closeTime}
                onChange={e => update({ closeTime: e.target.value })}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white"
              />
            </label>
          </div>

          <div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Días abiertos
            </span>
            <div className="flex flex-wrap gap-2">
              {BUSINESS_HOURS_DAYS.map(day => {
                const active = value.daysOpen.includes(day.idx);
                return (
                  <button
                    key={day.idx}
                    type="button"
                    onClick={() => {
                      const nextDays = active
                        ? value.daysOpen.filter(d => d !== day.idx)
                        : [...value.daysOpen, day.idx];
                      update({ daysOpen: nextDays.sort((a, b) => a - b) });
                    }}
                    className={`min-w-[44px] min-h-[44px] px-3 rounded-xl text-xs font-bold transition ${
                      active
                        ? 'bg-brand-green text-white'
                        : 'bg-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
