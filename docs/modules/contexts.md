# Contexts

Purpose: global React state for menu, plan, auth, language.

Paths: `src/context/`

| Context | Role |
|---------|------|
| MenuContext | menu, extras, settings, promotions, USD rate; localStorage + Firestore sync |
| PlanContext | plan tier, feature flags, tenantId |
| AdminContext | login state, panel visibility, rate limiting |
| LanguageContext | selected locale |

Provider order in `main.jsx`: Plan → Admin → Menu → Language.

See also: [features/firebase-tenants.md](../features/firebase-tenants.md)
