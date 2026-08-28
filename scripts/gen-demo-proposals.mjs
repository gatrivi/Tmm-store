import { chromium } from 'playwright-core';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import QR from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const PROPOSALS = [
  { slug: 'pizzeria', label: 'Pizzería', hook: '¿Pedidos perdidos <em>en el chat?</em>', body: 'Muzzas, empanadas y combos con foto y precio. El pedido te llega armado, no a audio.' },
  { slug: 'panaderia', label: 'Panadería', hook: '¿Facturas para las 7? <em>Anotadas al vuelo.</em>', body: 'Media o docena, retiro con horario. El encargo se arma solo y lo ves en la bandeja.' },
  { slug: 'canavesi', label: 'Carnicería', hook: '¿"Mandame 2 kg <em>de algo</em>"?', body: 'Cortes con foto y precio por kilo. Total estimado antes de preparar.' },
  { slug: 'carniceria', label: 'Carnicería · combos', hook: '¿Cortes por WhatsApp <em>a las apuradas?</em>', body: 'Combos y cortes claros. Retiro o delivery, total estimado.' },
  { slug: 'verduleria', label: 'Verdulería', hook: '¿La lista semanal <em>por audio?</em>', body: 'Bolsón, kilos y unidades. El pedido semanal llega ordenado.' },
  { slug: 'polleria-del-barrio', label: 'Pollería', hook: '¿Pollo + papas <em>sin saber qué quiere?</em>', body: 'Entero o medio, combos con papas. Pedido claro, sin ida y vuelta.' },
  { slug: 'molino-florida', label: 'Molino / insumos', hook: '¿Reposición de harina <em>por teléfono</em>?', body: 'Harinas y granos por bolsa o bulto. La reposición semanal, armada en minutos.' },
  { slug: 'ferreteria', label: 'Ferretería', hook: '¿"Tenés uno de estos" <em>sin foto ni medida?</em>', body: 'Herramientas y medidas claras. El cliente pide bien lo que necesita.' },
  { slug: 'heladeria', label: 'Heladería', hook: '¿Sabores por audio <em>que se pierden?</em>', body: 'Cuartos y sabores elegidos en pantalla. Fin de semana sin caos.' },
  { slug: 'cafe-roca', label: 'Café / restaurante', hook: '¿Carta desactualizada <em>y reserva por DM?</em>', body: 'Carta viva con fotos y reserva directa, todo desde el celular.' },
  { slug: 'confiteria-parana', label: 'Confitería', hook: '¿Merienda llena, <em>pedido a mano</em>?', body: 'Facturas, café y tortas encargadas con retiro coordinado.' },
  { slug: 'zimba-pet', label: 'Pet shop', hook: '¿"Lo de siempre" <em>cada semana</em>?', body: 'Alimento y reposición habitual en pocos toques. Retiro o delivery.' },
];

const { URL } = process;
const shotsOnly = process.argv.includes('--shots-only');
const WIDTH = 390;
const HEIGHT = 844;
const deviceScaleFactor = 2;

async function captureScreenshot(browser, slug, origin) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  const url = `https://tmm.gatrivi.com/${slug}`;
  console.log(` Navigating ${slug} to ${url}` );
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500);

  const screenshotPath = path.join(root, 'public', 'print', 'proposal-shots', `${slug}_shot.png`);
  await page.screenshot({ path: screenshotPath, type: 'png', fullPage: false });

  await context.close();
  return screenshotPath;
}

async function generateProposal(slug, screenshotPath) {
  const { label, hook, body } = PROPOSALS.find(p => p.slug === slug) || {};
  const qrUrl = `https://tmm.gatrivi.com/${slug}?utm_source=proposal&utm_medium=qr&utm_campaign=${slug}-flyer`;

  const qrBuffer = await QR.toBuffer(qrUrl, {
    type: 'png',
    width: 1024,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  const urlDisplay = `tmm.gatrivi.com/${slug}`;
  const brand = 'Gatrivi.com · ZengaSoft';
  const offerLine = 'OFERTA ESPECIAL: Consulta por precio y disponibilidad sin compromiso.';

  const cells = `<!--cell ${label}-->\n<div class="flyer">\n<div class="hook">${hook}</div>\n<div class="body">${body}</div>\n<img class="shot" src="${screenshotPath}" />\n<div class="qr"><img src="data:image/png;base64,${Buffer.from(qrBuffer).toString('base64')}" /></div>\n<div class="offer">${offerLine}</div>\n<div class="brand">${brand}</div>\n<div class="url">${urlDisplay}</div>\n</div>`;

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8" />
    <link rel="stylesheet" href="./takeshi-palette.css" />
    <style>
      @page { size: A4; margin: 0; }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: Georgia, "Times New Roman", serif;
        color: var(--takeshi-night);
        background: var(--takeshi-paper);
      }
      .sheet {
        width: 210mm;
        height: 297mm;
        display: grid;
        grid-template-columns: 105mm 105mm;
        grid-template-rows: 148.5mm 148.5mm;
        background: var(--takeshi-paper);
      }
      .flyer {
        position: relative;
        padding: 10mm 9mm 8mm;
        border: 0.35pt dashed var(--takeshi-plum);
        background: var(--takeshi-paper);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        page-break-inside: avoid;
      }
      .flyer:nth-child(1) { border-top: 0; border-left: 0; }
      .flyer:nth-child(2) { border-top: 0; border-right: 0; }
      .flyer:nth-child(3) { border-bottom: 0; border-left: 0; }
      .flyer:nth-child(4) { border-bottom: 0; border-right: 0; }
      .hook {
        font-size: 15pt;
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.02em;
        color: var(--takeshi-night);
      }
      .hook em {
        font-style: normal;
        color