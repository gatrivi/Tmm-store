/**
 * @file AdminSettings.tsx
 * @description Sección de configuración del panel de administración.
 * Incluye: toggle USD con cotización automática, verificador de estado de API,
 * tipo de cambio manual, reset de textos por idioma, limpieza de analytics,
 * cierre de sesión y créditos.
 */
import { useState } from 'react';
import { LogOut, Shield, Code, RotateCcw, AlertTriangle, Trash2, DollarSign, RefreshCw, Wifi, WifiOff, Clock, CalendarCheck, Phone, CreditCard, Package } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useMenu } from '../../context/MenuContext';
import { clearAnalytics } from '../../utils/analyticsTracker';
import { getUsdRate, checkApiStatus } from '../../utils/dollarRate';
import { loadBusinessHours, isBusinessOpen, getNextOpeningText, type BusinessHoursSchedule } from '../../utils/businessHours';
import { AdminBranding } from './AdminBranding';
import { CloudSyncPanel } from './CloudSyncPanel';
import { BusinessHoursFields } from './BusinessHoursFields';

const LANG_OPTIONS = [
  { code: undefined, label: '🌐 Todos', shortLabel: 'Todos' },
  { code: 'es', label: '🇦🇷 ES', shortLabel: 'ES' },
  { code: 'en', label: '🇺🇸 EN', shortLabel: 'EN' },
  { code: 'pt', label: '🇧🇷 PT', shortLabel: 'PT' },
  { code: 'ru', label: '🇷🇺 RU', shortLabel: 'RU' },
  { code: 'de', label: '🇩🇪 DE', shortLabel: 'DE' },
] as const;

