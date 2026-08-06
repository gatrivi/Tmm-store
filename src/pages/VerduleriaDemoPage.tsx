/**
 * La Inmaculada — verdulería demo (Puestito-tier: photo-first, brand hero, sticky cart).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

const STYLE_ID = 'verduleria-site-css';
const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Outfit:wght@400;500;600;700;800&display=swap');
.vd-site { font-family: "Outfit", "Segoe UI", system-ui, sans-serif; }
.vd-brand { font-family: "Fraunces", Georgia, serif; }
.vd-hero-wave {
  background: linear-gradient(180deg, transparent 0%, transparent 42%, #5A7A58 42%, #5A7A58 100%);
}
.vd-card { box-shadow: 0 12px 40px rgba(26, 42, 28, 0.08); }
.vd-sticky-in { animation: vd-up 0.28s ease-out; }
@keyframes vd-up {
  from { transform: translateY(110%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;

type CartLine = {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
};
type CardState = Record<string, { optionId: string; qty: number }>;

function formatArs(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

export default function VerduleriaDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId } = usePlan();
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;
  const catalogRef = useRef<HTMLElement>(null);

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* ignore */ }
    return [];
  });
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [categoryId, setCategoryId] = useState('todos');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({});

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'La Inmaculada'} — Pedido online`;
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = PAGE_CSS;
      document.head.appendChild(el);
    }
  }, [setTheme, siteSettings.brandName]);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, cartKey]);

  useEffect(() => {
    if (!menuItems.length) return;
    setCardState(prev => {
      const next = { ...prev };
      for (const item of menuItems) {
        if (!next[item.id]) next[item.id] = { optionId: item.options[0]?.id ?? '', qty: 1 };
      }
      return next;
    });
  }, [menuItems]);

  const visibleItems = useMemo(() => {
    if (categoryId === 'todos') return menuItems;
    return menuItems.filter(i => i.category === categoryId);
  }, [menuItems, categoryId]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price * l.qty, 0);

  const addLine = (item: MenuItemType, option: MenuOption, qty: number) => {
    if (!option || qty < 1) return;
    playAddToCartSound();
    setCart(prev => {
      const idx = prev.findIndex(l => l.id === item.id && l.optionId === option.id);
      if (idx >= 0) return prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
      return [...prev, {
        id: item.id,
        name: item.name,
        optionId: option.id,
        optionLabel: option.label,
        price: option.price,
        qty,
      }];
    });
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev =>
      prev.map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l)).filter(l => l.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F0E8] text-[#1A2A1C]">
        Demo no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todo' },
    ...menuCategories.map(c => ({ id: c.id, label: c.name })),
  ];

  const sage = '#5A7A58';
  const leaf = theme.bordo;
  const ink = theme.carbon;
  const cream = '#F7F4EC';

  return (
    <div className="vd-site min-h-screen pb-28" style={{ backgroundColor: cream, color: ink }} data-demo-page="verduleria">
      <DemoRibbon />

      {/* Hero — brand first, one composition */}
      <section className="relative isolate">
        <div className="relative h-[58vh] min-h-[340px] max-h-[520px] overflow-hidden">
          <img
            src={demo.heroImage || '/demos/verduleria/hero.jpg'}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: demo.heroObjectPosition || 'center 40%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A1C]/55 via-transparent to-[#1A2A1C]/25" />
        </div>

        <div className="relative -mt-16 px-4 sm:px-6">
          <div
            className="mx-auto max-w-lg rounded-[2rem] px-6 pb-8 pt-7 text-center text-white"
            style={{ backgroundColor: sage }}
          >
            <p className="vd-brand text-[2.35rem] leading-none tracking-[-0.02em] sm:text-5xl">
              {siteSettings.brandName}
            </p>
            <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/90">
              Ugarte y España
            </p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/88">
              {copy.heroBody}
            </p>
            <button
              type="button"
              onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-extrabold"
              style={{ color: sage }}
            >
              Ver productos
            </button>
          </div>
        </div>
      </section>

      {/* Fulfillment + categories */}
      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4 px-4 sm:px-6">
        <div className="flex rounded-full border border-black/8 bg-white p-1">
          {([
            ['delivery', copy.deliveryLabel],
            ['pickup', copy.pickupLabel],
          ] as const).map(([id, label]) => {
            const on = fulfillment === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setFulfillment(id)}
                className={`min-h-11 flex-1 rounded-full text-sm font-bold transition ${on ? 'text-white' : 'text-black/45'}`}
                style={on ? { backgroundColor: leaf } : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => {
            const on = categoryId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryId(f.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] transition ${
                  on ? 'text-white' : 'bg-white text-black/45 ring-1 ring-black/8'
                }`}
                style={on ? { backgroundColor: ink } : undefined}
              >
                {f.label}
              </button>
            );
          })}
        </nav>

        <p className="text-center text-[11px] font-medium text-black/45">{copy.weightNotice}</p>
      </div>

      {/* Products — large photo cards */}
      <main ref={catalogRef} className="mx-auto mt-4 max-w-lg scroll-mt-6 space-y-6 px-4 pb-8 sm:px-6">
        <h2 className="vd-brand text-center text-2xl tracking-[-0.02em]" style={{ color: ink }}>
          Del día
        </h2>

        {visibleItems.map(item => {
          const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
          const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
          const img = item.images[0];
          const lineTotal = (option?.price ?? 0) * state.qty;

          return (
            <article key={item.id} className="vd-card overflow-hidden rounded-[1.75rem] bg-white">
              <div className="relative aspect-[4/3] bg-[#E8EDE4]">
                {img ? (
                  <img
                    src={img}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: item.imagePositions?.[img] || 'center' }}
                    loading="lazy"
                  />
                ) : null}
                {item.badge ? (
                  <span
                    className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-white"
                    style={{ backgroundColor: leaf }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-xl font-extrabold tracking-[-0.02em]">{item.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-black/55">{item.description}</p>
                </div>

                {item.options.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {item.options.map(opt => {
                      const on = state.optionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setCardState(prev => ({
                              ...prev,
                              [item.id]: { optionId: opt.id, qty: prev[item.id]?.qty ?? 1 },
                            }))
                          }
                          className={`min-h-10 rounded-full px-4 text-xs font-bold transition ${
                            on ? 'text-white' : 'bg-[#F0EDE4] text-black/60'
                          }`}
                          style={on ? { backgroundColor: sage } : undefined}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-black/40">{option?.label}</p>
                )}

                <div className="flex items-end justify-between gap-3 border-t border-black/6 pt-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-black/35">
                      {copy.totalLabel}
                    </p>
                    <p className="text-3xl font-extrabold tracking-[-0.03em]" style={{ color: ink }}>
                      {formatArs(lineTotal)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full bg-[#F0EDE4]">
                      <button
                        type="button"
                        aria-label="Restar"
                        className="flex h-10 w-10 items-center justify-center text-black/50"
                        onClick={() =>
                          setCardState(prev => ({
                            ...prev,
                            [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) },
                          }))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-extrabold">{state.qty}</span>
                      <button
                        type="button"
                        aria-label="Sumar"
                        className="flex h-10 w-10 items-center justify-center text-black/50"
                        onClick={() =>
                          setCardState(prev => ({
                            ...prev,
                            [item.id]: { optionId: state.optionId, qty: state.qty + 1 },
                          }))
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => option && addLine(item, option, state.qty)}
                      className="flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-extrabold text-white"
                      style={{ backgroundColor: leaf }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <p className="pt-2 text-center text-[11px] font-medium leading-relaxed text-black/40">
          {copy.totalHint}
        </p>
        <p className="pb-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-black/30">
          Gatrivi.com · demo
        </p>
      </main>

      {/* Sticky cart — Puestito-like presence */}
      {cartCount > 0 && (
        <div className="vd-sticky-in fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div
            className="mx-auto flex max-w-lg items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-2xl"
            style={{ backgroundColor: ink }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {cartCount} · {formatArs(cartTotal)}
              </p>
              <p className="truncate text-[11px] text-white/55">{copy.totalLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setCheckoutOpen(true)}
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-extrabold"
              style={{ backgroundColor: leaf, color: '#fff' }}
            >
              <ShoppingCart size={16} />
              {copy.cartCta}
            </button>
          </div>

          {/* compact lines peek */}
          <div className="mx-auto mt-2 hidden max-w-lg rounded-xl bg-white/95 p-3 text-xs shadow-lg sm:block">
            {cart.slice(0, 3).map((line, idx) => (
              <div key={`${line.id}-${line.optionId}-${idx}`} className="flex items-center justify-between gap-2 py-1">
                <span className="truncate font-semibold">
                  {line.qty}× {line.name} · {line.optionLabel}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, -1)}>
                    <Minus size={12} />
                  </button>
                  <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, 1)}>
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        subtotal={cartTotal}
        discount={0}
        whatsappNumber=""
        bankAlias=""
        mpEnabled={false}
        initialDeliveryType={fulfillment}
        onOrderSent={() => setCart([])}
      />
    </div>
  );
}
