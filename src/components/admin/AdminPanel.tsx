/**
 * @file AdminPanel.tsx
 * @description Panel de administración principal.
 * Overlay a pantalla completa con sidebar (desktop) / drawer (mobile).
 * Renderiza las 3 secciones: Dashboard, Editor de Menú, Configuración.
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, UtensilsCrossed, Image, Images, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useMenu } from '../../context/MenuContext';
import { AdminDashboard } from './AdminDashboard';
import { AdminMenuEditor } from './AdminMenuEditor';
import { AdminImageEditor } from './AdminImageEditor';
import { AdminFileManager } from './AdminFileManager';
import { AdminSettings } from './AdminSettings';

type Section = 'dashboard' | 'editor' | 'images' | 'file-manager' | 'settings';

const NAV_ITEMS: { id: Section; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'editor', label: 'Editor de Menú', Icon: UtensilsCrossed },
  { id: 'images', label: 'Editor de Imágenes', Icon: Image },
  { id: 'file-manager', label: 'Archivos', Icon: Images },
  { id: 'settings', label: 'Configuración', Icon: Settings },
];

export function AdminPanel() {
  const { showPanel, logout } = useAdmin();
  const { siteSettings } = useMenu();
  const [section, setSection] = useState<Section>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Bloquear scroll del body
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
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:flex flex-col w-64 bg-white/3 border-r border-white/5 p-4">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-3 mb-6">
              <img src={siteSettings.brandLogo || '/titulo-blanco.png'} alt={siteSettings.brandName || 'El Puestito'} className="w-32 h-auto object-contain" />
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
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
            </nav>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all mt-auto"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          </aside>

          {/* Mobile Drawer Overlay */}
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
                  <div className="flex items-center justify-between px-2 py-3 mb-6">
                    <img src={siteSettings.brandLogo || '/titulo-blanco.png'} alt={siteSettings.brandName || 'El Puestito'} className="w-28 h-auto object-contain" />
                    <button onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menú" className="text-gray-400 hover:text-white p-1">
                      <X size={20} />
                    </button>
                  </div>

                  <nav className="flex-1 space-y-1">
                    {NAV_ITEMS.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        onClick={() => handleNavClick(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          section === id
                            ? 'bg-brand-green text-white shadow-lg'
                            : 'text-gray-400 hover:bg-white/6 hover:text-white'
                        }`}
                      >
                        <Icon size={18} />
                        {label}
                      </button>
                    ))}
                  </nav>

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

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/5">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-white/6 text-gray-400 transition-colors"
                aria-label="Abrir menú"
              >
                <Menu size={22} />
              </button>
              <span className="text-sm font-black text-white tracking-wide">Panel de Administración</span>
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut size={18} />
              </button>
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/2 border-b border-white/5">
              <h1 className="text-lg font-black text-white tracking-wide">Panel de Administración</h1>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 font-medium">Sesión: <span className="text-gray-300 font-bold">Administrador</span></span>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 hide-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={section}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {section === 'dashboard' && <AdminDashboard />}
                  {section === 'editor' && <AdminMenuEditor />}
                  {section === 'images' && <AdminImageEditor />}
                  {section === 'file-manager' && <AdminFileManager />}
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
