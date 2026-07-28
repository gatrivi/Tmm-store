/**
 * Runnable: npx --yes tsx src/utils/mamabelEncargo.selfcheck.ts
 */
import assert from 'node:assert/strict';
import {
  buildMamabelEncargoMessage,
  buildMamabelWaUrl,
  MAMABEL_WSP,
  validateMamabelEncargo,
  type MamabelEncargo,
} from './mamabelEncargo';

const base: MamabelEncargo = {
  name: 'Ana',
  occasion: 'Cumpleaños',
  portions: '20',
  flavor: 'Vainilla',
  filling: 'A definir',
  dateNeeded: '2026-08-15',
  fulfillment: 'pickup',
  idea: 'Flores celestes',
  notes: 'Sin nuez',
};

function assertNoReplacement(s: string, label: string) {
  assert.ok(!s.includes('\uFFFD'), `${label} must not contain U+FFFD`);
  assert.ok(!s.includes('%EF%BF%BD'), `${label} must not contain %EF%BF%BD`);
  assert.ok(!/%EF%BF%BD/i.test(s), `${label} must not encode replacement char`);
}

function main() {
  assert.deepEqual(validateMamabelEncargo({ ...base, portions: '', dateNeeded: '' }), {
    portions: 'Indicá cantidad aproximada de porciones',
    dateNeeded: 'Indicá la fecha necesaria',
  });
  assert.equal(validateMamabelEncargo(base).portions, undefined);
  assert.equal(validateMamabelEncargo(base).dateNeeded, undefined);

  const msg = buildMamabelEncargoMessage(base);
  assert.match(msg, /Encargo - Las Tortas de Mama Mabel/);
  assert.match(msg, /Porciones: 20/);
  assert.match(msg, /Fecha: 2026-08-15/);
  assert.match(msg, /Retiro/);
  assert.match(msg, /adjuntarla/);
  assert.match(msg, /Cotizar/);
  assert.doesNotMatch(msg, /\$\d/);
  assertNoReplacement(msg, 'message');

  // decoded message round-trip (URL → text)
  const url = buildMamabelWaUrl(base);
  assert.ok(url.startsWith(`https://wa.me/${MAMABEL_WSP}?text=`));
  assertNoReplacement(url, 'wa url');
  const encoded = url.slice(url.indexOf('text=') + 5);
  const decoded = decodeURIComponent(encoded);
  assert.equal(decoded, msg);
  assertNoReplacement(decoded, 'decoded message');
  assert.match(encoded, /%0A|%0a/);

  // delivery + empty flavor → A definir
  const msg2 = buildMamabelEncargoMessage({
    ...base,
    name: '',
    flavor: '',
    filling: '',
    fulfillment: 'delivery',
  });
  assert.match(msg2, /Delivery/);
  assert.match(msg2, /Sabor: A definir/);
  assert.doesNotMatch(msg2, /Nombre:/);
  assertNoReplacement(buildMamabelWaUrl({
    ...base,
    name: '',
    flavor: '',
    filling: '',
    fulfillment: 'delivery',
  }), 'delivery wa url');

  console.log('mamabelEncargo.selfcheck: ok');
}

main();
