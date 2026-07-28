import { expect, test } from '@playwright/test';

test.describe('demo mamabel encargo', () => {
  test('portfolio + form opens WhatsApp with encoded message', async ({ page }) => {
    test.setTimeout(45_000);
    await page.goto('/demo/mamabel');
    await expect(page.getByRole('heading', { name: 'Tortas que se recuerdan' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Agregar' })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Trabajos' })).toBeVisible();

    await page.getByRole('button', { name: 'Contanos tu idea' }).first().click();
    await expect(page.locator('#encargar')).toBeInViewport();

    await page.locator('#mm-portions').fill('24');
    await page.locator('#mm-date').fill('2026-09-01');
    await page.locator('#mm-idea').fill('Flores rosa');

    const popupPromise = page.waitForEvent('popup');
    await page.locator('#encargar').getByRole('button', { name: 'Encargar por WhatsApp' }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    const url = popup.url();
    expect(url).toMatch(/5491156196941/);
    expect(url).toMatch(/[?&]text=/);
    const raw = (url.match(/[?&]text=([^&]*)/) || [])[1] ?? '';
    const text = decodeURIComponent(raw.replace(/\+/g, ' '));
    expect(text).toContain('Porciones');
    expect(text).toContain('24');
    expect(text).toContain('2026-09-01');
    expect(text).toContain('Flores rosa');
    expect(text).toContain('Cotizar');
    expect(url).not.toContain('%EF%BF%BD');
    expect(text).not.toContain('\uFFFD');
  });

  test('required field errors stay visible', async ({ page }) => {
    await page.goto('/demo/mamabel#encargar');
    await page.locator('#encargar').getByRole('button', { name: 'Encargar por WhatsApp' }).click();
    await expect(page.getByRole('alert').filter({ hasText: /porciones/i })).toBeVisible();
    await expect(page.getByRole('alert').filter({ hasText: /fecha/i })).toBeVisible();
    await page.locator('#mm-portions').fill('10');
    await expect(page.getByRole('alert').filter({ hasText: /porciones/i })).toHaveCount(0);
    await expect(page.getByRole('alert').filter({ hasText: /fecha/i })).toBeVisible();
  });
});
