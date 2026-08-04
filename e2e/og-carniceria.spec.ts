import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('carnicería OG HTML', () => {
  test('built demo-carniceria.html has dedicated meta (no generic Gatrivi OG)', async () => {
    const html = readFileSync(resolve('dist/demo-carniceria.html'), 'utf8');
    expect(html).toContain('<title>Demo de tienda para carnicerías — Gatrivi.com</title>');
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('og:title" content="Demo de tienda para carnicerías — Gatrivi.com"');
    expect(html).toContain('og:image" content="https://tmm.gatrivi.com/demos/carniceria/og.png"');
    expect(html).not.toContain('og:image" content="https://tmm.gatrivi.com/gatrivi-og.png"');
    expect(html).toContain('twitter:title" content="Demo de tienda para carnicerías — Gatrivi.com"');
  });

  test('initial HTTP response for /demo/carniceria serves carnicería meta', async ({ request }) => {
    const res = await request.get('/demo/carniceria');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('Demo de tienda para carnicerías — Gatrivi.com');
    expect(html).toContain('noindex,follow');
    expect(html).toContain('/demos/carniceria/og.png');
    expect(html).not.toContain('gatrivi-og.png');
  });

  test('landing / keeps generic Gatrivi OG', async ({ request }) => {
    const res = await request.get('/');
    const html = await res.text();
    expect(html).toContain('Soluciones Web Gatrivi.com — Tu tienda online');
    expect(html).toContain('gatrivi-og.png');
  });
});
