/**
 * Editorial storefront — Las Tortas de Mamá Mabel
 * Brand: cream paper, cake-pink, watercolor teal, ink script (logo/flyer).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mail, Minus, Phone, Plus, ShoppingBag, X } from 'lucide-react';
import { AIAssistant } from '../components/AIAssistant';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

const MM = {
  cream: '#FBF6F0',
  blush: '#F7E6EC',
  pink: '#E87890',
  pinkSoft: '#F0C0D8',
  teal: '#70A8A0',
  tealDeep: '#3F6F6A',
  ink: '#1C1714',
  mustard: '#C9A24B',
} as const;

const FONT_SERIF = '"Cormorant Garamond", "Times New Roman", serif';
const FONT_SCRIPT = '"Great Vibes", "Segoe Script", cursive';

const InstagramIcon = ({ size = 18, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

type CartLine = {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
};

type CardState = Record<string, { optionId: string; qty: number }>;

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'tortas', label: 'Encargos' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
] as const;

const GALLERY = [
  '/demos/mamabel/top-03.jpg',
  '/demos/mamabel/top-07.jpg',
  '/demos/mamabel/top-08.jpg',
  '/demos/mamabel/top-01.jpg',
  '/demos/mamabel/ig-10.jpg',
  '/demos/mamabel/curso-egreso.jpg',
];

const STYLE_ID = 'mm-editorial-css';
const EDITORIAL_CSS = `
@keyframes mm-rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mm-ken {
  from { transform: scale(1.06); }
  to { transform: scale(1); }
}
@keyframes mm-drift {
  0%, 100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(12px,-10px,0); }
}
.mm-rise { animation: mm-rise 0.9s ease both; }
.mm-rise-d1 { animation-delay: 0.12s; }
.mm-rise-d2 { animation-delay: 0.24s; }
.mm-rise-d3 { animation-delay: 0.36s; }
.mm-ken { animation: mm-ken 14s ease-out both; }
.mm-drift { animation: mm-drift 16s ease-in-out infinite; }
.mm-paper {
  background-color: ${MM.cream};
  background-image:
    radial-gradient(ellipse 80% 50% at 10% 0%, ${MM.blush}cc, transparent 55%),
    radial-gradient(ellipse 60% 40% at 100% 20%, ${MM.teal}22, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.mm-rule { height: 1px; background: linear-gradient(90deg, transparent, ${MM.teal}66, transparent); }
@media (prefers-reduced-motion: reduce) {
  .mm-rise, .mm-ken, .mm-drift { animation: none !important; }
}
`;

function formatArs(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function priceLabel(item: MenuItemType): string {
  if (item.options.length > 1) return `desde ${formatArs(item.options[0].price)}`;
  return item.options[0] ? formatArs(item.options[0].price) : '';
}

export default function MamabelDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId } = usePlan();
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const copy = demo?.copy;

  const inicioRef = useRef<HTMLElement>(null);
  const nosotrosRef = useRef<HTMLElement>(null);
  const tortasRef = useRef<HTMLElement>(null);
  const cursosRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);
  const sectionRefs = {
    inicio: inicioRef,
    nosotros: nosotrosRef,
    tortas: tortasRef,
    cursos: cursosRef,
    contacto: contactoRef,
  };

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* ignore */ }
    return [];
  });
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('pickup');
  const [categoryId, setCategoryId] = useState('decoradas');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({});
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const shopItems = useMemo(() => menuItems.filter(i => i.category !== 'cursos'), [menuItems]);
  const courseItems = useMemo(() => menuItems.filter(i => i.category === 'cursos'), [menuItems]);
  const shopCategories = useMemo(() => menuCategories.filter(c => c.id !== 'cursos'), [menuCategories]);

  useEffect(() => {
    setTheme('light');
    document.title = 'Las Tortas de Mamá Mabel';
    if (!document.getElementById('mm-fonts')) {
      const link = document.createElement('link');
      link.id = 'mm-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Great+Vibes&display=swap';
      document.head.appendChild(link);
    }
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = EDITORIAL_CSS;
      document.head.appendChild(style);
    }
  }, [setTheme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    if (categoryId === 'todos') return shopItems;
    return shopItems.filter(i => i.category === categoryId);
  }, [shopItems, categoryId]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const wsp = siteSettings.whatsappNumber || '';
  const wspHref = wsp ? `https://wa.me/${wsp}` : undefined;

  const scrollTo = (id: keyof typeof sectionRefs) => {
    setNavOpen(false);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const handleAIAddToCart = (itemId: string, optionId: string, qty: number) => {
    const item = menuItems.find(m => m.id === itemId);
    const option = item?.options.find(o => o.id === optionId);
    if (!item || !option) return;
    addLine(item, option, qty || 1);
    setCartOpen(true);
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev =>
      prev.map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l)).filter(l => l.qty > 0),
    );
  };

  if (!demo || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center mm-paper" style={{ color: MM.ink }}>
        Demo no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todas' },
    ...shopCategories.map(c => ({ id: c.id, label: c.name })),
  ];

  return (
    <div className="mm-paper min-h-screen" style={{ color: MM.ink, fontFamily: FONT_SERIF }} data-demo-theme="mamabel">
      <DemoRibbon />

      {/* Nav — thin, brand-led */}
      <header
        className="fixed inset-x-0 top-0 z-30 transition-colors duration-300"
        style={{
          backgroundColor: scrolled || navOpen ? `${MM.cream}f5` : 'transparent',
          borderBottom: scrolled ? `1px solid ${MM.pinkSoft}55` : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(10px)' : undefined,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <button type="button" onClick={() => scrollTo('inicio')} className="text-left">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.tealDeep }}>
              Las tortas de
            </span>
            <span className="block text-2xl leading-none sm:text-3xl" style={{ fontFamily: FONT_SCRIPT }}>
              mamá mabel
            </span>
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] transition hover:opacity-60"
                style={{ color: MM.tealDeep }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] md:hidden"
              style={{ color: MM.tealDeep }}
              onClick={() => setNavOpen(v => !v)}
            >
              {navOpen ? 'Cerrar' : 'Menú'}
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Encargo"
              className="relative flex h-11 items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
              style={{ backgroundColor: MM.pink }}
            >
              <ShoppingBag size={16} strokeWidth={1.75} />
              <span className="hidden sm:inline">Encargo</span>
              {cartCount > 0 && (
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold"
                  style={{ backgroundColor: MM.tealDeep, color: MM.cream }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t px-4 py-4 md:hidden" style={{ borderColor: `${MM.pinkSoft}88` }}>
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="block w-full py-3 text-left text-lg"
                style={{ fontFamily: FONT_SERIF }}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO — full-bleed cake, brand as the signal */}
      <section ref={sectionRefs.inicio} id="inicio" className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          src="/demos/mamabel/torta-canasta.jpg"
          alt=""
          className="mm-ken absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              `linear-gradient(180deg, ${MM.cream}33 0%, transparent 28%, ${MM.cream}55 55%, ${MM.cream}f2 82%, ${MM.cream} 100%),
               linear-gradient(90deg, ${MM.cream}cc 0%, transparent 45%)`,
          }}
        />
        <div
          className="mm-drift pointer-events-none absolute -left-20 top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: MM.pinkSoft }}
        />
        <div
          className="mm-drift pointer-events-none absolute right-0 top-40 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: MM.teal, animationDelay: '-4s' }}
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-20 lg:justify-center lg:pb-24">
          <div className="max-w-xl">
            {siteSettings.brandLogo ? (
              <img
                src={siteSettings.brandLogo}
                alt=""
                className="mm-rise mb-6 h-20 w-auto object-contain sm:h-24"
              />
            ) : null}
            <p
              className="mm-rise mm-rise-d1 text-[11px] font-semibold uppercase tracking-[0.42em]"
              style={{ color: MM.tealDeep }}
            >
              Las tortas de
            </p>
            <h1
              className="mm-rise mm-rise-d2 mt-1 text-[4.25rem] leading-[0.85] sm:text-[6.5rem] lg:text-[7.5rem]"
              style={{ fontFamily: FONT_SCRIPT, color: MM.ink }}
            >
              mamá mabel
            </h1>
            <p
              className="mm-rise mm-rise-d3 mt-5 max-w-md text-lg leading-relaxed sm:text-xl"
              style={{ color: `${MM.ink}cc` }}
            >
              Decoración a mano, desde 1979. Encargá tu torta — tamaño, fecha y dedicatoria — con el oficio de mamá.
            </p>
            <div className="mm-rise mm-rise-d3 mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('tortas')}
                className="min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-white"
                style={{ backgroundColor: MM.pink }}
              >
                Encargar
              </button>
              <button
                type="button"
                onClick={() => scrollTo('cursos')}
                className="min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: MM.tealDeep, boxShadow: `inset 0 0 0 1.5px ${MM.teal}` }}
              >
                Cursos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Nosotros — one job, real gallery */}
      <section ref={sectionRefs.nosotros} id="nosotros" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
              Desde la cocina
            </p>
            <h2 className="mt-4 text-4xl leading-[1.1] sm:text-5xl" style={{ fontFamily: FONT_SERIF }}>
              El mismo cuidado que va a la mesa, enseñado en cada curso.
            </h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: `${MM.ink}aa` }}>
              Pastelería familiar: clásicas, temáticas y piezas de vitrina.
              Pedís claro por acá — la familia recibe el encargo ordenado.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <img src={GALLERY[0]} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
            <img src={GALLERY[1]} alt="" className="mt-8 aspect-[3/4] w-full object-cover sm:mt-12" loading="lazy" />
            <img src={GALLERY[2]} alt="" className="col-span-2 aspect-[16/9] w-full object-cover" loading="lazy" />
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl gap-3 overflow-x-auto pb-2">
          {GALLERY.slice(3).map(src => (
            <img key={src} src={src} alt="" className="h-36 w-48 shrink-0 object-cover sm:h-44 sm:w-60" loading="lazy" />
          ))}
        </div>
      </section>

      <div className="mm-rule mx-auto max-w-3xl" />

      {/* Encargos — editorial rows, not card grid */}
      <section ref={sectionRefs.tortas} id="tortas" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
                Carta
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl">Encargos</h2>
            </div>
            <div className="flex text-[11px] font-semibold uppercase tracking-[0.18em]">
              {(['pickup', 'delivery'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFulfillment(mode)}
                  className="min-h-10 px-4"
                  style={
                    fulfillment === mode
                      ? { backgroundColor: MM.tealDeep, color: MM.cream }
                      : { color: MM.tealDeep, boxShadow: `inset 0 0 0 1px ${MM.teal}55` }
                  }
                >
                  {mode === 'pickup' ? 'Retiro' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-b pb-1" style={{ borderColor: `${MM.pinkSoft}99` }}>
            {filters.map(f => {
              const on = categoryId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryId(f.id)}
                  className="pb-3 text-[11px] font-semibold uppercase tracking-[0.16em]"
                  style={{
                    color: on ? MM.pink : `${MM.ink}66`,
                    boxShadow: on ? `inset 0 -2px 0 ${MM.pink}` : undefined,
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 divide-y" style={{ borderColor: `${MM.pinkSoft}66` }}>
            {visibleItems.map(item => {
              const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
              const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
              const img = item.images[0];
              return (
                <article
                  key={item.id}
                  className="grid gap-5 py-8 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-center lg:grid-cols-[minmax(0,280px)_1fr_auto]"
                  style={{ borderColor: `${MM.pinkSoft}66` }}
                >
                  <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: MM.blush }}>
                    {img ? <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" /> : null}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-2xl sm:text-3xl">{item.name}</h3>
                      {item.badge && (
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: MM.pink }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-xl text-base leading-relaxed" style={{ color: `${MM.ink}99` }}>
                      {item.description}
                    </p>
                    <p className="mt-3 text-xl" style={{ color: MM.tealDeep }}>{priceLabel(item)}</p>
                    {item.options.length > 1 && (
                      <div className="mt-4 flex flex-wrap gap-2">
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
                              className="min-h-9 px-3 text-[11px] font-semibold uppercase tracking-[0.12em]"
                              style={
                                on
                                  ? { backgroundColor: MM.tealDeep, color: MM.cream }
                                  : { color: MM.tealDeep, boxShadow: `inset 0 0 0 1px ${MM.teal}66` }
                              }
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1 lg:flex-col lg:items-stretch">
                    <div className="flex items-center" style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}44` }}>
                      <button
                        type="button"
                        aria-label="Restar"
                        className="flex h-11 w-10 items-center justify-center"
                        onClick={() =>
                          setCardState(prev => ({
                            ...prev,
                            [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) },
                          }))
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{state.qty}</span>
                      <button
                        type="button"
                        aria-label="Sumar"
                        className="flex h-11 w-10 items-center justify-center"
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
                      className="flex min-h-11 flex-1 items-center justify-center px-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white lg:flex-none"
                      style={{ backgroundColor: MM.pink }}
                    >
                      Agregar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cursos */}
      {courseItems.length > 0 && (
        <section
          ref={sectionRefs.cursos}
          id="cursos"
          className="scroll-mt-24"
          style={{ backgroundColor: MM.blush }}
        >
          <div className="mx-auto grid max-w-6xl gap-0 lg:grid-cols-2">
            <img
              src="/demos/mamabel/curso-flyer.jpg"
              alt="Curso de iniciación"
              className="h-full min-h-[320px] w-full object-cover lg:min-h-[560px]"
            />
            <div className="flex flex-col justify-center px-4 py-16 sm:px-10 sm:py-20">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
                Talleres
              </p>
              <h2 className="mt-3 text-4xl sm:text-5xl">Iniciación a la decoración</h2>
              <p className="mt-5 text-lg leading-relaxed" style={{ color: `${MM.ink}aa` }}>
                Glasé, buttercream, picos rusos, drip y canasta de mimbre.
                Materiales incluidos — te llevás la torta hecha por vos.
              </p>
              {courseItems.map(item => {
                const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
                const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
                return (
                  <div key={item.id} className="mt-8">
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
                                [item.id]: { optionId: opt.id, qty: 1 },
                              }))
                            }
                            className="min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.12em]"
                            style={
                              on
                                ? { backgroundColor: MM.tealDeep, color: MM.cream }
                                : { color: MM.tealDeep, boxShadow: `inset 0 0 0 1px ${MM.teal}` }
                            }
                          >
                            {opt.label} · {formatArs(opt.price)}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => option && addLine(item, option, 1)}
                      className="mt-5 min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-white"
                      style={{ backgroundColor: MM.pink }}
                    >
                      Reservar seña
                    </button>
                  </div>
                );
              })}
              <img
                src="/demos/mamabel/curso-ig.jpg"
                alt=""
                className="mt-10 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section ref={sectionRefs.contacto} id="contacto" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Contacto
          </p>
          <h2
            className="mt-3 text-5xl sm:text-6xl"
            style={{ fontFamily: FONT_SCRIPT }}
          >
            hablemos de tu torta
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4 text-lg sm:flex-row sm:justify-center sm:gap-10">
            {wspHref && (
              <a href={wspHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:opacity-70">
                <Phone size={16} color={MM.pink} strokeWidth={1.75} />
                11 5619-6941
              </a>
            )}
            <a href="mailto:mabelvallejos.reposteria@hotmail.com" className="inline-flex items-center gap-2 hover:opacity-70">
              <Mail size={16} color={MM.pink} strokeWidth={1.75} />
              Mail
            </a>
            {siteSettings.brandInstagram && (
              <a href={siteSettings.brandInstagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:opacity-70">
                <InstagramIcon size={16} color={MM.pink} />
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      <footer className="px-4 py-14 text-center" style={{ backgroundColor: MM.tealDeep, color: MM.cream }}>
        {siteSettings.brandLogo ? (
          <img src={siteSettings.brandLogo} alt="" className="mx-auto mb-4 h-16 w-auto rounded-full bg-white object-contain p-1" />
        ) : null}
        <p className="text-4xl" style={{ fontFamily: FONT_SCRIPT }}>mamá mabel</p>
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] opacity-70">
          Las tortas de · desde 1979
        </p>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/35">
          <div className="flex h-full w-full max-w-md flex-col" style={{ backgroundColor: MM.cream }}>
            <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: `1px solid ${MM.pinkSoft}` }}>
              <h2 className="text-2xl">Tu encargo</h2>
              <button type="button" aria-label="Cerrar" onClick={() => setCartOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p style={{ color: `${MM.ink}88` }}>Todavía vacío.</p>
              ) : (
                cart.map((line, idx) => (
                  <div key={`${line.id}-${line.optionId}-${idx}`} className="flex justify-between gap-3 pb-3" style={{ borderBottom: `1px solid ${MM.pinkSoft}` }}>
                    <div>
                      <p className="text-base">{line.qty} × {line.name}</p>
                      <p className="text-sm" style={{ color: `${MM.ink}88` }}>{line.optionLabel}</p>
                      <p className="mt-1" style={{ color: MM.pink }}>{formatArs(line.price * line.qty)}</p>
                    </div>
                    <div className="flex gap-1">
                      <button type="button" className="p-2" style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}44` }} onClick={() => updateCartQty(idx, -1)}>
                        <Minus size={14} />
                      </button>
                      <button type="button" className="p-2" style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}44` }} onClick={() => updateCartQty(idx, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-5" style={{ borderTop: `1px solid ${MM.pinkSoft}` }}>
              <div className="mb-1 flex justify-between text-xl">
                <span>{copy.totalLabel}</span>
                <span>{formatArs(cartTotal)}</span>
              </div>
              <p className="mb-4 text-sm" style={{ color: `${MM.ink}88` }}>{copy.totalHint}</p>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="flex min-h-12 w-full items-center justify-center text-[12px] font-semibold uppercase tracking-[0.2em] text-white disabled:opacity-40"
                style={{ backgroundColor: MM.pink }}
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
