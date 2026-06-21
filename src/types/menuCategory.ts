export interface MenuCategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ParsedMenuVariant {
  name: string;
  price?: number;
}

export interface ParsedMenuItem {
  name: string;
  description?: string;
  price: number;
  variants?: ParsedMenuVariant[];
}

export interface ParsedMenuCategory {
  name: string;
  items: ParsedMenuItem[];
}

export interface ParsedMenuBusinessInfo {
  name?: string;
  hours?: string;
  phone?: string;
  instagram?: string;
}

export interface ParsedMenuResult {
  categories: ParsedMenuCategory[];
  businessInfo?: ParsedMenuBusinessInfo;
}

/** Flat row for review table editing */
export interface MenuImportReviewRow {
  rowId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  price: number;
  variantLabel: string;
}
