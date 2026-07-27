/**
 * Deterministic menu match for AI chat — do not depend on the LLM for short catalogs.
 */
export interface MenuOptionPayload {
  id: string;
  label: string;
  price: number;
  available?: boolean;
}

export interface MenuItemPayload {
  id: string;
  name: string;
  description?: string;
  options: MenuOptionPayload[];
  available?: boolean;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseQty(text: string): number {
  const n = text.match(/\b(\d+)\b/);
  if (n) return Math.min(20, Math.max(1, parseInt(n[1], 10)));
  if (/\b(dos)\b/.test(text)) return 2;
  if (/\b(tres)\b/.test(text)) return 3;
  return 1;
}

function scoreItem(query: string, item: MenuItemPayload): number {
  const q = normalize(query);
  if (!q) return 0;
  const name = normalize(item.name);
  const id = normalize(item.id.replace(/-/g, ' '));

  if (name && (q === name || q.includes(name) || name.includes(q))) return 100;
  if (id && q.includes(id)) return 90;

  const nameTokens = name.split(' ').filter(t => t.length > 2);
  const hits = nameTokens.filter(t => q.includes(t));
  if (hits.length) return 50 + hits.length * 15;
  return 0;
}

function pickOption(item: MenuItemPayload, query: string): MenuOptionPayload | null {
  const opts = item.options.filter(o => o.available !== false);
  if (!opts.length) return null;
  const q = normalize(query);
  const byLabel = opts.find(o => {
    const label = normalize(o.label);
    return label.length > 2 && q.includes(label);
  });
  return byLabel || opts[0];
}

export function findBestMenuMatch(
  query: string,
  menuItems: MenuItemPayload[],
): { item: MenuItemPayload; option: MenuOptionPayload; qty: number; score: number } | null {
  const available = menuItems.filter(i => i.available !== false);
  let best: { item: MenuItemPayload; score: number } | null = null;
  for (const item of available) {
    const score = scoreItem(query, item);
    if (score <= 0) continue;
    if (!best || score > best.score) best = { item, score };
  }
  if (!best || best.score < 50) return null;
  const option = pickOption(best.item, query);
  if (!option) return null;
  return { item: best.item, option, qty: parseQty(normalize(query)), score: best.score };
}

/**
 * Local catalog answer when the user names a menu item.
 * Returns tagged text so parseActions still works.
 */
export function catalogReplyWithTag(
  query: string,
  menuItems: MenuItemPayload[],
): string | null {
  const match = findBestMenuMatch(query, menuItems);
  if (!match) return null;

  const q = normalize(query);
  const price = match.option.price.toLocaleString('es-AR');
  const label = `${match.item.name} (${match.option.label})`;

  if (/\b(precio|cuanto|sale|vale)\b/.test(q)) {
    return `${label} sale $${price}.`;
  }

  const wantsAdd =
    /\b(quiero|dame|pedi|pedí|agreg|suma|mand|traer|pone|poneme)\b/.test(q)
    || match.score >= 90;

  if (wantsAdd) {
    return (
      `Perfecto: ${match.qty}× ${label} — $${price}. Ya lo sumé al carrito.\n`
      + `[ADD_CART:${match.item.id}:${match.option.id}:${match.qty}]`
    );
  }

  return `Sí, tenemos ${label} a $${price}. ¿La agrego al carrito?`;
}
