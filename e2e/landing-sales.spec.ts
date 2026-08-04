import { expect, test } from '@playwright/test';

test.describe('landing sales CTAs', () => {
  test('reserve and contact links carry sales origin', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Tu tienda/i })).toBeVisible();

    const reserve = page.locator('header a', { hasText: 'Reservar' });
    await expect(reserve).toBeVisible();
    const reserveHref = await reserve.getAttribute('href');
    expect(reserveHref).toBeTruthy();
    expect(reserveHref).not.toBe('#');

    const footerContact = page.locator('footer a', { hasText: 'Contacto' });
    await expect(footerContact).toBeVisible();
    const contactHref = await footerContact.getAttribute('href');
    expect(contactHref).toMatch(/^(https:\/\/wa\.me\/|mailto:)/);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBeFalsy();
  });

  test('demos gallery links are live', async ({ page }) => {
    await page.goto('/demos');
    await expect(page.getByRole('heading', { name: /Elegí el rubro/i })).toBeVisible();

    const clientLinks = page.locator('a', { hasText: /Ver muestra/i });
    const count = await clientLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const href = await clientLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^\/demo/);
    }
  });
});
