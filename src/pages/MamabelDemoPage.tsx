/**
 * Editorial storefront — Las Tortas de Mamá Mabel
 * Brand: cream paper, cake-pink, watercolor teal, ink script (logo/flyer).
 * Etapa 3: likes-ranked portfolio, cursos honestos, confianza + cierre.
 */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { AIAssistant } from '../components/AIAssistant';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import { getDemoByTenantId } from '../utils/demoRegistry';
import {
  buildMamabelWaUrl,
  MAMABEL_WSP,
  validateMamabelEncargo,
  type MamabelEncargo,
  type MamabelEncargoErrors,
} from '../utils/mamabelEncargo';

const MM = {
  cream: '#FBF6F0',
  blush: '#F7E6EC',
  pink: '#E87890',
  pinkSoft: '#F0C0D8',
  teal: '#70A8A0',
  tealDeep: '#3F6F6A',
  ink: '#1C1714',
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

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'oficio', label: 'Oficio' },
  { id: 'trabajos', label: 'Trabajos' },
  { id: 'encargar', label: 'Encargar' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
] as const;

/** Black-bg studio picks from content/mamabel/better ones (ready, no crop). */
const HERO_IMG = '/demos/mamabel/picked/hero.jpg';

const OFICIO_PORTRAIT = '/demos/mamabel/picked/black-elegant.jpg';
const OFICIO_GALLERY = [
  '/demos/mamabel/picked/black-cars.jpg',
  '/demos/mamabel/picked/black-maleficent.jpg',
  '/demos/mamabel/picked/black-rock.jpg',
  '/demos/mamabel/picked/black-ddm.jpg',
  '/demos/mamabel/picked/black-cupcakes-books.jpg',
  '/demos/mamabel/picked/black-cupcakes-roses.jpg',
];

/** Portfolio — black studio set first; more from better ones later (need crop/edit). */
const PORTFOLIO: { src: string; alt: string }[] = [
  { src: '/demos/mamabel/picked/black-bows.jpg', alt: 'Torta tres pisos lazos melocotón' },
  { src: '/demos/mamabel/picked/black-elegant.jpg', alt: 'Torta blanca quilted y rosa' },
  { src: '/demos/mamabel/picked/black-cars.jpg', alt: 'Torta temática auto' },
  { src: '/demos/mamabel/picked/black-maleficent.jpg', alt: 'Torta temática Maléfica' },
  { src: '/demos/mamabel/picked/black-rock.jpg', alt: 'Torta rock — mano escultura' },
  { src: '/demos/mamabel/picked/black-ddm.jpg', alt: 'Encargo TV — 1000 programas' },
  { src: '/demos/mamabel/picked/black-bluebow.jpg', alt: 'Torta blanca con flores azules' },
  { src: '/demos/mamabel/picked/black-cupcakes-books.jpg', alt: 'Cupcakes decorados' },
  { src: '/demos/mamabel/picked/black-cupcakes-roses.jpg', alt: 'Cupcakes con rosas' },
  { src: '/demos/mamabel/picked/black-cupcakes-close.jpg', alt: 'Cupcake chocolate y rosa' },
];

const OCCASIONS = [
  'Cumpleaños',
  'Casamiento / 15',
  'Bautismo / comunión',
  'Aniversario',
  'Empresa / evento',
  'Otro',
] as const;

const EMPTY_ENCARGO: MamabelEncargo = {
  name: '',
  occasion: 'Cumpleaños',
  portions: '',
  flavor: 'A definir',
  filling: 'A definir',
  dateNeeded: '',
  fulfillment: 'pickup',
  idea: '',
  notes: '',
};

const STYLE_ID = 'mm-editorial-css';
const EDITORIAL_CSS = `
@keyframes mm-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.mm-rise { animation: mm-rise 0.8s ease both; }
.mm-rise-d1 { animation-delay: 0.1s; }
.mm-rise-d2 { animation-delay: 0.2s; }
.mm-rise-d3 { animation-delay: 0.3s; }
.mm-paper {
  background-color: ${MM.cream};
  background-image:
    radial-gradient(ellipse 80% 50% at 10% 0%, ${MM.blush}cc, transparent 55%),
    radial-gradient(ellipse 60% 40% at 100% 20%, ${MM.teal}22, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.mm-rule { height: 1px; background: linear-gradient(90deg, transparent, ${MM.teal}66, transparent); }
.mm-logo-plate {
  background: #fff;
  box-shadow: 0 1px 0 rgba(28,23,20,0.08);
}
.mm-field {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.85rem;
  background: #fff;
  border: 1px solid ${MM.pinkSoft}99;
  color: ${MM.ink};
  font-family: ${FONT_SERIF};
  font-size: 1rem;
}
.mm-field:focus {
  outline: 2px solid ${MM.teal};
  outline-offset: 1px;
}
.mm-field[aria-invalid="true"] {
  border-color: #c45c5c;
}
.mm-shot {
  width: 100%;
  background: #fff;
  object-fit: contain;
}
.mm-shot-tall { aspect-ratio: 4 / 5; }
.mm-flyer { width: 100%; height: auto; object-fit: contain; background: #fff; }
@media (prefers-reduced-motion: reduce) {
  .mm-rise { animation: none !important; }
}
`;

