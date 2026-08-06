import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import OrderStatusPage from './pages/OrderStatusPage';
import AguacatsDemoPage from './pages/AguacatsDemoPage';
import MamabelDemoPage from './pages/MamabelDemoPage';
import Storefront from './pages/Storefront';
import SuperAdminPage from './pages/SuperAdminPage';
import WeightedCatalogDemoPage from './pages/WeightedCatalogDemoPage';
import { AppVersionStamp } from './components/AppVersionBadge';
import { DemoRibbon } from './components/DemoRibbon';
import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';
import { MenuProvider } from './context/MenuContext';
import { PlanProvider } from './context/PlanContext';
import { resolveTenantIdFromPath } from './utils/demoRegistry';

function CustomerDemo() {
  return (
    <>
      <DemoRibbon />
      <Storefront />
    </>
  );
}

/** Typo alias: mamamabel → mamabel */
function RedirectMamabelOrder() {
  const { orderId } = useParams();
  return <Navigate to={`/demo/mamabel/order/${orderId}`} replace />;
}

/** Remount Express menu when `rubro` changes (same tenant `demo`). */
function demoMenuScope(pathname: string, search: string): string {
  const tenant = resolveTenantIdFromPath(pathname);
  if (tenant !== 'demo') return tenant;
  const rubro = new URLSearchParams(search).get('rubro') || 'gastronomia';
  return `demo:${rubro}`;
}

export default function CommerceApp() {
  const location = useLocation();
  const providerScope = resolveTenantIdFromPath(location.pathname);
  const menuScope = demoMenuScope(location.pathname, location.search);

  return (
    <PlanProvider key={providerScope}>
      <AdminProvider>
        <MenuProvider key={menuScope}>
          <LanguageProvider>
            <AppVersionStamp />
            <Routes>
              <Route path="/demo" element={<CustomerDemo />} />
              <Route path="/demo/pizzeria" element={<CustomerDemo />} />
              <Route path="/demo/pizzeria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/panaderia" element={<CustomerDemo />} />
              <Route path="/demo/panaderia/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/aguacats" element={<AguacatsDemoPage />} />
              <Route path="/demo/aguacats/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/mamabel" element={<MamabelDemoPage />} />
              <Route path="/demo/mamabel/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/mamamabel" element={<Navigate to="/demo/mamabel" replace />} />
              <Route path="/demo/mamamabel/order/:orderId" element={<RedirectMamabelOrder />} />
              <Route path="/demo/carniceria" element={<WeightedCatalogDemoPage />} />
              <Route path="/demo/carniceria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/canavesi" element={<WeightedCatalogDemoPage />} />
              <Route path="/demo/canavesi/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/verduleria" element={<WeightedCatalogDemoPage />} />
              <Route path="/demo/verduleria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/s/:slug" element={<Storefront />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/s/:slug/admin" element={<AdminPage />} />
              <Route path="/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/super-admin" element={<SuperAdminPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LanguageProvider>
        </MenuProvider>
      </AdminProvider>
    </PlanProvider>
  );
}
