import { useMemo, useState } from 'react';
import { ArrowLeft, Check, ChevronLeft, IceCreamBowl, Plus, ShoppingBag, UserRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';

type Flavor = {
  id: string;
  name: string;
  group: string;
  image: string;
};

type Portion = {
  id: number;
  name: string;
  flavors: string[];
};

const FLAVORS: Flavor[] = [
  { id: 'ddl', name: 'Dulce de leche', group: 'Clásicos', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=82' },
  { id: 'ddl-granizado', name: 'DDL granizado', group: 'Clásicos', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=700&q=82' },
  { id: 'chocolate', name: 'Chocolate', group: 'Chocolates', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=700&q=82' },
  { id: 'choco-amargo', name: 'Chocolate amargo', group: 'Chocolates', image: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=700&q=82' },
  { id: 'tramontana', name: 'Tramontana', group: 'Cremas', image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=700&q=82' },
  { id: 'americana', name: 'Crema americana', group: 'Cremas', image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&w=700&q=82' },
  { id: 'frutilla', name: 'Frutilla a la crema', group: 'Frutales', image: 'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?auto=format&fit=crop&w=700&q=82' },
  { id: 'limon', name: 'Limón', group: 'Frutales', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=82' },
  { id: 'maracuya', name: 'Maracuyá', group: 'Frutales', image: 'https://images.unsplash.com/photo-1532678465554-94846274c297?auto=format&fit=crop&w=700&q=82' },
  { id: 'menta', name: 'Menta granizada', group: 'Cremas', image: 'https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&w=700&q=82' },
  { id: 'pistacho', name: 'Pistacho', group: 'Cremas', image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=700&q=82' },
  { id: 'banana', name: 'Banana split', group: 'Especiales', image: 'https://images.unsplash.com/photo-1579954115563-e72bf1381629?auto=format&fit=crop&w=700&q=82' },
];

const makePortion = (id: number): Portion => ({ id, name: '', flavors: [] });

export default function HeladeriaDemoPage() {
  const [portions, setPortions] = useState<Portion[]>([makePortion(1)]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const active = portions[activeIndex];

  const totalGrams = portions.length * 250;
  const selectedFlavors = useMemo(
    () => active.flavors.map(id => FLAVORS.find(flavor => flavor.id === id)).filter(Boolean) as Flavor[],
    [active.flavors],
  );

  const updateActive = (patch: Partial<Portion>) => {
    setPortions(current => current.map((portion, index) => index === activeIndex ? { ...portion, ...patch } : portion));
  };

  const toggleFlavor = (id: string) => {
    const selected = active.flavors.includes(id);
    if (!selected && active.flavors.length >= 3) return;
    updateActive({ flavors: selected ? active.flavors.filter(flavorId => flavorId !== id) : [...active.flavors, id] });
  };

  const addNext = () => {
    if (!active.name.trim() || active.flavors.length === 0) return;
    const next = makePortion(portions.length + 1);
    setPortions(current => [...current, next]);
    setActiveIndex(portions.length);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removePortion = (index: number) => {
    if (portions.length === 1) return;
    const next = portions.filter((_, currentIndex) => currentIndex !== index);
    setPortions(next.map((portion, currentIndex) => ({ ...portion, id: currentIndex + 1 })));
    setActiveIndex(Math.max(0, Math.min(index - 1, next.length - 1)));
  };

  const whatsappHref = useMemo(() => {
    const detail = portions
      .filter(portion => portion.name.trim() && portion.flavors.length)
      .map((portion, index) => {
        const names = portion.flavors
          .map(id => FLAVORS.find(flavor => flavor.id === id)?.name)
          .filter(Boolean)
          .join(', ');
        return `${index + 1}. 1/4 para ${portion.name}: ${names}`;
      })
      .join('\n');
    return `https://wa.me/?text=${encodeURIComponent(`Hola! Quiero pedir helado:\n${detail}\n\nTotal: ${totalGrams / 1000} kg`)}`;
  }, [portions, totalGrams]);

  const canContinue = Boolean(active.name.trim() && active.flavors.length > 0);

  return (
    <div className="min-h-screen bg-[#fffaf4] text-[#231c19] selection:bg-[#ef476f] selection:text-white">
      <header className="sticky top-0 z-40 border-b border-[#231c19]/10 bg-[#fffaf4]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/demos" className="flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">Muestras</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd166]"><IceCreamBowl size={19} /></span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef476f]">Demo heladería</p>
              <p className="text-sm font-black">Helados del Barrio</p>
            </div>
          </div>
          <button onClick={() => setSummaryOpen(true)} className="flex min-h-10 items-center gap-2 rounded-full bg-[#231c19] px-4 text-xs font-black text-white">
            <ShoppingBag size={15} />
            {portions.length} × 1/4
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-32 pt-7 sm:px-6 sm:pt-10">
        <section className="mx-auto max-w-3xl">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ef476f]">Armá el pedido por persona</p>
              <h1 className="mt-2 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                Este 1/4 es para…
              </h1>
            </div>
            <div className="hidden rounded-2xl bg-white px-4 py-3 text-right shadow-sm sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/40">Pedido</p>
              <p className="font-black">{totalGrams >= 1000 ? `${totalGrams / 1000} kg` : `${totalGrams} g`}</p>
            </div>
          </div>

          <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
            {portions.map((portion, index) => (
              <button
                key={portion.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-black transition ${index === activeIndex ? 'border-[#231c19] bg-[#231c19] text-white' : 'border-[#231c19]/10 bg-white text-[#231c19]/60'}`}
              >
                {index + 1}º · {portion.name || 'sin nombre'}
              </button>
            ))}
          </div>

          <label className="block rounded-[1.7rem] border border-[#231c19]/10 bg-white p-5 shadow-[0_12px_30px_rgba(70,40,20,0.05)]">
            <span className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-black/45"><UserRound size={15} /> Nombre</span>
            <input
              autoFocus
              value={active.name}
              onChange={event => updateActive({ name: event.target.value })}
              placeholder="Rodrigo, Paula, Gastón…"
              className="w-full border-0 bg-transparent text-3xl font-black tracking-[-0.035em] outline-none placeholder:text-black/20"
            />
          </label>

          <div className="mb-4 mt-9 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.13em] text-black/40">Elegí hasta 3</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.035em]">Sabores para {active.name || 'esta persona'}</h2>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${active.flavors.length === 3 ? 'bg-[#06d6a0] text-[#153a31]' : 'bg-[#ffd166] text-[#4b3b00]'}`}>
              {active.flavors.length}/3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {FLAVORS.map(flavor => {
              const selected = active.flavors.includes(flavor.id);
              const blocked = !selected && active.flavors.length >= 3;
              return (
                <button
                  key={flavor.id}
                  type="button"
                  onClick={() => toggleFlavor(flavor.id)}
                  aria-pressed={selected}
                  className={`group overflow-hidden rounded-[1.35rem] border bg-white text-left transition ${selected ? 'border-[#ef476f] ring-2 ring-[#ef476f]' : 'border-[#231c19]/10'} ${blocked ? 'opacity-45' : 'hover:-translate-y-0.5'}`}
                >
                  <div className="relative aspect-square overflow-hidden bg-[#f4eadf]">
                    <img src={flavor.image} alt={flavor.name} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    {selected && <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#ef476f] text-white shadow"><Check size={17} strokeWidth={3} /></span>}
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.11em] text-black/35">{flavor.group}</p>
                    <p className="mt-1 text-sm font-black leading-tight">{flavor.name}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {selectedFlavors.length > 0 && (
            <div className="mt-6 rounded-[1.5rem] bg-[#231c19] p-5 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.13em] text-white/45">1/4 de {active.name || '…'}</p>
              <p className="mt-2 text-lg font-black">{selectedFlavors.map(flavor => flavor.name).join(' · ')}</p>
            </div>
          )}
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-[#fffaf4]/95 p-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-2">
          {activeIndex > 0 && (
            <button onClick={() => setActiveIndex(index => index - 1)} className="flex min-h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white" aria-label="Cuarto anterior"><ChevronLeft /></button>
          )}
          <button
            type="button"
            disabled={!canContinue}
            onClick={addNext}
            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#ef476f] px-5 text-sm font-black text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-35"
          >
            <Plus size={18} /> Siguiente 1/4
          </button>
          <button
            type="button"
            onClick={() => setSummaryOpen(true)}
            className="min-h-14 rounded-full bg-[#231c19] px-5 text-sm font-black text-white"
          >
            Ver pedido
          </button>
        </div>
      </div>

      {summaryOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-label="Resumen del pedido">
          <div className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-[2rem] bg-[#fffaf4] p-5 shadow-2xl sm:rounded-[2rem] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.13em] text-[#ef476f]">Tu pedido</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.045em]">Cada cuarto, clarito.</h2>
              </div>
              <button onClick={() => setSummaryOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5" aria-label="Cerrar"><X size={18} /></button>
            </div>

            <div className="mt-6 space-y-3">
              {portions.map((portion, index) => (
                <div key={portion.id} className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">{index + 1}º cuarto · 250 g</p>
                      <p className="mt-1 text-lg font-black">{portion.name || 'Sin nombre'}</p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-black/55">
                        {portion.flavors.length ? portion.flavors.map(id => FLAVORS.find(flavor => flavor.id === id)?.name).filter(Boolean).join(' · ') : 'Todavía sin sabores'}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setActiveIndex(index); setSummaryOpen(false); }} className="rounded-full bg-black/5 px-3 py-2 text-[10px] font-black">Editar</button>
                      {portions.length > 1 && <button onClick={() => removePortion(index)} className="flex h-8 w-8 items-center justify-center rounded-full text-black/35 hover:bg-black/5" aria-label="Eliminar cuarto"><X size={14} /></button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#ffd166] p-4">
              <span className="text-sm font-black">Total</span>
              <span className="text-xl font-black">{totalGrams >= 1000 ? `${totalGrams / 1000} kg` : `${totalGrams} g`}</span>
            </div>

            <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#06d6a0] px-5 text-sm font-black text-[#12382f]">
              <ShoppingBag size={18} /> Pedir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
