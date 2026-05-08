/**
 * @file analyticsTracker.ts
 * @description Sistema de analytics ligero basado en localStorage.
 * Registra eventos reales del sitio (visitas, selección de idioma)
 * y provee funciones de consulta para el dashboard del admin.
 *
 * Los eventos se almacenan como un array en localStorage con un
 * límite de 10,000 eventos. Los más antiguos se eliminan automáticamente.
 *
 * DEMO MODE: Cuando se activa, genera datos sintéticos realistas
 * para que el dashboard pueda apreciarse sin tráfico real.
 */

const STORAGE_KEY = 'elpuestito_analytics';
const MAX_EVENTS = 10_000;
const SESSION_KEY = 'elpuestito_session_start';
const DEMO_KEY = 'elpuestito_demo_mode';

export interface AnalyticsEvent {
  type: 'page_view' | 'language_select';
  timestamp: number; // Date.now()
  language?: string;
  path?: string;
}

// ─── Demo Mode ─────────────────────────────────────────────────

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem(DEMO_KEY, JSON.stringify(enabled));
}

export function isDemoMode(): boolean {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || 'false');
  } catch {
    return false;
  }
}

/** Genera eventos sintéticos realistas para el modo demo */
function generateDemoEvents(): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = [];
  const now = Date.now();
  const dayMs = 86_400_000;

  // Distribución de idiomas realista
  const langPool = [
    ...Array(70).fill('es'),
    ...Array(15).fill('en'),
    ...Array(10).fill('pt'),
    ...Array(3).fill('ru'),
    ...Array(2).fill('de'),
  ];

  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const dayBase = now - dayOffset * dayMs;
    const isWeekend = new Date(dayBase).getDay() % 6 === 0;

    // Base de visitas por día: 80-250, fines de semana un 40% más
    let dailyVisits = 80 + Math.floor(Math.random() * 170);
    if (isWeekend) dailyVisits = Math.floor(dailyVisits * 1.4);

    // Horarios pico: 11-14h (almuerzo) y 19-23h (cena)
    const hourWeights = new Array(24).fill(0).map((_, h) => {
      if (h >= 11 && h <= 14) return 3.5;
      if (h >= 19 && h <= 23) return 4.0;
      if (h >= 8 && h <= 10) return 1.5;
      if (h >= 15 && h <= 18) return 1.2;
      if (h >= 0 && h <= 7) return 0.2;
      return 1.0;
    });
    const totalWeight = hourWeights.reduce((a, b) => a + b, 0);

    for (let v = 0; v < dailyVisits; v++) {
      // Elegir hora ponderada
      let r = Math.random() * totalWeight;
      let hour = 0;
      for (let h = 0; h < 24; h++) {
        r -= hourWeights[h];
        if (r <= 0) {
          hour = h;
          break;
        }
      }
      const minute = Math.floor(Math.random() * 60);
      const second = Math.floor(Math.random() * 60);
      const timestamp = dayBase + hour * 3_600_000 + minute * 60_000 + second * 1_000;

      events.push({
        type: 'page_view',
        timestamp,
        path: '/',
      });

      // ~30% de los visitantes cambian de idioma
      if (Math.random() < 0.3) {
        events.push({
          type: 'language_select',
          timestamp: timestamp + Math.floor(Math.random() * 30_000),
          language: langPool[Math.floor(Math.random() * langPool.length)],
        });
      }
    }
  }

  return events.sort((a, b) => a.timestamp - b.timestamp);
}

/** Lee todos los eventos almacenados (o demo si está activo) */
function getEvents(): AnalyticsEvent[] {
  if (isDemoMode()) {
    return generateDemoEvents();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AnalyticsEvent[];
  } catch {
    // Corrupto — limpiar
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
}

/** Guarda eventos en localStorage, truncando si excede el límite */
function saveEvents(events: AnalyticsEvent[]): void {
  const trimmed = events.length > MAX_EVENTS
    ? events.slice(events.length - MAX_EVENTS)
    : events;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage lleno — limpiar eventos viejos agresivamente
    const recent = trimmed.slice(Math.floor(trimmed.length / 2));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
  }
}

/** Añade un evento */
function pushEvent(event: AnalyticsEvent): void {
  const events = getEvents();
  events.push(event);
  saveEvents(events);
}

// ──────────────────────────────────────────
// Funciones de TRACKING (llamar desde la app)
// ──────────────────────────────────────────

/** Registra la sesión al montar la app, para calcular tiempo promedio */
export function startSession(): void {
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  }
}

/** Registra una visita a una página */
export function trackPageView(path: string): void {
  pushEvent({ type: 'page_view', timestamp: Date.now(), path });
}

