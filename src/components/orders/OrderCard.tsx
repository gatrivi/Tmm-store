import { Clock3, PackageCheck, Truck } from 'lucide-react';
import type { OrderRecord } from '../../types/order';
import { ORDER_STATUS_LABELS } from '../../types/order';
import { PaymentBadge } from './PaymentBadge';

function ageLabel(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.floor(mins / 60);
  return `hace ${h} h`;
}

function firstLine(order: OrderRecord): string {
  if (order.items.length === 0) return 'Sin ítems';
  const first = order.items[0];
  const rest = order.items.length - 1;
  const base = `${first.qty}× ${first.name}`;
  return rest > 0 ? `${base} · +${rest}` : base;
}

const STATUS_TONE: Record<'light' | 'dark', Record<string, string>> = {
  light: {
    new: 'bg-[#fff1cd] text-[#8c5a00]',
    preparing: 'bg-[#e8e6ff] text-[#5148a8]',
    ready: 'bg-[#dff7e9] text-[#197443]',
    out_for_delivery: 'bg-[#dff7e9] text-[#197443]',
    completed: 'bg-[#edf0e9] text-black/50',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-red-100 text-red-700',
  },
  dark: {
    new: 'bg-amber-500/20 text-amber-300',
    preparing: 'bg-indigo-500/20 text-indigo-300',
    ready: 'bg-emerald-500/20 text-emerald-300',
    out_for_delivery: 'bg-emerald-500/20 text-emerald-300',
    completed: 'bg-white/10 text-gray-400',
    rejected: 'bg-red-500/20 text-red-300',
    cancelled: 'bg-red-500/20 text-red-300',
  },
};

interface OrderCardProps {
  order: OrderRecord;
  selected?: boolean;
  highlight?: boolean;
  tone?: 'light' | 'dark';
  onSelect: (order: OrderRecord) => void;
}

export function OrderCard({
  order,
  selected,
  highlight,
  tone = 'light',
  onSelect,
}: OrderCardProps) {
  const statusClass = STATUS_TONE[tone][order.status] ?? STATUS_TONE[tone].new;
  const isLight = tone === 'light';

  return (
    <button
      type="button"
      onClick={() => onSelect(order)}
      className={`w-full text-left transition ${
        isLight
          ? `border-b border-black/8 p-4 sm:p-5 hover:bg-[#fafaf7] ${selected ? 'bg-[#fafaf7]' : ''} ${highlight ? 'ring-2 ring-[#ee6847]/40' : ''}`
          : `rounded-2xl border p-4 hover:bg-white/5 ${selected ? 'border-brand-green bg-white/5' : 'border-white/5 bg-white/3'} ${order.status === 'new' ? 'ring-1 ring-brand-green/40' : ''} ${highlight ? 'ring-2 ring-brand-green' : ''}`
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-sm font-black ${isLight ? 'text-[#151612]' : 'text-white'}`}>
              #{order.id}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${statusClass}`}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
            <PaymentBadge order={order} tone={tone} />
          </div>
          <p className={`mt-1 text-sm font-bold ${isLight ? 'text-black/70' : 'text-gray-300'}`}>
            {order.customerName}
          </p>
          <p className={`mt-0.5 truncate text-sm ${isLight ? 'text-black/45' : 'text-gray-500'}`}>
            {firstLine(order)}
          </p>
          <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs font-bold ${isLight ? 'text-black/40' : 'text-gray-500'}`}>
            <span className="flex items-center gap-1">
              <Clock3 size={12} /> {ageLabel(order.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              {order.deliveryType === 'delivery' ? <Truck size={12} /> : <PackageCheck size={12} />}
              {order.deliveryType === 'delivery' ? 'Envío' : 'Retiro'}
            </span>
          </div>
        </div>
        <p className={`shrink-0 text-base font-black ${isLight ? 'text-[#151612]' : 'text-green-400'}`}>
          ${order.total.toLocaleString('es-AR')}
        </p>
      </div>
    </button>
  );
}
