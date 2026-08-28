#!/usr/bin/env node
/**
 * Scan Google Places for food businesses: 100+ reviews, no website.
 * Requires GOOGLE_PLACES_API_KEY (Places API New enabled).
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=... node scripts/leads-scan.mjs
 *   node scripts/leads-scan.mjs --min-reviews 100 --tiers 4
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const ORIGIN = { lat: -34.5075, lng: -58.4878, label: 'Olivos' };
const RING_KM = 5;
const DEFAULT_TIERS = 4;
const DEFAULT_MIN_REVIEWS = 100;
const SOCIAL = /facebook\.com|instagram\.com|pedix|mimi\.link|business\.google/i;

function loadDotEnv() {
  const path = resolve(root, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

function argNum(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i === -1 ? fallback : Number(process.argv[i + 1]) || fallback;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function tierLabel(tierId) {
  if (tierId === 0) return 'T0 Olivos';
  if (tierId === 1) return 'T1 Vicente López';
  return `T${tierId} +${tierId * RING_KM}km`;
}

function tierForKm(km, maxTiers) {
  const t = Math.floor(km / RING_KM);
  return Math.min(t, maxTiers - 1);
}

function hasRealWebsite(uri) {
  if (!uri) return false;
  if (SOCIAL.test(uri)) return false;
  if (/google\.com\/website/i.test(uri)) return false;
  return true;
}

async function searchRing(apiKey, radiusM, pageToken) {
  const body = {
    locationRestriction: {
      circle: { center: { latitude: ORIGIN.lat, longitude: ORIGIN.lng }, radius: radiusM },
    },
    // Nota: sumamos bar/nightlife e indumentaria (clothing/shoes) — antes el scan
    // sólo cubría comida, así que nunca encontraba locales de ropa/tragos.
    includedPrimaryTypes: [
      'restaurant',
      'meal_takeaway',
      'bakery',
      'cafe',
      'bar',
      'night_club',
      'clothing_store',
      'clothing_accessories_store',
      'shoe_store',
    ],
    maxResultCount: 20,
    rankPreference: 'POPULARITY',
  };
  if (pageToken) body.pageToken = pageToken;

  const res = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.googleMapsUri,nextPageToken',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`searchNearby ${res.status}: ${await res.text()}`);
  return res.json();
}

loadDotEnv();
const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
const minReviews = argNum('--min-reviews', DEFAULT_MIN_REVIEWS);
const maxTiers = argNum('--tiers', DEFAULT_TIERS);

if (!apiKey) {
  console.error('Missing GOOGLE_PLACES_API_KEY. Enable Places API (New) in Google Cloud Console.');
  process.exit(1);
}

const seen = new Map();
const maxRadiusM = maxTiers * RING_KM * 1000;

for (let pageToken; ; ) {
  const data = await searchRing(apiKey, maxRadiusM, pageToken);
  for (const p of data.places || []) {
    const reviews = p.userRatingCount || 0;
    if (reviews < minReviews) continue;
    if (hasRealWebsite(p.websiteUri)) continue;

    const loc = p.location || {};
    const km = haversineKm(ORIGIN, { lat: loc.latitude, lng: loc.longitude });
    const tier = tierForKm(km, maxTiers);
    if (tier >= maxTiers) continue;

    seen.set(p.id, {
      id: p.id,
      name: p.displayName?.text || '',
      address: p.formattedAddress || '',
      phone: p.nationalPhoneNumber || '',
      reviews,
      rating: p.rating || null,
      website: p.websiteUri || '',
      maps: p.googleMapsUri || '',
      km: Math.round(km * 10) / 10,
      tier,
      tierLabel: tierLabel(tier),
    });
  }
  pageToken = data.nextPageToken;
  if (!pageToken) break;
  await new Promise((r) => setTimeout(r, 2000));
}

const leads = [...seen.values()].sort(
  (a, b) => a.tier - b.tier || b.reviews - a.reviews || a.km - b.km,
);

const outJson = resolve(root, 'docs/ops/leads-data.json');
const outMd = resolve(root, 'docs/ops/leads-data.md');

writeFileSync(outJson, JSON.stringify({ scannedAt: new Date().toISOString(), origin: ORIGIN, leads }, null, 2));

const lines = [
  '# Leads scan (auto)',
  '',
  `Scanned: ${new Date().toISOString().slice(0, 10)} · min ${minReviews} reviews · no own website`,
  '',
  '| Tier | Shop | Reviews | Phone | Address | km |',
  '|------|------|---------|-------|---------|-----|',
  ...leads.map(
    (l) =>
      `| ${l.tierLabel} | ${l.name} | ${l.reviews} | ${l.phone || '—'} | ${l.address} | ${l.km} |`,
  ),
  '',
  `Total: ${leads.length}. Re-run: \`npm run leads:scan\``,
  '',
];

writeFileSync(outMd, lines.join('\n'));
console.log(`Wrote ${leads.length} leads → docs/ops/leads-data.{json,md}`);
