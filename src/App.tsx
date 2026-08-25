import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DemoShareFooter from './components/DemoShareFooter';
import MotionEffects from './components/MotionEffects';
import PricingShareButton from './components/PricingShareButton';
import { ThemeToggle } from './components/ThemeToggle';
import { DEMO_EXPRESS_FALLBACK, DEMO_EXPRESS_PUBLIC } from './config/demoExpress';

const CommerceApp = lazy(() => import('./CommerceApp'));
const DemoOwnerPage = lazy(() => import('./pages/DemoOwnerPage'));
const ProspectDemoBuilderPage = lazy(() => import('./pages/ProspectDemoBuilderPage'));
const DemosGalleryPage = lazy(() => import('./pages/DemosGalleryPageV2'));
const HeladeriaDemoPage = lazy(() => import('./pages/HeladeriaDemoPage'));
const CafeRocaDemoPage = lazy(() => import('./pages/CafeRocaDemoPage'));
const PanaderiaDemoMinimalPage = lazy(() => import('./pages/PanaderiaDemoMinimalPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const SalesDepositPage = lazy(() => import('./pages/SalesDepositPage'));
const SupportPlansPage = lazy(() => import('./pages/SupportPlansPage'));
const FlyerFunnelPage = lazy(() => import('./pages/FlyerFunnelPage'));

const SALES_PATHS = ['/', '/oferta', '/empezar', '/web', '/sitio', '/tienda', '/catalogo', '/precios', '/demos'];

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2eee6] text-[#171814]">
      <div className="flex items-center gap-3 text-sm font-black">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#ee6847]" />
        Cargando Gatrivi.com…
      </div>
    </div>
  );
}

function PricingReserveBar() {
  const location = useLocation();
  const show = location.pathname === '/precios';
  if (!show) return null;

  return (
    <Link
      to="/reservar?plan=standard"
      className="fixed inset-x-3 bottom-3 z-[70] flex min-h-14 items-center justify-center rounded-full bg-[#ff6b35] px-6 text-sm font-black text-white shadow-2xl transition hover:-translate-y-0.5 md:inset-x-auto md:bottom-5 md:right-5"
    >
      Reservar con seña · $65.000
    </Link>
  );
}

function SalesThemeScope() {
  const location = useLocation();
  const active = SALES_PATHS.includes(location.pathname);

  useEffect(() => {
    document.body.classList.toggle('sales-theme', active);
    return () => document.body.classList.remove('sales-theme');
  }, [active]);

  return null;
}

// Sales pages keep one obvious, mobile-safe theme control.
function SalesThemeToggle() {
  const location = useLocation();
  const bottomBarPaths = ['/oferta', '/empezar', '/web', '/sitio', '/tienda', '/catalogo', '/precios'];
  const show = SALES_PATHS.includes(location.pathname);
  if (!show) return null;

  const clearsMobileBar = bottomBarPaths.includes(location.pathname);

  return (
    <div className={`fixed left-4 z-[90] ${clearsMobileBar ? 'bottom-20 md:bottom-4' : 'bottom-4'}`}>
      <ThemeToggle showLabel />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SalesThemeScope />
      <MotionEffects />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Ruta comercial principal y accesos cortos para flyer/outreach. */}
          <Route path="/oferta" element={<FlyerFunnelPage />} />
          <Route path="/empezar" element={<FlyerFunnelPage />} />
          <Route path="/web" element={<FlyerFunnelPage />} />
          <Route path="/sitio" element={<FlyerFunnelPage />} />
          <Route path="/tienda" element={<FlyerFunnelPage />} />
          <Route path="/catalogo" element={<FlyerFunnelPage />} />

          <Route path="/demos" element={<DemosGalleryPage />} />

          {/* /precios es la URL pública canónica. Conservamos las antiguas sin duplicar contenido. */}
          <Route path="/precios" element={<PricingPage />} />
          <Route path="/pricing" element={<Navigate to="/precios" replace />} />
          <Route path="/planes" element={<Navigate to="/precios" replace />} />

          <Route path="/soporte" element={<SupportPlansPage />} />
          <Route path="/mantenimiento" element={<SupportPlansPage />} />
          <Route path="/reservar" element={<SalesDepositPage />} />

          <Route path="/panaderia" element={<PanaderiaDemoMinimalPage />} />
          <Route path="/demo/panaderia" element={<PanaderiaDemoMinimalPage />} />
          <Route path="/heladeria" element={<HeladeriaDemoPage />} />
          <Route path="/cafe-roca" element={<CafeRocaDemoPage />} />
          <Route path="/demo/heladeria" element={<HeladeriaDemoPage />} />
          <Route path="/demo/cafe-roca" element={<CafeRocaDemoPage />} />

          <Route path="/demo/armar" element={DEMO_EXPRESS_PUBLIC ? <ProspectDemoBuilderPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />
          <Route path="/demo/owner" element={DEMO_EXPRESS_PUBLIC ? <DemoOwnerPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />

          <Route path="/carniceria/owner" element={<DemoOwnerPage />} />
          <Route path="/canavesi/owner" element={<DemoOwnerPage />} />
          <Route path="/pizzeria/owner" element={<DemoOwnerPage />} />
          <Route path="/panaderia/owner" element={<DemoOwnerPage />} />
          <Route path="/ferreteria/owner" element={<DemoOwnerPage />} />
          <Route path="/mamabel/owner" element={<DemoOwnerPage />} />
          <Route path="/aguacats/owner" element={<DemoOwnerPage />} />
          <Route path="/verduleria/owner" element={<DemoOwnerPage />} />
          <Route path="/zimba-pet/owner" element={<DemoOwnerPage />} />

          <Route path="/demo/carniceria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/canavesi/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/pizzeria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/panaderia/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/ferreteria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamabel/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/aguacats/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/verduleria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/zimba-pet/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/confiteria-parana/owner" element={<DemoOwnerPage />} />
          <Route path="/confiteria-parana/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/el-mirasol/owner" element={<DemoOwnerPage />} />
          <Route path="/el-mirasol/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/polleria/owner" element={<DemoOwnerPage />} />
          <Route path="/polleria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/molino-florida/owner" element={<DemoOwnerPage />} />
          <Route path="/molino-florida/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamamabel/owner" element={<Navigate to="/mamabel/owner" replace />} />

          <Route path="*" element={<CommerceApp />} />
        </Routes>
        <DemoShareFooter />
        <PricingReserveBar />
        <PricingShareButton />
        <SalesThemeToggle />
      </Suspense>
    </BrowserRouter>
  );
}