import { useEffect } from 'react';
import { X } from 'lucide-react';

interface OrderDrawerProps {
  open: boolean;
  title: string;
  onClose: () => void;
  tone?: 'light' | 'dark';
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Móvil: bottom sheet. Escritorio: panel lateral embebido vía CSS del padre;
 * este componente siempre monta overlay en < lg.
 */
export function OrderDrawer({
  open,
  title,
  onClose,
  tone = 'light',
  children,
  footer,
}: OrderDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isLight = tone === 'light';

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className={`relative flex max-h-[88vh] w-full flex-col rounded-t-3xl shadow-2xl ${
          isLight ? 'bg-white text-[#151612]' : 'bg-[#1a1a1a] text-white border border-white/10'
        }`}
      >
        <div className={`flex items-center justify-between border-b px-4 py-3 ${isLight ? 'border-black/8' : 'border-white/10'}`}>
          <h3 className="text-base font-black">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className={`flex h-11 w-11 items-center justify-center rounded-full ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/10'}`}
            aria-label="Cerrar detalle"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && (
          <div className={`border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] ${isLight ? 'border-black/8' : 'border-white/10'}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/** Panel detalle escritorio (visible solo lg+) */
export function OrderDesktopPanel({
  open,
  tone = 'light',
  children,
  empty,
}: {
  open: boolean;
  tone?: 'light' | 'dark';
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  const isLight = tone === 'light';
  if (!open) {
    return (
      <div className={`hidden lg:flex items-center justify-center rounded-3xl border p-8 ${
        isLight ? 'border-black/8 bg-white text-black/40' : 'border-white/5 bg-white/3 text-gray-500'
      }`}>
        {empty ?? 'Seleccioná un pedido'}
      </div>
    );
  }
  return (
    <div className={`hidden lg:flex flex-col rounded-3xl border overflow-hidden ${
      isLight ? 'border-black/8 bg-white' : 'border-white/5 bg-white/3'
    }`}>
      {children}
    </div>
  );
}
