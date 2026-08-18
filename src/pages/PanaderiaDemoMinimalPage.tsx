import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PanaderiaDemoPage from './PanaderiaDemoPage';

export default function PanaderiaDemoMinimalPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroBrandOpacity = useTransform(scrollYProgress, [0, 0.1, 0.28], [1, 1, 0]);
  const heroBrandY = useTransform(scrollYProgress, [0, 0.3], [0, -26]);
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.16, 0.52], [1, 1, 0]);
  const heroCopyY = useTransform(scrollYProgress, [0, 0.52], [0, -28]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.07]);

  const headerOpacity = useTransform(scrollYProgress, [0.08, 0.24], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.08, 0.24], [-18, 0]);
  const headerScale = useTransform(scrollYProgress, [0.08, 0.24], [0.94, 1]);

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

      <motion.header
        style={{ opacity: headerOpacity, y: headerY }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-[#0b1f33]/10 bg-[#f4f8fb]/92 shadow-sm backdrop-blur-xl"
      >
        <motion.div
          style={{ scale: headerScale }}
          className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6"
        >
          <div className="flex items-center gap-3">
            <img
              src="/demos/panaderia/logo-blueprint.png"
              alt=""
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />
            <div>
              <p className="font-serif text-lg font-black leading-none">La Magdalena</p>
              <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#2e6fa8]">
                Panadería artesanal
              </p>
            </div>
          </div>
        </motion.div>
      </motion.header>

      <main>
        <section
          ref={heroRef}
          className="relative min-h-[100svh] overflow-hidden bg-[#071a2c] text-white"
        >
          <motion.img
            style={{ scale: imageScale }}
            src="/demos/panaderia/products/medialunas.jpg"
            alt="Medialunas de manteca recién horneadas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071a2c]/55 via-[#071a2c]/10 to-[#071a2c]/90" />

          <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-between px-5 pb-8 pt-7 sm:px-8 sm:pb-12 sm:pt-10 md:px-12">
            <motion.div
              style={{ opacity: heroBrandOpacity, y: heroBrandY }}
              className="flex items-center gap-4 sm:gap-5"
            >
              <img
                src="/demos/panaderia/logo-blueprint.png"
                alt="La Magdalena"
                className="h-20 w-20 rounded-[1.35rem] object-cover shadow-2xl ring-1 ring-white/20 sm:h-24 sm:w-24"
              />
              <div className="drop-shadow-lg">
                <p className="font-serif text-[clamp(2rem,8vw,3.4rem)] font-black leading-[0.9] tracking-[-0.035em]">
                  La Magdalena
                </p>
                <p className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#d7ebf7] sm:text-xs">
                  Panadería artesanal · Olivos
                </p>
              </div>
            </motion.div>

            <motion.div
              style={{ opacity: heroCopyOpacity, y: heroCopyY }}
              className="max-w-3xl pb-2"
            >
              <h1 className="max-w-2xl font-serif text-[clamp(3.5rem,15vw,7.4rem)] font-black leading-[0.82] tracking-[-0.06em] drop-shadow-xl">
                Tus medialunas,
                <span className="block text-[#d7ebf7]">listas a las 7.</span>
              </h1>
              <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={goToMenu}
                  className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#0b1f33] shadow-2xl transition duration-300 hover:-translate-y-1 hover:shadow-white/15 sm:w-fit"
                >
                  Elegir facturas <ArrowRight size={18} />
                </button>
                <p className="text-sm font-bold text-white/78 sm:text-base">
                  Elegí · reservá horario · retirá.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <div className="panaderia-legacy">
        <PanaderiaDemoPage />
      </div>
    </div>
  );
}
