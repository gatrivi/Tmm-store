# Firebase and tenants

Purpose: optional cloud sync and multi-tenant provisioning.

Paths: `src/lib/firebase.ts`, `src/services/tenantService.ts`, `src/pages/SuperAdminPage.tsx`, `src/context/MenuContext.tsx`

Deps: `VITE_FIREBASE_*`, `VITE_TENANT_ID`, `VITE_SUPER_ADMIN_KEY`

## Firestore shape

```
tenants/{tenantId}
  plan, settings, menuItems, extras, promotions
  orders/{orderId}
```

## Flow

1. MenuContext hydrates from Firestore on mount if configured
2. Debounced `saveTenantSnapshot()` on local edits
3. Super-admin creates tenants at `/super-admin`

## Gotchas

- Works without Firebase (localStorage only)
- Images still Base64 in storage until Storage migration
- Slug routes: `/s/:slug` resolves tenant from path

See also: [ops/onboarding.md](../ops/onboarding.md), [modules/services.md](../modules/services.md)
