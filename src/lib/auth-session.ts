import type { AnyRouter } from "@tanstack/react-router";

/** Recarrega auth + permissões do servidor e atualiza menu/guards do dashboard. */
export async function refreshDashboardAuth(router: AnyRouter): Promise<void> {
  await router.invalidate();
}
