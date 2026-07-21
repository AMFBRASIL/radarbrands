import { prisma } from "../database";

const permissionCache = new Map<string, string[]>();

export async function getPermissionsForRole(roleId: number): Promise<string[]> {
  const cacheKey = String(roleId);
  const cached = permissionCache.get(cacheKey);
  if (cached) return cached;

  const rows = await prisma.rolePermission.findMany({
    where: { roleId },
    include: { permission: { select: { code: true } } },
  });

  const permissions = rows.map((row) => row.permission.code);
  permissionCache.set(cacheKey, permissions);
  return permissions;
}

export function clearPermissionCache(): void {
  permissionCache.clear();
}

export function hasPermission(permissions: string[], required: string): boolean {
  return permissions.includes(required);
}

export function hasAnyPermission(permissions: string[], required: string[]): boolean {
  return required.some((p) => permissions.includes(p));
}

export const PERMISSIONS = {
  brandsRead: "brands.read",
  brandsWrite: "brands.write",
  threatsRead: "threats.read",
  threatsWrite: "threats.write",
  alertsRead: "alerts.read",
  alertsManage: "alerts.manage",
  billingManage: "billing.manage",
  teamManage: "team.manage",
  integrationsManage: "integrations.manage",
  endpointsManage: "endpoints.manage",
  reportsRead: "reports.read",
  aiUse: "ai.use",
  warroomAccess: "warroom.access",
} as const;
