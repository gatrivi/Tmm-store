import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingCart,
  Store,
  Truck,
  X,
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { DemoPlanSwitch } from '../components/DemoPlanSwitch';
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

const formatArs = (value: number) => `$${value.toLocaleString('es-AR')}`;

export default function FerreteriaDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId, features } = usePlan();
  const canOrder = features.canOrder;
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;
  const cartKey = `trufi_cart:${tenantId}`;

  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('todos');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('pickup');
  const [cardState, setCardState] = useState<CardState>({});
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* demo cart can start empty */ }
    return [];
  });

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Ferretería'} — Gatrivi.com`;
  }, [setTheme, siteSettings.brandName]);

  useEffect(() => {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* ignore */ }
  }, [cart, cartKey]);

  useEffect(() => {
    if (!menuItems.length) return;
    setCardState(prev => {
      const next = { ...prev };
      menuItems.forEach(item => {
        if (!next[item.id]) next[item.id] = { optionId: item.options[0]?.id ?? '', qty: 1 };
      });
      return next;
    });
  }, [menuItems]);

  const visibleItems = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('es');
    return menuItems.filter(item => {
      const categoryOk = categoryId === 'todos' || item.category === categoryId;
      const queryOk = !q || `${item.name} ${item.description}`.toLocaleLowerCase('es').includes(q);
      return categoryOk && queryOk;
    });
  }, [menuItems, categoryId, query]);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  const addLine = (item: MenuItemType, option: MenuOption, qty: number) => {
    playAddToCartSound();
    setCart(prev => {
      const index = prev.findIndex(line => line.id === item.id && line.optionId === option.id);
      if (index >= 0) {
        return prev.map((line, i) => (i === index ? { ...line, qty: line.qty + qty } : line));
      }
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
    setCart(prev => prev
      .map((line, i) => (i === index ? { ...line, qty: line.qty + delta } : line))
      .filter(line => line.qty > 0));
  };

  if (!demo || !theme || !copy) {
    return <div className="flex min-h-screen items-center justify-center bg-[#efede5]">Demo no configurada.</div>;
  }

  return (
    <div
      className="min-h-screen bg-[#efede5] text-[#181818]"
      style={{
        backgroundImage: "linear-gradient(rgba(242,239,230,.91), rgba(242,239,230,.96)), url('/demos/ferreteria/bg.svg')",
        backgroundSize: '520px auto',
        backgroundAttachment: 'fixed',
      }}
      data-demo-theme="ferreteria"
    >
      <DemoPlanSwitch />
      <DemoRibbon />
      <header className="sticky top-0 z-30 border-b border-black/10 bg-[#f6f3ea]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={siteSettings.brandLogo || '/demos/ferreteria/logo.svg'}
              alt="Logo Ferretería Norte"
              className="h-11 w-11 shrink-0 rounded-xl border border-black/10 bg-[#181818] object-contain shadow-sm"
            />
            <div className="min-w-0">
              <p className="truncate text-lg font-black tracking-[-0.035em]">{siteSettings.brandName}</p>
              <p className="truncate text-[11px] font-bold uppercase tracking-[0.1em] text-black/45">
                {siteSettings.brandAddress}
              </p>
            </div>
          </div>

          {canOrder && (
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#181818] px-3.5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              <ShoppingCart size={17} />
              <span className="hidden sm:inline">{cartCount ? formatArs(cartTotal) : 'Pedido'}</span>
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F4C430] px-1 text-[10px] font-black text-black">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      <section className="relative isolate min-h-[420px] overflow-hidden border-b border-black/10 sm:min-h-[500px]">
        <img
          src={demo.heroImage || '/demos/ferreteria/hero.svg'}
          alt="Banco de trabajo y herramientas de Ferretería Norte"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: demo.heroObjectPosition || 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/15" />
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl items-center px-4 py-14 sm:min-h-[500px] sm:px-6">
          <div className="max-w-2xl text-white">
            <div className="mb-5 flex items-center gap-3">
              <img src="/demos/ferreteria/logo.svg" alt="" className="h-14 w-14 rounded-2xl border border-white/15 shadow-xl" />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F4C430]">Ferretería · catálogo + pedidos</p>
            </div>
            <h1 className="max-w-xl text-[clamp(2.8rem,7vw,5.4rem)] font-black leading-[0.88] tracking-[-0.065em]">
              {copy.heroTitle}
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-relaxed text-white/72 sm:text-lg">{copy.heroBody}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {copy.chips.map(chip => (
                <span key={chip} className="rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.08em]">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/10 bg-[#181818] text-white">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 text-xs font-bold sm:grid-cols-3 sm:px-6">
          <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#F4C430]" /> Medidas y variantes claras</p>
          <p className="flex items-center gap-2"><Truck size={16} className="text-[#F4C430]" /> Retiro o envío</p>
          <p className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#F4C430]" /> Pedido demo, sin cobro real</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12">
        <div className="mb-7 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative block">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Buscar taladro, pintura, tornillos…"
              className="min-h-12 w-full rounded-xl border border-black/12 bg-white/90 pl-11 pr-10 text-sm font-bold outline-none transition focus:border-black/35"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40" aria-label="Limpiar búsqueda">
                <X size={17} />
              </button>
            )}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            {[{ id: 'todos', name: 'Todo' }, ...menuCategories].map(category => {
              const active = categoryId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setCategoryId(category.id)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black transition ${active ? 'bg-[#181818] text-white' : 'border border-black/10 bg-white/80 text-black/55 hover:text-black'}`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleItems.map(item => {
            const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
            const option = item.options.find(candidate => candidate.id === state.optionId) ?? item.options[0];
            const image = item.images[0];
            return (
              <article key={item.id} className="group flex flex-col overflow-hidden rounded-[1.35rem] border border-black/10 bg-[#fffdf8] shadow-[0_12px_30px_rgba(24,24,24,.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(24,24,24,.12)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ded9cc]">
                  <img src={image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#F4C430] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-black shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-base font-black tracking-[-0.025em]">{item.name}</h2>
                  <p className="mt-1 min-h-10 text-xs font-medium leading-relaxed text-black/50">{item.description}</p>
                  <p className="mt-3 text-xl font-black">{option ? formatArs(option.price) : ''}</p>

                  {item.options.length > 1 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.options.map(candidate => {
                        const active = candidate.id === state.optionId;
                        return (
                          <button
                            key={candidate.id}
                            type="button"
                            onClick={() => setCardState(prev => ({ ...prev, [item.id]: { optionId: candidate.id, qty: prev[item.id]?.qty ?? 1 } }))}
                            className={`min-h-8 rounded-full border px-2.5 text-[10px] font-black ${active ? 'border-[#181818] bg-[#181818] text-white' : 'border-black/12 bg-white text-black/55'}`}
                          >
                            {candidate.label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.08em] text-black/35">{option?.label}</p>
                  )}

                  {canOrder ? (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex items-center rounded-lg border border-black/12 bg-white">
                        <button type="button" aria-label="Restar" className="flex h-10 w-8 items-center justify-center" onClick={() => setCardState(prev => ({ ...prev, [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) } }))}>
                          <Minus size={13} />
                        </button>
                        <span className="w-6 text-center text-xs font-black">{state.qty}</span>
                        <button type="button" aria-label="Sumar" className="flex h-10 w-8 items-center justify-center" onClick={() => setCardState(prev => ({ ...prev, [item.id]: { optionId: state.optionId, qty: state.qty + 1 } }))}>
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={!option}
                        onClick={() => option && addLine(item, option, state.qty)}
                        className="min-h-10 flex-1 rounded-lg bg-[#DCA600] px-3 text-xs font-black text-black transition hover:bg-[#F4C430] disabled:opacity-40"
                      >
                        Agregar
                      </button>
                    </div>
                  ) : (
                    <span title="En la tienda real este botón abre el WhatsApp del local" className="mt-4 flex min-h-10 cursor-default items-center justify-center rounded-lg border border-black/12 text-xs font-black text-black/40">
                      Consultar por WhatsApp
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {visibleItems.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/20 bg-white/75 px-6 py-14 text-center">
            <p className="font-black">No encontramos ese producto.</p>
            <button type="button" onClick={() => { setQuery(''); setCategoryId('todos'); }} className="mt-3 text-sm font-black underline">Ver todo</button>
          </div>
        )}
      </main>

      <footer className="border-t border-black/10 bg-[#181818] text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-9 sm:grid-cols-3 sm:px-6">
          <div><Store size={20} className="text-[#F4C430]" /><p className="mt-3 font-black">Retiro simple</p><p className="mt-1 text-sm text-white/55">Armá todo antes de pasar por el local.</p></div>
          <div><Truck size={20} className="text-[#F4C430]" /><p className="mt-3 font-black">Envío coordinado</p><p className="mt-1 text-sm text-white/55">Zona y costo se confirman antes de cerrar.</p></div>
          <div><ShieldCheck size={20} className="text-[#F4C430]" /><p className="mt-3 font-black">Sin confusiones</p><p className="mt-1 text-sm text-white/55">Producto, medida y cantidad quedan escritos.</p></div>
        </div>
      </footer>

      {canOrder && cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/55">
          <div className="flex h-full w-full max-w-md flex-col bg-[#fffdf8] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div><p className="text-lg font-black">Tu pedido</p><p className="text-xs font-bold text-black/40">{cartCount} productos</p></div>
              <button type="button" onClick={() => setCartOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5" aria-label="Cerrar carrito"><X size={18} /></button>
            </div>

            <div className="border-b border-black/8 p-4">
              <div className="flex rounded-xl border border-black/10 bg-[#f2efe6] p-1 text-xs font-black">
                <button type="button" onClick={() => setFulfillment('pickup')} className={`flex min-h-9 flex-1 items-center justify-center rounded-lg ${fulfillment === 'pickup' ? 'bg-[#181818] text-white' : 'text-black/50'}`}>Retiro</button>
                <button type="button" onClick={() => setFulfillment('delivery')} className={`flex min-h-9 flex-1 items-center justify-center rounded-lg ${fulfillment === 'delivery' ? 'bg-[#181818] text-white' : 'text-black/50'}`}>Envío</button>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm font-medium text-black/45">Todavía no agregaste productos.</p>
              ) : cart.map((line, index) => (
                <div key={`${line.id}-${line.optionId}`} className="flex items-start justify-between gap-3 border-b border-black/8 pb-4">
                  <div><p className="text-sm font-black">{line.name}</p><p className="mt-1 text-xs text-black/45">{line.optionLabel} · {formatArs(line.price)}</p></div>
                  <div className="flex items-center gap-1 rounded-lg border border-black/10 bg-white p-1">
                    <button type="button" onClick={() => updateCartQty(index, -1)} className="p-1"><Minus size={13} /></button>
                    <span className="w-5 text-center text-xs font-black">{line.qty}</span>
                    <button type="button" onClick={() => updateCartQty(index, 1)} className="p-1"><Plus size={13} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 p-5">
              <div className="mb-4 flex items-end justify-between"><span className="text-xs font-black uppercase tracking-[0.08em] text-black/40">Total</span><span className="text-2xl font-black">{formatArs(cartTotal)}</span></div>
              <button type="button" disabled={!cart.length} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#DCA600] text-sm font-black text-black disabled:opacity-40">
                {copy.cartCta} <ChevronDown size={16} />
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
          mpEnabled={features.canUseMercadoPago}
          initialDeliveryType={fulfillment}
          onOrderSent={() => setCart([])}
        />
      )}
    </div>
  );
}
