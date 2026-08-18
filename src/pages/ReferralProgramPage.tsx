import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  MapPin,
  QrCode,
  ScanLine,
  WalletCards,
} from 'lucide-react';

const steps = [
  ['01', 'Creá tu cuenta', 'Te damos un código de referido y un panel propio.'],
  ['02', 'Generá flyers', 'Cada volante tiene un ID y un QR únicos.'],
  ['03', 'Registrá dónde va', 'Guardás ubicación, nota y GPS opcional para saber qué zona rinde.'],
  ['04', 'Medimos el recorrido', 'Scan → contacto → venta. El flyer sigue atribuido durante la visita.'],
  ['05', 'Cobrás comisión', 'Cuando una venta queda validada, aparece en tu saldo y pasa a aprobada/pagada.'],
] as const;

const metrics = [
  { icon: ScanLine, title: 'Escaneos', copy: 'Cuántas personas abrieron cada QR.' },
  { icon: BarChart3, title: 'Contactos', copy: 'Cuántas avanzaron a WhatsApp o email.' },
  { icon: MapPin, title: 'Ubicaciones', copy: 'Qué comercio, esquina o zona convierte mejor.' },
  { icon: BadgeDollarSign, title: 'Ventas', copy: 'Qué flyer terminó produciendo ingresos.' },
] as const;

export default function ReferralProgramPage() {
  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="border-b border-black/10 bg-[#f5f2eb]">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={16} /> GATRIVI.COM
          </Link>
          <Link
            to="/referidos"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
          >
            Crear cuenta <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-black text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff8a5c]">Programa de referidos</p>
              <h1 className="mt-5 max-w-4xl text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-[-0.07em]">
                Recomendá Gatrivi. Medí qué funciona. Cobrá por las ventas.
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-white/65 sm:text-xl">
                Generás flyers con QR propio, registrás dónde los dejaste y ves qué ubicación produce escaneos, contactos y clientes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/referidos" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-7 font-black text-white">
                  Empezar <ArrowRight size={18} />
                </Link>
                <a href="#como-funciona" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 px-7 text-sm font-black text-white">
                  Ver cómo funciona
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/15 bg-white/5 p-7 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Comisión de lanzamiento</p>
              <p className="mt-4 text-7xl font-black tracking-[-0.07em] text-[#ff8a5c]">15%</p>
              <p className="mt-2 font-bold text-white/65">sobre cada venta validada atribuida a tu referido.</p>
              <div className="my-6 h-px bg-white/10" />
              <div className="space-y-3 text-sm font-bold text-white/70">
                <p>$325.000 vendidos → $48.750 de comisión</p>
                <p>$650.000 vendidos → $97.500 de comisión</p>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-white/40">
                No se paga por escaneo ni por contacto. La comisión se genera cuando la venta es validada.
              </p>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Cómo funciona</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.055em] sm:text-5xl">Un flyer deja de ser papel anónimo.</h2>
            <div className="mt-10 grid gap-3 lg:grid-cols-5">
              {steps.map(([number, title, copy]) => (
                <article key={number} className="rounded-2xl border border-black/10 bg-[#f5f2eb] p-5">
                  <span className="text-xs font-black text-[#d84d1d]">{number}</span>
                  <h3 className="mt-5 text-lg font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/55">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <QrCode size={34} className="text-[#d84d1d]" />
              <h2 className="mt-5 text-4xl font-black tracking-[-0.055em]">Cada flyer tiene identidad propia.</h2>
              <p className="mt-5 leading-relaxed text-black/55">
                Un mismo referidor puede imprimir muchos volantes. Cada copia tiene su propio ID, por ejemplo <b>FLY-8K2A-00417</b>. Así no mezclamos rendimiento entre ubicaciones.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map(({ icon: Icon, title, copy }) => (
                <article key={title} className="rounded-2xl border border-black/10 bg-white p-6">
                  <Icon size={23} className="text-[#d84d1d]" />
                  <h3 className="mt-4 font-black">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#171717] py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <WalletCards size={34} className="text-[#ff8a5c]" />
              <h2 className="mt-5 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Tu panel muestra plata, no sólo visitas.</h2>
              <p className="mt-5 max-w-xl leading-relaxed text-white/55">
                Ves saldo pendiente, aprobado y pagado; además del ranking de flyers y ubicaciones. La venta queda enlazada al flyer que originó el contacto.
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7">
              {[
                'Cuenta y código de referido',
                'Flyers A6 listos para imprimir',
                'QR único por flyer',
                'Ubicación + GPS opcional',
                'Scans y contactos por ubicación',
                'Ventas y comisión acumulada',
                'Estado pendiente / aprobado / pagado',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                  <CheckCircle2 size={18} className="shrink-0 text-[#ff8a5c]" />
                  <span className="text-sm font-bold text-white/75">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-4xl font-black tracking-[-0.06em] sm:text-6xl">Probalo con un flyer.</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-black/55">
              Creá tu cuenta, generá un QR y registrá dónde lo dejaste. El panel se ocupa del resto.
            </p>
            <Link to="/referidos" className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-black px-8 font-black text-white">
              Crear cuenta de referidor <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
