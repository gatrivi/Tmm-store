/**
 * Aguacats — prospect site (Navarro Vial / Zengasoft tier)
 * Landing sections + catálogo con carrito demo.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Star,
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { DemoPlanSwitch } from '../components/DemoPlanSwitch';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { resolveImagesForProduct } from '../utils/imageLoader';
import { playAddToCartSound } from '../utils/sounds';

const FONT = '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif';
const STYLE_ID = 'ac-site-css';

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'empresa', label: 'Empresa' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacto', label: 'Contacto' },
] as const;

const STATS = [
  { n: '800+', label: 'Seguidores IG' },
  { n: 'Mayor', label: 'y menor' },
  { n: 'AMBA', label: 'Zona de envío' },
  { n: '24h', label: 'Respuesta típica' },
] as const;

const SERVICES = [
  { title: 'Palta Hass premium', body: 'Elegí punto de maduración en notas. Caja ~4 kg o mayorista.' },
  { title: 'Combo de la frescura', body: 'Paltas, frutillas y miel pura de campo — el más pedido.' },
  { title: 'Complementos', body: 'Frutillas, miel de campo y aceite de oliva para armar pedido.' },
  { title: 'Envío y retiro', body: 'Zona Norte y CABA. Coordinás horario en notas del pedido.' },
] as const;

const PRODUCTS = '/demos/aguacats/products';

const PORTFOLIO = [
  { src: `${PRODUCTS}/palta-hass.jpg`, label: 'Palta Hass' },
  { src: `${PRODUCTS}/combo-frescura.jpg`, label: 'Combo frescura' },
  { src: `${PRODUCTS}/frutillas.jpg`, label: 'Frutillas' },
  { src: `${PRODUCTS}/miel.jpg`, label: 'Miel de campo' },
  { src: `${PRODUCTS}/aceite.jpg`, label: 'Aceite oliva' },
] as const;

const TESTIMONIALS = [
  { quote: 'Pedido mayorista claro, sin audios de tres minutos. Confirmaron stock y entrega el mismo día.', who: 'Foodservice · Vicente López' },
  { quote: 'Combo armado para el local: paltas en punto y complementos listos. Cero vueltas.', who: 'Cafetería · San Isidro' },
  { quote: 'Delivery puntual en Zona Norte. El pedido web llega ordenado al WhatsApp.', who: 'Restaurante · Olivos' },
] as const;

const FAQS = [
  { q: '¿Cómo pido mayorista?', a: 'Armá el carrito con cajas mayoristas o escribinos por WhatsApp. Confirmamos stock y cobertura antes de preparar.' },
  { q: '¿Zona de entrega?', a: 'Zona Norte y CABA. En el checkout ingresás dirección; en producción te confirmamos costo y ventana.' },
  { q: '¿Maduración de paltas?', a: 'Indicá en notas si las querés para hoy, fin de semana o para madurar. Ajustamos según disponibilidad.' },
  { q: '¿Medios de pago?', a: 'Efectivo al recibir o transferencia al confirmar. Demo: simulación sin cobro real.' },
] as const;

const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.ac-site { font-family: ${FONT}; }
.ac-eyebrow { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; }
`;

type CartLine = { id: string; name: string; optionId: string; optionLabel: string; price: number; qty: number };
type CardState = Record<string, { optionId: string; qty: number }>;

function formatArs(n: number) {
  return `$${n.toLocaleString('es-AR')}`;
}

function itemImg(item: MenuItemType): string {
  const r = resolveImagesForProduct(item);
  return r[0] ?? '/demos/aguacats/frescura.jpg';
}

function itemImgPos(_item: MenuItemType, _src: string): string {
  return 'center center';
}

function ProductShot({ item, className = 'aspect-[16/10]' }: { item: MenuItemType; className?: string }) {
  const src = itemImg(item);
  const pos = itemImgPos(item, src);
  return (
    <div className={`ac-prod-shot overflow-hidden bg-[#D4E4C4] ${className}`}>
      <img src={src} alt={item.name} className="h-full w-full object-cover" style={{ objectPosition: pos }} loading="lazy" />
    </div>
  );
}

export default function AguacatsDemoPage() {
  const { menuItems, siteSettings } = useMenu();
  const { tenantId, features } = usePlan();
  const { setTheme } = useTheme();
  const canOrder = features.canOrder;
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;
  const accent = siteSettings.brandAccent || '#C4A035';
  const wsp = siteSettings.whatsappNumber;

  const inicioRef = useRef<HTMLElement>(null);
  const catalogoRef = useRef<HTMLElement>(null);
  const empresaRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);
  const refs = { inicio: inicioRef, catalogo: catalogoRef, empresa: empresaRef, faq: faqRef, contacto: contactoRef };

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try { const raw = localStorage.getItem(cartKey); if (raw) return JSON.parse(raw); } catch { /* */ }
    return [];
  });
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [cardState, setCardState] = useState<CardState>({});

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Aguacats'} — Distribución de paltas`;
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement('style');
      el.id = STYLE_ID;
      el.textContent = PAGE_CSS;
      document.head.appendChild(el);
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setTheme, siteSettings.brandName]);

  useEffect(() => { try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch { /* */ } }, [cart, cartKey]);

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

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const waHref = wsp ? `https://wa.me/${wsp}?text=${encodeURIComponent('Hola Aguacats! Quiero armar un pedido.')}` : undefined;

  const addLine = (item: MenuItemType, option: MenuOption, qty: number) => {
    if (!option || qty < 1) return;
    playAddToCartSound();
    setCart(prev => {
      const i = prev.findIndex(l => l.id === item.id && l.optionId === option.id);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { id: item.id, name: item.name, optionId: option.id, optionLabel: option.label, price: option.price, qty }];
    });
  };

  const scrollTo = (id: typeof NAV[number]['id']) => {
    refs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setNavOpen(false);
  };

  if (!demo || !theme || !copy) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F4F7E8]">Demo no configurada.</div>;
  }

  return (
    <div className="ac-site min-h-screen bg-white text-[#1A2E14]" data-demo-page="aguacats-site">
      <DemoPlanSwitch />
      <DemoRibbon />
      <header
        className={`sticky top-0 z-40 border-b transition ${scrolled ? 'border-black/8 bg-white/95 shadow-sm backdrop-blur-md' : 'border-transparent bg-white'}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button type="button" onClick={() => scrollTo('inicio')} className="flex items-center gap-2.5 text-left">
            <img src={siteSettings.brandLogo} alt="" className="h-10 w-10 rounded-full border border-black/8 object-cover" />
            <span className="text-base font-extrabold tracking-tight" style={{ color: theme.bordo }}>{siteSettings.brandName}</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(n => (
              <button key={n.id} type="button" onClick={() => scrollTo(n.id)} className="rounded-lg px-3 py-2 text-xs font-bold text-black/55 hover:bg-black/4 hover:text-black">
                {n.label}
              </button>
            ))}
          </nav>
            <div className="flex items-center gap-2">
              {canOrder && (
                <button type="button" onClick={() => setCartOpen(true)} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: theme.bordo }} aria-label="Carrito">
                  <ShoppingCart size={18} />
                  {cartCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C4A035] px-1 text-[10px] font-black">{cartCount}</span>}
                </button>
              )}
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="hidden min-h-10 items-center gap-1.5 rounded-xl px-4 text-xs font-extrabold text-[#1A2E14] sm:flex" style={{ backgroundColor: accent }}>
                <MessageCircle size={16} /> Cotizar
              </a>
            )}
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 md:hidden" onClick={() => setNavOpen(v => !v)} aria-label="Menú">
              <ChevronDown size={18} className={`transition ${navOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t border-black/6 px-4 py-2 md:hidden">
            {NAV.map(n => (
              <button key={n.id} type="button" onClick={() => scrollTo(n.id)} className="block w-full py-2.5 text-left text-sm font-bold">{n.label}</button>
            ))}
          </div>
        )}
      </header>

      <section ref={inicioRef} className="relative isolate min-h-[min(88vh,720px)] flex items-center overflow-hidden scroll-mt-16">
        <img src={demo.heroImage || '/demos/aguacats/frescura.jpg'} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: demo.heroObjectPosition || 'center 40%' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2E14]/92 via-[#1A2E14]/70 to-[#1A2E14]/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="ac-eyebrow text-white/60">Distribución de paltas · AMBA</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">{copy.heroTitle}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/88 sm:text-lg">{copy.heroBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo('catalogo')} className="min-h-12 rounded-xl px-6 text-sm font-extrabold text-[#1A2E14]" style={{ backgroundColor: accent }}>Ver catálogo</button>
            {waHref && <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-bold text-white backdrop-blur-sm"><MessageCircle size={18} /> WhatsApp</a>}
          </div>
        </div>
      </section>

      <section className="border-b border-black/6 bg-[#F4F7E8]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="text-3xl font-extrabold tracking-tight" style={{ color: theme.bordo }}>{s.n}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-black/45">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={empresaRef} className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ac-eyebrow text-black/40">Empresa</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Solidez en frescos para foodservice y hogar</h2>
            <p className="mt-4 text-base leading-relaxed text-black/60">
              Aguacats distribuye paltas premium y complementos en AMBA. Mayor y menor, con pedido armado por web o WhatsApp y confirmación antes de preparar.
            </p>
            <p className="mt-3 text-base leading-relaxed text-black/60">
              Energía vital, alimentación saludable — la línea que ya conocés en @aguacats21, ahora con canal de pedidos ordenado.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-semibold text-black/70">
              {copy.chips.map(c => <li key={c}>✓ {c}</li>)}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PORTFOLIO.slice(0, 4).map(p => (
              <div key={`${p.src}-${p.label}`} className="ac-prod-shot overflow-hidden rounded-2xl border border-black/8">
                <img src={p.src} alt={p.label} className="aspect-square w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1A2E14] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="ac-eyebrow text-white/45">Capacidades</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Servicios de calidad</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {SERVICES.map(s => (
              <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-extrabold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollTo('catalogo')} className="min-h-11 rounded-xl px-5 text-sm font-extrabold text-[#1A2E14]" style={{ backgroundColor: accent }}>Armar pedido</button>
            {waHref && <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-5 text-sm font-bold">Consultar por WhatsApp</a>}
          </div>
        </div>
      </section>

      <section ref={catalogoRef} className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="ac-eyebrow text-black/40">Catálogo</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pedí con precio visible</h2>
          <p className="mt-2 text-sm text-black/50">{copy.totalHint}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {menuItems.map(item => {
              const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
              const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
              return (
                <article key={item.id} className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
                  <ProductShot item={item} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-extrabold">{item.name}</h3>
                      {item.badge && <span className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#1A2E14]" style={{ backgroundColor: accent }}>{item.badge}</span>}
                    </div>
                    <p className="mt-1 text-sm text-black/50">{item.description}</p>
                    <p className="mt-2 text-xl font-extrabold" style={{ color: theme.bordo }}>{option ? formatArs(option.price) : ''}</p>
                    {item.options.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.options.map(opt => {
                          const on = state.optionId === opt.id;
                          return (
                            <button key={opt.id} type="button" onClick={() => setCardState(p => ({ ...p, [item.id]: { optionId: opt.id, qty: p[item.id]?.qty ?? 1 } }))} className={`rounded-full border px-3 py-1.5 text-[11px] font-bold ${on ? 'border-transparent text-white' : 'border-black/10 text-black/55'}`} style={on ? { backgroundColor: theme.bordo } : undefined}>{opt.label}</button>
                          );
                        })}
                      </div>
                    )}
                    {canOrder ? (
                      <div className="mt-4 flex gap-2">
                        <div className="flex items-center rounded-xl border border-black/10">
                          <button type="button" className="flex h-10 w-9 items-center justify-center" onClick={() => setCardState(p => ({ ...p, [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) } }))}><Minus size={14} /></button>
                          <span className="w-8 text-center text-sm font-extrabold">{state.qty}</span>
                          <button type="button" className="flex h-10 w-9 items-center justify-center" onClick={() => setCardState(p => ({ ...p, [item.id]: { optionId: state.optionId, qty: state.qty + 1 } }))}><Plus size={14} /></button>
                        </div>
                        <button type="button" onClick={() => option && addLine(item, option, state.qty)} className="flex-1 min-h-10 rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: theme.bordo }}>Agregar</button>
                      </div>
                    ) : waHref ? (
                      <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-4 flex min-h-10 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold" style={{ borderColor: theme.bordo, color: theme.bordo }}>
                        <MessageCircle size={15} /> Consultar por WhatsApp
                      </a>
                    ) : (
                      <span title="En la tienda real este botón abre el WhatsApp del local" className="mt-4 flex min-h-10 cursor-default items-center justify-center rounded-xl border border-black/10 text-sm font-extrabold text-black/40">Consultar por WhatsApp</span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-black/6 bg-[#F4F7E8] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="ac-eyebrow text-black/40">En el terreno</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Producto real · marca visible</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PORTFOLIO.map(p => (
              <div key={`${p.label}-${p.src}`} className="group ac-prod-shot overflow-hidden rounded-2xl border border-black/8 bg-white">
                <img src={p.src} alt={p.label} className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]" loading="lazy" />
                <p className="px-3 py-2 text-xs font-bold text-black/50">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="ac-eyebrow text-black/40">Confianza operativa</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Lo que dicen quienes compran</h2>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-black/8 bg-[#F4F7E8] px-4 py-2">
              <Star size={18} className="fill-[#C4A035] text-[#C4A035]" />
              <span className="text-lg font-extrabold">4.9</span>
              <span className="text-xs font-bold text-black/45">/ 5 · demo</span>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map(t => (
              <blockquote key={t.who} className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
                <p className="text-sm leading-relaxed text-black/70">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-xs font-bold text-black/45">{t.who}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section ref={faqRef} className="scroll-mt-20 border-t border-black/6 bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="ac-eyebrow text-black/40">FAQ</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Preguntas frecuentes</h2>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10">
            {FAQS.map(f => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold">{f.q}<span className="text-2xl font-light transition group-open:rotate-45">+</span></summary>
                <p className="pt-3 text-sm leading-relaxed text-black/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section ref={contactoRef} className="scroll-mt-20 bg-[#1A2E14] py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="ac-eyebrow text-white/45">Contacto</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Pedí tu cotización</h2>
          <p className="mt-3 max-w-lg text-sm text-white/65">Te asesoramos sin compromiso. WhatsApp, teléfono o pedido web.</p>
          <ul className="mt-8 space-y-4 text-sm font-bold">
            {wsp && <li className="flex items-center gap-3"><MessageCircle size={18} style={{ color: accent }} /><a href={waHref} className="hover:underline">WhatsApp directo</a></li>}
            {wsp && <li className="flex items-center gap-3"><Phone size={18} style={{ color: accent }} /><span>+54 11 7139-5174</span></li>}
            <li className="flex items-center gap-3"><span style={{ color: accent }}>@</span><a href={`https://instagram.com/${siteSettings.brandInstagram}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{siteSettings.brandInstagram}</a></li>
          </ul>
          <button type="button" onClick={() => scrollTo('catalogo')} className="mt-8 min-h-12 rounded-xl px-6 text-sm font-extrabold text-[#1A2E14]" style={{ backgroundColor: accent }}>Armar pedido de prueba</button>
        </div>
      </section>

      <footer className="border-t border-black/6 py-8 text-center text-[11px] font-semibold text-black/40">
        {siteSettings.brandName} · demo Gatrivi.com · {copy.ribbonLabel}
      </footer>

      {canOrder && cartCount > 0 && !cartOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/8 bg-white p-3 shadow-lg md:hidden">
          <button type="button" onClick={() => setCartOpen(true)} className="flex w-full min-h-12 items-center justify-between rounded-xl px-5 text-sm font-extrabold text-white" style={{ backgroundColor: theme.bordo }}>
            <span>Ver pedido ({cartCount})</span><span>{formatArs(cartTotal)}</span>
          </button>
        </div>
      )}

      {canOrder && cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-extrabold">Tu pedido</h2>
              <button type="button" className="text-sm font-bold text-black/45" onClick={() => setCartOpen(false)}>Cerrar</button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? <p className="text-sm text-black/45">Catálogo vacío.</p> : cart.map((line, idx) => (
                <div key={`${line.id}-${line.optionId}`} className="flex justify-between gap-3 border-b border-black/6 pb-3">
                  <div><p className="text-sm font-bold">{line.qty} × {line.name}</p><p className="text-xs text-black/45">{line.optionLabel}</p><p className="mt-1 text-sm font-extrabold" style={{ color: theme.bordo }}>{formatArs(line.price * line.qty)}</p></div>
                  <div className="flex gap-1">
                    <button type="button" className="rounded border p-1.5" onClick={() => setCart(prev => prev.map((l, i) => i === idx ? { ...l, qty: l.qty - 1 } : l).filter(l => l.qty > 0))}><Minus size={14} /></button>
                    <button type="button" className="rounded border p-1.5" onClick={() => setCart(prev => prev.map((l, i) => i === idx ? { ...l, qty: l.qty + 1 } : l))}><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-5">
              <div className="mb-1 flex justify-between text-lg font-extrabold"><span>{copy.totalLabel}</span><span>{formatArs(cartTotal)}</span></div>
              <p className="mb-4 text-xs text-black/45">{copy.totalHint}</p>
              <button type="button" disabled={!cart.length} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="flex min-h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold text-white disabled:opacity-40" style={{ backgroundColor: theme.bordo }}>{copy.cartCta}</button>
            </div>
          </div>
        </div>
      )}

      {canOrder && (
        <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} cart={cart} total={cartTotal} subtotal={cartTotal} discount={0} whatsappNumber="" bankAlias="" mpEnabled={features.canUseMercadoPago} initialDeliveryType={fulfillment} onOrderSent={() => setCart([])} />
      )}
    </div>
  );
}
