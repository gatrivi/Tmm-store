import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test.describe('verdulería OG HTML', () => {
  test('built demo-verduleria.html has dedicated meta', async () => {
    const html = readFileSync(resolve('dist/demo-verduleria.html'), 'utf8');
    expect(html).toContain('<title>Demo de tienda para verdulerías — Gatrivi.com</title>');
    expect(html).toContain('name="robots" content="noindex,follow"');
    expect(html).toContain('og:title" content="Demo de tienda para verdulerías — Gatrivi.com"');
    expect(html).toContain('og:image" content="https://tmm.gatrivi.com/demos/verduleria/og.png"');
    expect(html).not.toContain('og:image" content="https://tmm.gatrivi.com/gatrivi-og.png"');
  });

  test('initial HTTP response for /demo/verduleria serves verdulería meta', async ({ request }) => {
    const res = await request.get('/demo/verduleria');
    expect(res.ok()).toBeTruthy();
    const html = await res.text();
    expect(html).toContain('Demo de tienda para verdulerías — Gatrivi.com');
    expect(html).toContain('noindex,follow');
    expect(html).toContain('/demos/verduleria/og.png');
    expect(html).not.toContain('gatrivi-og.png');
  });
});
