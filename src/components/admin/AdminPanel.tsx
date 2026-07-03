import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Image,
  Images,
  Settings,
  LogOut,
  Menu,
  X,
  Package,
  Tag,
  FileUp,
  ClipboardList,
  Palette,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useMenu } from '../../context/MenuContext';
import { usePlan } from '../../context/PlanContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminMenuEditor } from './AdminMenuEditor';
import { AdminImageEditor } from './AdminImageEditor';
import { AdminFileManager } from './AdminFileManager';
import { AdminSettings } from './AdminSettings';
import { AdminOrders } from './AdminOrders';
import { AdminPromotions } from './AdminPromotions';
import { AdminMenuOnboarding } from './AdminMenuOnboarding';
import { AdminClientSetup } from './AdminClientSetup';
import { MenuAppearanceSettings } from './MenuAppearanceSettings';
import { CloudSyncBadge } from './CloudSyncBadge';
import { AdminSecurityBanner } from './AdminSecurityBanner';
import { AppVersionBadge } from '../AppVersionBadge';
import { shouldOpenSetupWizard } from '../../utils/clientSetup';

type Section =
  | 'armado'
  | 'dashboard'
  | 'import-menu'
  | 'orders'
  | 'editor'
  | 'images'
  | 'appearance'
  | 'file-manager'
  | 'promotions'
  | 'settings';

const ALL_NAV: {
  id: Section;
  label: string;
  Icon: typeof LayoutDashboard;
  minPlan?: 'menu' | 'pedidos' | 'premium';
  setupOnly?: boolean;
  menuEssential?: boolean;
  advanced?: boolean;
}[] = [
  { id: 'armado', label: 'Armado', Icon: ClipboardList, setupOnly: true },
  { id: 'editor', label: 'Menú', Icon: UtensilsCrossed, menuEssential: true, advanced: true },
  { id: 'images', label: 'Fotos', Icon: Image, menuEssential: true, advanced: true },
  { id: 'appearance', label: 'Apariencia', Icon: Palette, menuEssential: true },
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard, advanced: true },
  { id: 'import-menu', label: 'Importar menú', Icon: FileUp, advanced: true },
  { id: 'orders', label: 'Pedidos', Icon: Package, minPlan: 'pedidos', advanced: true },
  { id: 'file-manager', label: 'Archivos', Icon: Images, advanced: true },
  { id: 'promotions', label: 'Promociones', Icon: Tag, minPlan: 'pedidos', advanced: true },
  { id: 'settings', label: 'Configuración', Icon: Settings },
];

