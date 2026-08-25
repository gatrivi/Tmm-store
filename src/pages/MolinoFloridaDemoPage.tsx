import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock3, MapPin, MessageCircle, Package, Truck } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  category: 'harinas' | 'panaderia' | 'cereales' | 'especiales';
  format: string;
  description: string;
  featured?: boolean;
  image?: string;
};

const WHATSAPP = '5491160157002';
const ASSET_BASE = '/demos/molino-florida';

const PRODUCTS: Product[] = [
  {
    id: 'integral-superfina',
    name: 'Harina integral de trigo superfina',
    category: 'harinas',
    format: '1 kg · 10 kg',
    description: 'Molienda fina para panes, masas y cocina diaria.',
    featured: true,
    image: `${ASSET_BASE}/prod-integral.jpg`,
  },
  {
    id: 'integral-fina',
    name: 'Harina integral de trigo fina',
    category: 'harinas',
    format: '1 kg · 10 kg',
    description: 'Una integral versátil para tener siempre a mano.',
    image: `${ASSET_BASE}/prod-integral-fina.jpg`,
  },
  {
    id: 'centeno-fino',
    name: 'Harina integral de centeno fino',
    category: 'harinas',
    format: '1 kg · 10 kg · 20 kg',
    description: 'Para panes de centeno, blends y fermentaciones largas.',
    image: `${ASSET_BASE}/prod-centeno.jpg`,
  },
  {
    id: 'garbanzo',
    name: 'Harina de garbanzo',
    category: 'especiales',
    format: '1 kg · 5 kg',
    description: 'Para fainá, rebozados, masas y cocina sin trigo.',
    featured: true,
    image: `${ASSET_BASE}/prod-garbanzo.jpg`,
  },
  {
    id: 'arroz-blanco',
    name: 'Harina de arroz blanco',
    category: 'especiales',
    format: '1 kg · 5 kg',
    description: 'Textura liviana para mezclas, repostería y cocina.',
    image: `${ASSET_BASE}/prod-arroz.jpg`,
  },
  {
    id: 'semolin',
    name: 'Semolín de trigo pan',
    category: 'panaderia',
    format: '1 kg · 5 kg · 25 kg',
    description: 'Formato hogar y bolsa para producción gastronómica.',
    featured: true,
    image: `${ASSET_BASE}/prod-semolin.jpg`,
  },
  {
    id: 'premezcla-3-cereales',
    name: 'Premezcla 3 cereales',
    category: 'panaderia',
    format: '1 kg · 25 kg',
    description: 'Una base práctica para panificación y producción.',
    image: `${ASSET_BASE}/prod-correctora.jpg`,
  },
  {
    id: 'salvado',
    name: 'Salvado de trigo',
    category: 'cereales',
    format: '500 g',
    description: 'Para panes, desayunos, granolas y preparaciones integrales.',
    image: `${ASSET_BASE}/prod-salvado.jpg`,
  },
  {
    id: 'cebada',
    name: 'Cebada perlada',
    category: 'cereales',
    format: '1 kg · 5 kg · 25 kg',
    description: 'Para cocina, gastronomía y compras en volumen.',
    image: `${ASSET_BASE}/prod-cebada.jpg`,
  },
  {
    id: 'almendras',
    name: 'Harina de almendras con piel',
    category: 'especiales',
    format: '250 g · 1 kg',
    description: 'Para repostería, masas y recetas de alto valor agregado.',
    image: `${ASSET_BASE}/prod-almendras.jpg`,
  },
  {
    id: 'paraguaya',
    name: 'Harina paraguaya',
    category: 'panaderia',
    format: '5 kg · 25 kg',
    description: 'Presentaciones pensadas para cocina y producción.',
    image: `${ASSET_BASE}/prod-paraguaya.jpg`,
  },
  {
    id: 'maiz',
    name: 'Harina de maíz',
    category: 'harinas',
    format: '5 kg',
    description: 'Un básico de despensa en formato rendidor.',
    image: `${ASSET_BASE}/prod-maiz.jpg`,
  },
];

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'harinas', label: 'Harinas' },
  { id: 'panaderia', label: 'Panadería' },
  { id: 'cereales', label: 'Cereales' },
  { id: 'especiales', label: 'Especiales' },
] as const;

