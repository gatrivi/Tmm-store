import { Loader2 } from 'lucide-react';
import type { DeliveryType, OrderStatus } from '../../types/order';
import { primaryActionLabel, nextOperationalStatus } from '../../utils/orderStateMachine';

interface OrderPrimaryActionProps {
  status: OrderStatus;
  fulfillment: DeliveryType;
  loading?: boolean;
  disabled?: boolean;
  onAdvance: (next: OrderStatus) => void;
  className?: string;
}

export function OrderPrimaryAction({
  status,
  fulfillment,
  loading,
  disabled,
  onAdvance,
  className = '',
}: OrderPrimaryActionProps) {
  const label = primaryActionLabel(status, fulfillment);
  const next = nextOperationalStatus(status, fulfillment);
  if (!label || !next) return null;

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={() => onAdvance(next)}
      className={
        className ||
        'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#151612] px-4 text-sm font-black text-white transition hover:bg-[#ee6847] disabled:opacity-50'
      }
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {label}
    </button>
  );
}
