import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, WandSparkles } from 'lucide-react';
import { withAttribution } from '../utils/demoIntake';
import { buildProspectDemoSearch } from '../utils/prospectDemo';
import type { ProspectCategory } from '../utils/prospectDemo';

type DemoCard = {
  name: string;
  problem: string;
  samplePath: string;
  rubro?: ProspectCategory;
};

type Family = { title: string; cards: DemoCard[] };

const FAMILIES: Family[] = [
  {
    title: 'Peso / unidad',
    cards: [
      { name: 'Carnicería', problem: 'Cantidad, presentación y total estimado.', samplePath: '/demo/carniceria' },
      { name: 'Pollería', problem: 'Entero, spiedo o combo sin audio eterno.', samplePath: '/demo?rubro=polleria', rubro: 'polleria' },
      { name: 'Verdulería', problem: '½ kg / kg con total estimado.', samplePath: '/demo?rubro=verduleria', rubro: 'verduleria' },
    ],
  },
  {
    title: 'Preparación / horario',
    cards: [
      { name: 'Panadería', problem: 'Retiro con hora en notas.', samplePath: '/demo/panaderia' },
      { name: 'Cafetería', problem: 'Pedir para retirar ordenado.', samplePath: '/demo?rubro=cafeteria', rubro: 'cafeteria' },
      { name: 'Pizzería', problem: 'Variantes y pedido claro.', samplePath: '/demo/pizzeria' },
    ],
  },
  {
    title: 'Catálogo / cotización',
    cards: [
      { name: 'Librería', problem: 'Stock y servicios en un mensaje.', samplePath: '/demo?rubro=libreria', rubro: 'libreria' },
      { name: 'Gráfica', problem: 'Cotización con medida en notas.', samplePath: '/demo?rubro=grafica', rubro: 'grafica' },
      { name: 'Pet shop', problem: 'Alimento y accesorios con stock a confirmar.', samplePath: '/demo?rubro=petshop', rubro: 'petshop' },
    ],
  },
  {
    title: 'Mayorista / reposición',
    cards: [
      { name: 'Distribuidora lácteos', problem: 'Pack/caja, reparto y reposición.', samplePath: '/demo?rubro=distribuidora-lacteos', rubro: 'distribuidora-lacteos' },
      { name: 'Molino / insumos', problem: 'Bolsa/bulto y pedido repetido.', samplePath: '/demo?rubro=molino-mayorista&negocio=Molino%20Florida', rubro: 'molino-mayorista' },
    ],
  },
];

function personalizePath(rubro?: ProspectCategory): string {
  if (!rubro) return withAttribution('/demo/armar');
  const search = buildProspectDemoSearch({
    businessName: 'Tu negocio',
    area: 'Zona Norte',
    category: rubro,
    color: 'carbon',
  });
  return withAttribution(`/demo/armar${search}`);
}

export default function DemosGalleryPage() {
  return (
    <div className="min-h-screen bg-[#f2eee6] text-[#171814]">
      <header className="border-b border-black/10 bg-[#171814] text-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to={withAttribution('/')} className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/70 hover:text-white">
            <ArrowLeft size={15} /> Gatrivi.com
          </Link>
          <p className="text-sm font-black">11 muestras</p>
          <Link to={withAttribution('/#reserva')} className="rounded-full bg-[#d7ff64] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#171814]">
            Reservar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl">
          Elegí el rubro. Probá la muestra.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-black/60">
          Demos ilustrativas. Personalizá nombre/color o reservá una muestra a medida en 24 h.
        </p>

        <div className="mt-12 space-y-12">
          {FAMILIES.map(family => (
            <section key={family.title}>
              <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[#ee6847]">{family.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {family.cards.map(card => (
                  <article key={card.name} className="flex flex-col rounded-3xl border border-black/10 bg-[#fbfaf6] p-5">
                    <h3 className="text-xl font-black tracking-[-0.03em]">{card.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-black/55">{card.problem}</p>
                    <div className="mt-5 flex flex-col gap-2">
                      <Link
                        to={withAttribution(card.samplePath)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#171814] px-4 text-sm font-black text-white hover:bg-[#ee6847]"
                      >
                        <Eye size={16} /> Ver muestra
                      </Link>
                      <Link
                        to={personalizePath(card.rubro)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/12 bg-white px-4 text-sm font-black hover:border-black"
                      >
                        <WandSparkles size={16} /> Personalizar
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 text-center text-sm font-bold text-black/45">
          <Link to={withAttribution('/#reserva')} className="inline-flex items-center gap-1 text-[#ee6847] hover:underline">
            Reservar muestra a medida <ArrowRight size={14} />
          </Link>
        </p>
      </main>
    </div>
  );
}