function whatsappHref(product?: Product): string {
  const text = product
    ? `Hola Molino Florida, quería consultar stock y precio de ${product.name} (${product.format}).`
    : 'Hola Molino Florida, quería consultar por productos y formatos disponibles.';
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function MolinoFloridaDemoPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('todos');

  useEffect(() => {
    document.title = 'Molino Florida — demo Gatrivi.com';
  }, []);

  const products = useMemo(
    () => (filter === 'todos' ? PRODUCTS : PRODUCTS.filter(product => product.category === filter)),
    [filter],
  );

  return (
    <div className="min-h-screen bg-[#f4efe4] text-[#1f241d]">
      <div className="border-b border-[#243224]/10 bg-[#243224] px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.18em] text-[#f7f1e5]/75">
        Demo visual de propuesta · Gatrivi.com · identidad y packaging conceptuales
      </div>

      <header className="sticky top-0 z-30 border-b border-[#243224]/10 bg-[#f7f3e9]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <a href="#inicio" className="flex min-w-0 items-center gap-3" aria-label="Molino Florida, inicio">
            <img
              src={`${ASSET_BASE}/logo-brand.jpg`}
              alt="Molino Florida"
              className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            />
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg font-bold leading-none tracking-[-0.02em]">Molino Florida</span>
              <span className="mt-1 block truncate text-[9px] font-bold uppercase tracking-[0.13em] text-[#52604e] sm:text-[10px]">Harinas · cereales · materias primas</span>
            </span>
          </a>

          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="hidden min-h-10 items-center gap-2 rounded-full bg-[#41543c] px-4 text-xs font-black text-white transition hover:bg-[#31402e] sm:inline-flex"
          >
            <MessageCircle size={16} /> Consultar
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="border-b border-[#243224]/10">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
            <div className="overflow-hidden rounded-[2rem] border border-[#243224]/10 bg-[#e5d4b2] shadow-[0_24px_70px_rgba(36,50,36,0.14)] lg:grid lg:grid-cols-[1.2fr_.8fr]">
              <div className="relative min-h-[320px] sm:min-h-[440px] lg:min-h-[520px]">
                <img
                  src={`${ASSET_BASE}/hero-flour.jpg`}
                  alt="Harinas y materias primas Molino Florida"
                  className="absolute inset-0 h-full w-full object-cover object-left"
                  fetchPriority="high"
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/60 bg-[#f7f1e5]/90 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.14em] text-[#41543c] shadow-sm backdrop-blur sm:left-6 sm:top-6">
                  Propuesta visual
                </div>
              </div>

              <div className="flex flex-col justify-center bg-[#f7f1e5] p-7 sm:p-10 lg:p-12">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#86662f]">Florida · Vicente López</p>
                <h1 className="mt-4 font-serif text-4xl font-bold leading-[0.98] tracking-[-0.045em] text-[#243224] sm:text-5xl lg:text-6xl">
                  Todo para amasar, cocinar y producir.
                </h1>
                <p className="mt-5 text-sm leading-relaxed text-[#4d5549] sm:text-base">
                  Harinas, cereales y materias primas organizadas por producto y formato. Para tu casa, tu cocina o tu negocio, sin perderte entre cientos de opciones.
                </p>

                <div className="mt-6 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#41543c]">
                  {['Hogar', 'Gastronomía', 'Panadería', 'Formatos grandes'].map(item => (
                    <span key={item} className="rounded-full border border-[#41543c]/20 bg-white/60 px-3 py-1.5">{item}</span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#productos" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#41543c] px-5 text-sm font-black text-white transition hover:bg-[#31402e]">
                    Ver productos <ArrowRight size={17} />
                  </a>
                  <a href={whatsappHref()} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#41543c]/20 bg-[#fffdf7] px-5 text-sm font-black text-[#41543c]">
                    Consultar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#243224]/10 bg-[#fffdf7]">
          <div className="mx-auto grid max-w-6xl gap-4 px-4 py-5 text-xs font-bold text-[#4e584b] sm:grid-cols-3 sm:px-6">
            <p className="flex items-center gap-2"><Truck size={16} className="text-[#41543c]" /> Envíos a CABA y Zona Norte</p>
            <p className="flex items-center gap-2"><MapPin size={16} className="text-[#41543c]" /> Coquimbo 3560 · Vicente López</p>
            <p className="flex items-center gap-2"><Clock3 size={16} className="text-[#41543c]" /> Lun–Vie 8–14 · Sáb 8–11:30</p>
          </div>
        </section>

        <section
          id="productos"
          className="scroll-mt-24 border-b border-[#243224]/10 bg-cover bg-top"
          style={{
            backgroundImage: `linear-gradient(rgba(244,239,228,.91), rgba(244,239,228,.97)), url('${ASSET_BASE}/background.svg')`,
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#86662f]">Catálogo simple</p>
                <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.035em] text-[#243224] sm:text-4xl">Encontrá rápido lo que necesitás.</h2>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-[#5a6257]">Stock, formato y valor vigente se confirman al momento de consultar.</p>
            </div>

            <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
              {FILTERS.map(item => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${active ? 'border-[#41543c] bg-[#41543c] text-white' : 'border-[#41543c]/15 bg-[#fffdf7]/90 text-[#556050] hover:border-[#41543c]/35'}`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <article key={product.id} className="group flex overflow-hidden rounded-2xl border border-[#243224]/10 bg-[#fffdf7]/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(36,50,36,0.10)]">
                  <div className="flex w-full flex-col">
                    {product.image ? (
                      <div className="overflow-hidden border-b border-[#243224]/10 bg-[#eadbc0]">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    ) : (
                      <div className="grid aspect-[4/2] place-items-center border-b border-[#243224]/10 bg-[#e8ddc6]/45">
                        <Package size={34} strokeWidth={1.3} className="text-[#7a6848]/55" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-full bg-[#dfe4d8] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-[#41543c]">{FILTERS.find(item => item.id === product.category)?.label}</span>
                        {product.featured ? <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#9b7434]">Destacado</span> : null}
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-bold leading-tight tracking-[-0.025em] text-[#243224]">{product.name}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#62695f]">{product.description}</p>
                      <p className="mt-4 text-sm font-black text-[#41543c]">{product.format}</p>
                      <a href={whatsappHref(product)} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-10 items-center justify-between border-t border-[#243224]/10 pt-4 text-xs font-black text-[#41543c]">
                        Consultar stock y precio <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#243224]/10 bg-[#243224] text-[#f7f1e5]">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-16">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d5ae68]">Para producción</p>
              <h2 className="mt-3 max-w-xl font-serif text-3xl font-bold tracking-[-0.035em] sm:text-4xl">¿Comprás por bolsa? Que los formatos grandes no queden enterrados.</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['5 kg', '10 kg', '25 kg'].map(size => (
                <div key={size} className="rounded-2xl border border-white/15 bg-white/[0.04] px-3 py-7 text-center">
                  <p className="font-serif text-2xl font-bold sm:text-3xl">{size}</p>
                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-white/55">formatos visibles</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#86662f]">Comprar sin vueltas</p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.035em] text-[#243224]">Del catálogo a la consulta en tres pasos.</h2>
            </div>
            <ol className="grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Elegí', 'Producto y formato, sin navegar páginas innecesarias.'],
                ['02', 'Consultá', 'WhatsApp sale prearmado con lo que estabas mirando.'],
                ['03', 'Coordiná', 'Stock, precio, pago y entrega se confirman antes de cerrar.'],
              ].map(([n, title, body]) => (
                <li key={n} className="rounded-2xl border border-[#243224]/10 bg-[#fffdf7] p-5">
                  <p className="text-[10px] font-black tracking-[0.16em] text-[#9b7434]">{n}</p>
                  <h3 className="mt-5 font-serif text-xl font-bold text-[#243224]">{title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#62695f]">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#243224]/10 bg-[#fffdf7]">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-xs text-[#62695f] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <img src={`${ASSET_BASE}/logo-brand.jpg`} alt="" className="h-12 w-12 rounded-full object-contain" />
            <div>
              <p className="font-serif text-lg font-bold text-[#243224]">Molino Florida</p>
              <p className="mt-1">Débito · efectivo · transferencia · envíos CABA y Zona Norte</p>
            </div>
          </div>
          <a href={whatsappHref()} target="_blank" rel="noreferrer" className="font-black text-[#41543c]">Consultar catálogo →</a>
        </div>
      </footer>

      <a
        href={whatsappHref()}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 left-4 right-4 z-40 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#41543c] px-4 text-sm font-black text-white shadow-xl sm:hidden"
      >
        <MessageCircle size={17} /> Consultar por WhatsApp
      </a>
    </div>
  );
}