/** Registra selección de idioma */
export function trackLanguageSelect(lang: string): void {
  pushEvent({ type: 'language_select', timestamp: Date.now(), language: lang });
}

// ──────────────────────────────────────────
// Funciones de CONSULTA (llamar desde Dashboard)
// ──────────────────────────────────────────

/** Helpers de fecha */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

/** Visitas de hoy agrupadas por hora (array de 24 elementos) */
export function getVisitsTodayByHour(): number[] {
  const todayStart = startOfDay(new Date()).getTime();
  const events = getEvents().filter(
    e => e.type === 'page_view' && e.timestamp >= todayStart
  );
  const hours = new Array(24).fill(0);
  for (const ev of events) {
    const h = new Date(ev.timestamp).getHours();
    hours[h]++;
  }
  return hours;
}

/** Visitas de los últimos 7 días (array de 7 elementos, [0] = hace 6 días, [6] = hoy) */
export function getVisitsLast7Days(): number[] {
  const result = new Array(7).fill(0);
  const events = getEvents().filter(
    e => e.type === 'page_view' && e.timestamp >= daysAgo(6).getTime()
  );
  const todayStart = startOfDay(new Date()).getTime();
  for (const ev of events) {
    const dayDiff = Math.floor((todayStart - startOfDay(new Date(ev.timestamp)).getTime()) / (86400000));
    const index = 6 - dayDiff; // 0=hace 6 días, 6=hoy
    if (index >= 0 && index < 7) result[index]++;
  }
  return result;
}

/** Visitas de los últimos 30 días (array de 30 elementos) */
export function getVisitsLast30Days(): number[] {
  const result = new Array(30).fill(0);
  const events = getEvents().filter(
    e => e.type === 'page_view' && e.timestamp >= daysAgo(29).getTime()
  );
  const todayStart = startOfDay(new Date()).getTime();
  for (const ev of events) {
    const dayDiff = Math.floor((todayStart - startOfDay(new Date(ev.timestamp)).getTime()) / (86400000));
    const index = 29 - dayDiff;
    if (index >= 0 && index < 30) result[index]++;
  }
  return result;
}

/** Total de visitas hoy */
export function getTotalVisitsToday(): number {
  const todayStart = startOfDay(new Date()).getTime();
  return getEvents().filter(
    e => e.type === 'page_view' && e.timestamp >= todayStart
  ).length;
}

/** Total de visitas históricas */
export function getTotalVisitsAll(): number {
  return getEvents().filter(e => e.type === 'page_view').length;
}

/** Tiempo promedio de sesión (basado en la sesión actual como referencia) */
export function getAverageSessionTime(): string {
  if (isDemoMode()) {
    // En demo mostramos un valor fijo realista
    return '4m 32s';
  }
  const sessionStart = sessionStorage.getItem(SESSION_KEY);
  if (!sessionStart) return '0s';
  const elapsed = Date.now() - parseInt(sessionStart, 10);

  const seconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/** Idioma más seleccionado */
export function getTopLanguage(): string {
  const langEvents = getEvents().filter(e => e.type === 'language_select' && e.language);
  if (langEvents.length === 0) return 'Español';

  const counts: Record<string, number> = {};
  for (const ev of langEvents) {
    const lang = ev.language!;
    counts[lang] = (counts[lang] || 0) + 1;
  }
  const langNames: Record<string, string> = {
    es: 'Español', en: 'Inglés', pt: 'Portugués', ru: 'Ruso', de: 'Alemán'
  };
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return langNames[top[0]] || top[0];
}

// ─── Métricas simuladas de Demo ────────────────────────────────

/** Pedidos simulados de hoy (basado en visitas con tasa de conversión) */
export function getDemoOrdersToday(): number {
  const visits = getTotalVisitsToday();
  // Tasa de conversión 8-15%
  const rate = 0.08 + Math.random() * 0.07;
  return Math.max(1, Math.round(visits * rate));
}

/** Ingresos simulados de hoy (basado en pedidos × ticket promedio) */
export function getDemoRevenueToday(): number {
  const orders = getDemoOrdersToday();
  // Ticket promedio ARS 8500-15000
  const avgTicket = 8500 + Math.floor(Math.random() * 6500);
  return orders * avgTicket;
}

/** Productos más "vendidos" en demo */
export function getDemoTopProducts(): { name: string; count: number }[] {
  const products = [
    'Hamburguesa Clásica', 'Choripán Completo', 'Bondiola Popito',
    'Papas Fritas', 'Hamburguesa Veggie', 'Bife de Chorizo',
    'Hamburguesa Doble', 'Choripán Simple',
  ];
  return products
    .map(name => ({
      name,
      count: Math.floor(Math.random() * 40) + 5,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

/** Limpia todos los datos de analytics */
export function clearAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}
