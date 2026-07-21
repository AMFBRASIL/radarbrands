import type { ComponentType } from "react";

import type { AuthContext } from "./auth-api";

export type RoutePermissionRule = {
  prefix: string;
  exact?: boolean;
  permission: string | string[] | null;
};

/** Rotas mais específicas primeiro (ordenadas por comprimento decrescente em runtime). */
export const ROUTE_PERMISSION_RULES: RoutePermissionRule[] = [
  { prefix: "/dashboard/profile", permission: null },
  { prefix: "/dashboard/onboarding", permission: null },
  { prefix: "/dashboard/pagamento", permission: ["billing.read", "billing.manage"] },
  {
    prefix: "/dashboard/settings",
    permission: ["team.manage", "integrations.manage", "billing.read", "billing.manage", "endpoints.manage"],
  },
  { prefix: "/dashboard/endpoints", permission: "endpoints.manage" },
  { prefix: "/dashboard/warroom", permission: "warroom.access" },
  { prefix: "/dashboard/threats", permission: "threats.read" },
  { prefix: "/dashboard/alerts", permission: "alerts.read" },
  { prefix: "/dashboard/legal", permission: "legal.read" },
  { prefix: "/dashboard/reports", permission: "reports.read" },
  { prefix: "/dashboard/ai", permission: "ai.use" },
  { prefix: "/dashboard/autopilot", permission: "ai.use" },
  { prefix: "/dashboard/playbooks", permission: "alerts.manage" },
  { prefix: "/dashboard/predict", permission: "threats.read" },
  { prefix: "/dashboard/deepfake", permission: "threats.read" },
  { prefix: "/dashboard/crisis", permission: "threats.read" },
  { prefix: "/dashboard/competitors", permission: "threats.read" },
  { prefix: "/dashboard/influencers", permission: "threats.read" },
  { prefix: "/dashboard/wrapped", permission: "reports.read" },
  { prefix: "/dashboard/roi", permission: "reports.read" },
  { prefix: "/dashboard/briefing", permission: "reports.read" },
  { prefix: "/dashboard/monitoring", permission: "brands.read" },
  { prefix: "/dashboard/domains", permission: "brands.read" },
  { prefix: "/dashboard/social", permission: "brands.read" },
  { prefix: "/dashboard/ads", permission: "brands.read" },
  { prefix: "/dashboard/marketplace", permission: "brands.read" },
  { prefix: "/dashboard/apps", permission: "brands.read" },
  { prefix: "/dashboard/darkweb", permission: "threats.read" },
  { prefix: "/dashboard/tv", permission: "brands.read" },
  { prefix: "/dashboard", exact: true, permission: "brands.read" },
];

export type NavItem = {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: string;
  permission?: string | string[] | null;
  keywords?: string;
  group?: string;
};

export function getUserPermissions(auth: AuthContext | null | undefined): string[] {
  return auth?.membership?.permissions ?? [];
}

export function hasAnyPermission(permissions: string[], required: string | string[] | null): boolean {
  if (required === null || required === undefined) return true;
  if (Array.isArray(required)) {
    return required.some((code) => permissions.includes(code));
  }
  return permissions.includes(required);
}

export function getRoutePermission(pathname: string): string | string[] | null {
  const normalized = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const rules = [...ROUTE_PERMISSION_RULES].sort((a, b) => b.prefix.length - a.prefix.length);

  for (const rule of rules) {
    const matches = rule.exact
      ? normalized === rule.prefix
      : normalized === rule.prefix || normalized.startsWith(`${rule.prefix}/`);
    if (matches) return rule.permission;
  }

  if (normalized.startsWith("/dashboard")) {
    return "brands.read";
  }

  return null;
}

export function canAccessRoute(pathname: string, permissions: string[]): boolean {
  return hasAnyPermission(permissions, getRoutePermission(pathname));
}

export function canAccessNavItem(item: Pick<NavItem, "url" | "permission">, permissions: string[]): boolean {
  const required = item.permission ?? getRoutePermission(item.url);
  return hasAnyPermission(permissions, required);
}

export function filterNavItems<T extends Pick<NavItem, "url" | "permission">>(
  items: T[],
  permissions: string[],
): T[] {
  return items.filter((item) => canAccessNavItem(item, permissions));
}

export function getFirstAccessibleDashboardPath(permissions: string[]): string {
  const candidates = [
    "/dashboard",
    "/dashboard/alerts",
    "/dashboard/threats",
    "/dashboard/reports",
    "/dashboard/legal",
    "/dashboard/onboarding",
    "/dashboard/profile",
  ];

  for (const path of candidates) {
    if (canAccessRoute(path, permissions)) return path;
  }

  return "/dashboard/profile";
}
