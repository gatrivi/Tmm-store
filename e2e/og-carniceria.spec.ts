import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('carnicería OG HTML', () => {
  test('built social-carniceria.html has dedicated meta (no generic Gatrivi OG)', () => {
    const html = readFileSync(resolve('dist/social-carniceria.html'), 'utf8');
    expect(html).toContain('<title>Gabriel — demo de tienda para carnicerías</title>');
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toContain('og:title" content="Gabriel — demo de tienda para carnicerías"');
    expect(html).toContain('og:image" content="https://tmm.gatrivi.com/demos/carniceria/og.png"');
    expect(html).not.toContain('og:image" content="https://tmm.gatrivi.com/og/home.png"');
    expect(html).toContain('twitter:title" content="Gabriel — demo de tienda para carnicerías"');
  });

  test('initial HTTP response for /demo/carniceria serves carnicería meta', async ({ request }) => {
    const res = await request.get('/demo/carniceria');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('Gabriel — demo de tienda para carnicerías');
    expect(html).toContain('noindex, follow');
    expect(html).toContain('/demos/carniceria/og.png');
    expect(html).not.toContain('/og/home.png');
  });

  test('landing / keeps generic Gatrivi OG', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    expect(html).toContain('Gatrivi.com — Tu negocio online, listo para vender');
    expect(html).toContain('/og/home.png');
  });
});
