/**
 * Aguacats — dedicated prospect storefront (foodservice)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MessageCircle,
  Minus,
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
import { resolveImagesForProduct } from '../utils/imageLoader';
import { playAddToCartSound } from '../utils/sounds';

const FONT = '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif';
const STYLE_ID = 'ac-demo-css';

const PRODUCT_FALLBACK: Record<string, string> = {
  'palta-hass': '/demos/aguacats/scraped/ig_05.jpg',
  'combo-frescura': '/demos/aguacats/frescura.jpg',
  frutillas: '/demos/aguacats/frutillas.jpg',
  miel: '/demos/aguacats/miel.jpg',
  'aceite-oliva': '/demos/aguacats/aceite.jpg',
};

const IG_SHOTS = [
  '/demos/aguacats/scraped/ig_04.jpg',
  '/demos/aguacats/scraped/ig_08.jpg',
  '/demos/aguacats/scraped/ig_12.jpg',
  '/demos/aguacats/scraped/ig_01.jpg',
] as const;

const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.ac-page { font-family: ${FONT}; }
.ac-hero { min-height: min(72vh, 640px); }
.ac-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.ac-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(26,46,20,0.12); }
@media (prefers-reduced-motion: reduce) { .ac-card:hover { transform: none; } }
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

function itemImage(item: MenuItemType): string {
  const resolved = resolveImagesForProduct(item);
  return resolved[0] ?? PRODUCT_FALLBACK[item.id] ?? '/demos/aguacats/frescura.jpg';
}

function priceFrom(item: MenuItemType, optionId: string): number {
  return item.options.find(o => o.id === optionId)?.price ?? item.options[0]?.price ?? 0;
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
  const wsp = siteSettings.whatsappNumber;

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
    document.title = `${siteSettings.brandName || 'Aguacats'} — Pedidos`;
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = PAGE_CSS;
      document.head.appendChild(el);
    }
    let link = document.querySelector('link[data-ac-font]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap';
      link.setAttribute('data-ac-font', '1');
      document.head.appendChild(link);
    }
  }, [setTheme, siteSettings.brandName]);

  useEffect(() => {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* ignore */ }
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

  const featured = useMemo(() => menuItems.find(i => i.id === 'combo-frescura'), [menuItems]);
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price * l.qty, 0);

  const addLine = (item: MenuItemType, option: MenuOption, qty: number) => {
    if (!option || qty < 1) return;
    playAddToCartSound();
    setCart(prev => {
      const idx = prev.findIndex(l => l.id === item.id && l.optionId === option.id);
      if (idx >= 0) return prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id: item.id, name: item.name, optionId: option.id, optionLabel: option.label, price: option.price, qty }];
    });
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev => prev.map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l)).filter(l => l.qty > 0));
  };

  if (!demo || !theme || !copy) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F4F7E8]">Demo no configurada.</div>;
  }

  const filters = [{ id: 'todos', label: 'Todo' }, ...menuCategories.map(c => ({ id: c.id, label: c.name }))];
  const heroSrc = demo.heroImage || '/demos/aguacats/frescura.jpg';

  return (
    <div className="ac-page min-h-screen bg-white" style={{ color: theme.carbon }} data-demo-page="aguacats-v2">
      <DemoRibbon />

      <header className="sticky top-0 z-30 border-b border-black/6 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img src={siteSettings.brandLogo} alt="" className="h-12 w-12 shrink-0 rounded-full border-2 border-[#3D6B2A]/20 object-cover shadow-sm" />
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold tracking-tight" style={{ color: theme.bordo }}>{siteSettings.brandName}</p>
              <p className="truncate text-[11px] font-semibold text-black/45">{siteSettings.brandAddress}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden rounded-full border border-black/8 bg-[#F4F7E8] p-0.5 text-[11px] font-bold sm:flex">
              {(['delivery', 'pickup'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFulfillment(mode)}
                  className={`min-h-8 rounded-full px-3 transition ${fulfillment === mode ? 'text-white shadow-sm' : 'text-black/50'}`}
                  style={fulfillment === mode ? { backgroundColor: theme.bordo } : undefined}
                >
                  {mode === 'delivery' ? 'Envío' : 'Retiro'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
              style={{ backgroundColor: theme.bordo }}
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4A035] px-1 text-[10px] font-black text-[#1A2E14]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <section className="ac-hero relative isolate flex items-end overflow-hidden">
        <img src={heroSrc} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: demo.heroObjectPosition || 'center 40%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2E14] via-[#1A2E14]/55 to-[#1A2E14]/25" />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 sm:pb-14">
          <div className="flex flex-wrap gap-2">
            {copy.chips.map(chip => (
              <span key={chip} className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1A2E14]" style={{ backgroundColor: accent }}>
                {chip}
              </span>
            ))}
          </div>
          <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl sm:leading-[1.05]">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">{copy.heroBody}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => catalogRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="min-h-12 rounded-xl px-6 text-sm font-extrabold text-[#1A2E14] shadow-lg"
              style={{ backgroundColor: accent }}
            >
              Ver catálogo
            </button>
            {wsp && (
              <a
                href={`https://wa.me/${wsp}?text=${encodeURIComponent('Hola Aguacats! Quiero armar un pedido.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-sm"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="border-b border-black/6 bg-[#F4F7E8]">
        <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 py-3 text-[11px] font-bold text-black/55 sm:px-6 sm:text-xs">
          <span className="flex shrink-0 items-center gap-1.5"><Truck size={14} style={{ color: theme.bordo }} /> Zona Norte y CABA</span>
          <span className="flex shrink-0 items-center gap-1.5"><ShoppingBag size={14} style={{ color: theme.bordo }} /> Mayor y menor</span>
          <span className="flex shrink-0 items-center gap-1.5"><ShieldCheck size={14} style={{ color: theme.bordo }} /> Pedido armado · sin audios</span>
        </div>
      </div>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-[#1A2E14] shadow-xl sm:flex">
            <div className="sm:w-1/2">
              <img src={itemImage(featured)} alt={featured.name} className="h-56 w-full object-cover sm:h-full sm:min-h-[280px]" />
            </div>
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
              <span className="w-fit rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#1A2E14]" style={{ backgroundColor: accent }}>
                {featured.badge}
              </span>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{featured.name}</h2>
              <p className="text-sm leading-relaxed text-white/75">{featured.description}</p>
              <p className="text-2xl font-extrabold" style={{ color: accent }}>{formatArs(featured.options[0]?.price ?? 0)}</p>
              <button
                type="button"
                onClick={() => { const o = featured.options[0]; if (o) { addLine(featured, o, 1); setCartOpen(true); } }}
                className="w-fit min-h-11 rounded-xl px-6 text-sm font-extrabold text-[#1A2E14]"
                style={{ backgroundColor: accent }}
              >
                Agregar combo
              </button>
            </div>
          </div>
        </section>
      )}

      <nav className="sticky top-[65px] z-20 border-b border-black/6 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
          {filters.map(f => {
            const on = categoryId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategoryId(f.id)}
                className={`shrink-0 border-b-2 px-4 py-3.5 text-xs font-extrabold uppercase tracking-wide transition ${on ? '' : 'border-transparent text-black/35'}`}
                style={on ? { borderColor: theme.bordo, color: theme.bordo } : undefined}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </nav>

      <main ref={catalogRef} className="mx-auto max-w-6xl scroll-mt-32 px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {visibleItems.map(item => {
            const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
            const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
            const img = itemImage(item);
            const price = option ? option.price : priceFrom(item, state.optionId);

            return (
              <article key={item.id} className="ac-card flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#D4E4C4]">
                  <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#1A2E14] shadow" style={{ backgroundColor: accent }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight">{item.name}</h2>
                    <p className="mt-1 text-sm text-black/50">{item.description}</p>
                    <p className="mt-2 text-xl font-extrabold" style={{ color: theme.bordo }}>{formatArs(price)}</p>
                  </div>
                  {item.options.length > 1 && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.options.map(opt => {
                        const on = state.optionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCardState(p => ({ ...p, [item.id]: { ...p[item.id], optionId: opt.id, qty: p[item.id]?.qty ?? 1 } }))}
                            className={`min-h-9 rounded-full border px-3 text-[11px] font-bold transition ${on ? 'border-transparent text-white' : 'border-black/10 text-black/55'}`}
                            style={on ? { backgroundColor: theme.bordo } : undefined}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex items-center rounded-xl border border-black/10">
                      <button type="button" aria-label="Menos" className="flex h-10 w-9 items-center justify-center" onClick={() => setCardState(p => ({ ...p, [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) } }))}>
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold">{state.qty}</span>
                      <button type="button" aria-label="Más" className="flex h-10 w-9 items-center justify-center" onClick={() => setCardState(p => ({ ...p, [item.id]: { optionId: state.optionId, qty: state.qty + 1 } }))}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => option && addLine(item, option, state.qty)}
                      className="flex min-h-10 flex-1 items-center justify-center rounded-xl text-sm font-extrabold text-white"
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

      <section className="border-t border-black/6 bg-[#F4F7E8] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/40">Instagram</p>
          <h2 className="mt-1 text-xl font-extrabold" style={{ color: theme.bordo }}>@{siteSettings.brandInstagram}</h2>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {IG_SHOTS.map(src => (
              <div key={src} className="aspect-square overflow-hidden rounded-2xl border border-black/6 shadow-sm">
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-black/6 bg-white px-4 py-8 text-center text-[11px] font-semibold text-black/40 sm:px-6">
        {copy.totalHint}
      </footer>

      {cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/8 bg-white p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] sm:hidden">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex w-full min-h-12 items-center justify-between rounded-xl px-5 text-sm font-extrabold text-white"
            style={{ backgroundColor: theme.bordo }}
          >
            <span>Ver pedido ({cartCount})</span>
            <span>{formatArs(cartTotal)}</span>
          </button>
        </div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/50">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-extrabold">Tu pedido</h2>
              <button type="button" className="text-sm font-bold text-black/45" onClick={() => setCartOpen(false)}>Cerrar</button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-black/45">Agregá productos del catálogo.</p>
              ) : cart.map((line, idx) => (
                <div key={`${line.id}-${line.optionId}`} className="flex justify-between gap-3 border-b border-black/6 pb-3">
                  <div>
                    <p className="text-sm font-bold">{line.qty} × {line.name}</p>
                    <p className="text-xs text-black/45">{line.optionLabel}</p>
                    <p className="mt-1 text-sm font-extrabold" style={{ color: theme.bordo }}>{formatArs(line.price * line.qty)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="rounded-lg border p-1.5" onClick={() => updateCartQty(idx, -1)}><Minus size={14} /></button>
                    <button type="button" className="rounded-lg border p-1.5" onClick={() => updateCartQty(idx, 1)}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-5">
              <div className="mb-1 flex justify-between text-lg font-extrabold">
                <span>{copy.totalLabel}</span><span>{formatArs(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-black/45">{copy.totalHint}</p>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold text-white disabled:opacity-40"
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
