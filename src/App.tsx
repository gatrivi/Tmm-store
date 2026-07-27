import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const CommerceApp = lazy(() => import('./CommerceApp'));
const DemoOwnerPage = lazy(() => import('./pages/DemoOwnerPage'));
const ProspectDemoBuilderPage = lazy(() => import('./pages/ProspectDemoBuilderPage'));

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2eee6] text-[#171814]">
      <div className="flex items-center gap-3 text-sm font-black">
        <span className="h-3 w-3 animate-pulse rounded-full bg-[#ee6847]" />
        Cargando Trufi…
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
          <Route path="/pricing" element={<Navigate to="/#planes" replace />} />
          <Route path="/demo/armar" element={<ProspectDemoBuilderPage />} />
          <Route path="/demo/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/carniceria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/pizzeria/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/panaderia/owner" element={<DemoOwnerPage />} />
          <Route path="/demo/mamabel/owner" element={<DemoOwnerPage />} />
          <Route path="/*" element={<CommerceApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
