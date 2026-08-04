/**
 * Runnable: npx --yes tsx src/utils/salesContact.selfcheck.ts
 */
import assert from 'node:assert/strict';
import {
  buildSalesContactHref,
  buildSalesContactHrefFrom,
  hasSalesWhatsApp,
  hasSalesWhatsAppFrom,
} from './salesContact';

function main() {
  assert.equal(hasSalesWhatsAppFrom({ whatsappNumber: '5491112345678' }), true);
  const wa = buildSalesContactHrefFrom({ whatsappNumber: '5491112345678' }, 'landing test');
  assert.match(wa, /^https:\/\/wa\.me\/5491112345678\?text=/);
  assert.match(decodeURIComponent(wa), /Origen: landing test/);
  assert.match(decodeURIComponent(wa), /Gatrivi\.com/);

  assert.equal(hasSalesWhatsAppFrom({}), false);
  const mail = buildSalesContactHrefFrom({ whatsappNumber: '', email: 'test@example.com' }, 'email fallback');
  assert.match(mail, /^mailto:/);
  assert.match(decodeURIComponent(mail), /Origen: email fallback/);

  assert.equal(hasSalesWhatsApp(), true);
  assert.match(buildSalesContactHref('default line'), /wa\.me\/5491156199363/);

  console.log('salesContact.selfcheck: ok');
}

main();
