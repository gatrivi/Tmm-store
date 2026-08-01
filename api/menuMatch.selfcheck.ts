/**
 * Run: npx --yes tsx api/menuMatch.selfcheck.ts
 */
import assert from 'node:assert/strict';
import { catalogReplyWithTag, findBestMenuMatch } from './menuMatch.js';

const menu = [
  {
    id: 'choripan',
    name: 'Choripán',
    options: [{ id: 'solo', label: 'Solo', price: 5000 }],
  },
  {
    id: 'bondiola',
    name: 'Bondiola',
    description: 'Pan y bondiola',
    options: [
      { id: 'sola', label: 'Sola', price: 13000 },
      { id: 'completa', label: 'Completa', price: 15000 },
    ],
  },
  {
    id: 'burger',
    name: 'Burger completa',
    options: [{ id: 'unica', label: 'Única', price: 18000 }],
  },
  {
    id: 'papas',
    name: 'Papas',
    options: [{ id: 'unica', label: 'Única', price: 5500 }],
  },
  {
    id: 'bebida',
    name: 'Bebida',
    options: [{ id: 'unica', label: 'Única', price: 2000 }],
  },
];

function main() {
  const hit = findBestMenuMatch('quiero una bondiola', menu);
  assert.ok(hit);
  assert.equal(hit.item.id, 'bondiola');
  assert.equal(hit.option.id, 'sola');
  assert.equal(hit.qty, 1);

  const tagged = catalogReplyWithTag('dame 2 bondiola', menu);
  assert.ok(tagged);
  assert.match(tagged, /\[ADD_CART:bondiola:sola:2\]/);

  const price = catalogReplyWithTag('cuánto sale la bondiola', menu);
  assert.ok(price);
  assert.match(price!, /13\.?000|13000/);
  assert.ok(!price!.includes('ADD_CART'));

  const miss = findBestMenuMatch('sushi de salmón', menu);
  assert.equal(miss, null);

  console.log('menuMatch.selfcheck: ok');
}

main();
