/**
 * Flagship storefront — Las Tortas de Mamá Mabel.
 * Brand assets: public/demos/mamabel/ · course drops: content/mamabel/incoming/
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  Clock3,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { AIAssistant } from '../components/AIAssistant';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

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

function priceLabel(item: MenuItemType): string {
  if (item.options.length > 1) return `desde ${formatArs(item.options[0].price)}`;
  const only = item.options[0];
  return only ? formatArs(only.price) : '';
}

function isSizeItem(item: MenuItemType): boolean {
  return item.options.length > 1;
}

export default function MamabelDemoPage() {
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
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('pickup');
  const [categoryId, setCategoryId] = useState<string>('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({});

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Mamá Mabel'} — Flagship`;
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
        if (!next[item.id]) {
          next[item.id] = { optionId: item.options[0]?.id ?? '', qty: 1 };
        }
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
      if (idx >= 0) {
        return prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          optionId: option.id,
          optionLabel: option.label,
          price: option.price,
          qty,
        },
      ];
    });
  };

  const handleAIAddToCart = (itemId: string, optionId: string, qty: number) => {
    const item = menuItems.find(m => m.id === itemId);
    const option = item?.options.find(o => o.id === optionId);
    if (!item || !option) return;
    addLine(item, option, qty || 1);
    setCartOpen(true);
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev =>
      prev
        .map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l))
        .filter(l => l.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBFC] text-[#2C2426]">
        Demo Mamá Mabel no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todas' },
    ...menuCategories.map(c => ({ id: c.id, label: c.name })),
  ];
  const accent = siteSettings.brandAccent || theme.papel;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.hueso, color: theme.carbon }}
      data-demo-theme="mamabel"
    >
      <DemoRibbon />

      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {siteSettings.brandLogo ? (
              <img
                src={siteSettings.brandLogo}
                alt=""
                className="h-12 w-12 rounded-full object-cover ring-2 ring-[#E8A0BF]/80"
              />
            ) : null}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
                Las tortas de
              </p>
              <p
                className="text-2xl leading-none sm:text-3xl"
                style={{
                  fontFamily: '"Segoe Script", "Apple Chancery", "Comic Sans MS", cursive',
                  color: theme.bordo,
                }}
              >
                mamá mabel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-black/10 bg-white p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`min-h-9 rounded-full px-3 transition ${
                  fulfillment === 'pickup' ? 'text-white' : 'text-black/55'
                }`}
                style={fulfillment === 'pickup' ? { backgroundColor: theme.bordo } : undefined}
              >
                Retiro
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`min-h-9 rounded-full px-3 transition ${
                  fulfillment === 'delivery' ? 'text-white' : 'text-black/55'
                }`}
                style={fulfillment === 'delivery' ? { backgroundColor: theme.bordo } : undefined}
              >
                Delivery
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Ver carrito${cartCount ? ` · ${formatArs(cartTotal)}` : ''}`}
              className="flex min-h-11 items-center gap-2 rounded-xl px-2.5 text-left transition hover:bg-black/4"
            >
              <span
                className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: theme.bordo }}
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span
                    className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black"
                    style={{ backgroundColor: accent, color: theme.carbon }}
                  >
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-black">{formatArs(cartTotal)}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-black/45">
                  Ver pedido <ChevronDown size={12} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src={demo.heroImage || '/demos/mamabel/hero.jpg'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: demo.heroObjectPosition || 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C2426]/82 via-[#2C2426]/45 to-transparent" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <p
            className="text-sm tracking-wide text-white/80"
            style={{ fontFamily: '"Segoe Script", "Apple Chancery", cursive' }}
          >
            desde la cocina de mamá
          </p>
          <h1
            className="max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl"
            style={{ fontFamily: siteSettings.brandFont }}
          >
            {copy.heroTitle}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {copy.heroBody}
          </p>
          <button
            type="button"
            onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="inline-flex min-h-12 w-fit items-center justify-center rounded-full px-6 text-sm font-black text-white"
            style={{ backgroundColor: theme.bordo }}
          >
            Ver tortas
          </button>
        </div>
      </section>

      <nav className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {filters.map(f => {
            const active = categoryId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryId(f.id)}
                className={`shrink-0 border-b-2 px-3 py-3.5 text-xs font-black uppercase tracking-[0.06em] transition ${
                  active ? '' : 'border-transparent text-black/40 hover:text-black/70'
                }`}
                style={active ? { borderColor: theme.bordo, color: theme.bordo } : undefined}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-b border-black/6" style={{ backgroundColor: `${theme.papel}99` }}>
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-3 text-xs font-bold text-black/60 sm:grid-cols-3 sm:px-6">
          <p className="flex items-center gap-2">
            <Heart size={15} style={{ color: theme.bordo }} /> Recetas de casa
          </p>
          <p className="flex items-center gap-2">
            <Clock3 size={15} style={{ color: theme.bordo }} /> Fecha y dedicatoria en notas
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck size={15} style={{ color: theme.bordo }} /> Pedido de prueba · Premium AI
          </p>
        </div>
      </div>

      <main ref={catalogRef} className="mx-auto max-w-6xl scroll-mt-28 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map(item => {
            const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
            const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
            const img = item.images[0];
            const sized = isSizeItem(item);

            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm"
              >
                <div className="aspect-[4/3]" style={{ backgroundColor: theme.papel }}>
                  {img ? (
                    <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                      {siteSettings.brandLogo ? (
                        <img src={siteSettings.brandLogo} alt="" className="h-16 w-16 rounded-full object-cover opacity-80" />
                      ) : null}
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">
                        {item.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-black tracking-[-0.02em]">{item.name}</h2>
                      {item.badge && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase"
                          style={{ backgroundColor: accent, color: theme.carbon }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-black/50">{item.description}</p>
                    <p className="mt-2 text-lg font-black" style={{ color: theme.bordo }}>
                      {priceLabel(item)}
                    </p>
                  </div>

                  {sized ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.options.map(opt => {
                        const on = state.optionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setCardState(prev => ({
                                ...prev,
                                [item.id]: { ...prev[item.id], optionId: opt.id, qty: prev[item.id]?.qty ?? 1 },
                              }))
                            }
                            className={`min-h-9 rounded-full border px-3 text-[11px] font-bold transition ${
                              on ? 'text-white' : 'border-black/12 bg-white text-black/60'
                            }`}
                            style={on ? { backgroundColor: theme.bordo, borderColor: theme.bordo } : undefined}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-[11px] font-bold text-black/45">{option?.label}</p>
                  )}

                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-black/12 bg-white">
                      <button
                        type="button"
                        aria-label="Restar"
                        className="flex h-10 w-9 items-center justify-center text-black/55"
                        onClick={() =>
                          setCardState(prev => ({
                            ...prev,
                            [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) },
                          }))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-black">{state.qty}</span>
                      <button
                        type="button"
                        aria-label="Sumar"
                        className="flex h-10 w-9 items-center justify-center text-black/55"
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
                      className="flex min-h-10 flex-1 items-center justify-center rounded-full text-sm font-black text-white"
                      style={{ backgroundColor: theme.bordo }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      <footer className="border-t border-black/8 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            { icon: ShoppingBag, title: 'Retiro', body: copy.pickupHint },
            { icon: Truck, title: 'Delivery', body: copy.deliveryHint },
            { icon: ShieldCheck, title: 'Demo segura', body: copy.successBody },
          ].map(col => (
            <div key={col.title} className="text-center sm:text-left">
              <div
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border sm:mx-0"
                style={{ borderColor: `${theme.bordo}55`, color: theme.bordo }}
              >
                <col.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-base font-black">{col.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/55">{col.body}</p>
            </div>
          ))}
        </div>
        <p className="pb-8 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-black/35">
          Trufi · flagship familia
        </p>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/45">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <h2 className="text-lg font-black">Tu encargo</h2>
              <button type="button" className="text-sm font-bold text-black/45" onClick={() => setCartOpen(false)}>
                Cerrar
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-black/45">Todavía no agregaste tortas.</p>
              ) : (
                cart.map((line, idx) => (
                  <div key={`${line.id}-${line.optionId}-${idx}`} className="flex justify-between gap-3 border-b border-black/6 pb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {line.qty} × {line.name} · {line.optionLabel}
                      </p>
                      <p className="mt-1 text-xs font-bold" style={{ color: theme.bordo }}>
                        {formatArs(line.price * line.qty)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, -1)}>
                        <Minus size={14} />
                      </button>
                      <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-black/8 p-5">
              <div className="mb-1 flex justify-between text-lg font-black">
                <span>{copy.totalLabel}</span>
                <span>{formatArs(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-black/45">{copy.totalHint}</p>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="flex min-h-12 w-full items-center justify-center rounded-full text-sm font-black text-white disabled:opacity-40"
                style={{ backgroundColor: theme.bordo }}
              >
                {copy.cartCta}
              </button>
            </div>
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

      <AIAssistant onAddToCart={handleAIAddToCart} />
    </div>
  );
}
