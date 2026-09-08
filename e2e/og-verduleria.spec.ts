import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('verdulería OG HTML', () => {
  test('built social-verduleria.html has dedicated meta', () => {
    const html = readFileSync(resolve('dist/social-verduleria.html'), 'utf8');
    expect(html).toContain('<title>La Inmaculada — demo de tienda para verdulerías</title>');
    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).toContain('og:title" content="La Inmaculada — demo de tienda para verdulerías"');
    expect(html).toContain('og:image" content="https://tmm.gatrivi.com/demos/verduleria/og.png"');
    expect(html).not.toContain('og:image" content="https://tmm.gatrivi.com/og/home.png"');
  });

  test('initial HTTP response for /demo/verduleria serves verdulería meta', async ({ request }) => {
    const res = await request.get('/demo/verduleria');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('La Inmaculada — demo de tienda para verdulerías');
    expect(html).toContain('noindex, follow');
    expect(html).toContain('/demos/verduleria/og.png');
    expect(html).not.toContain('/og/home.png');
  });
});