export function AdminPanel() {
  const { showPanel, logout } = useAdmin();
  const { siteSettings } = useMenu();
  const { plan, planLabel, features } = usePlan();
  const [section, setSection] = useState<Section>(() =>
    shouldOpenSetupWizard() ? 'armado' : 'dashboard',
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [advancedNav, setAdvancedNav] = useState(false);

  const allNavItems = useMemo(() => {
    return ALL_NAV.filter(item => {
      if (item.id === 'dashboard' && !features.showFullDashboard) return false;
      if (item.id === 'orders' && !features.canManageOrders) return false;
      if (item.id === 'promotions' && !features.canUsePromotions) return false;
      if (item.id === 'file-manager' && plan === 'menu') return false;
      return true;
    });
  }, [features, plan]);

  const navItems = useMemo(() => {
    if (section === 'armado' && !advancedNav) {
      if (plan === 'menu') {
        return allNavItems.filter(item => item.setupOnly || item.menuEssential || item.id === 'settings');
      }
      return allNavItems.filter(item => item.setupOnly || item.id === 'settings');
    }
    return allNavItems;
  }, [allNavItems, section, advancedNav, plan]);

  useEffect(() => {
    if (!navItems.find(n => n.id === section)) {
      setSection(navItems[0]?.id ?? 'armado');
    }
  }, [navItems, section]);

  useEffect(() => {
    if (showPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPanel]);

  const handleNavClick = (s: Section) => {
    setSection(s);
    setMobileMenuOpen(false);
  };

  const renderNav = () => (
    <>
      {navItems.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => handleNavClick(id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
            section === id
              ? 'bg-brand-green text-white shadow-lg shadow-brand-green/10'
              : 'text-gray-400 hover:bg-white/6 hover:text-white'
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
      {section === 'armado' && (
        <button
          type="button"
          onClick={() => setAdvancedNav(v => !v)}
          className="w-full mt-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-300 border border-white/5"
        >
          {advancedNav ? '← Modo simple' : 'Modo avanzado →'}
        </button>
      )}
    </>
  );

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-10001 flex"
          style={{ backgroundColor: '#0d0d0d' }}
        >
          <aside className="hidden lg:flex flex-col w-64 bg-white/3 border-r border-white/5 p-4">
            <div className="flex items-center gap-3 px-2 py-3 mb-4">
              <img src={siteSettings.brandLogo || '/titulo-blanco.png'} alt={siteSettings.brandName || 'Trufi'} className="w-32 h-auto object-contain" />
            </div>
            <span className="mx-2 mb-4 inline-flex self-start px-2 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-wider text-gray-300">
              Plan {planLabel}
            </span>
            <div className="mx-2 mb-4">
              <CloudSyncBadge />
            </div>
            <nav className="flex-1 space-y-1">{renderNav()}</nav>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all mt-auto"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </aside>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-10002 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <motion.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute left-0 top-0 bottom-0 w-64 bg-[#111] border-r border-white/5 p-4 flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-2 py-3 mb-4">
                    <img src={siteSettings.brandLogo || '/titulo-blanco.png'} alt={siteSettings.brandName || 'Trufi'} className="w-28 h-auto object-contain" />
                    <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className="text-gray-400 hover:text-white p-1">
                      <X size={20} />
                    </button>
                  </div>
                  <nav className="flex-1 space-y-1">{renderNav()}</nav>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/5">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-white/6 text-gray-400 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu size={22} />
              </button>
              <span className="text-sm font-black text-white tracking-wide">Panel · {planLabel}</span>
              <AppVersionBadge className="text-gray-500" />
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </header>

            <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/2 border-b border-white/5">
              <h1 className="text-lg font-black text-white tracking-wide">Panel de Administración</h1>
              <div className="flex items-center gap-3">
                <CloudSyncBadge />
                <span className="text-xs px-2 py-1 rounded-lg bg-white/10 text-gray-300 font-bold uppercase">{planLabel}</span>
                <span className="text-xs text-gray-500 font-medium">Sesión: <span className="text-gray-300 font-bold">Administrador</span></span>
                <AppVersionBadge className="text-gray-500" />
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 hide-scrollbar">
              <AdminSecurityBanner />
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {section === 'armado' && (
                    <AdminClientSetup
                      onOpenImportMenu={() => {
                        setAdvancedNav(true);
                        setSection('import-menu');
                      }}
                      onExitSetup={() => {
                        setAdvancedNav(true);
                        setSection(features.showFullDashboard ? 'dashboard' : 'editor');
                      }}
                      onOpenSettings={() => {
                        setAdvancedNav(true);
                        setSection('settings');
                      }}
                    />
                  )}
                  {section === 'dashboard' && <AdminDashboard />}
                  {section === 'import-menu' && <AdminMenuOnboarding />}
                  {section === 'orders' && <AdminOrders />}
                  {section === 'editor' && <AdminMenuEditor />}
                  {section === 'images' && <AdminImageEditor />}
                  {section === 'appearance' && (
                    <div className="space-y-6 max-w-2xl">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Apariencia</h2>
                        <p className="text-sm text-gray-400 font-medium">Colores y disposición de tu menú online</p>
                      </div>
                      <MenuAppearanceSettings />
                    </div>
                  )}
                  {section === 'file-manager' && <AdminFileManager />}
                  {section === 'promotions' && <AdminPromotions />}
                  {section === 'settings' && <AdminSettings />}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
