import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { DEMO_EXPRESS_ARMAR_PUBLIC, DEMO_EXPRESS_FALLBACK, DEMO_EXPRESS_PUBLIC } from './config/demoExpress';

const CommerceApp = lazy(() => import('./CommerceApp'));
const DemoOwnerPage = lazy(() => import('./pages/DemoOwnerPage'));
const ProspectDemoBuilderPage = lazy(() => import('./pages/ProspectDemoBuilderPage'));
const DemosGalleryPage = lazy(() => import('./pages/DemosGalleryPage'));

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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demos" element={<DemosGalleryPage />} />
          <Route path="/pricing" element={<Navigate to="/#planes" replace />} />
          <Route path="/demo/armar" element={DEMO_EXPRESS_ARMAR_PUBLIC ? <ProspectDemoBuilderPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />
          <Route path="/demo/owner" element={DEMO_EXPRESS_PUBLIC ? <DemoOwnerPage /> : <Navigate to={DEMO_EXPRESS_FALLBACK} replace />} />
          <Route path="/demo/carniceria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/canavesi/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/pizzeria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/panaderia/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamabel/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/aguacats/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/verduleria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamamabel/owner" element={<Navigate to="/demo/mamabel/owner" replace />} />
          <Route path="*" element={<CommerceApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
