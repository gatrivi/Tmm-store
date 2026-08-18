import { ArrowRight } from 'lucide-react';
import PanaderiaDemoPage from './PanaderiaDemoPage';

export default function PanaderiaDemoMinimalPage() {
  const goToMenu = () => {
    document.getElementById('menu-panaderia')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f4f8fb] text-[#0b1f33]">
      <style>{`
        .panaderia-legacy > div > div:first-child,
        .panaderia-legacy > div > header,
        .panaderia-legacy > div > main > section:first-child,
        .panaderia-legacy > div > main > section:nth-child(2) {
          display: none !important;
        }
      `}</style>

      <header className="border-b border-[#0b1f33]/10 bg-[#f4f8fb]">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/demos/panaderia/logo-blueprint.png"
              alt="La Magdalena"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-serif text-lg font-black leading-none">La Magdalena</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#2e6fa8]">
                Panadería artesanal
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-6">
        <section className="relative min-h-[calc(100svh-5.5rem)] overflow-hidden rounded-[1.75rem] bg-[#0b1f33] shadow-xl sm:min-h-[680px] sm:rounded-[2.25rem]">
          <img
            src="/demos/panaderia/products/medialunas.jpg"
            alt="Medialunas de manteca recién horneadas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071a2c] via-[#071a2c]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:max-w-3xl sm:p-10 md:p-12">
            <h1 className="max-w-2xl font-serif text-[clamp(3rem,14vw,6.5rem)] font-black leading-[0.84] tracking-[-0.055em]">
              Tus medialunas,
              <span className="block text-[#d7ebf7]">listas a las 7.</span>
            </h1>
            <p className="mt-5 text-base font-bold text-white/82 sm:text-lg">
              Elegí · reservá horario · retirá.
            </p>
            <button
              type="button"
              onClick={goToMenu}
              className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-[#0b1f33] shadow-xl transition hover:-translate-y-0.5 sm:w-fit"
            >
              Elegir facturas <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>

      <div className="panaderia-legacy">
        <PanaderiaDemoPage />
      </div>
    </div>
  );
}
