import { lazy, Suspense } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { DEMO_EXPRESS_FALLBACK, DEMO_EXPRESS_PUBLIC } from './config/demoExpress';

const CommerceApp = lazy(() => import('./CommerceApp'));
const DemoOwnerPage = lazy(() => import('./pages/DemoOwnerPage'));
const ProspectDemoBuilderPage = lazy(() => import('./pages/ProspectDemoBuilderPage'));
const DemosGalleryPage = lazy(() => import('./pages/DemosGalleryPage'));
const HeladeriaDemoPage = lazy(() => import('./pages/HeladeriaDemoPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const SalesDepositPage = lazy(() => import('./pages/SalesDepositPage'));

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
  const show = location.pathname === '/pricing' || location.pathname === '/planes';
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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demos" element={<DemosGalleryPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/planes" element={<PricingPage />} />
          <Route path="/reservar" element={<SalesDepositPage />} />
          <Route path="/demo/heladeria" element={<HeladeriaDemoPage />} />
          <Route path="/demo/armar" element={DEMO_EXPRESS_PUBLIC ? <ProspectDemoBuilderPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />
          <Route path="/demo/owner" element={DEMO_EXPRESS_PUBLIC ? <DemoOwnerPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />
          <Route path="/demo/carniceria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/canavesi/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/pizzeria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/panaderia/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/ferreteria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamabel/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/aguacats/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/verduleria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/zimba-pet/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/vintagedealers/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamamabel/owner" element={<Navigate to="/demo/mamabel/owner" replace />} />
          <Route path="*" element={<CommerceApp />} />
        </Routes>
        <PricingReserveBar />
      </Suspense>
    </BrowserRouter>
  );
}
