import type { Plan } from '../config/plans';
import type { SiteSettings } from '../context/MenuContext';
import type { MenuItemType } from '../data/menu';
import type { ExtraItem } from '../context/MenuContext';
import type { Promotion } from './promotion';
import type { MenuCategory } from './menuCategory';

export interface TenantRecord {
  id: string;
  slug: string;
  plan: Plan;
  businessName: string;
  createdAt: string;
  updatedAt: string;
  settings: SiteSettings;
  menuCategories?: MenuCategory[];
  menuItems: MenuItemType[];
  extras: ExtraItem[];
  promotions: Promotion[];
}

export interface CreateTenantInput {
  slug: string;
  plan: Plan;
  businessName: string;
  adminEmail?: string;
}
