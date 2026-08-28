import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SALES_PATHS = new Set([
  '/',
  '/oferta',
  '/empezar',
  '/web',
  '/sitio',
  '/tienda',
  '/catalogo',
  '/demos',
  '/precios',
  '/pricing',
  '/planes',
  '/soporte',
  '/mantenimiento',
  '/reservar',
]);

function pathKey(pathname: string) {
  return pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '-');
}

export default function MotionEffects() {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const active = SALES_PATHS.has(location.pathname);
    if (!active) {
      root.classList.remove('zs-sales-motion', 'zs-scrolled');
      delete root.dataset.zsPath;
      return undefined;
    }

    root.classList.add('zs-sales-motion');
    root.dataset.zsPath = pathKey(location.pathname);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const touched = new Set<HTMLElement>();
    let revealObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let scrollFrame = 0;
    let mutationFrame = 0;
    let lastMagnetic: HTMLElement | null = null;

    if (!reduceMotion.matches && 'IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('zs-visible');
            revealObserver?.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
      );
    }

    const enhance = () => {
      const main = document.querySelector<HTMLElement>('#root main');
      if (!main) return;

      if (!main.classList.contains('zs-page-enter')) {
        main.classList.add('zs-page-enter');
        touched.add(main);
      }

      main.querySelectorAll<HTMLElement>('section').forEach((section, index) => {
        if (section.classList.contains('zs-reveal')) return;
        section.classList.add('zs-reveal');
        section.style.setProperty('--zs-delay', `${Math.min(index % 4, 3) * 45}ms`);
        touched.add(section);
        if (reduceMotion.matches || !revealObserver) section.classList.add('zs-visible');
        else revealObserver.observe(section);
      });

      // Reveal individual cards/blocks on scroll, not just whole sections.
      main.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
        if (el.classList.contains('zs-reveal')) return;
        el.classList.add('zs-reveal');
        const delay = Number(el.dataset.delay ?? 0);
        el.style.setProperty('--zs-delay', `${delay}ms`);
        touched.add(el);
        if (reduceMotion.matches || !revealObserver) el.classList.add('zs-visible');
        else revealObserver.observe(el);
      });

      main.querySelectorAll<HTMLElement>('article, a.group, [data-motion-surface]').forEach(surface => {
        surface.classList.add('zs-interactive-surface');
        touched.add(surface);
      });

      main.querySelectorAll<HTMLElement>('a.rounded-full, button.rounded-full').forEach(control => {
        control.classList.add('zs-magnetic');
        touched.add(control);
      });
    };

    enhance();
    const appRoot = document.getElementById('root') ?? document.body;
    mutationObserver = new MutationObserver(() => {
      if (mutationFrame) return;
      mutationFrame = requestAnimationFrame(() => {
        mutationFrame = 0;
        enhance();
      });
    });
    mutationObserver.observe(appRoot, { childList: true, subtree: true });

    const paintScroll = () => {
      scrollFrame = 0;
      const max = root.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      root.style.setProperty('--zs-scroll-progress', String(progress));
      // Parallax del héroe: se mueve a ~60% de la velocidad del scroll pero con límite suave.
      const parallax = Math.min(window.scrollY * 0.18, 260);
      root.style.setProperty('--zs-parallax-y', reduceMotion.matches ? '0px' : `${parallax}px`);
      root.classList.toggle('zs-scrolled', window.scrollY > 18);
    };

    const onScroll = () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
    };

    paintScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const resetMagnetic = () => {
      if (!lastMagnetic) return;
      lastMagnetic.style.removeProperty('--zs-magnet-x');
      lastMagnetic.style.removeProperty('--zs-magnet-y');
      lastMagnetic = null;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reduceMotion.matches) return;
      root.style.setProperty('--zs-pointer-x', `${event.clientX}px`);
      root.style.setProperty('--zs-pointer-y', `${event.clientY}px`);

      const target = event.target instanceof Element ? event.target : null;
      const magnetic = target?.closest<HTMLElement>('.zs-magnetic') ?? null;
      if (lastMagnetic && lastMagnetic !== magnetic) resetMagnetic();
      if (!magnetic) return;

      const rect = magnetic.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
      magnetic.style.setProperty('--zs-magnet-x', `${x}px`);
      magnetic.style.setProperty('--zs-magnet-y', `${y}px`);
      lastMagnetic = magnetic;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      revealObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      if (mutationFrame) cancelAnimationFrame(mutationFrame);
      resetMagnetic();

      touched.forEach(element => {
        element.classList.remove('zs-reveal', 'zs-visible', 'zs-interactive-surface', 'zs-magnetic', 'zs-page-enter');
        element.style.removeProperty('--zs-delay');
      });
      root.classList.remove('zs-sales-motion', 'zs-scrolled');
      root.style.removeProperty('--zs-scroll-progress');
      root.style.removeProperty('--zs-pointer-x');
      root.style.removeProperty('--zs-pointer-y');
      delete root.dataset.zsPath;
    };
  }, [location.pathname]);

  return (
    <div className="zs-motion-ui" aria-hidden="true">
      <div className="zs-pointer-aura" />
      <div className="zs-scroll-progress" />
    </div>
  );
}
