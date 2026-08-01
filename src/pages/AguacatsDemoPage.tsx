/**
 * Dedicated storefront — Aguacats (foodservice · paltas)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  Leaf,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

const IG_SHOTS = [
  '/demos/aguacats/scraped/ig_04.jpg',
  '/demos/aguacats/scraped/ig_08.jpg',
  '/demos/aguacats/scraped/ig_12.jpg',
  '/demos/aguacats/yaguacat.jpg',
] as const;

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
  const min = Math.min(...item.options.map(o => o.price));
  if (item.options.length === 1) return formatArs(min);
  return `Desde ${formatArs(min)}`;
}

export default function AguacatsDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId } = usePlan();
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;
  const accent = siteSettings.brandAccent || '#C4A035';
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
  const [categoryId, setCategoryId] = useState<string>('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({});

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Aguacats'} — Tienda`;
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

  const featured = useMemo(
    () => menuItems.find(i => i.id === 'combo-frescura'),
    [menuItems],
  );

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

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev =>
      prev
        .map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l))
        .filter(l => l.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F7E8] text-[#1A2E14]">
        Demo Aguacats no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todos' },
    ...menuCategories.map(c => ({ id: c.id, label: c.name })),
  ];

  const igHandle = siteSettings.brandInstagram;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.hueso, color: theme.carbon }}
      data-demo-theme="aguacats"
    >
      <DemoRibbon />

      <header className="sticky top-0 z-30 border-b border-black/8 bg-[#F4F7E8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            {siteSettings.brandLogo && (
              <img
                src={siteSettings.brandLogo}
                alt=""
                className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
              />
            )}
            <div>
              <p
                className="text-lg font-bold leading-tight tracking-[-0.03em] sm:text-xl"
                style={{ fontFamily: siteSettings.brandFont, color: theme.bordo }}
              >
                {siteSettings.brandName}
              </p>
              <p className="text-[11px] font-bold text-black/45">{siteSettings.brandAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-black/10 bg-white p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`min-h-9 rounded-full px-3 transition ${
                  fulfillment === 'delivery' ? 'text-white' : 'text-black/55'
                }`}
                style={fulfillment === 'delivery' ? { backgroundColor: theme.bordo } : undefined}
              >
                Envío
              </button>
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
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1A2E14] px-1 text-[10px] font-black text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:block">
                <span className="block text-sm font-black">{formatArs(cartTotal)}</span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-black/45">
                  Ver carrito <ChevronDown size={12} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src={demo.heroImage || '/demos/aguacats/hero.jpg'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: demo.heroObjectPosition || 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(105deg, ${theme.carbon}e8 0%, ${theme.carbon}99 42%, ${theme.bordo}55 100%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-center lg:py-24">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {copy.chips.map(chip => (
                <span
                  key={chip}
                  className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-white"
                  style={{ backgroundColor: `${accent}cc` }}
                >
                  {chip}
                </span>
              ))}
            </div>
            <h1
              className="max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl"
              style={{ fontFamily: siteSettings.brandFont }}
            >
              {copy.heroTitle}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-white/88 sm:text-base">
              {copy.heroBody}
            </p>
            <button
              type="button"
              onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="inline-flex min-h-12 w-fit items-center justify-center rounded-xl px-6 text-sm font-black text-[#1A2E14]"
              style={{ backgroundColor: accent }}
            >
              Ver catálogo
            </button>
          </div>
          <img
            src="/demos/aguacats/yaguacat.jpg"
            alt="Yaguacat — mascota Aguacats"
            className="mx-auto hidden w-48 rounded-2xl border-4 border-white/20 shadow-2xl lg:block lg:w-56"
          />
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

      <div className="border-b border-black/6" style={{ backgroundColor: theme.papel }}>
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-3 text-xs font-bold text-black/65 sm:grid-cols-3 sm:px-6">
          <p className="flex items-center gap-2">
            <Package size={15} style={{ color: theme.salvia }} /> Mayor y menor
          </p>
          <p className="flex items-center gap-2">
            <Truck size={15} style={{ color: theme.salvia }} /> Zona Norte y CABA
          </p>
          <p className="flex items-center gap-2">
            <Leaf size={15} style={{ color: theme.salvia }} /> {copy.weightNotice}
          </p>
        </div>
      </div>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
          <article
            className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-md sm:flex"
          >
            <div className="aspect-[16/10] sm:aspect-auto sm:w-2/5" style={{ backgroundColor: theme.papel }}>
              <img
                src={featured.images[0]}
                alt={featured.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:p-8">
              <span
                className="w-fit rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                {featured.badge || 'Destacado'}
              </span>
              <h2 className="text-2xl font-black tracking-[-0.03em]" style={{ color: theme.bordo }}>
                {featured.name}
              </h2>
              <p className="text-sm leading-relaxed text-black/55">{featured.description}</p>
              <p className="text-xl font-black" style={{ color: theme.bordo }}>
                {priceLabel(featured)}
              </p>
              <button
                type="button"
                onClick={() => {
                  const opt = featured.options[0];
                  if (opt) addLine(featured, opt, 1);
                  setCartOpen(true);
                }}
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-xl px-5 text-sm font-black text-white"
                style={{ backgroundColor: theme.bordo }}
              >
                Agregar al carrito
              </button>
            </div>
          </article>
        </section>
      )}

      <main ref={catalogRef} className="mx-auto max-w-6xl scroll-mt-28 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map(item => {
            const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
            const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
            const img = item.images[0];

            return (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm"
              >
                <div className="aspect-[4/3]" style={{ backgroundColor: theme.papel }}>
                  {img ? (
                    <img
                      src={img}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-black uppercase text-black/35">
                      {item.name}
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
                          style={{ backgroundColor: `${accent}22`, color: accent }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-black/50">{item.description}</p>
                    <p className="mt-2 text-lg font-black" style={{ color: theme.bordo }}>
                      {option ? formatArs(option.price) : priceLabel(item)}
                    </p>
                  </div>

                  {item.options.length > 1 && (
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
                            [item.id]: {
                              optionId: state.optionId,
                              qty: Math.max(1, state.qty - 1),
                            },
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
                      className="flex min-h-10 flex-1 items-center justify-center rounded-lg text-sm font-black text-white"
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

      <section className="border-t border-black/8 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Instagram</p>
              <h2 className="text-xl font-black" style={{ color: theme.bordo }}>
                @{igHandle}
              </h2>
            </div>
            {igHandle && (
              <a
                href={`https://www.instagram.com/${igHandle}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold underline underline-offset-2"
                style={{ color: theme.bordo }}
              >
                Ver perfil
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {IG_SHOTS.map(src => (
              <div key={src} className="aspect-square overflow-hidden rounded-xl border border-black/8">
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/8 bg-[#F4F7E8]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Truck, title: copy.deliveryLabel, body: copy.deliveryHint },
            { icon: ShoppingBag, title: copy.pickupLabel, body: copy.pickupHint },
            { icon: ShieldCheck, title: 'Pedido de prueba', body: copy.successBody },
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
          Gatrivi.com · demo prospect
        </p>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/45">
          <div className="flex h-full w-full max-w-md flex-col bg-[#F4F7E8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <h2 className="text-lg font-black">Tu pedido</h2>
              <button type="button" className="text-sm font-bold text-black/45" onClick={() => setCartOpen(false)}>
                Cerrar
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-black/45">Todavía no agregaste productos.</p>
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
                className="flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-black text-white disabled:opacity-40"
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
    </div>
  );
}
