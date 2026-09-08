import { expect, test } from '@playwright/test';

test.describe('landing sales CTAs', () => {
  test('reserve and contact links carry sales origin', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Ver tienda funcionando/i }).first()).toBeVisible();

    const buy = page.locator('header a', { hasText: 'Quiero el mío' });
    await expect(buy).toBeVisible();
    const buyHref = await buy.getAttribute('href');
    expect(buyHref).toMatch(/^(https:\/\/wa\.me\/|mailto:)/);

    const footerContact = page.locator('footer a', { hasText: 'WhatsApp' });
    await expect(footerContact).toBeVisible();
    const contactHref = await footerContact.getAttribute('href');
    expect(contactHref).toMatch(/^(https:\/\/wa\.me\/|mailto:)/);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBeFalsy();
  });

  test('demos gallery links are live', async ({ page }) => {
    await page.goto('/demos');
    await expect(page.getByRole('heading', { name: /Mirá lo que podemos hacer/i })).toBeVisible();

    // Cada tarjeta de demo interna lleva "Probar demo" y ruta propia del sitio.
    const clientLinks = page.locator('a', { hasText: 'Probar demo' });
    const count = await clientLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const href = await clientLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^\//);
    }
  });
});
