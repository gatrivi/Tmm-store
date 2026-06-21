# Promotions and reports

Purpose: coupon discounts at checkout; revenue metrics in admin dashboard.

Paths: `src/components/admin/AdminPromotions.tsx`, `src/types/promotion.ts`, `src/components/admin/AdminDashboard.tsx`, `src/components/admin/AdminMenuEditor.tsx` (bulk pricing)

Deps: `promotions` in `MenuContext`; `fetchOrdersForReports()` when demo off

## Promotions

- Admin creates code, percent or fixed discount, min order
- Storefront applies via `calculateDiscount()`
- Passed through checkout and WhatsApp message

## Reports

- Demo mode: synthetic metrics in dashboard
- Real mode: today's order count, revenue, top products from `orderService`

## Bulk pricing

- Pedidos+: percent increase/decrease on all menu option prices

See also: [modules/config-types.md](../modules/config-types.md), [features/orders-admin.md](./orders-admin.md)
