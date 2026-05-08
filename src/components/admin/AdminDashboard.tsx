/**
 * @file AdminDashboard.tsx
 * @description Sección Dashboard del panel de administración.
 * Muestra métricas reales basadas en datos de analytics almacenados
 * en localStorage: visitas por hora/día/mes, idioma más usado,
 * tiempo de sesión, y estado de la sesión actual del usuario.
 *
 * DEMO MODE: Cuando se activa, genera datos sintéticos realistas
 * para que el dashboard pueda apreciarse sin tráfico real.
 *
 * Las métricas se refrescan automáticamente cada 30 segundos.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  Wifi, Clock, Eye, Globe, TrendingUp, RefreshCw,
  Sparkles, ShoppingBag, DollarSign, Trophy,
} from 'lucide-react';
import {
  getVisitsTodayByHour,
  getVisitsLast7Days,
  getVisitsLast30Days,
  getTotalVisitsToday,
  getTotalVisitsAll,
  getAverageSessionTime,
  getTopLanguage,
  setDemoMode,
  isDemoMode,
  getDemoOrdersToday,
  getDemoRevenueToday,
  getDemoTopProducts,
} from '../../utils/analyticsTracker';
import { useMenu } from '../../context/MenuContext';

type TimeFilter = 'today' | 'week' | 'month';

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Dimensiones fijas del gráfico SVG — evita saltos de layout entre filtros */
const CHART_W = 680;
const CHART_H = 200;
const PAD_LEFT = 35;
const PAD_RIGHT = 10;
const CHART_AREA = CHART_W - PAD_LEFT - PAD_RIGHT;
const BAR_TOP = 10;
const BAR_BOTTOM = 180;
const BAR_RANGE = BAR_BOTTOM - BAR_TOP;

