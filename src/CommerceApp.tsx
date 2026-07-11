import { Route, Routes, useLocation } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import OrderStatusPage from './pages/OrderStatusPage';
import Storefront from './pages/Storefront';
import SuperAdminPage from './pages/SuperAdminPage';
import { AppVersionStamp } from './components/AppVersionBadge';
import { DemoRibbon } from './components/DemoRibbon';
import { AdminProvider } from './context/AdminContext';
import { LanguageProvider } from './context/LanguageContext';
import { MenuProvider } from './context/MenuContext';
import { PlanProvider } from './context/PlanContext';

function CustomerDemo() {
  return (
    <>
      <DemoRibbon />
      <Storefront />
    </>
  );
}

function resolveProviderScope(pathname: string): string {
  if (pathname.startsWith('/demo')) return 'demo';
  const slugMatch = pathname.match(/^\/s\/([^/]+)/);
  return slugMatch?.[1] || 'default';
}

export default function CommerceApp() {
  const location = useLocation();
  const providerScope = resolveProviderScope(location.pathname);

  return (
    <PlanProvider key={providerScope}>
      <AdminProvider>
        <MenuProvider>
          <LanguageProvider>
            <AppVersionStamp />
            <Routes>
              <Route path="/demo" element={<CustomerDemo />} />
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