export default function MamabelDemoPage() {
  const { siteSettings } = useMenu();
  const { tenantId } = usePlan();
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const copy = demo?.copy;

  const [searchParams] = useSearchParams();
  const showTrufiChrome = searchParams.get('trufi') === '1';

  const inicioRef = useRef<HTMLElement>(null);
  const oficioRef = useRef<HTMLElement>(null);
  const trabajosRef = useRef<HTMLElement>(null);
  const encargarRef = useRef<HTMLElement>(null);
  const cursosRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);
  const sectionRefs = {
    inicio: inicioRef,
    oficio: oficioRef,
    trabajos: trabajosRef,
    encargar: encargarRef,
    cursos: cursosRef,
    contacto: contactoRef,
  };

  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [encargo, setEncargo] = useState<MamabelEncargo>(EMPTY_ENCARGO);
  const [errors, setErrors] = useState<MamabelEncargoErrors>({});

  const wsp = siteSettings.whatsappNumber || MAMABEL_WSP;
  const wspHref = wsp ? `https://wa.me/${wsp}` : undefined;

  useEffect(() => {
    setTheme('light');
    document.title = 'Las Tortas de Mamá Mabel';
    const meta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    meta('description', 'Pastelería familiar desde 1979. Tortas a medida y cursos de decoración — Las Tortas de Mamá Mabel.');
    meta('og:title', 'Las Tortas de Mamá Mabel', true);
    meta('og:description', 'Tortas decoradas a mano · encargos por WhatsApp · desde 1979', true);
    meta('og:image', `${window.location.origin}/demos/mamabel/picked/hero.jpg`, true);
    meta('twitter:card', 'summary_large_image');
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

  const scrollTo = (id: keyof typeof sectionRefs) => {
    setNavOpen(false);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const patch = (partial: Partial<MamabelEncargo>) => {
    setEncargo(prev => ({ ...prev, ...partial }));
    setErrors(prev => {
      const next = { ...prev };
      if (partial.portions !== undefined) delete next.portions;
      if (partial.dateNeeded !== undefined) delete next.dateNeeded;
      return next;
    });
  };

  const openWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors = validateMamabelEncargo(encargo);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    window.open(buildMamabelWaUrl(encargo, wsp), '_blank', 'noopener,noreferrer');
  };

  if (!demo || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center mm-paper" style={{ color: MM.ink }}>
        Demo no configurada.
      </div>
    );
  }

  const fieldLabel = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em]';

  return (
    <div className="mm-paper min-h-screen overflow-x-hidden pb-20 md:pb-0" style={{ color: MM.ink, fontFamily: FONT_SERIF }} data-demo-theme="mamabel">
      {showTrufiChrome && <DemoRibbon />}

      <header
        className="fixed inset-x-0 z-30 transition-colors duration-300"
        style={{
          top: showTrufiChrome ? undefined : 0,
          backgroundColor: scrolled || navOpen ? `${MM.cream}f5` : 'transparent',
          borderBottom: scrolled ? `1px solid ${MM.pinkSoft}55` : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(10px)' : undefined,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <button type="button" onClick={() => scrollTo('inicio')} className="flex items-center gap-2.5 text-left">
            <img
              src="/demos/mamabel/logo-large.jpg"
              alt="Las Tortas de Mamá Mabel"
              className="mm-logo-plate h-11 w-11 object-contain p-1 sm:h-12 sm:w-12"
            />
            <span
              className="text-lg leading-none sm:text-xl"
              style={{ fontFamily: FONT_SCRIPT, color: scrolled || navOpen ? MM.ink : MM.cream }}
            >
              mamá mabel
            </span>
          </button>

          <nav className="hidden items-center gap-5 lg:flex">
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:opacity-60"
                style={{ color: scrolled ? MM.tealDeep : MM.cream }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] lg:hidden"
              style={{ color: scrolled ? MM.tealDeep : MM.cream }}
              onClick={() => setNavOpen(v => !v)}
              aria-expanded={navOpen}
            >
              {navOpen ? 'Cerrar' : 'Menú'}
            </button>
            <button
              type="button"
              onClick={() => scrollTo('encargar')}
              className="hidden min-h-10 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:inline-flex sm:items-center"
              style={{ backgroundColor: MM.pink }}
            >
              Encargar
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t px-4 py-4 lg:hidden" style={{ borderColor: `${MM.pinkSoft}88`, backgroundColor: MM.cream }}>
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="block w-full py-3 text-left text-lg"
                style={{ color: MM.ink }}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <section ref={sectionRefs.inicio} id="inicio" className="relative isolate min-h-[100svh] overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Mabel Vallejos — Las Tortas de Mamá Mabel"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center 22%' }}
          fetchPriority="high"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(28,23,20,0.28) 0%, rgba(28,23,20,0.08) 40%, rgba(28,23,20,0.55) 72%, rgba(28,23,20,0.88) 100%)',
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-8 sm:pb-24">
          <div className="max-w-2xl text-white">
            <p className="mm-rise text-[11px] font-semibold uppercase tracking-[0.32em] text-white/85">
              Pastelería familiar · desde 1979
            </p>
            <h1
              className="mm-rise mm-rise-d1 mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: FONT_SERIF, fontWeight: 600 }}
            >
              Tortas que se recuerdan
            </h1>
            <p className="mm-rise mm-rise-d2 mt-5 max-w-lg text-base leading-relaxed text-white/90 sm:text-lg">
              Clásicas, temáticas y piezas extraordinarias, decoradas a mano por Mabel y su familia.
            </p>
            <div className="mm-rise mm-rise-d3 mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('encargar')}
                className="min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
                style={{ backgroundColor: MM.pink }}
              >
                Contanos tu idea
              </button>
              <button
                type="button"
                onClick={() => scrollTo('trabajos')}
                className="min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
                style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.7)' }}
              >
                Ver trabajos
              </button>
            </div>
          </div>
        </div>
      </section>

      <section ref={sectionRefs.oficio} id="oficio" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          <div className="relative">
            <img
              src={OFICIO_PORTRAIT}
              alt="Torta blanca quilted con detalles rosa"
              className="mm-shot mm-shot-tall"
              width={1440}
              height={1440}
            />
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: MM.teal }}>
              Studio · fondo negro
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em]" style={{ color: MM.teal }}>
              Oficio
            </p>
            <h2 className="mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-5xl">
              Desde 1979, haciendo lo difícil a mano.
            </h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: `${MM.ink}aa` }}>
              Pastelería familiar: tortas clásicas, temáticas y trabajos de gran complejidad técnica.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {OFICIO_GALLERY.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Trabajo destacado ${i + 1}`}
              className="mm-shot mm-shot-tall"
              loading="lazy"
              width={800}
              height={1000}
            />
          ))}
        </div>
      </section>

      <div className="mm-rule mx-auto max-w-3xl" />

      {/* Portfolio — ranking likes IG (Mabel) + FB; contain = sin crop malo */}
      <section ref={sectionRefs.trabajos} id="trabajos" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Portfolio
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Trabajos</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: `${MM.ink}99` }}>
            Selección studio con fondo negro. Más piezas del drop familiar vienen después (crop/edición).
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {PORTFOLIO.map(work => (
              <figure key={work.src}>
                <img
                  src={work.src}
                  alt={work.alt}
                  className="mm-shot mm-shot-tall"
                  loading="lazy"
                  width={720}
                  height={900}
                />
              </figure>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollTo('encargar')}
            className="mt-12 min-h-12 px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
            style={{ backgroundColor: MM.pink }}
          >
            Quiero una así
          </button>
        </div>
      </section>

      <div className="mm-rule mx-auto max-w-3xl" />

      {/* Encargar — configurador → WhatsApp */}
      <section ref={sectionRefs.encargar} id="encargar" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Pedido
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Encargar</h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: `${MM.ink}99` }}>
            Contanos lo esencial. Abrimos WhatsApp con el pedido listo — vos enviás cuando quieras.
            Si tenés una foto de referencia, adjuntála en el chat.
          </p>
          <p className="mt-2 text-sm" style={{ color: MM.tealDeep }}>
            Precio: Cotizar · sin pago online
          </p>

          <form className="mt-10 space-y-5" onSubmit={openWhatsApp} noValidate>
            <div>
              <label htmlFor="mm-name" className={fieldLabel} style={{ color: MM.tealDeep }}>Nombre</label>
              <input
                id="mm-name"
                className="mm-field"
                value={encargo.name}
                onChange={e => patch({ name: e.target.value })}
                autoComplete="name"
              />
            </div>

            <div>
              <label htmlFor="mm-occasion" className={fieldLabel} style={{ color: MM.tealDeep }}>Ocasión</label>
              <select
                id="mm-occasion"
                className="mm-field"
                value={encargo.occasion}
                onChange={e => patch({ occasion: e.target.value })}
              >
                {OCCASIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mm-portions" className={fieldLabel} style={{ color: MM.tealDeep }}>
                Porciones (aprox.) *
              </label>
              <input
                id="mm-portions"
                className="mm-field"
                inputMode="numeric"
                pattern="[0-9]*"
                value={encargo.portions}
                aria-invalid={!!errors.portions}
                aria-describedby={errors.portions ? 'mm-portions-err' : undefined}
                onChange={e => patch({ portions: e.target.value })}
              />
              {errors.portions && (
                <p id="mm-portions-err" className="mt-1.5 text-sm" style={{ color: '#c45c5c' }} role="alert">
                  {errors.portions}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="mm-flavor" className={fieldLabel} style={{ color: MM.tealDeep }}>Sabor</label>
                <input
                  id="mm-flavor"
                  className="mm-field"
                  value={encargo.flavor}
                  placeholder="A definir"
                  onChange={e => patch({ flavor: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="mm-filling" className={fieldLabel} style={{ color: MM.tealDeep }}>Relleno</label>
                <input
                  id="mm-filling"
                  className="mm-field"
                  value={encargo.filling}
                  placeholder="A definir"
                  onChange={e => patch({ filling: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mm-date" className={fieldLabel} style={{ color: MM.tealDeep }}>
                Fecha necesaria *
              </label>
              <input
                id="mm-date"
                type="date"
                className="mm-field"
                value={encargo.dateNeeded}
                aria-invalid={!!errors.dateNeeded}
                aria-describedby={errors.dateNeeded ? 'mm-date-err' : undefined}
                onChange={e => patch({ dateNeeded: e.target.value })}
              />
              {errors.dateNeeded && (
                <p id="mm-date-err" className="mt-1.5 text-sm" role="alert" style={{ color: '#c45c5c' }}>
                  {errors.dateNeeded}
                </p>
              )}
            </div>

            <fieldset>
              <legend className={fieldLabel} style={{ color: MM.tealDeep }}>Entrega</legend>
              <div className="mt-1 flex">
                {([
                  ['pickup', 'Retiro'],
                  ['delivery', 'Delivery'],
                ] as const).map(([id, label]) => {
                  const on = encargo.fulfillment === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => patch({ fulfillment: id })}
                      className="min-h-11 flex-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={
                        on
                          ? { backgroundColor: MM.tealDeep, color: MM.cream }
                          : { color: MM.tealDeep, boxShadow: `inset 0 0 0 1px ${MM.teal}55` }
                      }
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="mm-idea" className={fieldLabel} style={{ color: MM.tealDeep }}>Idea / tema</label>
              <input
                id="mm-idea"
                className="mm-field"
                value={encargo.idea}
                onChange={e => patch({ idea: e.target.value })}
                placeholder="Ej. flores celestes, personaje…"
              />
            </div>

            <div>
              <label htmlFor="mm-notes" className={fieldLabel} style={{ color: MM.tealDeep }}>Notas</label>
              <textarea
                id="mm-notes"
                className="mm-field min-h-24"
                rows={3}
                value={encargo.notes}
                onChange={e => patch({ notes: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="flex min-h-12 w-full items-center justify-center text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: MM.pink }}
            >
              Encargar por WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* Cursos — flyer ya tiene texto: contain + sin copy duplicada */}
      <section
        ref={sectionRefs.cursos}
        id="cursos"
        className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28"
        style={{ backgroundColor: MM.blush }}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Talleres
          </p>
          <h2 className="mt-3 text-4xl sm:text-5xl">Aprendé con Mabel</h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: `${MM.ink}99` }}>
            Consultá la próxima fecha por WhatsApp. El encargo de tortas es otro flujo (
            <button type="button" className="underline" style={{ color: MM.tealDeep }} onClick={() => scrollTo('encargar')}>
              Encargar
            </button>
            ).
          </p>

          <div className="relative mt-10">
            <span
              className="absolute left-3 top-3 z-10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
              style={{ backgroundColor: MM.tealDeep }}
            >
              Edición anterior
            </span>
            <img
              src="/demos/mamabel/curso-flyer.jpg"
              alt="Volante de edición anterior — curso de iniciación"
              className="mm-flyer"
              loading="lazy"
              width={1024}
              height={977}
            />
          </div>

          <img
            src="/demos/mamabel/curso-ig.jpg"
            alt="Alumnas del curso con sus tortas"
            className="mm-flyer mt-6"
            loading="lazy"
            width={1200}
            height={1244}
          />

          <img
            src="/demos/mamabel/curso-egreso.jpg"
            alt="Egreso de taller — alumnas con certificados"
            className="mm-flyer mt-6"
            loading="lazy"
            width={750}
            height={562}
          />

          {wspHref && (
            <a
              href={`${wspHref}?text=${encodeURIComponent('Hola! Quiero consultar la proxima fecha del curso con Mabel.')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-10 flex min-h-12 items-center justify-center px-8 text-[12px] font-semibold uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: MM.pink }}
            >
              Consultar próxima fecha
            </a>
          )}
        </div>
      </section>

      {/* Confianza */}
      <section id="confianza" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Confianza
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Trabajos reales, en redes reales</h2>
          <p className="mt-4 text-lg leading-relaxed" style={{ color: `${MM.ink}99` }}>
            Desde 1979. Seguinos en Instagram para ver encargos y aulas.
          </p>
          {siteSettings.brandInstagram && (
            <a
              href={siteSettings.brandInstagram}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-12 items-center gap-2 px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: MM.tealDeep }}
            >
              <InstagramIcon size={16} color="#fff" />
              @lastortasdemamamabel
            </a>
          )}
        </div>
      </section>

      <div className="mm-rule mx-auto max-w-3xl" />

      {/* Info práctica — solo CTAs si no hay datos confirmados */}
      <section id="info" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Antes de encargar
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Lo coordinamos por WhatsApp</h2>
          <ul className="mt-8 space-y-4 text-base leading-relaxed" style={{ color: `${MM.ink}aa` }}>
            <li>Anticipación, retiro y delivery — consultar.</li>
            <li>Pagos y seña — consultar.</li>
            <li>Conservación y porciones — consultar según el encargo.</li>
          </ul>
          {wspHref && (
            <a
              href={wspHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-12 items-center px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: MM.pink }}
            >
              Consultar por WhatsApp
            </a>
          )}
        </div>
      </section>

      <section ref={sectionRefs.contacto} id="contacto" className="scroll-mt-24 px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: MM.teal }}>
            Contacto
          </p>
          <h2 className="mt-3 text-5xl sm:text-6xl" style={{ fontFamily: FONT_SCRIPT }}>
            hablemos de tu torta
          </h2>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:mx-auto sm:max-w-md">
            {wspHref && (
              <a
                href={wspHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 text-lg hover:opacity-70"
                style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}55` }}
              >
                <Phone size={18} color={MM.pink} strokeWidth={1.75} />
                WhatsApp · 11 5619-6941
              </a>
            )}
            <a
              href="mailto:mabelvallejos.reposteria@hotmail.com"
              className="inline-flex min-h-14 items-center justify-center gap-3 text-lg hover:opacity-70"
              style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}55` }}
            >
              <Mail size={18} color={MM.pink} strokeWidth={1.75} />
              Mail · mabelvallejos.reposteria@hotmail.com
            </a>
            {siteSettings.brandInstagram && (
              <a
                href={siteSettings.brandInstagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 text-lg hover:opacity-70"
                style={{ boxShadow: `inset 0 0 0 1px ${MM.teal}55` }}
              >
                <InstagramIcon size={18} color={MM.pink} />
                Instagram · @lastortasdemamamabel
              </a>
            )}
          </div>
          <button
            type="button"
            onClick={() => scrollTo('encargar')}
            className="mt-12 min-h-14 w-full max-w-md px-8 text-[12px] font-semibold uppercase tracking-[0.18em] text-white sm:w-auto"
            style={{ backgroundColor: MM.pink }}
          >
            Encargar por WhatsApp
          </button>
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
        <p className="mt-4 text-sm opacity-80">11 5619-6941 · mabelvallejos.reposteria@hotmail.com</p>
      </footer>

      {/* Móvil: un solo CTA persistente */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t p-3 md:hidden"
        style={{ backgroundColor: `${MM.cream}f8`, borderColor: `${MM.pinkSoft}88`, backdropFilter: 'blur(8px)' }}
      >
        <button
          type="button"
          onClick={() => scrollTo('encargar')}
          className="flex min-h-12 w-full items-center justify-center text-[12px] font-semibold uppercase tracking-[0.16em] text-white"
          style={{ backgroundColor: MM.pink }}
        >
          Encargar por WhatsApp
        </button>
      </div>

      {showTrufiChrome && <AIAssistant onAddToCart={() => { /* etapa 2: sin carrito cliente */ }} />}
    </div>
  );
}
