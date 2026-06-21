import { menuData, type MenuItemType, type MenuOption } from '../data/menu';
import type {
  MenuCategory,
  MenuImportReviewRow,
  ParsedMenuCategory,
  ParsedMenuResult,
} from '../types/menuCategory';

export function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'item';
}

function uniqueId(base: string, used: Set<string>): string {
  let id = slugifyId(base);
  let n = 1;
  while (used.has(id)) {
    id = `${slugifyId(base)}-${n}`;
    n += 1;
  }
  used.add(id);
  return id;
}

export function categoriesFromParsed(parsed: ParsedMenuCategory[]): MenuCategory[] {
  const used = new Set<string>();
  return parsed.map((cat, index) => ({
    id: uniqueId(cat.name, used),
    name: cat.name.trim(),
    sortOrder: index,
  }));
}

export function parsedToReviewRows(parsed: ParsedMenuResult): MenuImportReviewRow[] {
  const rows: MenuImportReviewRow[] = [];
  let rowCounter = 0;

  for (const cat of parsed.categories) {
    const categoryId = slugifyId(cat.name);
    for (const item of cat.items) {
      if (item.variants && item.variants.length > 0) {
        const samePrice = item.variants.every(v => (v.price ?? item.price) === item.price);
        if (samePrice) {
          rows.push({
            rowId: `row-${rowCounter++}`,
            categoryId,
            categoryName: cat.name,
            name: item.name,
            description: item.description ?? '',
            price: item.price,
            variantLabel: item.variants.map(v => v.name).join(' / '),
          });
        } else {
          for (const v of item.variants) {
            rows.push({
              rowId: `row-${rowCounter++}`,
              categoryId,
              categoryName: cat.name,
              name: `${item.name} ${v.name}`.trim(),
              description: item.description ?? '',
              price: v.price ?? item.price,
              variantLabel: '',
            });
          }
        }
      } else {
        rows.push({
          rowId: `row-${rowCounter++}`,
          categoryId,
          categoryName: cat.name,
          name: item.name,
          description: item.description ?? '',
          price: item.price,
          variantLabel: '',
        });
      }
    }
  }
  return rows;
}

export function reviewRowsToCategories(rows: MenuImportReviewRow[]): MenuCategory[] {
  const seen = new Map<string, MenuCategory>();
  let order = 0;
  for (const row of rows) {
    const key = row.categoryId || slugifyId(row.categoryName);
    if (!seen.has(key)) {
      seen.set(key, {
        id: key,
        name: row.categoryName.trim() || 'Menú',
        sortOrder: order++,
      });
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function reviewRowsToMenuItems(rows: MenuImportReviewRow[]): MenuItemType[] {
  const usedIds = new Set<string>();
  const grouped = new Map<string, MenuImportReviewRow[]>();

  for (const row of rows) {
    if (!row.name.trim() || row.price <= 0) continue;
    const key = `${row.categoryId}::${row.name}::${row.variantLabel || row.rowId}`;
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  }

  const items: MenuItemType[] = [];

  for (const groupRows of grouped.values()) {
    const first = groupRows[0];
    const itemId = uniqueId(first.name, usedIds);
    const categoryId = first.categoryId || slugifyId(first.categoryName);

    let options: MenuOption[];

    if (first.variantLabel && first.variantLabel.includes('/')) {
      const labels = first.variantLabel.split('/').map(s => s.trim()).filter(Boolean);
      options = labels.map((label, i) => ({
        id: `${itemId}-opt-${i + 1}`,
        label,
        price: first.price,
        available: true,
      }));
    } else {
      options = [{
        id: `${itemId}-default`,
        label: 'Standard',
        price: first.price,
        available: true,
      }];
    }

    items.push({
      id: itemId,
      name: first.name.trim(),
      description: first.description.trim() || first.name.trim(),
      category: categoryId,
      images: [],
      options,
      available: true,
    });
  }

  return items;
}

export function deriveCategoriesFromItems(items: MenuItemType[]): MenuCategory[] {
  const map = new Map<string, MenuCategory>();
  let order = 0;
  for (const item of items) {
    const id = item.category || 'menu';
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        sortOrder: order++,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getInitialMenuCategories(): MenuCategory[] {
  return deriveCategoriesFromItems(menuData);
}

export function resolveStorefrontCategories(
  categories: MenuCategory[],
  items: MenuItemType[],
): MenuCategory[] {
  if (categories.length > 0) return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const derived = deriveCategoriesFromItems(items);
  if (derived.length > 0) return derived;
  return [{ id: 'menu', name: 'Menú', sortOrder: 0 }];
}
