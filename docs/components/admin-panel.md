# Admin panel

Purpose: full-screen admin overlay with plan-filtered sections.

Paths: `src/components/admin/AdminPanel.tsx`, `src/pages/AdminPage.tsx`, subcomponents in `src/components/admin/`

| Section | File | Plan |
|---------|------|------|
| Dashboard | AdminDashboard.tsx | pedidos+ (menu: hidden) |
| Pedidos | AdminOrders.tsx | pedidos+ |
| Menu editor | AdminMenuEditor.tsx | all |
| Images | AdminImageEditor.tsx | all |
| Files | AdminFileManager.tsx | pedidos+ |
| Promotions | AdminPromotions.tsx | pedidos+ |
| Settings | AdminSettings.tsx | all (includes AdminBranding) |

Auth: `AdminContext` SHA-256 env hashes, rate limit, `LoginModal`.

See also: [features/orders-admin.md](../features/orders-admin.md), [modules/contexts.md](../modules/contexts.md)
