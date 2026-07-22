import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const SHOTS = resolve('docs/roadmap/assets/hito-a');

async function addAsadoKiloAndCombo(page: import('@playwright/test').Page) {
  const asado = page.locator('article').filter({ hasText: 'Asado del medio' });
  await asado.getByRole('button', { name: '1 kg aprox.' }).click();
  await asado.getByRole('button', { name: 'Agregar' }).click();

  const combo = page.locator('article').filter({ hasText: 'Combo parrillero' });
  await combo.getByRole('button', { name: 'Agregar' }).click();
}

test.describe('demo carnicería journey', () => {
  test.beforeEach(async ({ page }) => {
    mkdirSync(SHOTS, { recursive: true });
    await page.goto('/demo/carniceria');
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await page.reload();
  });

  test('delivery + transfer full path', async ({ page }) => {
    test.setTimeout(60_000);
    await expect(page.getByText('Gabriel Carnes').first()).toBeVisible();
    await expect(page.locator('[aria-label^="Versión"]')).toHaveCount(0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBeFalsy();

    await page.screenshot({ path: resolve(SHOTS, 'store.png'), fullPage: false });

    await addAsadoKiloAndCombo(page);

    await page.getByRole('button', { name: /Ver carrito/i }).click();
    await expect(page.locator('.fixed').getByText('$68.800')).toBeVisible();
    await page.getByRole('button', { name: 'Coordinar pedido' }).click();

    await page.getByPlaceholder('Ej: Juan Pérez').fill('Prospecto Test');
    await page.getByPlaceholder('Ej: 11 3184-4469').fill('1100000000');
    await page.locator('[role="dialog"]').getByRole('button', { name: 'Delivery' }).click();
    await page.getByPlaceholder('Calle, altura y localidad').fill('Olivos demo');
    await page.getByRole('button', { name: /Transferencia/i }).click();
    await expect(page.getByText(/Gabriel te envía el alias/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Copiar alias/i })).toHaveCount(0);

    await page.getByRole('button', { name: 'Revisar y enviar pedido' }).click();
    await expect(page.getByText('Revisá tu pedido de prueba').first()).toBeVisible();
    await expect(page.getByText(/Todavía no se envió/i).first()).toBeVisible();
    await expect(page.getByText(/Abrir WhatsApp/i)).toHaveCount(0);

    await page.screenshot({ path: resolve(SHOTS, 'checkout.png'), fullPage: false });

    await page.getByRole('button', { name: 'Enviar pedido de prueba' }).click();
    await expect(page.getByText(/Pedido de prueba creado/i).first()).toBeVisible();
    await expect(page.getByText(/68\.800/)).toBeVisible();

    const chipText = await page.locator('text=/#[A-Z0-9]{4}/').first().innerText();
    const orderId = chipText.match(/#([A-Z0-9]{4})/)?.[1];
    expect(orderId).toBeTruthy();

    await page.getByRole('link', { name: /Ver cómo lo recibe Gabriel/i }).click();
    await expect(page).toHaveURL(/\/demo\/carniceria\/owner/);
    await expect(page.getByText(`#${orderId}`).first()).toBeVisible();
    await expect(page.getByText(/68\.800/).first()).toBeVisible();
    await expect(page.getByText('Nuevo').first()).toBeVisible();

    await page.screenshot({ path: resolve(SHOTS, 'owner.png'), fullPage: false });

    await page.getByRole('button', { name: /Aceptar y preparar/i }).click();
    await expect(page.getByText('Preparando').first()).toBeVisible();

    await page.goto(`/demo/carniceria/order/${orderId}`);
    await expect(page.getByText('Preparando')).toBeVisible();
    await expect(page.getByText('Total estimado')).toBeVisible();
    await expect(page.getByText(/68\.800/)).toBeVisible();
    await expect(page.getByText('Pago a coordinar')).toBeVisible();
    await page.screenshot({ path: resolve(SHOTS, 'tracking.png'), fullPage: false });

    await page.goto('/demo/carniceria');
    await expect(page.getByRole('button', { name: /Ver carrito · \$68/ })).toHaveCount(0);
  });

  test('pickup smoke', async ({ page }) => {
    await page.getByRole('button', { name: 'Retiro' }).first().click();
    const asado = page.locator('article').filter({ hasText: 'Asado del medio' });
    await asado.getByRole('button', { name: 'Agregar' }).click();
    await page.getByRole('button', { name: /Ver carrito/i }).click();
    await page.getByRole('button', { name: 'Coordinar pedido' }).click();
    await page.getByPlaceholder('Ej: Juan Pérez').fill('Retiro Test');
    await page.getByPlaceholder('Ej: 11 3184-4469').fill('1100000001');
    await page.locator('[role="dialog"]').getByRole('button', { name: /Retiro/i }).click();
    await page.getByRole('button', { name: /Efectivo/i }).click();
    await page.getByRole('button', { name: 'Revisar y enviar pedido' }).click();
    await page.getByRole('button', { name: 'Enviar pedido de prueba' }).click();
    await expect(page.getByText(/Pedido de prueba creado/i).first()).toBeVisible();
  });

  test('gastronomy demo smoke', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.locator('body')).toBeVisible();
    await page.goto('/demo/owner');
    await expect(page.getByText(/Pedidos|Bandeja|Local|demo/i).first()).toBeVisible();
  });
});
