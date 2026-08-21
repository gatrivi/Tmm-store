import { ArrowLeft, ArrowUpRight, Code2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { withAttribution } from '../utils/demoIntake';

const projects = [
  ['Navarro Vial', 'Sitio para constructora e infraestructura.', '/about/navarro-vial.jpg'],
  ['CatReader', 'Lector y sistema de descubrimiento de libros.', '/about/catreader.jpg'],
  ['Rosario Cards', 'Aplicación de oración y devociones.', '/about/rosario-cards.jpg'],
  ['CatIntAssist', 'Asistente para interpretación médica.', '/about/catintassist.jpg'],
  ['Aguacats', 'Catálogo y landing comercial.', '/about/aguacats.jpg'],
] as const;

function ProjectCard({ name, description, image }: { name: string; description: string; image: string }) {
  return (
    <article className="group rounded-[1.75rem] border border-black/10 bg-white/65 p-3 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.4rem] bg-[#171814]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0 transition group-hover:opacity-100" onError={e => { e.currentTarget.style.display = 'none'; }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,255,100,0.22),transparent_34%),linear-gradient(135deg,#171814,#34362a)]" />
        <div className="relative flex h-full flex-col justify-between p-5 text-white">
          <div className="flex items-center justify-between text-[#d7ff64]"><Code2 size={21} /><span className="text-[10px] font-black uppercase tracking-[0.16em]">Proyecto</span></div>
          <p className="max-w-[12rem] text-2xl font-black leading-[0.95] tracking-[-0.05em]">{name}</p>
        </div>
      </div>
      <div className="p-3 pb-2">
        <h3 className="text-2xl font-black tracking-[-0.04em]">{name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-relaxed text-black/55">{description}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-black/30">Ver proyecto próximamente</span>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2eee6] text-[#171814]">
      <header className="border-b border-black/10 bg-[#171814] text-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to={withAttribution('/')} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/70 hover:text-white"><ArrowLeft size={15} /><img src="/logo.jpg" alt="" className="h-7 w-7 rounded-full object-cover" /> Gatrivi.com</Link>
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#d7ff64]">Sobre nosotros</span>
        </div>
      </header>
      <main>
        <section className="border-b border-black/8 px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div><p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-[#ee6847]">Hecho por alguien que también construye productos</p><h1 className="max-w-3xl text-5xl font-black leading-[0.9] tracking-[-0.07em] sm:text-7xl">Software con oficio. <span className="text-[#ee6847]">Negocios más claros.</span></h1></div>
          <div className="rounded-[2rem] border border-black/10 bg-white/60 p-6 text-lg leading-relaxed text-black/65 shadow-sm sm:p-8"><p>Soy <strong className="text-black">Gastón Trivi</strong>, desarrollador full-stack y fundador de <strong className="text-black">Zengasoft</strong>.</p><p className="mt-4">Trabajo con React, Node y herramientas de IA para crear sitios, catálogos y aplicaciones que resuelven problemas concretos.</p></div>
        </div></section>
        <section className="border-b border-black/8 bg-[#fbfaf6] px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.7fr_1.3fr]"><div><p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#ee6847]">Por qué existe Gatrivi</p><h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">La tecnología tiene que hacer el trabajo más simple.</h2></div><div className="max-w-2xl space-y-5 text-lg leading-relaxed text-black/62"><p>TMM nació de esa misma idea: darle a una pyme una presencia digital clara, útil y fácil de mantener, sin convertir cada cambio en un proyecto nuevo.</p><p>La misma lógica sirve para una tienda, una carta, un catálogo de servicios o una herramienta interna: mostrar lo importante, ordenar la decisión y hacer fácil el siguiente paso.</p></div></div></section>
        <section className="px-4 py-16 sm:px-6 sm:py-24"><div className="mx-auto max-w-6xl"><div className="flex items-end justify-between"><div><p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#ee6847]">Otros trabajos</p><h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Algunas cosas que desarrollé.</h2></div><Sparkles className="hidden text-[#ee6847] sm:block" size={32} /></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{projects.map(([name, description, image]) => <ProjectCard key={name} name={name} description={description} image={image} />)}</div></div></section>
        <section className="border-y border-black/8 bg-[#171814] px-4 py-16 text-white sm:px-6 sm:py-24"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><div><p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#d7ff64]">También funciona como catálogo</p><h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">Foto → producto → descripción → acción.</h2></div><p className="max-w-2xl text-lg leading-relaxed text-white/60">Si funciona para mostrar software, también funciona para tortas, repuestos, alimentos, servicios o cualquier catálogo comercial.</p></div></section>
        <section className="px-4 py-14 sm:px-6 sm:py-20"><div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[2rem] bg-[#ee6847] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">¿Querés verlo aplicado a tu negocio?</p><h2 className="mt-2 text-3xl font-black tracking-[-0.04em]">Primero te mostramos. Después decidís.</h2></div><Link to={withAttribution('/#reserva')} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#171814] px-5 text-sm font-black text-white hover:bg-[#d7ff64] hover:text-[#171814]">Ver una muestra <ArrowUpRight size={16} /></Link></div></section>
      </main>
    </div>
  );
}
