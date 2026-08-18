import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Uso: npm run import:renova -- ./renova-vintagedealers.json');
  process.exit(1);
}

const ROOT = process.cwd();
const ASSET_DIR = path.join(ROOT, 'public', 'demos', 'vintagedealers', 'products');
const CATALOG_FILE = path.join(ROOT, 'src', 'data', 'demos', 'vintagedealers.catalog.ts');
const SOURCE_PROFILE = 'https://www.renovatuvestidor.com/vestidor/id/1482248?user=1482248';

const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
const slugify = (value = '') => clean(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'item';

function categoryFromUrl(sourceUrl = '') {
  try {
    const parts = new URL(sourceUrl).pathname.split('/').filter(Boolean);
    const productIndex = parts.indexOf('producto');
    const broad = parts[productIndex + 2]?.toLowerCase() || '';
    if (broad.includes('ropa')) return 'ropa';
    if (broad.includes('calzado')) return 'calzado';
    if (broad.includes('acces')) return 'accesorios';
  } catch {
    // Fall through to catch-all.
  }
  return 'otros';
}

function extractSize(text = '') {
  const normalized = clean(text);
  const patterns = [
    /\btalle\s*:?-?\s*([a-z0-9]{1,8}(?:\s*\/\s*[a-z0-9]{1,8})?)/i,
    /\bsize\s*:?-?\s*([a-z0-9]{1,8})/i,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) return clean(match[1]).toUpperCase();
  }
  return '';
}

function extensionFromType(contentType = '', sourceUrl = '') {
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('avif')) return 'avif';
  if (contentType.includes('gif')) return 'gif';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return 'jpg';
  const match = new URL(sourceUrl).pathname.match(/\.([a-z0-9]{2,5})$/i);
  return match?.[1]?.toLowerCase() || 'jpg';
}

async function downloadImage(sourceUrl, baseName) {
  const response = await fetch(sourceUrl, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; GatriviCatalogMigration/1.0)',
      referer: SOURCE_PROFILE,
      accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
    redirect: 'follow',
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const contentType = response.headers.get('content-type') || '';
  if (contentType && !contentType.startsWith('image/')) {
    throw new Error(`No es imagen (${contentType})`);
  }

  const extension = extensionFromType(contentType, sourceUrl);
  const fileName = `${baseName}.${extension}`;
  await writeFile(path.join(ASSET_DIR, fileName), Buffer.from(await response.arrayBuffer()));
  return `/demos/vintagedealers/products/${fileName}`;
}

const source = JSON.parse(await readFile(path.resolve(inputPath), 'utf8'));
const products = Array.isArray(source.products) ? source.products.filter((product) => !product.error) : [];

if (!products.length) {
  console.error('El export no contiene productos válidos.');
  process.exit(1);
}

await mkdir(ASSET_DIR, { recursive: true });

const items = [];
let downloadedImages = 0;
let remoteFallbacks = 0;
let missingPrices = 0;

for (let index = 0; index < products.length; index += 1) {
  const product = products[index];
  const externalId = clean(product.externalId) || String(index + 1);
  const id = `${externalId}-${slugify(product.name).slice(0, 45)}`;
  const size = extractSize(product.rawText || product.description || '');
  const price = Number(product.price);
  const validPrice = Number.isFinite(price) && price > 0;
  if (!validPrice) missingPrices += 1;

  const localImages = [];
  const sourceImages = [...new Set((product.images || []).filter((url) => /^https?:\/\//i.test(url)))].slice(0, 6);

  for (let imageIndex = 0; imageIndex < sourceImages.length; imageIndex += 1) {
    const imageUrl = sourceImages[imageIndex];
    try {
      const local = await downloadImage(imageUrl, `${externalId}-${imageIndex + 1}`);
      localImages.push(local);
      downloadedImages += 1;
    } catch (error) {
      // Keep the remote URL so the catalog is usable even if one CDN asset rejects the migration request.
      localImages.push(imageUrl);
      remoteFallbacks += 1;
      console.warn(`[imagen] ${externalId}: ${error.message}`);
    }
  }

  items.push({
    id,
    name: clean(product.name) || `Prenda ${externalId}`,
    category: categoryFromUrl(product.sourceUrl),
    description: clean(product.description) || 'Prenda seleccionada por vintagedealers.',
    images: localImages,
    options: [
      {
        id: 'unidad',
        label: size ? `Talle ${size}` : 'Única',
        price: validPrice ? price : 0,
        available: validPrice,
      },
    ],
    available: validPrice,
  });
}

const header = `import type { MenuItemType } from '../menu';\n\n`;
const body = `/** Generated from Gaia's public Renová Tu Vestidor catalog. */\nexport const VINTAGEDEALERS_ITEMS = ${JSON.stringify(items, null, 2)} satisfies MenuItemType[];\n`;
await writeFile(CATALOG_FILE, header + body, 'utf8');

console.log(`Productos importados: ${items.length}`);
console.log(`Imágenes copiadas: ${downloadedImages}`);
console.log(`Imágenes remotas de fallback: ${remoteFallbacks}`);
console.log(`Productos sin precio detectado: ${missingPrices}`);
console.log(`Catálogo: ${path.relative(ROOT, CATALOG_FILE)}`);
