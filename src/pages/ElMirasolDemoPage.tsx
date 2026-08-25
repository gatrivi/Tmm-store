import { useEffect, useMemo, useState } from 'react';
import {
  Flame,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  X,
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { AppVersionStamp } from '../components/AppVersionBadge';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';

type CartLine = {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
};

const SIGNATURE_IDS = ['ojo-bife-em', 'vacio-em', 'picada-em'];

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function ElMirasolDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId, features } = usePlan();
  const canOrder = features.canOrder;
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* ignore */ }
    return [];
  });
  const [selectedCategory, setSelectedCategory] = useState('carnes');
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    document.title = `${siteSettings.brandName || 'El Mirasol'} · Parrilla clásica en Recoleta`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'El Mirasol de La Recova: picadas, tablas y cortes a la parrilla en Recoleta. Carta online con retiro y delivery.',
      );
  }, [siteSettings.brandName]);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, cartKey]);

  const categories = useMemo(
    () => [...menuCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    [menuCategories],
  );

  const visibleItems = useMemo(
    () => menuItems.filter(item => item.category === selectedCategory),
    [menuItems, selectedCategory],
  );

  const signature = useMemo(
    () =>
      SIGNATURE_IDS.map(id => menuItems.find(item => item.id === id)).filter(
        (item): item is MenuItemType => Boolean(item),
      ),
    [menuItems],
  );

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  const addLine = (item: MenuItemType, option: MenuOption | undefined, qty = 1) => {
    if (!option || qty < 1) return;
    setCart(prev => {
      const index = prev.findIndex(line => line.id === item.id && line.optionId === option.id);
      if (index >= 0) return prev.map((line, i) => (i === index ? { ...line, qty: line.qty + qty } : line));
      return [
        ...prev,
        { id: item.id, name: item.name, optionId: option.id, optionLabel: option.label, price: option.price, qty },
      ];
    });
  };


  const changeQty = (index: number, delta: number) => {
    setCart(prev =>
      prev
        .map((line, i) => (i === index ? { ...line, qty: line.qty + delta } : line))
        .filter(line => line.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#241310] text-white">
        Demo no configurada.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0d09] text-[#F6EFE3] selection:bg-[#6E1F24] selection:text-white">
      <DemoRibbon />

      <header className="relative isolate flex min-h-[min(88vh,760px)] items-center overflow-hidden">
        <img
          src={demo.heroImage ?? '/demos/canavesi/hero.jpg'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: demo.heroObjectPosition ?? 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#241310]/95 via-[#241310]/75 to-[#241310]/35" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <img
            src={siteSettings.brandLogo}
            alt=""
            className="mb-6 h-20 w-20 rounded-full border border-[#C29A54]/40"
          />
          <p className="text-xs font-black uppercase tracking-[0.22em]" style={{ color: theme.salvia }}>
            Parrilla clásica · Recoleta · Posadas 1032
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#F6EFE3] sm:text-6xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#F6EFE3]/80 sm:text-lg">
            {copy.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => document.getElementById('carta')?.scrollIntoView({ behavior: 'smooth' })} className="min-h-12 rounded-full px-7 text-sm font-extrabold text-[#F6EFE3]" style={{ backgroundColor: theme.bordo }}>
              Ver la carta
            </button>
            {canOrder && cartCount > 0 && (
              <button type="button" onClick={() => setCartOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#F6EFE3]/25 bg-white/10 px-6 text-sm font-bold text-[#F6EFE3] backdrop-blur-sm">
                <ShoppingBag size={17} /> Tu pedido ({cartCount})
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="border-y border-white/10" style={{ backgroundColor: theme.carbon }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {copy.chips.map(chip => (
            <div key={chip} className="flex items-start gap-2.5 text-sm font-semibold text-[#F6EFE3]/75">
              <Flame size={16} className="mt-0.5 shrink-0" style={{ color: theme.salvia }} />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </section>

      {signature.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: theme.salvia }}>De la casa</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#F6EFE3]">Nuestros cortes premium</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {signature.map(item => {
                const option = item.options[0];
                return (
                  <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/10">
                    <img src={item.images[0]} alt={item.name} loading="lazy" className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                      <h3 className="font-serif text-2xl font-bold text-[#F6EFE3]">{item.name}</h3>
                      <p className="mt-1 text-sm text-[#F6EFE3]/70">{item.description}</p>
                      {option && canOrder && (
                        <button type="button" onClick={() => addLine(item, option)} className="mt-4 min-h-10 rounded-full px-5 text-sm font-extrabold text-[#F6EFE3] transition hover:brightness-110" style={{ backgroundColor: theme.bordo }}>
                          Agregar — {money.format(option.price)}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section id="carta" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: theme.salvia }}>La carta</p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#F6EFE3]">Picadas, parrilla y más</h2>
          <p className="mt-2 text-sm text-[#F6EFE3]/55">{copy.weightNotice}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(category => {
              const active = category.id === selectedCategory;
              return (
                <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} className={`min-h-10 rounded-full px-5 text-sm font-bold transition ${active ? 'text-white' : 'border border-white/15 text-[#F6EFE3]/60 hover:text-[#F6EFE3]'}`} style={active ? { backgroundColor: theme.bordo } : undefined}>
                  {category.name}
                </button>
              );
            })}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map(item => {
              const optionId = picked[item.id] ?? item.options[0]?.id ?? '';
              const option = item.options.find(opt => opt.id === optionId) ?? item.options[0];
              return (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#241310]">
                  <img src={item.images[0]} alt={item.name} loading="lazy" className="h-44 w-full object-cover" />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold text-[#F6EFE3]">{item.name}</h3>
                      {item.badge && (
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#241310]" style={{ backgroundColor: theme.salvia }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-[#F6EFE3]/55">{item.description}</p>
                    {item.options.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.options.map(opt => {
                          const on = opt.id === option?.id;
                          return (
                            <button key={opt.id} type="button" onClick={() => setPicked(prev => ({ ...prev, [item.id]: opt.id }))} className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition ${on ? 'border-transparent text-white' : 'border-white/15 text-[#F6EFE3]/55'}`} style={on ? { backgroundColor: theme.bordo } : undefined}>
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-xl font-extrabold text-[#F6EFE3]">{option ? money.format(option.price) : ''}</span>
                      {canOrder ? (
                        <button type="button" onClick={() => addLine(item, option)} className="min-h-10 rounded-full px-5 text-sm font-extrabold text-[#F6EFE3] transition hover:brightness-110" style={{ backgroundColor: theme.bordo }}>
                          Agregar
                        </button>
                      ) : (
                        <span title="En la tienda real este botón abre el WhatsApp del local" className="inline-flex min-h-10 cursor-default items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm font-bold text-[#F6EFE3]/40">
                          <MessageCircle size={14} /> Consultar
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 text-center" style={{ backgroundColor: theme.carbon }}>
        <img src={siteSettings.brandLogo} alt="" className="mx-auto mb-4 h-14 w-14 rounded-full border border-[#C29A54]/40" />
        <p className="font-serif text-lg font-bold text-[#F6EFE3]">{siteSettings.brandName}</p>
        {!demo.hideAddress && (
          <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-[#F6EFE3]/55">
            <MapPin size={14} /> {siteSettings.brandAddress}
          </p>
        )}
        <p className="mt-3 text-xs font-semibold text-[#F6EFE3]/40">
          Instagram: @elmirasolparrilla (mención de referencia, sin enlace oficial) · Demo Gatrivi.com · {copy.ribbonLabel}
        </p>
      </footer>

      {canOrder && cartCount > 0 && !cartOpen && !checkoutOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#241310]/95 p-3 backdrop-blur md:hidden">
          <button type="button" onClick={() => setCartOpen(true)} className="flex w-full min-h-12 items-center justify-between rounded-full px-5 text-sm font-extrabold text-[#F6EFE3]" style={{ backgroundColor: theme.bordo }}>
            <span>Ver pedido ({cartCount})</span>
            <span>{money.format(cartTotal)}</span>
          </button>
        </div>
      )}

      {canOrder && cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
          <div className="flex h-full w-full max-w-md flex-col bg-[#241310] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="font-serif text-lg font-bold text-[#F6EFE3]">Tu pedido</h2>
              <button type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} className="rounded-lg border border-white/15 p-1.5 text-[#F6EFE3]/60">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-[#F6EFE3]/45">Todavía no agregaste nada.</p>
              ) : (
                cart.map((line, index) => (
                  <div key={`${line.id}-${line.optionId}`} className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <p className="text-sm font-bold text-[#F6EFE3]">{line.qty} × {line.name}</p>
                      <p className="text-xs text-[#F6EFE3]/45">{line.optionLabel}</p>
                      <p className="mt-1 text-sm font-extrabold" style={{ color: theme.salvia }}>{money.format(line.price * line.qty)}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button type="button" aria-label="Quitar uno" onClick={() => changeQty(index, -1)} className="rounded-lg border border-white/15 p-1.5 text-[#F6EFE3]/70">
                        <Minus size={14} />
                      </button>
                      <button type="button" aria-label="Agregar uno" onClick={() => changeQty(index, +1)} className="rounded-lg border border-white/15 p-1.5 text-[#F6EFE3]/70">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-white/10 p-5">
              <div className="mb-1 flex justify-between font-serif text-lg font-bold text-[#F6EFE3]">
                <span>{copy.totalLabel}</span>
                <span>{money.format(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-[#F6EFE3]/45">{copy.totalHint}</p>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
                className="flex min-h-12 w-full items-center justify-center rounded-full text-sm font-extrabold text-[#F6EFE3] disabled:opacity-40"
                style={{ backgroundColor: theme.bordo }}
              >
                {copy.cartCta}
              </button>
            </div>
          </div>
        </div>
      )}

      {canOrder && (
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
          initialDeliveryType="pickup"
          onOrderSent={() => setCart([])}
        />
      )}

      <AppVersionStamp />
    </div>
   );
 }