export function AdminSettings() {
  const { logout } = useAdmin();
  const { resetTextsOnly, lastEditTimestamp, siteSettings, setSiteSettings, usdRate, setUsdRate } = useMenu();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClearAnalytics, setConfirmClearAnalytics] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string | undefined>(undefined);
  const [refreshingRate, setRefreshingRate] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ ok: boolean; rate?: number; error?: string } | null>(null);
  const [checkingApi, setCheckingApi] = useState(false);
  const [manualRateInput, setManualRateInput] = useState(siteSettings.manualRate > 0 ? String(siteSettings.manualRate) : '');
  const [businessHours, setBusinessHours] = useState<BusinessHoursSchedule>(() => loadBusinessHours());

  const handleReset = () => {
    resetTextsOnly(selectedLang);
    setConfirmReset(false);
  };

  const handleClearAnalytics = () => {
    clearAnalytics();
    setConfirmClearAnalytics(false);
  };

  const handleForceRefreshRate = async () => {
    setRefreshingRate(true);
    localStorage.removeItem('elpuestito_usd_cache');
    const rate = await getUsdRate();
    setUsdRate(rate);
    setRefreshingRate(false);
  };

  const handleCheckApiStatus = async () => {
    setCheckingApi(true);
    const status = await checkApiStatus();
    setApiStatus(status);
    setCheckingApi(false);
  };

  const handleManualRateChange = (value: string) => {
    // Solo números enteros positivos
    const cleaned = value.replace(/[^0-9]/g, '');
    setManualRateInput(cleaned);
    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) {
      setSiteSettings(prev => ({ ...prev, manualRate: num }));
    }
  };

  const formatDate = (iso: string): string => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Configuración</h2>
        <p className="text-sm text-gray-400 font-medium">Información de sesión y opciones</p>
      </div>

      {/* Session Info */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
            <Shield size={20} className="text-brand-green" />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Sesión activa</span>
            <span className="text-base font-black text-white">Administrador</span>
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 space-y-2">
          <span className="text-xs text-gray-500 font-medium block">
            Tipo de autenticación: <span className="text-gray-300">Local (SHA-256)</span>
          </span>
          <span className="text-xs text-gray-500 font-medium block">
            Almacenamiento: <span className="text-gray-300">localStorage + Firestore (si Nube activo)</span>
          </span>
          {lastEditTimestamp && (
            <span className="text-xs text-gray-500 font-medium block">
              Última edición: <span className="text-brand-green font-bold">{formatDate(lastEditTimestamp)}</span>
            </span>
          )}
        </div>
      </div>

      <CloudSyncPanel />

      {/* Pedidos — sonido e impresión */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center">
            <Package size={20} className="text-brand-green" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-black text-white block">Alertas de pedidos</span>
            <span className="text-xs text-gray-400 font-medium">Sonido y ticket térmico al llegar un pedido nuevo.</span>
          </div>
        </div>
        <div className="border-t border-white/5 pt-4 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-300 font-bold">Sonido pedido nuevo</span>
            <button
              onClick={() => setSiteSettings(prev => ({ ...prev, orderSoundEnabled: !prev.orderSoundEnabled }))}
              aria-label="Alternar sonido de pedido"
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                siteSettings.orderSoundEnabled ? 'bg-brand-green' : 'bg-white/20'
              }`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                siteSettings.orderSoundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-300 font-bold">Auto-imprimir ticket 58mm</span>
            <button
              onClick={() => setSiteSettings(prev => ({ ...prev, autoPrintOnNewOrder: !prev.autoPrintOnNewOrder }))}
              aria-label="Alternar impresión automática"
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                siteSettings.autoPrintOnNewOrder ? 'bg-brand-green' : 'bg-white/20'
              }`}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                siteSettings.autoPrintOnNewOrder ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle MercadoPago */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <CreditCard size={20} className="text-sky-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-black text-white block">MercadoPago</span>
            <span className="text-xs text-gray-400 font-medium">Permitir pagos con tarjeta, débito y saldo MP vía Checkout Pro.</span>
          </div>
          <button
            onClick={() => setSiteSettings(prev => ({ ...prev, mpEnabled: !prev.mpEnabled }))}
            aria-label="Alternar MercadoPago"
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              siteSettings.mpEnabled ? 'bg-sky-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                siteSettings.mpEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {siteSettings.mpEnabled && (
          <div className="border-t border-white/5 pt-4 space-y-3">
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold bg-sky-500/10 border border-sky-500/20 text-sky-300`}>
              <Wifi size={14} />
              <span>🔗 Checkout Pro activado. El cliente podrá pagar online y volverá automáticamente a la tienda.</span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Requiere configurar <code className="bg-white/10 px-1 py-0.5 rounded text-gray-300">MP_ACCESS_TOKEN</code> en las variables de entorno de Vercel.
              Si no está configurado, el botón de pago mostrará un error al cliente.
            </p>
          </div>
        )}
      </div>

      {/* Toggle USD */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <DollarSign size={20} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-black text-white block">Precios en USD</span>
            <span className="text-xs text-gray-400 font-medium">Permitir al comensal ver precios en dólares americanos.</span>
          </div>
          {/* Toggle switch */}
          <button
            onClick={() => setSiteSettings(prev => ({ ...prev, showUsdToggle: !prev.showUsdToggle }))}
            aria-label="Alternar precios en USD"
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              siteSettings.showUsdToggle ? 'bg-brand-green' : 'bg-white/20'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                siteSettings.showUsdToggle ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {siteSettings.showUsdToggle && (
          <div className="border-t border-white/5 pt-4 space-y-4">
            {/* Current rate info */}
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
              <span>💱</span>
              <span>
                Cotización activa: <span className="text-brand-green font-black">1 USD = ${usdRate.toLocaleString('es-AR')} ARS</span>
                {siteSettings.useManualRate && siteSettings.manualRate > 0 && (
                  <span className="text-amber-400 text-[10px] font-bold ml-2">(MANUAL)</span>
                )}
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              Dólar Blue · actualizado automáticamente cada 24hs vía DolarAPI.com
            </p>
            <button
              onClick={handleForceRefreshRate}
              disabled={refreshingRate}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white bg-white/6 border border-white/10 px-3 py-2 rounded-lg transition-all hover:bg-white/10 disabled:opacity-40"
            >
              <RefreshCw size={14} className={refreshingRate ? 'animate-spin' : ''} />
              {refreshingRate ? 'Actualizando...' : 'Actualizar cotización ahora'}
            </button>

            {/* API Status */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">Estado de la API</span>
                <button
                  onClick={handleCheckApiStatus}
                  disabled={checkingApi}
                  className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 hover:text-white bg-white/6 border border-white/10 px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10 disabled:opacity-40"
                >
                  {checkingApi ? 'Verificando...' : 'Verificar estado'}
                </button>
              </div>

              {apiStatus && (
                <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold ${
                  apiStatus.ok 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}>
                  {apiStatus.ok ? (
                    <>
                      <Wifi size={14} />
                      <span>🟢 API Activa — Dólar Blue: ${apiStatus.rate?.toLocaleString('es-AR')}</span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} />
                      <span>🔴 API Inactiva — {apiStatus.error}</span>
                    </>
                  )}
                </div>
              )}

              {apiStatus && !apiStatus.ok && (
                <p className="text-[10px] text-amber-400 font-medium">
                  ⚠️ La API no responde. Puedes fijar un tipo de cambio manual abajo.
                </p>
              )}
            </div>

            {/* Manual Rate */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-white block">Tipo de cambio manual</span>
                  <span className="text-[10px] text-gray-500 font-medium">Este valor se usará en lugar de la cotización automática.</span>
                </div>
                <button
                  onClick={() => setSiteSettings(prev => ({ ...prev, useManualRate: !prev.useManualRate }))}
                  aria-label="Alternar tipo de cambio manual"
                  className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    siteSettings.useManualRate ? 'bg-amber-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                      siteSettings.useManualRate ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {siteSettings.useManualRate && (
                <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                  <span className="text-amber-400 text-sm font-black shrink-0">1 USD =</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={manualRateInput}
                    onChange={(e) => handleManualRateChange(e.target.value)}
                    placeholder={String(usdRate)}
                    maxLength={10}
                    className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm font-black text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-amber-500/40 transition-shadow"
                  />
                  <span className="text-amber-400 text-sm font-black shrink-0">ARS</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Horarios de atención */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <BusinessHoursFields value={businessHours} onChange={setBusinessHours} />
        {businessHours.enabled && (
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold ${isBusinessOpen(businessHours) ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
            {isBusinessOpen(businessHours) ? (
              <><CalendarCheck size={14} /><span>Abierto ahora</span></>
            ) : (
              <><Clock size={14} /><span>Cerrado — {getNextOpeningText(businessHours)}</span></>
            )}
          </div>
        )}
      </div>

      {/* Branding */}
      <AdminBranding />

      {/* Business Info */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Phone size={20} className="text-blue-400" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">Datos del negocio</span>
            <span className="text-xs text-gray-400 font-medium">Teléfono y alias para pedidos. Se usan en lugar de las variables de entorno si están configurados.</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Número de WhatsApp</label>
            <input
              type="text"
              value={siteSettings.whatsappNumber}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g, '') }))}
              placeholder={import.meta.env.VITE_WHATSAPP_NUMBER || "5491131844469"}
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow placeholder:text-gray-600"
            />
            <p className="text-[10px] text-gray-500 mt-1">Solo números, con código de país (ej: 5491131844469)</p>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Alias de pago</label>
            <input
              type="text"
              value={siteSettings.bankAlias}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, bankAlias: e.target.value }))}
              placeholder={import.meta.env.VITE_BANK_ALIAS || "ELPUESTITOdeltio.MP"}
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-shadow placeholder:text-gray-600"
            />
            <p className="text-[10px] text-gray-500 mt-1">Alias de Mercado Pago / CBU para transferencias</p>
          </div>
        </div>
      </div>

      {/* Reset textos */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <RotateCcw size={20} className="text-amber-400" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">Resetear textos del menú</span>
            <span className="text-xs text-gray-400 font-medium">Restaurar solo los textos del código fuente. Los precios, imágenes y orden de fotos NO se modifican.</span>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap gap-1.5">
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.shortLabel}
              onClick={() => setSelectedLang(opt.code)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedLang === opt.code
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white/6 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm rounded-xl hover:bg-amber-500/20 transition-all"
          >
            <RotateCcw size={16} />
            Resetear textos ({selectedLang ? LANG_OPTIONS.find(o => o.code === selectedLang)?.label : '🌐 Todos'})
          </button>
        ) : (
          <div className="flex flex-col gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <AlertTriangle size={14} />
              ¿Estás seguro? Se restaurarán los textos {selectedLang ? `en ${LANG_OPTIONS.find(o => o.code === selectedLang)?.label}` : 'de todos los idiomas'} a los originales.
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-amber-500 text-white font-bold text-xs rounded-lg hover:bg-amber-600 transition-all"
              >
                Sí, resetear textos
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 py-2.5 bg-white/6 text-gray-300 font-bold text-xs rounded-lg hover:bg-white/10 transition-all border border-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Limpiar Analytics */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <div>
            <span className="text-sm font-black text-white block">Limpiar analytics</span>
            <span className="text-xs text-gray-400 font-medium">Eliminar todos los datos de visitas y estadísticas registrados.</span>
          </div>
        </div>

        {!confirmClearAnalytics ? (
          <button
            onClick={() => setConfirmClearAnalytics(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={16} />
            Limpiar datos de analytics
          </button>
        ) : (
          <div className="flex flex-col gap-2 bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
              <AlertTriangle size={14} />
              ¿Estás seguro? Se perderán todas las métricas registradas.
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={handleClearAnalytics}
                className="flex-1 py-2.5 bg-red-500 text-white font-bold text-xs rounded-lg hover:bg-red-600 transition-all"
              >
                Sí, limpiar todo
              </button>
              <button
                onClick={() => setConfirmClearAnalytics(false)}
                className="flex-1 py-2.5 bg-white/6 text-gray-300 font-bold text-xs rounded-lg hover:bg-white/10 transition-all border border-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2.5 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm rounded-xl hover:bg-red-500/20 transition-all"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>

      {/* Credits */}
      <div className="bg-white/3 border border-white/5 rounded-2xl p-6 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Code size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Créditos</span>
        </div>
        <p className="text-sm font-medium text-gray-500">
          Desarrollado por <span className="text-brand-green font-bold">DevSalz</span>
        </p>
        <p className="text-[10px] text-gray-600">
          Panel de Administración — Trufi © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
