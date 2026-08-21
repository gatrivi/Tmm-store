/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  type Plan,
  type PlanFeatures,
  parsePlan,
  getPlanFeatures,
  PLAN_LABELS,
} from '../config/plans';
import { getDemoByTenantId, isDemoTenant, resolveTenantIdFromPath } from '../utils/demoRegistry';

/** Session-sticky demo preview override (sales switch: catálogo / WSP / MP). */
const DEMO_PLAN_OVERRIDE_KEY = 'trufi_demo_plan_override';

function readDemoPlanOverride(): Plan | null {
  try {
    const raw = sessionStorage.getItem(DEMO_PLAN_OVERRIDE_KEY);
    return raw === 'menu' || raw === 'pedidos' || raw === 'premium' ? raw : null;
  } catch {
    return null;
  }
}

interface PlanContextValue {
  plan: Plan;
  planLabel: string;
  features: PlanFeatures;
  tenantId: string;
  /** Present only inside demos; lets the preview switch re-gate the page live. */
  setDemoPlanOverride?: (plan: Plan | null) => void;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tenantId = resolveTenantIdFromPath(window.location.pathname);
  const vertical = getDemoByTenantId(tenantId);
  const basePlan = vertical
    ? vertical.plan
    : tenantId === 'demo'
      ? 'premium'
      : parsePlan(import.meta.env.VITE_PLAN as string | undefined);

  const isDemo = isDemoTenant(tenantId);
  const [demoPlanOverride, setOverride] = useState<Plan | null>(() =>
    isDemo ? readDemoPlanOverride() : null,
  );

  const setDemoPlanOverride = useCallback((next: Plan | null) => {
    setOverride(next);
    try {
      if (next) sessionStorage.setItem(DEMO_PLAN_OVERRIDE_KEY, next);
      else sessionStorage.removeItem(DEMO_PLAN_OVERRIDE_KEY);
    } catch {
      /* storage unavailable: override lives for this mount only */
    }
  }, []);

  const plan = isDemo && demoPlanOverride ? demoPlanOverride : basePlan;

  const value = useMemo(
    () => ({
      plan,
      planLabel: PLAN_LABELS[plan],
      features: getPlanFeatures(plan),
      tenantId,
      setDemoPlanOverride: isDemo ? setDemoPlanOverride : undefined,
    }),
    [plan, tenantId, isDemo, setDemoPlanOverride],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
