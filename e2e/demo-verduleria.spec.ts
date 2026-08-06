import { expect, test } from '@playwright/test';

/** tomate 1kg + banana ½kg + bolsón = 3400+1400+15000 = 19800 */
async function addVerduleriaBasket(page: import('@playwright/test').Page) {
  const tomate = page.locator('article').filter({ hasText: 'Tomate' });
  await tomate.getByRole('button', { name: '1 kg aprox.' }).click();
  await tomate.getByRole('button', { name: 'Agregar' }).click();

  const banana = page.locator('article').filter({ hasText: 'Banana' });
  await banana.getByRole('button', { name: '½ kg aprox.' }).click();
  await banana.getByRole('button', { name: 'Agregar' }).click();

  const bolson = page.locator('article').filter({ hasText: 'Bolsón semanal' });
  await bolson.getByRole('button', { name: 'Agregar' }).click();
}

test.describe('demo verdulería journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/verduleria');
    await page.evaluate(() => {
      sessionStorage.clear();
      localStorage.clear();
    });
    await page.reload();
  });

  test('peso + total estimado full path', async ({ page }) => {
    test.setTimeout(60_000);
    await expect(page.getByText('La Inmaculada').first()).toBeVisible();
    await expect(page.getByText(/Ugarte y España/i).first()).toBeVisible();
    await expect(page.locator('[data-demo-page="verduleria"]')).toBeVisible();

    await addVerduleriaBasket(page);

    const sticky = page.locator('.fixed').filter({ hasText: 'Armar pedido' });
    await expect(sticky.getByText(/19\.800/)).toBeVisible();
    await expect(sticky.getByText('Total estimado')).toBeVisible();
    await sticky.getByRole('button', { name: 'Armar pedido' }).click();

    await page.getByPlaceholder('Ej: Juan Pérez').fill('Prospecto Test');
    await page.getByPlaceholder('Ej: 11 3184-4469').fill('1100000000');
    await page.locator('[role="dialog"]').getByRole('button', { name: 'Delivery' }).click();
    await page.getByPlaceholder('Calle, altura y localidad').fill('Ugarte demo');
    await page.getByRole('button', { name: /Transferencia/i }).click();

    await page.getByRole('button', { name: 'Revisar y enviar pedido' }).click();
    await expect(page.getByText('Revisá tu pedido de prueba').first()).toBeVisible();

    await page.getByRole('button', { name: 'Enviar pedido de prueba' }).click();
    await expect(page.getByText(/Pedido de prueba creado/i).first()).toBeVisible();
    await expect(page.getByText(/19\.800/)).toBeVisible();

    const chipText = await page.locator('text=/#[A-Z0-9]{4}/').first().innerText();
    const orderId = chipText.match(/#([A-Z0-9]{4})/)?.[1];
    expect(orderId).toBeTruthy();

    await page.getByRole('link', { name: /Ver cómo lo reciben en el local/i }).click();
    await expect(page).toHaveURL(/\/demo\/verduleria\/owner/);
    await expect(page.getByText(`#${orderId}`).first()).toBeVisible();
    await expect(page.getByText(/19\.800/).first()).toBeVisible();

    await page.getByRole('button', { name: /Aceptar y preparar/i }).click();
    await expect(page.getByText('Preparando').first()).toBeVisible();

    await page.goto(`/demo/verduleria/order/${orderId}`);
    await expect(page.getByText('Preparando')).toBeVisible();
    await expect(page.getByText('Total estimado')).toBeVisible();
    await expect(page.getByText(/19\.800/)).toBeVisible();
  });

  test('express rubro=verduleria redirects to vertical', async ({ page }) => {
    await page.goto('/demo?negocio=Tu+negocio&barrio=Olivos&rubro=verduleria&color=carbon');
    await expect(page).toHaveURL(/\/demo\/verduleria/);
    await expect(page.getByText('La Inmaculada').first()).toBeVisible();
  });
});
