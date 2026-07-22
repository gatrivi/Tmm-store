/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import {
  type Plan,
  type PlanFeatures,
  parsePlan,
  getPlanFeatures,
  PLAN_LABELS,
} from '../config/plans';
import { getDemoByTenantId, resolveTenantIdFromPath } from '../utils/demoRegistry';

interface PlanContextValue {
  plan: Plan;
  planLabel: string;
  features: PlanFeatures;
  tenantId: string;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tenantId = resolveTenantIdFromPath(window.location.pathname);
  const vertical = getDemoByTenantId(tenantId);
  const plan = vertical
    ? vertical.plan
    : tenantId === 'demo'
      ? 'premium'
      : parsePlan(import.meta.env.VITE_PLAN as string | undefined);

  const value = useMemo(
    () => ({
      plan,
      planLabel: PLAN_LABELS[plan],
      features: getPlanFeatures(plan),
      tenantId,
    }),
    [plan, tenantId],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used within PlanProvider');
  return ctx;
}
