import type { Plan } from '../../config/plans';
import type { MenuItemType } from '../menu';
import type { MenuCategory } from '../../types/menuCategory';
import type { OrderRecord } from '../../types/order';
import type { MenuLayoutId } from '../../utils/menuLayouts';

/** Subset of site settings used by demo verticals — avoids MenuContext cycle. */
export type DemoSiteSettings = {
  showUsdToggle?: boolean;
  whatsappNumber?: string;
  bankAlias?: string;
  brandName?: string;
  brandColor?: string;
  brandColorDark?: string;
  brandColorLight?: string;
  brandAccent?: string;
  brandTextColor?: string;
  brandFont?: string;
  brandAddress?: string;
  brandInstagram?: string;
  brandGoogleMaps?: string;
  brandLogo?: string;
  menuLayout?: MenuLayoutId;
  demoMode?: boolean;
  mpEnabled?: boolean;
};

export interface DemoCopy {
  heroTitle: string;
  heroBody: string;
  checkoutCta: string;
  cartCta: string;
  totalLabel: string;
  totalHint: string;
  ownerTitle: string;
  ownerSubtitle: string;
  ribbonLabel: string;
  pickupLabel: string;
  deliveryLabel: string;
  pickupHint: string;
  deliveryHint: string;
  cashLabel: string;
  transferLabel: string;
  submitLabel: string;
  reviewTitle: string;
  reviewBody: string;
  addressPlaceholder: string;
  successEyebrow: string;
  transferAliasPending: string;
  successTitle: string;
  successBody: string;
  ownerLinkLabel: string;
  statusLinkLabel: string;
  continueLabel: string;
  revenueLabel: string;
  notesPlaceholder: string;
  chips: [string, string];
  weightNotice: string;
}

export interface DemoTheme {
  hueso: string;
  bordo: string;
  carbon: string;
  papel: string;
  salvia: string;
}

export interface DemoDefinition {
  id: string;
  tenantId: string;
  customerPath: string;
  ownerPath: string;
  orderPath: (orderId: string) => string;
  plan: Plan;
  locale: 'es';
  siteSettings: DemoSiteSettings;
  menuItems: MenuItemType[];
  menuCategories: MenuCategory[];
  seedOrders: OrderRecord[];
  copy: DemoCopy;
  theme: DemoTheme;
  /** Optional hero/brand photo; object-position pairs with the asset */
  heroImage?: string;
  heroObjectPosition?: string;
  monogram: string;
  hideLanguageSwitcher: boolean;
  hideThemeToggle: boolean;
  hideShare: boolean;
  hideAddress: boolean;
  hidePromos: boolean;
  forceOpen: boolean;
  /** Editorial subpages rendered by storefronts that opt in (cómo cocinar, de campo…). */
  contentPages?: DemoContentPage[];
}

/** Editorial subpage (cómo cocinar, de campo, etc.) rendered by demo storefronts that opt in. */
export interface DemoContentPage {
  /** URL slug under /demo/<id>/ */
  slug: string;
  navLabel: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
}
