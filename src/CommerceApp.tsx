import { Route, Routes, useLocation } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import OrderStatusPage from './pages/OrderStatusPage';
import CarniceriaDemoPage from './pages/CarniceriaDemoPage';
import MamabelDemoPage from './pages/MamabelDemoPage';
import Storefront from './pages/Storefront';
import SuperAdminPage from './pages/SuperAdminPage';
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

export default function CommerceApp() {
  const location = useLocation();
  const providerScope = resolveTenantIdFromPath(location.pathname);

  return (
    <PlanProvider key={providerScope}>
      <AdminProvider>
        <MenuProvider>
          <LanguageProvider>
            <AppVersionStamp />
            <Routes>
              <Route path="/demo" element={<CustomerDemo />} />
              <Route path="/demo/pizzeria" element={<CustomerDemo />} />
              <Route path="/demo/pizzeria/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/panaderia" element={<CustomerDemo />} />
              <Route path="/demo/panaderia/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/mamabel" element={<MamabelDemoPage />} />
              <Route path="/demo/mamabel/order/:orderId" element={<OrderStatusPage />} />
              <Route path="/demo/carniceria" element={<CarniceriaDemoPage />} />
              <Route path="/demo/carniceria/order/:orderId" element={<OrderStatusPage />} />
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
