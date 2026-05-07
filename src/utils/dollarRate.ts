/**
 * @file dollarRate.ts
 * @description Servicio de cotización del dólar blue argentino.
 * Consulta DolarAPI.com una vez cada 24 horas y cachea el resultado
 * en localStorage para minimizar peticiones de red.
 * Incluye verificador de estado de la API para el panel admin.
 */

const CACHE_KEY = 'elpuestito_usd_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas en ms
const API_URL = 'https://dolarapi.com/v1/dolares/blue';
const FALLBACK_RATE = 1300; // Tasa por defecto si la API falla

interface CachedRate {
  rate: number;       // precio de venta del dólar blue
  timestamp: number;  // Date.now() cuando se cacheó
}

/** Lee la tasa cacheada del localStorage */
function getCachedRate(): CachedRate | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedRate = JSON.parse(raw);
    // Verificar que no expiró (24hs)
    if (Date.now() - cached.timestamp < CACHE_TTL) return cached;
  } catch { /* corrupto */ }
  return null;
}

/** Consulta la API y cachea el resultado */
async function fetchAndCacheRate(): Promise<number> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const rate = data.venta;
    if (typeof rate !== 'number' || rate <= 0) throw new Error('Invalid rate');
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
    return rate;
  } catch (err) {
    console.warn('[dollarRate] Falló la consulta de cotización, usando fallback:', err);
    return FALLBACK_RATE;
  }
}

/**
 * Obtiene la cotización actual del dólar blue.
 * 1. Si hay cache válido (< 24hs), lo retorna inmediatamente.
 * 2. Si no hay cache o expiró, consulta DolarAPI.com.
 * 3. Si la API falla, retorna FALLBACK_RATE (1300).
 */
export async function getUsdRate(): Promise<number> {
  const cached = getCachedRate();
  if (cached) return cached.rate;
  return fetchAndCacheRate();
}

/** Versión sincrónica: retorna el cache si existe, o el fallback */
export function getUsdRateSync(): number {
  const cached = getCachedRate();
  return cached?.rate ?? FALLBACK_RATE;
}

/** Convierte ARS a USD y redondea HACIA ARRIBA al entero más cercano (sin centavos) */
export function arsToUsd(priceArs: number, rate: number): number {
  return Math.ceil(priceArs / rate);
}

/** Verifica el estado de la API y retorna información diagnóstica */
export async function checkApiStatus(): Promise<{ ok: boolean; rate?: number; error?: string }> {
  try {
    const res = await fetch(API_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    if (typeof data.venta !== 'number' || data.venta <= 0) return { ok: false, error: 'Datos inválidos' };
    return { ok: true, rate: data.venta };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error desconocido' };
  }
}
