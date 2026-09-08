/* Revisión móvil MVP — La Inmaculada (sólo para QA manual, no va a CI) */
/* eslint-disable */
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  // Capturar el mensaje de WhatsApp sin abrir wa.me de verdad
  let waUrl = '';
  await page.addInitScript(() => {
    window.open = (url) => {
      window.__waUrl = url;
      return null;
    };
  });

  await page.goto('http://localhost:5199/inmaculada', { waitUntil: 'networkidle' });

  // 1) Hero/crop + 2) densidad de lista — full page
  await page.screenshot({ path: 'shots/01-full.png', fullPage: true });

  // 3) Carrito sticky — agregar 2 productos y ver la barra
  await page.locator('.inm-pill').first().tap();
  await page.locator('.inm-drawer .inm-close').tap();
  const banana = page.locator('.inm-row', { hasText: 'Banana' }).locator('.inm-pill').first();
  await banana.tap();
  await page.locator('.inm-drawer .inm-close').tap();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/02-sticky.png' });

  // Drawer del carrito
  await page.locator('.inm-sticky').tap();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'shots/03-cart.png' });

  // 4) Mensaje final de WhatsApp — checkout completo y capturar URL
  await page.locator('button', { hasText: 'Confirmar pedido' }).tap();
  await page.fill('input[autocomplete="name"]', 'Clara');
  await page.fill('input[autocomplete="tel"]', '11 5555 5555');
  await page.fill('input[autocomplete="street-address"]', 'Corrientes 555, Olivos');
  await page.fill('textarea', 'Banana madura');
  await page.screenshot({ path: 'shots/04-checkout.png' });
  await page.locator('button', { hasText: 'Enviar pedido por WhatsApp' }).tap();
  await page.waitForTimeout(300);
  waUrl = await page.evaluate(() => window.__waUrl || '');
  await page.screenshot({ path: 'shots/05-sent.png' });

  console.log('WA_URL:\n' + decodeURIComponent(waUrl.replace(/^https:\/\/wa\.me\/\d+\?text=/, '')));
  console.log('WA_URL_RAW: ' + waUrl);

  // Verificar footer de Gatrivi ausente
  const shareFooter = await page.locator('text=Esta demo tiene una dirección fácil').count();
  console.log('GATRIVI_FOOTER_VISIBLE: ' + (shareFooter > 0 ? 'SI (mal)' : 'no'));

  await browser.close();
})();
