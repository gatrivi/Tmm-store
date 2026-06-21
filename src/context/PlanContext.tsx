/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import {
  type Plan,
  type PlanFeatures,
  parsePlan,
  getPlanFeatures,
  PLAN_LABELS,
} from '../config/plans';

interface PlanContextValue {
  plan: Plan;
  planLabel: string;
  features: PlanFeatures;
  tenantId: string;
}

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

function resolveTenantId(): string {
  const fromEnv = import.meta.env.VITE_TENANT_ID as string | undefined;
  if (fromEnv?.trim()) return fromEnv.trim();

  const slugMatch = window.location.pathname.match(/^\/s\/([^/]+)/);
  if (slugMatch?.[1]) return slugMatch[1];

  return 'default';
}

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const plan = parsePlan(import.meta.env.VITE_PLAN as string | undefined);
  const tenantId = resolveTenantId();

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
