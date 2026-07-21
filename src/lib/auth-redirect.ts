import type { AnyRouter } from "@tanstack/react-router";

/** Rota inicial do painel (visão geral em dashboard.index). */
export const DASHBOARD_HOME = "/dashboard" as const;

export async function redirectAfterAuth(router: AnyRouter): Promise<void> {
  await router.invalidate();
  await router.navigate({ to: DASHBOARD_HOME, replace: true });
}