export function AdminDashboard() {
  const { setSiteSettings } = useMenu();
  const [demo, setDemo] = useState(() => isDemoMode());
  const [filter, setFilter] = useState<TimeFilter>('today');
  const [chartData, setChartData] = useState<number[]>(getVisitsTodayByHour);

  // Métricas reales — se calculan al montar y se refrescan automáticamente
  const [totalToday, setTotalToday] = useState(getTotalVisitsToday);
  const [totalAll, setTotalAll] = useState(getTotalVisitsAll);
  const [sessionTime, setSessionTime] = useState(getAverageSessionTime);
  const [topLang, setTopLang] = useState(getTopLanguage);
  const [ordersToday, setOrdersToday] = useState(getDemoOrdersToday);
  const [revenueToday, setRevenueToday] = useState(getDemoRevenueToday);
  const [topProducts, setTopProducts] = useState(getDemoTopProducts);

  // Sincronizar demoMode con localStorage + siteSettings
  useEffect(() => {
    setDemoMode(demo);
    setSiteSettings(prev => ({ ...prev, demoMode: demo }));
  }, [demo, setSiteSettings]);

  // Auto-refresh de todas las métricas cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(getAverageSessionTime());
      setTotalToday(getTotalVisitsToday());
      setTotalAll(getTotalVisitsAll());
      setTopLang(getTopLanguage());
      if (demo) {
        setOrdersToday(getDemoOrdersToday());
        setRevenueToday(getDemoRevenueToday());
        setTopProducts(getDemoTopProducts());
      }
      // Refrescar gráfico según filtro actual
      if (filter === 'today') setChartData(getVisitsTodayByHour());
      else if (filter === 'week') setChartData(getVisitsLast7Days());
      else setChartData(getVisitsLast30Days());
    }, 30000);
    return () => clearInterval(interval);
  }, [filter, demo]);

  // Cambio de filtro del gráfico
  const handleFilterChange = useCallback((newFilter: TimeFilter) => {
    setFilter(newFilter);
    if (newFilter === 'today') setChartData(getVisitsTodayByHour());
    else if (newFilter === 'week') setChartData(getVisitsLast7Days());
    else setChartData(getVisitsLast30Days());
  }, []);

  // Refrescar todas las métricas manualmente
  const handleRefresh = useCallback(() => {
    setTotalToday(getTotalVisitsToday());
    setTotalAll(getTotalVisitsAll());
    setSessionTime(getAverageSessionTime());
    setTopLang(getTopLanguage());
    if (demo) {
      setOrdersToday(getDemoOrdersToday());
      setRevenueToday(getDemoRevenueToday());
      setTopProducts(getDemoTopProducts());
    }
    handleFilterChange(filter);
  }, [filter, handleFilterChange, demo]);

  const maxValue = Math.max(...chartData, 1);

  const getBarLabel = useCallback((index: number): string => {
    if (filter === 'today') return `${index}h`;
    if (filter === 'week') return WEEKDAY_LABELS[index] || '';
    return `${index + 1}`;
  }, [filter]);

  const labelStep = filter === 'today' ? 3 : filter === 'month' ? 5 : 1;

  // Cálculos del gráfico con viewBox fijo
  const barGap = 3;
  const barWidth = Math.max(6, Math.min(24, CHART_AREA / chartData.length - barGap));
  const slotWidth = CHART_AREA / chartData.length;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Dashboard</h2>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">
            {demo ? 'Resumen con datos de demostración' : 'Resumen de actividad del sitio — datos reales'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemo(prev => !prev)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              demo
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-white/6 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={demo ? 'Desactivar modo demo' : 'Activar modo demo'}
          >
            <Sparkles size={16} />
            {demo ? 'Demo ON' : 'Demo OFF'}
          </button>
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
            title="Refrescar métricas"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Demo Banner */}
      {demo && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-300">Modo demostración activado</p>
            <p className="text-xs text-amber-300/70">
              Los datos que ves son sintéticos y se regeneran automáticamente. Sirven para apreciar el dashboard sin tráfico real.
            </p>
          </div>
        </div>
      )}

      {/* Row 1: Stats Cards */}
      <div className={`grid gap-3 md:gap-4 ${demo ? 'grid-cols-2 lg:grid-cols-6' : 'grid-cols-2 lg:grid-cols-4'}`}>
        {/* Tu sesión */}
        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">En vivo</span>
          </div>
          <Wifi size={24} className="text-brand-green mb-2" />
          <span className="text-3xl md:text-4xl font-black text-white">1</span>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Tu sesión</span>
        </div>

        {/* Visitas Hoy */}
        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center">
          <Eye size={24} className="text-brand-green mb-2" />
          <span className="text-3xl md:text-4xl font-black text-white">{totalToday}</span>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Visitas hoy</span>
        </div>

        {/* Sesión Actual */}
        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center">
          <Clock size={24} className="text-brand-green mb-2" />
          <span className="text-2xl md:text-3xl font-black text-white">{sessionTime}</span>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Sesión actual</span>
        </div>

        {/* Idioma Más Usado */}
        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center">
          <Globe size={24} className="text-brand-green mb-2" />
          <span className="text-lg md:text-xl font-black text-white">{topLang}</span>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Idioma top</span>
        </div>

        {/* Demo: Pedidos Hoy */}
        {demo && (
          <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Demo</div>
            <ShoppingBag size={24} className="text-amber-400 mb-2" />
            <span className="text-3xl md:text-4xl font-black text-white">{ordersToday}</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Pedidos hoy</span>
          </div>
        )}

        {/* Demo: Ingresos Hoy */}
        {demo && (
          <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 min-h-[130px] md:min-h-[140px] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider">Demo</div>
            <DollarSign size={24} className="text-amber-400 mb-2" />
            <span className="text-2xl md:text-3xl font-black text-white">
              ${revenueToday.toLocaleString()}
            </span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider text-center">Ingresos hoy</span>
          </div>
        )}
      </div>

      {/* Visitas Totales */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center shrink-0">
          <TrendingUp size={20} className="text-brand-green" />
        </div>
        <div>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider block">Visitas totales registradas</span>
          <span className="text-lg font-black text-white">{totalAll.toLocaleString()}</span>
        </div>
      </div>

      {/* Chart: Tráfico */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h3 className="text-base md:text-lg font-black text-white">Tráfico del sitio</h3>
            <p className="text-[10px] md:text-xs text-gray-400 font-medium">Conexiones por {filter === 'today' ? 'hora' : filter === 'week' ? 'día' : 'día del mes'}</p>
          </div>
          <div className="flex bg-white/6 rounded-xl p-1 gap-0.5">
            {([['today', 'Hoy'], ['week', 'Semana'], ['month', 'Mes']] as [TimeFilter, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className={`px-3 py-2 min-h-[36px] text-xs font-bold rounded-lg transition-all ${
                  filter === key
                    ? 'bg-brand-green text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart — viewBox fijo para estabilidad visual */}
        <div className="w-full min-h-[200px] md:min-h-[220px]">
          {maxValue <= 1 && chartData.every(v => v === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 min-h-[200px]">
              <Eye size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-bold">Sin datos aún</p>
              <p className="text-xs font-medium mt-1">Las visitas aparecerán aquí en tiempo real</p>
            </div>
          ) : (
            <svg
              viewBox={`0 0 ${CHART_W} ${CHART_H}`}
              className="w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                const y = BAR_BOTTOM - pct * BAR_RANGE;
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={PAD_LEFT} y1={y}
                      x2={CHART_W - PAD_RIGHT} y2={y}
                      stroke="rgba(255,255,255,0.05)"
                      strokeDasharray="4 4"
                    />
                    <text x="2" y={y + 4} fill="rgba(255,255,255,0.3)" fontSize="9" fontWeight="600">
                      {Math.round(pct * maxValue)}
                    </text>
                  </g>
                );
              })}

              {/* Bars */}
              {chartData.map((value, index) => {
                const x = PAD_LEFT + index * slotWidth + (slotWidth - barWidth) / 2;
                const barHeight = (value / maxValue) * BAR_RANGE;
                const y = BAR_BOTTOM - barHeight;

                return (
                  <g key={`bar-${index}`}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 0)}
                      rx={Math.min(4, barWidth / 2)}
                      fill={value > 0 ? "rgba(138,154,134,0.7)" : "rgba(138,154,134,0.15)"}
                      className="hover:fill-[rgba(138,154,134,1)] transition-colors"
                    >
                      <title>{`${getBarLabel(index)}: ${value} visitas`}</title>
                    </rect>
                    {index % labelStep === 0 && (
                      <text
                        x={x + barWidth / 2}
                        y={CHART_H - 2}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.35)"
                        fontSize="8"
                        fontWeight="600"
                      >
                        {getBarLabel(index)}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* Demo: Productos más vendidos */}
      {demo && (
        <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white">Productos más pedidos</h3>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium">Ranking simulado de popularidad</p>
            </div>
          </div>
          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 bg-white/4 rounded-xl px-4 py-3"
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-white/10 text-gray-400'
                }`}>
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-bold text-white">{product.name}</span>
                <span className="text-xs font-bold text-gray-400">{product.count} pedidos</span>
                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-amber-400/70 rounded-full"
                    style={{ width: `${(product.count / topProducts[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
