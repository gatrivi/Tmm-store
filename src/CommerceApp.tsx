import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import OrderStatusPage from './pages/OrderStatusPage';
import AguacatsDemoPage from './pages/AguacatsDemoPage';
import FerreteriaDemoPage from './pages/FerreteriaDemoPage';
import MamabelDemoPage from './pages/MamabelDemoPage';
import MolinoFloridaDemoPage from './pages/MolinoFloridaDemoPage';
import PanaderiaDemoPage from './pages/PanaderiaDemoPage';
import Storefront from './pages/Storefront';
import SuperAdminPage from './pages/SuperAdminPage';
import WeightedCatalogDemoPage from './pages/WeightedCatalogDemoPage';
import { AppVersionStamp } from './components/AppVersionBadge';
import { DemoRibbon } from './components/DemoRibbon';
import { DEMO_EXPRESS_FALLBACK, DEMO_EXPRESS_PUBLIC } from './config/demoExpress';
import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';
import { MenuProvider } from './context/MenuContext';
import { PlanProvider } from './context/PlanContext';
import { resolveTenantIdFromPath } from './utils/demoRegistry';

function CustomerDemo() {
  const location = useLocation();
  if (!DEMO_EXPRESS_PUBLIC && (location.pathname === '/demo' || location.pathname === '/demo/')) {
    return <Navigate to={DEMO_EXPRESS_FALLBACK} replace />;
  }
  return (
    <>
      <DemoRibbon />
      <Storefront />
    </>
  );
}

function RedirectMamabelOrder() {
  const { orderId } = useParams();
  return <Navigate to={`/mamabel/order/${orderId}`} replace />;
}

function RedirectCarniceriaOrder({ legacyPrefix = '' }: { legacyPrefix?: '' | '/demo' }) {
  const { orderId } = useParams();
  return <Navigate to={`${legacyPrefix}/canavesi/order/${orderId}`} replace />;
}

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
              <Route path="/pizzeria" element={<CustomerDemo />} />
              <Route path="/pizzeria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/pizzeria" element={<CustomerDemo />} />
              <Route path="/demo/pizzeria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/panaderia" element={<PanaderiaDemoPage />} />
              <Route path="/panaderia/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/panaderia" element={<PanaderiaDemoPage />} />
              <Route path="/demo/panaderia/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/ferreteria" element={<FerreteriaDemoPage />} />
              <Route path="/ferreteria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/ferreteria" element={<FerreteriaDemoPage />} />
              <Route path="/demo/ferreteria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/zimba-pet" element={<CustomerDemo />} />
              <Route path="/zimba-pet/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/zimba-pet" element={<CustomerDemo />} />
              <Route path="/demo/zimba-pet/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/aguacats" element={<AguacatsDemoPage />} />
              <Route path="/aguacats/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/aguacats" element={<AguacatsDemoPage />} />
              <Route path="/demo/aguacats/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/mamabel" element={<MamabelDemoPage />} />
              <Route path="/mamabel/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/mamabel" element={<MamabelDemoPage />} />
              <Route path="/demo/mamabel/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/mamamabel" element={<Navigate to="/mamabel" replace />} />
              <Route path="/demo/mamamabel/order/:orderId" element={<RedirectMamabelOrder />} />
              <Route path="/carniceria" element={<Navigate to="/canavesi" replace />} />
              <Route path="/carniceria/order/:orderId" element={<RedirectCarniceriaOrder />} />
              <Route path="/demo/carniceria" element={<Navigate to="/demo/canavesi" replace />} />
              <Route path="/demo/carniceria/order/:orderId" element={<RedirectCarniceriaOrder legacyPrefix="/demo" />} />
              <Route path="/canavesi" element={<WeightedCatalogDemoPage />} />
              <Route path="/canavesi/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/canavesi" element={<WeightedCatalogDemoPage />} />
              <Route path="/demo/canavesi/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/verduleria" element={<WeightedCatalogDemoPage />} />
              <Route path="/verduleria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/verduleria" element={<WeightedCatalogDemoPage />} />
              <Route path="/demo/verduleria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/molino-florida" element={<MolinoFloridaDemoPage />} />
              <Route path="/demo/molino-florida" element={<MolinoFloridaDemoPage />} />
              <Route path="/demo/molino" element={<Navigate to="/molino-florida" replace />} />
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
