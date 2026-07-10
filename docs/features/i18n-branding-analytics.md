# i18n, branding, analytics

Purpose: multi-language storefront, white-label theming, visit metrics.

Paths: `src/i18n/translations.ts`, `src/context/LanguageContext.tsx`, `src/components/admin/AdminBranding.tsx`, `src/utils/analyticsTracker.ts`

Deps: localStorage keys `elpuestito_language`, `elpuestito_analytics`

## i18n

- Languages: es, en, pt, ru, de
- Menu fields per language in `MenuItemType`
- Admin can reset texts per language

## Branding

- CSS vars injected from `SiteSettings` (`--brand-color`, etc.)
- Logo upload WebP-compressed in admin; default fallback `/puestito.png`

## Analytics

- Page views, session time, language stats in localStorage
- Demo mode injects synthetic dashboard data

See also: [modules/contexts.md](../modules/contexts.md), [components/admin-panel.md](../components/admin-panel.md)
