#!/usr/bin/env node
/**
 * Validates env vars for Pedidos MVP production deploy.
 * Usage: node scripts/check-env.mjs [--strict]
 * Loads .env from repo root if present (simple KEY=VALUE parser).
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const strict = process.argv.includes('--strict');

function loadDotEnv() {
  const path = resolve(root, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const clientRequired = [
  'VITE_PLAN',
  'VITE_TENANT_ID',
  'VITE_WHATSAPP_NUMBER',
  'VITE_ADMIN_USER_HASH',
  'VITE_ADMIN_PASS_HASH',
];

const firebaseClient = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const serverRecommended = [
  'MP_ACCESS_TOKEN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_API_KEY',
  'TENANT_ID',
];

const salesRecommended = [
  'VITE_SALES_WHATSAPP_NUMBER',
  'VITE_DEMO_INTAKE_URL',
  'VITE_DEMO_PRICE_LABEL',
];

function status(key) {
  const v = process.env[key];
  return v && v.length > 0 ? 'ok' : 'missing';
}

let failed = false;

console.log('\nTrufi — env check (Pedidos MVP)\n');

for (const key of clientRequired) {
  const s = status(key);
  if (s === 'missing') failed = true;
  console.log(`  ${s === 'ok' ? '✓' : '✗'} ${key}`);
}

console.log('\nFirebase (client — required for multi-device):');
let firebaseOk = true;
for (const key of firebaseClient) {
  const s = status(key);
  if (s === 'missing') firebaseOk = false;
  console.log(`  ${s === 'ok' ? '✓' : '✗'} ${key}`);
}

console.log('\nServer (Vercel — MP webhook):');
for (const key of serverRecommended) {
  const s = status(key);
  console.log(`  ${s === 'ok' ? '✓' : '○'} ${key}${s === 'missing' ? ' (optional if no MP)' : ''}`);
}

console.log('\nSales landing (Vercel Production — at least one CTA channel):');
let salesChannelOk = false;
for (const key of salesRecommended) {
  const s = status(key);
  if (key === 'VITE_SALES_WHATSAPP_NUMBER' && s === 'ok') salesChannelOk = true;
  if (key === 'VITE_DEMO_INTAKE_URL' && s === 'ok') salesChannelOk = true;
  console.log(`  ${s === 'ok' ? '✓' : '○'} ${key}${s === 'missing' ? ' (recommended)' : ''}`);
}
if (!salesChannelOk) {
  console.log('\n→ Sales CTAs fall back to email. Set VITE_SALES_WHATSAPP_NUMBER or VITE_DEMO_INTAKE_URL.');
}

if (!firebaseOk) {
  console.log('\n→ Firebase incomplete: admin shows "Local" badge. See docs/ops/firebase-setup.md');
}

if (strict && (!firebaseOk || failed)) {
  console.error('\nStrict mode: fix missing vars before deploy.\n');
  process.exit(1);
}

if (failed) {
  console.error('\nMissing required client vars.\n');
  process.exit(1);
}

console.log('\nClient env OK.');
if (firebaseOk) console.log('Firebase client vars OK — expect "Nube" badge when deployed.');
console.log('Next: npm run deploy:rules  |  docs/ops/smoke-test.md\n');
