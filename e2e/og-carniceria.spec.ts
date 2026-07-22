import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('carnicería OG HTML', () => {
  test('built demo-carniceria.html has dedicated meta (no generic Trufi OG)', async () => {
    const html = readFileSync(resolve('dist/demo-carniceria.html'), 'utf8');
    expect(html).toContain('<title>Demo de pedidos para carnicerías — Trufi</title>');
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('og:title" content="Demo de pedidos para carnicerías — Trufi"');
    expect(html).toContain('og:image" content="https://tmm.gatrivi.com/demos/carniceria/og.png"');
    expect(html).not.toContain('og:image" content="https://tmm.gatrivi.com/trufi-og.png"');
    expect(html).toContain('twitter:title" content="Demo de pedidos para carnicerías — Trufi"');
  });

  test('initial HTTP response for /demo/carniceria serves carnicería meta', async ({ request }) => {
    const res = await request.get('/demo/carniceria');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('Demo de pedidos para carnicerías — Trufi');
    expect(html).toContain('noindex,follow');
    expect(html).toContain('/demos/carniceria/og.png');
    expect(html).not.toContain('trufi-og.png');
  });

  test('landing / keeps generic Trufi OG', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    expect(html).toContain('Trufi — Pedidos directos para tu negocio');
    expect(html).toContain('trufi-og.png');
  });
});
