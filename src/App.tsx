import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Storefront from './pages/Storefront';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import OrderStatusPage from './pages/OrderStatusPage';
import PricingPage from './pages/PricingPage';
import SuperAdminPage from './pages/SuperAdminPage';
import { AppVersionStamp } from './components/AppVersionBadge';

export default function App() {
  return (
    <BrowserRouter>
      <AppVersionStamp />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="/s/:slug" element={<Storefront />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/s/:slug/admin" element={<AdminPage />} />
        <Route path="/order/:orderId" element={<OrderStatusPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/super-admin" element={<SuperAdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
